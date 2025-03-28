import { Card } from "@/components/ui/card";
import UpdatePasswordForm from "@/components/update-password-form";
import UpdateUserForm from "@/components/update-user-form";
import { getServerSession } from "next-auth";
import React from "react";
import prisma from "@/lib/prisma";
import HeaderCard from "@/components/header-card";

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session?.user) {
    return <p>Your&apos;e not logged in</p>;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email as string,
    },
  });

  if (!user) {
    return <p>Your&apos;e not logged in</p>;
  }

  return (
    <div className="space-y-6">
      <Card className="py-8 px-5 md:p-8 rounded-md">
        <HeaderCard
          header="Profile Information"
          content="Update your account's profile information and username"
        />
        <UpdateUserForm user={user} />
      </Card>
      <Card className="py-8 px-5 md:p-8 rounded-md">
        <HeaderCard
          header="Update Password"
          content="Ensure your account is using a long, random password to stay secure"
        />
        <UpdatePasswordForm />
      </Card>
    </div>
  );
}
