export type FindingImage = {
  id: string;
  findingId: string;
  path: string;
  imageStatus: "Before" | "After";
  createdAt: Date;
  updatedAt: Date;
};
