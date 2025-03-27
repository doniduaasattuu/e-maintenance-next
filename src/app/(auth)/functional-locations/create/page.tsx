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
import FunctionalLocationCreateForm from "@/components/functional-location-create-form";

export default function FunctionalLocationCreatePage() {
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
          <BreadcrumbPage>Create</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-8 mb-4">
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <div className="mb-2">
            <div className="font-semibold text-lg">Create</div>
            <p className="text-sm text-muted-foreground">
              Insert new functional location
            </p>
          </div>
          <FunctionalLocationCreateForm />
        </Card>
      </div>
    </div>
  );
}
