from flask import Flask, request, jsonify
from flask_cors import CORS
from doctr.io import DocumentFile
from doctr.models import ocr_predictor
import os
import json
from werkzeug.utils import secure_filename
import tempfile
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = Flask(__name__)
# CORS(app)  # Enable CORS for React frontend
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Enable CORS for all API routes

# Initialize docTR OCR model (loads once at startup)
print("Loading docTR OCR model... This may take a moment on first run.")
model = ocr_predictor(det_arch='db_resnet50', reco_arch='crnn_vgg16_bn', pretrained=True)
print("docTR model loaded successfully!")

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
SYSTEM_PROMPT = """You are a helpful assistant that extracts structured information from documents and certificates.
Extract key information like:
- Document type
- Names
- Dates
- Organizations
- Key details

Return the response as a clean JSON object."""

# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'tif', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_image_doctr(image_path):
  
    # Load the image as a DocumentFile object
    doc = DocumentFile.from_images(image_path)
    
    # Analyze the document and get the OCR result
    result = model(doc)
    
    # Render the extracted text
    extracted_text = result.render()
    
    return extracted_text

def process_with_llm(extracted_text):

    # Check if client is initialized
    if client is None:
        return {"error": "GITHUB_TOKEN not configured. Please add GITHUB_TOKEN to .env file"}
    
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Extract structured information from this text:\n\n{extracted_text}"}
            ],
            temperature=1.0,
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

@app.route('/api/ocr', methods=['POST'])
def extract_text():
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
        
        # Step 1: Perform OCR using docTR
        extracted_text = extract_text_from_image_doctr(temp_path)
        print(extract_text)
        
        # Step 2: Process with LLM
        llm_output = process_with_llm(extracted_text)
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
        'ocr_model': 'docTR',
        'llm_model': 'openai/gpt-4o-mini'
    })

if __name__ == '__main__':
    print("\n" + "="*50)
    print("docTR + GitHub Models OCR Server Starting...")
    print("Server will run on: http://localhost:5000")
    print("="*50 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)