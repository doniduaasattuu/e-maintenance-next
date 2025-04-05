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
import { editFile } from "@/actions/file-action";
import { EditFileSchema } from "@/validations/file-validation";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/config";

const editFileFormSchema = EditFileSchema;
type EditFileSchema = z.infer<typeof editFileFormSchema>;

const initialState = {
  success: false,
  message: "",
  errors: null,
};

type FileEditProps = {
  file: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number | null;
    tags: string | null;
    type: string;
    path: string;
  };
};

export default function FileEditForm({ file }: FileEditProps) {
  const [state, formAction, pending] = useFormState(editFile, initialState);
  const form = useForm<EditFileSchema>({
    resolver: zodResolver(editFileFormSchema),
    defaultValues: {
      id: file.id,
      name: file.name,
      tags: file.tags ?? "",
    },
  });

  const { control, setError, reset, handleSubmit, clearErrors } = form;

  React.useEffect(() => {
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          setError(field as keyof EditFileSchema, {
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
      if (value !== undefined) {
        formData.append(key, value);
      }
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
          render={({ field }) => <Input {...field} hidden />}
        />
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
              <FormMessage />{" "}
              <FormDescription>
                Add tags separated by spaces (&quot; &quot;) for categorization
                and search optimization.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="file"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { onChange, value, ref, ...rest } }) => (
            <FormItem className="max-w-xl">
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  type="file"
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
          <LoadingButton processing={pending} label="Update" type="submit" />
        </div>
      </form>
    </Form>
  );
}
