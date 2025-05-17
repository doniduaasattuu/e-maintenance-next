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
  Image as ImageIcon,
  NotepadTextIcon,
  QrCode,
} from "lucide-react";
import { EquipmentWitRelations } from "@/types/equipment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";

type EquipmentOptionsProps = {
  equipment: EquipmentWitRelations;
  id: string;
};

export default function EquipmentOptions({
  equipment,
  id,
}: EquipmentOptionsProps) {
  const hasImages: boolean =
    (equipment.equipmentImages && equipment.equipmentImages.length > 0) ??
    false;
  const [isQROpen, setIsQROpen] = React.useState<boolean>(false);
  const [isImageOpen, setIsImageOpen] = React.useState<boolean>(false);

  const handleOpenImageDialog = () => {
    setIsImageOpen(true);
  };

  const handleOpenQRDialog = () => {
    setIsQROpen(true);
  };

  const handleCloseDialog = () => {
    setIsQROpen(false);
    setIsImageOpen(false);
  };

  return (
    <React.Fragment>
      <OptionsDropdown className="w-[160px]">
        <DropdownMenuItem asChild>
          <Link className="text-sm" href={`/equipments/${id}/edit`}>
            <Edit />
            Edit
          </Link>
        </DropdownMenuItem>
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
        {hasImages && (
          <DropdownMenuItem asChild>
            <button
              className="w-full flex items-center gap-2"
              onClick={handleOpenImageDialog}
            >
              <ImageIcon />
              Images
            </button>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <button
            className="w-full flex items-center gap-2"
            onClick={handleOpenQRDialog}
          >
            <QrCode />
            Show QR
          </button>
        </DropdownMenuItem>
      </OptionsDropdown>

      <Dialog open={isQROpen} onOpenChange={handleCloseDialog}>
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

      <Dialog open={isImageOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="border-none px-4 bg-black/0 sm:max-w-2xl">
          {hasImages ? (
            <Carousel className="p-6 w-full">
              <CarouselContent className="rounded-md items-center">
                {equipment.equipmentImages?.map((item, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={item.image.path}
                      alt={`Image ${index + 1} for ${equipment.id}`}
                      width={1000}
                      height={1000}
                      className="object-center object-cover rounded-md"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext />
              <CarouselPrevious />
            </Carousel>
          ) : (
            <p>This equipment doesn&apos;t have any images.</p>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
