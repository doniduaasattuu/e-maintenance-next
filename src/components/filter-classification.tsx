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
import { Classification } from "@/types/classification";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function FilterClassification({
  className,
  classifications,
}: {
  className?: string | undefined;
  classifications: Classification[] | null;
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
        params.set("classification", value);
      } else {
        params.delete("classification");
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
          className={`w-[200px] justify-between ${className}`}
        >
          {value && classifications
            ? classifications.find(
                (classification) => String(classification.id) === value
              )?.description
            : "Classification"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={`w-[200px] justify-between p-0 ${className}`}
      >
        <Command>
          <CommandList>
            <CommandEmpty>No classification found.</CommandEmpty>
            <CommandGroup>
              {classifications &&
                classifications.map((classification) => (
                  <CommandItem
                    key={classification.id}
                    value={String(classification.id)}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === String(classification.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {classification.description}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
