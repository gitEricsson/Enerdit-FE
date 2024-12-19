import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyEmail } from '../../services/api';

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState('loading');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');

      if (!token) {
        setVerificationStatus('error');
        return;
      }

      try {
        await verifyEmail(token);
        setVerificationStatus('success');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        setVerificationStatus('error');
      }
    };

    verifyToken();
  }, [location.search, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        {verificationStatus === 'loading' && (
          <p className="text-xl">Verifying your email address...</p>
        )}
        {verificationStatus === 'success' && (
          <div>
            <p className="text-xl text-green-600 mb-4">
              Your email has been successfully verified!
            </p>
            <p>You will be redirected to the login page in a few seconds.</p>
          </div>
        )}
        {verificationStatus === 'error' && (
          <div>
            <p className="text-xl text-red-600 mb-4">
              Email verification failed.
            </p>
            <p>
              The verification link may be invalid or expired. Please try
              signing up again or contact support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
