"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

import { RESOLUTIONS } from "@/lib/constants/resolutions";

import HeaderDesktop from "./header-desktop";
import HeaderMobile from "./header-mobile";

export default function ResponsiveHeader() {
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);

  if (isDesktop) {
    return <HeaderDesktop />;
  }

  return <HeaderMobile />;
}
