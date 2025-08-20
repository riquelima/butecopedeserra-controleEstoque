
import { GoogleGenAI } from "@google/genai";

export const generateProductDescription = async (productName: string): Promise<string> => {
  // API key is checked here to avoid crashing the app on startup.
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.warn("API_KEY environment variable not set for Gemini. AI features will be disabled.");
    return "Serviço de IA indisponível. Por favor, configure a chave da API.";
  }

  try {
    // Initialize the AI client only when it's needed and the key exists.
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const prompt = `Gere uma descrição concisa e útil para o item de estoque "${productName}" para uso em um restaurante ou bar. Mencione usos comuns e mantenha a descrição com no máximo 40 palavras. Responda em Português do Brasil.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating product description with Gemini:", error);
    return "Não foi possível gerar a descrição. Tente novamente.";
  }
};
