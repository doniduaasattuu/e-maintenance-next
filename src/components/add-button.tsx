"use client";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import useUserClient from "@/hooks/useUserClient";

export default function AddButton({
  url,
  label,
  icon,
}: {
  url: string;
  label?: string;
  icon?: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useUserClient();
  const allowedRouteList = ["/files", "/findings"];
  const isAllowed: boolean = allowedRouteList.includes(pathname);

  return (
    (user?.role === "Admin" || isAllowed) && (
      <Button asChild className="cursor-pointer" variant="outline">
        <Link href={url}>
          {icon ?? <Plus />}
          {label ?? "New"}
        </Link>
      </Button>
    )
  );
}
