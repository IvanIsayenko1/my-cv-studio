const META_PREFIX = "__EDU_META__";

type GradeMeta = {
  grade?: string;
  gradingScale?: string;
  honors?: string;
};

export function parseEducationMeta({
  gpa,
  honors,
}: {
  gpa?: number | null;
  honors?: string | null;
}): { grade?: string; gradingScale?: string; honors?: string } {
  if (honors?.startsWith(META_PREFIX)) {
    const raw = honors.slice(META_PREFIX.length);
    try {
      const parsed = JSON.parse(raw) as GradeMeta;
      return {
        grade: parsed.grade?.trim() || undefined,
        gradingScale: parsed.gradingScale?.trim() || undefined,
        honors: parsed.honors?.trim() || undefined,
      };
    } catch {
      // fallback below
    }
  }

  return {
    grade: gpa != null ? String(gpa) : undefined,
    gradingScale: undefined,
    honors: honors?.trim() || undefined,
  };
}

export function serializeEducationMeta({
  grade,
  gradingScale,
  honors,
}: {
  grade?: string;
  gradingScale?: string;
  honors?: string;
}): { gpa: number | null; honors: string | null } {
  const normalizedGrade = grade?.trim() || "";
  const normalizedScale = gradingScale?.trim() || "";
  const normalizedHonors = honors?.trim() || "";

  const numeric = Number(normalizedGrade);
  const canStoreAsNumber = normalizedGrade && !Number.isNaN(numeric);

  if (canStoreAsNumber && !normalizedScale && !normalizedHonors) {
    return { gpa: numeric, honors: null };
  }

  if (!normalizedGrade && !normalizedScale && !normalizedHonors) {
    return { gpa: null, honors: null };
  }

  const payload: GradeMeta = {
    grade: normalizedGrade || undefined,
    gradingScale: normalizedScale || undefined,
    honors: normalizedHonors || undefined,
  };

  return {
    gpa: null,
    honors: `${META_PREFIX}${JSON.stringify(payload)}`,
  };
}

