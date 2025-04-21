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
import { Department } from "@/types/department";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function FilterDepartment({
  className,
  departments,
}: {
  className?: string | undefined;
  departments: Department[] | null;
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
        params.set("department", value);
      } else {
        params.delete("department");
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
          className={`w-[160px] justify-between ${className}`}
        >
          {value && departments
            ? departments.find((department) => String(department.id) === value)
                ?.id
            : "Department"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={`w-[200px] justify-between p-0 ${className}`}
      >
        <Command>
          <CommandList>
            <CommandEmpty>No department found.</CommandEmpty>
            <CommandGroup>
              {departments &&
                departments.map((department) => (
                  <CommandItem
                    key={department.id}
                    value={String(department.id)}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === String(department.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {department.name}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
