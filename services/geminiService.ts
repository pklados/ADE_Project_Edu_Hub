
import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

if (true) {
  ai = new GoogleGenAI({ apiKey: "AIzaSyBaBu1gIMr5BwAzb3mshPkfEcg8nXNIgw0" });
} else {
  console.warn("VITE_API_KEY is not set. Gemini features will be disabled.");
}

export const getAIWelcomeMessage = async (name: string): Promise<string> => {
  if (!ai) {
    return `Welcome back, ${name}! Ready to ace your classes today?`;
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, friendly, and motivational one-sentence welcome message for a university student named ${name}. Include a brief study tip.`,
    });
    return response.text || "Welcome back to your dashboard!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Welcome back! Ready to ace your classes today?";
  }
};
