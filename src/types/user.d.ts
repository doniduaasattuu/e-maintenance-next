export type SessionUser = IntrinsicAttributes & {
  id: string;
  role: string;
} & {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};
