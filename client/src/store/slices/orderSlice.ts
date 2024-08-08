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
	currentOrder: null,
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

export const fetchUserOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
	"orders/fetchUserOrders",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get<Order[]>("/api/orders/user");
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
	reducers: {
		setCurrentOrder: (state, action: PayloadAction<Order>) => {
			state.currentOrder = action.payload;
		},
		clearCurrentOrder: (state) => {
			state.currentOrder = null;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(createOrder.pending, (state) => {
			state.status = "loading";
		});
		builder
			.addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
				state.status = "succeeded";
				state.orders.push(action.payload);
				state.currentOrder = action.payload;
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "An unknown error occurred";
			})
			.addCase(fetchUserOrders.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
				state.status = "succeeded";
				state.orders = action.payload;
			})
			.addCase(fetchUserOrders.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "An unknown error occurred";
			});
	},
});

export const { setCurrentOrder, clearCurrentOrder } = orderSlice.actions;
export const selectCurrentOrder = (state: RootState) => state.orders.currentOrder;
export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrderStatus = (state: RootState) => state.orders.status;

export default orderSlice.reducer;
