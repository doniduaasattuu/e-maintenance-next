export type SessionUser = IntrinsicAttributes & {
  id: string;
  role: string;
} & {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export type SimpleUser = {
  id: number;
  name: string;
  email: string;
};
