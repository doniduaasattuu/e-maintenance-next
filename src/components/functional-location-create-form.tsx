"use client";
import React from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CreateFunctionalLocationSchema } from "@/validations/functional-location-validation";
import { useFormState } from "react-dom";
import { createFunctionalLocation } from "@/actions/functional-location-action";
import FunctionalLocationForm from "./functional-location-form";

const createFunclocFormSchema = CreateFunctionalLocationSchema;
type CreateFunctionalLocationSchema = z.infer<typeof createFunclocFormSchema>;

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
    resolver: zodResolver(createFunclocFormSchema),
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
    <FunctionalLocationForm
      form={form}
      control={control}
      onSubmit={onCreate}
      pending={pending}
      lastInserted={lastInserted}
    />
  );
}
