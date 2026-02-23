import { useState } from "react";

import { useTheme } from "next-themes";
import Link from "next/link";

import { useClerk, useUser } from "@clerk/nextjs";
import { Menu, User } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { useIsURLActive } from "@/lib/utils/url-helper";

import { ROUTES } from "@/config/routes";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { HEADER_NAV_ITEMS } from "./header-nav-items";

export default function HeaderMobile() {
  const { theme, setTheme } = useTheme();
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const isURLActive = useIsURLActive();

  // state of the sheet
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-lg" aria-label="Open menu">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="top" className="h-[100dvh] max-h-[100dvh] p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Navigate and manage your account.</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
          <div className="space-y-2">
            <p className="px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Navigation
            </p>
            {HEADER_NAV_ITEMS.map((item) => {
              const isActive = isURLActive(item.href, { exact: item.exact });

              return (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  className={cn(
                    "h-14 w-full justify-between px-4 font-normal",
                    isActive && "bg-primary/10 text-primary"
                  )}
                >
                  <Link href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>

          <Separator className="my-5" />

          <div className="space-y-3">
            <p className="px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Appearance
            </p>
            <div className="flex min-h-12 items-center justify-between gap-3 px-2">
              <span className="text-sm">Theme</span>
              <ToggleGroup
                size="lg"
                defaultValue={theme}
                variant="outline"
                type="single"
                onValueChange={(value) => {
                  if (value) {
                    setTheme(value);
                  }
                }}
              >
                <ToggleGroupItem
                  value="system"
                  aria-label="Toggle system"
                  className="h-10"
                >
                  System
                </ToggleGroupItem>
                <ToggleGroupItem value="dark" aria-label="Toggle dark">
                  Dark
                </ToggleGroupItem>
                <ToggleGroupItem value="light" aria-label="Toggle light">
                  Light
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="space-y-3">
            <p className="px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Account
            </p>
            {isLoaded && isSignedIn ? (
              <p className="px-2 text-sm text-muted-foreground">
                Signed in as{" "}
                <span className="block max-w-[70vw] truncate text-foreground">
                  {user?.emailAddresses[0].emailAddress}
                </span>
              </p>
            ) : null}
            {isSignedIn ? (
              <Button
                variant="destructive"
                size="lg"
                className="w-full"
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
              >
                Logout
              </Button>
            ) : (
              <Button asChild variant="outline" size="lg">
                <Link href={ROUTES.SIGN_IN} onClick={() => setOpen(false)}>
                  <User />
                  <span>Login/Signup</span>
                </Link>
              </Button>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
