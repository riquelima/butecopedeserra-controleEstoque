
import { GoogleGenAI } from "@google/genai";

// Ensure API_KEY is available in the environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set for Gemini. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateProductDescription = async (productName: string): Promise<string> => {
  if (!API_KEY) {
    return "Serviço de IA indisponível. Por favor, configure a chave da API.";
  }

  try {
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
