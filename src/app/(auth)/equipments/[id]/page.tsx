import HeaderCard from "@/components/header-card";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";
import TableLayout from "@/layouts/table-layout";
import { getEquipment } from "@/actions/equipment-action";

export default async function EquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const equipment = await getEquipment({
    id,
  });

  if (!equipment) {
    return <p>Equipment is not exists</p>;
  }

  return (
    <TableLayout>
      <div className="space-y-6">
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard header="Detail" content="Equipment data and relations">
            <Link className="text-sm" href={`/equipments/${id}/edit`}>
              Edit
            </Link>
          </HeaderCard>

          <div className="space-y-4">
            <div className="grid w-full max-w-md items-center gap-2">
              <Label htmlFor="id">ID</Label>
              <Input readOnly id="id" defaultValue={equipment.id} />
            </div>
            <div className="grid w-full max-w-md items-center gap-2">
              <Label htmlFor="classification">Classification</Label>
              <Input
                readOnly
                id="classification"
                defaultValue={equipment.classification.description}
              />
            </div>
            <div className="grid w-full max-w-md items-center gap-2">
              <Label htmlFor="status">Status</Label>
              <Input
                readOnly
                id="status"
                defaultValue={equipment.equipmentStatus.description}
              />
            </div>
            <div className="grid w-full max-w-md items-center gap-2">
              <Label htmlFor="functional_location">Functional location</Label>
              <Input
                readOnly
                id="functional_location"
                defaultValue={equipment.functionalLocation?.id}
              />
            </div>
            <div className="grid w-full max-w-md items-center gap-2">
              <Label htmlFor="sort_field">Sort field</Label>
              <Input
                readOnly
                id="sort_field"
                defaultValue={equipment.sortField}
              />
            </div>
            <div className="grid w-full max-w-md items-center gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                readOnly
                id="description"
                defaultValue={equipment?.description}
              />
            </div>
          </div>
        </Card>

        {false ? (
          <Card className="py-8 px-5 md:p-8 rounded-md">
            <HeaderCard header="Materials" content="List of material used" />
            {/* <MaterialList materials={equipment.materials} /> */}
          </Card>
        ) : (
          <p className="text-sm font-normal text-muted-foreground">
            This equipment doesn&apos;t have any relations.
          </p>
        )}
      </div>
    </TableLayout>
  );
}
