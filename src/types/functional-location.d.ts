// import { SimpleEquipment } from "./equipment";

export type FunctionalLocation = {
  id: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number | null;
};

export type FunclocWithEquipment = {
  id: string;
  description: string;
  userId: number | null;
  equipments: SimpleEquipment[] | null; // id, sortField, description
};

export type SimpleFunctionalLocation = {
  id: string;
  description: string;
};
