import axios from "axios";

export async function generateRecipeFromOllama(ingredients) {
  const prompt = `
  You are a professional chef. Create a recipe using these ingredients: ${ingredients.join(", ")}.
  Provide:
  1. A creative title
  2. Ingredients with realistic quantity measurements
  3. At least 5 clear preparation steps
  `;

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3", // or any local model installed in Ollama
      prompt,
      stream: false,
    });

    return response.data.response;
  } catch (error) {
    console.error("Error calling Ollama:", error.message);
    throw new Error("Failed to generate recipe from Ollama");
  }
}
