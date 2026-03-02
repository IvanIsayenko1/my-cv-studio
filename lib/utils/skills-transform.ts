import { SkillsFormValues } from "@/types/skills";

type SkillsRow = {
  categorySkills?: string | null;
};

type SkillCategory = SkillsFormValues["categories"][number];

function safeParseJSON(value: string | null | undefined): unknown {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

const toCategoryItemText = (value: unknown): string => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    const lines = value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);

    return lines.join("\n");
  }

  return "";
};

const toCategory = (value: unknown): SkillCategory | null => {
  if (!value || typeof value !== "object") return null;

  const category = value as { name?: unknown; items?: unknown };
  const name = typeof category.name === "string" ? category.name.trim() : "";
  const items = toCategoryItemText(category.items);

  if (!name || !items) return null;

  return { name, items };
};

const parseCategoriesFromCategorySkillsColumn = (
  value: string | null | undefined
): SkillCategory[] => {
  const parsed = safeParseJSON(value);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((item) => toCategory(item))
    .filter((item): item is SkillCategory => item !== null);
};

export function normalizeSkillsFromRow(row: SkillsRow): SkillsFormValues {
  const categories = parseCategoriesFromCategorySkillsColumn(
    row.categorySkills
  );

  return {
    categories:
      categories.length > 0 ? categories : [{ name: "Core Skills", items: "" }],
  };
}

export function serializeSkillsForStorage(value: SkillsFormValues): {
  categorySkills: string;
} {
  const categories = (value.categories ?? [])
    .map((category) => ({
      name: category.name.trim(),
      items: category.items.trim(),
    }))
    .filter((category) => category.name && category.items);

  return {
    categorySkills: JSON.stringify(categories),
  };
}
