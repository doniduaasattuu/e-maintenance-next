"use client";
import React from "react";

import {
  Form,
  FormControl,
  FormDescription,
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
import { CreateEquipmentSchema } from "@/validations/equipment-validation";
import { useFormState } from "react-dom";
import Link from "next/link";
import { Classification } from "@/types/classification";
import { EquipmentStatus } from "@/types/equipment-status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { createEquipment } from "@/actions/equipment-action";

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
        functionalLocationId: "",
        sortField: "",
        description: "",
      });
    }
  }, [state, reset, getValues]);

  const onCreate = handleSubmit((values) => {
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
      <form onSubmit={onCreate} className="space-y-4">
        <FormField
          control={control}
          name="id"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>ID</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    const upperValue = e.target.value.toUpperCase();
                    field.onChange(upperValue);
                  }}
                />
              </FormControl>
              {lastInserted && (
                <FormDescription>
                  <span>Last inserted: </span>
                  <Link
                    className="hover:text-foreground"
                    href={`/equipments/${lastInserted}`}
                  >
                    {lastInserted}
                  </Link>
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="classificationId"
          render={({ field }) => (
            <FormItem className="max-w-xl">
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
            <FormItem className="max-w-xl">
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
            <FormItem className="max-w-xl">
              <FormLabel>Functional location</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    const upperValue = e.target.value.toUpperCase();
                    field.onChange(upperValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="sortField"
          render={({ field }) => (
            <FormItem className="max-w-xl">
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
            <FormItem className="max-w-xl">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-3">
          <LoadingButton processing={pending} label="Submit" type="submit" />
        </div>
      </form>
    </Form>
  );
}
