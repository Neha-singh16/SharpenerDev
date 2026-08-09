const {
    GoogleGenerativeAI
} = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite"
});


async function generateTypingSuggestions(text){
    const prompt = `You are an AI predictive typing assistant for a chat application.

The user has partially typed this message:

"${text}"

Generate exactly 3 short and natural suggestions
for what the user could type next.

Rules:
- Suggestions must directly continue the user's text.
- Keep each suggestion concise.
- Do not repeat the existing text.
- Do not explain anything.
- Return ONLY valid JSON.
- The JSON must be an array of 3 strings.

Example:

Input:
"Let's meet at"

Output:
[
    "5 pm",
    "the office",
    "the mall"
]
`;

    const result = await model.generateContent(prompt);
    const response=  result.response.text();

    console.log("Gemini raw response:",  response);

       const cleaned = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

        const suggestions = JSON.parse(cleaned);

        return suggestions;

}


async function generateSmartReplies(message) {

    const prompt = `
You are an AI assistant helping users reply to messages in a chat application.

Incoming message:
"${message}"

Generate exactly 3 short, natural reply options.

Rules:
- Replies must be relevant to the incoming message.
- Keep them concise and conversational.
- Each reply should be different.
- Do not use explanations.
- Do not include numbering.
- Return ONLY valid JSON.
- Return an array containing exactly 3 strings.

Example:

Input:
"Are you coming to the meeting?"

Output:
[
    "Yes, I'll be there.",
    "Running late, will join soon.",
    "Can we reschedule?"
]
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    console.log(
        "Gemini smart replies:",
        response
    );

    const cleaned = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const replies = JSON.parse(cleaned);

    return replies;
}

module.exports = {
    generateTypingSuggestions,
    generateSmartReplies
};