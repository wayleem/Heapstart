import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { clearCart, selectCartItems } from "@store/slices/cartSlice";
import { useAppSelector, useAppDispatch } from "@store/index";
import { api } from "@hooks/apiHooks";
import { useNavigate } from "react-router-dom";
import { createOrder, setCurrentOrder } from "@store/slices/orderSlice";
import { selectAllProducts } from "@store/slices/productsSlice";
import { AxiosError } from "axios";

const PaymentForm: React.FC<PaymentFormProps> = ({ total, shippingInfo }) => {
	const stripe = useStripe();
	const elements = useElements();
	const [clientSecret, setClientSecret] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [processing, setProcessing] = useState(false);
	const cartItems = useAppSelector(selectCartItems);
	const products = useAppSelector(selectAllProducts);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchPaymentIntent = async () => {
			try {
				const cartItemsArray = Object.entries(cartItems).map(([productId, quantity]) => ({
					productId,
					quantity,
				}));

				if (cartItemsArray.length === 0) {
					setError("Your cart is empty. Please add items before proceeding to checkout.");
					return;
				}

				const response = await api.post("/api/payment/create-payment-intent", {
					items: cartItemsArray,
				});
				setClientSecret(response.data.clientSecret);
			} catch (error) {
				setError("Failed to initialize payment. Please try again.");
				console.error("Error fetching payment intent:", error);
			}
		};

		fetchPaymentIntent();
	}, [cartItems]);

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
			const orderData: CreateOrderData = {
				products: Object.entries(cartItems).map(([productId, quantity]) => {
					const product = products.find((p) => p._id === productId);
					return {
						productId,
						quantity,
						price: product?.price || 0,
					};
				}),
				shippingAddress: shippingInfo,
				paymentInfo: { paymentMethodId: paymentIntentId },
				orderTotal: total,
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
				<p className="text-gray-600">Total to pay: ${total.toFixed(2)}</p>
			</div>
			<CardElement />
			{error && <div className="text-red-500">{error}</div>}
			<button type="submit" disabled={!stripe || processing || !clientSecret}>
				Pay ${total.toFixed(2)}
			</button>
		</form>
	);
};

export default PaymentForm;
