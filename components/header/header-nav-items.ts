import { ROUTES } from "@/config/routes";

export const HEADER_NAV_ITEMS = [
  { href: ROUTES.HOME, label: "Home", exact: true },
  { href: ROUTES.MAKER, label: "Maker", exact: false },
  { href: ROUTES.CHECKER, label: "Checker", exact: true },
] as const;
