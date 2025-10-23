import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function enhanceRecipeWithGemini(recipeText) {
  const prompt = `
  Improve and rewrite this recipe text in a user-friendly and formatted way.
  Add optional nutritional information (calories, protein, fat, carbs) if relevant.
  Recipe:
  ${recipeText}
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
  } catch (error) {
    console.error("Error with Gemini API:", error.message);
    throw new Error("Failed to enhance recipe using Gemini");
  }
}
