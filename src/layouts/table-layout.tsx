import DynamicBreadcrumb from "@/components/dynamic-breadcrumb";
import React from "react";

export default function TableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <DynamicBreadcrumb />
      <div className="space-y-8 mb-4">{children}</div>
    </div>
  );
}
