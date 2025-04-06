import DynamicBreadcrumb from "@/components/dynamic-breadcrumb";
import React from "react";

export default function TableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 mb-4">
      <DynamicBreadcrumb />
      {children}
    </div>
  );
}
