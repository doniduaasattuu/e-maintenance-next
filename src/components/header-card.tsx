import React from "react";

export default function HeaderCard({
  header,
  content,
}: {
  header: string;
  content: string;
}) {
  return (
    <div className="mb-2">
      <div className="font-semibold text-lg">{header}</div>
      <p className="text-sm text-muted-foreground">{content}</p>
    </div>
  );
}
