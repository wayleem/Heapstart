import React, { useState } from "react";
import { useAppDispatch } from "../store";
import { setUser, setError } from "../store/slices/userSlice";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { api } from "../hooks/ApiHooks";

interface LoginFormData {
	email: string;
	password: string;
}

const Login: React.FC = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState<LoginFormData>({
		email: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const fetchUserProfile = async (token: string) => {
		try {
			const response = await api.get("/api/users/profile", {
				headers: { Authorization: `Bearer ${token}` },
			});
			dispatch(setUser(response.data));
		} catch (error) {
			console.error("Error fetching user profile:", error);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await api.post("/api/auth/login", formData);
			const { userId, email, token } = response.data;

			dispatch(setUser({ id: userId, email, accessToken: token }));
			await fetchUserProfile(token);

			setIsLoading(false);
			navigate("/");
		} catch (error) {
			setIsLoading(false);
			dispatch(setError("Invalid email or password."));
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
				<h2 className="text-3xl font-bold text-center mb-6">Login</h2>
				<form onSubmit={handleSubmit}>
					<InputField
						label="Email"
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						placeholder="Enter your email"
						required
					/>
					<InputField
						label="Password"
						type="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						placeholder="Enter your password"
						required
					/>
					<SubmitButton isLoading={isLoading} />
					<div className="mt-4 text-center">
						<Link to="/reset-password" className="text-blue-500 hover:underline">
							Forgot Password?
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

interface InputFieldProps {
	label: string;
	type: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder: string;
	required: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, name, value, onChange, placeholder, required }) => (
	<div className="mb-4">
		<label htmlFor={name} className="block text-sm font-medium text-gray-700">
			{label}
		</label>
		<input
			type={type}
			id={name}
			name={name}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			required={required}
			className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
	</div>
);

interface SubmitButtonProps {
	isLoading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading }) => (
	<button
		type="submit"
		className={`w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 ${
			isLoading ? "opacity-50 cursor-not-allowed" : ""
		}`}
		disabled={isLoading}
	>
		{isLoading ? <Loading size="small" color="text-white" /> : "Login"}
	</button>
);

export default Login;
