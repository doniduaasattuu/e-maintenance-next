"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import LoadingButton from "./loading-button";
import {
  Control,
  UseFormClearErrors,
  UseFormReturn,
  UseFormSetError,
} from "react-hook-form";
import React from "react";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/config";

type FileFields = {
  id?: string;
  name: string;
  tags?: string | undefined;
  file: File;
};

type FileFormProps = {
  form: UseFormReturn<FileFields, unknown, undefined>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  control: Control<FileFields, unknown>;
  pending: boolean | undefined;
  setError: UseFormSetError<FileFields>;
  clearErrors: UseFormClearErrors<FileFields>;
  isEditing?: boolean | undefined;
};

export default function FileForm({
  form,
  onSubmit,
  control,
  pending,
  setError,
  clearErrors,
  isEditing = false,
}: FileFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
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
              <FormDescription>
                Allowed file types:{" "}
                {ALLOWED_FILE_TYPES.map(
                  (extension, index) =>
                    `${
                      extension +
                      (index !== ALLOWED_FILE_TYPES.length - 1 ? ", " : ".")
                    }`
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-3">
          <LoadingButton
            processing={pending}
            label={isEditing ? "Update" : "Submit"}
            type="submit"
          />
        </div>
      </form>
    </Form>
  );
}
