import React, { useState } from "react";
import { useAppDispatch } from "../store";
import axios from "axios";
import { setUser, setError } from "../store/slices/userSlice";

const Login: React.FC = () => {
	const dispatch = useAppDispatch();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await axios.post("http://localhost:3001/user/login", formData);
			dispatch(
				setUser({
					id: response.data.userId,
					email: response.data.email,
					profile: response.data.profile,
				}),
			);
			// Redirect to home page or dashboard
		} catch (err) {
			if (axios.isAxiosError(err) && err.response) {
				dispatch(setError(err.response.data.message || "Invalid email or password."));
			} else {
				dispatch(setError("An unexpected error occurred."));
			}
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input type="email" name="email" value={formData.email} onChange={handleChange} required />
			<input type="password" name="password" value={formData.password} onChange={handleChange} required />
			<button type="submit">Login</button>
		</form>
	);
};

export default Login;
