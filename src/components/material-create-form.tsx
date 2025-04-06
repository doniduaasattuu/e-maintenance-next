"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CreateMaterialSchema } from "@/validations/material-validation";
import { useFormState } from "react-dom";
import { createMaterial } from "@/actions/material-action";
import { Unit } from "@/types/unit";
import MaterialForm from "./material-form";

const createMaterialFormSchema = CreateMaterialSchema;
type CreateMaterialSchema = z.infer<typeof createMaterialFormSchema>;

const initialState = {
  success: false,
  message: "",
  errors: null,
};

type MaterialEditProps = {
  units: Unit[] | null;
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
    <MaterialForm
      form={form}
      control={control}
      onSubmit={onCreate}
      pending={pending}
      units={units}
      lastInserted={lastInserted}
    />
  );
}
