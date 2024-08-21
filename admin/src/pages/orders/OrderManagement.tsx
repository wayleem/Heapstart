import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@store/index";
import { RootState, Product, Order } from "@types";
import { fetchOrders, updateOrderStatus } from "@store/thunks/orderThunks";
import { fetchProduct } from "@store/thunks/productThunks";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import TrackingForm from "@components/forms/TrackingForm";
import { useTrackingForms } from "@hooks/useTrackingForm";

const OrderManagement: React.FC = () => {
	const dispatch = useAppDispatch();
	const orders = useSelector((state: RootState) => state.order.items);
	const status = useSelector((state: RootState) => state.order.status);
	const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
	const [productDetails, setProductDetails] = useState<{ [key: string]: Product }>({});
	const { trackingForms, handleTrackingFormChange, handleTrackingSubmit } = useTrackingForms();

	useEffect(() => {
		dispatch(fetchOrders());
	}, [dispatch]);

	useEffect(() => {
		const fetchProductDetails = async () => {
			for (const order of orders) {
				for (const product of order.products) {
					if (!productDetails[product.productId]) {
						try {
							const fetchedProduct = await dispatch(fetchProduct(product.productId)).unwrap();
							setProductDetails((prev) => ({ ...prev, [product.productId]: fetchedProduct }));
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

	const toggleOrderExpansion = (orderId: string) => {
		setExpandedOrder(expandedOrder === orderId ? null : orderId);
	};

	const getTrackingInfo = (order: Order, productId: string) => {
		return order.trackingInfo.find((info) => info.productId === productId);
	};

	if (status === "loading") {
		return <div className="flex justify-center items-center h-64">Loading orders...</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Order Management</h1>
			{orders.map((order: Order) => (
				<div key={order._id} className="bg-white shadow-md rounded-lg mb-6 overflow-hidden">
					<div
						className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
						onClick={() => toggleOrderExpansion(order._id)}
					>
						<div>
							<h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
							<p className="text-sm text-gray-600">
								Date: {new Date(order.createdAt).toLocaleDateString()}
							</p>
							<p className="text-sm text-gray-600">User ID: {order.userId}</p>
							<p className="text-sm text-gray-600">
								Customer: {order.shippingAddress.firstName} {order.shippingAddress.lastName}
							</p>
						</div>
						<div className="flex items-center">
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${
									order.status === "pending"
										? "bg-yellow-100 text-yellow-800"
										: order.status === "processing"
										  ? "bg-blue-100 text-blue-800"
										  : order.status === "shipped"
										    ? "bg-green-100 text-green-800"
										    : "bg-gray-100 text-gray-800"
								}`}
							>
								{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
							</span>
							{expandedOrder === order._id ? (
								<ChevronUpIcon className="w-5 h-5 ml-2" />
							) : (
								<ChevronDownIcon className="w-5 h-5 ml-2" />
							)}
						</div>
					</div>
					{expandedOrder === order._id && (
						<div className="p-4 border-t border-gray-200">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
								<div>
									<h3 className="font-semibold mb-2">Products:</h3>
									{order.products.map((product) => (
										<div key={product.productId} className="mb-4 p-2 border rounded">
											<p className="font-medium">{product.name}</p>
											<p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
											<p className="text-sm text-gray-600">Price: ${product.price.toFixed(2)}</p>
											{productDetails[product.productId] && (
												<a
													href={productDetails[product.productId].supplier_link}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-500 hover:underline text-sm"
												>
													Supplier Link
												</a>
											)}
											{getTrackingInfo(order, product.productId) && (
												<div className="mt-2 p-2 bg-gray-100 rounded">
													<h4 className="font-medium">Existing Tracking Info:</h4>
													<p>Carrier: {getTrackingInfo(order, product.productId)?.carrier}</p>
													<p>
														Tracking Number:{" "}
														{getTrackingInfo(order, product.productId)?.trackingNumber}
													</p>
													{getTrackingInfo(order, product.productId)?.trackingLink && (
														<a
															href={
																getTrackingInfo(order, product.productId)?.trackingLink
															}
															target="_blank"
															rel="noopener noreferrer"
															className="text-blue-500 hover:underline text-sm"
														>
															Tracking Link
														</a>
													)}
												</div>
											)}
											<TrackingForm
												initialData={
													trackingForms[`${order._id}-${product.productId}`] || {
														carrier: "",
														trackingNumber: "",
														trackingLink: "",
													}
												}
												onSubmit={() => handleTrackingSubmit(order._id, product.productId)}
												onChange={(field, value) =>
													handleTrackingFormChange(order._id, product.productId, field, value)
												}
											/>
										</div>
									))}
								</div>
								<div>
									<h3 className="font-semibold mb-2">Shipping Address:</h3>
									<div className="p-2 border rounded">
										<p>
											{order.shippingAddress.firstName} {order.shippingAddress.lastName}
										</p>
										<p>{order.shippingAddress.street}</p>
										<p>
											{order.shippingAddress.city}, {order.shippingAddress.state}{" "}
											{order.shippingAddress.postalCode}
										</p>
										<p>{order.shippingAddress.country}</p>
									</div>
								</div>
							</div>
							<div className="mt-4">
								<label
									htmlFor={`status-${order._id}`}
									className="block text-sm font-medium text-gray-700"
								>
									Update Status:
								</label>
								<select
									id={`status-${order._id}`}
									value={order.status}
									onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
									className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
								>
									<option value="pending">Pending</option>
									<option value="processing">Processing</option>
									<option value="shipped">Shipped</option>
									<option value="delivered">Delivered</option>
								</select>
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default OrderManagement;
