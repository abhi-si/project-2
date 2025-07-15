import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { HomePage } from "./components/home/HomePage";
import { LoginForm } from "./components/auth/LoginForm";
import { OTPVerification } from "./components/auth/OTPVerification";
import { Header } from "./components/layout/Header";
import { Dashboard } from "./components/dashboard/Dashboard";

const AppContent: React.FC = () => {
  const { user, authMode, showLogin } = useAuth(); // ❌ Removed showSignup

  // If user is authenticated, show the main app
  if (user) {
    return (
      <ChatProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <Header />
          <div className="h-[calc(100vh-73px)]">
            <Dashboard />
          </div>
        </div>
      </ChatProvider>
    );
  }

  // Handle different auth modes
  switch (authMode) {
    case "login":
      return <LoginForm />;
    case "otp":
      return <OTPVerification />;
    case "home":
    default:
      return <HomePage onLogin={showLogin} />; // ✅ Removed onSignup
  }
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
