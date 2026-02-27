type Link = { label: string; url: string };
type PersonalLinksInput = {
  professionalLinks?: Array<{ label?: string; url?: string }>;
  linkedIn?: string | null;
  portfolio?: string | null;
};

const V2_PREFIX = "__LINKS_V2__";

function isValidURL(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function parseProfessionalLinksFromStorage({
  linkedIn,
  portfolio,
}: {
  linkedIn?: string | null;
  portfolio?: string | null;
}): Link[] {
  const links: Link[] = [];

  if (linkedIn && isValidURL(linkedIn)) {
    links.push({ label: "LinkedIn", url: linkedIn });
  }

  if (portfolio) {
    if (portfolio.startsWith(V2_PREFIX)) {
      const raw = portfolio.slice(V2_PREFIX.length);
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          parsed.forEach((item) => {
            const link = item as { label?: unknown; url?: unknown };
            if (
              typeof link.label === "string" &&
              typeof link.url === "string" &&
              link.label.trim() &&
              isValidURL(link.url.trim())
            ) {
              links.push({ label: link.label.trim(), url: link.url.trim() });
            }
          });
        }
      } catch {
        // no-op fallback below
      }
    } else if (isValidURL(portfolio)) {
      links.push({ label: "Portfolio", url: portfolio });
    }
  }

  const seen = new Set<string>();
  return links.filter((link) => {
    const key = `${link.label.toLowerCase()}::${link.url.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function serializeProfessionalLinksForStorage(
  values: PersonalLinksInput
): { linkedIn: string | null; portfolio: string | null } {
  const normalized = (values.professionalLinks ?? [])
    .map((link) => {
      const label = typeof link.label === "string" ? link.label.trim() : "";
      const url = typeof link.url === "string" ? link.url.trim() : "";
      return { label, url };
    })
    .filter((link) => link.label && isValidURL(link.url));

  if (normalized.length === 0) {
    return {
      linkedIn:
        typeof values.linkedIn === "string"
          ? values.linkedIn.trim() || null
          : null,
      portfolio:
        typeof values.portfolio === "string"
          ? values.portfolio.trim() || null
          : null,
    };
  }

  const linkedIn =
    normalized.find((link) => link.label.toLowerCase() === "linkedin")?.url ??
    null;

  return {
    linkedIn,
    portfolio: `${V2_PREFIX}${JSON.stringify(normalized)}`,
  };
}
