import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authWithGoogle } from '../../services/api';
import { Loader } from 'lucide-react';
import { useAuth } from './AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginG } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const queryString = location.search.split('?')[1];
    if (!queryString) {
      navigate('/');
      return;
    }

    const params = new URLSearchParams(queryString);
    const error = params.get('error');

    if (error) {
      console.error('Google login error:', error);
      navigate('/');
      return;
    }

    if (!isAuthenticating) {
      setIsAuthenticating(true);
      const authenticateUser = async () => {
        try {
          const response = await authWithGoogle(queryString);
          localStorage.setItem('accessToken', response.data.tokens.access);
          localStorage.setItem('refreshToken', response.data.tokens.refresh);
          loginG(response.data.user, response.data.tokens);
          navigate('/pages');
        } catch (err) {
          console.error('Failed to log in with Google:', err);
          // alert('Failed to log in with Google. Please try again later.');
          navigate('/');
        } finally {
          setIsAuthenticating(false);
        }
      };

      authenticateUser();
    }
  }, [location.search, loginG, navigate, isAuthenticating]);

  return (
    <div className="flex justify-center items-center h-screen text-black">
      <div className="flex text-center justify-center items-center">
        <Loader className="animate-spin w-16 h-16" />
        <p className="ml-2">Processing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
