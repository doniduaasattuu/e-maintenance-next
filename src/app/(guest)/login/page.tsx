"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserSchema } from "@/validations/user-validation";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { CustomAlert } from "@/components/ui/custom-alert";
import LoadingButton from "@/components/loading-button";

const loginFormSchema = LoginUserSchema;
type LoginFormSchema = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
  });

  const { handleSubmit, control } = form;

  const onLogin = handleSubmit(async (values) => {
    setIsLoading(true);
    try {
      const email = values.email;
      const password = values.password;

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      router.push("/home");
    } catch (e) {
      setMessage((e as Error).message);
      setIsLoading(false);
    }
  });

  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const handleShowPassword = (e: boolean) => {
    setShowPassword(e);
  };

  return (
    <Form {...form}>
      <form onSubmit={onLogin}>
        <Card className="min-w-[350px] max-w-[400px] mx-auto">
          <CardHeader>
            <CardTitle className="font-bold text-lg">Sign In</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-3">
                <CustomAlert message={error} variant="destructive" />
              </div>
            )}

            <div className="grid w-full items-center gap-4">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2">
                <Checkbox
                  id="show_password"
                  onCheckedChange={(e) => handleShowPassword(e as boolean)}
                />
                <label
                  htmlFor="show_password"
                  className="text-sm medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Show password
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col">
            <LoadingButton
              label="Login"
              type="submit"
              className="w-full"
              processing={isLoading}
            />
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link className="underline underline-offset-4" href="/register">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
