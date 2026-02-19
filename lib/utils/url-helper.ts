import { usePathname } from "next/navigation";

import { ROUTES } from "@/config/routes";

export const isURLActive = (path: (typeof ROUTES)[keyof typeof ROUTES]) => {
  const pathname = usePathname();
  return pathname.includes(path);
};
