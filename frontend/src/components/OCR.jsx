import React, { useState } from 'react';
import './OCR.css';

const OCRImageExtractor = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [llmOutput, setLlmOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setSelectedImage(file);
      setError('');
      setExtractedText('');
      setLlmOutput(null);

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
      setExtractedText(data.extracted_text || 'No text found in image');
      setLlmOutput(data.llm_output || null);
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
    setLlmOutput(null);
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
      setLlmOutput(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderLLMOutput = () => {
    if (!llmOutput) return null;

    if (llmOutput.error) {
      return (
        <div className="error-box">
          {llmOutput.error}
        </div>
      );
    }

    return (
      <div className="llm-output">
        <pre className="json-output">
          {JSON.stringify(llmOutput, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="ocr-container">
      <div className="ocr-wrapper">
        <div className="ocr-header">
          <h1 className="ocr-title">AI-Powered OCR Extractor</h1>
          <p className="ocr-subtitle">Upload any image to extract and analyze text with AI</p>
        </div>

        <div className="ocr-card">
          {!imagePreview ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="upload-area"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="file-input"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-label">
                <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="upload-text">
                  Click to upload or drag and drop
                </p>
                <p className="upload-subtext">
                  Supports JPG, PNG, BMP, TIFF, WebP, GIF
                </p>
              </label>
            </div>
          ) : (
            <div className="preview-section">
              <div className="image-preview-wrapper">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
                <button
                  onClick={handleReset}
                  className="reset-button"
                  title="Remove image"
                >
                  <svg className="reset-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <button
                onClick={handleExtractText}
                disabled={loading}
                className={`extract-button ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="spinner" fill="none" viewBox="0 0 24 24">
                      <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing with AI...
                  </>
                ) : (
                  <>
                    <svg className="extract-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Extract & Analyze with AI
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="error-alert">
              <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {(extractedText || llmOutput) && (
            <div className="results-section">
              {extractedText && (
                <div className="result-block">
                  <div className="result-header">
                    <h2 className="result-title">
                      <svg className="result-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Extracted Text (OCR)
                    </h2>
                    <button
                      onClick={() => copyToClipboard(extractedText)}
                      className="copy-button"
                      title="Copy to clipboard"
                    >
                      <svg className="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </button>
                  </div>
                  <div className="text-output">
                    <p className="text-content">{extractedText}</p>
                  </div>
                </div>
              )}

              {llmOutput && (
                <div className="result-block">
                  <div className="result-header">
                    <h2 className="result-title">
                      <svg className="result-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      AI Analysis (Structured Data)
                    </h2>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(llmOutput, null, 2))}
                      className="copy-button"
                      title="Copy JSON"
                    >
                      <svg className="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy JSON
                    </button>
                  </div>
                  {renderLLMOutput()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OCRImageExtractor;