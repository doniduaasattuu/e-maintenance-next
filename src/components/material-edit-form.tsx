"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CreateMaterialSchema } from "@/validations/material-validation";
import { useFormState } from "react-dom";
import { editMaterial } from "@/actions/material-action";
import { Unit } from "@/types/unit";
import MaterialForm from "./material-form";
import { MaterialWithRelations } from "@/types/material";

const editMaterialFormSchema = CreateMaterialSchema;
type CreateMaterialSchema = z.infer<typeof editMaterialFormSchema>;

const initialState = {
  success: false,
  message: "",
  errors: null,
};

type MaterialEditProps = {
  material: MaterialWithRelations;
  units: Unit[] | null;
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
    <MaterialForm
      form={form}
      control={control}
      onSubmit={onUpdate}
      pending={pending}
      units={units}
      isEditing={true}
    />
  );
}
