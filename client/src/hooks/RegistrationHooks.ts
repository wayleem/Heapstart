export interface FormData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone: string;
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
}

export interface ErrorState {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone: string;
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
}

export const initialFormData: FormData = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	phone: "",
	street: "",
	city: "",
	state: "",
	postalCode: "",
	country: "",
};

export const initialErrors: ErrorState = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	phone: "",
	street: "",
	city: "",
	state: "",
	postalCode: "",
	country: "",
};

const validateField = (name: string, value: string): string => {
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

export const validateStep = (
	step: number,
	formData: FormData,
	setErrors: React.Dispatch<React.SetStateAction<ErrorState>>,
): boolean => {
	let isValid = true;
	let newErrors: ErrorState = { ...initialErrors };

	const validateFields = (fields: (keyof FormData)[]) => {
		fields.forEach((field) => {
			const error = validateField(field, formData[field]);
			newErrors[field] = error;
			if (error) isValid = false;
		});
	};

	switch (step) {
		case 1:
			validateFields(["firstName", "lastName"]);
			break;
		case 2:
			validateFields(["email", "password"]);
			break;
		case 3:
			validateFields(["phone", "street", "city", "state", "postalCode", "country"]);
			break;
		default:
			break;
	}

	setErrors(newErrors);
	return isValid;
};
