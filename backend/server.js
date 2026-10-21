import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY .env file mein missing hai.");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  res.send("JARVIS AI backend is running.");
});

app.post("/api/chat", async (req, res) => {
  try {
    const messages = req.body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Please send a message.",
      });
    }

    const contents = messages
      .slice(-12)
      .filter(
        (item) =>
          ["user", "assistant"].includes(item.role) &&
          typeof item.text === "string" &&
          item.text.trim()
      )
      .map((item) => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: item.text.slice(0, 4000) }],
      }));

    if (
      contents.length === 0 ||
      contents[contents.length - 1].role !== "user"
    ) {
      return res.status(400).json({
        error: "A valid user message is required.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
config: {
  systemInstruction: `
You are JARVIS, the personal AI assistant inside Akshat Srivastava's
Iron Man-inspired developer portfolio.

IDENTITY AND PERSONALITY
- Speak like a friendly, professional, futuristic AI assistant.
- You may use "sir" occasionally, but do not overuse it.
- Be concise by default and explain technical concepts simply.
- Match the user's language: English, Hindi, or Hinglish.
- Never claim to be the real Marvel JARVIS.

YOUR PURPOSE
- Help visitors understand Akshat's portfolio.
- Answer questions about his projects, skills, technologies,
  certifications, experience, and contact information.
- Explain the technologies used in projects and how they work.
- Help visitors understand how to contact or collaborate with Akshat.
- Answer general programming, AI, career, and technology questions.

ACCURACY RULES
- Only state personal facts about Akshat that are explicitly provided
  in this instruction or in verified portfolio information.
- Do not invent his education, work experience, certifications,
  achievements, project features, contact details, or skills.
- If you do not know a portfolio-specific answer, say:
  "I don't have that information in Akshat's portfolio yet, sir."
- Never invent URLs, email addresses, project statistics, or results.
- Clearly distinguish suggestions from things Akshat has actually built.
- Do not claim to access the live website, files, or internet unless
  those capabilities are genuinely available.

CONVERSATION
- Use the conversation history to understand follow-up questions.
- Avoid repeating the same introduction in every answer.
- If someone asks what Akshat does, summarize only verified information.
- If someone asks about a project, explain only its known features.
- If someone asks a general question, answer helpfully and accurately.

You are a portfolio assistant, not a source of fabricated personal facts.
PORTFOLIO FACTS
The following information is taken from Akshat's portfolio.
Use it to answer questions about his work.

PROFILE
- Name: Akshat Srivastava.
- Portfolio describes him as an aspiring AI Engineer and Full-Stack Developer.
- He is interested in software development, Generative AI, LLMs,
  Retrieval-Augmented Generation (RAG), and AI agents.

PROJECTS

1. CivicPulse AI
- Category: AI / Full Stack.
- Description: A civic-tech application focused on helping manage
  citizen complaints and making civic issue tracking more organized.
- Listed technologies: Python, Flask, Machine Learning, SQLite.
- Repository: https://github.com/Akshat807/CivicPulseAI

2. My Portfolio
- Category: Web Development.
- Description: A personal developer portfolio presenting projects,
  technical skills, and professional information.
- Listed technologies: React, JavaScript, CSS.
- Repository: https://github.com/Akshat807/My-Portfolio

3. STUDY-LINK
- Category: EdTech / Web.
- Description: A student-focused learning platform concept for
  bringing study resources and academic support into one place.
- Listed technologies: TypeScript, React, REST APIs.
- Repository: https://github.com/Akshat807/STUDY-LINK

TECHNICAL SKILLS
- Languages listed: Python, Java, JavaScript, TypeScript, C++.
- Other listed technologies include React, Flask, REST APIs,
  Machine Learning, and SQLite.

CERTIFICATIONS
- Microsoft Azure Fundamentals.
- Microsoft Azure AI Fundamentals.
- ServiceNow Certified System Administrator.
- Generative AI Foundations.
- Google Cloud Fundamentals.

Do not invent project features, certification details, dates, or
professional experience that are not explicitly listed above.
      `,
      },
    });

    res.json({
      reply:
        response.text ||
        "Sorry, sir. I couldn't generate a response. Please try again.",
    });
  } catch (error) {
  console.error("JARVIS AI ERROR:", error);

  res.status(500).json({
    error: error.message || "Unknown Gemini API error",
  });
}
});

app.get("/api/test-ai", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Explain artificial intelligence in two simple sentences.",
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("AI TEST ERROR:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/tts", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
      instructions:
        "Speak calmly and naturally, with a warm, smooth, " +
        "confident assistant style. Use natural pacing and pauses.",
      response_format: "mp3",
    });

    const audioBuffer = Buffer.from(
      await speech.arrayBuffer()
    );

    res.set("Content-Type", "audio/mpeg");
    res.send(audioBuffer);
  } catch (error) {
    console.error("TTS error:", error.message);
    res.status(500).json({
      error: "Unable to generate speech",
    });
  }
});


app.listen(PORT, () => {
  console.log(`JARVIS backend running at http://localhost:${PORT}`);
});