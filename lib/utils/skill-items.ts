export function categoryItemsToList(items: string): string[] {
  if (!items) return [];

  const text = items
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  return text
    .split("\n")
    .map((item) => item.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}
