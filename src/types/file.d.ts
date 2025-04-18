export type File = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number | null;
  tags: string | null;
  type: string;
  path: string;
};
