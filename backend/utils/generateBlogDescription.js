import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateBlogDescription = async (title, shortDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Write a compelling and well-structured blog description based on the following information, designed to engage readers of a modern tech blog:

Title: ${title}
Short Description: ${shortDescription}

The blog description must be a human-like narrative, divided into 4–5 natural, flowing paragraphs, and crafted with a professional, dynamic tone.

## **Introduction:**
Begin with a powerful, attention-grabbing hook that immediately pulls readers into the core dilemma or intriguing concept of the topic. Avoid generic introductions. Think storytelling or a provocative question that resonates with common experiences in tech.

---

## **Elaboration and Real-World Context:**
Expand on the central idea by providing informative, real-world context and illustrative scenarios. Dive deeper into *why* this topic matters, *what* its implications are, or *how* it manifests in practical situations. Use narrative flow to connect ideas seamlessly, making the abstract concrete.

---

## **Benefits, Opportunities, and Implications:**
Clearly articulate the benefits, opportunities, or potential implications of embracing the concepts discussed in the blog. Explain how adopting these ideas can lead to tangible improvements, growth, or solutions. This section should offer a clear "what's in it for the reader."

---

## **Call to Action/Inspiration:**
Conclude with an inspiring or motivating paragraph that encourages readers to reflect, take interest, or initiate action. This should be more than just a summary; it should leave them with a lasting thought, a sense of empowerment, or a challenge to evolve their approach.

---

### **Stylistic Guidelines for the Blog Description:**
* **Emphasis and Headings:** Use **bold** for keywords, important phrases, and to create clear, visually distinct sections or sub-points within paragraphs where appropriate.
* *Tone and Nuance*: Use *italics* to convey a specific tone, add nuance, or highlight subtle yet crucial ideas.
* [Relevant Links](https://example.com): Incorporate placeholder links where relevant concepts or terms could realistically point to external resources or further reading (replace "example.com" with a suitable placeholder).
* **Readability Enhancements:** Employ bullet points judiciously within paragraphs to break down complex information or list key takeaways, enhancing readability without fragmenting the narrative.
* <p style="font-size:18px">Varying Font Sizes:</p> Integrate subtle variations in font size using inline HTML tags like <p style="font-size:18px"> for emphasis on specific sentences or concepts, or if a small introductory or concluding thought needs to stand out slightly. Avoid excessive use of H2/H3 within the description itself; they are primarily for the prompt's structure.

The final output should emulate the style of a compelling blog introduction by a professional content writer for a modern tech blog. It should be dynamic, persuasive, and avoid any robotic or repetitive phrasing. Absolutely refrain from using generic statements like “This blog explores…” or “In this article, we will…” Instead, launch directly into the core subject with a strong narrative hook.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.trim();
  } catch (error) {
    console.error("AI generation error:", error);
    return null;
  }
};
