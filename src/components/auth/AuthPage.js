import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import { useAuth } from './AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) return navigate('/pages');
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex h-screen bg-custom-lime">
      <div className="hidden md:flex w-1/2 bg-[#021405] items-center justify-center">
        <img
          src="Frame-Enerdit.svg"
          alt="ENERDIT Logo"
          className="w-full h-screen"
        />
      </div>
      <div className="w-full p-4 md:w-1/2 flex items-center justify-center">
        {isLogin ? (
          <SignupForm toggleForm={() => setIsLogin(false)} />
        ) : (
          <LoginForm toggleForm={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
