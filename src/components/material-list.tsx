import { Roboto_Mono } from "next/font/google";
import Link from "next/link";
import React from "react";

type Material = { id: string; name: string; price: number };

type MaterialListProps = {
  items:
    | {
        material: Material;
        quantity: number;
      }[]
    | undefined;
};

const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export default function MaterialList({ items }: MaterialListProps) {
  return (
    <div className="space-y-3">
      {items &&
        items.map((item) => (
          <div
            key={item.material.id}
            className="flex justify-between text-sm max-w-md space-x-3"
          >
            <Link
              href={`/materials/${item.material.id}`}
              className={`link ${robotoMono.className}`}
            >
              {item.material.id}
            </Link>
            <div className="truncate text-muted-foreground">
              {item.material.name}
            </div>
          </div>
        ))}
    </div>
  );
}
