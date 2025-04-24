import React from "react";
import { Control, UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import LoadingButton from "./loading-button";
import { Equipment } from "@/types/equipment";
import InputGridWrapper from "./input-grid-wrapper";
import FormCard from "./form-card";
import HeaderCard from "./header-card";
import { Textarea } from "./ui/textarea";

type MotorInspectionFields = {
  equipmentId: string;
  isOperated: "true" | "false";
  isClean: "true" | "false";
  numberOfGreasing?: string | undefined;
  temperatureDe?: string | undefined;
  temperatureBody?: string | undefined;
  temperatureNde?: string | undefined;
  vibrationDev?: string | undefined;
  vibrationDeh?: string | undefined;
  vibrationDea?: string | undefined;
  vibrationDef?: string | undefined;
  isNoisyDe: "true" | "false";
  vibrationNdev?: string | undefined;
  vibrationNdeh?: string | undefined;
  vibrationNdef?: string | undefined;
  isNoisyNde: "true" | "false";
  note?: string | undefined;
};

type MotorInspectionProps = {
  equipment: Equipment;
  form: UseFormReturn<MotorInspectionFields, unknown, undefined>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  control: Control<MotorInspectionFields, unknown>;
  pending: boolean | undefined;
  lastInserted?: string | null;
  isEditing?: boolean | undefined;
};

export default function MotorForm({
  equipment,
  form,
  onSubmit,
  control,
  pending,
  isEditing = false,
}: MotorInspectionProps) {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormCard>
          <HeaderCard
            header={equipment.id}
            content={
              isEditing
                ? "Update data motor inspection form"
                : "Insert data motor inspection form"
            }
          />
          <FormField
            control={control}
            name="equipmentId"
            render={({ field }) => (
              <Input
                {...field}
                className="max-w-xl"
                defaultValue={field.value}
                hidden
              />
            )}
          />
          <InputGridWrapper className="grid-cols-2 max-w-xl">
            <FormField
              control={control}
              name="isOperated"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Operational status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Running</SelectItem>
                        <SelectItem value="false">Stop</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="isClean"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Cleanliness</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Cleanliness" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Clean</SelectItem>
                        <SelectItem value="false">Dirty</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </InputGridWrapper>
          <FormField
            control={control}
            name="numberOfGreasing"
            render={({ field }) => (
              <FormItem className="max-w-xl">
                <FormLabel>Number of greasing</FormLabel>
                <FormControl>
                  <Input type="number" inputMode="numeric" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormCard>
        <FormCard>
          <HeaderCard header="Temperature" />
          <InputGridWrapper className="grid-cols-3 max-w-xl">
            <FormField
              control={control}
              name="temperatureDe"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>DE</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="temperatureBody"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="temperatureNde"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>NDE</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </InputGridWrapper>
        </FormCard>

        <FormCard>
          <HeaderCard header="Vibration DE" />
          <InputGridWrapper className="grid-cols-2 max-w-xl">
            <FormField
              control={control}
              name="vibrationDev"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Vertical</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="vibrationDeh"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Horizontal</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </InputGridWrapper>
          <InputGridWrapper className="grid-cols-2 max-w-xl">
            <FormField
              control={control}
              name="vibrationDea"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Axial</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="vibrationDef"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Frame</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </InputGridWrapper>
          <FormField
            control={control}
            name="isNoisyDe"
            render={({ field }) => (
              <FormItem className="max-w-xl">
                <FormLabel>Noise DE</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Noise DE" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Noisy</SelectItem>
                      <SelectItem value="false">Good</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormCard>

        <FormCard>
          <HeaderCard header="Vibration NDE" />
          <InputGridWrapper className="grid-cols-3 max-w-xl">
            <FormField
              control={control}
              name="vibrationNdev"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Vertical</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="vibrationNdeh"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Horizontal</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="vibrationNdef"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Frame</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </InputGridWrapper>
          <FormField
            control={control}
            name="isNoisyNde"
            render={({ field }) => (
              <FormItem className="max-w-xl">
                <FormLabel>Noise NDE</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Noise NDE" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Noisy</SelectItem>
                      <SelectItem value="false">Good</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="note"
            render={({ field }) => (
              <FormItem className="max-w-xl">
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea {...field} />
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
        </FormCard>
      </form>
    </Form>
  );
}
