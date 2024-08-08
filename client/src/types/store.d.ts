interface CartItems {
	[productId: string]: number;
}

interface CartState {
	items: CartItems;
	status: RequestStatus;
	error: string | null;
}

interface ProductsState {
	items: Product[];
	purchasedItems: Product[];
	status: RequestStatus;
	error: string | null;
	selectedProduct: Product | null;
}

interface OrderState {
	orders: Order[];
	currentOrder: Order | null;
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}

interface UserState {
	id: string | null;
	email: string | null;
	isAuthenticated: boolean;
	profile: Profile | null;
	status: RequestStatus;
	error: string | null;
	accessToken: string | null;
}

interface RootState {
	cart: CartState;
	user: UserState;
	products: ProductsState;
	orders: OrderState;
}
