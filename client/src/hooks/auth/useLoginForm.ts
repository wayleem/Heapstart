import { useState } from "react";
import { useAppDispatch } from "@store/index";
import { setUser, setError } from "@store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { authApi } from "@api/endpoints";

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

		try {
			const response = await authApi.login(formData);
			const { userId, email, token } = response;
			dispatch(setUser({ id: userId, email, accessToken: token }));
			setIsLoading(false);
			navigate("/");
		} catch (error) {
			setIsLoading(false);
			dispatch(setError("Invalid email or password."));
		}
	};

	return { formData, isLoading, handleChange, handleSubmit };
};
