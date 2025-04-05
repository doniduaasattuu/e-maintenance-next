"use client";
import React from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { EditFunctionalLocationSchema } from "@/validations/functional-location-validation";
import { useFormState } from "react-dom";
import { editFunctionalLocation } from "@/actions/functional-location-action";
import FunctionalLocationForm from "./functional-location-form";

const editFunctionalLocationFormSchema = EditFunctionalLocationSchema;
type EditFunctionalLocationSchema = z.infer<
  typeof editFunctionalLocationFormSchema
>;

const initialState = {
  success: false,
  message: "",
  errors: null,
};

type FunctionalLocationEditProps = {
  functionalLocation: {
    id: string;
    description: string;
  };
};

export default function FunctionalLocationEditForm({
  functionalLocation,
}: FunctionalLocationEditProps) {
  const [state, formAction, pending] = useFormState(
    editFunctionalLocation,
    initialState
  );
  const form = useForm<EditFunctionalLocationSchema>({
    resolver: zodResolver(editFunctionalLocationFormSchema),
    defaultValues: {
      id: functionalLocation.id,
      description: functionalLocation.description,
    },
  });

  const { control, setError, reset, handleSubmit } = form;

  React.useEffect(() => {
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          setError(field as keyof EditFunctionalLocationSchema, {
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
      formData.append(key, value);
    });

    React.startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <FunctionalLocationForm
      form={form}
      onSubmit={onUpdate}
      control={control}
      pending={pending}
      isEditing={true}
    />
  );
}
