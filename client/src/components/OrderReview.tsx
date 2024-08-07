import React from "react";
import { useSelector } from "react-redux";

const OrderReview: React.FC<OrderReviewProps> = ({ onSubmit, onBack }) => {
	const cartItems = useSelector((state: RootState) => state.cart.items);
	const products = useSelector((state: RootState) => state.products.items);

	const cartProducts = Object.entries(cartItems)
		.map(([productId, quantity]) => {
			const product = products.find((p) => p._id === productId);
			return { product, quantity };
		})
		.filter((item) => item.product !== undefined);

	const calculateTotal = () => {
		return cartProducts
			.reduce((total, item) => {
				return total + (item.product?.price || 0) * item.quantity;
			}, 0)
			.toFixed(2);
	};

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold">Order Review</h2>
			{cartProducts.map(({ product, quantity }) => (
				<div key={product?._id} className="flex justify-between items-center">
					<div>
						<p className="font-medium">{product?.name}</p>
						<p className="text-sm text-gray-500">Quantity: {quantity}</p>
					</div>
					<p>${((product?.price || 0) * quantity).toFixed(2)}</p>
				</div>
			))}
			<div className="border-t pt-4">
				<div className="flex justify-between items-center font-semibold">
					<p>Total:</p>
					<p>${calculateTotal()}</p>
				</div>
			</div>
			<div className="flex justify-between">
				<button onClick={onBack} className="bg-gray-300 text-black p-2 rounded">
					Back
				</button>
				<button onClick={onSubmit} className="bg-blue-500 text-white p-2 rounded">
					Place Order
				</button>
			</div>
		</div>
	);
};

export default OrderReview;
