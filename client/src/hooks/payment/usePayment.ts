import { useState, useEffect } from "react";
import { useAppSelector } from "@store/index";
import { selectCartItems } from "@store/slices/cartSlice";
import { paymentApi } from "@api/endpoints";

export const usePayment = () => {
	const [clientSecret, setClientSecret] = useState("");
	const [error, setError] = useState<string | null>(null);
	const cartItems = useAppSelector(selectCartItems);

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

				const response = await paymentApi.createPaymentIntent({ items: cartItemsArray });
				setClientSecret(response.clientSecret);
			} catch (error) {
				setError("Failed to initialize payment. Please try again.");
				console.error("Error fetching payment intent:", error);
			}
		};

		fetchPaymentIntent();
	}, [cartItems, paymentApi]);

	return { clientSecret, error };
};
