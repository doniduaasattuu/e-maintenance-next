// types/equipment.d.ts
export type Equipment = {
  id: string;
  description: string;
  sortField: string;
  createdAt: Date;
  updatedAt: Date;
  classification: {
    id: number;
    description: string;
  };
  equipmentStatus: {
    id: number;
    description: string;
  };
  functionalLocation: {
    id: string;
    description: string;
  } | null;
  user: {
    id: number;
    name: string;
  } | null;
};
