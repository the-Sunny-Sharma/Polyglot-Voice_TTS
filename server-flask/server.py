from flask import Flask, request, jsonify
from flask_cors import CORS
from gtts import gTTS
import cloudinary.uploader
import cloudinary.api
import model
import datetime
from googletrans import Translator

app = Flask(__name__)
CORS(app)

cloudinary.config(
  cloud_name = 'ddcuy2czc',
  api_key = '856254798121153',
  api_secret = 'a2I6PflBowrz_fPqJkLFxnUSVtg'
)

language_mapping = {
    "Hindi": "hi",
    "Swedish": "sv",
    "French": "fr",
    "Estonian": "et",
    "Japanese": "ja",
    "Pushto": "ps",
    "Spanish": "es",
    "English": "en",
    "Latin": "la",
    "Persian": "fa",
    "Thai": "th",
    "Korean": "ko",
    "Indonesian": "id",
    "Urdu": "ur",
    "Portugese": "pt",
    "Russian": "ru",
    "Chinese": "zh",
    "Tamil": "ta",
    "Turkish": "tr",
    "Dutch": "nl",
    "Arabic": "ar",
    "Romanian": "ro"
}

# Directly import the model
trained_model = model

@app.route('/')
def myFunc():
    return "Hello World"

@app.route('/detect-language', methods=['POST'])
def detect_language():
    text = request.json['text']
    
    # Use the pre-trained model to detect the language
    detected_language = trained_model.detect_language(text)
    
    return jsonify({'detected_language': detected_language})

@app.route('/languages', methods=['GET'])
def get_languages():
    languages = model.get_languages()
    return jsonify({'languages': languages})

@app.route('/get-audio', methods=['POST'])
def convert_and_upload_audio():
    text = request.json['text']
    
    # Detect language
    detected_language = trained_model.detect_language(text)

    
    # Get the language code corresponding to the detected language
    lang_code = language_mapping.get(detected_language)
    
    # Check if the language is supported
    if lang_code is None:
        return jsonify({'error': 'Language not supported'}), 400
    
    # Convert text to speech using the appropriate language code
    tts = gTTS(text=text, lang=lang_code, slow=False)
    tts.save('output.wav')
    
    # Upload audio to Cloudinary
    audio_upload_response = cloudinary.uploader.upload('output.wav', resource_type='video')
    
    # Get the URL of the uploaded audio file
    audio_url = audio_upload_response['secure_url']

    # Set expiry time to 12 hours
    cloudinary.api.update(
        public_id=audio_upload_response['public_id'],
        type='upload',
        resource_type='video',
        expiration=datetime.datetime.now() + datetime.timedelta(hours=12)
    )
    
    return jsonify({'detected_language': detected_language, 'audio_url': audio_url})

@app.route('/translate', methods=['POST'])
def translate_and_get_audio():
    text = request.json['text']
    target_language = request.json['target_language']
    
    # Detect language
    detected_language = trained_model.detect_language(text)
    
    # Get the language code corresponding to the detected language
    lang_code_from = language_mapping.get(detected_language)
    lang_code_to = language_mapping.get(target_language)

    # Check if the languages are supported
    if lang_code_from is None or lang_code_to is None:
        return jsonify({'error': 'Language not supported'}), 400
    
    # Translate text
    translated_text = translate(text, lang_code_to)
    
    # Convert translated text to speech
    tts = gTTS(text=translated_text, lang=lang_code_to, slow=False)
    tts.save('translated_output.wav')
    
    # Upload translated audio to Cloudinary
    translated_audio_upload_response = cloudinary.uploader.upload('translated_output.wav', resource_type='video')
    translated_audio_url = translated_audio_upload_response['secure_url']

    # Set expiry time to 12 hours
    cloudinary.api.update(
        public_id=translated_audio_upload_response['public_id'],
        type='upload',
        resource_type='video',
        expiration=datetime.datetime.now() + datetime.timedelta(hours=12)
    )
    
    return jsonify({
        'detected_language': detected_language, 
        'translated_text': translated_text,
        'translated_audio_url': translated_audio_url
    })

def translate(text, target_language):
    translator = Translator()
    translation = translator.translate(text, dest=target_language)
    translated_text = translation.text
    print(translated_text)
    return translated_text


if __name__ == "__main__":
    app.run(debug=True)
