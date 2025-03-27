import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";

export default async function FunctionalLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbLink asChild>
          <Link href="/home">Home</Link>
        </BreadcrumbLink>
        <BreadcrumbSeparator />
        <BreadcrumbLink asChild>
          <Link href="/functional-locations">Functional Locations</Link>
        </BreadcrumbLink>
        <BreadcrumbSeparator />
        <BreadcrumbPage>{id}</BreadcrumbPage>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
