import React, { useState } from "react";

interface ShippingFormData {
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ onNext }) => {
	const [formData, setFormData] = useState<ShippingFormData>({
		firstName: "",
		lastName: "",
		address: "",
		city: "",
		state: "",
		zipCode: "",
		country: "",
	});

	const [errors, setErrors] = useState<Partial<ShippingFormData>>({});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name as keyof ShippingFormData]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Partial<ShippingFormData> = {};
		let isValid = true;

		Object.entries(formData).forEach(([key, value]) => {
			if (!value.trim()) {
				newErrors[key as keyof ShippingFormData] = "This field is required";
				isValid = false;
			}
		});

		if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
			newErrors.zipCode = "Invalid ZIP code format";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			onNext(formData);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<input
					type="text"
					name="firstName"
					value={formData.firstName}
					onChange={handleChange}
					placeholder="First Name"
					className={`p-2 border rounded w-full ${errors.firstName ? "border-red-500" : ""}`}
					required
				/>
				{errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
			</div>
			<div>
				<input
					type="text"
					name="lastName"
					value={formData.lastName}
					onChange={handleChange}
					placeholder="Last Name"
					className={`p-2 border rounded w-full ${errors.lastName ? "border-red-500" : ""}`}
					required
				/>
				{errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
			</div>
			<div>
				<input
					type="text"
					name="address"
					value={formData.address}
					onChange={handleChange}
					placeholder="Address"
					className={`p-2 border rounded w-full ${errors.address ? "border-red-500" : ""}`}
					required
				/>
				{errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
			</div>
			<div>
				<input
					type="text"
					name="city"
					value={formData.city}
					onChange={handleChange}
					placeholder="City"
					className={`p-2 border rounded w-full ${errors.city ? "border-red-500" : ""}`}
					required
				/>
				{errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
			</div>
			<div>
				<input
					type="text"
					name="state"
					value={formData.state}
					onChange={handleChange}
					placeholder="State"
					className={`p-2 border rounded w-full ${errors.state ? "border-red-500" : ""}`}
					required
				/>
				{errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
			</div>
			<div>
				<input
					type="text"
					name="zipCode"
					value={formData.zipCode}
					onChange={handleChange}
					placeholder="ZIP Code"
					className={`p-2 border rounded w-full ${errors.zipCode ? "border-red-500" : ""}`}
					required
				/>
				{errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
			</div>
			<div>
				<input
					type="text"
					name="country"
					value={formData.country}
					onChange={handleChange}
					placeholder="Country"
					className={`p-2 border rounded w-full ${errors.country ? "border-red-500" : ""}`}
					required
				/>
				{errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
			</div>
			<button
				type="submit"
				className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
			>
				Next
			</button>
		</form>
	);
};

export default ShippingForm;
