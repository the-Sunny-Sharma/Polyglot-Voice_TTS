import React, { useState } from "react";
import "./Model.css";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Model() {
  const [input, setInput] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const handleInput = (e) => {
    setInput(e.target.value);
    // Clear audio URL when input changes
    setAudioUrl("");
    // Clear detected language when input changes
    setDetectedLanguage("");
  };

  const detectLanguage = async () => {
    setLoading(true); // Set loading to true when sending request
    const url = "http://localhost:5000/detect-language";
    try {
      const response = await axios.post(url, { text: input });
      console.log("Response:", response.data);
      setDetectedLanguage(response.data.detected_language);
    } catch (err) {
      console.log(err);
      notifyErr("Please check your internet connection.");
    } finally {
      setLoading(false); // Set loading to false after receiving response
    }
  };

  const convertToAudio = async () => {
    if (input.trim() === "") {
      return; // If input is empty or only contains whitespace, return
    }
    setLoading(true); // Set loading to true when sending request
    const convertToAudioUrl = "http://localhost:5000/get-audio";

    try {
      // Convert text to audio
      const convertToAudioResponse = await axios.post(convertToAudioUrl, {
        text: input,
      });
      console.log("Response:", convertToAudioResponse.data);
      setAudioUrl(convertToAudioResponse.data.audio_url);
      setDetectedLanguage(convertToAudioResponse.data.detected_language); // Set detected language
    } catch (err) {
      console.log(err);
      notifyErr("Please check your internet connection.");
    } finally {
      setLoading(false); // Set loading to false after receiving response
    }
  };

  const notifyErr = (msg) => {
    toast.error(msg, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };
  return (
    <>
      <Navbar />
      <div className="model-wrapper">
        <div className="row-1-conatiner">
          <div>
            <textarea
              className="input-frame"
              placeholder="Enter text"
              value={input}
              onChange={handleInput}
            />
          </div>
          <div className="btn_container">
            <button
              className={`btn_detect btn_com ${
                loading || input.trim() === "" ? "disabled" : ""
              }`}
              onClick={detectLanguage}
              disabled={loading || input.trim() === ""}
            >
              Detect Language
            </button>
            <button
              className={`btn_convert btn_com ${
                loading || input.trim() === "" ? "disabled" : ""
              }`}
              onClick={convertToAudio}
              disabled={loading || input.trim() === ""}
            >
              Convert to Audio
            </button>
          </div>
        </div>
        <div className="row_2_container">
          {detectedLanguage && (
            <p className="language">Detected Language: {detectedLanguage}</p>
          )}
          {audioUrl && (
            <div className="audio">
              <audio controls>
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          {loading && ( // Display overlay and spinner when loading
            <div className="overlay">
              <div className="spinner"></div>
            </div>
          )}
        </div>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </div>
    </>
  );
}
