import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import ClientPortalLayout from '../layouts/ClientPortalLayout';
import ProtectedRoute from '../components/ProtectedRoute';

import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Attorneys from '../pages/public/Attorneys';
import PracticeAreas from '../pages/public/PracticeAreas';
import Contact from '../pages/public/Contact';
import PrivacyPolicy from '../pages/public/PrivacyPolicy';
import TermsOfService from '../pages/public/TermsOfService';
import Disclaimer from '../pages/public/Disclaimer';
import NotFound from '../pages/public/NotFound';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

import Dashboard from '../pages/client/Dashboard';
import Profile from '../pages/client/Profile';
import Appointments from '../pages/client/Appointments';
import Notifications from '../pages/client/Notifications';
import Documents from '../pages/client/Documents';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        {/* Public Informational Routes */}
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="attorneys" element={<Attorneys />} />
        <Route path="practice-areas" element={<PracticeAreas />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-of-service" element={<TermsOfService />} />
        <Route path="disclaimer" element={<Disclaimer />} />

        {/* Authentication Routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />

        {/* Protected Client Portal Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={['client', 'lawyer', 'admin']}>
              <ClientPortalLayout>
                <Dashboard />
              </ClientPortalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute allowedRoles={['client', 'lawyer', 'admin']}>
              <ClientPortalLayout>
                <Profile />
              </ClientPortalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="appointments"
          element={
            <ProtectedRoute allowedRoles={['client', 'lawyer', 'admin']}>
              <ClientPortalLayout>
                <Appointments />
              </ClientPortalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute allowedRoles={['client', 'lawyer', 'admin']}>
              <ClientPortalLayout>
                <Notifications />
              </ClientPortalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="documents"
          element={
            <ProtectedRoute allowedRoles={['client', 'lawyer', 'admin']}>
              <ClientPortalLayout>
                <Documents />
              </ClientPortalLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
