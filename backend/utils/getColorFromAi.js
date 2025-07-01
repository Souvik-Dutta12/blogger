import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiColorForTag = async (tagName) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are a Tailwind CSS assistant.
Given a tag name (e.g., "JavaScript", "React", "Career", "Design", etc.), return the most appropriate Tailwind CSS color name (e.g., yellow, sky, pink, emerald, etc.).

For programming, frameworks, or tech-related tags, return the color that matches the technology’s branding or visual theme.

For general, non-tech tags (e.g., "career", "life", "design", "fun", etc.), return a Tailwind color based on the word’s semantic feeling or emotional tone.

💡 For example:

"JavaScript" → yellow (brand color)

"React" → sky (matches blue/light blue branding)

"Career" → lime (growth-oriented)

"Design" → pink (creative and expressive)

"Community" → cyan (friendly and open)

"Writing" → orange (energetic, expressive)

❌ Do not include the prefix text- or any extra formatting.
✅ Output only the raw color name (like yellow, blue, pink, etc.).

Now, give the color for: ${tagName}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return text;
}