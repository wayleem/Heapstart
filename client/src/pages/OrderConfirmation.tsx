import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectCurrentOrder, clearCurrentOrder } from "../store/slices/orderSlice";

const OrderConfirmation: React.FC = () => {
	const dispatch = useDispatch();
	const order = useSelector(selectCurrentOrder);
	const navigate = useNavigate();

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
			<p className="mb-4">Thank you for your order!</p>
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
					{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
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
