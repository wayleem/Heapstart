import React, { useState } from "react";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import ShippingForm from "../components/ShippingForm";
import PaymentForm from "../components/PaymentForm";

const Checkout: React.FC = () => {
	const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
	const [step, setStep] = useState(1);
	const [shippingInfo, setShippingInfo] = useState<Address>({
		firstName: "",
		lastName: "",
		street: "",
		city: "",
		state: "",
		zipCode: "",
		country: "",
	});

	const cartItems = useSelector((state: RootState) => state.cart.items);
	const products = useSelector((state: RootState) => state.products.items);

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
				return <PaymentForm total={calculateTotal()} shippingInfo={shippingInfo} cartItems={cartItems} />;
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
