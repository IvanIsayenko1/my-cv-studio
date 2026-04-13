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
    return <Skeleton className="h-[40px] w-[40px]" />;
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
            <div className="border-border/70 bg-muted/40 rounded-md border p-3">
              <p className="text-foreground truncate text-sm font-medium">
                {displayName}
              </p>
              <p className="text-muted-foreground truncate text-xs">{email}</p>
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
              {/* <LogOut /> */}
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
