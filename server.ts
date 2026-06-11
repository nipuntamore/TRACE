import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Ensure Gemini Client is initialized safely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  // Use recommended syntax from system skill: Object parameter with apiKey and User-Agent header
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined. AI Advisor features will fall back to offline advisor recommendations.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
  });

  // API Route: Gemini Eco-Coach Counselor
  app.post("/api/gemini-coach", async (req, res) => {
    try {
      const { chatHistory, profile, challenges, logs, customPrompt } = req.body;

      if (!ai) {
        return res.json({
          reply: "🌱 I'm currently running in offline modes as no GEMINI_API_KEY was configured in secrets! Don't worry, here is a localized prompt recommendation: Try taking public transport for your local commute or choosing plant-based meals at lunch today. Even a single day swap avoids up to 3.5kg of greenhouse gases!"
        });
      }

      // Structure context-rich instructions for the AI model
      const systemInstruction = 
        "You are the TRACE Eco-Coach, a friendly, ultra-positive sustainability companion helping the user lower their carbon footprint. " +
        "You always provide encouraging, empowering guidance. Never use alarmist, apocalyptic doom-scrolling words. " +
        "Frame raw CO2 saving values into highly relatable comparisons (e.g., charging smartphones, Netflix streaming hours, vehicle miles, or planting pine seedlings). " +
        "Keep your response actionable, concise (under 200 words), and formatted clearly with Markdown lists or bold headers where appropriate.";

      // Incorporate profile parameters to avoid generic replies
      const profileSummary = profile ? 
        `User Lifestyle Profile:
        - Main commute: ${profile.commuteMode === 'alone' ? 'Driving alone' : profile.commuteMode === 'carpool' ? 'Carpooling' : profile.commuteMode === 'transit' ? 'Public Transit' : 'Biking / Walking'}
        - Dietary habits: ${profile.dietType === 'heavy_meat' ? 'Heavy meat eater' : profile.dietType === 'balanced' ? 'Balanced omnivore' : profile.dietType === 'poultry_fish' ? 'Poultry & fish' : 'Vegetarian / Vegan'}
        - Home power: ${profile.homeEnergy === 'grid' ? 'Standard utility grid' : profile.homeEnergy === 'partial' ? 'Partial renewable offsets' : '100% Home Solar / Green grid'}
        - Flight habits: ${profile.flyFrequency === 'frequent' ? 'Frequent flying (more than 5 times yearly)' : profile.flyFrequency === 'occasional' ? 'Occasional utility holiday flights' : 'Rarely / Never fly'}
        - Garbage/Recycling: ${profile.wasteHabit === 'none' ? 'Throw everything away' : profile.wasteHabit === 'basic' ? 'Basic sorting' : 'Advanced recycler & composter'}` 
        : "No profile created yet.";

      const challengeSummary = challenges ? 
        `Completed Sustainability Actions: ${challenges.filter((c: any) => c.completed).map((c: any) => c.title).join(", ") || "None yet."}` 
        : "";

      const historyContext = chatHistory && chatHistory.length > 0 
        ? chatHistory.map((m: any) => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`).join("\n") 
        : "";

      const promptText = `
${profileSummary}
${challengeSummary}

Conversation History:
${historyContext}

User query: ${customPrompt || "Analyze my carbon status profile and suggest concrete next-best steps with relatable equivalents!"}

TRACE Eco-Coach response:`;

      // Call Gemini API using correct recommended SDK method: ai.models.generateContent
      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const textReply = result.text || "I'm ready to help you trace and trim your carbon footprint! Ask me any specific question about your lifestyle.";
      res.json({ reply: textReply });

    } catch (error: any) {
      console.error("Gemini Coach API error: ", error);
      res.status(500).json({ 
        error: "Failed to query eco adviser server",
        reply: "Oops, local static line overload! Please ensure your Gemini key in Secrets has valid privileges, or try asking again in a moment. Rest assured, your local carbon logs are safely kept!" 
      });
    }
  });

  // Setup Hot-Reload dev build system or static serving
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with static file serve assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TRACE Web Server listening at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start TRACE express server:", err);
});
