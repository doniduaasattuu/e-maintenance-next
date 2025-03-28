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
import HeaderCard from "@/components/header-card";

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
          <HeaderCard
            header="Create"
            content="Insert new functional location"
          />
          <FunctionalLocationCreateForm />
        </Card>
      </div>
    </div>
  );
}
