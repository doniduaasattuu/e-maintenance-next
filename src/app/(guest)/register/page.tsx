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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterUserSchema } from "@/validations/user-validation";
import LoadingButton from "@/components/loading-button";
import { createUser } from "@/actions/user-action";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { CustomAlert } from "@/components/ui/custom-alert";

const registerFormSchema = RegisterUserSchema;
type RegisterFormSchema = z.infer<typeof registerFormSchema>;

const initialState = {
  success: false,
  message: "",
  errors: null,
};

export default function RegisterPage() {
  const [state, formAction, pending] = useFormState(createUser, initialState);
  const [message, setMessage] = React.useState<string | null>(null);
  const router = useRouter();

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
  });
  const { control, setError, handleSubmit } = form;

  React.useEffect(() => {
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          setError(field as keyof RegisterFormSchema, {
            message: errors[0],
          });
        }
      });
    }
  }, [setError, state]);

  React.useEffect(() => {
    if (state.success) {
      setMessage(state.message);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }, [state, router]);

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    React.startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card className="min-w-[350px] max-w-[400px] mx-auto">
          <CardHeader>
            <CardTitle className="font-bold text-lg">Sign Up</CardTitle>
            <CardDescription>
              Enter your data below to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            {message && state.success && (
              <div className="mb-3">
                <CustomAlert header="Success" message={message} />
              </div>
            )}

            <div className="grid w-full items-center gap-4">
              <FormField
                control={control}
                name="nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIK</FormLabel>
                    <FormControl>
                      <Input inputMode="numeric" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input inputMode="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col">
            <LoadingButton
              label="Register"
              type="submit"
              className="w-full"
              processing={pending}
            />
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link className="underline underline-offset-4" href="/login">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
