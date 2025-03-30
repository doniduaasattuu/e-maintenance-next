import HeaderCard from "@/components/header-card";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";
import TableLayout from "@/layouts/table-layout";
import { getMaterial } from "@/actions/material-action";
import { formatCurrency } from "@/lib/utils";

export default async function MaterialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const material = await getMaterial({
    id: id,
  });

  if (!material) {
    return <p>Material is not exists</p>;
  }

  return (
    <TableLayout>
      <div className="space-y-6">
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard header="Detail" content="Material data and relations">
            <Link className="text-sm" href={`/materials/${id}/edit`}>
              Edit
            </Link>
          </HeaderCard>

          <div className="space-y-4">
            <div className="grid w-full max-w-md items-center gap-2">
              <Label htmlFor="id">ID</Label>
              <Input readOnly id="id" defaultValue={material?.id} />
            </div>
            <div className="grid w-full max-w-md items-center gap-2">
              <Label htmlFor="name">Name</Label>
              <Input readOnly id="name" defaultValue={material.name} />
            </div>
            <div className="grid w-full max-w-md items-center gap-2">
              <Label htmlFor="name">Price</Label>
              <Input
                readOnly
                id="name"
                defaultValue={formatCurrency({ number: material.price })}
              />
            </div>
          </div>
        </Card>

        {/* {false ? (
          <Card className="py-8 px-5 md:p-8 rounded-md">
            <HeaderCard
              header="Equipments"
              content="List of equipment that uses this material"
            />
            <EquipmentList equipments={material.equipmentMaterials} />
          </Card>
        ) : (
          <p className="text-sm font-normal text-muted-foreground">
            This material doesn&apos;t have any relations.
          </p>
        )} */}
      </div>
    </TableLayout>
  );
}
