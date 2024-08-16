import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/index";
import { setUser } from "@store/slices/userSlice";
import { RegistrationSteps } from "@components/auth/RegistrationSteps";
import { useRegistrationForm } from "@hooks/auth/useRegistrationForm";
import { authApi } from "@api/endpoints";
import { handleApiError } from "@utils/errorUtils";
import { RegistrationErrorState } from "@types";

const Registration: React.FC = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { step, formData, errors, isLoading, nextStep, prevStep, validateStep, setErrors, setFormData } =
		useRegistrationForm();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validateStep(step, formData, setErrors)) return;
		try {
			const response = await authApi.register({
				email: formData.email,
				password: formData.password,
				profile: {
					firstName: formData.firstName,
					lastName: formData.lastName,
					phone: formData.phone,
					address: formData.address,
				},
			});
			dispatch(
				setUser({
					id: response.userId,
					email: formData.email,
					accessToken: response.token,
					profile: {
						firstName: formData.firstName,
						lastName: formData.lastName,
						phone: formData.phone,
						address: formData.address,
					},
				}),
			);
			navigate("/");
		} catch (err) {
			const errorMessage = handleApiError(err);
			setErrors((prevErrors: RegistrationErrorState) => ({ ...prevErrors, email: errorMessage }));
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
