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
import { useFormState } from "react-dom";
import { CreateFileSchema } from "@/validations/file-validation";
import { createFile } from "@/actions/file-action";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/config";

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
      formData.append(key, value);
    });

    React.startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onUpload} className="space-y-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="max-w-xl">
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
          name="tags"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Add tags separated by spaces (&quot; &quot;) for categorization
                and search optimization.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="file"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { onChange, value, ref, ...rest } }) => (
            // render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  // accept=".pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/jpeg, image/png"
                  accept={ALLOWED_FILE_TYPES.map((ext) => `.${ext}`).join(", ")}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || undefined;
                    if (file) {
                      if (file.size > MAX_FILE_SIZE) {
                        setError("file", {
                          message: `File size has exceeded it max limit of ${
                            MAX_FILE_SIZE / 1024 / 1024
                          }MB`,
                        });
                      } else {
                        clearErrors("file");
                        onChange(file);
                      }
                    }
                  }}
                  ref={ref}
                  {...rest}
                />
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
