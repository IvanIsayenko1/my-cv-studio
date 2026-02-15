import LoginSignupButton from "@/components/auth/login-signup-button";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left: Branding/Title */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h1 className="text-lg sm:text-xl font-semibold">MyCVStudio</h1>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 gap-1 sm:gap-2">
            <LoginSignupButton />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
