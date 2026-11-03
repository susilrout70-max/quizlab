import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';
import { Login } from './pages/Login.js';
import { Signup } from './pages/Signup.js';
import { Dashboard } from './pages/Dashboard.js';
import { QuizRunner } from './pages/QuizRunner.js';
import { QuizReview } from './pages/QuizReview.js';
import { QuizHistory } from './pages/QuizHistory.js';
import { AiStudyChatbot } from './components/AiStudyChatbot.js';

const RootRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz/:attemptId"
            element={
              <ProtectedRoute>
                <QuizRunner />
              </ProtectedRoute>
            }
          />

          <Route
            path="/review/:attemptId"
            element={
              <ProtectedRoute>
                <QuizReview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <QuizHistory />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <AiStudyChatbot />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
