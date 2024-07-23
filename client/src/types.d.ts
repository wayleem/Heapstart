declare global {
  interface User {
    _id?: string;
    username: string;
    password: string;
    //purchasedItems: string[];

  }


  interface Product {
    _id: string;
    productName: string;
    price: number;
    description: string;
    stockQuantity: number;
    imageURL: string;
  }

  interface CartState {
    items: { [key: string]: number };
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }

  interface ProductsState {
    items: Product[];
    purchasedItems: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }

  interface UserState {
    id: string | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }
}

export { }
