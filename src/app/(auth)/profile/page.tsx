import { Card } from "@/components/ui/card";
import UpdatePasswordForm from "@/components/update-password-form";
import UpdateUserForm from "@/components/update-user-form";
import { getServerSession } from "next-auth";
import React from "react";
import prisma from "@/lib/prisma";

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
    <div className="space-y-8 mb-4">
      <Card className="py-8 px-5 md:p-8">
        <div className="mb-2">
          <div className="font-semibold text-lg">Profile Information</div>
          <p className="text-sm text-muted-foreground">
            Update your account&apos;s profile information and username
          </p>
        </div>
        <UpdateUserForm user={user} />
      </Card>
      <Card className="py-8 px-5 md:p-8">
        <div className="mb-2">
          <div className="font-semibold text-lg">Update Password</div>
          <p className="text-sm text-muted-foreground">
            Ensure your account is using a long, random password to stay secure
          </p>
        </div>
        <UpdatePasswordForm />
      </Card>
    </div>
  );
}
