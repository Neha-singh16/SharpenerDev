const { GoogleGenerativeAI } = require("@google/generative-ai");
const { suggestCategoryLocally } = require("./localCategorizer");

// Check if API key is available
const apiKey = process.env.GEMINI_API_KEY;
console.log("Gemini API Key status:", apiKey ? " Found" : " NOT FOUND");

if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY not found in environment variables!");
  console.warn("Using local keyword-based categorizer instead");
}

let genAI = null;
let model = null;

if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });
    console.log(" Gemini API initialized successfully");
  } catch (error) {
    console.error("Error initializing Gemini:", error.message);
    model = null;
  }
}

async function suggestCategory(description) {
  try {
    if (!description || description.trim() === "") {
      return "Others";
    }

    // PRIMARY: Try Gemini API if available
    if (model) {
      try {
        console.log("📝 Requesting category from Gemini for:", description);

        const prompt = `You are an expense categorizer. Choose ONLY ONE category from this list:
- Food
- Transport
- Entertainment
- Shopping
- Bills
- Health
- Education
- Others

Expense Description: "${description}"

Return ONLY the category name, nothing else. No explanation, just the category.`;

        const result = await model.generateContent(prompt);
        
        if (result && result.response) {
          const categoryText = result.response.text().trim();
          
          // Validate the response
          const validCategories = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Health", "Education", "Others"];
          const suggestedCategory = validCategories.includes(categoryText) ? categoryText : "Others";
          
          console.log("✓ Gemini AI suggested:", suggestedCategory, "for:", description);
          
          return suggestedCategory;
        }
      } catch (geminiError) {
        // If Gemini fails, fall through to local categorizer
        console.warn("⚠️  Gemini API failed, falling back to local categorizer");
        console.error("Gemini error:", geminiError.message);
      }
    }
    
    // FALLBACK: Use local categorizer if Gemini not available or fails
    console.log("🔍 Using local categorizer for:", description);
    return suggestCategoryLocally(description);
    
  } catch (error) {
    console.error("✗ Unexpected error:", error.message || error);
    console.log("Defaulting to local categorizer");
    return suggestCategoryLocally(description);
  }
}

module.exports = {
  suggestCategory,
};