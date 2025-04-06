import { SimpleEquipment } from "./equipment";

export type Material = {
  id: string;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  unit: {
    id: number;
    description: string;
  } | null;
};

export type MaterialWithRelations = {
  id: string;
  name: string;
  price: number;
  unit: {
    id: number;
    description: string;
  } | null;
  equipmentMaterials: { equipment: SimpleEquipment; quantity: number }[];
};
