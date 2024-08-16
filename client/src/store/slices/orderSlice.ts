import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createOrder, fetchUserOrders } from "../thunks/orderThunks";
import { Order, OrderState, RootState } from "@types";

const initialState: OrderState = {
	orders: [],
	currentOrder: null,
	status: "idle",
	error: null,
};

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
		builder
			.addCase(createOrder.pending, (state) => {
				state.status = "loading";
			})
			.addCase(createOrder.fulfilled, (state, action) => {
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
			.addCase(fetchUserOrders.fulfilled, (state, action) => {
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
