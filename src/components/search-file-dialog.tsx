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
import { FileSearchResult, getFilesByKeyword } from "@/actions/file-action";
import { Separator } from "./ui/separator";
import { addFileToEquipment } from "@/actions/equipment-file-action";
import { toast } from "sonner";
import { Equipment } from "@/types/equipment";
import { Plus } from "lucide-react";

export default function SearchFileDialog({
  equipment,
}: {
  equipment: Equipment;
}) {
  const [fileSearchResult, setFileSearchResult] = React.useState<
    FileSearchResult[] | null
  >(null);

  const handleSearchFile = useDebouncedCallback((term: string) => {
    if (term) {
      const result = getFilesByKeyword(term);
      result.then((values) => {
        setFileSearchResult(values);
      });
    } else {
      setFileSearchResult(null);
    }
  }, 300);

  const handleAddFile = (equipmentId: string, fileId: string) => {
    const result = addFileToEquipment(equipmentId, fileId);
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
              onChange={(e) => handleSearchFile(e.target.value)}
              id="search_material"
              placeholder="Search material by id or name..."
            />
          </div>
          <div className="overflow-y-scroll h-80 space-y-3 scrollbar-hide">
            {fileSearchResult ? (
              fileSearchResult.length >= 1 ? (
                fileSearchResult.map((material) => (
                  <div
                    key={material.id}
                    className="flex justify-between text-sm max-w-xl space-x-3"
                  >
                    <div className="truncate">{material.name}</div>
                    <div
                      className="text-sm cursor-pointer link"
                      onClick={() => handleAddFile(equipment.id, material.id)}
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
            {fileSearchResult && fileSearchResult.length >= 1 && (
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
