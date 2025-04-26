"use client";

import { storePanelInspection } from "@/actions/inspection-action";
import { Equipment } from "@/types/equipment";
import { CreatePanelInspectionSchema } from "@/validations/inspection-form-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import PanelInspectionForm from "./panel-inspection-form";

const createPanelInspectionFormSchema = CreatePanelInspectionSchema;
type CreatePanelInspection = z.infer<typeof createPanelInspectionFormSchema>;

const initialState = {
  success: false,
  message: "",
  errors: null,
  inspectionId: null,
};

export default function PanelInspectionCreateForm({
  equipment,
}: {
  equipment: Equipment;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useFormState(
    storePanelInspection,
    initialState
  );
  const form = useForm<CreatePanelInspection>({
    resolver: zodResolver(createPanelInspectionFormSchema),
    defaultValues: {
      equipmentId: equipment.id,
      isOperated: "true",
      isClean: "true",
      isLabelOk: "true",
      isIndicatorOk: "true",
      isNoisy: "false",
    },
  });

  const { control, setError, reset, handleSubmit } = form;

  React.useEffect(() => {
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          setError(field as keyof CreatePanelInspection, {
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
    <PanelInspectionForm
      equipment={equipment}
      control={control}
      form={form}
      onSubmit={onCreate}
      pending={pending}
    />
  );
}
