"use client";

import { useRouter } from "next/navigation";

import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Skeleton } from "../ui/skeleton";

export default function LoginSignupButton() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!isLoaded) {
    return <Skeleton className="w-[40px] h-[40px]" />;
  }

  if (isLoaded && isSignedIn) {
    const displayName =
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      user?.username ||
      "Account";
    const email = user?.emailAddresses[0]?.emailAddress || "";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            aria-label="Open account menu"
            size="icon-lg"
          >
            <User />
            <span className="sr-only">Account</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <div className="rounded-md border border-border/70 bg-muted/40 p-3">
              <p className="truncate text-sm font-medium text-foreground">
                {displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              variant="destructive"
              aria-label="Logout"
              className="w-full"
              size="sm"
              onClick={() => signOut()}
            >
              <LogOut />
              Logout
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant="outline"
      aria-label="Submit"
      onClick={() => router.push("/login")}
    >
      <User />
      <span>Login/Signup</span>
    </Button>
  );
}
