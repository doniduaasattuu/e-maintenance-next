"use client";
import React from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useFormState } from "react-dom";
import { CreateFileSchema } from "@/validations/file-validation";
import { createFile } from "@/actions/file-action";
import FileForm from "./file-form";

const createFileFormSchema = CreateFileSchema;
type CreateFileSchema = z.infer<typeof createFileFormSchema>;

const initialState = {
  success: false,
  message: "",
  errors: null,
};

export default function FileCreateForm() {
  const [state, formAction, pending] = useFormState(createFile, initialState);
  const form = useForm<CreateFileSchema>({
    resolver: zodResolver(createFileFormSchema),
  });

  const {
    control,
    setError,
    setFocus,
    reset,
    handleSubmit,
    getValues,
    clearErrors,
  } = form;

  React.useEffect(() => {
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, errors], index: number) => {
        if (index === 0) {
          setFocus(field as keyof CreateFileSchema);
        }

        if (errors && errors.length > 0) {
          setError(field as keyof CreateFileSchema, {
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

      reset({
        name: "",
        tags: "",
        file: undefined,
      });
    }
  }, [state, reset, getValues]);

  const onUpload = handleSubmit((values) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    React.startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <FileForm
      form={form}
      onSubmit={onUpload}
      control={control}
      pending={pending}
      setError={setError}
      clearErrors={clearErrors}
    />
  );
}
