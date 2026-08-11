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


async function generateSmartReplies(message, recentMessages=[]) {

   const prompt = `
You are a smart reply assistant for a chat application.

Generate 3 short replies to the incoming message.

INCOMING MESSAGE:
"${message}"

USER'S RECENT MESSAGES:
${recentMessages.join("\n")}

Analyze the user's communication style.

Pay attention to:
- Formal or casual language
- Hindi / English / Hinglish usage
- Emoji usage
- Short or long sentences
- Repeated expressions
- Lowercase/uppercase style
- Tone

Generate replies that sound like THIS USER would naturally write them.

Rules:
- Keep replies short.
- Keep them relevant to the incoming message.
- Match the user's tone.
- Use emojis only if the user commonly uses them.
- Don't overuse emojis.
- Don't make replies unnecessarily formal.
- Return ONLY a JSON array of 3 strings.

Example:
["haan 😂", "yesss sure", "thodi der me aaungi"]
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