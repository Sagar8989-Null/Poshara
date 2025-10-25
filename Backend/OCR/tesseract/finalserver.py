from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from werkzeug.utils import secure_filename
import tempfile
from dotenv import load_dotenv
from openai import OpenAI
from PIL import Image
import pytesseract

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Enable CORS for all API routes

# Initialize GitHub Models client
token = os.getenv("GITHUB_TOKEN")
endpoint = "https://models.github.ai/inference"
model_name = "openai/gpt-4o-mini"

# Check if API key is loaded
if not token:
    print("\n" + "="*50)
    print("WARNING: GITHUB_TOKEN not found in environment!")
    print("Please create a .env file with: GITHUB_TOKEN=your_token_here")
    print("="*50 + "\n")
    client = None
else:
    print(f"GitHub Token loaded: {token[:10]}...")
    client = OpenAI(
        base_url=endpoint,
        api_key=token,
    )

# System prompt for LLM
SYSTEM_PROMPT = SYSTEM_PROMPT = """
You are a document information extractor.
Only analyze the provided text content from documents in a neutral and safe way.
Your task is to identify factual fields like:
    • Type of document
    • Names of people or organizations
    • Relevant dates
    • Any key identifiers

Do not generate or add missing information.
Keep it professional and neutral.

Return the result strictly formatted as JSON."""


# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'tif', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_image_tesseract(image_path):
 
    try:
        # Open the image using PIL
        img = Image.open(image_path)
        
        # Convert to RGB if necessary (for PNG with transparency, etc.)
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        print("Starting orientation detection and correction...")
        
        # Try all 4 orientations and pick the best one based on confidence
        best_text = ""
        best_confidence = 0
        best_rotation = 0
        
        # for angle in [0, 90, 180, 270]:
        for angle in range(0,360,90):
            try:
                # Rotate image
                if angle == 0:
                    rotated_img = img
                else:
                    rotated_img = img.rotate(angle, expand=True, fillcolor='white')
                
                # Get text with confidence data
                data = pytesseract.image_to_data(rotated_img, output_type=pytesseract.Output.DICT)
                
                # Calculate average confidence (excluding -1 values which are empty)
                confidences = [int(conf) for conf in data['conf'] if int(conf) > 0]
                
                if not confidences:
                    continue
                
                avg_confidence = sum(confidences) / len(confidences)
                
                # Get the text
                text = pytesseract.image_to_string(rotated_img).strip()
                text_length = len(text.replace(' ', '').replace('\n', ''))
                
                # Score based on confidence and text length (prefer more text)
                score = avg_confidence * (1 + text_length / 1000)
                
                print(f"Angle {angle}°: Confidence={avg_confidence:.2f}%, Text Length={text_length}, Score={score:.2f}")
                
                # Pick the rotation with highest score and non-empty text
                if score > best_confidence and text_length > 0:
                    best_confidence = score
                    best_text = text
                    best_rotation = angle
                    
            except Exception as angle_error:
                print(f"Error processing angle {angle}°: {str(angle_error)}")
                continue
        
        if best_rotation != 0:
            print(f"✓ Best orientation: {best_rotation}° rotation (score: {best_confidence:.2f})")
        else:
            print(f"✓ Original orientation is best (score: {best_confidence:.2f})")
        
        if not best_text:
            print("Warning: No text detected in any orientation. Trying original image...")
            best_text = pytesseract.image_to_string(img)
        
        return best_text.strip()
        
    except Exception as e:
        raise Exception(f"Tesseract OCR failed: {str(e)}")

def process_with_llm(extracted_text):

    # Check if client is initialized
    if client is None:
        return {"error": "GITHUB_TOKEN not configured. Please add GITHUB_TOKEN to .env file"}
    
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Please analyze this document text and extract factual structured details only:{extracted_text}"}
            ],
            temperature=0.0,
            top_p=1.0,
            max_tokens=1000,
            model=model_name
        )
        
        model_output = response.choices[0].message.content
        
        # Clean up markdown code blocks if present
        if model_output.startswith("```"):
            model_output = model_output.strip("```").replace("json", "").strip()
        
        # Try to parse as JSON
        try:
            parsed_output = json.loads(model_output)
        except json.JSONDecodeError:
            parsed_output = {"raw_output": model_output}
        
        return parsed_output
    
    except Exception as e:
        error_msg = str(e)
        if "Unauthorized" in error_msg or "401" in error_msg:
            return {"error": "Invalid GitHub Token. Please check your GITHUB_TOKEN in .env file"}
        return {"error": f"LLM processing failed: {error_msg}"}

@app.route('/api/ocr', methods=['POST', 'OPTIONS'])
def extract_text():
    # Handle preflight request
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
    
    # Check if image file is present in request
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    
    # Check if file is selected
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Check if file type is allowed
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Supported formats: PNG, JPG, GIF, BMP, TIFF, WebP'}), 400
    
    temp_path = None
    try:
        # Save file temporarily
        filename = secure_filename(file.filename)
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, filename)
        file.save(temp_path)
        
        # Step 1: Perform OCR using Tesseract
        extracted_text = extract_text_from_image_tesseract(temp_path)
        print("Extracted Text:")
        print(extracted_text)
        
        # Step 2: Process with LLM
        llm_output = process_with_llm(extracted_text)
        print("LLM Output:")
        print(llm_output)

        # Clean up temporary file
        os.remove(temp_path)
        
        return jsonify({
            'success': True,
            'extracted_text': extracted_text,
            'llm_output': llm_output,
            'filename': filename
        })
    
    except Exception as e:
        # Clean up temporary file if it exists
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({'error': f'Processing failed: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'Server is running', 
        'ocr_model': 'Tesseract',
        'llm_model': 'openai/gpt-4o-mini'
    })

if __name__ == '__main__':
    print("\n" + "="*50)
    print("Tesseract + GitHub Models OCR Server Starting...")
    print("Server will run on: http://localhost:5000")
    print("="*50 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)
