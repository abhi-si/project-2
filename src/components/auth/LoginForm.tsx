import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Phone } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { loginSchema } from "../../utils/validation";
import { CountrySelector } from "./CountrySelector";
import { useAuth } from "../../context/AuthContext";

interface LoginFormData {
  countryCode: string;
  phone: string;
}

export const LoginForm: React.FC = () => {
  const { sendOTP, isLoading, showHome,  googleLogin } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const countryCode = watch("countryCode");

  const onSubmit = async (data: LoginFormData) => {
    await sendOTP(data.countryCode + data.phone);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-95">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Login to Your Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your phone number to get started
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <CountrySelector
                value={countryCode}
                onChange={(value) => setValue("countryCode", value)}
                error={errors.countryCode?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  {...register("phone")}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.phone
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              or
            </div>

            <button
              type="button"
              onClick={googleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-lg py-3 px-6 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 transition-all"
            >
              <FcGoogle className="w-5 h-5" />
              Sign in with Google
            </button>

            {/* ✅ Required invisible reCAPTCHA button for Firebase */}
            <button
              id="sign-in-button"
              type="button"
              style={{ display: "none" }}
            >
              reCAPTCHA
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Don't have an account?{" "}
              <button
                onClick={showSignup}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Sign up here
              </button>
            </p>
            <button
              onClick={showHome}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              ← Back to home
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>

          {/* Optional: visible fallback reCAPTCHA container */}
          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
};
