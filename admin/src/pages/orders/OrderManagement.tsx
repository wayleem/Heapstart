// src/pages/orders/OrderManagement.tsx

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@store/index";
import { RootState, Product } from "@types";
import { fetchOrders, updateOrderStatus, updateOrderTracking } from "@store/thunks/orderThunks";
import { fetchProduct } from "@store/thunks/productThunks";

const OrderManagement: React.FC = () => {
	const dispatch = useAppDispatch();
	const orders = useSelector((state: RootState) => state.order.items);
	const status = useSelector((state: RootState) => state.order.status);
	const [productDetails, setProductDetails] = useState<{ [key: string]: Product }>({});

	useEffect(() => {
		dispatch(fetchOrders());
	}, [dispatch]);

	useEffect(() => {
		const fetchProductDetails = async () => {
			for (const order of orders) {
				for (const product of order.products) {
					if (!productDetails[product.productId]) {
						try {
							await dispatch(fetchProduct(product.productId));
						} catch (error) {
							console.error(`Failed to fetch product details for ID: ${product.productId}`, error);
						}
					}
				}
			}
		};

		if (orders.length > 0) {
			fetchProductDetails();
		}
	}, [orders, dispatch, productDetails]);

	const handleStatusUpdate = (orderId: string, newStatus: string) => {
		dispatch(updateOrderStatus({ orderId, status: newStatus }));
	};

	const handleTrackingUpdate = (orderId: string, productId: string, trackingInfo: any) => {
		dispatch(updateOrderTracking({ orderId, productId, trackingInfo }));
	};

	if (status === "loading") {
		return <div>Loading orders...</div>;
	}

	return (
		<div>
			<h2>Order Management</h2>
			{orders.map((order) => (
				<div key={order._id}>
					<h3>Order ID: {order._id}</h3>
					<p>Status: {order.status}</p>
					<select value={order.status} onChange={(e) => handleStatusUpdate(order._id, e.target.value)}>
						<option value="pending">Pending</option>
						<option value="processing">Processing</option>
						<option value="shipped">Shipped</option>
						<option value="delivered">Delivered</option>
					</select>
					{order.products.map((product) => (
						<div key={product.productId}>
							<p>
								{product.name} - Quantity: {product.quantity}
							</p>
							{productDetails[product.productId] && (
								<a
									href={productDetails[product.productId].supplier_link}
									target="_blank"
									rel="noopener noreferrer"
								>
									Purchase Link
								</a>
							)}
							<input
								type="text"
								placeholder="Tracking Number"
								onChange={(e) =>
									handleTrackingUpdate(order._id, product.productId, {
										trackingNumber: e.target.value,
									})
								}
							/>
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default OrderManagement;
