import UpdatePasswordForm from "@/components/update-password-form";
import UpdateUserForm from "@/components/update-user-form";
import { getServerSession } from "next-auth";
import React from "react";
import prisma from "@/lib/prisma";
import HeaderCard from "@/components/header-card";
import FormCard from "@/components/form-card";
import { User } from "@/types/user";
import { getPositions } from "@/actions/position-action";
import { getDepartments } from "@/actions/department-action";

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session?.user) {
    return <p>Your&apos;e not logged in</p>;
  }

  const user = (await prisma.user.findUnique({
    where: {
      email: session.user.email as string,
    },
    select: {
      id: true,
      nik: true,
      name: true,
      email: true,
      phone: true,
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
    },
  })) as User;

  const positions = await getPositions();
  const departments = await getDepartments();

  if (!user) {
    return <p>Your&apos;e not logged in</p>;
  }

  return (
    <div className="space-y-8">
      <FormCard>
        <HeaderCard
          header="Profile Information"
          content="Update your account's profile information and username"
        />
        <UpdateUserForm
          user={user}
          positions={positions}
          departments={departments}
        />
      </FormCard>
      <FormCard>
        <HeaderCard
          header="Update Password"
          content="Ensure your account is using a long, random password to stay secure"
        />
        <UpdatePasswordForm />
      </FormCard>
    </div>
  );
}
