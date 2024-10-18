from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
import time
import torch
from transformers import CLIPProcessor, CLIPModel, AutoTokenizer, AutoModelForSequenceClassification
from PIL import Image
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)

model = None
processor = None
text_model = None
tokenizer = None
loading_status = {"clip_model_loading": True, "text_model_loading": True}

def load_clip_model():
    global model, processor, loading_status
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    loading_status["clip_model_loading"] = False

def load_text_model():
    global text_model, tokenizer, loading_status
    tokenizer = AutoTokenizer.from_pretrained("roberta-base-openai-detector")
    text_model = AutoModelForSequenceClassification.from_pretrained("roberta-base-openai-detector")
    loading_status["text_model_loading"] = False

threading.Thread(target=load_clip_model).start()
threading.Thread(target=load_text_model).start()

def is_image_generated(image_path):
    image = Image.open(image_path)
    prompts = [
        "This is a computer-generated image",
        "This is a photo of a real human",
        "This image is a digitally created artwork",
        "This is a natural photograph",
        "This is an AI-generated face",
        "This is an AI-generated human",
        "This is a painting of a human"
    ]
    inputs = processor(text=prompts, images=image, return_tensors="pt", padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        logits_per_image = outputs.logits_per_image
        probabilities = logits_per_image.softmax(dim=1).cpu().numpy()[0]
    results = dict(zip(prompts, probabilities))
    most_likely_prompt = max(results, key=results.get)
    confidence = results[most_likely_prompt]
    return most_likely_prompt, confidence

def is_text_generated(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = text_model(**inputs)
        probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1).cpu().numpy()[0]
    is_generated = probabilities[1] > 0.5
    confidence = probabilities[1] if is_generated else probabilities[0]
    result = "AI-generated" if is_generated else "Human-written"
    return result, float(confidence)

@app.route('/detect-image', methods=['POST'])
def detect_image():
    try:
        if loading_status["clip_model_loading"]:
            return jsonify({'error': 'CLIP model is still loading. Please try again later.'}), 503
        
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400
        
        image = request.files['image']
        image_path = os.path.join('/tmp', image.filename)
        image.save(image_path)
        
        result, confidence = is_image_generated(image_path)
        confidence = float(confidence)
        
        return jsonify({
            'result': result,
            'confidence': confidence
        })

    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({'error': 'An error occurred while processing the image. Please try again later.'}), 500

@app.route('/detect-text', methods=['POST'])
def detect_text():
    try:
        if loading_status["text_model_loading"]:
            return jsonify({'error': 'Text model is still loading. Please try again later.'}), 503

        data = request.get_json()
        if 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        text = data['text']
        result, confidence = is_text_generated(text)
        
        return jsonify({
            'result': result,
            'confidence': confidence
        })

    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({'error': 'An error occurred while processing the text. Please try again later.'}), 500

@app.route('/health', methods=['GET'])
def health():
    try:
        status = {
            'clip_model_loading': 'loading' if loading_status["clip_model_loading"] else 'running',
            'text_model_status': 'loading' if loading_status["text_model_loading"] else 'running'
        }
        return jsonify(status), 200

    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({'error': 'An error occurred while checking backend status. Please try again later.'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5042)