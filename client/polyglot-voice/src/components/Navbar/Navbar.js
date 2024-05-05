import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const [isPlus, setPlus] = useState(false);
  useEffect(() => {
    if (location.pathname === "/polyglotplus") {
      setPlus(true);
      return;
    }
  }, [location]);
  return (
    <>
      <nav className="navbar">
        {isPlus ? (
          <>
            <div className="flex-left">
              <Link className="logo" to="/">
                PolyglotVoice<span className="orange">+</span>
              </Link>
            </div>
            <div className="flex-right">
              {/* <Link className="login" to="/">PolyglotVoice</Link> */}
              {/* <Link className="signUp" to="/">PolyglotVoice</Link> */}
              <div className="poly_box shine_effect">
                <Link className="poly_glot shine_effect" to="/">
                  Explore PolyglotVoice
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex-left">
              <Link className="logo" to="/">
                PolyglotVoice
              </Link>
            </div>
            <div className="flex-right">
              <div className="poly_box shine_effect">
                <Link className="poly_plus shine_effect" to="/polyglotplus">
                  Try PolyglotVoice+
                </Link>
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  );
}
