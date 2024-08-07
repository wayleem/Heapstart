import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@hooks/apiHooks";

interface ProductInOrder {
	productId: string;
	quantity: number;
	price: number;
}
interface CreateOrderData {
	products: ProductInOrder[];
	shippingAddress: Address;
	paymentInfo: {
		paymentMethodId: string;
	};
}

const initialState: OrderState = {
	orders: [],
	status: "idle",
	error: null,
};

export const createOrder = createAsyncThunk<Order, CreateOrderData, { rejectValue: string }>(
	"orders/createOrder",
	async (orderData, { rejectWithValue }) => {
		try {
			const response = await api.post<Order>("/api/orders", orderData);
			return response.data;
		} catch (error: unknown) {
			if (error instanceof Error) {
				return rejectWithValue(error.message);
			}
			return rejectWithValue("An unknown error occurred");
		}
	},
);

export const fetchOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
	"orders/fetchOrders",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get<Order[]>("/api/orders");
			return response.data;
		} catch (error: unknown) {
			if (error instanceof Error) {
				return rejectWithValue(error.message);
			}
			return rejectWithValue("An unknown error occurred");
		}
	},
);

const orderSlice = createSlice({
	name: "orders",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(createOrder.pending, (state) => {
				state.status = "loading";
			})
			.addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
				state.status = "succeeded";
				state.orders.push(action.payload);
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "An unknown error occurred";
			})
			.addCase(fetchOrders.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
				state.status = "succeeded";
				state.orders = action.payload;
			})
			.addCase(fetchOrders.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "An unknown error occurred";
			});
	},
});

export default orderSlice.reducer;
