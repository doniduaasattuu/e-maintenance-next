"use client";

import React from "react";

import { Roboto_Mono } from "next/font/google";
import { Input } from "./ui/input";
import { Equipment } from "@/types/equipment";
import { deleteMaterialFromEquipment } from "@/actions/equipment-material-action";
import { toast } from "sonner";
import { handleScrollToBottom } from "@/lib/utils";

const robotoMono = Roboto_Mono({ subsets: ["latin"] });
type Material = { id: string; name: string; price: number };

type MaterialListProps = {
  equipment: Equipment;
  items:
    | {
        material: Material;
        quantity: number;
      }[]
    | undefined;
};

export default function MaterialDetachment({
  equipment,
  items,
}: MaterialListProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredItems = React.useMemo(() => {
    if (!items) return null;
    if (!searchTerm) return items;

    const lowerSearchTerm = searchTerm.toLowerCase();

    return items.filter((item) => {
      const materialId = item.material.id.toLowerCase();
      const materialName = item.material.name.toLowerCase();
      return (
        materialId.includes(lowerSearchTerm) ||
        materialName.includes(lowerSearchTerm)
      );
    });
  }, [items, searchTerm]);

  const handleRemoveMaterial = (equipmentId: string, materialId: string) => {
    try {
      deleteMaterialFromEquipment(equipmentId, materialId);
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
            key={item.material.id}
            className="flex justify-between text-sm max-w-xl space-x-3"
          >
            <div className="flex justify-start space-x-3">
              <div className={`${robotoMono.className}`}>
                {item.material.id}
              </div>
              <div className="text-muted-foreground max-w-sm truncate">
                {item.material.name}
              </div>
            </div>
            <div
              className="text-sm cursor-pointer link"
              onClick={() =>
                handleRemoveMaterial(equipment.id, item.material.id)
              }
            >
              Detach
            </div>
          </div>
        ))}
    </div>
  );
}
