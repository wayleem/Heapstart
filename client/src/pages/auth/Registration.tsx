import React from "react";
import { RegistrationSteps } from "@components/auth/RegistrationSteps";
import { useRegistrationForm } from "@hooks/auth/useRegistrationForm";

const Registration: React.FC = () => {
	const { step, formData, errors, isLoading, nextStep, prevStep, handleSubmit, setErrors, setFormData } =
		useRegistrationForm();

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
