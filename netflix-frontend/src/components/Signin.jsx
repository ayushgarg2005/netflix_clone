import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

const Signin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    if (error) setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignin = async () => {
  // 1. Client-side validation
  if (!form.email || !form.password) {
    setError("Please enter your email and password.");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(form.email)) {
    setError("Please enter a valid email address.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email: form.email,
        password: form.password,
      },
      {
        withCredentials: true, // IMPORTANT for cookies
      }
    );

    console.log(res);
    // ✅ Navigate ONLY on successful login
    if (res.status===200) {
      navigate("/browse", { replace: true });
    }

  } catch (err) {
    // ❌ Backend error handling
    if (err.response) {
      setError(err.response.data.message);
    } else {
      setError("Unable to connect to server. Try again later.");
    }
  } finally {
    setLoading(false);
  }
};


  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <div className="h-screen w-full relative bg-[#001E2B] text-slate-100 font-sans selection:bg-[#00ED64] selection:text-[#001E2B] overflow-hidden flex flex-col">
      
      {/* 1. TECHNICAL BACKGROUND (Consistent with Signup) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#00ED64] opacity-[0.05] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#001E2B] border border-[#00ED64]/20 opacity-40 blur-[80px]" />
      </div>

      {/* 2. HEADER - Fixed Height */}
      <nav className="relative z-50 h-16 px-6 md:px-12 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
          <div className="w-8 h-8 bg-[#00ED64] rounded-lg flex items-center justify-center text-[#001E2B] font-bold shadow-[0_0_15px_rgba(0,237,100,0.3)] transition-shadow group-hover:shadow-[0_0_20px_rgba(0,237,100,0.5)]">
            S
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-[#00ED64] transition-colors">
            Streamflix
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-xs font-medium text-slate-400">New here?</span>
          <button 
            onClick={() => navigate("/signup")}
            className="text-xs font-bold bg-[#001E2B] border border-[#00ED64]/30 text-[#00ED64] px-4 py-2 rounded-md hover:bg-[#00ED64] hover:text-[#001E2B] transition-all"
          >
            Create Account
          </button>
        </div>
      </nav>

      {/* 3. MAIN CONTENT - Centered & Compact */}
      <div className="relative z-10 flex-grow flex items-center justify-center p-4 lg:p-6">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* LEFT SECTION: Contextual Marketing */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ED64]/10 border border-[#00ED64]/20 text-[#00ED64] text-xs font-bold uppercase tracking-wide">
              <Sparkles size={12} />
              <span>What's New</span>
            </div>
            
            <h2 className="text-5xl font-bold leading-[1.1] tracking-tight text-white">
              Welcome back to <br />
              <span className="text-[#00ED64]">the control plane.</span>
            </h2>
            
            <p className="text-base text-slate-300 max-w-md leading-relaxed">
              Resume where you left off. Access your dashboard, manage your streams, and monitor analytics in real-time.
            </p>

            <div className="space-y-3 pt-4 border-t border-white/5">
              {[
                "Instant resume capability",
                "Personalized recommendations engine",
                "Developer API key management"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 size={18} className="text-[#00ED64]" />
                  <span className="font-medium tracking-wide">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SECTION: Login Form */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[400px] mx-auto lg:ml-auto"
          >
            <div className="bg-[#021019]/90 backdrop-blur-xl border border-slate-700/50 rounded-xl p-8 shadow-2xl relative overflow-hidden">
              
              {/* Form Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-1">Log In</h3>
                <p className="text-slate-400 text-xs">Enter your credentials to access your account.</p>
              </div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="bg-red-500/10 border border-red-500/50 rounded-lg px-3 py-2.5 flex items-start gap-3 overflow-hidden"
                  >
                    <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-200 font-medium leading-relaxed">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-5">
                {/* Email */}
                <motion.div variants={itemVariants} className="group">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg bg-[#001E2B] border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-600 focus:border-[#00ED64]'} text-white focus:ring-1 focus:ring-[#00ED64] transition-all outline-none text-sm placeholder:text-slate-500`}
                    />
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#00ED64] transition-colors" />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div variants={itemVariants} className="group">
                   <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                        Password
                    </label>
                    <button className="text-[10px] text-[#00ED64] hover:underline font-medium">
                        Forgot Password?
                    </button>
                   </div>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3 rounded-lg bg-[#001E2B] border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-600 focus:border-[#00ED64]'} text-white focus:ring-1 focus:ring-[#00ED64] transition-all outline-none text-sm placeholder:text-slate-500`}
                    />
                     <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#00ED64] transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="pt-2">
                  <button
                    onClick={handleSignin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#00ED64] hover:bg-[#00c052] disabled:bg-[#00ed64]/50 disabled:cursor-not-allowed text-[#001E2B] font-bold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(0,237,100,0.1)] hover:shadow-[0_0_20px_rgba(0,237,100,0.25)] active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-[#001E2B]/30 border-t-[#001E2B] rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Log In</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </motion.div>

                <motion.p variants={itemVariants} className="text-center text-xs text-slate-500">
                    Don't have an account yet?{" "}
                    <button onClick={() => navigate("/signup")} className="text-[#00ED64] hover:underline font-medium">Sign up</button>
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signin;