import { LanguagesFormValues } from "@/schemas/languages";

type LanguagesRow = {
  languages?: string | null;
};

function safeParseJSON(value: string | null | undefined): unknown {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

export function normalizeLanguagesFromRow(
  row: LanguagesRow
): LanguagesFormValues {
  const parsedLanguages = safeParseJSON(row.languages);
  const languages = Array.isArray(parsedLanguages)
    ? parsedLanguages
        .map((item) => {
          const language = item as {
            language?: unknown;
            proficiency?: unknown;
          };
          const name =
            typeof language.language === "string"
              ? language.language.trim()
              : "";
          const proficiency =
            typeof language.proficiency === "string"
              ? language.proficiency.trim()
              : "";
          return { language: name, proficiency };
        })
        .filter((item) => item.language && item.proficiency)
    : [];

  return {
    languages,
  };
}

export function serializeLanguagesForStorage(value: LanguagesFormValues): {
  languages: string;
} {
  const languages = (value.languages ?? [])
    .map((language) => ({
      language: language.language.trim(),
      proficiency: language.proficiency.trim(),
    }))
    .filter((language) => language.language && language.proficiency);

  return {
    languages: JSON.stringify(languages),
  };
}
