import { Address } from "@types";
import React, { useEffect, useState } from "react";

interface ShippingFormProps {
	initialValues: Address;
	onNext: (data: Address) => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ initialValues, onNext }) => {
	const [formData, setFormData] = useState<Address>(initialValues);
	const [errors, setErrors] = useState<Partial<Address>>({});

	useEffect(() => {
		setFormData(initialValues);
	}, [initialValues]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name as keyof Address]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Partial<Address> = {};
		let isValid = true;

		Object.entries(formData).forEach(([key, value]) => {
			if (!value.trim()) {
				newErrors[key as keyof Address] = "This field is required";
				isValid = false;
			}
		});

		if (formData.postalCode && !/^\d{5}(-\d{4})?$/.test(formData.postalCode)) {
			newErrors.postalCode = "Invalid postal code format";
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
					name="street"
					value={formData.street}
					onChange={handleChange}
					placeholder="Street Address"
					className={`p-2 border rounded w-full ${errors.street ? "border-red-500" : ""}`}
					required
				/>
				{errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
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
					name="postalCode"
					value={formData.postalCode}
					onChange={handleChange}
					placeholder="Postal Code"
					className={`p-2 border rounded w-full ${errors.postalCode ? "border-red-500" : ""}`}
					required
				/>
				{errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
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
