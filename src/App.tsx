import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { useAuthStore } from './store/authStore';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { LandingPage } from './pages/LandingPage';
import { PricingPage } from './pages/PricingPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/80 rounded-2xl shadow-xl p-8">
        <AuthForm />
      </div>
      <footer className="fixed bottom-0 w-full py-4 text-center text-sm text-gray-600 bg-white/50 backdrop-blur-sm">
        <p>All rights reserved @OrbeeAI By @Offerrush</p>
      </footer>
    </div>
  );
}

function App() {
  const { loading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      useAuthStore.setState({ user, loading: false });
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/login" element={!auth.currentUser ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={
          auth.currentUser ? (
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          ) : (
            <Navigate to="/login" />
          )
        } />
        <Route path="/employees" element={
          auth.currentUser ? (
            <DashboardLayout>
              <EmployeesPage />
            </DashboardLayout>
          ) : (
            <Navigate to="/login" />
          )
        } />
        <Route path="/tasks" element={
          auth.currentUser ? (
            <DashboardLayout>
              <TasksPage />
            </DashboardLayout>
          ) : (
            <Navigate to="/login" />
          )
        } />
        <Route path="/support" element={
          auth.currentUser ? (
            <DashboardLayout>
              <div className="text-center text-gray-600 py-12">Support page coming soon!</div>
            </DashboardLayout>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;