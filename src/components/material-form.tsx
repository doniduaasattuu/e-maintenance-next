import React from "react";
import { Control, UseFormReturn } from "react-hook-form";
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
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Unit } from "@/types/unit";
import LoadingButton from "./loading-button";

type MaterialFields = {
  id: string;
  name: string;
  price: string | number;
  unitId?: string | number | undefined;
};

type MaterialFormProps = {
  form: UseFormReturn<MaterialFields, unknown, undefined>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  control: Control<MaterialFields, unknown>;
  pending: boolean | undefined;
  units: Unit[] | null;
  lastInserted?: string | null;
  isEditing?: boolean | undefined;
};

export default function MaterialForm({
  form,
  onSubmit,
  control,
  pending,
  units,
  lastInserted,
  isEditing = false,
}: MaterialFormProps) {
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
                <Input {...field} inputMode="numeric" disabled={isEditing} />
              </FormControl>
              {lastInserted && (
                <FormDescription>
                  <span>Last inserted: </span>
                  <Link
                    className="hover:text-foreground"
                    href={`/materials/${lastInserted}`}
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
          name="name"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="unitId"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units &&
                      units.length >= 1 &&
                      units.map(({ id, description }) => (
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
