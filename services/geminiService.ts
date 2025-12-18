
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client using the mandatory named parameter for apiKey
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeApplicantMotivation = async (motivationText: string): Promise<string> => {
  try {
    // Using 'gemini-3-flash-preview' as recommended for basic text analysis tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analysiere die folgende Antwort eines Bewerbers für ein Freiwilliges Soziales Jahr (FSZ). 
      Gib eine kurze, prägnante Einschätzung (max. 2 Sätze) über die Einstellung und Motivation des Bewerbers.
      
      Antwort des Bewerbers: "${motivationText}"`,
    });

    // Accessing .text as a property, not a method, per the GenAI SDK rules
    return response.text || "Keine Analyse verfügbar.";
  } catch (error) {
    console.error("Error analyzing text with Gemini:", error);
    return "Fehler bei der KI-Analyse.";
  }
};
