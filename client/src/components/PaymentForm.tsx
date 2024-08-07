import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { selectCartItems } from "@store/slices/cartSlice";
import { useAppSelector } from "@store/index";
import { api } from "@hooks/apiHooks";

interface PaymentFormData {
	paymentMethodId: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onNext, onBack, total }) => {
	const stripe = useStripe();
	const elements = useElements();
	const [clientSecret, setClientSecret] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [processing, setProcessing] = useState(false);
	const cartItems = useAppSelector(selectCartItems);

	useEffect(() => {
		const fetchPaymentIntent = async () => {
			try {
				const response = await api.post("/api/payment/create-payment-intent", {
					items: Object.entries(cartItems).map(([productId, quantity]) => ({
						productId,
						quantity,
					})),
				});
				setClientSecret(response.data.clientSecret);
			} catch (error) {
				setError("Failed to initialize payment. Please try again.");
			}
		};

		fetchPaymentIntent();
	}, [cartItems]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!stripe || !elements) {
			console.error("Stripe.js has not loaded yet.");
			return;
		}

		try {
			console.log("Cart items:", cartItems);
			const items = Object.entries(cartItems).map(([productId, quantity]) => ({
				productId,
				quantity,
			}));
			console.log("Sending items to server:", items);

			const response = await api.post("/api/payment/create-payment-intent", { items });
			console.log("Server response:", response.data);

			const { clientSecret } = response.data;

			if (!clientSecret) {
				throw new Error("No client secret received from the server");
			}

			const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: elements.getElement(CardElement)!,
				},
			});

			if (stripeError) {
				console.error("Payment failed:", stripeError);
			} else if (paymentIntent) {
				console.log("Payment successful:", paymentIntent);
			}
		} catch (error) {
			console.error("Error creating payment intent:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="mb-4">
				<h2 className="text-xl font-semibold mb-2">Payment Details</h2>
				<p className="text-gray-600">Total to pay: ${total.toFixed(2)}</p>
			</div>
			<CardElement />
			{error && <div className="text-red-500">{error}</div>}
			<button type="submit" disabled={!stripe || processing}>
				Pay ${total.toFixed(2)}
			</button>
		</form>
	);
};

export default PaymentForm;
