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
import {
  Control,
  UseFormClearErrors,
  UseFormReturn,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_COUNT,
  MAX_FILE_SIZE,
} from "@/lib/config";
import { useSearchParams } from "next/navigation";
import { FindingStatus } from "@/types/finding-status";

type FindingFields = {
  id?: string | undefined;
  description: string;
  notification?: string | undefined;
  equipmentId?: string | undefined;
  functionalLocationId?: string | undefined;
  findingStatusId: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images?: any;
};

type FileFormProps = {
  form: UseFormReturn<FindingFields, unknown, undefined>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  control: Control<FindingFields, unknown>;
  pending: boolean | undefined;
  setError: UseFormSetError<FindingFields>;
  setValue: UseFormSetValue<FindingFields>;
  clearErrors: UseFormClearErrors<FindingFields>;
  isEditing?: boolean | undefined;
  findingStatuses: FindingStatus[] | null;
};

export default function FindingForm({
  form,
  onSubmit,
  control,
  pending,
  setError,
  setValue,
  clearErrors,
  isEditing = false,
  findingStatuses,
}: FileFormProps) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const equipmentIdParam: string | null = params.get("equipmentId");
  const functionalLocationIdParam: string | null = params.get(
    "functionalLocationId"
  );
  const findingStatusId = String(
    findingStatuses?.find((val) => val.description === "Open")?.id
  );

  React.useEffect(() => {
    if (findingStatusId) {
      setValue("findingStatusId", findingStatusId);
    }

    if (equipmentIdParam) {
      setValue("equipmentId", equipmentIdParam);
    }

    if (functionalLocationIdParam) {
      setValue("functionalLocationId", functionalLocationIdParam);
    }
  }, [equipmentIdParam, functionalLocationIdParam, findingStatusId, setValue]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={control}
          name="id"
          render={({ field }) => <Input {...field} hidden />}
        />
        <div className="grid grid-cols-2 max-w-xl space-x-2 sm:space-x-4 items-start">
          <FormField
            control={control}
            name="findingStatusId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={
                      field.value
                        ? String(field.value)
                        : findingStatusId
                        ? findingStatusId
                        : ""
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {findingStatuses &&
                        findingStatuses.map(({ id, description }) => (
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
            name="notification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notification</FormLabel>
                <FormControl>
                  <Input {...field} inputMode="numeric" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 max-w-xl space-x-2 sm:space-x-4 items-start">
          <FormField
            control={control}
            name="equipmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={
                      equipmentIdParam ? equipmentIdParam : undefined
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="functionalLocationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Functional location</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    defaultValue={
                      functionalLocationIdParam
                        ? functionalLocationIdParam
                        : undefined
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="images"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { onChange, value, ref, ...rest } }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Images</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  accept={ALLOWED_IMAGE_TYPES.map(
                    (val) => ` .${val}`
                  ).toString()}
                  onChange={(e) => {
                    clearErrors("images");
                    const images = e.target.files;
                    onChange(images);

                    if (images) {
                      if (images.length > MAX_FILE_COUNT) {
                        setError("images", {
                          message: `Maximum ${MAX_FILE_COUNT} images allowed.`,
                        });
                      }

                      for (let i = 0; images?.length; i++) {
                        if (images[i].size > MAX_FILE_SIZE) {
                          setError("images", {
                            message: `The file size of number ${i + 1} of ${
                              images?.length
                            } has exceeded the maximum limit of ${
                              MAX_FILE_SIZE / 1024 / 1024
                            }MB.`,
                          });
                        }
                      }
                      onChange(undefined);
                    }
                  }}
                  required={!isEditing}
                  ref={ref}
                  {...rest}
                />
              </FormControl>
              <FormDescription>
                Allowed file types:{" "}
                {ALLOWED_IMAGE_TYPES.map(
                  (extension, index) =>
                    `${
                      extension.replace("image/", "") +
                      (index !== ALLOWED_IMAGE_TYPES.length - 1 ? ", " : ".")
                    }`
                )}
              </FormDescription>
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
