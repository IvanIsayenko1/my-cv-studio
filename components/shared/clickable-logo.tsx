import Link from "next/link";

import { ROUTES } from "@/config/routes";

export default function ClickableLogo() {
  return (
    <div className="shrink-0">
      <Link href={ROUTES.HOME} aria-label="Go to mycvstudio home page">
        <p className="font-display text-xl leading-none font-normal tracking-tight sm:text-2xl">
          my<span className="font-bold">cv</span>studio
        </p>
      </Link>
    </div>
  );
}
