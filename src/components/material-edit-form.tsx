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
import { CreateMaterialSchema } from "@/validations/material-validation";
import { useFormState } from "react-dom";
import { editMaterial } from "@/actions/material-action";
import { Unit } from "@/types/prisma-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const editMaterialFormSchema = CreateMaterialSchema;
type CreateMaterialSchema = z.infer<typeof editMaterialFormSchema>;

const initialState = {
  success: false,
  message: "",
  errors: null,
};

type MaterialEditProps = {
  material: {
    id: string;
    name: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    unit: {
      id: number;
      description: string;
    } | null;
  };
  units: Unit[] | [];
};

export default function MaterialEditForm({
  material,
  units,
}: MaterialEditProps) {
  const [state, formAction, pending] = useFormState(editMaterial, initialState);
  const form = useForm<CreateMaterialSchema>({
    resolver: zodResolver(editMaterialFormSchema),
    defaultValues: {
      id: material.id,
      name: material.name,
      price: material.price,
      unitId: material.unit?.id,
    },
  });

  const { control, setError, reset, handleSubmit } = form;

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
  }, [state, reset]);

  const onUpdate = handleSubmit((values) => {
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
          name="name"
          render={({ field }) => (
            <FormItem className="max-w-md">
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
            <FormItem className="max-w-md">
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
            <FormItem className="max-w-md">
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
          <LoadingButton processing={pending} label="Update" type="submit" />
        </div>
      </form>
    </Form>
  );
}
