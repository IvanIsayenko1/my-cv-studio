"use client";

import { useState } from "react";

import { useTheme } from "next-themes";
import Link from "next/link";

import { useClerk, useUser } from "@clerk/nextjs";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, User, X } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { useIsURLActive } from "@/lib/utils/url-helper";

import { ROUTES } from "@/config/routes";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { HEADER_NAV_ITEMS } from "./header-nav-items";

export default function HeaderMobileMenu() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const isURLActive = useIsURLActive();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="icon-lg" aria-label="Open menu">
          <Menu />
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/55 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "bg-background fixed inset-0 z-50 flex h-[100dvh] w-screen flex-col overflow-hidden",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200"
          )}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="space-y-0.5">
              <Dialog.Title className="text-base font-semibold">
                Menu
              </Dialog.Title>
              <Dialog.Description className="text-muted-foreground text-xs">
                Navigate and manage your account.
              </Dialog.Description>
            </div>

            <Dialog.Close asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Close menu">
                <X />
              </Button>
            </Dialog.Close>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-2">
              <p className="text-muted-foreground px-2 text-xs font-medium tracking-wide uppercase">
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
              <p className="text-muted-foreground px-2 text-xs font-medium tracking-wide uppercase">
                Appearance
              </p>
              <div className="flex flex-row items-center justify-between space-y-2 px-2">
                <span className="text-sm">Theme</span>
                <ToggleGroup
                  size="lg"
                  value={theme ?? "system"}
                  variant="outline"
                  type="single"
                  onValueChange={(value) => {
                    if (value) setTheme(value);
                  }}
                  className="justify-start"
                >
                  <ToggleGroupItem value="system" aria-label="Toggle system">
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

            <div className="space-y-3 pb-2">
              <p className="text-muted-foreground px-2 text-xs font-medium tracking-wide uppercase">
                Account
              </p>
              {isLoaded && isSignedIn ? (
                <div className="rounded-md p-3">
                  <p className="text-foreground truncate text-sm font-medium">
                    {[user?.firstName, user?.lastName]
                      .filter(Boolean)
                      .join(" ") ||
                      user?.username ||
                      "Account"}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {user?.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              ) : null}
              {isSignedIn ? (
                <Button
                  variant="destructive"
                  size="lg"
                  aria-label="Logout"
                  className="w-full"
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                >
                  Logout
                </Button>
              ) : (
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href={ROUTES.SIGN_IN} onClick={() => setOpen(false)}>
                    <User />
                    <span>Login/Signup</span>
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
