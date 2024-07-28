import React, { useState } from 'react';
import { useAppDispatch } from '../store';
import { setUser } from '../store/slices/userSlice';
import axios from "axios"
import { api } from "../hooks/ApiHooks"

const Registration: React.FC = () => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Invalid email address';
        }
        break;
      case 'password':
        if (value.length < 8) {
          error = 'Password must be at least 8 characters long';
        } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(value)) {
          error = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        }
        break;
      case 'firstName':
      case 'lastName':
      case 'street':
      case 'city':
      case 'state':
      case 'postalCode':
      case 'country':
        if (!value.trim()) {
          error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        }
        break;
      case 'phone':
        if (value && !/^\+?[\d\s-]+$/.test(value)) {
          error = 'Invalid phone number';
        }
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const validateStep = () => {
    let isValid = true;
    let newErrors = { ...errors };

    if (step === 1) {
      ['firstName', 'lastName'].forEach(field => {
        const error = validateField(field, formData[field as keyof typeof formData]);
        newErrors[field as keyof typeof errors] = error;
        if (error) isValid = false;
      });
    } else if (step === 2) {
      ['email', 'password'].forEach(field => {
        const error = validateField(field, formData[field as keyof typeof formData]);
        newErrors[field as keyof typeof errors] = error;
        if (error) isValid = false;
      });
    } else if (step === 3) {
      ['phone', 'street', 'city', 'state', 'postalCode', 'country'].forEach(field => {
        const error = validateField(field, formData[field as keyof typeof formData]);
        newErrors[field as keyof typeof errors] = error;
        if (error) isValid = false;
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      const response = await api.post('/user/register', {
        email: formData.email,
        password: formData.password,
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
          },
        },
      });

      dispatch(setUser({ id: response.data.userId, email: formData.email, accessToken: response.data.token }));
      // Redirect to home page or dashboard
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setErrors({ ...errors, email: err.response.data.message || 'An error occurred during registration.' });
      } else {
        setErrors({ ...errors, email: 'An unexpected error occurred.' });
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-5">Step 1: Your Name</h2>
            <div className="mb-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
                className={`w-full p-2 border rounded ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
                className={`w-full p-2 border rounded ${errors.lastName ? 'border-red-500' : ''}`}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
            <button onClick={nextStep} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Next
            </button>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-5">Step 2: Account Details</h2>
            <p className="mb-4">Hi {formData.firstName}, please enter your email and password.</p>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400">
                Back
              </button>
              <button onClick={nextStep} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Next
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold mb-5">Step 3: Contact Information</h2>
            <div className="mb-4">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street"
                required
                className={`w-full p-2 border rounded ${errors.street ? 'border-red-500' : ''}`}
              />
              {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
                className={`w-full p-2 border rounded ${errors.city ? 'border-red-500' : ''}`}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
                className={`w-full p-2 border rounded ${errors.state ? 'border-red-500' : ''}`}
              />
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
                required
                className={`w-full p-2 border rounded ${errors.postalCode ? 'border-red-500' : ''}`}
              />
              {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                required
                className={`w-full p-2 border rounded ${errors.country ? 'border-red-500' : ''}`}
              />
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
            </div>
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400">
                Back
              </button>
              <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                Register
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderStep()}
      </form>
    </div>
  );
};

export default Registration;
