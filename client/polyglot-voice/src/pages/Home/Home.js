import React from "react";
import { TypeAnimation } from "react-type-animation";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="container">
        <TypeAnimation
          sequence={[
            "Welcome to PolyglotVoice - Your Multilingual Text-to-Speech Companion!",
            2000, // wait 2s before displaying the next message
            "Convert text into spoken words in any language!",
            2000,
            "Simply type your text and hear it come to life!",
            2000,
            "Explore the power of language with PolyglotVoice today!",
            2000,
          ]}
          wrapper="div"
          speed={50}
          style={{
            fontSize: "1.8em",
            textAlign: "center",
            margin: "20px auto",
          }}
          repeat={Infinity}
        />
      </div>
      <div className="my-custom-container">
        <button className="btn-start" onClick={() => navigate("/model")}>
          Get Started
        </button>
      </div>
    </>
  );
}
