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

const updateFormSchema = UpdateUserSchema;

type UpdateFormSchema = z.infer<typeof updateFormSchema>;

type updateUserProps = {
  user: {
    nik: string;
    name: string;
    email: string;
    image: string | null;
    roleId: number;
    password: string;
    id: number;
    createdAt: Date;
  } | null;
};

export default function UpdateUserForm({ user }: updateUserProps) {
  // UPDATE USER FORM
  const updateUserForm = useForm<UpdateFormSchema>({
    resolver: zodResolver(updateFormSchema),
  });

  React.useEffect(() => {
    if (user) {
      updateUserForm.reset({
        email: user.email ?? "",
        nik: user.nik ?? "",
        name: user.name ?? "",
      });
    }
  }, [user, updateUserForm]);

  const { handleSubmit, control } = updateUserForm;

  const onSubmit = handleSubmit(async (values) => {
    try {
      console.log(values);
      // const formData = new FormData();
      // formData.append("email", values.email);
      // formData.append("name", values.name);
      // if (values.image) {
      //   formData.append("image", values.image);
      // }
      // const response = await fetch("/api/auth/profile", {
      //   method: "PATCH",
      //   body: formData,
      // });
      // const result = await response.json();
      // if (!response.ok) {
      //   throw new Error("An unexpected error occured");
      // }
      // toast.success("Success", {
      //   description: "Profile successfully updated",
      // });
      // await update({
      //   user: {
      //     ...data?.user,
      //     name: result.data.name,
      //     image: result.data.image,
      //   },
      // });
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error", {
          description: error.message,
        });
      }
    }
  });

  return (
    <Form {...updateUserForm}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} readOnly disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="nik"
          render={({ field }) => (
            <FormItem className="max-w-md">
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
          name="name"
          render={({ field }) => (
            <FormItem className="max-w-md">
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
          name="image"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { onChange, value, ref, ...rest } }) => (
            <FormItem className="max-w-md">
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null; // Ensure correct file type
                    onChange(file); // Store File object, not string
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
          <LoadingButton label="Save" />
        </div>
      </form>
    </Form>
  );
}
