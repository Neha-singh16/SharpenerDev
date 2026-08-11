// Local categorizer that doesn't require API calls
// Works when Gemini API quota is exceeded or API key is missing

const categoryKeywords = {
  Food: [
    "food", "eat", "lunch", "dinner", "breakfast", "restaurant", "cafe", 
    "pizza", "burger", "coffee", "tea", "snacks", "grocery", "groceries",
    "fruit", "vegetable", "rice", "wheat", "milk", "bread", "meal",
    "biryani", "dosa", "samosa", "juice", "smoothie", "bakery"
  ],
  Transport: [
    "transport", "travel", "car", "bike", "bus", "taxi", "uber", "ola",
    "auto", "metro", "train", "flight", "petrol", "diesel", "fuel",
    "parking", "toll", "vehicle", "ride", "commute", "driving"
  ],
  Entertainment: [
    "entertainment", "movie", "cinema", "games", "gaming", "sports", "concert",
    "show", "ticket", "play", "music", "netflix", "spotify", "streaming",
    "hobby", "fun", "party", "outing", "picnic"
  ],
  Shopping: [
    "shopping", "clothes", "dress", "shirt", "pants", "shoes", "boots",
    "jacket", "saree", "kurta", "shop", "store", "mall", "online",
    "amazon", "flipkart", "buy", "purchase", "bag", "accessories"
  ],
  Bills: [
    "bill", "bills", "electricity", "water", "internet", "phone", "mobile",
    "subscription", "cable", "gas", "rent", "payment", "utility", "insurance"
  ],
  Health: [
    "health", "medical", "doctor", "hospital", "medicine", "pharmacy", "drugs",
    "therapy", "gym", "fitness", "exercise", "healthcare", "dental", "dental",
    "checkup", "clinic", "surgery", "treatment"
  ],
  Education: [
    "education", "school", "college", "university", "course", "training",
    "book", "books", "study", "learning", "class", "tuition", "exam",
    "certification", "workshop", "lecture"
  ]
};

function suggestCategoryLocally(description) {
  if (!description || description.trim() === "") {
    return "Others";
  }

  const lowerDesc = description.toLowerCase();
  const words = lowerDesc.split(/\s+|[,.\-_]/);

  // Count matches for each category
  const categoryScores = {};

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    categoryScores[category] = 0;
    
    for (const keyword of keywords) {
      // Check if keyword appears in description or words
      if (lowerDesc.includes(keyword)) {
        categoryScores[category] += 2; // Higher weight for full match
      }
      
      // Check if any word matches the keyword
      if (words.includes(keyword)) {
        categoryScores[category] += 1;
      }
    }
  }

  // Find category with highest score
  let maxScore = 0;
  let suggestedCategory = "Others";

  for (const [category, score] of Object.entries(categoryScores)) {
    if (score > maxScore) {
      maxScore = score;
      suggestedCategory = category;
    }
  }

  console.log(`🔍 Local categorizer: "${description}" → ${suggestedCategory} (score: ${maxScore})`);
  return suggestedCategory;
}

module.exports = {
  suggestCategoryLocally,
};
