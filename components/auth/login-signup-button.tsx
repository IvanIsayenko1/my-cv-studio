"use client";
import { useRouter } from "next/navigation";

import { useClerk, useUser } from "@clerk/nextjs";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";

export default function LoginSignupButton() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <Button variant="outline" disabled>
        <Spinner />
        Loading
      </Button>
    );
  }

  if (isLoaded && isSignedIn) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" aria-label="Submit">
            <User />
            Welcome, {user?.firstName}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>User management</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              variant="destructive"
              aria-label="Submit"
              className="w-full"
              size="sm"
              onClick={() => signOut()}
            >
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
