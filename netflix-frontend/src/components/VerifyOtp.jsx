import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

/* ================= API ================= */
const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
});

const verifySignupOtp = (data) => API.post("/signup/verify-otp", data);

/* ================= COMPONENT ================= */
const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userData = location.state;
  const { name, email, password } = userData || {};

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const inputsRef = useRef([]);

  /* ================= GUARD ================= */
  useEffect(() => {
    if (!email) navigate("/signup");
  }, [email, navigate]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  /* ================= OTP HANDLERS ================= */
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      alert("Enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      await verifySignupOtp({
        name,
        email,
        password,
        otp: finalOtp,
      });

      alert("Signup successful");
      navigate("/signup"); // change to /browse later
    } catch (err) {
      alert(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return null;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">

        <h1 className="text-3xl md:text-4xl font-bold">
          Verify your <span className="text-[#e50914]">email</span>
        </h1>

        <p className="text-gray-400 text-sm">
          Enter the 6-digit code sent to <br />
          <span className="text-white">{email}</span>
        </p>

        {/* OTP BOXES */}
        <div className="flex justify-center gap-3 mt-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-2xl text-center bg-neutral-900
                         border border-neutral-800 rounded-md
                         focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914]/60
                         outline-none"
            />
          ))}
        </div>

        {/* TIMER */}
        <p className="text-gray-500 text-sm">
          {timer > 0 ? (
            <>Resend OTP in <span className="text-white">{timer}s</span></>
          ) : (
            <span className="text-[#e50914] cursor-pointer hover:underline">
              Resend OTP
            </span>
          )}
        </p>

        {/* BUTTON */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-[#e50914] hover:bg-red-700 transition
                     py-3 rounded-md text-lg font-semibold"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;