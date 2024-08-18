import { createAsyncThunk } from "@reduxjs/toolkit";
import { orderApi } from "../../api/endpoints";
import { handleApiError, log } from "../../utils/errorUtils";
import { CreateOrderRequest, Order } from "@types";

export const createOrder = createAsyncThunk<Order, CreateOrderRequest, { rejectValue: string }>(
	"orders/createOrder",
	async (orderData, { rejectWithValue }) => {
		try {
			return await orderApi.createOrder(orderData);
		} catch (err) {
			const errorMessage = handleApiError(err);
			log("error", "Failed to create order", { error: errorMessage });
			return rejectWithValue(errorMessage);
		}
	},
);

export const fetchUserOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
	"orders/fetchUserOrders",
	async (_, { rejectWithValue }) => {
		try {
			return await orderApi.getUserOrders();
		} catch (err) {
			const errorMessage = handleApiError(err);
			log("error", "Failed to fetch user orders", { error: errorMessage });
			return rejectWithValue(errorMessage);
		}
	},
);
