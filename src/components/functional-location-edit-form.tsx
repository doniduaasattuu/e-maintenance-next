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
import LoadingButton from "./loading-button";
import { EditFunctionalLocationSchema } from "@/validations/functional-location-validation";
import { useFormState } from "react-dom";
import { editFunctionalLocation } from "@/actions/functional-location-action";

const editFunctionalLocationFormSchema = EditFunctionalLocationSchema;
type EditFunctionalLocationSchema = z.infer<
  typeof editFunctionalLocationFormSchema
>;

const initialState = {
  success: false,
  message: "",
  errors: null,
};

type FunctionalLocationEditProps = {
  functionalLocation: {
    id: string;
    description: string;
  };
};

export default function FunctionalLocationEditForm({
  functionalLocation,
}: FunctionalLocationEditProps) {
  const [state, formAction, pending] = useFormState(
    editFunctionalLocation,
    initialState
  );
  const form = useForm<EditFunctionalLocationSchema>({
    resolver: zodResolver(editFunctionalLocationFormSchema),
    defaultValues: {
      id: functionalLocation.id,
      description: functionalLocation.description,
    },
  });

  const { control, setError, reset, handleSubmit } = form;

  React.useEffect(() => {
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          setError(field as keyof EditFunctionalLocationSchema, {
            message: errors[0],
          });
        }
      });
    }
  }, [setError, state]);

  React.useEffect(() => {
    if (state.success) {
      toast.success("Success", {
        description: state.message,
      });
    }
  }, [state, reset]);

  const onUpdate = handleSubmit((values) => {
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
      <form onSubmit={onUpdate} className="space-y-4">
        <FormField
          control={control}
          name="id"
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel>ID</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-3">
          <LoadingButton processing={pending} label="Update" type="submit" />
        </div>
      </form>
    </Form>
  );
}
