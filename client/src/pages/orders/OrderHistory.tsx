import React from "react";
import { useOrderHistory } from "@hooks/order/useOrderHistory";
import { Order } from "@types";
import { useNavigate } from "react-router-dom";

// Skeleton Loader Component
const SkeletonLoader: React.FC = () => (
	<tr className="animate-pulse">
		<td className="p-2">
			<div className="h-4 bg-base-300 rounded w-1/4"></div>
		</td>
		<td className="p-2">
			<div className="h-4 bg-base-300 rounded w-1/2"></div>
		</td>
		<td className="p-2">
			<div className="h-4 bg-base-300 rounded w-1/3"></div>
		</td>
		<td className="p-2">
			<div className="h-4 bg-base-300 rounded w-1/4"></div>
		</td>
	</tr>
);

const OrderHistory: React.FC = () => {
	const { orders, status } = useOrderHistory();
	const navigate = useNavigate();

	const handleOrderClick = (orderId: string) => {
		navigate(`/order/${orderId}`);
	};

	if (status === "loading") {
		return (
			<div className="p-6">
				<table className="w-full">
					<tbody>
						<SkeletonLoader />
						<SkeletonLoader />
						<SkeletonLoader />
					</tbody>
				</table>
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
		<div>
			<table className="w-full bg-base-100 shadow-md rounded-lg overflow-hidden">
				<thead className="bg-base-300">
					<tr>
						<th className="p-2 text-left">Order ID</th>
						<th className="p-2 text-left">Date</th>
						<th className="p-2 text-left">Total</th>
						<th className="p-2 text-left">Status</th>
					</tr>
				</thead>
				<tbody>
					{orders.map((order: Order) => (
						<tr
							key={order._id}
							className="border-b border-base-200 hover:bg-base-200 cursor-pointer transition duration-200"
							onClick={() => handleOrderClick(order._id)}
						>
							<td className="p-2">{order._id}</td>
							<td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
							<td className="p-2">${order.orderTotal.toFixed(2)}</td>
							<td className="p-2">
								<span className={`badge ${getStatusClass(order.status)}`}>{order.status}</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
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
