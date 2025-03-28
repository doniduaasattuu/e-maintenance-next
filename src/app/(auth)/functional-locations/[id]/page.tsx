import { getFunctionalLocation } from "@/actions/functional-location-action";
import HeaderCard from "@/components/header-card";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";

export default async function FunctionalLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const functionalLocation = await getFunctionalLocation({
    id,
    withEquipments: true,
  });

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
          <BreadcrumbPage>{id}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard
            header="Detail"
            content="Functional location data and relations"
          />

          <div className="space-y-4">
            <div className="grid w-full max-w-md items-center gap-2">
              <Label htmlFor="id">ID</Label>
              <Input id="id" value={functionalLocation?.id} />
            </div>
            <div className="grid w-full max-w-md items-center gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={functionalLocation?.description} />
            </div>
          </div>
        </Card>
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard
            header="Equipments"
            content="List of installed equipment"
          />

          {/* <EquipmentList equipments={functionalLocation.equipments} /> */}

          {/* <div className="space-y-3">
            <div className="flex justify-between text-sm max-w-md space-x-3">
              <div>EMO000123</div>
              <div className="truncate">
                OIL UNIT DRIVE 2 PULPER FFD450EE 2 PULPER FFD450EE
              </div>
            </div>
            <div className="flex justify-between text-sm max-w-md">
              <div>EMO000123</div>
              <div>OIL UNIT DRIVE 2 PULPER FFD450EE</div>
            </div>
          </div> */}
        </Card>
      </div>
    </div>
  );
}
