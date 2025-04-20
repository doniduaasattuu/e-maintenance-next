import { getFunctionalLocation } from "@/actions/functional-location-action";
import EquipmentList from "@/components/equipment-list";
import HeaderCard from "@/components/header-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";
import TableLayout from "@/layouts/table-layout";
import OptionsDropdown from "@/components/options-dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import FormCard from "@/components/form-card";
import { getUserSession } from "@/hooks/useUserSession";
import { onlyAdmin } from "@/lib/config";
import { Edit } from "lucide-react";

export default async function FunctionalLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserSession();
  const functionalLocation = await getFunctionalLocation({
    id,
  });

  if (!functionalLocation) return <p>Functinoal location is not exists</p>;

  return (
    <TableLayout>
      <div className="space-y-6">
        <FormCard>
          <HeaderCard
            header="Detail"
            content="Functional location data and relations"
          >
            {onlyAdmin.includes(user?.role) && (
              <OptionsDropdown>
                <DropdownMenuItem asChild>
                  <Link
                    className="text-sm"
                    href={`/functional-locations/${id}/edit`}
                  >
                    <Edit />
                    Edit
                  </Link>
                </DropdownMenuItem>
              </OptionsDropdown>
            )}
          </HeaderCard>

          <div className="space-y-4">
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label htmlFor="id">ID</Label>
              <Input readOnly id="id" defaultValue={functionalLocation?.id} />
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                readOnly
                id="description"
                defaultValue={functionalLocation?.description}
              />
            </div>
          </div>
        </FormCard>

        {functionalLocation.equipments &&
        functionalLocation.equipments.length >= 1 ? (
          <FormCard>
            <HeaderCard
              header="Equipments"
              content="List of installed equipment"
            />
            <EquipmentList equipments={functionalLocation.equipments} />
          </FormCard>
        ) : (
          <p className="text-sm font-normal text-muted-foreground">
            This functional location doesn&apos;t have any relations.
          </p>
        )}
      </div>
    </TableLayout>
  );
}
