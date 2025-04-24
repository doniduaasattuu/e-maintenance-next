"use client";

import React from "react";
import OptionsDropdown from "./options-dropdown";
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import {
  Camera,
  Edit,
  HistoryIcon,
  NotepadTextIcon,
  QrCode,
} from "lucide-react";
import { Equipment } from "@/types/equipment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { onlyAdmin } from "@/lib/config";
import useUserClient from "@/hooks/useUserClient";

type EquipmentOptionsProps = {
  equipment: Equipment;
  id: string;
};

export default function EquipmentOptions({
  equipment,
  id,
}: EquipmentOptionsProps) {
  const user = useUserClient();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  return (
    <React.Fragment>
      <OptionsDropdown className="w-[160px]">
        {onlyAdmin.includes(user?.role) && (
          <DropdownMenuItem asChild>
            <Link className="text-sm" href={`/equipments/${id}/edit`}>
              <Edit />
              Edit
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div className="flex gap-2 items-center">
              <NotepadTextIcon size={16} className="text-muted-foreground" />
              Inspection
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem asChild>
                <Link
                  className="text-sm"
                  href={`/inspections/${equipment.id}/create`}
                >
                  <NotepadTextIcon />
                  New
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="text-sm"
                  href={`/inspections/${equipment.id}/history`}
                >
                  <HistoryIcon />
                  History
                </Link>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem asChild>
          <Link
            className="text-sm"
            href={{
              pathname: "/findings/create",
              query: {
                equipmentId: equipment.id,
                functionalLocationId: equipment.functionalLocation?.id,
              },
            }}
          >
            <Camera />
            New Finding
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            className="w-full flex items-center gap-2"
            onClick={handleOpenDialog}
          >
            <QrCode />
            Show QR
          </button>
        </DropdownMenuItem>
      </OptionsDropdown>

      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{id}</DialogTitle>
            <DialogDescription>
              Equipment id generated qr code
            </DialogDescription>
          </DialogHeader>
          <div className="p-2 bg-white flex justify-center">
            <QRCodeSVG value={id} className="w-full h-auto" />
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
