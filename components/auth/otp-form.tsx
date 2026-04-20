"use client";

import { FormEvent, useState } from "react";

import { useRouter } from "next/navigation";

import { useSignUp } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { ROUTES } from "@/config/routes";

export function OTPForm({ ...props }: React.ComponentProps<typeof Card>) {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    const formData = new FormData(e.currentTarget);
    const otp = String(formData.get("otp") || "").trim();
    if (otp.length !== 6) {
      setError("Please enter the 6‑digit code.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const attempt = await signUp.attemptEmailAddressVerification({
        code: otp,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.push(ROUTES.CV_LIST);
        return;
      }

      // If not complete, there may be additional requirements, or the email
      // may already be verified but signUp not finalized.
      setError("Verification not completed. Try again or continue sign in.");
    } catch (err: any) {
      const firstError = err?.errors?.[0];
      const code = firstError?.code;

      if (code === "verification_already_verified") {
        // Email is already verified; reload the signup and try to activate session
        try {
          await signUp.reload();
          if (signUp.status === "complete" && signUp.createdSessionId) {
            await setActive({ session: signUp.createdSessionId });
            router.push(ROUTES.CV_LIST);
            return;
          }
        } catch {
          // fall through to generic error
        }
      }

      const msg =
        firstError?.longMessage ||
        firstError?.message ||
        "Verification failed. Please request a new code.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Enter verification code</CardTitle>
        <CardDescription>We sent a 6-digit code to your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp">Verification code</FieldLabel>
              {/* Important: give InputOTP a name so FormData can read it */}
              <InputOTP maxLength={6} id="otp" name="otp" required>
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription>
                Enter the 6-digit code sent to your email.
              </FieldDescription>
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </Field>
            <FieldGroup>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify"}
              </Button>
              <FieldDescription className="text-center">
                Didn&apos;t receive the code?{" "}
                <Button
                  type="button"
                  variant="link"
                  onClick={async () => {
                    if (!isLoaded || !signUp) return;
                    try {
                      await signUp.prepareEmailAddressVerification({
                        strategy: "email_code",
                      });
                    } catch {
                      setError("Could not resend the code. Please try again.");
                    }
                  }}
                >
                  Resend
                </Button>
              </FieldDescription>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
