import { Card } from "@/components/ui/card";
import UpdatePasswordForm from "@/components/update-password-form";
import UpdateUserForm from "@/components/update-user-form";
import { getServerSession } from "next-auth";
import React from "react";
import prisma from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await getServerSession();
  const sessionUser = session?.user;

  const user = await prisma.user.findUnique({
    where: {
      email: sessionUser?.email ?? "",
    },
  });

  if (!user) {
    return <p>Your&apos;e not logged in</p>;
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="mb-6">
          <div className="font-semibold text-lg">Profile Information</div>
          <p className="text-sm text-muted-foreground">
            Update your account&apos;s profile information and username
          </p>
        </div>
        <UpdateUserForm />
      </Card>
      <Card className="p-6">
        <div className="mb-6">
          <div className="font-semibold text-lg">Profile</div>
          <p className="text-sm text-muted-foreground">
            Ensure your account is using a long, random password to stay secure
          </p>
        </div>
        <UpdatePasswordForm />
      </Card>
    </div>
  );
}
