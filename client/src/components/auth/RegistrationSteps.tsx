import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import countryList from "react-select-country-list";
import Loading from "@components/common/Loading";
import { RegistrationErrorState, RegistrationFormData } from "@types";

interface RegistrationStepsProps {
	step: number;
	formData: RegistrationFormData;
	setFormData: React.Dispatch<React.SetStateAction<RegistrationFormData>>;
	errors: RegistrationErrorState;
	setErrors: React.Dispatch<React.SetStateAction<RegistrationErrorState>>;
	nextStep: () => void;
	prevStep: () => void;
	isLoading: boolean;
}

export const RegistrationSteps: React.FC<RegistrationStepsProps> = ({
	step,
	formData,
	setFormData,
	errors,
	setErrors,
	nextStep,
	prevStep,
	isLoading,
}) => {
	const countryOptions = countryList().getData();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name in formData) {
			setFormData({ ...formData, [name]: value });
			setErrors({ ...errors, [name]: "" });
		} else {
			setFormData({ ...formData, address: { ...formData.address, [name]: value } });
			setErrors({ ...errors, address: { ...errors.address, [name]: "" } });
		}
	};

	const handlePhoneChange = (value: string) => {
		setFormData({ ...formData, phone: value });
		setErrors({ ...errors, phone: "" });
	};

	const handleCountryChange = (selectedOption: any) => {
		setFormData({ ...formData, address: { ...formData.address, country: selectedOption.label } });
		setErrors({ ...errors, address: { ...errors.address, country: "" } });
	};

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<>
						<h2 className="text-2xl font-bold mb-5">Step 1: Your Name</h2>
						<div className="mb-4">
							<input
								type="text"
								name="firstName"
								value={formData.firstName}
								onChange={handleChange}
								placeholder="First Name"
								required
								className={`w-full p-2 border rounded-md ${
									errors.firstName ? "border-red-500" : "border-gray-300"
								} focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
							{errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
						</div>
						<div className="mb-4">
							<input
								type="text"
								name="lastName"
								value={formData.lastName}
								onChange={handleChange}
								placeholder="Last Name"
								required
								className={`w-full p-2 border rounded-md ${
									errors.lastName ? "border-red-500" : "border-gray-300"
								} focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
							{errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
						</div>
						<button
							onClick={nextStep}
							className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
						>
							Next
						</button>
					</>
				);
			case 2:
				return (
					<>
						<h2 className="text-2xl font-bold mb-5">Step 2: Account Details</h2>
						<p className="mb-4">Hi {formData.firstName}, please enter your email and password.</p>
						<div className="mb-4">
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Email"
								required
								className={`w-full p-2 border rounded-md ${
									errors.email ? "border-red-500" : "border-gray-300"
								} focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
							{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
						</div>
						<div className="mb-4">
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Password"
								required
								className={`w-full p-2 border rounded-md ${
									errors.password ? "border-red-500" : "border-gray-300"
								} focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
							{errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
						</div>
						<div className="flex justify-between">
							<button
								onClick={prevStep}
								className="bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400 transition duration-300"
							>
								Back
							</button>
							<button
								onClick={nextStep}
								className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
							>
								Next
							</button>
						</div>
					</>
				);
			case 3:
				return (
					<>
						<h2 className="text-2xl font-bold mb-5">Step 3: Contact Information</h2>
						<div className="mb-4">
							<PhoneInput
								country={"us"}
								value={formData.phone}
								onChange={handlePhoneChange}
								inputProps={{
									name: "phone",
									required: true,
									className: `w-full p-2 pl-14 border rounded-md ${
										errors.phone ? "border-red-500" : "border-gray-300"
									} focus:outline-none focus:ring-2 focus:ring-blue-500`,
								}}
								containerClass="phone-input"
							/>
							{errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
						</div>
						<div className="mb-4">
							<input
								type="text"
								name="street"
								value={formData.address.street}
								onChange={handleChange}
								placeholder="Street"
								required
								className={`w-full p-2 border rounded-md ${
									errors.address.street ? "border-red-500" : "border-gray-300"
								} focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
							{errors.address.street && (
								<p className="text-red-500 text-sm mt-1">{errors.address.street}</p>
							)}
						</div>
						<div className="mb-4">
							<input
								type="text"
								name="city"
								value={formData.address.city}
								onChange={handleChange}
								placeholder="City"
								required
								className={`w-full p-2 border rounded-md ${
									errors.address.city ? "border-red-500" : "border-gray-300"
								} focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
							{errors.address.city && <p className="text-red-500 text-sm mt-1">{errors.address.city}</p>}
						</div>
						<div className="mb-4">
							<input
								type="text"
								name="state"
								value={formData.address.state}
								onChange={handleChange}
								placeholder="State"
								required
								className={`w-full p-2 border rounded-md ${
									errors.address.state ? "border-red-500" : "border-gray-300"
								} focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
							{errors.address.state && (
								<p className="text-red-500 text-sm mt-1">{errors.address.state}</p>
							)}
						</div>
						<div className="mb-4">
							<input
								type="text"
								name="postalCode"
								value={formData.address.postalCode}
								onChange={handleChange}
								placeholder="Postal Code"
								required
								className={`w-full p-2 border rounded-md ${
									errors.address.postalCode ? "border-red-500" : "border-gray-300"
								} focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
							{errors.address.postalCode && (
								<p className="text-red-500 text-sm mt-1">{errors.address.postalCode}</p>
							)}
						</div>
						<div className="mb-4">
							<Select
								options={countryOptions}
								value={countryOptions.find((option) => option.label === formData.address.country)}
								onChange={handleCountryChange}
								placeholder="Select Country"
								className="react-select-container"
								classNamePrefix="react-select"
							/>
							{errors.address.country && (
								<p className="text-red-500 text-sm mt-1">{errors.address.country}</p>
							)}
						</div>
						<div className="flex justify-between">
							<button
								onClick={prevStep}
								className={`bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400 transition duration-300 ${
									isLoading ? "opacity-50 cursor-not-allowed" : ""
								}`}
								disabled={isLoading}
							>
								Back
							</button>
							<button
								type="submit"
								className={`bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300 ${
									isLoading ? "opacity-50 cursor-not-allowed" : ""
								}`}
								disabled={isLoading}
							>
								{isLoading ? <Loading size="small" color="text-white" /> : "Register"}
							</button>
						</div>
					</>
				);
			default:
				return null;
		}
	};

	return renderStep();
};
