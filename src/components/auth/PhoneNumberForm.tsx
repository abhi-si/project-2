import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export const PhoneNumberForm: React.FC = () => {
  const [phone, setPhone] = useState("");
  const { sendOTP, isLoading } = useAuth();

  const handleSubmit = () => {
    if (!phone.startsWith("+91")) {
      alert("Include +91 or country code");
      return;
    }
    sendOTP(phone);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <input
        type="tel"
        placeholder="+91XXXXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="p-3 border rounded-md mb-4"
      />
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isLoading ? "Sending OTP..." : "Send OTP"}
      </button>
      <div id="recaptcha-container" />
    </div>
  );
};
