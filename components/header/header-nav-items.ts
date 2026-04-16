import { ROUTES } from "@/config/routes";

export const HEADER_NAV_ITEMS = [
  { href: ROUTES.HOME, label: "Home", exact: true },
  { href: ROUTES.CV_LIST, label: "CV Builder", exact: false },
] as const;
