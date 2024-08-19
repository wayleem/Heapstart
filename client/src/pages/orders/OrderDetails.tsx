// src/pages/orders/OrderDetails.tsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@store/index";
import { selectCurrentOrder } from "@store/slices/orderSlice";
import { fetchOrder } from "@store/thunks/orderThunks";
import { createSupportTicket } from "@store/thunks/supportTicketThunks";
import { TrackingInfo, CreateSupportTicketRequest } from "@types";

const OrderDetails: React.FC = () => {
	const { orderId } = useParams<{ orderId: string }>();
	const dispatch = useAppDispatch();
	const order = useAppSelector(selectCurrentOrder);
	const orderStatus = useAppSelector((state) => state.orders.status);
	const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
	const [subject, setSubject] = useState("");
	const [description, setDescription] = useState("");

	useEffect(() => {
		if (orderId) {
			dispatch(fetchOrder(orderId));
		}
	}, [orderId, dispatch]);

	const handleCreateSupportTicket = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!orderId) return;

		const ticketData: CreateSupportTicketRequest = {
			orderId,
			subject,
			description,
		};

		try {
			await dispatch(createSupportTicket(ticketData)).unwrap();
			setIsSupportModalOpen(false);
			setSubject("");
			setDescription("");
			// Optionally, show a success message
		} catch (error) {
			console.error("Failed to create support ticket:", error);
			// Optionally, show an error message
		}
	};

	if (orderStatus === "loading") {
		return <div>Loading order details...</div>;
	}

	if (orderStatus === "failed" || !order) {
		return <div>Failed to load order details</div>;
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
						<li key={product.productId} className="mb-4 flex items-center">
							{product.images && product.images.length > 0 && (
								<img
									src={`data:image/jpeg;base64,${product.images[0]}`}
									alt={product.name}
									className="w-16 h-16 object-cover mr-4"
								/>
							)}
							<div>
								<p className="font-semibold">{product.name}</p>
								<p>
									Quantity: {product.quantity} - Price: ${product.price.toFixed(2)}
								</p>
								{renderTrackingInfo(order.trackingInfo, product.productId)}
							</div>
						</li>
					))}
				</ul>

				<h3 className="text-h3 font-heading mt-4 mb-2">Shipping Address</h3>
				<p>{order.shippingAddress.street}</p>
				<p>
					{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
				</p>
				<p>{order.shippingAddress.country}</p>

				<div className="mt-6">
					<button
						onClick={() => setIsSupportModalOpen(true)}
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
					>
						Create Support Ticket
					</button>
				</div>
			</div>

			{isSupportModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
					<div className="bg-white p-6 rounded-lg max-w-md w-full">
						<h2 className="text-xl font-bold mb-4">Create Support Ticket</h2>
						<form onSubmit={handleCreateSupportTicket}>
							<div className="mb-4">
								<label htmlFor="subject" className="block text-sm font-medium text-gray-700">
									Subject
								</label>
								<input
									type="text"
									id="subject"
									value={subject}
									onChange={(e) => setSubject(e.target.value)}
									className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
									required
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="description" className="block text-sm font-medium text-gray-700">
									Description
								</label>
								<textarea
									id="description"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
									rows={4}
									required
								></textarea>
							</div>
							<div className="flex justify-end space-x-2">
								<button
									type="button"
									onClick={() => setIsSupportModalOpen(false)}
									className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
								>
									Submit Ticket
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

const renderTrackingInfo = (trackingInfo: TrackingInfo[], productId: string) => {
	const tracking = trackingInfo.find((t) => t.productId === productId);
	if (!tracking) return null;

	return (
		<div className="mt-2 text-sm">
			<p>
				<strong>Carrier:</strong> {tracking.carrier}
			</p>
			<p>
				<strong>Tracking Number:</strong> {tracking.trackingNumber}
			</p>
			{tracking.trackingLink && (
				<a
					href={tracking.trackingLink}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-500 hover:underline"
				>
					Track Package
				</a>
			)}
		</div>
	);
};

export default OrderDetails;
