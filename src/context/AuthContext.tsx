import React, { createContext, useContext, useState, useEffect } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { useToast } from "./ToastContext"; // ✅ Adjust path as needed

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

type AuthMode = "home" | "login" | "otp";

interface AuthContextType {
  user: any;
  authMode: AuthMode;
  isLoading: boolean;
  showLogin: () => void;
  showOTP: () => void;
  showHome: () => void;
  sendOTP: (phoneNumber: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<boolean>;
  googleLogin: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState<AuthMode>("home");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const toast = useToast(); // ✅ Use toast from context

  const showLogin = () => setAuthMode("login");
  const showOTP = () => setAuthMode("otp");
  const showHome = () => setAuthMode("home");

  // ✅ Load user from localStorage on first load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setAuthMode("home");
    }
  }, []);

  const sendOTP = async (phoneNumber: string): Promise<void> => {
    try {
      if (!window.recaptchaVerifier) {
        const btn = document.getElementById("sign-in-button");
        if (!btn) throw new Error("sign-in-button not found in DOM");

        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "sign-in-button",
          {
            size: "invisible",
            callback: (response) => {
              console.log("reCAPTCHA solved:", response);
            },
            "expired-callback": () => {
              console.log("reCAPTCHA expired");
            },
          }
        );

        await window.recaptchaVerifier.render();
      }

      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      window.confirmationResult = result;
      setConfirmationResult(result);
      showOTP();
      console.log("OTP sent");
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    if (!confirmationResult) return false;
    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      setUser(result.user);
      localStorage.setItem("user", JSON.stringify(result.user)); // ✅ Save user
      showHome();
      return true;
    } catch (err) {
      console.error("Verify OTP failed:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      localStorage.setItem("user", JSON.stringify(result.user)); // ✅ Save user
      showHome();
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthMode("login"); // ✅ Redirect to login
    localStorage.removeItem("user");
    localStorage.removeItem("chatrooms");
    localStorage.removeItem("messages");
    toast.success("Logged out successfully!"); // ✅ Toast message
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authMode,
        isLoading,
        showLogin,
        showOTP,
        showHome,
        sendOTP,
        verifyOTP,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
