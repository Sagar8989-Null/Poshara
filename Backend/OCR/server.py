import os,json
from flask import Flask, request, jsonify
from PIL import Image 
import pytesseract
from dotenv import load_dotenv
from azure.ai.inference import ChatCompletionsClient
from azure.core.credentials import AzureKeyCredential
from Prompts import prompt

load_dotenv()
app = Flask(__name__)

endpoint = "https://models.github.ai/inference"
token = os.getenv("API_KEY")

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token)
)


@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    try:
        file = request.files['image']
        # img = Image.open(file.stream)
        img = Image.open('Certificates/Implementation and Testing_____Coursera.jpg')

        extracted_text = pytesseract.image_to_string(img)

        # Send request
        response = client.complete(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that extracts structured JSON from certificates."},
                {"role": "user", "content": prompt + "\n\nHere is the text:\n" + extracted_text}
            ]
        )

        model_output = response.choices[0].message["content"]
        print(model_output)
        if model_output.startswith("```"):
                model_output = model_output.strip("```").replace("json", "").strip()


        try:
            parsed_output = json.loads(model_output)
        except json.JSONDecodeError:
            parsed_output = {"raw_output": model_output}

        return jsonify({
                "extracted_text": extracted_text,
                "model_output": parsed_output
            })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True) 