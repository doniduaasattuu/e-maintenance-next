"use client";
import React from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CreateEquipmentSchema } from "@/validations/equipment-validation";
import { useFormState } from "react-dom";
import { Classification } from "@/types/classification";
import { EquipmentStatus } from "@/types/equipment-status";
import { createEquipment } from "@/actions/equipment-action";
import EquipmentForm from "./equipment-form";

const createEquipmentFormSchema = CreateEquipmentSchema;
type CreateEquipmentSchema = z.infer<typeof createEquipmentFormSchema>;

const initialState = {
  success: false,
  message: "",
  errors: null,
};

type EquipmentCreateProps = {
  classifications: Classification[];
  equipmentStatuses: EquipmentStatus[];
};

export default function EquipmentCreateForm({
  classifications,
  equipmentStatuses,
}: EquipmentCreateProps) {
  const [lastInserted, setLastInserted] = React.useState<string | null>(null);
  const [state, formAction, pending] = useFormState(
    createEquipment,
    initialState
  );
  const form = useForm<CreateEquipmentSchema>({
    resolver: zodResolver(createEquipmentFormSchema),
  });

  const { control, setError, setFocus, reset, handleSubmit, getValues } = form;

  React.useEffect(() => {
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, errors], index: number) => {
        if (index === 0) {
          setFocus(field as keyof CreateEquipmentSchema);
        }

        if (errors && errors.length > 0) {
          setError(field as keyof CreateEquipmentSchema, {
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
        classificationId: 0,
        equipmentStatusId: 0,
        functionalLocationId: "",
        sortField: "",
        description: "",
      });
    }
  }, [state, reset, getValues]);

  const onCreate = handleSubmit((values) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    React.startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <EquipmentForm
      control={control}
      form={form}
      pending={pending}
      onSubmit={onCreate}
      lastInserted={lastInserted}
      classifications={classifications}
      equipmentStatuses={equipmentStatuses}
    />
  );
}
