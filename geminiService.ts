
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "./constants";

export const getRecommendation = async (userMood: string) => {
  try {
    /* Fix: Use GEMINI_API_KEY to match user's Vercel settings */
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Пользователь описывает свое состояние: "${userMood}". 
      У нас есть товары: ${PRODUCTS.map(p => p.name).join(', ')}.
      Посоветуй идеальный набор из 2-3 продуктов "Цветастый". 
      Ответь по-дружески, в стиле "Цветастый" (уютно, тепло, заботливо).
      Используй русский язык.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });
    // The `.text` property directly returns the generated string output.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Прости, мой травяной чай немного остыл и я задумался. Попробуй еще раз чуть позже!";
  }
};
