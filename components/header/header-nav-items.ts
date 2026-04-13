import { ROUTES } from "@/config/routes";

export const HEADER_NAV_ITEMS = [
  { href: ROUTES.HOME, label: "Home", exact: true },
  { href: ROUTES.MAKER, label: "CV Builder", exact: false },
] as const;
