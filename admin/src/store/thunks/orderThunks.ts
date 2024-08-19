import { createAsyncThunk } from "@reduxjs/toolkit";
import { orderApi } from "@api/endpoints";
import { handleApiError, log } from "@utils/errorUtils";
import { setOrders, setSelectedOrder, updateOrder, setOrderStatus, setOrderError } from "../slices/orderSlice";

export const fetchOrders = createAsyncThunk<void, void>("orders/fetchOrders", async (_, { dispatch }) => {
	try {
		dispatch(setOrderStatus("loading"));
		const orders = await orderApi.getAllOrders();
		dispatch(setOrders(orders));
		dispatch(setOrderStatus("succeeded"));
	} catch (err) {
		const errorMessage = handleApiError(err);
		log("error", "Failed to fetch orders", { error: errorMessage });
		dispatch(setOrderError(errorMessage));
		dispatch(setOrderStatus("failed"));
		throw err;
	}
});

export const fetchOrder = createAsyncThunk<void, string>("orders/fetchOrder", async (orderId, { dispatch }) => {
	try {
		dispatch(setOrderStatus("loading"));
		const order = await orderApi.getOrder(orderId);
		dispatch(setSelectedOrder(order));
		dispatch(setOrderStatus("succeeded"));
	} catch (err) {
		const errorMessage = handleApiError(err);
		log("error", "Failed to fetch order", { error: errorMessage, orderId });
		dispatch(setOrderError(errorMessage));
		dispatch(setOrderStatus("failed"));
		throw err;
	}
});

export const updateOrderStatus = createAsyncThunk<void, { orderId: string; status: string }>(
	"orders/updateStatus",
	async ({ orderId, status }, { dispatch }) => {
		try {
			dispatch(setOrderStatus("loading"));
			const updatedOrder = await orderApi.updateOrderStatus(orderId, status);
			dispatch(updateOrder(updatedOrder));
			dispatch(setOrderStatus("succeeded"));
		} catch (err) {
			const errorMessage = handleApiError(err);
			log("error", "Failed to update order status", { error: errorMessage, orderId, status });
			dispatch(setOrderError(errorMessage));
			dispatch(setOrderStatus("failed"));
			throw err;
		}
	},
);

export const updateOrderTracking = createAsyncThunk<void, { orderId: string; productId: string; trackingInfo: any }>(
	"orders/updateTracking",
	async ({ orderId, productId, trackingInfo }, { dispatch }) => {
		try {
			dispatch(setOrderStatus("loading"));
			const updatedOrder = await orderApi.updateOrderTracking(orderId, productId, trackingInfo);
			dispatch(updateOrder(updatedOrder));
			dispatch(setOrderStatus("succeeded"));
		} catch (err) {
			const errorMessage = handleApiError(err);
			log("error", "Failed to update order tracking", { error: errorMessage, orderId, productId });
			dispatch(setOrderError(errorMessage));
			dispatch(setOrderStatus("failed"));
			throw err;
		}
	},
);
