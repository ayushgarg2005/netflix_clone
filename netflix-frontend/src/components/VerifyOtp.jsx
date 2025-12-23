import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Temporary fallback for development so the page doesn't crash
  const userData = location.state || { email: "development@test.com" };
  const { name, email, password } = userData;

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

    // Auto-focus next
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
    if (finalOtp.length !== 6) return;

    try {
      setLoading(true);
      // await verifySignupOtp({ ...userData, otp: finalOtp });
      navigate("/browse");
    } catch (err) {
      alert(err?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black text-white selection:bg-[#e50914] overflow-hidden">
      
      {/* 1. CINEMATIC BACKGROUND */}
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
          
          {/* BACK BUTTON */}
          <button 
            onClick={() => navigate("/signup")}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Signup
          </button>

          <div className="text-center space-y-3 mb-10">
            <div className="w-16 h-16 bg-[#e50914]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#e50914]/20">
              <Mail className="text-[#e50914]" size={32} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Verify Email</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              We've sent a 6-digit code to <br />
              <span className="text-gray-200 font-medium">{email}</span>
            </p>
          </div>

          {/* OTP INPUTS */}
          <div className="flex justify-center gap-2 md:gap-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-11 h-14 md:w-12 md:h-16 text-2xl font-bold text-center bg-neutral-900/50 
                           border border-neutral-800 rounded-xl focus:border-[#e50914] 
                           focus:ring-4 focus:ring-[#e50914]/10 outline-none transition-all"
              />
            ))}
          </div>

          {/* VERIFY BUTTON */}
          <button
            onClick={handleVerify}
            disabled={loading || otp.join("").length < 6}
            className="w-full py-4 rounded-xl bg-[#e50914] hover:bg-red-700 font-bold 
                       text-white transition-all active:scale-[0.98] disabled:opacity-50 
                       disabled:cursor-not-allowed shadow-lg shadow-red-900/20"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : (
              "Verify & Continue"
            )}
          </button>

          {/* RESEND LOGIC */}
          <div className="mt-8 text-center">
            {timer > 0 ? (
              <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                Resend code in <span className="text-[#e50914] font-mono font-bold w-6">{timer}s</span>
              </p>
            ) : (
              <button className="flex items-center gap-2 mx-auto text-white hover:text-[#e50914] transition-colors text-sm font-semibold group">
                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                Resend Code
              </button>
            )}
          </div>

        </div>

        <p className="text-[11px] text-gray-600 text-center mt-8 uppercase tracking-[0.2em]">
          Secure Verification • Streamflix Identity
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;

