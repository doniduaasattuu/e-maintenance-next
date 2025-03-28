import React from "react";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import FunctionalLocationEditForm from "@/components/functional-location-edit-form";
import { getFunctionalLocation } from "@/actions/functional-location-action";
import HeaderCard from "@/components/header-card";

export default async function FunctionalLocationEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const functionalLocation = await getFunctionalLocation({ id });

  if (!functionalLocation) {
    return;
  }

  return (
    <div className="space-y-4">
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
          {id}
          <BreadcrumbSeparator />
          <BreadcrumbPage>Edit</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-8 mb-4">
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard header="Edit" content="Update functional location data" />
          <FunctionalLocationEditForm functionalLocation={functionalLocation} />
        </Card>
      </div>
    </div>
  );
}
