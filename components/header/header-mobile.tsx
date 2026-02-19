import { useState } from "react";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useClerk, useUser } from "@clerk/nextjs";
import { Menu, User } from "lucide-react";

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
        <Button variant="outline" size="icon" aria-label="Open menu">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="top" className="h-[100dvh] max-h-[100dvh] p-0">
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col p-2">
          <Button
            variant="ghost"
            className="justify-start h-12"
            onClick={() => navigateAndCloseSheet(ROUTES.HOME)}
          >
            Home
          </Button>
          <Button
            variant="ghost"
            className="justify-start h-12"
            onClick={() => navigateAndCloseSheet(ROUTES.MAKER)}
          >
            Maker
          </Button>
          <Button
            variant="ghost"
            className="justify-start h-12"
            onClick={() => navigateAndCloseSheet(ROUTES.HOME)}
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

          <Separator className="my-4" />
          {isSignedIn ? (
            <Button
              variant="destructive"
              aria-label="Submit"
              className="w-full"
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
            >
              <User />
              <span>Login/Signup</span>
            </Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
