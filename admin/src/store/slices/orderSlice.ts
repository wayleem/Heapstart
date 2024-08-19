import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, OrderState, RootState } from "@types";

const initialState: OrderState = {
	items: [],
	status: "idle",
	error: null,
	selectedOrder: null,
};

const orderSlice = createSlice({
	name: "orders",
	initialState,
	reducers: {
		setOrders: (state, action: PayloadAction<Order[]>) => {
			state.items = action.payload;
		},
		setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
			state.selectedOrder = action.payload;
		},
		updateOrder: (state, action: PayloadAction<Order>) => {
			const index = state.items.findIndex((item) => item._id === action.payload._id);
			if (index !== -1) {
				state.items[index] = action.payload;
			}
		},
		setOrderStatus: (state, action: PayloadAction<OrderState["status"]>) => {
			state.status = action.payload;
		},
		setOrderError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const { setOrders, setSelectedOrder, updateOrder, setOrderStatus, setOrderError } = orderSlice.actions;

export const selectAllOrders = (state: RootState) => state.order.items;
export const selectOrdersStatus = (state: RootState) => state.order.status;
export const selectOrdersError = (state: RootState) => state.order.error;
export const selectSelectedOrder = (state: RootState) => state.order.selectedOrder;

export default orderSlice.reducer;
