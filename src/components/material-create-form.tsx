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
import { CreateMaterialSchema } from "@/validations/material-validation";
import { useFormState } from "react-dom";
import { Unit } from "@/types/prisma-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { createMaterial } from "@/actions/material-action";
import Link from "next/link";

const createMaterialFormSchema = CreateMaterialSchema;
type CreateMaterialSchema = z.infer<typeof createMaterialFormSchema>;

const initialState = {
  success: false,
  message: "",
  errors: null,
};

type MaterialEditProps = {
  units: Unit[] | [];
};

export default function MaterialCreateForm({ units }: MaterialEditProps) {
  const [lastInserted, setLastInserted] = React.useState<string | null>(null);
  const [state, formAction, pending] = useFormState(
    createMaterial,
    initialState
  );
  const form = useForm<CreateMaterialSchema>({
    resolver: zodResolver(createMaterialFormSchema),
  });

  const { control, setError, reset, handleSubmit, getValues } = form;

  React.useEffect(() => {
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          setError(field as keyof CreateMaterialSchema, {
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

    setLastInserted(getValues("id"));

    reset({
      id: "",
      name: "",
      price: 0,
      unitId: "",
    });
  }, [state, reset, getValues]);

  const onCreate = handleSubmit((values) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value));
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
                <Input {...field} />
              </FormControl>
              {lastInserted && (
                <FormDescription>
                  <span>Last inserted: </span>
                  <Link
                    className="hover:text-foreground"
                    href={`/materials/${lastInserted}`}
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
          name="price"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="unitId"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units &&
                      units.length >= 1 &&
                      units.map(({ id, description }) => (
                        <SelectItem key={id} value={String(id)}>
                          {description}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
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
