import React from "react";
import OptionsDropdown from "./options-dropdown";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import Link from "next/link";
import { Finding } from "@/types/finding";
import { DialogDelete } from "./dialog-delete";
import { toast } from "sonner";
import { deleteFindingById } from "@/actions/finding-action";

type FindingActionProps = {
  finding: Finding;
};

export default function FindingAction({ finding }: FindingActionProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  const handleDeleteFinding = (id: string) => {
    try {
      const response = deleteFindingById(id);

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
      <OptionsDropdown
        trigger={<MoreHorizontal className="text-muted-foreground" />}
      >
        <DropdownMenuItem asChild>
          <Link href={`/findings/${finding.id}/edit`} className="font-sm link">
            <Edit />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOpenDialog}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </OptionsDropdown>

      <DialogDelete
        isOpen={isOpen}
        onOpenChange={handleCloseDialog}
        confirmAction={() => handleDeleteFinding(finding.id)}
      />
    </React.Fragment>
  );
}
