"use client";

import React from "react";

export default function HeaderCard({
  header,
  content,
  children,
}: {
  header?: string;
  content?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex justify-between max-w-xl items-center">
      <div>
        {header && <div className="font-semibold text-lg">{header}</div>}
        {content && <p className="text-sm text-muted-foreground">{content}</p>}
      </div>
      {children}
    </div>
  );
}
