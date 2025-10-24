from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
import os
from werkzeug.utils import secure_filename
import tempfile

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize EasyOCR reader (loads once at startup)
print("Loading EasyOCR model... This may take a moment on first run.")
reader = easyocr.Reader(['en'], gpu=False)  # Set gpu=True if you have CUDA
print("EasyOCR model loaded successfully!")

# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'tif', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
        
        # Perform OCR
        results = reader.readtext(temp_path, detail=0)
        extracted_text = " ".join(results)
        
        # Clean up temporary file
        os.remove(temp_path)
        
        return jsonify({
            'success': True,
            'text': extracted_text,
            'filename': filename
        })
    
    except Exception as e:
        return jsonify({'error': f'OCR processing failed: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'Server is running', 'model': 'EasyOCR'})

if __name__ == '__main__':
    print("\n" + "="*50)
    print("OCR Server Starting...")
    print("Server will run on: http://localhost:5000")
    print("="*50 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)

