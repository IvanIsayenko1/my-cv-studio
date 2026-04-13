import { useState } from "react";

import { askGroq } from "@/app/actions/groq";
import { SparklesIcon } from "lucide-react";
import { toast } from "sonner";
import { ZodType } from "zod";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { buildPrompt } from "@/lib/utils/ai";

export default function CVBuilderAIAssistant<T>({
  value,
  prompt,
  handleResponse,
  responseSchema,
}: {
  value: any;
  prompt: string;
  handleResponse: (response: T | null) => void;
  responseSchema?: ZodType<T>;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant="outline"
      type="button"
      onClick={async () => {
        setLoading(true);
        try {
          const rawResponse = await askGroq<unknown>(
            buildPrompt(value, prompt)
          );
          const response = responseSchema
            ? responseSchema.parse(rawResponse)
            : (rawResponse as T);
          handleResponse(response);
        } catch (error) {
          console.error(error);
          toast.error("The AI response did not match the expected format.");
          handleResponse(null);
        } finally {
          setLoading(false);
        }
      }}
      disabled={loading}
    >
      {loading && <Spinner />}
      <SparklesIcon aria-hidden="true" />
      <p>Improve with AI</p>
    </Button>
  );
}
