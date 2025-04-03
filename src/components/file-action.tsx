"use client";
import React from "react";
import { TableCell } from "./ui/table";
import OptionsDropdown from "./options-dropdown";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { File } from "@/types/file";
import { toast } from "sonner";
import { deleteFileById } from "@/actions/file-action";
import { DialogDelete } from "./dialog-delete";

export default function FileAction({ file }: { file: File }) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  const handleDeleteFile = (id: string) => {
    try {
      const response = deleteFileById(id);

      response.then((result) => {
        if (result.success) {
          toast.success("Success", { description: result.message });
        } else {
          throw new Error(result.message);
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error", { description: error.message });
      }
    }
  };

  return (
    <React.Fragment>
      <TableCell className="text-right">
        <OptionsDropdown>
          <DropdownMenuItem asChild>
            <Link href={`/files/${file.id}/edit`} className="font-sm link">
              <Edit />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenDialog}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </OptionsDropdown>
      </TableCell>
      <DialogDelete
        isOpen={isOpen}
        onOpenChange={handleCloseDialog}
        confirmAction={() => handleDeleteFile(file.id)}
      />
    </React.Fragment>
  );
}
