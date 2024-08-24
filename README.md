# Project Title: Language Detection and Text-to-Speech Conversion

## Summary:

The Language Detection and Text-to-Speech (TTS) Conversion project is a web application built using Flask and React that allows users to input text, detect the language of the text, and convert it to speech in the detected language. The project utilizes a pre-trained language detection model to identify the language of the input text and the Google Text-to-Speech (gTTS) API to generate audio files from the text.

## Key Features:

Language Detection: Users can input text, and the application will detect the language of the input text using a pre-trained language detection model.
Text-to-Speech Conversion: Users can convert the input text into speech in the detected language. The application generates an audio file from the text using the gTTS API.
Real-time Updates: The application provides real-time updates of the detected language and the generated audio URL.
User Interface: The user interface is built using React, providing an intuitive and interactive experience for users.

## Technologies Used:

Flask: Backend web framework for handling HTTP requests and responses.
React: Frontend JavaScript library for building user interfaces.
Axios: HTTP client for making asynchronous requests from the frontend to the backend.
Google Text-to-Speech (gTTS) API: API for converting text into speech.
Cloudinary: Cloud storage platform used for hosting audio files.

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/the-Sunny-Sharma/ML_mini_project.git

   ```

2. Navigate to the project directory:

   cd project/server-flask

3. Create a virtual environment and activate it:

   python -m venv venv

   venv\Scripts\activate

4. Install dependencies:

   pip install -r requirements.txt

5. Navigate to the client directory and install client-side dependencies:

   cd client/polyglot-voice
   npm install

## Usage

1. Start the Flask backend:

   python server.py

The backend server will start running at http://localhost:5000.

2.  Start the React frontend:

    npm start

The React development server will start running at http://localhost:3000.

Open your web browser and visit http://localhost:3000 to access the application.

Live DEMO(Firebase): https://polyglot-voice.web.app/
Backend Deployed on Render : https://render.com/

## License

This project is licensed under the MIT License [LICENSE].
