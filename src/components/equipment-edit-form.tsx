"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { EditEquipmentSchema } from "@/validations/equipment-validation";
import { useFormState } from "react-dom";
import { Classification } from "@/types/classification";
import { EquipmentStatus } from "@/types/equipment-status";
import { Equipment } from "@/types/equipment";
import { editEquipment } from "@/actions/equipment-action";
import EquipmentForm from "./equipment-form";

const editEquipmentFormSchema = EditEquipmentSchema;
type EditEquipmentSchema = z.infer<typeof editEquipmentFormSchema>;

const initialState = {
  success: false,
  message: "",
  errors: null,
};

type EquipmentEditProps = {
  equipment: Equipment;
  classifications: Classification[];
  equipmentStatuses: EquipmentStatus[];
};

export default function EquipmentEditForm({
  equipment,
  classifications,
  equipmentStatuses,
}: EquipmentEditProps) {
  const [state, formAction, pending] = useFormState(
    editEquipment,
    initialState
  );
  const form = useForm<EditEquipmentSchema>({
    resolver: zodResolver(editEquipmentFormSchema),
    defaultValues: {
      id: equipment.id,
      classificationId: equipment.classification.id,
      equipmentStatusId: equipment.equipmentStatus.id,
      functionalLocationId: equipment.functionalLocation?.id,
      sortField: equipment.sortField,
      description: equipment.description,
    },
  });

  const { control, setError, reset, handleSubmit } = form;

  React.useEffect(() => {
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          setError(field as keyof EditEquipmentSchema, {
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
    <EquipmentForm
      control={control}
      form={form}
      pending={pending}
      onSubmit={onUpdate}
      classifications={classifications}
      equipmentStatuses={equipmentStatuses}
      isEditing={true}
    />
  );
}
