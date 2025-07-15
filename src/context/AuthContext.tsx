// AuthContext.tsx
import React, { createContext, useContext, useState } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";

// ✅ Extend window interface to include recaptchaVerifier and confirmationResult
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

type AuthMode = "home" | "login" | "signup" | "otp";

interface AuthContextType {
  user: any;
  authMode: AuthMode;
  isLoading: boolean;
  showLogin: () => void;
  showSignup: () => void;
  showOTP: () => void;
  showHome: () => void;
  sendOTP: (phoneNumber: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<boolean>;
  googleLogin: () => Promise<void>;
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

  const showLogin = () => setAuthMode("login");
  const showSignup = () => setAuthMode("signup");
  const showOTP = () => setAuthMode("otp");
  const showHome = () => setAuthMode("home");

  const sendOTP = async (phoneNumber: string): Promise<void> => {
    try {
      // ✅ Ensure reCAPTCHA is only initialized once
      if (!window.recaptchaVerifier) {
        const btn = document.getElementById("sign-in-button");
        if (!btn) {
          throw new Error("sign-in-button not found in DOM");
        }

        console.log("auth object:", auth); // Should NOT be undefined

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

        await window.recaptchaVerifier.render(); // ✅ Ensure it renders before sending
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
      showHome();
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authMode,
        isLoading,
        showLogin,
        showSignup,
        showOTP,
        showHome,
        sendOTP,
        verifyOTP,
        googleLogin,
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
