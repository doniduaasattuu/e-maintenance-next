"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EquipmentStatus } from "@/types/equipment-status";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function FilterStatus({
  className,
  equipmentStatuses,
}: {
  className?: string | undefined;
  equipmentStatuses: EquipmentStatus[] | null;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>();

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);

    const handleOrder = (value: string | undefined) => {
      if (value) {
        params.set("status", value);
      } else {
        params.delete("status");
      }

      replace(`${pathname}?${params.toString()}`);
    };

    handleOrder(value);
  }, [value, pathname, replace, searchParams]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[140px] justify-between", className)}
        >
          {value && equipmentStatuses
            ? equipmentStatuses.find(
                (equipmentStatus) => String(equipmentStatus.id) === value
              )?.description
            : "Status"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[140px] justify-between p-0" align="end">
        <Command>
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {equipmentStatuses &&
                equipmentStatuses.map((equipmentStatus) => (
                  <CommandItem
                    key={equipmentStatus.id}
                    value={String(equipmentStatus.id)}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === String(equipmentStatus.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {equipmentStatus.description}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
