import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/api';
import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const SignupForm = ({ toggleForm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await signup(data.name, data.email, data.password);
      setSuccessMessage(
        'A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your account.'
      );
      setError('');
    } catch (err) {
      setError('Failed to sign up. Please try again.');
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

      const scope = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' ');

      const params = {
        response_type: 'code',
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        redirect_uri: `${process.env.REACT_APP_GOOGLE_APP_REDIRECT_URI}`,
        prompt: 'select_account',
        access_type: 'offline',
        scope,
      };

      const urlParams = new URLSearchParams(params).toString();
      window.location = `${GOOGLE_AUTH_URL}?${urlParams}`;
    } catch (err) {
      setError('Failed to sign up with Google. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage ? (
        <p className="text-green-500 mb-4">{successMessage}</p>
      ) : (
        <>
          <h2 className="text-4xl font-bold mb-6">Create an account</h2>
          <p className="mb-6">
            Already have an account?{' '}
            <button
              onClick={toggleForm}
              className="text-green-600 hover:underline"
            >
              Log In
            </button>
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register('password')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register('confirmPassword')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded-md hover:bg-green-700 flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="animate-spin w-6 h-6" />
              ) : (
                'Create account'
              )}
            </button>
          </form>
          <div className="mt-4">
            <p className="text-center">OR</p>
            <button
              onClick={handleGoogleSignup}
              className="w-full mt-2 border border-gray-300 p-2 rounded-md flex items-center justify-center"
            >
              <img
                src="flat-color-icons_google.svg"
                alt="Google"
                className="w-6 h-6 mr-2"
              />
              Sign Up with your Gmail account
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SignupForm;
