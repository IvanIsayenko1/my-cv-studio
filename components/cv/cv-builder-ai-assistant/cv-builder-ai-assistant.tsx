import { useState } from "react";

import { askGroq } from "@/app/actions/groq";
import { SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { buildPrompt } from "@/lib/utils/ai";

export default function CVBuilderAIAssistant<T>({
  value,
  prompt,
  handleResponse,
}: {
  value: any;
  prompt: string;
  handleResponse: (response: T | null) => void;
}) {
  const [loading, setLoading] = useState(false);

  const simulateAiResponse = async (): Promise<T> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          results: [
            {
              field: "professionalTitle",
              score: 6,
              summary:
                "The professional title is clear but could be more concise and ATS-friendly",
              issues: ["Lack of standard job title", "Could be more concise"],
              typos: {
                hasTypos: false,
                details: [],
              },
              improvements: {
                atsOptimized: "Frontend Engineer - React, TypeScript",
                balanced: "Senior Frontend Engineer (React, TypeScript)",
                humanFriendly:
                  "Experienced Frontend Engineer specializing in React and TypeScript",
              },
              keywords: {
                detected: ["Frontend Engineer", "React", "TypeScript"],
                missing: ["Senior", "JavaScript"],
              },
            },
            {
              field: "email",
              score: 5,
              summary:
                "The email is professional and easy to read, but could be more consistent with the candidate's name",
              issues: ["Lack of consistency with candidate name"],
              typos: {
                hasTypos: false,
                details: [],
              },
              isProfessional: true,
              suggestions: ["ivan.isayenko@gmail.com", "iisayenko@gmail.com"],
            },
          ],
        } as T);
      }, 2000);
    });
  };

  return (
    <Button
      variant="outline"
      type="button"
      onClick={async () => {
        setLoading(true);
        let response: any | null = null;
        try {
          // response = await askGroq<any>(buildPrompt(value, prompt));
          response = await simulateAiResponse();
        } finally {
          setLoading(false);
        }

        handleResponse(response);
      }}
      disabled={loading}
    >
      {loading && <Spinner />}
      <SparklesIcon aria-hidden="true" />
      <p>Improve with AI</p>
    </Button>
  );
}
