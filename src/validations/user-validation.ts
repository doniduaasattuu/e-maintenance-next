import { z } from "zod";

const MAX_FILE_IN_MB: number = 5;
const MAX_FILE_SIZE: number = MAX_FILE_IN_MB * 1024 * 1024;

export const BaseUserSchema = z.object({
  nik: z
    .string({ message: "NIK is required" })
    .trim()
    .length(8, { message: "NIK should be 8 characters long" })
    .refine((value) => /^\d+$/.test(value), {
      message: "NIK should be numeric",
    }),
  name: z.string({ message: "Name is required" }).min(3).max(100).trim(),
  email: z.coerce
    .string()
    .email()
    .toLowerCase()
    .trim()
    .refine((value: string) => !/\s/.test(value), {
      message: "String cannot contain spaces",
    }),
  phone: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .refine(
      (val) =>
        val === undefined ||
        (typeof val === "string" && val.length >= 11 && val.length <= 13),
      {
        message: "Phone number must be between 11 and 13 character(s)",
      }
    ),
  positionId: z.string().optional(),
  departmentId: z.string().optional(),
  image: z
    .instanceof(File)
    .refine((image) => !image || image.size <= MAX_FILE_SIZE, {
      message: `File size has exceeded it max limit of ${
        MAX_FILE_SIZE / 1024 / 1024
      }MB`,
      path: ["image"],
    })
    .optional(),
  roleId: z.number({ message: "Role can't be empty" }),
  register_code: z
    .string({ message: "Register code is required" })
    .regex(/^[a-zA-Z0-9\p{P}\s]+$/u, {
      message:
        "Register code must contain only alphanumeric, symbolic characters, and spaces",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Register code must contain at least one lowercase letter",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Register code must contain at least one uppercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Register code must contain at least one number",
    }),
  password: z.string({ message: "Password is required" }).min(8),
  new_password: z.string({ message: "New Password is required" }).min(8),
});

export const RegisterUserSchema = BaseUserSchema.pick({
  nik: true,
  email: true,
  name: true,
  password: true,
  register_code: true,
})
  .extend({
    confirm: z.string({ message: "Confirm password is required" }).min(8),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Password don't match",
    path: ["confirm"],
  });

export const LoginUserSchema = BaseUserSchema.pick({
  email: true,
  password: true,
});

export const UpdateUserSchema = BaseUserSchema.pick({
  email: true,
  nik: true,
  name: true,
  phone: true,
  positionId: true,
  departmentId: true,
  image: true,
});

export const UpdatePasswordSchema = BaseUserSchema.pick({
  password: true,
  new_password: true,
})
  .extend({
    confirm: z.string().min(8),
  })
  .refine((data) => data.new_password === data.confirm, {
    message: "Password don't match",
    path: ["confirm"],
  });
