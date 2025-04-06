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
import { Control, UseFormReturn } from "react-hook-form";
import React from "react";
import Link from "next/link";

type FunclocFields = { id: string; description: string };

type FunctionalLocationFormProps = {
  form: UseFormReturn<FunclocFields, unknown, undefined>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  control: Control<FunclocFields, unknown>;
  pending: boolean | undefined;
  lastInserted?: string | null;
  isEditing?: boolean | undefined;
};

export default function FunctionalLocationForm({
  form,
  onSubmit,
  control,
  pending,
  lastInserted,
  isEditing = false,
}: FunctionalLocationFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
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
                  disabled={isEditing}
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
