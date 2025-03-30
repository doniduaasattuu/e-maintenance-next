"use client";
import React from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import LoadingButton from "./loading-button";
import { EditEquipmentSchema } from "@/validations/equipment-validation";
import { useFormState } from "react-dom";
import { Classification } from "@/types/classification";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { EquipmentStatus } from "@/types/equipment-status";
import { Equipment } from "@/types/equipment";
import { editEquipment } from "@/actions/equipment-action";

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
    <Form {...form}>
      <form onSubmit={onUpdate} className="space-y-4">
        <FormField
          control={control}
          name="id"
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel>ID</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="classificationId"
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel>Classification</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Classification" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classifications &&
                      classifications.map(({ id, description }) => (
                        <SelectItem key={id} value={String(id)}>
                          {description}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="equipmentStatusId"
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Equipment status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {equipmentStatuses &&
                      equipmentStatuses.map(({ id, description }) => (
                        <SelectItem key={id} value={String(id)}>
                          {description}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="functionalLocationId"
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel>Functional location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="sortField"
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel>Sort field</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-3">
          <LoadingButton processing={pending} label="Update" type="submit" />
        </div>
      </form>
    </Form>
  );
}
