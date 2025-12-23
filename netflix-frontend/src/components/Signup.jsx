import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ChevronRight } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Typing Effect Logic
  const fullText = "Unlimited movies, series and more.";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [index]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async () => {
    if (!form.name || !form.email || !form.password) return alert("Please fill all fields");
    if (form.password !== form.confirmPassword) return alert("Passwords match error");

    try {
      setLoading(true);
      // await sendSignupOtp(form); // Your API call
      navigate("/verify-otp", { state: form });
    } catch (err) {
      alert(err?.response?.data?.message || "Service unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Key Fix: Changed min-h-screen to h-screen and added overflow-hidden.
       Used h-[100dvh] for better mobile browser support.
    */
    <div className="h-screen w-full relative flex items-center justify-center bg-black text-white selection:bg-[#e50914] selection:text-white overflow-hidden">
      
      {/* 1. CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#e50914]/20 via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#e50914]/10 via-transparent to-transparent opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-5 gap-16 px-6 items-center">
        
        {/* LEFT SECTION - BRANDING */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-3 space-y-8 hidden lg:block"
        >
          <div className="space-y-4">
            <h1 className="text-6xl xl:text-7xl font-black leading-[1.1] tracking-tighter">
              {displayText.split(" ").map((word, i) => (
                <span key={i} className={word.includes("Unlimited") || word.includes("more") ? "text-[#e50914]" : "text-white"}>
                  {word}{" "}
                </span>
              ))}
              <span className="text-[#e50914] animate-pulse">_</span>
            </h1>
            <p className="text-xl text-gray-400 font-light max-w-lg leading-relaxed">
              Experience stories that stay with you. Join the community of enthusiasts worldwide.
            </p>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-neutral-800 flex items-center justify-center overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 italic font-medium">
              Join 5M+ subscribers today.
            </p>
          </div>
        </motion.div>

        {/* RIGHT SECTION - SIGNUP CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 w-full max-w-md mx-auto"
        >
          {/* Added max-h-[90vh] and overflow-y-auto to the card itself.
             This ensures that if the screen is very small, the form scrolls 
             WITHOUT making the whole background/page scroll.
          */}
          <div className="bg-[#141414]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-y-auto max-h-[90vh] no-scrollbar">
            
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e50914] to-transparent opacity-50" />

            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Get Started</h2>
              <p className="text-gray-500 mt-2 text-sm">Create an account to start your membership.</p>
            </div>

            <div className="space-y-4">
              {/* Username */}
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#e50914] transition-colors">
                  <User size={18} />
                </div>
                <input
                  name="name"
                  placeholder="Full Name"
                  autoComplete="off"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 focus:border-[#e50914]/50 focus:ring-4 focus:ring-[#e50914]/10 transition-all outline-none text-sm placeholder:text-gray-600"
                />
              </div>

              {/* Email */}
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#e50914] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  autoComplete="off"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 focus:border-[#e50914]/50 focus:ring-4 focus:ring-[#e50914]/10 transition-all outline-none text-sm placeholder:text-gray-600"
                />
              </div>

              {/* Password */}
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#e50914] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 focus:border-[#e50914]/50 focus:ring-4 focus:ring-[#e50914]/10 transition-all outline-none text-sm placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#e50914] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 focus:border-[#e50914]/50 focus:ring-4 focus:ring-[#e50914]/10 transition-all outline-none text-sm placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full group mt-4 relative overflow-hidden py-4 rounded-xl bg-[#e50914] hover:bg-[#ff0f1a] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-gray-500 text-sm">
                Already a member?{" "}
                <button
                  onClick={() => navigate("/signin")}
                  className="text-white font-semibold hover:text-[#e50914] transition-colors ml-1"
                >
                  Sign in now
                </button>
              </p>
            </div>
            
            <p className="text-[10px] text-gray-600 text-center mt-6 px-4 uppercase tracking-widest leading-relaxed">
              By clicking continue, you agree to our Terms.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;