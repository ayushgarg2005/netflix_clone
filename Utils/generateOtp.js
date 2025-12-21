import crypto from "crypto";

export const generateOtp = () => {
  // Generates a secure 6-digit OTP
  return crypto.randomInt(100000, 1000000).toString();
};
