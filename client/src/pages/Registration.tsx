import React, { useState } from "react";
import { useAppDispatch } from "../store";
import axios from "axios";
import { setUser } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { RegistrationSteps } from "../components/RegistrationSteps";
import { initialErrors, initialFormData, validateStep } from "../hooks/RegistrationHooks";

const Registration: React.FC = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState(initialFormData);
	const [errors, setErrors] = useState(initialErrors);

	const nextStep = () => {
		if (validateStep(step, formData, setErrors)) {
			setStep(step + 1);
		}
	};

	const prevStep = () => setStep(step - 1);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validateStep(step, formData, setErrors)) return;

		setIsLoading(true);
		try {
			const response = await axios.post("http://localhost:3001/user/register", {
				email: formData.email,
				password: formData.password,
				profile: {
					firstName: formData.firstName,
					lastName: formData.lastName,
					phone: formData.phone,
					address: {
						street: formData.street,
						city: formData.city,
						state: formData.state,
						postalCode: formData.postalCode,
						country: formData.country,
					},
				},
			});

			dispatch(
				setUser({
					id: response.data.userId,
					email: formData.email,
					accessToken: response.data.token,
					profile: {
						firstName: formData.firstName,
						lastName: formData.lastName,
						phone: formData.phone,
						address: {
							street: formData.street,
							city: formData.city,
							state: formData.state,
							postalCode: formData.postalCode,
							country: formData.country,
						},
					},
				}),
			);
			setTimeout(() => {
				setIsLoading(false);
				navigate("/");
			}, 1500);
		} catch (err) {
			setIsLoading(false);
			if (axios.isAxiosError(err) && err.response) {
				setErrors({ ...errors, email: err.response.data.message || "An error occurred during registration." });
			} else {
				setErrors({ ...errors, email: "An unexpected error occurred." });
			}
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
			<form onSubmit={handleSubmit} className="space-y-4">
				<RegistrationSteps
					step={step}
					formData={formData}
					setFormData={setFormData}
					errors={errors}
					setErrors={setErrors}
					nextStep={nextStep}
					prevStep={prevStep}
					isLoading={isLoading}
				/>
			</form>
		</div>
	);
};

export default Registration;
