import React, { useState } from "react";

interface CartItem {
	id: number;
	name: string;
	price: number;
	quantity: number;
}

const Checkout: React.FC = () => {
	const [cartItems] = useState<CartItem[]>([
		{ id: 1, name: "Introduction to Algorithms Textbook", price: 79.99, quantity: 1 },
		{ id: 2, name: "Mechanical Keyboard for Coding", price: 129.99, quantity: 1 },
		{ id: 3, name: "CS T-Shirt", price: 19.99, quantity: 2 },
	]);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		address: "",
		city: "",
		country: "",
		zipCode: "",
		cardNumber: "",
		expiryDate: "",
		cvv: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("Order submitted:", formData);
		alert("Order placed successfully!");
	};

	const calculateTotal = () => {
		return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-3xl">
			<h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>
			<div className="bg-white shadow-md rounded-lg overflow-hidden">
				<div className="p-4 bg-gray-50 border-b">
					<h2 className="text-lg font-semibold mb-2">Order Summary</h2>
					<div className="space-y-2 mb-4">
						{cartItems.map((item) => (
							<div key={item.id} className="flex justify-between items-center text-sm">
								<div className="flex items-center">
									<div className="w-8 h-8 bg-gray-200 rounded-md mr-2"></div>
									<div>
										<h3 className="font-medium">{item.name}</h3>
										<p className="text-gray-600">Qty: {item.quantity}</p>
									</div>
								</div>
								<p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
							</div>
						))}
					</div>
					<div className="flex justify-between items-center text-lg font-semibold">
						<h3>Total:</h3>
						<p>${calculateTotal()}</p>
					</div>
				</div>
				<form onSubmit={handleSubmit} className="p-4 space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="col-span-2">
							<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
								Full Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
								required
							/>
						</div>
						<div className="col-span-2">
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
								required
							/>
						</div>
						<div className="col-span-2">
							<label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
								Address
							</label>
							<input
								type="text"
								id="address"
								name="address"
								value={formData.address}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
								required
							/>
						</div>
						<div>
							<label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
								City
							</label>
							<input
								type="text"
								id="city"
								name="city"
								value={formData.city}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
								required
							/>
						</div>
						<div>
							<label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
								Country
							</label>
							<input
								type="text"
								id="country"
								name="country"
								value={formData.country}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
								required
							/>
						</div>
						<div>
							<label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
								Zip Code
							</label>
							<input
								type="text"
								id="zipCode"
								name="zipCode"
								value={formData.zipCode}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
								required
							/>
						</div>
						<div className="col-span-2">
							<label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
								Card Number
							</label>
							<input
								type="text"
								id="cardNumber"
								name="cardNumber"
								value={formData.cardNumber}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
								required
							/>
						</div>
						<div>
							<label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
								Expiry Date
							</label>
							<input
								type="text"
								id="expiryDate"
								name="expiryDate"
								value={formData.expiryDate}
								onChange={handleChange}
								placeholder="MM/YY"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
								required
							/>
						</div>
						<div>
							<label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
								CVV
							</label>
							<input
								type="text"
								id="cvv"
								name="cvv"
								value={formData.cvv}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
								required
							/>
						</div>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
					>
						Place Order
					</button>
				</form>
			</div>
		</div>
	);
};

export default Checkout;
