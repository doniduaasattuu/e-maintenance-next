"use server";

import prisma from "@/lib/prisma";
import {
  RegisterUserSchema,
  UpdatePasswordSchema,
  UpdateUserSchema,
} from "@/validations/user-validation";
import bcrypt from "bcrypt";
import { getRoleByName } from "./role-action";
import fs from "fs/promises";
import fSync from "fs";
import path from "path";
import { User } from "@/types/user";
import { REGISTER_CODE } from "@/lib/config";
import { getUserSession } from "@/hooks/useUserSession";

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

    const { nik, email, name, password, register_code } = validatedData.data;

    if (register_code !== REGISTER_CODE) {
      return {
        success: false,
        message: "Register error",
        errors: {
          register_code: ["Register code is not match"],
        },
      };
    }

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
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      errors: null,
    };
  }
}

export async function updatePassword(prevState: unknown, formData: FormData) {
  try {
    const userSession = await getUserSession();

    if (userSession) {
      return {
        success: false,
        errors: { email: ["User not found"] },
        user: null,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: userSession.email,
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
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      errors: null,
    };
  }
}

export async function editProfile(prevState: unknown, formData: FormData) {
  try {
    const user = await getUserSession();

    if (!user) {
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

    const { email, nik, name, image, phone, positionId, departmentId } =
      validatedData.data;

    const existingUserWithEmail = await prisma.user.findFirst({
      where: {
        email: email,
        id: { not: Number(user.id) },
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
        id: { not: Number(user.id) },
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

      const fileExtension = image.name.split(".").pop(); // ekstensi file
      const fileName = `${nik}-${Date.now()}.${fileExtension}`; // 12345678-1745931455077.jpg
      const uploadsDir = path.join(
        process.cwd(),
        "storage",
        "uploads",
        "images",
        "user"
      );
      const destinationPath = path.join(uploadsDir, fileName);

      await fs.mkdir(uploadsDir, { recursive: true });

      if (user.image) {
        const oldImagePath = path.join(
          process.cwd(),
          "storage",
          user.image.replace("/api", "")
        );
        if (fSync.existsSync(oldImagePath)) {
          await fs.unlink(oldImagePath);
        }
      }

      await fs.writeFile(destinationPath, buffer);
      imagePath = `/api/uploads/images/user/${fileName}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(user.id) },
      data: {
        email,
        nik,
        name,
        phone: phone === undefined ? null : phone,
        positionId,
        departmentId,
        ...(imagePath && { image: imagePath }),
      },
      select: {
        id: true,
        email: true,
        nik: true,
        name: true,
        phone: true,
        positionId: true,
        departmentId: true,
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
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      errors: null,
    };
  }
}

type GetUsersParams = {
  page?: number;
  perPage?: string;
  orderBy?: string;
  sortBy?: string;
  query?: string;
  department?: string;
  position?: string;
};

type PaginatedUsers = {
  users: User[];
  totalPages: number;
};

export async function getUsers({
  page = 1,
  perPage = "10",
  orderBy = "asc",
  sortBy = "name",
  query,
  department,
  position,
}: GetUsersParams): Promise<PaginatedUsers> {
  const skip = (page - 1) * parseInt(perPage);
  const take = parseInt(perPage);

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      skip,
      take,
      orderBy: { [sortBy]: orderBy as "asc" | "desc" },
      where: {
        ...(query && {
          OR: [
            {
              nik: { contains: query, mode: "insensitive" },
            },
            {
              name: { contains: query, mode: "insensitive" },
            },
            {
              email: { contains: query, mode: "insensitive" },
            },
          ],
        }),
        ...(department && {
          departmentId: department,
        }),
        ...(position && {
          positionId: position,
        }),
      },
      select: {
        id: true,
        nik: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        position: {
          select: {
            id: true,
            name: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({
      where: {
        ...(query && {
          OR: [
            {
              nik: { contains: query, mode: "insensitive" },
            },
            {
              name: { contains: query, mode: "insensitive" },
            },
            {
              email: { contains: query, mode: "insensitive" },
            },
          ],
        }),
        ...(department && {
          departmentId: department,
        }),
        ...(position && {
          positionId: position,
        }),
      },
    }),
  ]);

  return {
    users,
    totalPages: Math.ceil(total / parseInt(perPage)),
  };
}
