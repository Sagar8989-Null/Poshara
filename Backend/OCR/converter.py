from PIL import Image
import os
import fitz  # PyMuPDF

def convert_to_jpg(folder_path):
    """Convert all images and PDFs in folder to JPG"""
    
    # Just change this path to your folder
    if not os.path.exists(folder_path):
        print(f"Folder not found: {folder_path}")
        return
    
    converted = 0
    
    for file in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file)
        
        # Handle PDFs
        if file.lower().endswith('.pdf'):
            try:
                pdf = fitz.open(file_path)
                for page_num in range(pdf.page_count):
                    page = pdf[page_num]
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x zoom for better quality
                    
                    # Create filename for each page
                    if pdf.page_count == 1:
                        new_name = file.rsplit('.', 1)[0] + '.jpg'
                    else:
                        new_name = file.rsplit('.', 1)[0] + f'_page_{page_num + 1}.jpg'
                    
                    jpg_path = os.path.join(folder_path, new_name)
                    pix.save(jpg_path)
                    print(f"✓ {file} page {page_num + 1} → {new_name}")
                
                pdf.close()
                
                # Delete original PDF
                
            except Exception as e:
                print(f"✗ Failed PDF: {file} - {e}")
        
        # Handle images
        elif file.lower().endswith(('.png', '.bmp', '.tiff', '.webp', '.gif')):
            try:
                # Open image
                img = Image.open(file_path)
                
                # Convert to RGB if needed
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Save as JPG
                new_name = file.rsplit('.', 1)[0] + '.jpg'
                jpg_path = os.path.join(folder_path, new_name)
                img.save(jpg_path, 'JPEG', quality=95)
                
                # Delete original file
                os.remove(file_path)
                
                print(f"✓ {file} → {new_name} (original deleted)")
                converted += 1
                
            except Exception as e:
                print(f"✗ Failed: {file}")
    
    print(f"\nDone! Converted {converted} files to JPG")

# CHANGE THIS PATH TO YOUR FOLDER
folder = r"C:\Users\sagar\Desktop\Codes\Projects\Authentech\OCR\Certificates"  # Windows
# folder = "/Users/YourName/Pictures"    # Mac
# folder = "/home/username/Pictures"     # Linux

# Run the converter
convert_to_jpg(folder)