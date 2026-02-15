"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ExternalLoginButtons } from "@/components/auth/external-login-buttons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils/cn";

import { ROUTES } from "@/config/routes";

const FormSchema = z.object({
  email: z.email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!isLoaded || !signIn) return;

    try {
      setIsSubmitting(true);

      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push(ROUTES.DASHBOARD);
      } else {
        // Handle other statuses if needed (e.g., needs_first_factor, needs_second_factor for MFA)
        console.log("Sign-in status:", signInAttempt.status);
        form.setError("email", {
          message: "Sign-in could not be completed. Please try again.",
        });
      }
    } catch (err: any) {
      const errorMessage =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        "Invalid email or password.";

      form.setError("email", { message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <FormField
                  control={form.control}
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <a
                          href="#"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(ROUTES.FORGOT_PASSWORD);
                          }}
                        >
                          Forgot your password?
                        </a>
                      </div>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FieldGroup>
                  {/* Clerk CAPTCHA widget placeholder */}
                  <div
                    id="clerk-captcha"
                    data-cl-theme="auto"
                    data-cl-size="normal"
                    className="flex justify-center"
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                  <ExternalLoginButtons isSignupMode={false} />
                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <a
                      className="cursor-pointer underline"
                      onClick={() => router.push(ROUTES.SIGN_UP)}
                    >
                      Sign up
                    </a>
                  </FieldDescription>
                </FieldGroup>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
