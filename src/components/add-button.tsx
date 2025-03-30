import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function AddButton({ url }: { url: string }) {
  return (
    <Button asChild className="cursor-pointer" variant="outline">
      <Link href={url}>
        <Plus />
        New
      </Link>
    </Button>
  );
}
