"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useFormState } from "react-dom";
import { CreateFindingSchema } from "@/validations/finding-validation";
import { createFinding } from "@/actions/finding-action";
import FindingForm from "./finding-form";
import { FindingStatus } from "@/types/finding-status";
import { useRouter } from "next/navigation";

const createFindingFormSchema = CreateFindingSchema;
type CreateFindingSchema = z.infer<typeof createFindingFormSchema>;

const initialState = {
  id: null,
  success: false,
  message: "",
  errors: null,
};

export default function FindingCreateForm({
  findingStatuses,
}: {
  findingStatuses: FindingStatus[] | null;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useFormState(
    createFinding,
    initialState
  );
  const form = useForm<CreateFindingSchema>({
    resolver: zodResolver(createFindingFormSchema),
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
          setFocus(field as keyof CreateFindingSchema);
        }

        if (errors && errors.length > 0) {
          setError(field as keyof CreateFindingSchema, {
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
        action: {
          label: "Edit",
          onClick: () => router.push(`/findings/${state.id}/edit`),
        },
      });

      reset({
        notification: "",
        equipmentId: "",
        functionalLocationId: "",
        description: "",
      });

      router.refresh();
    }
  }, [state, reset, getValues, router]);

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
      setValue={setValue}
      setError={setError}
      clearErrors={clearErrors}
      findingStatuses={findingStatuses}
    />
  );
}
