"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { isUUID, uppercaseFirstLetter } from "@/lib/utils";

type BreadcrumbItem = {
  name: string;
  href: string;
};

export default function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Split the path and filter out empty strings
  const segments = pathname.split("/").filter((segment) => segment);

  if (segments.length === 0) return null;

  // Define dynamic labels for multiple routes
  const labelMap: Record<string, string> = {
    "functional-locations": "Functional Locations",
    equipments: "Equipments",
    materials: "Materials",
    edit: "Edit",
    create: "Create",
  };

  // Generate breadcrumb items dynamically
  const breadcrumbItems: BreadcrumbItem[] = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = labelMap[segment] || segment; // Fallback to segment if no label
    return { name: label, href };
  });

  return (
    <div className="overflow-x-scroll scrollbar-hide">
      <Breadcrumb className="min-w-max">
        <BreadcrumbList>
          <BreadcrumbLink asChild>
            <Link href="/home">Home</Link>
          </BreadcrumbLink>

          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              {index === breadcrumbItems.length - 1 || isUUID(item.name) ? (
                <BreadcrumbPage>
                  {uppercaseFirstLetter(item.name)}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>
                    {uppercaseFirstLetter(item.name)}
                  </Link>
                </BreadcrumbLink>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
