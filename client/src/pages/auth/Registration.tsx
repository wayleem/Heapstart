import React from "react";
import { RegistrationForm } from "@components/forms/RegistrationForm";
import { useRegistrationForm } from "@hooks/auth/useRegistrationForm";

const Registration: React.FC = () => {
	const { step, formData, errors, isLoading, nextStep, prevStep, handleSubmit, setErrors, setFormData } =
		useRegistrationForm();

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
			<RegistrationForm
				step={step}
				formData={formData}
				setFormData={setFormData}
				errors={errors}
				setErrors={setErrors}
				nextStep={nextStep}
				prevStep={prevStep}
				isLoading={isLoading}
				handleSubmit={handleSubmit}
			/>
		</div>
	);
};

export default Registration;
