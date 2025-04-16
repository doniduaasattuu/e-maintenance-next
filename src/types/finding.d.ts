import { SimpleEquipment } from "./equipment";
import { FindingImage } from "./finding-image";
import { SimpleFunctionalLocation } from "./functional-location";
import { SimpleUser } from "./user";

export type Finding = {
  id: string;
  description: string;
  notification: string | null;
  findingStatusId: number;
  createdAt: Date;
  updatedAt: Date;
  equipment: SimpleEquipment | null;
  functionalLocation: SimpleFunctionalLocation | null;
  user: SimpleUser | null;
  findingImages: FindingImage[] | null;
};
