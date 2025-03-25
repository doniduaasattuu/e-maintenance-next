"use client";
import React from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UpdatePasswordSchema } from "@/validations/user-validation";

const updatePasswordFormSchema = UpdatePasswordSchema;
type UpdatePasswordFormSchema = z.infer<typeof updatePasswordFormSchema>;

export default function UpdatePasswordForm() {
  // UPDATE USER FORM
  const updatePasswordForm = useForm<UpdatePasswordFormSchema>({
    resolver: zodResolver(updatePasswordFormSchema),
    defaultValues: {
      password: "",
      new_password: "",
      confirm: "",
    },
  });

  const { handleSubmit, control, setError, reset } = updatePasswordForm;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.field) {
          setError(result.field, { type: "server", message: result.message });
        }
        return;
      }

      toast.success("Success", {
        description: "Password successfully updated",
      });

      reset({
        password: "",
        new_password: "",
        confirm: "",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error", {
          description: error.message,
        });
      }
    }
  });

  return (
    <Form {...updatePasswordForm}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="new_password"
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="confirm"
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-3">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
