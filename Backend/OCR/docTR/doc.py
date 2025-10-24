from doctr.io import DocumentFile
from doctr.models import ocr_predictor

def extract_text_from_image_doctr(image_path):
    """
    Extracts text from an image using the docTR OCR library.

    Args:
        image_path (str): The path to the input image file.

    Returns:
        str: The extracted text from the image.
    """
    # Load the pre-trained OCR model
    # You can specify different architectures for detection (det_arch)
    # and recognition (reco_arch) if needed.
    model = ocr_predictor(det_arch='db_resnet50', reco_arch='crnn_vgg16_bn', pretrained=True)

    # Load the image as a DocumentFile object
    doc = DocumentFile.from_images(image_path)

    # Analyze the document and get the OCR result
    result = model(doc)

    # Render the extracted text
    extracted_text = result.render()

    return extracted_text

# Example usage:
if __name__ == "__main__":
   
    image_file = '../photos/11.jpg' 

    text = extract_text_from_image_doctr(image_file)
    print("Extracted Text:")
    print(text)

