"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { useRouter } from "next/navigation";

export default function BackBreadcrumb({ page }: { page?: string }) {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="overflow-x-scroll scrollbar-hide">
      <Breadcrumb className="min-w-max">
        <BreadcrumbList>
          <BreadcrumbLink asChild>
            <BreadcrumbItem onClick={handleBack} className="cursor-pointer">
              Back
            </BreadcrumbItem>
          </BreadcrumbLink>
          {page && (
            <React.Fragment>
              <BreadcrumbSeparator />
              <BreadcrumbPage>{page}</BreadcrumbPage>
            </React.Fragment>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
