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
  equipmentMaterials: {
    equipment: {
      id: string;
      description: string;
    };
    quantity: number;
  }[];
};
