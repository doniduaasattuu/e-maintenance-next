import { z } from "zod";

export const BaseRoleSchema = z.object({
  name: z.string({ message: "Role name is required" }).min(3).max(100),
});

export const CreateRoleSchema = BaseRoleSchema;

export class RoleValidation {
  static readonly CREATE: z.ZodType = CreateRoleSchema;
}
