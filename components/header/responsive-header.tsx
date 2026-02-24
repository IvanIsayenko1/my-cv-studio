"use client";

import HeaderDesktop from "./header-desktop";
import HeaderMobile from "./header-mobile";

export default function ResponsiveHeader() {
  return (
    <>
      <div className="hidden md:flex md:justify-end">
        <HeaderDesktop />
      </div>
      <div className="md:hidden">
        <HeaderMobile />
      </div>
    </>
  );
}
