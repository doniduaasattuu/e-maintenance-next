"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebouncedCallback } from "use-debounce";
import {
  getMaterialsByKeyword,
  MaterialSearchResult,
} from "@/actions/material-action";
import { Roboto_Mono } from "next/font/google";
import { Separator } from "./ui/separator";
import { addMaterialToEquipment } from "@/actions/equipment-material-action";
import { toast } from "sonner";
import { Equipment } from "@/types/equipment";
import { Plus } from "lucide-react";

const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export default function SearchMaterialDialog({
  equipment,
}: {
  equipment: Equipment;
}) {
  const [materialSearchResult, setMaterialSearchResult] = React.useState<
    MaterialSearchResult[] | null
  >(null);

  const handleSearchMaterial = useDebouncedCallback((term: string) => {
    if (term) {
      const result = getMaterialsByKeyword(term);
      result.then((values) => {
        setMaterialSearchResult(values);
      });
    } else {
      setMaterialSearchResult(null);
    }
  }, 300);

  const handleAddMaterial = (equipmentId: string, materialId: string) => {
    const result = addMaterialToEquipment(equipmentId, materialId);
    result
      .then((res) => {
        if (res.success) {
          toast.success("Success", { description: res.message });
        } else {
          toast.error("Error", { description: res.message });
        }
      })
      .catch((error) => {
        // Tangani error yang terjadi selama promise
        console.error("Error during operation:", error);
        toast.error("Error", {
          description: "An error occurred",
        });
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex gap-2 text-sm items-center cursor-pointer p-2 rounded-md">
          <Plus size={18} />
          New
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md flex flex-col space-y-4">
        <DialogHeader>
          <DialogTitle>Attach material</DialogTitle>
          <DialogDescription>
            Search for the material you want to add by id or name.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search_material" className="text-right">
              Search
            </Label>
            <Input
              onChange={(e) => handleSearchMaterial(e.target.value)}
              id="search_material"
              placeholder="Search material by id or name..."
            />
          </div>
          <div className="overflow-y-scroll h-80 space-y-3 scrollbar-hide">
            {materialSearchResult ? (
              materialSearchResult.length >= 1 ? (
                materialSearchResult.map((material) => (
                  <div
                    key={material.id}
                    className="flex justify-between text-sm max-w-xl space-x-3"
                  >
                    <div className="flex justify-start space-x-3">
                      <div className={`${robotoMono.className}`}>
                        {material.id}
                      </div>
                      <div className="max-w-[250px] truncate text-muted-foreground">
                        {material.name}
                      </div>
                    </div>
                    <div
                      className="text-sm cursor-pointer link"
                      onClick={() =>
                        handleAddMaterial(equipment.id, material.id)
                      }
                    >
                      Attach
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  Try to search by another keyword.
                </p>
              )
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                Search result will be displayed here.
              </p>
            )}
            {materialSearchResult && materialSearchResult.length >= 1 && (
              <>
                <Separator />
                <p className="mt-3 text-sm text-muted-foreground text-center">
                  End of page.
                </p>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
