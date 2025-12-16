"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { passwordValidation } from "@/utils/password-validation";
import { ExternalLoginButtons } from "./external-login-buttons";
import { routes } from "@/const/routes";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { OTPForm } from "./otp-form";
import { useSignUp } from "@clerk/nextjs";
import { Spinner } from "./ui/spinner";

const FormSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name is required.",
    }),
    email: z.email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password must be at least 8 characters long.",
    }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    const passwordError = passwordValidation(password);
    const confirmPasswordError = passwordValidation(confirmPassword);
    if (passwordError) {
      ctx.addIssue({
        code: "custom",
        message: passwordError,
        path: ["password"],
      });
    }
    if (confirmPasswordError) {
      ctx.addIssue({
        code: "custom",
        message: confirmPasswordError,
        path: ["confirmPassword"],
      });
    }
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
    }
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const { signUp, isLoaded } = useSignUp();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      // Create account with Clerk
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.name,
      });

      // Send verification code (if required)
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Switch to OTP form state
      setPendingVerification(true);
    } catch (err: any) {
      // Handle and display errors (e.g., set error state for UI display)
      form.setError("email", {
        message: err.errors?.[0]?.message || err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return <OTPForm />;
  }

  return (
    <Form {...form}>
      <Card {...props}>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FieldGroup>
                <Field>
                  {/* Clerk CAPTCHA widget placeholder */}
                  <div
                    id="clerk-captcha"
                    data-cl-theme="auto"
                    data-cl-size="normal"
                    className="flex justify-center"
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Spinner /> Creating...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                  <ExternalLoginButtons isSignupMode={true} />
                  <FieldDescription className="px-6 text-center">
                    Already have an account?{" "}
                    <a onClick={() => router.push(routes.signIn)}>Sign in</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}
