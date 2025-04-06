"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import LoadingButton from "./loading-button";
import { Control, UseFormReturn } from "react-hook-form";
import React from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Classification } from "@/types/classification";
import { EquipmentStatus } from "@/types/equipment-status";

type EquipmentFields = {
  id: string;
  classificationId: number;
  equipmentStatusId: number;
  sortField: string;
  description: string;
  functionalLocationId?: string | undefined;
};

type EquipmentFormProps = {
  form: UseFormReturn<EquipmentFields, unknown, undefined>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  control: Control<EquipmentFields, unknown>;
  pending: boolean | undefined;
  lastInserted?: string | null;
  isEditing?: boolean | undefined;
  classifications: Classification[];
  equipmentStatuses: EquipmentStatus[];
};

export default function EquipmentForm({
  form,
  onSubmit,
  control,
  pending,
  lastInserted,
  isEditing = false,
  classifications,
  equipmentStatuses,
}: EquipmentFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
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
                  disabled={isEditing}
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
                  defaultValue={field.value ? String(field.value) : ""}
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
                  defaultValue={field.value ? String(field.value) : ""}
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
          <LoadingButton
            processing={pending}
            label={isEditing ? "Update" : "Submit"}
            type="submit"
          />
        </div>
      </form>
    </Form>
  );
}
