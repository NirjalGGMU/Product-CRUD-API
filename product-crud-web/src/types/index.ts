export type User = {
  id: number;
  email: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  createdAt: string;
};

export type ProductInput = {
  name: string;
  price: number;
  description: string;
};
