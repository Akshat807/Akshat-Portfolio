
import React from "react";
import { createRoot } from "react-dom/client";
import Intro from "./Intro";
import "./Intro.css";

createRoot(document.getElementById("intro-root")).render(
  <React.StrictMode>
    <Intro />
  </React.StrictMode>
);
