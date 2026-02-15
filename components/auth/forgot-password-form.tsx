"use client";

import { FormEvent, useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { passwordValidation } from "@/lib/utils/password-validation";

import { ROUTES } from "@/config/routes";

const EmailFormSchema = z.object({
  email: z.email({
    message: "Please enter a valid email address.",
  }),
});

export function ForgotPasswordForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailForm = useForm<z.infer<typeof EmailFormSchema>>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // Send password reset code
  const onEmailSubmit = async (data: z.infer<typeof EmailFormSchema>) => {
    if (!isLoaded || !signIn) return;

    try {
      setIsSubmitting(true);

      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });

      setEmail(data.email);
      setSuccessfulCreation(true);
    } catch (err: any) {
      const errorMessage =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        "Failed to send reset code. Please try again.";
      emailForm.setError("email", { message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset password with code
  const onResetSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    const formData = new FormData(e.currentTarget);
    const code = String(formData.get("code") || "").trim();
    const password = String(formData.get("password") || "").trim();
    const confirmPassword = String(
      formData.get("confirmPassword") || ""
    ).trim();

    // Validate
    if (code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const passwordError = passwordValidation(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code,
        password: password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(ROUTES.DASHBOARD);
      } else {
        setError("Password reset could not be completed. Please try again.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        "Invalid code or password. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded || !signIn) return;
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setError(null);
    } catch {
      setError("Could not resend code. Please try again.");
    }
  };

  if (!successfulCreation) {
    return (
      <Card {...props}>
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a code to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
              <FieldGroup>
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send reset code"}
                </Button>
                <FieldDescription className="text-center">
                  Remember your password?{" "}
                  <a
                    className="cursor-pointer underline"
                    onClick={() => router.push(ROUTES.SIGN_IN)}
                  >
                    Sign in
                  </a>
                </FieldDescription>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to {email} and your new password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onResetSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="code">Verification code</FieldLabel>
              <InputOTP maxLength={6} id="code" name="code" required>
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
            </Field>
            <Field>
              <FieldLabel htmlFor="password">New Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter new password"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                required
              />
            </Field>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Resetting..." : "Reset password"}
            </Button>
            <FieldDescription className="text-center">
              Didn&apos;t receive the code?{" "}
              <Button type="button" variant="link" onClick={handleResend}>
                Resend
              </Button>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
