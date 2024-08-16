import React from "react";
import { useOrderHistory } from "@hooks/order/useOrderHistory";
import { Order } from "@types";

const OrderHistory: React.FC = () => {
	const { orders, status } = useOrderHistory();

	if (status === "loading") return <div>Loading...</div>;

	return (
		<div>
			{orders.map((order: Order) => (
				<div key={order._id}>
					<p>Order ID: {order._id}</p>
					<p>Total: ${order.orderTotal}</p>
					<p>Status: {order.status}</p>
				</div>
			))}
		</div>
	);
};

export default OrderHistory;
