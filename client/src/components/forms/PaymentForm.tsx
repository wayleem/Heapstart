// src/components/forms/PaymentForm.tsx

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { clearCart, selectCartItems } from "@store/slices/cartSlice";
import { useAppSelector, useAppDispatch } from "@store/index";
import { useNavigate } from "react-router-dom";
import { setCurrentOrder } from "@store/slices/orderSlice";
import { AxiosError } from "axios";
import { selectAllProducts } from "@store/slices/productSlice";
import { createOrder } from "@store/thunks/orderThunks";
import { Address, CreateOrderRequest, Product } from "@types";
import { validatePromoCode } from "@store/thunks/promoCodeThunks";
import { clearPromoCode } from "@store/slices/promoCodeSlice";
import { usePayment } from "@hooks/payment/usePayment";

interface PaymentFormProps {
	total: number;
	shippingInfo: Address;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ total, shippingInfo }) => {
	const stripe = useStripe();
	const elements = useElements();
	const [error, setError] = useState<string | null>(null);
	const [processing, setProcessing] = useState(false);
	const cartItems = useAppSelector(selectCartItems);
	const products = useAppSelector(selectAllProducts);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [promoCodeInput, setPromoCodeInput] = useState("");

	const { code, discountType, discountValue, error: promoError } = useAppSelector((state) => state.promoCodes);

	const { clientSecret, error: paymentError } = usePayment();

	const calculateDiscount = () => {
		if (!code || !discountType || !discountValue) return 0;
		return discountType === "percentage" ? total * (discountValue / 100) : Math.min(discountValue, total);
	};

	const discountAmount = calculateDiscount();
	const finalTotal = total - discountAmount;

	const handleApplyPromoCode = () => {
		dispatch(validatePromoCode(promoCodeInput));
	};

	const handleRemovePromoCode = () => {
		dispatch(clearPromoCode());
		setPromoCodeInput("");
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!stripe || !elements || !clientSecret) {
			console.error("Stripe.js has not loaded yet or client secret is missing.");
			return;
		}
		setProcessing(true);

		try {
			const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: elements.getElement(CardElement)!,
				},
			});

			if (stripeError) {
				console.error("Payment failed:", stripeError);
				setError(stripeError.message || "Payment failed");
			} else if (paymentIntent) {
				console.log("Payment successful:", paymentIntent);
				await createUserOrder(paymentIntent.id);
				dispatch(clearCart());
				navigate("/order-confirmation");
			}
		} catch (error) {
			console.error("Error processing payment:", error);
			setError("Error processing payment. Please try again.");
		}

		setProcessing(false);
	};

	const createUserOrder = async (paymentIntentId: string) => {
		try {
			const orderData: CreateOrderRequest = {
				products: Object.entries(cartItems).map(([productId, quantity]) => {
					const product = products.find((p: Product) => p._id === productId);
					return {
						productId,
						quantity: Number(quantity),
						price: product?.price || 0,
					};
				}),
				shippingAddress: shippingInfo,
				paymentInfo: { paymentMethodId: paymentIntentId },
				orderTotal: finalTotal,
				promoCode: code || undefined,
				appliedDiscount: discountAmount,
			};
			console.log("Sending order data:", orderData);
			const response = await dispatch(createOrder(orderData)).unwrap();
			dispatch(setCurrentOrder(response));
			console.log("Order created:", response);
			navigate("/order-confirmation", { state: { order: response } });
		} catch (error) {
			console.error("Error creating order:", error);
			if (error instanceof AxiosError) {
				if (error.response) {
					console.error("Response data:", error.response.data);
					console.error("Response status:", error.response.status);
					console.error("Response headers:", error.response.headers);
				} else if (error.request) {
					console.error("No response received:", error.request);
				} else {
					console.error("Error setting up request:", error.message);
				}
			} else {
				console.error("Unexpected error:", error);
			}
			throw error;
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="mb-4">
				<h2 className="text-xl font-semibold mb-2">Payment Details</h2>
				<p className="text-gray-600">Total to pay: ${finalTotal.toFixed(2)}</p>
			</div>
			<CardElement />

			<div className="mt-4">
				<h3 className="text-lg font-semibold mb-2">Promo Code</h3>
				{code ? (
					<div>
						<p className="text-green-600">Promo code applied: {code}</p>
						<button
							type="button"
							onClick={handleRemovePromoCode}
							className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
						>
							Remove Promo Code
						</button>
					</div>
				) : (
					<div className="flex items-center">
						<input
							type="text"
							value={promoCodeInput}
							onChange={(e) => setPromoCodeInput(e.target.value)}
							placeholder="Enter promo code"
							className="border p-2 mr-2 flex-grow"
						/>
						<button
							type="button"
							onClick={handleApplyPromoCode}
							className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
						>
							Apply
						</button>
					</div>
				)}
				{promoError && <p className="text-red-500 mt-2">{promoError}</p>}
			</div>

			{(error || paymentError) && <div className="text-red-500">{error || paymentError}</div>}
			<button
				type="submit"
				disabled={!stripe || processing || !clientSecret}
				className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{processing ? "Processing..." : `Pay $${finalTotal.toFixed(2)}`}
			</button>
		</form>
	);
};

export default PaymentForm;
