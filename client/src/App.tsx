import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';
import { Landing } from './pages/Landing.js';
import { Login } from './pages/Login.js';
import { Signup } from './pages/Signup.js';
import { Dashboard } from './pages/Dashboard.js';
import { QuizRunner } from './pages/QuizRunner.js';
import { QuizReview } from './pages/QuizReview.js';
import { QuizHistory } from './pages/QuizHistory.js';
import { AiStudyChatbot } from './components/AiStudyChatbot.js';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
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
    </ThemeProvider>
  );
};

export default App;
