"use client";

import React from "react";

import { Input } from "./ui/input";
import { Equipment } from "@/types/equipment";
import { toast } from "sonner";
import { handleScrollToBottom } from "@/lib/utils";
import { deleteFileFromEquipment } from "@/actions/equipment-file-action";
import Link from "next/link";

type File = { id: string; name: string; path: string };

type FileListProps = {
  equipment: Equipment;
  items:
    | {
        file: File;
      }[]
    | undefined;
};

export default function FileDetachment({ equipment, items }: FileListProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredItems = React.useMemo(() => {
    if (!items) return null;
    if (!searchTerm) return items;

    const lowerSearchTerm = searchTerm.toLowerCase();

    return items.filter((item) => {
      const fileId = item.file.id.toLowerCase();
      const fileName = item.file.name.toLowerCase();
      return (
        fileId.includes(lowerSearchTerm) || fileName.includes(lowerSearchTerm)
      );
    });
  }, [items, searchTerm]);

  const handleRemoveFile = (equipmentId: string, fileId: string) => {
    try {
      deleteFileFromEquipment(equipmentId, fileId);
    } catch (error) {
      if (error instanceof Error) {
        toast("Error", { description: error.message });
      }
    }
  };

  const handleResetFilter = () => {
    setSearchTerm("");
    handleScrollToBottom();
  };

  return (
    <div className="space-y-4 max-w-xl">
      <div className="flex space-x-3 items-center">
        <Input
          className="max-w-[300px]"
          id="filter"
          placeholder="Filter..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => handleResetFilter()}
          className="text-sm cursor-pointer font-semibold text-blue-400"
        >
          Reset
        </button>
      </div>
      {filteredItems &&
        filteredItems.map((item) => (
          <div
            key={item.file.id}
            className="flex justify-between text-sm max-w-xl space-x-3"
          >
            <div className="truncate">
              <Link target="_blank" className="link" href={item.file.path}>
                {item.file.name}
              </Link>
            </div>
            <div
              className="text-sm cursor-pointer link"
              onClick={() => handleRemoveFile(equipment.id, item.file.id)}
            >
              Detach
            </div>
          </div>
        ))}
    </div>
  );
}
