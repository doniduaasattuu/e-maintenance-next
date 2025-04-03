"use client";

import React from "react";

export default function HeaderPage({
  header,
  content,
  children,
}: {
  header: string;
  content: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex justify-between max-w-xl items-center">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-2">
          {header}
        </h1>
        <p className="text-sm text-muted-foreground">{content}</p>
      </div>
      {children}
    </div>
  );
}
