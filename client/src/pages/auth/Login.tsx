import React from "react";
import { useLoginForm } from "@hooks/auth/useLoginForm";

const Login: React.FC = () => {
	const { formData, isLoading, handleChange, handleSubmit } = useLoginForm();

	return (
		<form onSubmit={handleSubmit}>
			<input type="email" name="email" value={formData.email} onChange={handleChange} />
			<input type="password" name="password" value={formData.password} onChange={handleChange} />
			<button type="submit" disabled={isLoading}>
				{isLoading ? "Loading..." : "Login"}
			</button>
		</form>
	);
};

export default Login;
