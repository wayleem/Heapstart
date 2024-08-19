export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  supplier_id: string;
  supplier_cost: number;
  supplier_link: string;
  category: string;
  images: string[];
  isActive: boolean;
}

export interface ProductFormData extends Omit<Product, 'images'> {
  images: (string | File)[];
}

export interface ProductState {
  items: Product[];
  selectedProduct: Product | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
