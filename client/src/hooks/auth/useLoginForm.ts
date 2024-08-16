import { useState } from "react";
import { useAppDispatch } from "@store/index";
import { useNavigate } from "react-router-dom";
import { login } from "@store/thunks/userThunks";

export const useLoginForm = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		const result = await dispatch(login(formData)).unwrap();
		setIsLoading(false);
		if (result.id) {
			navigate("/");
		}
	};

	return { formData, isLoading, handleChange, handleSubmit };
};
