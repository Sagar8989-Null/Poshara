import os
import easyocr

# Initialize EasyOCR reader (English only)
reader = easyocr.Reader(['en'])

# Path to the image
image_path = '../photos/13.jpg'

# Run OCR
results = reader.readtext(image_path, detail=0)  # detail=0 returns only text
extracted_text = " ".join(results)

print("Extracted Text:")
print(extracted_text)
