import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@store/index";
import { selectOrders, selectOrderStatus } from "@store/slices/orderSlice";
import { fetchUserOrders } from "@store/thunks/orderThunks";

export const useOrderHistory = () => {
	const dispatch = useAppDispatch();
	const orders = useAppSelector(selectOrders);
	const status = useAppSelector(selectOrderStatus);

	useEffect(() => {
		dispatch(fetchUserOrders());
	}, [dispatch]);

	return { orders, status };
};
