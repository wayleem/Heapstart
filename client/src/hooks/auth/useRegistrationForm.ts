import { useState } from "react";
import { useAppDispatch } from "@store/index";
import { setUser } from "@store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { authApi } from "@api/endpoints";
import { Address, RegistrationErrorState, RegistrationFormData } from "@types";
import { register } from "@store/thunks/userThunks";

export const initialRegistrationFormData: RegistrationFormData = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	phone: "",
	address: {
		street: "",
		city: "",
		state: "",
		postalCode: "",
		country: "",
	},
};

export const initialRegistrationErrors: RegistrationErrorState = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	phone: "",
	address: {
		firstName: "",
		lastName: "",
		street: "",
		city: "",
		state: "",
		postalCode: "",
		country: "",
	},
};

export const useRegistrationForm = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState<RegistrationFormData>(initialRegistrationFormData);
	const [errors, setErrors] = useState<RegistrationErrorState>(initialRegistrationErrors);

	const validateStep = (
		currentStep: number,
		currentFormData: RegistrationFormData,
		setCurrentErrors: React.Dispatch<React.SetStateAction<RegistrationErrorState>>,
	): boolean => {
		let isValid = true;
		let newErrors: RegistrationErrorState = JSON.parse(JSON.stringify(initialRegistrationErrors));

		const validateField = (field: keyof RegistrationFormData | keyof Address, value: string) => {
			const error = validateRegistrationField(field, value);
			if (error) isValid = false;
			return error;
		};

		switch (currentStep) {
			case 1:
				newErrors.firstName = validateField("firstName", currentFormData.firstName);
				newErrors.lastName = validateField("lastName", currentFormData.lastName);
				break;
			case 2:
				newErrors.email = validateField("email", currentFormData.email);
				newErrors.password = validateField("password", currentFormData.password);
				break;
			case 3:
				newErrors.phone = validateField("phone", currentFormData.phone);
				newErrors.address.street = validateField("street", currentFormData.address.street);
				newErrors.address.city = validateField("city", currentFormData.address.city);
				newErrors.address.state = validateField("state", currentFormData.address.state);
				newErrors.address.postalCode = validateField("postalCode", currentFormData.address.postalCode);
				newErrors.address.country = validateField("country", currentFormData.address.country);
				break;
			default:
				break;
		}

		setCurrentErrors(newErrors);
		return isValid;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name in initialRegistrationFormData) {
			setFormData((prev) => ({ ...prev, [name]: value }));
			setErrors((prev) => ({ ...prev, [name]: "" }));
		} else {
			setFormData((prev) => ({
				...prev,
				address: { ...prev.address, [name]: value },
			}));
			setErrors((prev) => ({
				...prev,
				address: { ...prev.address, [name]: "" },
			}));
		}
	};

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
		const result = await dispatch(
			register({
				email: formData.email,
				password: formData.password,
				profile: {
					firstName: formData.firstName,
					lastName: formData.lastName,
					phone: formData.phone,
					address: {
						...formData.address,
					},
				},
			}),
		).unwrap();

		setIsLoading(false);
		if (result.id) {
			navigate("/");
		} else {
			setErrors((prev) => ({ ...prev, email: "Registration failed. Please try again." }));
		}
	};

	return {
		step,
		formData,
		errors,
		isLoading,
		handleChange,
		nextStep,
		prevStep,
		handleSubmit,
		validateStep,
		setErrors,
		setFormData,
	};
};

const validateRegistrationField = (name: string, value: string): string => {
	let error = "";
	switch (name) {
		case "email":
			if (!/\S+@\S+\.\S+/.test(value)) {
				error = "Invalid email address";
			}
			break;
		case "password":
			if (value.length < 8) {
				error = "Password must be at least 8 characters long";
			} else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(value)) {
				error =
					"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
			}
			break;
		case "firstName":
		case "lastName":
		case "street":
		case "city":
		case "state":
		case "postalCode":
		case "country":
			if (!value.trim()) {
				error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
			}
			break;
		case "phone":
			if (value && !/^\+?[\d\s-]+$/.test(value)) {
				error = "Invalid phone number";
			}
			break;
	}
	return error;
};
