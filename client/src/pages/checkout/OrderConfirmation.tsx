import { selectCurrentOrder } from "@store/slices/orderSlice";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const OrderConfirmation: React.FC = () => {
	const order = useSelector(selectCurrentOrder);

	console.log(order);

	if (!order) {
		return (
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
				<p>No order information available. Redirecting to home page...</p>
				<Link to="/" className="text-blue-500 hover:underline">
					Return to Home
				</Link>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
			<p className="mb-4">
				Thank you for your order! Your tracking information will be provided shortly in the next 48hrs
			</p>
			<div className="bg-white shadow-md rounded-lg p-6 mb-4">
				<h2 className="text-xl font-semibold mb-2">Order Details</h2>
				<p>Order ID: {order._id}</p>
				<p>Total: ${order.orderTotal.toFixed(2)}</p>
				<p>Status: {order.status}</p>
			</div>
			<div className="bg-white shadow-md rounded-lg p-6 mb-4">
				<h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
				<p>
					{order.shippingAddress.firstName} {order.shippingAddress.lastName}
				</p>
				<p>{order.shippingAddress.street}</p>
				<p>
					{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
				</p>
				<p>{order.shippingAddress.country}</p>
			</div>
			<Link to="/" className="text-blue-500 hover:underline">
				Return to Home
			</Link>
		</div>
	);
};

export default OrderConfirmation;
