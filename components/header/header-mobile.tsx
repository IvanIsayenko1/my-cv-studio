import { useState } from "react";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export default function HeaderMobile() {
  const { theme, setTheme } = useTheme();
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const isURLActive = useIsURLActive();

  // state of the sheet
  const [open, setOpen] = useState(false);

  const navigateAndCloseSheet = (
    href: (typeof ROUTES)[keyof typeof ROUTES]
  ) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-lg" aria-label="Open menu">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="top" className="h-[100dvh] max-h-[100dvh] p-0">
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col p-2 gap-2">
          <Button
            variant="ghost"
            className={cn(
              "font-normal h-14 flex flex-row justify-between",
              isURLActive(ROUTES.HOME, { exact: true }) &&
                "text-primary bg-primary/10"
            )}
            onClick={() => navigateAndCloseSheet(ROUTES.HOME)}
          >
            Home
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "font-normal h-14 flex flex-row justify-between",
              isURLActive(ROUTES.MAKER) && "text-primary bg-primary/10"
            )}
            onClick={() => navigateAndCloseSheet(ROUTES.MAKER)}
          >
            Maker
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "font-normal h-14 flex flex-row justify-between",
              isURLActive(ROUTES.CHECKER, { exact: true }) &&
                "text-primary bg-primary/10"
            )}
            onClick={() => navigateAndCloseSheet(ROUTES.CHECKER)}
          >
            Checker
          </Button>
          <Separator className="my-4" />
          <div className="flex items-center justify-between h-12 mx-4 text-sm">
            <span>Theme</span>
            <ToggleGroup
              size="lg"
              defaultValue={theme}
              variant="outline"
              type="single"
              onValueChange={setTheme}
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

          <Separator className="my-4" />
          <div className="flex items-center justify-between h-12 mx-4 text-sm">
            {isLoaded && isSignedIn ? (
              <span>{user?.emailAddresses[0].emailAddress}</span>
            ) : null}
            {isSignedIn ? (
              <Button
                variant="destructive"
                aria-label="Submit"
                size="lg"
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="outline"
                aria-label="Submit"
                onClick={() => navigateAndCloseSheet(ROUTES.SIGN_IN)}
                size="lg"
                className="w-full"
              >
                <User />
                <span>Login/Signup</span>
              </Button>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
