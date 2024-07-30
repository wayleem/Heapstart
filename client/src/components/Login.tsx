import React, { useState } from 'react';
import { useAppDispatch } from '../store';
import axios from 'axios';
import { setUser } from '../store/slices/userSlice';
import { api } from "../hooks/ApiHooks"

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/user/login', formData);
      dispatch(setUser({
        id: response.data.userId,
        email: response.data.email, // Assuming the API returns the email
        accessToken: response.data.token,
        profile: response.data.profile // Assuming the API returns the profile
      }));
      // Redirect to home page or dashboard
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Invalid username or password.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Login</h2>
      {error && <p className="text-red-500 mb-5">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username or Email"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
