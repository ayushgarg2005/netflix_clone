import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, ChevronRight, AlertCircle } from "lucide-react";

const Signin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    if (error) setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignin = async () => {
    if (!form.email || !form.password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/auth/login",
        form,
        { withCredentials: true }
      );
      // Redirect to home/browse
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-[#0a0a0a] text-white selection:bg-[#e50914] overflow-hidden font-sans">
      
      {/* 1. CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6366944-ed4d-4a1b-974a-14d23719058b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-center opacity-20 brightness-[0.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]/40" />
      </div>

      {/* 2. HEADER / LOGO */}
      <nav className="absolute top-0 left-0 w-full z-50 px-6 py-8 md:px-14">
        <h1 
          onClick={() => navigate("/")}
          className="text-2xl md:text-3xl font-black tracking-tighter text-[#e50914] cursor-pointer inline-block"
        >
          STREAMFLIX
        </h1>
      </nav>

      {/* 3. SIGNIN CONTAINER */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[460px]"
        >
          <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
            <div className="mb-10">
              <h2 className="text-3xl font-black tracking-tight mb-2">Sign In</h2>
              <p className="text-gray-500 text-sm">Welcome back! Please enter your details.</p>
            </div>

            <div className="space-y-5">
              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-xs font-bold"
                  >
                    <AlertCircle size={16} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Input */}
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#e50914] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#e50914]/50 focus:ring-4 focus:ring-[#e50914]/10 transition-all outline-none text-sm placeholder:text-gray-600"
                />
              </div>

              {/* Password Input */}
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
                  className="w-full pl-12 pr-12 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#e50914]/50 focus:ring-4 focus:ring-[#e50914]/10 transition-all outline-none text-sm placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button className="text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignin}
                disabled={loading}
                className="w-full relative group overflow-hidden py-4 rounded-xl bg-[#e50914] font-black text-white transition-all shadow-lg shadow-[#e50914]/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
                {/* Hover Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-gray-500 text-sm">
                New to Streamflix?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-white font-bold hover:text-[#e50914] transition-colors ml-1"
                >
                  Sign up now
                </button>
              </p>
            </div>

          </div>
          
          <p className="text-center mt-8 text-[10px] text-gray-600 uppercase tracking-widest leading-relaxed px-10">
            Secure login with SSL encryption. <br />
            &copy; {new Date().getFullYear()} Streamflix Inc.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signin;