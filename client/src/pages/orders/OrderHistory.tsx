import React from "react";
import { useOrderHistory } from "@hooks/order/useOrderHistory";
import { Order } from "@types";

// Skeleton Loader Component
const SkeletonLoader: React.FC = () => (
	<div className="animate-pulse space-y-4 p-4 border border-base-300 rounded-lg bg-base-100 shadow-md">
		<div className="h-4 bg-base-300 rounded w-1/4"></div>
		<div className="h-4 bg-base-300 rounded w-1/2"></div>
		<div className="h-4 bg-base-300 rounded w-1/3"></div>
	</div>
);

const OrderHistory: React.FC = () => {
	const { orders, status } = useOrderHistory();

	if (status === "loading") {
		return (
			<div className="p-6 space-y-4">
				<SkeletonLoader />
				<SkeletonLoader />
				<SkeletonLoader />
			</div>
		);
	}

	if (!orders.length) {
		return (
			<div className="flex flex-col items-center justify-center h-full p-6 text-center">
				<p className="text-h3 font-semibold text-neutral">You have no order history.</p>
			</div>
		);
	}

	return (
		<div className="p-6 bg-base-200 min-h-screen">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{orders.map((order: Order) => (
					<div
						key={order._id}
						className="p-4 border border-base-300 rounded-lg bg-base-100 shadow-md transition transform hover:scale-105"
					>
						<h3 className="text-h3 font-heading text-primary">Order ID: {order._id}</h3>
						<p className="text-body text-neutral">
							Total: <span className="font-semibold">${order.orderTotal}</span>
						</p>
						<p className="text-body text-neutral">
							Status: <span className={`badge ${getStatusClass(order.status)}`}>{order.status}</span>
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

// Function to return the correct class based on order status
const getStatusClass = (status: string) => {
	switch (status) {
		case "Completed":
			return "badge-success";
		case "Pending":
			return "badge-warning";
		case "Cancelled":
			return "badge-error";
		default:
			return "badge-neutral";
	}
};

export default OrderHistory;
