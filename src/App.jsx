import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ScannerPage from './pages/ScannerPage';
import CheckoutPage from './pages/CheckoutPage';
import VerificationPage from './pages/VerificationPage';
import PartnerDashboard from './pages/PartnerDashboard';

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
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/manifesto" element={<ManifestoPage />} />
          <Route path="/legal/:type" element={<LegalPage />} />
          <Route path="/partner" element={<PartnerDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
