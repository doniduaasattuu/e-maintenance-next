"use client";

import { storeMotorInspection } from "@/actions/inspection-action";
import { Equipment } from "@/types/equipment";
import { CreateMotorInspectionSchema } from "@/validations/inspection-form-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import MotorForm from "./motor-form";
import { useRouter } from "next/navigation";

const createMotorInspectionFormSchema = CreateMotorInspectionSchema;
type CreateMotorInspection = z.infer<typeof createMotorInspectionFormSchema>;

const initialState = {
  success: false,
  message: "",
  errors: null,
  inspectionId: null,
};

export default function MotorInspectionCreateForm({
  equipment,
}: {
  equipment: Equipment;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useFormState(
    storeMotorInspection,
    initialState
  );
  const form = useForm<CreateMotorInspection>({
    resolver: zodResolver(createMotorInspectionFormSchema),
    defaultValues: {
      equipmentId: equipment.id,
      isOperated: "true",
      isClean: "true",
      isNoisyDe: "false",
      isNoisyNde: "false",
    },
  });

  const { control, setError, reset, handleSubmit } = form;

  React.useEffect(() => {
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          setError(field as keyof CreateMotorInspection, {
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

      router.replace(`/inspections/${equipment.id}/edit/${state.inspectionId}`);
    }
  }, [state, reset, router, equipment.id]);

  const onCreate = handleSubmit((values) => {
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
    <MotorForm
      equipment={equipment}
      control={control}
      form={form}
      onSubmit={onCreate}
      pending={pending}
    />
  );
}
