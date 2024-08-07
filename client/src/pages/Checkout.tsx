import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../store";
import { createOrder } from "../store/slices/orderSlice";
import { clearCart } from "../store/slices/cartSlice";
import ShippingForm from "../components/ShippingForm";
import PaymentForm from "../components/PaymentForm";
import OrderReview from "../components/OrderReview";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const Checkout: React.FC = () => {
	const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

	const [step, setStep] = useState(1);
	const [shippingInfo, setShippingInfo] = useState<Address>({
		street: "",
		city: "",
		state: "",
		postalCode: "",
		country: "",
	});
	const [paymentInfo, setPaymentInfo] = useState({});
	const cartItems = useSelector((state: RootState) => state.cart.items);
	const products = useSelector((state: RootState) => state.products.items);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const cartProducts = Object.entries(cartItems)
		.map(([productId, quantity]) => {
			const product = products.find((p) => p._id === productId);
			return { product, quantity };
		})
		.filter((item) => item.product !== undefined);

	const calculateTotal = () => {
		return cartProducts.reduce((total, item) => {
			return total + (item.product?.price || 0) * item.quantity;
		}, 0);
	};

	const handleSubmitOrder = async () => {
		try {
			const orderData: CreateOrderData = {
				products: cartProducts.map(({ product, quantity }) => ({
					productId: product?._id ?? "", // Use empty string as fallback
					quantity,
					price: product?.price ?? 0, // Use 0 as fallback
				})),
				shippingAddress: shippingInfo,
				paymentInfo,
				orderTotal: calculateTotal(),
			};
			const resultAction = await dispatch(createOrder(orderData));
			if (createOrder.fulfilled.match(resultAction)) {
				dispatch(clearCart());
				navigate("/order-confirmation", { state: { orderId: resultAction.payload._id } });
			} else {
				// Handle error
				console.error("Failed to create order:", resultAction.error);
			}
		} catch (error) {
			console.error("Error submitting order:", error);
		}
	};

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<ShippingForm
						onNext={(data) => {
							setShippingInfo(data);
							setStep(2);
						}}
					/>
				);
			case 2:
				return (
					<PaymentForm
						onNext={(data) => {
							setPaymentInfo(data);
							setStep(3);
						}}
						onBack={() => setStep(1)}
						total={calculateTotal()}
					/>
				);
			case 3:
				return (
					<OrderReview
						shippingAddress={shippingInfo}
						paymentInfo={paymentInfo}
						products={cartProducts}
						total={calculateTotal()}
						onSubmit={handleSubmitOrder}
						onBack={() => setStep(2)}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<Elements stripe={stripePromise}>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold mb-4">Checkout</h1>

				{/* Cart Items and Total */}
				<div className="bg-white shadow-md rounded-lg p-6 mb-8">
					<h2 className="text-xl font-semibold mb-4">Your Cart</h2>
					{cartProducts.map(({ product, quantity }) => (
						<div key={product?._id} className="flex justify-between items-center mb-2">
							<span className="text-gray-700">
								{product?.name} x {quantity}
							</span>
							<span className="font-medium">${((product?.price || 0) * quantity).toFixed(2)}</span>
						</div>
					))}
					<div className="border-t mt-4 pt-4">
						<div className="flex justify-between items-center font-semibold">
							<span>Total:</span>
							<span>${calculateTotal().toFixed(2)}</span>
						</div>
					</div>
				</div>

				{renderStep()}
			</div>
		</Elements>
	);
};

export default Checkout;
