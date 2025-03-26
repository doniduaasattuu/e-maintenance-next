"use server";

import prisma from "@/lib/prisma";
import {
  RegisterUserSchema,
  UpdatePasswordSchema,
} from "@/validations/user-validation";
import bcrypt from "bcrypt";
import { getRoleByName } from "./role-action";
import { getServerSession } from "next-auth";

export async function createUser(prevState: unknown, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = RegisterUserSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Please fix the errors in the form.",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { nik, email, name, password } = validatedData.data;

    // CHECKING USER IS EXISTS
    const userExist = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { nik: nik }],
      },
    });

    if (userExist) {
      return {
        success: false,
        message: "Email already been taken",
        errors: {
          email:
            userExist.email === email
              ? ["Email already been taken"]
              : undefined,
          nik: userExist.nik === nik ? ["NIK already been taken"] : undefined,
        },
      };
    }

    const userRole = await getRoleByName("User");

    if (!userRole) {
      return {
        success: false,
        message: "Role has not been set",
        errors: { email: ["Role has not been set"] },
      };
    }

    // USER CREATION
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        nik: nik,
        email: email,
        name: name,
        roleId: userRole.id,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "User created successfully",
      errors: null,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        errors: null,
      };
    }

    return {
      success: false,
      message: "Something went wrong",
      errors: null,
    };
  }
}

export async function updatePassword(prevState: unknown, formData: FormData) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return {
        success: false,
        errors: { email: ["User not found"] },
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!user) {
      return {
        success: false,
        errors: { email: ["User not found"] },
      };
    }

    const rawData = Object.fromEntries(formData.entries());
    const validatedData = UpdatePasswordSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const isPasswordValid = await bcrypt.compare(
      validatedData.data.password,
      user.password
    );

    const hashedPassword = await bcrypt.hash(
      validatedData.data.new_password,
      10
    );

    if (!isPasswordValid) {
      return {
        success: false,
        errors: { password: ["Invalid crendentials"] },
      };
    }

    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        errors: null,
      };
    }

    return {
      success: false,
      message: "Something went wrong",
      errors: null,
    };
  }
}
