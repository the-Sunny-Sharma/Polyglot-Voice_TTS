import React, { useState, useEffect, useRef } from "react"; // Import useRef
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import "./MainPage.css";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MainPage() {
  const [input, setInput] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [translatedText, setTranslatedText] = useState(""); // Add state for translated text
  const [translatedAudioUrl, setTranslatedAudioUrl] = useState(""); // Add state for translated audio URL
  const [loading, setLoading] = useState(false); // Add loading state
  const [audioPlaying, setAudioPlaying] = useState(false); // Add state to track if audio is playing

  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("English"); // Default to English
  const audioRef = useRef(null); // Define audioRef using useRef

  // Fetch languages on component mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/languages")
      .then((response) => {
        setLanguages(response.data.languages);
        // Optionally, ensure English is among the fetched languages and set it as selected
        if (response.data.languages.includes("English")) {
          setSelectedLanguage("English");
        }
      })
      .catch((error) => {
        notifyErr("Please check your internet connection.");
        console.log("Error", error);
      });
  }, []);

  useEffect(() => {
    setTranslatedText(""); // Clear translated text
    setTranslatedAudioUrl(""); // Clear translated audio URL
  }, [input]); // Reset whenever input changes

  const translate = async () => {
    console.log(selectedLanguage);
    if (input.trim() === "") {
      return; // If input is empty or only contains whitespace, return
    }
    setLoading(true); // Set loading to true when sending request
    const convertToAudioUrl = "http://localhost:5000/translate";

    try {
      // Convert text to audio
      const convertToAudioResponse = await axios.post(convertToAudioUrl, {
        text: input,
        target_language: selectedLanguage, // Pass selectedLanguage as target_language
      });
      console.log("Response:", convertToAudioResponse.data);
      setTranslatedText(convertToAudioResponse.data.translated_text); // Set translated text
      setTranslatedAudioUrl(convertToAudioResponse.data.translated_audio_url); // Set translated audio URL
      setDetectedLanguage(convertToAudioResponse.data.detected_language);
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

  const toggleAudio = () => {
    if (audioPlaying) {
      audioRef.current.pause(); // Pause audio if currently playing
    } else {
      audioRef.current.play(); // Play audio if currently paused
    }
    setAudioPlaying(!audioPlaying); // Toggle audio playing state
  };
  return (
    <>
      <Navbar />
      <div className="select-box">
        <div className="select-box__current" tabIndex="1">
          {languages.map((language, index) => (
            <div className="select-box__value" key={index}>
              <input
                className="select-box__input"
                type="radio"
                id={index.toString()}
                value={language} // Changed to language instead of index
                name="language"
                checked={selectedLanguage === language} // Control checked state
                onChange={() => setSelectedLanguage(language)} // Update state on change
              />
              <p className="select-box__input-text">{language}</p>
            </div>
          ))}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#fff"
            className="icon select-box__icon"
            viewBox="0 0 1024 1024"
          >
            <path d="M903.232 256L960 306.432 512 768 64 306.432 120.768 256 512 659.072z"></path>
          </svg>
        </div>
        <ul className="select-box__list">
          {languages.map((language, index) => (
            <li key={index}>
              <label
                className="select-box__option"
                htmlFor={index.toString()}
                aria-hidden="true"
              >
                {language}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className="main_pg_wrapper">
        <div className="left-container">
          {detectedLanguage ? (
            <p>Detected language : {detectedLanguage}</p>
          ) : (
            <p>Auto Detection</p>
          )}
          <textarea
            className="input-frame text_frame"
            placeholder="Enter text"
            value={input}
            onChange={(e) => setInput(e.target.value)} // Update input value
          />
        </div>
        <div className="mid-container">
          <button
            className="convert_btn"
            onClick={translate}
            disabled={loading || input.trim() === ""} // Disable button when loading or input is empty
          >
            {loading ? (
              <div className="spinner"></div> // Show spinner when loading
            ) : (
              <svg
                fill="#000000"
                height="42"
                width="42"
                viewBox="0 0 24 24"
                id="exchange"
                data-name="Flat Line"
                xmlns="http://www.w3.org/2000/svg"
                className="icon flat-line"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  <polyline
                    id="primary"
                    points="7 17 4 14 20 14"
                    style={{
                      fill: "none",
                      stroke: "#ff4533",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                    }}
                  />
                  <polyline
                    id="primary-2"
                    data-name="primary"
                    points="17 7 20 10 4 10"
                    style={{
                      fill: "none",
                      stroke: "#ff4533",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                    }}
                  />
                </g>
              </svg>
            )}
          </button>
        </div>
        <div className="right-container">
          <div className="input-frame text_frame converted_text">
            {translatedText && <p>{translatedText}</p>}{" "}
          </div>
          <div className="audio">
            <svg
              className="audio_btn"
              height="42"
              width="42"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              onClick={toggleAudio} // Call toggleAudio function on click
            >
              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g id="SVGRepo_iconCarrier">
                <style>{".st6{fill:#ff4533}"}</style>
                <g id="ICONS">
                  <path
                    className="st6"
                    d="M545.8 294.7L363.7 431.5c-1.2.9-2 2.1-2.7 3.3H256v154.5h105c.7 1.2 1.6 2.4 2.7 3.3l182.1 136.7c7.2 5.4 17.5.3 17.5-8.7V303.5c0-9-10.3-14.2-17.5-8.8zM668 691.7c-8.8 0-17.4-4.5-22.2-12.7-7.1-12.2-3-27.9 9.2-35 2.4-1.4 61.7-38.4 61.7-132 0-95-61.1-131.6-61.7-132-12.2-7.1-16.3-22.8-9.2-35 7.1-12.2 22.8-16.3 35-9.2 3.7 2 87.2 52.2 87.2 176.2s-83.5 174.2-87.1 176.2c-4.1 2.4-8.5 3.5-12.9 3.5z"
                  />
                  <path
                    className="st6"
                    d="M613.2 621.2c-8.8 0-17.4-4.5-22.1-12.7-7.1-12.2-3-27.9 9.2-35 .7-.4 24.6-16 24.6-55.1s-23.9-54.7-25-55.4c-11.8-7.4-15.7-23.1-8.4-35 7.2-12 22.5-16 34.6-9 2 1.2 50 29.9 50 99.4s-48 98.2-50 99.4c-4.1 2.3-8.5 3.4-12.9 3.4z"
                  />
                </g>
              </g>
            </svg>
            {translatedAudioUrl && (
              <audio
                ref={audioRef} // Ref to audio element
                src={translatedAudioUrl}
                onPause={() => setAudioPlaying(false)} // Set audioPlaying state to false when audio is paused
                onPlay={() => setAudioPlaying(true)} // Set audioPlaying state to true when audio starts playing
              />
            )}
          </div>
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
