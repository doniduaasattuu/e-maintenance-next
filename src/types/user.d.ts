export type SessionUser = IntrinsicAttributes & {
  id: string;
  role: { name: string; id: number };
} & {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};
