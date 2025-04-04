import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function AddButton({
  url,
  label,
  icon,
}: {
  url: string;
  label?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Button asChild className="cursor-pointer" variant="outline">
      <Link href={url}>
        {icon ?? <Plus />}
        {label ?? "New"}
      </Link>
    </Button>
  );
}
