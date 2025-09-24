from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
import os

# Only needed for local Windows dev, remove or guard it for Linux servers
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Flask server is running!"

@app.route('/ocr', methods=['POST'])
def ocr():
    if 'image' not in request.files:
        return jsonify({'text': 'No image uploaded'})
    
    file = request.files['image']
    image = Image.open(file.stream)
    text = pytesseract.image_to_string(image)
    return jsonify({'text': text})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Render/Heroku will set PORT
    app.run(host="0.0.0.0", port=port)
