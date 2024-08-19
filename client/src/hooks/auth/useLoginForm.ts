import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@store/index";
import { useNavigate } from "react-router-dom";
import { login } from "@store/thunks/userThunks";
import { selectIsAuthenticated } from "@store/slices/userSlice";

export const useLoginForm = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await dispatch(login(formData)).unwrap();
		} catch (error) {
			console.error("Login failed:", error);
			// Handle login error (e.g., show error message)
		} finally {
			setIsLoading(false);
		}
	};

	return { formData, isLoading, handleChange, handleSubmit };
};
