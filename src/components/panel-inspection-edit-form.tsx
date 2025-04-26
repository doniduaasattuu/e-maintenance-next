"use client";

import { updatePanelInspection } from "@/actions/inspection-action";
import { Equipment } from "@/types/equipment";
import { EditPanelInspectionSchema } from "@/validations/inspection-form-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { InspectionPanel } from "@/types/panel-inspection";
import { booleanToString } from "@/lib/utils";
import PanelInspectionForm from "./panel-inspection-form";

const editPanelInspectionFormSchema = EditPanelInspectionSchema;
type EditMotorInspection = z.infer<typeof editPanelInspectionFormSchema>;

const initialState = {
  success: false,
  message: "",
  errors: null,
  inspectionId: null,
};

export default function PanelInspectionEditForm({
  equipment,
  inspectionPanel,
}: {
  equipment: Equipment;
  inspectionPanel: InspectionPanel;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useFormState(
    updatePanelInspection,
    initialState
  );

  const {
    isOperated,
    isClean,
    isLabelOk,
    isIndicatorOk,
    temperatureIncomingR,
    temperatureIncomingS,
    temperatureIncomingT,
    temperatureCabinet,
    temperatureOutgoingR,
    temperatureOutgoingS,
    temperatureOutgoingT,
    currentR,
    currentS,
    currentT,
    isNoisy,
    note,
  } = inspectionPanel;

  const form = useForm<EditMotorInspection>({
    resolver: zodResolver(editPanelInspectionFormSchema),
    defaultValues: {
      inspectionId: String(inspectionPanel.id),
      equipmentId: equipment.id,
      isOperated: booleanToString(isOperated),
      isClean: booleanToString(isClean),
      isLabelOk: booleanToString(isLabelOk),
      isIndicatorOk: booleanToString(isIndicatorOk),
      temperatureIncomingR: temperatureIncomingR ?? undefined,
      temperatureIncomingS: temperatureIncomingS ?? undefined,
      temperatureIncomingT: temperatureIncomingT ?? undefined,
      temperatureCabinet: temperatureCabinet ?? undefined,
      temperatureOutgoingR: temperatureOutgoingR ?? undefined,
      temperatureOutgoingS: temperatureOutgoingS ?? undefined,
      temperatureOutgoingT: temperatureOutgoingT ?? undefined,
      currentR: currentR ?? undefined,
      currentS: currentS ?? undefined,
      currentT: currentT ?? undefined,
      isNoisy: booleanToString(isNoisy),
      note: note ? String(note) : undefined,
    },
  });

  const { control, setError, reset, handleSubmit } = form;

  React.useEffect(() => {
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          setError(field as keyof EditMotorInspection, {
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
  }, [state, reset, router, equipment.id]);

  const onUpdate = handleSubmit((values) => {
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
      isEditing={true}
      equipment={equipment}
      control={control}
      form={form}
      onSubmit={onUpdate}
      pending={pending}
    />
  );
}
