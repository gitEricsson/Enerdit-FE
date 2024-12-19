import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import { useAuth } from './AuthContext';
import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginForm = ({ toggleForm }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginG } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await login(data.email, data.password);
      loginG(response.user, response.tokens);
      navigate('/pages');
    } catch (err) {
      setError(
        'Failed to log in. Please check your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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

      // const authWindow = window.open(`${GOOGLE_AUTH_URL}?${urlParams}`, '_self');
    } catch (err) {
      setError('Failed to log in with Google. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-4xl font-bold mb-6">Welcome Back</h2>
      <p className="mb-6">
        New to Enerdit?{' '}
        <button onClick={toggleForm} className="text-green-600 hover:underline">
          Create account
        </button>
      </p>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded-md hover:bg-green-700 flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="animate-spin w-6 h-6" /> : 'Log In'}
        </button>
      </form>
      <div className="mt-4">
        <p className="text-center">OR</p>
        <button
          onClick={handleGoogleLogin}
          className="w-full mt-2 border border-gray-300 p-2 rounded-md flex items-center justify-center"
        >
          <img
            src="flat-color-icons_google.svg"
            alt="Google"
            className="w-6 h-6 mr-2"
          />
          Log In with your Gmail account
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
