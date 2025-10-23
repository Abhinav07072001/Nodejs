import puppeteer from "puppeteer";

export async function generatePDF(recipeData) {
  const { title, ingredients, steps, nutrition } = recipeData;

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; background-color: #fdfdfd; }
          h1 { color: #3e8e41; text-align: center; }
          h2 { color: #444; margin-top: 40px; }
          ul { line-height: 1.8; }
          ol { line-height: 1.8; }
          .nutrition { margin-top: 20px; font-style: italic; color: #666; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <h2>Ingredients</h2>
        <ul>${ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
        <h2>Steps</h2>
        <ol>${steps.map(s => `<li>${s}</li>`).join("")}</ol>
        ${nutrition ? `<div class="nutrition">${nutrition}</div>` : ""}
      </body>
    </html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  return pdfBuffer;
}
