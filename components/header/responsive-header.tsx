import HeaderDesktop from "./header-desktop";
import HeaderMobileMenu from "./header-mobile-menu";

export default function ResponsiveHeader() {
  return (
    <>
      <div className="hidden md:flex md:justify-end">
        <HeaderDesktop />
      </div>
      <div className="md:hidden">
        <HeaderMobileMenu />
      </div>
    </>
  );
}
