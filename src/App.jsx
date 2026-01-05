import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ScannerPage from './pages/ScannerPage';
import CheckoutPage from './pages/CheckoutPage';
import VerificationPage from './pages/VerificationPage';
import PartnerDashboard from './pages/PartnerDashboard';
import PartnerLoginPage from './pages/PartnerLoginPage';
import PartnerRoute from './components/PartnerRoute';


import { useAuth } from './contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

import LegalPage from './pages/LegalPage';
import ManifestoPage from './pages/ManifestoPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/scanner" element={<PrivateRoute><ScannerPage /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
          <Route path="/verify" element={<PrivateRoute><VerificationPage /></PrivateRoute>} />
          <Route path="/manifesto" element={<ManifestoPage />} />
          <Route path="/legal/:type" element={<LegalPage />} />
          <Route path="/partner/login" element={<Navigate to="/partner" replace />} />
          <Route path="/partner" element={<PartnerDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
