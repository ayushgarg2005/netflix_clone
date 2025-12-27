import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, RefreshCw, ShieldCheck, ArrowRight } from "lucide-react";

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

  const { email } = userData;

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 🔐 Example API call
      // await verifySignupOtp({ email, otp: finalOtp });

      navigate("/home");
    } catch (err) {
      alert(err?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full relative bg-[#001E2B] text-slate-100 font-sans selection:bg-[#00ED64] selection:text-[#001E2B] overflow-hidden flex items-center justify-center">
      
      {/* 1. TECHNICAL BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
        <div className="absolute top-[-20%] right-[30%] w-[500px] h-[500px] rounded-full bg-[#00ED64] opacity-[0.05] blur-[120px]" />
      </div>

      {/* 2. CARD CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[440px] px-4"
      >
        <div className="bg-[#021019]/90 backdrop-blur-xl border border-slate-700/50 rounded-xl p-8 shadow-2xl">
          
          {/* Back Button */}
          <button
            onClick={() => navigate("/signup")}
            className="group flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-white transition-colors mb-6 uppercase tracking-wide"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Signup
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#00ED64]/10 rounded-lg flex items-center justify-center mx-auto mb-4 border border-[#00ED64]/20 shadow-[0_0_15px_rgba(0,237,100,0.1)]">
              <ShieldCheck className="text-[#00ED64]" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Check your inbox</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              We’ve sent a 6-digit verification code to <br />
              <span className="text-white font-medium border-b border-[#00ED64]/30 pb-0.5">{email}</span>
            </p>
          </div>

          {/* OTP INPUTS */}
          <div className="flex justify-between gap-2 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold text-center rounded-lg bg-[#001E2B] border ${digit ? 'border-[#00ED64] text-[#00ED64]' : 'border-slate-600 text-white'} focus:border-[#00ED64] focus:ring-1 focus:ring-[#00ED64] transition-all outline-none caret-[#00ED64] shadow-inner`}
              />
            ))}
          </div>

          {/* VERIFY BUTTON */}
          <button
            onClick={handleVerify}
            disabled={loading || otp.join("").length < 6}
            className="w-full flex items-center justify-center gap-2 bg-[#00ED64] hover:bg-[#00c052] disabled:bg-[#00ED64]/20 disabled:text-slate-500 disabled:cursor-not-allowed text-[#001E2B] font-bold py-3.5 rounded-lg transition-all shadow-[0_0_15px_rgba(0,237,100,0.1)] hover:shadow-[0_0_20px_rgba(0,237,100,0.25)] active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#001E2B]/30 border-t-[#001E2B] rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify Email</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* RESEND TIMER */}
          <div className="mt-8 text-center text-sm">
            {timer > 0 ? (
              <p className="text-slate-500 font-medium">
                Resend code in <span className="text-[#00ED64] tabular-nums">{timer}s</span>
              </p>
            ) : (
              <button 
                onClick={() => setTimer(30)} // Add resend logic here
                className="flex items-center gap-2 mx-auto text-slate-300 hover:text-[#00ED64] transition-colors font-medium group"
              >
                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> 
                Resend Code
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;