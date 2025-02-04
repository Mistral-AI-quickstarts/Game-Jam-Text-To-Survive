from flask import Flask, request, jsonify, render_template, send_from_directory
import requests
import os
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for development

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/mistral-proxy', methods=['POST'])
def proxy_to_mistral():
    MISTRAL_API_KEY = os.getenv('MISTRAL_API_KEY')
    MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"
    
    if not MISTRAL_API_KEY:
        logger.error("MISTRAL_API_KEY not configured")
        return jsonify({"error": "MISTRAL_API_KEY not configured"}), 500
    
    headers = {
        'Authorization': f'Bearer {MISTRAL_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Log incoming request (excluding sensitive data)
        logger.info(f"Received request for Mistral API")
        
        response = requests.post(MISTRAL_API_URL, 
                               headers=headers,
                               json=request.json)
        
        # Check if the response was successful
        response.raise_for_status()
        
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        logger.error(f"Error calling Mistral API: {str(e)}")
        return jsonify({"error": f"Error calling Mistral API: {str(e)}"}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Serve static files
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

# Add this if you want to serve other static files
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7860) 