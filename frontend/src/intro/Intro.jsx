
import React, { useEffect, useRef, useState } from "react";

const captions = [
  { at: 0, text: "SYSTEM ONLINE." },
  {
    at: 0.12,
    text: "WELCOME, VISITOR.\nYou are now entering Akshat's digital workspace.",
  },
  { at: 0.48, text: "INITIALIZING DEVELOPER PROFILE." },
  {
    at: 0.69,
    text: "ALL SYSTEMS ARE OPERATIONAL.\nWELCOME TO THE PORTFOLIO.",
  },
];

export default function Intro() {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const timersRef = useRef([]);
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState("flight");
  const [caption, setCaption] = useState("");
  const [audioBlocked, setAudioBlocked] = useState(false);

  function later(callback, delay) {
    const id = setTimeout(callback, delay);
    timersRef.current.push(id);
  }

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  async function startExperience() {
    if (started || !videoRef.current) return;

    try {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      await videoRef.current.play();
      setStarted(true);
    } catch {
      videoRef.current.muted = true;

      try {
        await videoRef.current.play();
        setStarted(true);
      } catch {
        setPhase("error");
      }
    }
  }

  function handleVideoEnd() {
    setPhase("black");

    // Let the screen go completely black before JARVIS speaks.
    later(async () => {
      const audio = audioRef.current;
      if (!audio) return;

      try {
        audio.currentTime = 0;
        await audio.play();
        setPhase("audio");
      } catch {
        setAudioBlocked(true);
      }
    }, 700);
  }

  function enableAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    audio.play()
      .then(() => {
        setAudioBlocked(false);
        setPhase("audio");
      })
      .catch(() => setAudioBlocked(true));
  }

  function handleAudioTimeUpdate() {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    const progress = audio.currentTime / audio.duration;
    let current = captions[0].text;

    for (const item of captions) {
      if (progress >= item.at) current = item.text;
    }

    setCaption(current);
  }

  function handleAudioEnd() {
    setCaption("AKSHAT SRIVASTAVA");
    setPhase("flash");

    later(() => {
      window.location.href = "/";
    }, 1100);
  }

  return (
    <main className={`stark-intro phase-${phase}`}>
      <audio
        ref={audioRef}
        src="/audio/jarvis-intro.mp3"
        preload="auto"
        onTimeUpdate={handleAudioTimeUpdate}
        onEnded={handleAudioEnd}
      />

      {phase === "flight" && (
        <video
          ref={videoRef}
          className="intro-landscape"
          src="/videos/mountain-river.mp4"
          playsInline
          preload="auto"
          onEnded={handleVideoEnd}
          onError={() => setPhase("error")}
        />
      )}

      {phase === "flight" && (
        <div className="intro-hud">
          <div className="intro-brand">STARK INDUSTRIES</div>
          <div className="intro-status">
            FLIGHT SEQUENCE READY
          </div>
          <button
  className="intro-skip"
  type="button"
  onClick={() => {
    window.location.href = "/";
  }}
>
  SKIP INTRO ↗
</button>

          {!started && (
            <button
              className="intro-start"
              onClick={startExperience}
            >
              INITIATE FLIGHT
            </button>
          )}

          <div className="intro-bottom">
            <span>J.A.R.V.I.S. // STANDBY</span>
            <span>FLIGHT SYSTEM: READY</span>
          </div>
        </div>
      )}

      {(phase === "black" || phase === "audio") && (
        <section className="intro-audio-screen">
          {phase === "audio" && (
            <>
              <div className="intro-audio-kicker">
                J.A.R.V.I.S. // VOICE INTERFACE
              </div>

              <div className="intro-audio-caption" aria-live="polite">
                {caption}
              </div>

              <div className="intro-audio-indicator">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </>
          )}

          {audioBlocked && (
            <button
              className="intro-start"
              onClick={enableAudio}
            >
              PLAY JARVIS AUDIO
            </button>
          )}
        </section>
      )}

      {phase === "flash" && (
        <div className="intro-hard-flash">
          <h1>AKSHAT SRIVASTAVA</h1>
        </div>
      )}

      {phase === "error" && (
        <div className="intro-error">
          <h2>VIDEO SIGNAL LOST</h2>
          <p>Check public/videos/mountain-river.mp4</p>
          <button
            className="intro-start"
            onClick={() => window.location.reload()}
          >
            RETRY
          </button>
        </div>
      )}
    </main>
  );
}
