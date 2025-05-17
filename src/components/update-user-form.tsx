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
import { UpdateUserSchema } from "@/validations/user-validation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import LoadingButton from "./loading-button";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/config";
import { useFormState } from "react-dom";
import { editProfile } from "@/actions/user-action";
import { useSession } from "next-auth/react";
import { User } from "@/types/user";
import { Position } from "@/types/position";
import { Department } from "@/types/department";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useRouter } from "next/navigation";

const updateFormSchema = UpdateUserSchema;

type UpdateFormSchema = z.infer<typeof updateFormSchema>;

const initialState = {
  success: false,
  message: "",
  errors: null,
  user: null,
};

type updateUserProps = {
  user: User;
  positions: Position[] | null;
  departments: Department[] | null;
};

export default function UpdateUserForm({
  user,
  positions,
  departments,
}: updateUserProps) {
  const router = useRouter();
  const { update } = useSession();
  const [state, formAction, pending] = useFormState(editProfile, initialState);
  const form = useForm<UpdateFormSchema>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      email: user?.email,
      nik: user?.nik,
      name: user?.name,
      phone: user?.phone ?? undefined,
      positionId: user?.position?.id ?? undefined,
      departmentId: user?.department?.id ?? undefined,
      image: undefined,
    },
  });

  const { control, setError, reset, handleSubmit, clearErrors } = form;

  React.useEffect(() => {
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          setError(field as keyof UpdateFormSchema, {
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

      const user = state?.user;
      update({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role.name,
          image: user.image,
        },
      });

      reset({
        email: user.email,
        nik: user.nik,
        phone: user.phone ?? undefined,
        positionId: user.positionId ?? undefined,
        departmentId: user.departmentId ?? undefined,
        name: user.name,
        image: undefined,
      });

      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, reset, router]);

  const onUpdate = handleSubmit((values) => {
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
      <form onSubmit={onUpdate} className="space-y-4">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
          name="nik"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>NIK</FormLabel>
              <FormControl>
                <Input inputMode="numeric" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input inputMode="numeric" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="positionId"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {positions &&
                      positions.map(({ id, name }) => (
                        <SelectItem key={id} value={String(id)}>
                          {name}
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
          name="departmentId"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments &&
                      departments.map(({ id, name }) => (
                        <SelectItem key={id} value={String(id)}>
                          {name}
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
          name="image"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { onChange, value, ref, ...rest } }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept={ALLOWED_IMAGE_TYPES.map(
                    (type) => `image/${type}`
                  ).join(", ")}
                  onChange={(e) => {
                    const image = e.target.files?.[0] || undefined;
                    if (image) {
                      if (image.size > MAX_FILE_SIZE) {
                        setError("image", {
                          message: `File size has exceeded it max limit of ${
                            MAX_FILE_SIZE / 1024 / 1024
                          }MB`,
                        });
                        onChange(undefined);
                      } else {
                        clearErrors("image");
                        onChange(image);
                      }
                    }
                  }}
                  ref={ref}
                  {...rest}
                />
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
