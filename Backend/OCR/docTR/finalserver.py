from flask import Flask, request, jsonify
from flask_cors import CORS
from doctr.io import DocumentFile
from doctr.models import ocr_predictor
import os
import json
from werkzeug.utils import secure_filename
import tempfile
from dotenv import load_dotenv
from azure.ai.inference import ChatCompletionsClient
from azure.core.credentials import AzureKeyCredential

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize docTR OCR model (loads once at startup)
print("Loading docTR OCR model... This may take a moment on first run.")
model = ocr_predictor(det_arch='db_resnet50', reco_arch='crnn_vgg16_bn', pretrained=True)
print("docTR model loaded successfully!")

# Initialize Azure AI client
endpoint = "https://models.github.ai/inference"
token = os.getenv("API_KEY")

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token)
)

# System prompt for LLM
SYSTEM_PROMPT = '''
            Extract Name of Product_name,manufacturer_name,manufacture_date,expiry_date,shelf_life,batch_number from given text and return it in a json format.           
            Sample text :
                            Amul Taaza Homogenised Toned Milk  
                            Manufactured & Packed by: Gujarat Co-operative Milk Marketing Federation Ltd., Anand, India  
                            Batch No: A23M08    
                            Manufacture Date: 12/09/2025  
                            Best Before: 7 days from packaging  
                            Expiry Date: 19/09/2025
                            Net Volume: 1L

            out put should look like : {
                                            "product_name": "Amul Taaza Homogenised Toned Milk",
                                            "manufacturer_name": "Gujarat Co-operative Milk Marketing Federation Ltd.",
                                            "manufacture_date": "12-09-2025",
                                            "expiry_date": "19-09-2025",
                                            "shelf_life": "7 days from packaging",
                                            "batch_number": "A23M08"
                                        }                               
            If some info is missing in given input put the value as none in the json.
        '''

# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'tif', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_image_doctr(image_path):
    """
    Extracts text from an image using the docTR OCR library.
    
    Args:
        image_path (str): The path to the input image file.
    
    Returns:
        str: The extracted text from the image.
    """
    # Load the image as a DocumentFile object
    doc = DocumentFile.from_images(image_path)
    
    # Analyze the document and get the OCR result
    result = model(doc)
    
    # Render the extracted text
    extracted_text = result.render()
    
    return extracted_text

def process_with_llm(extracted_text):
    """
    Process the extracted text with Azure AI LLM.
    
    Args:
        extracted_text (str): The text extracted from OCR
    
    Returns:
        dict: Structured output from LLM
    """
    try:
        response = client.complete(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Extract structured information from this text:\n\n{extracted_text}"}
            ]
        )
        
        model_output = response.choices[0].message["content"]
        
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
        return {"error": f"LLM processing failed: {str(e)}"}

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
        print(extracted_text)

        # Step 2: Process with LLM
        llm_output = process_with_llm(extracted_text)
        print("LLM OUTPUT : /n")
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
        'llm_model': 'gpt-4o-mini'
    })

if __name__ == '__main__':
    print("\n" + "="*50)
    print("docTR + LLM OCR Server Starting...")
    print("Server will run on: http://localhost:5000")
    print("="*50 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)