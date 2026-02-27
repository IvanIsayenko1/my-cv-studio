import { db } from "@/lib/db/client";

let ensureCategorySkillsColumnPromise: Promise<void> | null = null;

export async function ensureCvSkillsCategorySkillsColumn() {
  if (ensureCategorySkillsColumnPromise) {
    return ensureCategorySkillsColumnPromise;
  }

  ensureCategorySkillsColumnPromise = (async () => {
    const result = await db.execute("PRAGMA table_info(cv_skills)");
    const columns = (result.rows as Array<{ name?: unknown }>)
      .map((row) => row.name)
      .filter((name): name is string => typeof name === "string");

    const hasCategorySkills = columns.includes("categorySkills");
    const hasSkillCategories = columns.includes("skillCategories");
    const hasCoreCompetencies = columns.includes("coreCompetencies");

    if (!hasCategorySkills) {
      await db.execute("ALTER TABLE cv_skills ADD COLUMN categorySkills TEXT");
    }

    // Backfill new generic column from previously used columns when empty.
    if (hasSkillCategories) {
      await db.execute(
        `UPDATE cv_skills
         SET categorySkills = skillCategories
         WHERE (categorySkills IS NULL OR categorySkills = '')
           AND skillCategories IS NOT NULL
           AND skillCategories != ''`
      );
    }

    if (hasCoreCompetencies) {
      await db.execute(
        `UPDATE cv_skills
         SET categorySkills = coreCompetencies
         WHERE (categorySkills IS NULL OR categorySkills = '')
           AND coreCompetencies IS NOT NULL
           AND coreCompetencies != ''`
      );
    }
  })().catch((error) => {
    ensureCategorySkillsColumnPromise = null;
    throw error;
  });

  return ensureCategorySkillsColumnPromise;
}
