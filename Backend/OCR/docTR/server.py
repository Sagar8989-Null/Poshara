from flask import Flask, request, jsonify
from flask_cors import CORS
from doctr.io import DocumentFile
from doctr.models import ocr_predictor
import os
from werkzeug.utils import secure_filename
import tempfile

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize docTR OCR model (loads once at startup)
print("Loading docTR OCR model... This may take a moment on first run.")
model = ocr_predictor(det_arch='db_resnet50', reco_arch='crnn_vgg16_bn', pretrained=True)
print("docTR model loaded successfully!")

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
    
    try:
        # Save file temporarily
        filename = secure_filename(file.filename)
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, filename)
        file.save(temp_path)
        
        # Perform OCR using docTR
        extracted_text = extract_text_from_image_doctr(temp_path)
        
        # Clean up temporary file
        os.remove(temp_path)
        
        return jsonify({
            'success': True,
            'text': extracted_text,
            'filename': filename
        })
    
    except Exception as e:
        # Clean up temporary file if it exists
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({'error': f'OCR processing failed: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'Server is running', 'model': 'docTR'})

if __name__ == '__main__':
    print("\n" + "="*50)
    print("docTR OCR Server Starting...")
    print("Server will run on: http://localhost:5000")
    print("="*50 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)