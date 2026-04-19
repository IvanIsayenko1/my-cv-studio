"use client";

import { ExternalLoginButtons } from "@/components/auth/external-login-buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils/cn";

import ClickableLogo from "../shared/clickable-logo";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            <ClickableLogo />
          </CardTitle>
          <CardDescription>Choose your preferred login method</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <ExternalLoginButtons isSignupMode={false} />
        </CardContent>
      </Card>
    </div>
  );
}
