import { SkillsFormValues } from "@/types/skills";

type LegacySkillsRow = {
  coreCompetencies?: string | null;
  toolsAndTechnologies?: string | null;
  systemsAndMethodologies?: string | null;
  collaborationAndDelivery?: string | null;
  languages?: string | null;
};

type SkillCategory = SkillsFormValues["skills"]["categories"][number];

function safeParseJSON(value: string | null | undefined): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

const toCleanStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const toCategoriesFromLegacy = (row: LegacySkillsRow): SkillCategory[] => {
  const groups: SkillCategory[] = [
    {
      name: "Core Competencies",
      items: toCleanStringArray(safeParseJSON(row.coreCompetencies)),
    },
    {
      name: "Tools & Technologies",
      items: toCleanStringArray(safeParseJSON(row.toolsAndTechnologies)),
    },
    {
      name: "Systems & Methodologies",
      items: toCleanStringArray(safeParseJSON(row.systemsAndMethodologies)),
    },
    {
      name: "Collaboration & Delivery",
      items: toCleanStringArray(safeParseJSON(row.collaborationAndDelivery)),
    },
  ];

  return groups.filter((group) => group.items.length > 0);
};

const toCategoriesFromStoredCore = (coreValue: unknown): SkillCategory[] => {
  if (!Array.isArray(coreValue)) return [];

  const first = coreValue[0];
  if (!first || typeof first !== "object") return [];

  return coreValue
    .map((item) => {
      const category = item as { name?: unknown; items?: unknown };
      const name =
        typeof category.name === "string" ? category.name.trim() : "";
      const items = toCleanStringArray(category.items);
      return { name, items };
    })
    .filter((category) => category.name && category.items.length > 0);
};

export function normalizeSkillsFromRow(row: LegacySkillsRow): SkillsFormValues {
  const parsedCore = safeParseJSON(row.coreCompetencies);
  const categories =
    toCategoriesFromStoredCore(parsedCore).length > 0
      ? toCategoriesFromStoredCore(parsedCore)
      : toCategoriesFromLegacy(row);

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
    skills: {
      categories:
        categories.length > 0
          ? categories
          : [{ name: "Core Skills", items: [""] }],
      languages,
    },
  };
}

export function serializeSkillsForStorage(value: SkillsFormValues["skills"]): {
  coreCompetencies: string;
  toolsAndTechnologies: string;
  systemsAndMethodologies: string;
  collaborationAndDelivery: string;
  languages: string;
} {
  const categories = (value.categories ?? [])
    .map((category) => ({
      name: category.name.trim(),
      items: (category.items ?? []).map((item) => item.trim()).filter(Boolean),
    }))
    .filter((category) => category.name && category.items.length > 0);

  const languages = (value.languages ?? [])
    .map((language) => ({
      language: language.language.trim(),
      proficiency: language.proficiency.trim(),
    }))
    .filter((language) => language.language && language.proficiency);

  return {
    coreCompetencies: JSON.stringify(categories),
    toolsAndTechnologies: JSON.stringify([]),
    systemsAndMethodologies: JSON.stringify([]),
    collaborationAndDelivery: JSON.stringify([]),
    languages: JSON.stringify(languages),
  };
}
