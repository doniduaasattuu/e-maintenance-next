"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useFormState } from "react-dom";
import { EditFindingSchema } from "@/validations/finding-validation";
import { editFinding } from "@/actions/finding-action";
import FindingForm from "./finding-form";
import { FindingStatus } from "@/types/finding-status";
import { Finding } from "@/types/finding";

const editFindingFormSchema = EditFindingSchema;
type EditFindingSchema = z.infer<typeof editFindingFormSchema>;

const initialState = {
  success: false,
  message: "",
  errors: null,
};

export default function FindingEditForm({
  findingStatuses,
  finding,
}: {
  findingStatuses: FindingStatus[] | null;
  finding?: Finding;
}) {
  const [state, formAction, pending] = useFormState(editFinding, initialState);
  const form = useForm<EditFindingSchema>({
    resolver: zodResolver(editFindingFormSchema),
    defaultValues: {
      id: finding?.id ?? undefined,
      notification: finding?.notification ?? undefined,
      findingStatusId: finding?.findingStatusId ?? undefined,
      equipmentId: finding?.equipment?.id ?? undefined,
      functionalLocationId: finding?.functionalLocation?.id ?? undefined,
      description: finding?.description ?? undefined,
    },
  });

  const {
    control,
    setError,
    setFocus,
    reset,
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
  } = form;

  React.useEffect(() => {
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, errors], index: number) => {
        if (index === 0) {
          setFocus(field as keyof EditFindingSchema);
        }

        if (errors && errors.length > 0) {
          setError(field as keyof EditFindingSchema, {
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
    }
  }, [state, reset, getValues]);

  const onUpload = handleSubmit((values) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        if (key === "images") {
          for (let i = 0; i < value.length; i++) {
            formData.append("images", value[i]);
          }
        } else {
          formData.append(key, value);
        }
      }
    });

    React.startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <FindingForm
      form={form}
      onSubmit={onUpload}
      control={control}
      pending={pending}
      setError={setError}
      setValue={setValue}
      clearErrors={clearErrors}
      findingStatuses={findingStatuses}
      isEditing={true}
    />
  );
}
