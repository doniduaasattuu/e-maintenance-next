"use client";

import React, { useState } from "react";

import { Equipment } from "@/types/equipment";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from "./ui/dialog";
import Image from "next/image";
import { deleteImageFromEquipment } from "@/actions/equipment-image-action";

type Image = { id: string; path: string };

type ImageListProps = {
  equipment: Equipment;
  items:
    | {
        image: Image;
      }[]
    | undefined;
};

export default function ImageDetachment({ equipment, items }: ImageListProps) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isImageDialogOpen, setIsImageDialogOpen] = useState<boolean>(false);

  function handleOpenImageDialog(path: string) {
    setIsImageDialogOpen(true);
    setImageSrc(path);
  }

  function handleCloseDialog() {
    setIsImageDialogOpen(false);
  }

  const handleRemoveImage = (equipmentId: string, imageId: string) => {
    try {
      deleteImageFromEquipment(equipmentId, imageId);
    } catch (error) {
      if (error instanceof Error) {
        toast("Error", { description: error.message });
      }
    }
  };

  return (
    <div className="space-y-4 max-w-xl">
      {items &&
        items?.length > 0 &&
        items?.map((item) => (
          <div
            key={item.image.id}
            className="flex justify-between text-sm max-w-xl space-x-3"
          >
            <div
              className="truncate cursor-pointer link"
              onClick={() => {
                handleOpenImageDialog(item.image.path);
              }}
            >
              {item.image.id}
            </div>
            <div
              className="text-sm cursor-pointer link"
              onClick={() => handleRemoveImage(equipment.id, item.image.id)}
            >
              Delete
            </div>
          </div>
        ))}

      <Dialog open={isImageDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>Image of {equipment.id}</DialogDescription>
          </DialogHeader>
          <div className="p-2 flex justify-center">
            <Image
              src={imageSrc}
              width={500}
              height={500}
              alt={`Image of equipment ${equipment.id}`}
              className="rounded-sm"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
