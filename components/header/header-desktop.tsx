"use client";

import Link from "next/link";

import { cn } from "@/lib/utils/cn";
import { useIsURLActive } from "@/lib/utils/url-helper";

import LoginButton from "../auth/login-button";
import { ThemeSwitcher } from "../layout/theme-switcher";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { HEADER_NAV_ITEMS } from "./header-nav-items";

export default function HeaderDesktop() {
  const isURLActive = useIsURLActive();

  return (
    <div className="flex items-center justify-end gap-3">
      <NavigationMenu>
        <NavigationMenuList className="gap-1">
          {HEADER_NAV_ITEMS.map((item) => {
            const isActive = isURLActive(item.href, { exact: item.exact });

            return (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  active={isActive}
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "px-3",
                    isActive && "bg-primary/20 text-primary"
                  )}
                >
                  <Link href={item.href}>{item.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex shrink-0 items-center gap-2">
        <LoginButton />
        <ThemeSwitcher />
      </div>
    </div>
  );
}
