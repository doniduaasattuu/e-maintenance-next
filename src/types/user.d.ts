export type SessionUser = IntrinsicAttributes & {
  id: string;
  role: string;
} & {
  name: string | null;
  email: string | null;
  image: string | null;
};

export type SimpleUser = {
  id: number;
  name: string;
  email: string;
};

export type User = {
  id: number;
  nik: string;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  role: {
    id: number;
    name: string;
  };
  position: {
    id: string;
    name: string;
  } | null;
  department: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
};
