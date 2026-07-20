const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
model: "gemini-2.0-flash"
});

async function suggestCategory(description) {
  try {
    const prompt = `
You are an expense categorizer.

Choose ONLY ONE category.

Expense Description:
${description}

Return ONLY the category name.
`;

    const result = await model.generateContent(prompt);

    return result.response.text().trim();
  } catch (error) {
    console.error("Error generating category:", error);
    throw error;
  }
}


module.exports = {
  suggestCategory,
};