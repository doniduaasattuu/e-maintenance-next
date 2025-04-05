"use server";

import prisma from "@/lib/prisma";
import {
  RegisterUserSchema,
  UpdatePasswordSchema,
  UpdateUserSchema,
} from "@/validations/user-validation";
import bcrypt from "bcrypt";
import { getRoleByName } from "./role-action";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from "fs/promises";
import fSync from "fs";
import path from "path";

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
        user: null,
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
        user: null,
      };
    }

    const rawData = Object.fromEntries(formData.entries());
    const validatedData = UpdatePasswordSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
        user: null,
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
        user: null,
      };
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: { select: { id: true, name: true } },
      },
    });

    return {
      success: true,
      message: "Password updated successfully",
      user: updatedUser,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        errors: null,
        user: null,
      };
    }

    return {
      success: false,
      message: "Something went wrong",
      errors: null,
      user: null,
    };
  }
}

export async function editProfile(prevState: unknown, formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user?.id) {
      return {
        success: false,
        errors: { email: ["User not found"] },
        user: null,
      };
    }

    const rawData = Object.fromEntries(formData.entries());
    const validatedData = UpdateUserSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation error",
        errors: validatedData.error.flatten().fieldErrors,
        user: null,
      };
    }

    const { email, nik, name, image } = validatedData.data;

    const existingUserWithEmail = await prisma.user.findFirst({
      where: {
        email: email,
        id: { not: Number(user.id) }, // Kecualikan pengguna saat ini
      },
    });

    if (existingUserWithEmail) {
      return {
        success: false,
        errors: { email: ["Email already in use"] },
        user: null,
      };
    }

    const existingUserWithNik = await prisma.user.findFirst({
      where: {
        nik: nik,
        id: { not: Number(user.id) }, // Kecualikan pengguna saat ini
      },
    });

    if (existingUserWithNik) {
      return {
        success: false,
        errors: { nik: ["NIK already in use"] },
        user: null,
      };
    }

    let imagePath = null;

    if (image instanceof File && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileExtension = image.name.split(".").pop();
      const fileName = `${nik}${Date.now()}.${fileExtension}`;
      const destinationPath = path.join(
        process.cwd(),
        "public/images/users",
        fileName
      );

      if (user.image) {
        const filePath = path.join(process.cwd(), "public", user.image);

        if (fSync.existsSync(filePath)) {
          await fs.unlink(filePath);
        }
      }

      await fs.writeFile(destinationPath, buffer);
      imagePath = `/images/users/${fileName}`;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(user.id),
      },
      data: {
        email: email,
        nik: nik,
        name: name,
        ...(imagePath && { image: imagePath }),
      },
      select: {
        id: true,
        email: true,
        nik: true,
        name: true,
        image: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Profile updated successfully",
      errors: null,
      user: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        errors: { email: [error.message] },
        user: null,
      };
    }

    return {
      success: false,
      message: "Something went wrong",
      errors: { email: ["Something went wrong"] },
      user: null,
    };
  }
}
