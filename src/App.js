import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import React from 'react';
import AuthPage from './components/auth/AuthPage';
import { AuthProvider } from './components/auth/AuthContext';
import PagesLayout from './pages/PagesLayout';
import AuthCallback from './components/auth/AuthCallback';
import EmailVerification from './components/auth/EmailVerification';
import PrivateRoute from './components/auth/PrivateRoute';
import './index.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/email-verify/" element={<EmailVerification />} />

          <Route
            path="/pages/*"
            element={<PrivateRoute element={<PagesLayout />} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
