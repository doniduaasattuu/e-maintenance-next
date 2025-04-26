"use client";

import { updateMotorInspection } from "@/actions/inspection-action";
import { Equipment } from "@/types/equipment";
import { EditMotorInspectionSchema } from "@/validations/inspection-form-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { InspectionMotor } from "@/types/motor-inspection";
import { booleanToString } from "@/lib/utils";
import MotorInspectionForm from "./motor-inspection-form";

const editMotorInspectionFormSchema = EditMotorInspectionSchema;
type EditMotorInspection = z.infer<typeof editMotorInspectionFormSchema>;

const initialState = {
  success: false,
  message: "",
  errors: null,
  inspectionId: null,
};

export default function MotorInspectionEditForm({
  equipment,
  inspectionMotor,
}: {
  equipment: Equipment;
  inspectionMotor: InspectionMotor;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useFormState(
    updateMotorInspection,
    initialState
  );

  const {
    isOperated,
    isClean,
    numberOfGreasing,
    temperatureDe,
    temperatureBody,
    temperatureNde,
    vibrationDev,
    vibrationDeh,
    vibrationDea,
    vibrationDef,
    isNoisyDe,
    vibrationNdev,
    vibrationNdeh,
    vibrationNdef,
    isNoisyNde,
    note,
  } = inspectionMotor;

  const form = useForm<EditMotorInspection>({
    resolver: zodResolver(editMotorInspectionFormSchema),
    defaultValues: {
      inspectionId: String(inspectionMotor.id),
      equipmentId: equipment.id,
      isOperated: booleanToString(isOperated),
      isClean: booleanToString(isClean),
      numberOfGreasing: numberOfGreasing ?? undefined,
      temperatureDe: temperatureDe ?? undefined,
      temperatureBody: temperatureBody ?? undefined,
      temperatureNde: temperatureNde ?? undefined,
      vibrationDev: vibrationDev ?? undefined,
      vibrationDeh: vibrationDeh ?? undefined,
      vibrationDea: vibrationDea ?? undefined,
      vibrationDef: vibrationDef ?? undefined,
      isNoisyDe: booleanToString(isNoisyDe),
      vibrationNdev: vibrationNdev ?? undefined,
      vibrationNdeh: vibrationNdeh ?? undefined,
      vibrationNdef: vibrationNdef ?? undefined,
      isNoisyNde: booleanToString(isNoisyNde),
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
    <MotorInspectionForm
      isEditing={true}
      equipment={equipment}
      control={control}
      form={form}
      onSubmit={onUpdate}
      pending={pending}
    />
  );
}
