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
import { Position } from "@/types/position";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function FilterPosition({
  className,
  positions,
}: {
  className?: string | undefined;
  positions: Position[] | null;
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
        params.set("position", value);
      } else {
        params.delete("position");
      }

      replace(`${pathname}?${params.toString()}`);
    };

    handleOrder(value);
  }, [pathname, replace, searchParams, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[120px] justify-between ${className}`}
        >
          {value && positions
            ? positions.find((position) => String(position.id) === value)?.id
            : "Position"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={`w-[180px] justify-between p-0 ${className}`}
      >
        <Command>
          <CommandList>
            <CommandEmpty>No position found.</CommandEmpty>
            <CommandGroup>
              {positions &&
                positions.map((position) => (
                  <CommandItem
                    key={position.id}
                    value={String(position.id)}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === String(position.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {position.name}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
