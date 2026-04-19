"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ROUTES } from "@/config/routes";

export function SignupForm() {
  const router = useRouter();

  useEffect(() => {
    // Redirect signup to login
    router.push(ROUTES.SIGN_IN);
  }, [router]);

  return null;
}
