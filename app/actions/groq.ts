"use server";

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const REVIEW_MODEL = "llama-3.3-70b-versatile";
const REVIEW_SEED = 42;

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Explain the importance of fast language models",
      },
    ],
    model: REVIEW_MODEL,
    temperature: 0,
    seed: REVIEW_SEED,
  });
}

export async function askGroq<T>(prompt: string): Promise<T> {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: REVIEW_MODEL,
    temperature: 0,
    seed: REVIEW_SEED,
    response_format: {
      type: "json_object",
    },
  });

  const cleanReponse = (chatCompletion.choices[0]?.message?.content || "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanReponse) as T;
}
