import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { otpSchema } from "../../utils/validation";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

interface OTPVerificationData {
  otp: string;
}

export const OTPVerification: React.FC = () => {
  const { verifyOTP, isLoading, showHome } = useAuth();
  const { showToast } = useToast();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm<OTPVerificationData>({
    resolver: zodResolver(otpSchema),
  });

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setValue("otp", newOtp.join(""));

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data: OTPVerificationData) => {
    const otpString = otp.join("");
    if (otpString.length < 6) {
      setError("otp", { message: "Please enter all 6 digits." });
      return;
    }

    const success = await verifyOTP(otpString);
    if (!success) {
      setError("otp", { message: "Invalid OTP. Please try again." });
      showToast("Invalid OTP. Please try again.", "error");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  useEffect(() => {
    // Focus first empty input
    const firstEmpty = otp.findIndex((digit) => digit === "");
    inputRefs.current[firstEmpty >= 0 ? firstEmpty : 0]?.focus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-95">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Verify OTP
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter the 6-digit code sent to your phone
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <div className="flex justify-center space-x-3 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-12 text-center text-xl font-bold border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.otp
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                ))}
              </div>

              {errors.otp && (
                <p className="text-center text-sm text-red-600 dark:text-red-400">
                  {errors.otp.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={showHome}
              className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to home
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive the code?
              <button
                onClick={() =>
                  showToast("Resend feature not implemented", "info")
                }
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 ml-1 transition-colors"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
