
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIWelcomeMessage = async (name: string): Promise<string> => {
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
