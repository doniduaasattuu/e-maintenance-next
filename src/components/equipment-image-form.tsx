"use client";

import { UploadEquipmentImageSchema } from "@/validations/equipment-validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ALLOWED_IMAGE_TYPES } from "@/lib/config";
import React from "react";
import { uploadEquipmentImage } from "@/actions/equipment-action";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { compressImage } from "@/lib/utils";

const equipmentImageSchema = UploadEquipmentImageSchema;
type EquipmentImageSchema = z.infer<typeof equipmentImageSchema>;

const initialState = {
  success: false,
  message: "",
  errors: null,
};

export default function EquipmentImageForm({
  equipmentId,
}: {
  equipmentId: string;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useFormState(
    uploadEquipmentImage,
    initialState
  );

  const form = useForm<EquipmentImageSchema>({
    resolver: zodResolver(equipmentImageSchema),
    defaultValues: {
      id: equipmentId,
      image: undefined,
    },
  });

  const { control, setError, reset, handleSubmit, clearErrors } = form;

  React.useEffect(() => {
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          setError(field as keyof EquipmentImageSchema, {
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

      router.refresh();

      reset({
        image: undefined,
      });
    }
  }, [state, reset, router]);

  const onUpload = handleSubmit((values) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    React.startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onUpload} className="space-y-4">
        <FormField
          control={control}
          name="id"
          render={({ field }) => (
            <Input {...field} defaultValue={equipmentId} hidden />
          )}
        />
        <FormField
          control={control}
          name="image"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { onChange, value, ref, ...rest } }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Upload</FormLabel>
              <FormControl>
                <div className="flex gap-2 sm:gap-3">
                  <Input
                    capture="environment"
                    type="file"
                    accept={ALLOWED_IMAGE_TYPES.map(
                      (type) => `image/${type}`
                    ).join(", ")}
                    onChange={async (e) => {
                      const image = e.target.files?.[0] || undefined;
                      if (image) {
                        clearErrors("image");
                        const compressed = await compressImage(image);

                        if (
                          compressed instanceof Blob &&
                          !(compressed instanceof File)
                        ) {
                          const file = new File([compressed], image.name, {
                            type: image.type,
                            lastModified: Date.now(),
                          });
                          onChange(file);
                        } else {
                          setError("image", {
                            message: "Failed to compress image",
                          });
                          onChange(undefined);
                        }
                      }
                    }}
                    disabled={pending}
                    ref={ref}
                    {...rest}
                  />
                  <Button type="submit">
                    <Upload />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
