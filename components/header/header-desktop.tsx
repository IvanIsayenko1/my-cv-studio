"use client";

import Link from "next/link";

import { cn } from "@/lib/utils/cn";
import { useIsURLActive } from "@/lib/utils/url-helper";

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
  const isURLActive = useIsURLActive();

  return (
    <div className="hidden sm:flex items-center justify-end space-x-1 sm:space-x-2 gap-1 sm:gap-2 w-full">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              active={isURLActive(ROUTES.HOME, { exact: true })}
              asChild
              className={cn(
                navigationMenuTriggerStyle(),
                isURLActive(ROUTES.HOME, { exact: true }) &&
                  "text-primary bg-primary/10"
              )}
            >
              <Link href={ROUTES.HOME}>Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              active={isURLActive(ROUTES.MAKER)}
              asChild
              className={cn(
                navigationMenuTriggerStyle(),
                isURLActive(ROUTES.MAKER) && "text-primary bg-primary/10"
              )}
            >
              <Link href={ROUTES.MAKER}>Maker</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              active={isURLActive(ROUTES.CHECKER, { exact: true })}
              asChild
              className={cn(
                navigationMenuTriggerStyle(),
                isURLActive(ROUTES.CHECKER, { exact: true }) &&
                  "text-primary bg-primary/10"
              )}
            >
              <Link href={ROUTES.CHECKER}>Checker</Link>
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
