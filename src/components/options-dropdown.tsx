"use client";

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
  className?: string;
};

export default function OptionsDropdown({
  children,
  trigger,
  className,
}: OptionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {trigger ? trigger : <MoreHorizontal />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={className}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
