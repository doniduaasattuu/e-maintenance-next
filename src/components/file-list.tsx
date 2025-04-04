import Link from "next/link";
import React from "react";

type File = { id: string; name: string; path: string };

type FileListProps = {
  items: { file: File }[];
};

export default function FileList({ items }: FileListProps) {
  return (
    <div className="space-y-3">
      {items &&
        items.map((item) => (
          <div
            key={item.file.id}
            className="flex justify-between text-sm max-w-xl space-x-3"
          >
            <Link className="truncate link" href={item.file.path}>
              {item.file.name}
            </Link>
            <div className="text-muted-foreground">{`.${item.file.path
              .split(".")
              .pop()}`}</div>
          </div>
        ))}
    </div>
  );
}
