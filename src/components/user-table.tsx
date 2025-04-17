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

export default function UserTable({ users }: { users: User[] }) {
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
                  {user.role.name}
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
