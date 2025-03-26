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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UpdatePasswordSchema } from "@/validations/user-validation";
import { useFormState } from "react-dom";
import LoadingButton from "./loading-button";
import { updatePassword } from "@/actions/user-action";

const updatePasswordFormSchema = UpdatePasswordSchema;
type UpdatePasswordFormSchema = z.infer<typeof updatePasswordFormSchema>;

const initialState = {
  success: false,
  message: "",
  errors: null,
};

export default function UpdatePasswordForm() {
  const [state, formAction, pending] = useFormState(
    updatePassword,
    initialState
  );

  const form = useForm<UpdatePasswordFormSchema>({
    resolver: zodResolver(updatePasswordFormSchema),
  });

  const { control, setError, reset } = form;

  React.useEffect(() => {
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          setError(field as "password" | "new_password" | "confirm", {
            message: errors[0],
          });
        }
      });
    }
  }, [setError, state]);

  React.useEffect(() => {
    if (state?.success) {
      toast.success("Succes", {
        description: "Password updated successfully",
      });

      reset({
        password: "",
        new_password: "",
        confirm: "",
      });
    }
  }, [state, reset]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
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
          <LoadingButton processing={pending} label="Save" />
        </div>
      </form>
    </Form>
  );
}
