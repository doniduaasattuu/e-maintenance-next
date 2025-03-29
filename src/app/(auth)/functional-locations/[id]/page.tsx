import { getFunctionalLocation } from "@/actions/functional-location-action";
import EquipmentList from "@/components/equipment-list";
import HeaderCard from "@/components/header-card";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";
import TableLayout from "@/layouts/table-layout";

export default async function FunctionalLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const functionalLocation = await getFunctionalLocation({
    id,
  });

  if (!functionalLocation) {
    return <p>Functinoal location is not exists</p>;
  }

  return (
    <TableLayout>
      <div className="space-y-6">
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard
            header="Detail"
            content="Functional location data and relations"
          >
            <Link className="text-sm" href={`/functional-locations/${id}/edit`}>
              Edit
            </Link>
          </HeaderCard>

          <div className="space-y-4">
            <div className="grid w-full max-w-md items-center gap-2">
              <Label htmlFor="id">ID</Label>
              <Input readOnly id="id" defaultValue={functionalLocation?.id} />
            </div>
            <div className="grid w-full max-w-md items-center gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                readOnly
                id="description"
                defaultValue={functionalLocation?.description}
              />
            </div>
          </div>
        </Card>

        {functionalLocation.equipments.length >= 1 ? (
          <Card className="py-8 px-5 md:p-8 rounded-md">
            <HeaderCard
              header="Equipments"
              content="List of installed equipment"
            />
            <EquipmentList equipments={functionalLocation.equipments} />
          </Card>
        ) : (
          <p className="text-sm font-normal text-muted-foreground">
            This functional location doesn&apos;t have any relations.
          </p>
        )}
      </div>
    </TableLayout>
  );
}
