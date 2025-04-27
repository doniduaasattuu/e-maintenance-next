import { SimpleEquipment } from "./equipment";
import { FindingImage } from "./finding-image";
import { FindingStatus } from "./finding-status";
import { SimpleFunctionalLocation } from "./functional-location";
import { SimpleUser } from "./user";

export type Finding = {
  id: string;
  description: string;
  notification: string | null;
  findingStatusId: number;
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
  equipment: SimpleEquipment | null;
  functionalLocation: SimpleFunctionalLocation | null;
  findingStatus: FindingStatus;
  user: SimpleUser | null;
  findingImages: FindingImage[] | null;
};

export type SimpleFinding = {
  id: string;
  description: string;
  findingStatus: FindingStatus;
};
