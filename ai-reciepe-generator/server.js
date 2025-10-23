import express from "express";
import dotenv from "dotenv";
import { generateRecipeFromOllama } from "./utils/ollama.js";
import { enhanceRecipeWithGemini } from "./utils/gemini.js";
import { generatePDF } from "./utils/pdfGenerator.js";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/generate-recipe", async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients || ingredients.length === 0)
      return res.status(400).json({ message: "Ingredients required!" });

    // Step 1: Generate base recipe from Ollama
    const ollamaRecipe = await generateRecipeFromOllama(ingredients);

    // Step 2: Refine using Gemini
    const geminiRecipe = await enhanceRecipeWithGemini(ollamaRecipe);

    // Step 3: Parse recipe text (simplified)
    const titleMatch = geminiRecipe.match(/Title:\s*(.*)/i);
    const title = titleMatch ? titleMatch[1] : "Delicious AI Recipe";

    const ingredientsMatch = geminiRecipe.match(/Ingredients:\s*([\s\S]*?)Steps:/i);
    const ingredientsList = ingredientsMatch
      ? ingredientsMatch[1].split("\n").filter(Boolean)
      : ingredients.map(i => `${i} - as needed`);

    const stepsMatch = geminiRecipe.match(/Steps:\s*([\s\S]*)/i);
    const stepsList = stepsMatch
      ? stepsMatch[1].split(/\d+\.\s+/).filter(Boolean)
      : ["Follow your heart! ❤️"];

    const nutritionMatch = geminiRecipe.match(/Nutrition:\s*(.*)/i);
    const nutrition = nutritionMatch ? nutritionMatch[1] : null;

    // Step 4: Generate PDF
    const pdf = await generatePDF({
      title,
      ingredients: ingredientsList,
      steps: stepsList,
      nutrition,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${title}.pdf"`,
    });
    res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`✅ Server running on port ${process.env.PORT}`)
);
