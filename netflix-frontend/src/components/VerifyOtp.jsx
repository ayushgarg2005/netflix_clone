import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ MUST come from signup
  const userData = location.state;

  // 🔐 If user refreshes or opens OTP page directly
  useEffect(() => {
    if (!userData?.email) {
      navigate("/signup", { replace: true });
    }
  }, [userData, navigate]);

  if (!userData?.email) return null;

  const { email, name, password } = userData;

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const inputsRef = useRef([]);

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
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return;

    try {
      setLoading(true);

      // 🔐 Example API call
      // await verifySignupOtp({ email, otp: finalOtp });

      navigate("/browse");
    } catch (err) {
      alert(err?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black text-white overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#e50914]/15 via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-[#141414]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
          {/* BACK */}
          <button
            onClick={() => navigate("/signup")}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition text-sm mb-8"
          >
            <ArrowLeft size={16} /> Back to Signup
          </button>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#e50914]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="text-[#e50914]" size={32} />
            </div>
            <h1 className="text-3xl font-bold">Verify Email</h1>
            <p className="text-gray-500 text-sm mt-2">
              We’ve sent a 6-digit code to <br />
              <span className="text-gray-200 font-medium">{email}</span>
            </p>
          </div>

          {/* OTP INPUT */}
          <div className="flex justify-center gap-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-16 text-2xl text-center bg-neutral-900 border border-neutral-800 rounded-xl focus:border-[#e50914] outline-none"
              />
            ))}
          </div>

          {/* VERIFY */}
          <button
            onClick={handleVerify}
            disabled={loading || otp.join("").length < 6}
            className="w-full py-4 rounded-xl bg-[#e50914] font-bold disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>

          {/* RESEND */}
          <div className="mt-8 text-center text-sm">
            {timer > 0 ? (
              <p className="text-gray-500">
                Resend code in <span className="text-[#e50914]">{timer}s</span>
              </p>
            ) : (
              <button className="flex items-center gap-2 mx-auto text-white hover:text-[#e50914]">
                <RefreshCw size={14} /> Resend Code
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;