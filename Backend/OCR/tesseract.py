import os,json
from flask import Flask, request, jsonify
from PIL import Image 
import pytesseract
from dotenv import load_dotenv
from azure.ai.inference import ChatCompletionsClient
from azure.core.credentials import AzureKeyCredential
from Prompts import prompt

# load_dotenv()
# app = Flask(__name__)

# endpoint = "https://models.github.ai/inference"
# token = os.getenv("API_KEY")

# client = ChatCompletionsClient(
#     endpoint=endpoint,
#     credential=AzureKeyCredential(token)
# )


img = Image.open('photos/4.jpg')
extracted_text = pytesseract.image_to_string(img)

# response = client.complete(
#     model="gpt-4o-mini",
#     messages=[
#                 {"role": "system", "content": "You are a helpful assistant that extracts structured JSON from certificates."},
#                 {"role": "user", "content": prompt + "\n\nHere is the text:\n" + extracted_text}
#             ]
#         )

# model_output = response.choices[0].message["content"]
# print(model_output)
# if model_output.startswith("```"):
#                 model_output = model_output.strip("```").replace("json", "").strip()


# try:
#             parsed_output = json.loads(model_output)
# except json.JSONDecodeError:
#             parsed_output = {"raw_output": model_output}

print("Extracted Text: \n")
print(extracted_text)

        
