"use client";
import React from "react";

import {
  Form,
  FormControl,
  FormDescription,
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
import LoadingButton from "./loading-button";
import { CreateFunctionalLocationSchema } from "@/validations/functional-location-validation";
import { useFormState } from "react-dom";
import { createFunctionalLocation } from "@/actions/functional-location-action";
import Link from "next/link";

const createFunctionalLocationFormSchema = CreateFunctionalLocationSchema;
type CreateFunctionalLocationSchema = z.infer<
  typeof createFunctionalLocationFormSchema
>;

const initialState = {
  success: false,
  message: "",
  errors: null,
};

export default function FunctionalLocationCreateForm() {
  const [lastInserted, setLastInserted] = React.useState<string | null>(null);
  const [state, formAction, pending] = useFormState(
    createFunctionalLocation,
    initialState
  );
  const form = useForm<CreateFunctionalLocationSchema>({
    resolver: zodResolver(createFunctionalLocationFormSchema),
  });

  const { control, setError, setFocus, reset, handleSubmit, getValues } = form;

  React.useEffect(() => {
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, errors], index: number) => {
        if (index === 0) {
          setFocus(field as keyof CreateFunctionalLocationSchema);
        }

        if (errors && errors.length > 0) {
          setError(field as keyof CreateFunctionalLocationSchema, {
            message: errors[0],
          });
        }
      });
    }
  }, [setError, setFocus, state]);

  React.useEffect(() => {
    if (state.success) {
      toast.success("Success", {
        description: state.message,
      });

      setLastInserted(getValues("id"));

      reset({
        id: "",
        description: "",
      });
    }
  }, [state, reset, getValues]);

  const onCreate = handleSubmit((values) => {
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
      <form onSubmit={onCreate} className="space-y-4">
        <FormField
          control={control}
          name="id"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>ID</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    const upperValue = e.target.value.toUpperCase();
                    field.onChange(upperValue);
                  }}
                />
              </FormControl>
              {lastInserted && (
                <FormDescription>
                  <span>Last inserted: </span>
                  <Link
                    className="hover:text-foreground"
                    href={`/functional-locations/${lastInserted}`}
                  >
                    {lastInserted}
                  </Link>
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-3">
          <LoadingButton processing={pending} label="Submit" type="submit" />
        </div>
      </form>
    </Form>
  );
}
