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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatDate } from "@/lib/utils";

type Note = {
  date: Date;
  note: string | null;
  inspector: string | null;
};

export default function TableNote({ noteData }: { noteData: Note[] }) {
  noteData = noteData.filter((data) => data.note !== null);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Note</CardTitle>
        <CardDescription>Inspector note history</CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="mx-0">
          <TableCaption>A list of inspector note.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-muted-foreground">
                Inspector
              </TableHead>
              <TableHead className="text-muted-foreground">Note</TableHead>
              <TableHead className="text-right text-muted-foreground">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {noteData &&
              noteData.length > 0 &&
              noteData.map((note: Note, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium align-top truncate">
                    {note.inspector}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words min-w-[250px] align-top">
                    {note.note}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground align-top">
                    {formatDate(note.date)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
