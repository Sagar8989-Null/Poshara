import React, { useState } from 'react';
import { Upload, FileText, Loader2, X } from 'lucide-react';

export default function OCRImageExtractor() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setSelectedImage(file);
      setError('');
      setExtractedText('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtractText = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('http://localhost:5000/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process image');
      }

      const data = await response.json();
      setExtractedText(data.text || 'No text found in image');
    } catch (err) {
      setError('Error: ' + err.message + '. Make sure the Flask server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setExtractedText('');
    setError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setError('');
      setExtractedText('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">OCR Text Extractor</h1>
          <p className="text-gray-600">Upload any image to extract text using EasyOCR</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Upload Area */}
          {!imagePreview ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-indigo-500 transition-colors cursor-pointer"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-700 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPG, PNG, BMP, TIFF, WebP, GIF
                </p>
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-96 object-contain rounded-lg border-2 border-gray-200"
                />
                <button
                  onClick={handleReset}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Extract Button */}
              <button
                onClick={handleExtractText}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Extract Text
                  </>
                )}
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Extracted Text */}
          {extractedText && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Extracted Text:
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-32 max-h-96 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap">{extractedText}</p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(extractedText)}
                className="mt-3 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-3">Backend Setup Instructions:</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>1. Install required packages:</p>
            <code className="block bg-gray-100 p-2 rounded">pip install flask flask-cors easyocr</code>
            <p>2. Save the Flask server code (see below) as <code>server.py</code></p>
            <p>3. Run the server:</p>
            <code className="block bg-gray-100 p-2 rounded">python server.py</code>
          </div>
        </div>
      </div>
    </div>
  );
}


