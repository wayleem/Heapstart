import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
		setOrders: (state, action: PayloadAction<Order[]>) => {
			state.orders = action.payload;
		},
		setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
			state.currentOrder = action.payload;
		},
		addOrder: (state, action: PayloadAction<Order>) => {
			state.orders.push(action.payload);
		},
		setOrderStatus: (state, action: PayloadAction<OrderState["status"]>) => {
			state.status = action.payload;
		},
		setOrderError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const { setOrders, setCurrentOrder, addOrder, setOrderStatus, setOrderError } = orderSlice.actions;

export const selectCurrentOrder = (state: RootState) => state.orders.currentOrder;
export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrderStatus = (state: RootState) => state.orders.status;

export default orderSlice.reducer;
