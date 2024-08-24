import { createAsyncThunk } from "@reduxjs/toolkit";
import { orderApi } from "../../api/endpoints";
import { handleApiError, log } from "../../utils/errorUtils";
import { CreateOrderRequest, Order } from "@types";
import { setOrders, setCurrentOrder, addOrder, setOrderStatus, setOrderError } from "../slices/orderSlice";

export const createOrder = createAsyncThunk<Order, CreateOrderRequest>(
	"orders/createOrder",
	async (orderData, { dispatch }) => {
		try {
			dispatch(setOrderStatus("loading"));
			const newOrder = await orderApi.createOrder({
				...orderData,
				appliedDiscount: orderData.appliedDiscount || 0,
			});
			dispatch(addOrder(newOrder));
			dispatch(setOrderStatus("succeeded"));
			return newOrder;
		} catch (err) {
			const errorMessage = handleApiError(err);
			dispatch(setOrderError(errorMessage));
			dispatch(setOrderStatus("failed"));
			throw err;
		}
	},
);

export const fetchUserOrders = createAsyncThunk<void, void>("orders/fetchUserOrders", async (_, { dispatch }) => {
	try {
		dispatch(setOrderStatus("loading"));
		const orders = await orderApi.getUserOrders();
		dispatch(setOrders(orders));
		dispatch(setOrderStatus("succeeded"));
	} catch (err) {
		const errorMessage = handleApiError(err);
		log("error", "Failed to fetch user orders", { error: errorMessage });
		dispatch(setOrderError(errorMessage));
		dispatch(setOrderStatus("failed"));
		throw err;
	}
});

export const fetchOrder = createAsyncThunk<void, string>("orders/fetchOrderDetails", async (orderId, { dispatch }) => {
	try {
		dispatch(setOrderStatus("loading"));
		const order = await orderApi.getOrder(orderId);
		dispatch(setCurrentOrder(order));
		dispatch(setOrderStatus("succeeded"));
	} catch (err) {
		const errorMessage = handleApiError(err);
		log("error", "Failed to fetch order details", { error: errorMessage, orderId });
		dispatch(setOrderError(errorMessage));
		dispatch(setOrderStatus("failed"));
		throw err;
	}
});
