"use client";

import { useState, useEffect } from "react";
import LogoSVG from "./LogoSVG";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (hidden) {
      window.dispatchEvent(new CustomEvent("app:loader-complete"));
    }
  }, [hidden]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setHidden(true), 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 3;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`loader ${hidden ? "loader--hidden" : ""}`}>
      <div className="loader__logo">
        <LogoSVG progress={progress} variant="light" />
      </div>
      <p className="loader__progress" style={{ position: 'absolute', bottom: '10%' }}>( {Math.min(progress, 100)}% )</p>
    </div>
  );
}
