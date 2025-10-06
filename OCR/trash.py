from PIL import Image
import os
import pytesseract

folder = r"C:\Users\sagar\Desktop\Codes\Projects\Authentech\OCR\Certificates"
No_of_images = [] 

for file in os.listdir(folder):
    if file.lower() not in No_of_images:
        # print(file)
        No_of_images.append(file)

# print(No_of_images)

def convert_to_jpg(folder_path):
    """Convert all images in folder to JPG"""
    
    # Just change this path to your folder
    if not os.path.exists(folder_path):
        print(f"Folder not found: {folder_path}")
        return
    
    converted = 0
    
    for file in os.listdir(folder_path):
        if file.lower().endswith(('.png', '.bmp', '.tiff', '.webp', '.gif','.avif')):
            try:
                # Open image
                img_path = os.path.join(folder_path, file)
                img = Image.open(img_path)
                
                # Convert to RGB if needed
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Save as JPG
                new_name = file.rsplit('.', 1)[0] + '.jpg'
                jpg_path = os.path.join(folder_path, new_name)
                img.save(jpg_path, 'JPEG', quality=100)
                
                os.remove(img_path)
                
                print(f"✓ {file} → {new_name}")
                converted += 1
                
            except Exception as e:
                print(f"✗ Failed: {file}")
    
    print(f"\nDone! Converted {converted} images to JPG")


convert_to_jpg(folder)


image_path = f'Certificates/Implementation and Testing_____Coursera.jpg'  
text = pytesseract.image_to_string(Image.open(image_path))
print(text)

