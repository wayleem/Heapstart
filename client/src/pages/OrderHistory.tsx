import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@store/index";
import { fetchUserOrders, selectOrders, selectOrderStatus } from "@store/slices/orderSlice";
import Loading from "@components/Loading";

const OrderHistory: React.FC = () => {
	const dispatch = useAppDispatch();
	const orders = useAppSelector(selectOrders);
	const status = useAppSelector(selectOrderStatus);

	useEffect(() => {
		dispatch(fetchUserOrders());
	}, [dispatch]);

	if (status === "loading") {
		return <Loading />;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-4">Order History</h1>
			{orders.map((order) => (
				<div key={order._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
					<p>Order ID: {order._id}</p>
					<p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
					<p>Total: ${order.orderTotal.toFixed(2)}</p>
					<p>Status: {order.status}</p>
				</div>
			))}
		</div>
	);
};

export default OrderHistory;
