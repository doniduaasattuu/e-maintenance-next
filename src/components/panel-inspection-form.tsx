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

type PanelInspectionFields = {
  equipmentId: string;
  isOperated: "true" | "false";
  isClean: "true" | "false";
  isLabelOk: "true" | "false";
  isIndicatorOk: "true" | "false";
  temperatureIncomingR?: string | undefined;
  temperatureIncomingS?: string | undefined;
  temperatureIncomingT?: string | undefined;
  temperatureCabinet?: string | undefined;
  temperatureOutgoingR?: string | undefined;
  temperatureOutgoingS?: string | undefined;
  temperatureOutgoingT?: string | undefined;
  currentR?: string | undefined;
  currentS?: string | undefined;
  currentT?: string | undefined;
  isNoisy: "true" | "false";
  note?: string | undefined;
};

type PanelInspectionProps = {
  equipment: Equipment;
  form: UseFormReturn<PanelInspectionFields, unknown, undefined>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  control: Control<PanelInspectionFields, unknown>;
  pending: boolean | undefined;
  lastInserted?: string | null;
  isEditing?: boolean | undefined;
};

export default function PanelInspectionForm({
  equipment,
  form,
  onSubmit,
  control,
  pending,
  isEditing = false,
}: PanelInspectionProps) {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormCard>
          <HeaderCard
            header={equipment.id}
            content={
              isEditing
                ? "Update data panel inspection form"
                : "Insert data panel inspection form"
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
          <InputGridWrapper className="grid-cols-2 max-w-xl">
            <FormField
              control={control}
              name="isLabelOk"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Labeling</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Panel Label" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Good</SelectItem>
                        <SelectItem value="false">Not Good</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="isIndicatorOk"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Indicator</FormLabel>
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
                        <SelectItem value="true">Good</SelectItem>
                        <SelectItem value="false">Not Good</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </InputGridWrapper>
        </FormCard>

        <FormCard>
          <HeaderCard header="Temperature" />
          <InputGridWrapper className="grid-cols-3 max-w-xl">
            <FormField
              control={control}
              name="temperatureIncomingR"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Incoming R</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="temperatureIncomingS"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Incoming S</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="temperatureIncomingT"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Incoming T</FormLabel>
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
            name="temperatureCabinet"
            render={({ field }) => (
              <FormItem className="max-w-xl">
                <FormLabel>Cabinet</FormLabel>
                <FormControl>
                  <Input type="number" inputMode="numeric" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <InputGridWrapper className="grid-cols-3 max-w-xl">
            <FormField
              control={control}
              name="temperatureOutgoingR"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Outgoing R</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="temperatureOutgoingS"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Outgoing S</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="temperatureOutgoingT"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Outgoing T</FormLabel>
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
          <HeaderCard header="Current" />
          <InputGridWrapper className="grid-cols-3 max-w-xl">
            <FormField
              control={control}
              name="currentR"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Current R</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="currentS"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Current S</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="currentT"
              render={({ field }) => (
                <FormItem className="max-w-xl">
                  <FormLabel>Current T</FormLabel>
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
            name="isNoisy"
            render={({ field }) => (
              <FormItem className="max-w-xl">
                <FormLabel>Panel noise</FormLabel>
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
                      <SelectItem value="true">Noise</SelectItem>
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
