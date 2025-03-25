import { z } from "zod";

const MAX_FILE_IN_MB: number = 5;
const MAX_FILE_SIZE: number = MAX_FILE_IN_MB * 1024 * 1024;

export const BaseUserSchema = z.object({
  nik: z.string({ message: "NIK is required" }),
  name: z.string({ message: "Name is required" }).min(3).max(100),
  email: z.coerce
    .string()
    .email()
    .toLowerCase()
    .trim()
    .refine((value: string) => !/\s/.test(value), {
      message: "String cannot contain spaces",
    }),
  image: z.instanceof(File).optional(),
  roleId: z.number({ message: "Role can't be empty" }),
  password: z.string({ message: "Password is required" }).min(8),
  new_password: z.string({ message: "New Password is required" }).min(8),
});

export const RegisterUserSchema = BaseUserSchema.pick({
  nik: true,
  email: true,
  name: true,
  password: true,
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
  image: true,
}).refine(
  (data) => !data.image || data.image.size <= MAX_FILE_SIZE, // 2MB
  {
    message: `File size has exceeded it max limit of ${MAX_FILE_IN_MB}MB`,
    path: ["image"],
  }
);

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

export class UserValidation {
  static readonly REGISTER: z.ZodType = RegisterUserSchema;
  static readonly LOGIN: z.ZodType = LoginUserSchema;
}
