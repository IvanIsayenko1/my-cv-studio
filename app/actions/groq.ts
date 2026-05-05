"use server";

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const REVIEW_MODEL = "llama-3.3-70b-versatile";
const TAILOR_MODEL = "openai/gpt-oss-120b";
const REVIEW_SEED = 42;

function parseJsonResponse<T>(raw: string): T {
  const cleaned = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  return JSON.parse(cleaned) as T;
}

export async function askGroq<T>(prompt: string): Promise<T> {
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: REVIEW_MODEL,
    temperature: 0,
    seed: REVIEW_SEED,
    response_format: { type: "json_object" },
  });

  return parseJsonResponse<T>(
    chatCompletion.choices[0]?.message?.content || ""
  );
}

/**
 *
 * @param args
 * @returns Promise<T>
 * @description
 * This function sends a tailored prompt to the Groq API using the specified TAILOR_MODEL.
 * It expects the response to be in JSON format and parses it accordingly.
 * The prompt is constructed using the buildTailorMessages function, which combines the CV data and job offer description.
 * The function is designed to be used for tailoring CVs based on specific job offers, providing suggestions for improvements.
 */
export const askGroqTailor = async <T>(args: {
  system: string;
  user: string;
}): Promise<T> => {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: args.system },
      { role: "user", content: args.user },
    ],
    model: TAILOR_MODEL,
    temperature: 0,
    seed: REVIEW_SEED,
    response_format: { type: "json_object" },
  });

  return parseJsonResponse<T>(
    chatCompletion.choices[0]?.message?.content || ""
  );
};
