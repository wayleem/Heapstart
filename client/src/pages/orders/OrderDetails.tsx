import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Order } from "@types";
import { orderApi } from "@api/endpoints";

const OrderDetails: React.FC = () => {
	const { orderId } = useParams<{ orderId: string }>();
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getOrderDetails = async () => {
			if (!orderId) return; // Add a check for orderId
			try {
				const orderData = await orderApi.getOrder(orderId);
				setOrder(orderData);
			} catch (error) {
				console.error("Failed to fetch order details:", error);
			} finally {
				setLoading(false);
			}
		};
		getOrderDetails();
	}, [orderId]);

	if (loading) {
		return <div>Loading order details...</div>;
	}

	if (!order) {
		return <div>Order not found</div>;
	}

	return (
		<div className="p-6 bg-base-200 min-h-screen">
			<h2 className="text-h2 font-heading mb-4">Order Details</h2>
			<div className="bg-base-100 shadow-md rounded-lg p-4">
				<p>
					<strong>Order ID:</strong> {order._id}
				</p>
				<p>
					<strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
				</p>
				<p>
					<strong>Total:</strong> ${order.orderTotal.toFixed(2)}
				</p>
				<p>
					<strong>Status:</strong> <span className={`badge ${order.status}`}>{order.status}</span>
				</p>
				<h3 className="text-h3 font-heading mt-4 mb-2">Products</h3>
				<ul>
					{order.products.map((product) => (
						<li key={product.productId} className="mb-2">
							{/* Assuming the product object has a name property, if not, adjust accordingly */}
							{product.productId} - Quantity: {product.quantity} - Price: ${product.price.toFixed(2)}
						</li>
					))}
				</ul>
				<h3 className="text-h3 font-heading mt-4 mb-2">Shipping Address</h3>
				<p>{order.shippingAddress.street}</p>
				<p>
					{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
				</p>
				<p>{order.shippingAddress.country}</p>
			</div>
		</div>
	);
};

export default OrderDetails;
