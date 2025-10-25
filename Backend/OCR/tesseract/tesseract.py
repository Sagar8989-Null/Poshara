from PIL import Image 
import pytesseract

img = Image.open('../photos/13.jpg')
extracted_text = pytesseract.image_to_string(img)

print("Extracted Text: \n")
print(extracted_text)

        