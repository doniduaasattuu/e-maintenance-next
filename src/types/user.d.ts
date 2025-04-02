export type SessionUser = IntrinsicAttributes & {
  id: string;
  role: { id: number; name: string };
} & {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};
