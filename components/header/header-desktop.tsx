import Link from "next/link";

import { cn } from "@/lib/utils/cn";
import { isURLActive } from "@/lib/utils/url-helper";

import { ROUTES } from "@/config/routes";

import LoginSignupButton from "../auth/login-signup-button";
import { ThemeSwitcher } from "../layout/theme-switcher";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

export default function HeaderDesktop() {
  return (
    <div className="hidden sm:flex items-center justify-end space-x-1 sm:space-x-2 gap-1 sm:gap-2 w-full">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(
                navigationMenuTriggerStyle(),
                isURLActive(ROUTES.HOME) && "text-primary bg-primary/10"
              )}
            >
              <Link href={ROUTES.HOME}>Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
              active={isURLActive(ROUTES.MAKER)}
            >
              <Link href={ROUTES.MAKER}>Maker</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href={""}>Checker</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Right: Action Buttons */}
      <div className="flex items-center space-x-1 sm:space-x-2 gap-1 sm:gap-2">
        <LoginSignupButton />
        <ThemeSwitcher />
      </div>
    </div>
  );
}
