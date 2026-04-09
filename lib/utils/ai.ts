import { BASE_CV_REVIEWER_PROMPT } from "../constants/ai-prompts";

export const buildPrompt = <T>(object: T, specificField: string) => `
${BASE_CV_REVIEWER_PROMPT}

You will receive this object:

${JSON.stringify(object, null, 2)}

Analyze ONLY the requested field module below.

${specificField}
`;
