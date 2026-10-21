
import { useEffect, useRef, useState } from "react";

import {
  Activity,
  ArrowDown,
  Bot,
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  Mail,
  MapPin,
  Mic,
  Power,
  Radio,
  ShieldCheck,
  Star,
  Terminal,
  Users,
  Volume2,
  Zap,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { motion } from "framer-motion";
import "./App.css";

const projects = [
  {
    number: "01",
    name: "CivicPulse AI",
    category: "AI / FULL STACK",
    description:
      "A civic-tech application focused on helping manage citizen complaints and making civic issue tracking more organized. See the repository for implementation details.",
    stack: ["Python", "Flask", "Machine Learning", "SQLite"],
    link: "https://github.com/Akshat807/CivicPulseAI",
    owner: "Akshat807",
  },
  {
    number: "02",
    name: "My Portfolio",
    category: "WEB DEVELOPMENT",
    description:
      "A personal developer portfolio built to present projects, technical skills, and professional information in one place.",
    stack: ["React", "JavaScript", "CSS"],
    link: "https://github.com/Akshat807/My-Portfolio",
    owner: "Akshat807",
  },
  {
    number: "03",
    name: "STUDY-LINK",
    category: "EDTECH / WEB",
    description:
      "A student-focused learning platform concept for bringing study resources and academic support into one place. Check the repository for the implemented features.",
    stack: ["TypeScript", "React", "REST APIs"],
    link: "https://github.com/Akshat807/STUDY-LINK",
    owner: "Akshat807",
  },
  {
    number: "04",
    name: "Akshat807",
    category: "DEVELOPMENT",
    description:
      "Your GitHub profile repository. This card links directly to the repository so visitors can inspect its code and purpose.",
    stack: ["GitHub", "Development"],
    link: "https://github.com/Akshat807/Akshat807",
    owner: "Akshat807",
  },
  {
    number: "05",
    name: "Smart-utility",
    category: "COLLABORATION",
    description:
      "A utility-focused web project for organizing common utility or community-management tasks. The repository contains the implementation details.",
    stack: ["React", "JavaScript", "Node.js"],
    link: "https://github.com/Adarshrajshrivastva/Smart-utility",
    owner: "Adarshrajshrivastava",
  },
  {
    number: "06",
    name: "Arogayadoot",
    category: "COLLABORATION",
    description:
      "A healthcare discovery platform concept intended to help people find doctors and hospitals and explore care options. Check the repository for current functionality.",
    stack: ["React", "JavaScript", "HTML", "CSS"],
    link: "https://github.com/Adarshrajshrivastva/Arogayadoot",
    owner: "Adarshrajshrivastava",
  },
];

const skills = [
  {
    group: "LANGUAGES",
    items: ["Python", "Java", "JavaScript", "TypeScript", "C++"],
  },
  {
    group: "FRONTEND",
    items: ["React", "HTML", "CSS", "Bootstrap"],
  },
  {
    group: "BACKEND",
    items: ["Flask", "Node.js", "Express.js"],
  },
  {
    group: "DATABASE",
    items: ["SQLite", "MongoDB", "MySQL"],
  },
  {
    group: "TOOLS & CLOUD",
    items: ["Git", "GitHub", "VS Code", "Docker"],
  },
  {
    group: "AI / ML",
    items: ["LLMs", "RAG", "AI Agents"],
  },
];

function App() {
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: "Hello, sir! I am JARVIS. How can I assist you today?",
    },
  ]);

  const [time, setTime] = useState(new Date());
  const [jarvisActive, setJarvisActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState(
    "All interface systems are standing by, sir."
  );

  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    return () => {
      clearInterval(timer);
      window.speechSynthesis?.cancel();
      recognitionRef.current?.abort();
      audioRef.current?.pause();
    };
const getJarvisVoice = (text) => {
  const voices = window.speechSynthesis.getVoices();

  // Agar text Devanagari Hindi mein hai, Hindi voice prefer karo.
  const hasHindiScript = /[\u0900-\u097F]/.test(text);

  const preferredLanguages = hasHindiScript
    ? ["hi-IN", "hi"]
    : ["en-IN", "en-GB", "en-US"];

  for (const lang of preferredLanguages) {
    const voice = voices.find(
      (v) => v.lang.toLowerCase() === lang.toLowerCase()
    );

    if (voice) return voice;
  }

  return voices.find((v) => v.default) || voices[0] || null;
};

  }, []);
  // JARVIS speaks a response using the browser's speech engine.
function getJarvisVoice() {
  const voices = window.speechSynthesis.getVoices();

  return (
    voices.find((v) => v.name.includes("Microsoft Ravi")) ||
    voices.find((v) => v.name.includes("Google UK English Male")) ||
    voices.find((v) => v.name.includes("Microsoft David")) ||
    voices.find((v) => v.lang === "en-IN") ||
    voices[0] ||
    null
  );
}

function speakJarvis(text) {
  setMessage(text);
  setJarvisActive(false);
}




  // Voice input: send spoken questions to the same Gemini backend as text chat.
  function listenToJarvis() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessage(
        "Voice recognition is not supported in this browser. Please try Google Chrome."
      );
      return;
    }

    if (isChatLoading) {
      setMessage(
        "Please wait, sir. JARVIS is processing your last request."
      );
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    window.speechSynthesis?.cancel();

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setJarvisActive(true);
      setMessage("Listening, sir. Ask me anything.");
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.trim();

      if (!transcript) return;

      const command = transcript.toLowerCase();
      setChatOpen(true);

      if (
        command === "stop" ||
        command.includes("stop speaking") ||
        command.includes("be quiet")
      ) {
        window.speechSynthesis?.cancel();
        setJarvisActive(false);
        setMessage("Understood, sir.");

        setChatMessages((previous) => [
          ...previous,
          { role: "user", text: transcript },
          { role: "assistant", text: "Understood, sir." },
        ]);

        return;
      }

      let target = "";

      if (command.includes("project")) {
        target = "projects";
      } else if (
        command.includes("skill") ||
        command.includes("tech stack") ||
        command.includes("technologies")
      ) {
        target = "skills";
      } else if (
        command.includes("contact") ||
        command.includes("connect")
      ) {
        target = "contact";
      } else if (command.includes("about")) {
        target = "about";
      } else if (
        command.includes("home") ||
        command.includes("go to top")
      ) {
        target = "home";
      }

      if (target) {
        document.getElementById(target)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      const updatedMessages = [
        ...chatMessages,
        { role: "user", text: transcript },
      ];

      setChatMessages(updatedMessages);

      setIsListening(false);
      setIsChatLoading(true);
      setMessage("Thinking, sir. Please wait...");

      try {
        const response = await fetch(
          "http://localhost:3001/api/chat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: updatedMessages.slice(-12),
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "JARVIS AI request failed."
          );
        }

        const reply =
          data.reply ||
          "Sorry, sir. I couldn't generate a response.";

        setChatMessages((previous) => [
          ...previous,
          { role: "assistant", text: reply },
        ]);

        speakJarvis(reply);
      } catch (error) {
        console.error("JARVIS voice AI error:", error);

        const errorReply =
          "Sorry, sir. I couldn't connect to my AI brain. Please check the backend, API key, and quota.";

        setChatMessages((previous) => [
          ...previous,
          { role: "assistant", text: errorReply },
        ]);

        speakJarvis(errorReply);
      } finally {
        setIsListening(false);
        setIsChatLoading(false);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setJarvisActive(false);

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        setMessage(
          "Microphone access is blocked. Please allow microphone access in browser settings."
        );
      } else if (event.error === "no-speech") {
        setMessage(
          "I did not hear anything, sir. Please try the microphone again."
        );
      } else {
        setMessage(
          `Voice recognition error: ${event.error}. Please try again.`
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error("JARVIS recognition failed:", error);
      setIsListening(false);
      setJarvisActive(false);
      setMessage(
        "JARVIS could not start listening. Please try again."
      );
    }
  }

  // Play the JARVIS introduction recording.
  function activateJarvis() {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    setIsListening(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    window.speechSynthesis?.cancel();

    const audio = new Audio("/audio/jarvis-intro.mp3");
    audioRef.current = audio;

    setJarvisActive(true);
    setMessage("Hello, sir. JARVIS is online and ready to assist.");

    audio.onended = () => {
      setJarvisActive(false);
      setMessage("JARVIS is standing by, sir.");
    };

    audio.onerror = () => {
      setJarvisActive(false);
      setMessage(
        "Unable to load the JARVIS recording. Check public/audio/jarvis-intro.mp3."
      );
    };

    audio.play().catch((error) => {
      console.error("JARVIS audio playback failed:", error);
      setJarvisActive(false);
      setMessage("Unable to play audio. Please try again.");
    });
  }

  // Stop voice playback and microphone recognition.
  function deactivateJarvis() {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    window.speechSynthesis?.cancel();

    setIsListening(false);
    setJarvisActive(false);
    setMessage("JARVIS is standing by, sir.");
  }

  // Send typed messages to the same Gemini AI backend.
  async function handleChatSend(event) {
    event.preventDefault();

    const text = chatInput.trim();

    if (!text || isChatLoading) return;

    setChatInput("");
    setChatOpen(true);
    setIsChatLoading(true);

    const updatedMessages = [
      ...chatMessages,
      { role: "user", text },
    ];

    setChatMessages(updatedMessages);

    // Navigate only when a portfolio section is requested.
    const command = text.toLowerCase();
    let target = "";

    if (command.includes("project")) {
      target = "projects";
    } else if (
      command.includes("skill") ||
      command.includes("tech stack") ||
      command.includes("technologies")
    ) {
      target = "skills";
    } else if (
      command.includes("contact") ||
      command.includes("connect") ||
      command.includes("email")
    ) {
      target = "contact";
    } else if (
      command.includes("about") ||
      command.includes("who are you") ||
      command.includes("introduce")
    ) {
      target = "about";
    } else if (
      command.includes("home") ||
      command.includes("go to top")
    ) {
      target = "home";
    }

    if (target) {
      document.getElementById(target)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    try {
      const response = await fetch(
        "http://localhost:3001/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: updatedMessages.slice(-12),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "JARVIS AI request failed."
        );
      }

      const reply =
        data.reply ||
        "Sorry, sir. I couldn't generate a response.";

      setChatMessages((previous) => [
        ...previous,
        { role: "assistant", text: reply },
      ]);

      setMessage(reply);
    } catch (error) {
      console.error("JARVIS text AI error:", error);

      const errorReply =
        "Sorry, sir. I couldn't connect to my AI brain. Please check that the backend is running and your API key and quota are valid.";

      setChatMessages((previous) => [
        ...previous,
        { role: "assistant", text: errorReply },
      ]);

      setMessage(errorReply);
    } finally {
      setIsChatLoading(false);
    }
  }

  return (
    <main className="portfolio" id="home">
      <div className="grid-overlay" aria-hidden="true" />
      <div className="ambient ambient-red" aria-hidden="true" />
      <div className="ambient ambient-blue" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#home" aria-label="Akshat Portfolio home">
          <span className="brand-reactor">
            <Zap size={22} />
          </span>
          <span className="brand-copy">
            <strong>AKSHAT</strong>
            <small>PERSONAL COMMAND CENTER</small>
          </span>
        </a>

        <nav className="navigation" aria-label="Main navigation">
          <a href="#about">ABOUT</a>
          <a href="#skills">TECH STACK</a>
          <a href="#projects">PROJECTS</a>
          <a href="#contact">CONTACT</a>
        </nav>

        <div className="system-status">
          <span className="status-dot" />
          SYSTEM ONLINE
        </div>
      </header>

      <section className="banner">
        <div className="banner-name">
          <p className="banner-kicker">
            BUILD · LEARN · INNOVATE · REPEAT
          </p>
          <h1>
            AKSHAT
            <br />
            <span>SRIVASTAVA</span>
          </h1>
        </div>

        <div className="banner-center">
          <img
            className="banner-ironman"
            src="/images/iron-man.png"
            alt="Iron Man armor"
            loading="eager"
          />
        </div>

        <blockquote className="banner-quote">
          “Sometimes you gotta run
          <br />
          before you can <span>walk.</span>”
          <cite>— STARK-INSPIRED MOTTO</cite>
        </blockquote>
      </section>

      <div className="dashboard">
        <aside className="profile-column">
          <div className="profile-card panel">
            <div className="profile-photo-placeholder">
              <img
                className="profile-photo-image"
                src="/images/akshat-profile.jpg"
                alt="Akshat Srivastava profile photo"
              />
              <span className="photo-status">
                <span />
              </span>
            </div>

            <h2>Akshat Srivastava</h2>

            <a
              className="handle"
              href="https://github.com/Akshat807"
              target="_blank"
              rel="noreferrer"
            >
              @Akshat807 <ExternalLink size={13} />
            </a>

            <p className="profile-role">
              <BriefcaseBusiness size={15} /> Aspiring AI Engineer
            </p>
            <p className="profile-role">
              <Code2 size={15} /> Full-Stack Developer
            </p>
            <p className="profile-role">
              <MapPin size={15} /> India
            </p>

            <a
              className="profile-contact"
              href="https://github.com/Akshat807"
              target="_blank"
              rel="noreferrer"
            >
              <Code2 size={15} /> github.com/Akshat807
            </a>

            <a
              className="profile-contact"
              href="https://www.linkedin.com/in/akshat-srivastava-33203a257/"
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={15} /> LinkedIn Profile
            </a>

            <a
              className="profile-contact"
              href="tel:+919693476411"
            >
              <Mail size={15} /> +91 96934 76411
            </a>

            <div className="profile-actions">
              <a
                className="button-red"
                href="https://github.com/Akshat807"
                target="_blank"
                rel="noreferrer"
              >
                <Star size={15} /> FOLLOW
              </a>

              <a className="button-blue" href="#contact">
                <Users size={15} /> CONNECT
              </a>
            </div>
          </div>

          <section className="panel mini-panel">
            <div className="section-title compact-title">
              <Zap size={20} />
              <h2>System Status</h2>
            </div>

            <div className="status-line">
              <span>Portfolio</span>
              <strong>ONLINE</strong>
            </div>

            <div className="status-line">
              <span>Local Time</span>
              <strong>{time.toLocaleTimeString()}</strong>
            </div>

            <div className="status-line">
              <span>JARVIS</span>
              <strong>
                {isListening
                  ? "LISTENING"
                  : jarvisActive
                    ? "ACTIVE"
                    : "STANDBY"}
              </strong>
            </div>
          </section>
        </aside>

        <section className="main-column">
          <div className="top-widgets">
            <section className="terminal panel">
              <div className="terminal-bar">
                <span className="traffic-lights">
                  <i />
                  <i />
                  <i />
                </span>

                <span>
                  <Terminal size={14} /> github / akshat807
                </span>
              </div>

              <div className="terminal-content">
                <p className="terminal-greeting">👋 Hi there!</p>
                <p>
                  <b>&gt;</b> I’m <span>Akshat Srivastava</span>
                </p>
                <p>
                  <b>&gt;</b> Aspiring AI Engineer | Software Developer
                </p>
                <p>
                  <b>&gt;</b> Building practical applications that solve
                  real-world problems.
                </p>
                <p>
                  <b>&gt;</b> Exploring LLMs, RAG, and AI Agents.
                </p>
                <p className="terminal-last">
                  <b>&gt;</b> Turning ideas into impact.<i />
                </p>
              </div>
            </section>

            <section className="github-stats panel">
              <div className="section-title">
                <Code2 size={21} />
                <h2>GitHub Profile</h2>
              </div>

              <a
                className="stat-row"
                href="https://github.com/Akshat807?tab=repositories"
                target="_blank"
                rel="noreferrer"
              >
                <Code2 size={17} />
                <span>Repositories</span>
                <strong>Explore ↗</strong>
              </a>

              <a
                className="stat-row"
                href="https://github.com/Akshat807?tab=stars"
                target="_blank"
                rel="noreferrer"
              >
                <Star size={17} />
                <span>Stars</span>
                <strong>View ↗</strong>
              </a>

              <a
                className="stat-row"
                href="https://github.com/Akshat807"
                target="_blank"
                rel="noreferrer"
              >
                <Users size={17} />
                <span>Followers</span>
                <strong>View ↗</strong>
              </a>

              <p className="stats-note">
                Live counts can be connected in a later step.
              </p>
            </section>
          </div>

          <div className="interest-chips">
            {[
              "AI / ML",
              "Generative AI",
              "Full-Stack",
              "Cloud",
              "Open Source",
              "Problem Solver",
            ].map((item) => (
              <span key={item}>
                <ShieldCheck size={13} /> {item}
              </span>
            ))}
          </div>

          <section className="about-block" id="about">
            <div className="section-title">
              <span className="section-emoji">👨‍💻</span>
              <h2>About Me</h2>
            </div>

            <p>
              Hey, I’m Akshat Srivastava — an aspiring AI Engineer and
              Full-Stack Developer passionate about building technology
              that solves real-world problems. I enjoy turning ideas into
              practical applications, creating intuitive web experiences,
              and exploring how Artificial Intelligence can make software
              smarter and more useful.
            </p>

            <p>
              My development journey includes projects like CivicPulse AI,
              My Portfolio, and STUDY-LINK, where I continue to strengthen
              my problem-solving and software development skills. I’m
              expanding my knowledge of Python, Java, JavaScript, React,
              backend development, and cloud technologies while exploring
              Generative AI, Large Language Models (LLMs),
              Retrieval-Augmented Generation (RAG), and AI Agents.
            </p>

            <p>
              I believe in learning by building, improving through
              experimentation, and staying curious about emerging
              technologies. My goal is to grow into an AI Engineer who
              creates reliable, intelligent, and impactful solutions.
              Every project is another opportunity to learn, innovate,
              and build something meaningful.
            </p>
          </section>
        </section>
      </div>
      <section className="skills-section panel" id="skills">
        <div className="section-title">
          <Zap size={23} />
          <h2>Tech Stack</h2>
        </div>

        <div className="skills-grid">
          {skills.map((group) => (
            <div className="skill-group" key={group.group}>
              <h3>{group.group}</h3>
              <div className="skill-items">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="projects-section" id="projects">
        <div className="section-heading-row">
          <div className="section-title">
            <span className="section-emoji">🚀</span>
            <h2>Featured Projects</h2>
          </div>

          <a
            href="https://github.com/Akshat807?tab=repositories"
            target="_blank"
            rel="noreferrer"
          >
            VIEW GITHUB REPOSITORIES <ExternalLink size={14} />
          </a>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <motion.article
              className="project-card panel"
              key={project.number}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <a
                className={`project-preview preview-${project.number}`}
                href={project.link}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${project.name} repository`}
              >
                <div className="preview-window">
                  <span />
                  <span />
                  <span />
                  <strong>{project.name}</strong>
                  <small>{project.category}</small>
                </div>
              </a>

              <div className="project-heading">
                <div className="project-icon">
                  <Code2 size={20} />
                </div>

                <div className="project-name">
                  <h3>{project.name}</h3>
                  <span>{project.owner}</span>
                </div>

                <span className="repo-badge">REPO</span>
              </div>

              <p className="project-description">
                {project.description}
              </p>

              <div className="project-tags">
                {project.stack.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <a
                className="project-link"
                href={project.link}
                target="_blank"
                rel="noreferrer"
              >
                <Code2 size={15} /> VIEW REPOSITORY{" "}
                <ExternalLink size={13} />
              </a>
            </motion.article>
          ))}
        </div>

        <p className="disclaimer">
          Project summaries are based on the available repository names
          and context. Verify descriptions and contributions before
          publishing.
        </p>
      </section>

      <section className="lower-grid">
        <section className="panel lower-panel">
          <div className="section-title">
            <ShieldCheck size={22} />
            <h2>Certifications</h2>
          </div>

          <p className="muted-copy">
            Five credentials and course-completion certificates.
            Select any preview to view it full size.
          </p>

          <div className="cert-grid">
            <article className="cert-card">
              <a
                className="cert-image-link"
                href="/certifications/azure-fundamentals.jpg"
                target="_blank"
                rel="noreferrer"
                aria-label="View Microsoft Azure Fundamentals certificate"
              >
                <img
                  src="/certifications/azure-fundamentals.jpg"
                  alt="Microsoft Certified Azure Fundamentals certificate"
                  loading="lazy"
                />
              </a>

              <div className="cert-details">
                <span className="cert-number">01</span>
                <strong>
                  Microsoft Certified: Azure Fundamentals (AZ-900)
                </strong>
                <small>Microsoft · Issued Dec 30, 2024</small>
                <a
                  href="/certifications/azure-fundamentals.jpg"
                  target="_blank"
                  rel="noreferrer"
                >
                  View certificate ↗
                </a>
              </div>
            </article>

            <article className="cert-card">
              <a
                className="cert-image-link"
                href="/certifications/azure-ai-fundamentals.jpg"
                target="_blank"
                rel="noreferrer"
                aria-label="View Microsoft Azure AI Fundamentals certificate"
              >
                <img
                  src="/certifications/azure-ai-fundamentals.jpg"
                  alt="Microsoft Azure AI Fundamentals certificate"
                  loading="lazy"
                />
              </a>

              <div className="cert-details">
                <span className="cert-number">02</span>
                <strong>
                  Microsoft Certified: Azure AI Fundamentals
                </strong>
                <small>Microsoft · Earned Jun 14, 2025</small>
                <small>Certification no. 6057AB-D47QC0</small>
                <a
                  href="/certifications/azure-ai-fundamentals.jpg"
                  target="_blank"
                  rel="noreferrer"
                >
                  View certificate ↗
                </a>
              </div>
            </article>

            <article className="cert-card">
              <a
                className="cert-image-link"
                href="/certifications/servicenow-csa.jpg"
                target="_blank"
                rel="noreferrer"
                aria-label="View ServiceNow CSA certificate"
              >
                <img
                  src="/certifications/servicenow-csa.jpg"
                  alt="ServiceNow Certified System Administrator certificate"
                  loading="lazy"
                />
              </a>

              <div className="cert-details">
                <span className="cert-number">03</span>
                <strong>Certified System Administrator (CSA)</strong>
                <small>ServiceNow · Issued May 19, 2025</small>
                <small>Certificate no. 27127595</small>
                <a
                  href="/certifications/servicenow-csa.jpg"
                  target="_blank"
                  rel="noreferrer"
                >
                  View certificate ↗
                </a>
              </div>
            </article>

            <article className="cert-card">
              <a
                className="cert-image-link"
                href="/certifications/generative-ai-foundations.jpg"
                target="_blank"
                rel="noreferrer"
                aria-label="View Generative AI Foundations certificate"
              >
                <img
                  src="/certifications/generative-ai-foundations.jpg"
                  alt="Generative AI Foundations certificate"
                  loading="lazy"
                />
              </a>

              <div className="cert-details">
                <span className="cert-number">04</span>
                <strong>
                  Generative AI Foundations: IT Integration with
                  Generative AI
                </strong>
                <small>
                  Infosys Springboard · Issued Sep 29, 2026
                </small>
                <a
                  href="/certifications/generative-ai-foundations.jpg"
                  target="_blank"
                  rel="noreferrer"
                >
                  View certificate ↗
                </a>
              </div>
            </article>

            <article className="cert-card">
              <a
                className="cert-image-link"
                href="/certifications/google-cloud-fundamentals.jpg"
                target="_blank"
                rel="noreferrer"
                aria-label="View Google Cloud Fundamentals certificate"
              >
                <img
                  src="/certifications/google-cloud-fundamentals.jpg"
                  alt="Google Cloud Fundamentals certificate"
                  loading="lazy"
                />
              </a>

              <div className="cert-details">
                <span className="cert-number">05</span>
                <strong>
                  Google Professional Cloud Architect: Google Cloud
                  Fundamentals
                </strong>
                <small>
                  Infosys Springboard · Issued Mar 26, 2025
                </small>
                <a
                  href="/certifications/google-cloud-fundamentals.jpg"
                  target="_blank"
                  rel="noreferrer"
                >
                  View certificate ↗
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="panel lower-panel">
          <div className="section-title">
            <Activity size={22} />
            <h2>GitHub Analytics</h2>
          </div>

          <p className="muted-copy">
            Open your GitHub profile for current repository activity
            and contribution data.
          </p>

          <a
            className="analytics-link"
            href="https://github.com/Akshat807"
            target="_blank"
            rel="noreferrer"
          >
            <Code2 size={18} /> VIEW GITHUB PROFILE{" "}
            <ExternalLink size={14} />
          </a>
        </section>
      </section>

      {/* Floating JARVIS Chatbot */}
      <div className="jarvis-widget">
        {chatOpen && (
          <section className="jarvis-chat panel" aria-label="JARVIS chat">
            <div className="jarvis-chat-header">
              <div className="jarvis-avatar">
                <Bot size={26} />
              </div>

              <div className="jarvis-chat-title">
                <strong>J.A.R.V.I.S.</strong>
                <span>
                  <i /> COMMAND ASSISTANT · ONLINE
                </span>
              </div>

              <button
                className="jarvis-close"
                type="button"
                onClick={() => setChatOpen(false)}
                aria-label="Close JARVIS chat"
              >
                ×
              </button>
            </div>

            <div className="jarvis-chat-body">
              <div className="jarvis-welcome">
                <span className="arc-reactor-icon">
                  <Zap size={32} strokeWidth={1.5} />
                </span>
                <h3>Good to see you, sir.</h3>
                <p>
                  Ask me anything. I can answer general questions
                  and help you explore Akshat's portfolio.
                </p>
              </div>

              {chatMessages.map((item, index) => (
                <div
                  key={index}
                  className={`jarvis-bubble ${
                    item.role === "user"
                      ? "user-bubble"
                      : "assistant-bubble"
                  }`}
                >
                 <div className="markdown-content">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {item.text}
  </ReactMarkdown>
</div>
                </div>
              ))}

              {isChatLoading && (
                <div
                  className="jarvis-bubble assistant-bubble"
                  role="status"
                  aria-live="polite"
                >
                  JARVIS is thinking, sir...
                </div>
              )}
            </div>

            <form
              className="jarvis-chat-form"
              onSubmit={handleChatSend}
            >
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Ask JARVIS something..."
                aria-label="Message JARVIS"
                disabled={isChatLoading}
              />

              <button
                type="button"
                className="jarvis-mic-button"
                onClick={listenToJarvis}
                disabled={isListening || isChatLoading}
                title="Speak to JARVIS"
                aria-label="Speak to JARVIS"
              >
                <Mic size={18} />
              </button>

              <button
                type="submit"
                className="jarvis-send-button"
                aria-label="Send message"
                disabled={isChatLoading || !chatInput.trim()}
              >
                {isChatLoading ? "…" : <ArrowDown size={18} />}
              </button>
            </form>
          </section>
        )}

        <button
          className={`jarvis-float-button ${
            chatOpen ? "chat-is-open" : ""
          }`}
          type="button"
          onClick={() => setChatOpen((open) => !open)}
          aria-label={
            chatOpen ? "Close JARVIS chat" : "Open JARVIS chat"
          }
          title="Talk to JARVIS"
        >
          {chatOpen ? (
            <span className="jarvis-float-x">×</span>
          ) : (
            <span className="arc-reactor-icon">
              <Zap size={32} strokeWidth={1.5} />
            </span>
          )}

          {!chatOpen && (
            <span className="jarvis-float-status" />
          )}
        </button>
      </div>

      <section className="contact-section panel" id="contact">
        <div>
          <div className="section-title">
            <Mail size={22} />
            <h2>Let’s Connect</h2>
          </div>

          <p>
            Have a project idea, collaboration opportunity, or want
            to talk about AI and software development?
          </p>
        </div>

        <div className="contact-actions">
          <a
            className="button-blue"
            href="https://github.com/Akshat807"
            target="_blank"
            rel="noreferrer"
          >
            <Code2 size={16} /> GITHUB
          </a>

          <a
            className="button-red"
            href="mailto:akshatsrivastava333@gmail.com"
          >
            <Mail size={16} /> EMAIL
          </a>
        </div>
      </section>
   <button
  type="button"
  className="replay-intro-button"
  onClick={() => {
    window.location.href = "/intro.html";
  }}
>
  ↻ REPLAY INTRO
</button>
      <footer className="footer">
        <span>
          AKSHAT PORTFOLIO © {new Date().getFullYear()}
        </span>

        <span>
          <Zap size={14} /> BUILD · LEARN · INNOVATE · REPEAT
        </span>

        <span>JARVIS SYSTEMS // V1.0</span>
      </footer>
    </main>
  );
}

export default App;
