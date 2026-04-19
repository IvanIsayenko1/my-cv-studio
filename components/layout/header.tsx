import ResponsiveHeader from "../header/responsive-header";
import ClickableLogo from "../shared/clickable-logo";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-2xl"
      aria-label="Site header"
    >
      <div className="mx-auto px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          {/* Left: Branding/Title */}
          <ClickableLogo />

          <div className="flex min-w-0 flex-1 justify-end">
            <ResponsiveHeader />
          </div>
        </div>
      </div>
    </header>
  );
}
