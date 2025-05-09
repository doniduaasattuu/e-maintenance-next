"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

import React from "react";
import { Badge } from "./ui/badge";
import { File } from "@/types/file";
import { formatDate, uppercaseFirstLetter } from "@/lib/utils";
import FileAction from "./file-action";

export default function FileTable({ files }: { files: File[] }) {
  return (
    <Table>
      <TableCaption>A list of all files.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-muted-foreground">Name</TableHead>
          <TableHead className="text-muted-foreground">Ext.</TableHead>
          <TableHead className="text-muted-foreground">Tags</TableHead>
          <TableHead className="text-muted-foreground">Uploaded at</TableHead>
          <TableHead className="text-right text-muted-foreground">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files &&
          files.length >= 1 &&
          files.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium max-w-[300px] md:max-w-[600px] truncate">
                <Link href={file.path} className="link" target="_blank">
                  {file.name}
                </Link>
              </TableCell>
              <TableCell className="max-w-[20px]">
                {`.${file?.path.split(".").pop()}`}
              </TableCell>
              <TableCell className="flex overflow-x-scroll max-w-[200px] mt-1 space-x-1 scrollbar-hide align-middle">
                {file.tags &&
                  file.tags.split(" ").map((tag) => (
                    <Badge key={tag} variant={"secondary"}>
                      {uppercaseFirstLetter(tag)}
                    </Badge>
                  ))}
              </TableCell>
              <TableCell className="w-[110px] text-muted-foreground">
                {formatDate(file.createdAt)}
              </TableCell>
              <FileAction file={file} />
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
