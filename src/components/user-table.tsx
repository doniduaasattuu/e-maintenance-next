"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { User } from "@/types/user";
import UserAvatar from "./user-avatar";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/types/role";
import { toast } from "sonner";
import { assignRoleById } from "@/actions/role-action";

export default function UserTable({
  users,
  roles,
}: {
  users: User[];
  roles: Role[];
}) {
  return (
    <Table>
      <TableCaption>A list of registered users.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead className="w-[100px] text-muted-foreground">
            Name
          </TableHead>
          <TableHead className="truncate text-muted-foreground">
            Contact
          </TableHead>
          <TableHead className="truncate text-muted-foreground">
            Department
          </TableHead>
          <TableHead className="truncate text-muted-foreground">Role</TableHead>
          <TableHead className="w-[110px] text-muted-foreground">
            Join date
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-x-scroll scrollbar-hide">
        {users &&
          users.length >= 1 &&
          users.map((user) => {
            const selectedRole = String(user.role?.id);
            const handleChangeRole = async (roleId: string, userId: number) => {
              try {
                const response = await assignRoleById({
                  roleId: parseInt(roleId),
                  userId: userId,
                });

                if (response.success) {
                  toast.success("Success", {
                    description: `Successfully asign user role to ${
                      roles.find((role) => String(role.id) === roleId)?.name
                    }`,
                  });
                } else {
                  throw new Error(response.message);
                }
              } catch (e) {
                if (e instanceof Error) {
                  toast.error("Error", {
                    description: e.message,
                  });
                }
              }
            };

            return (
              <TableRow key={user.id}>
                <TableCell className="w-[50px]">
                  <UserAvatar user={user} />
                </TableCell>
                <TableCell className="flex-col align-top">
                  <div className="flex flex-col space-x-2 items-start max-w-sm truncate">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-muted-foreground">{user.nik}</span>
                  </div>
                </TableCell>
                <TableCell className="font-light align-top">
                  <div className="flex flex-col space-x-2 items-start max-w-sm truncate">
                    <Link
                      href={`mailto:${user.email}`}
                      target="_blank"
                      className="link"
                    >
                      <span>{user.email}</span>
                    </Link>
                    <Link
                      href={`https://wa.me/${user?.phone}`}
                      target="_blank"
                      className="link text-muted-foreground"
                    >
                      {user?.phone}
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="font-light align-top">
                  <div className="flex flex-col space-x-2 items-start max-w-sm truncate">
                    <span className="font-medium">{user.department?.name}</span>
                    <span className="text-muted-foreground font-medium">
                      {user.position?.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-light text-muted-foreground align-top">
                  <Select
                    disabled={user.email === "admin@gmail.com"}
                    defaultValue={selectedRole}
                    onValueChange={(roleId) =>
                      handleChangeRole(roleId, user.id)
                    }
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        {roles &&
                          roles.map((role) => (
                            <SelectItem key={role.id} value={String(role.id)}>
                              {role.name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="font-light text-muted-foreground align-top">
                  {formatDate(user.createdAt)}
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
