import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

import React from "react";

type OptionsDropdownProps = {
  children: React.ReactNode;
  trigger?: React.ReactNode;
};

export default function OptionsDropdown({
  children,
  trigger,
}: OptionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {trigger ? trigger : <MoreHorizontal />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}
