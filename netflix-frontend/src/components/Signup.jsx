import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Clear error when user types
  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    // 1. Validation Checks
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    
    // Simple email regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
        setError("Please enter a valid email address.");
        return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      // Simulate API Call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // await axios.post("YOUR_API/send-otp", form);
      navigate("/verify-otp", { state: form });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <div className="h-screen w-full relative bg-[#001E2B] text-slate-100 font-sans selection:bg-[#00ED64] selection:text-[#001E2B] overflow-hidden flex flex-col">
      
      {/* 1. TECHNICAL BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#00ED64] opacity-[0.06] blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#001E2B] border border-[#00ED64]/20 opacity-40 blur-[80px]" />
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
          <span className="hidden md:block text-xs font-medium text-slate-400">Already a member?</span>
          <button 
            onClick={() => navigate("/signin")}
            className="text-xs font-bold bg-[#001E2B] border border-[#00ED64]/30 text-[#00ED64] px-4 py-2 rounded-md hover:bg-[#00ED64] hover:text-[#001E2B] transition-all"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* 3. MAIN CONTENT - Centered & Compact */}
      <div className="relative z-10 flex-grow flex items-center justify-center p-4 lg:p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          
          {/* LEFT SECTION: Tech Marketing */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block space-y-6"
          >
            <h2 className="text-5xl font-bold leading-[1.1] tracking-tight text-white">
              Scale your <br />
              <span className="text-[#00ED64]">viewing potential.</span>
            </h2>
            
            <p className="text-base text-slate-300 max-w-md leading-relaxed">
              Enterprise-grade streaming infrastructure for everyone. High availability, low latency, and zero compromises.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "End-to-end encryption",
                "Sub-second latency architecture",
                "Cross-platform synchronization",
                "99.99% Uptime SLA"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 size={18} className="text-[#00ED64]" />
                  <span className="font-medium tracking-wide">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SECTION: Compact Form */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[420px] mx-auto lg:ml-auto"
          >
            <div className="bg-[#021019]/90 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
              
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Create Account</h3>
                <p className="text-slate-400 text-xs">Start your free 14-day trial.</p>
              </div>

              {/* Error Banner */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="bg-red-500/10 border border-red-500/50 rounded-lg px-3 py-2 flex items-center gap-2"
                  >
                    <AlertCircle size={14} className="text-red-400 shrink-0" />
                    <p className="text-xs text-red-200 font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                {/* Name & Email Grouped */}
                <div className="space-y-3">
                    {[
                      { name: "name", label: "Full Name", type: "text" },
                      { name: "email", label: "Email Address", type: "email" },
                    ].map((field) => (
                      <motion.div variants={itemVariants} key={field.name} className="group">
                        <input
                            name={field.name}
                            type={field.type}
                            placeholder={field.label}
                            value={form[field.name]}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg bg-[#001E2B] border ${error && !form[field.name] ? 'border-red-500/50 focus:border-red-500' : 'border-slate-600 focus:border-[#00ED64]'} text-white focus:ring-1 focus:ring-[#00ED64] transition-all outline-none text-sm placeholder:text-slate-500`}
                        />
                      </motion.div>
                    ))}
                </div>

                {/* Password Fields Grouped */}
                <div className="space-y-3">
                    {[
                      { name: "password", label: "Password", show: showPassword, setter: setShowPassword },
                      { name: "confirmPassword", label: "Confirm Password", show: showConfirmPassword, setter: setShowConfirmPassword },
                    ].map((field) => (
                      <motion.div variants={itemVariants} key={field.name} className="relative">
                        <input
                            name={field.name}
                            type={field.show ? "text" : "password"}
                            placeholder={field.label}
                            value={form[field.name]}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg bg-[#001E2B] border ${error && (!form[field.name] || (field.name === 'confirmPassword' && form.password !== form.confirmPassword)) ? 'border-red-500/50 focus:border-red-500' : 'border-slate-600 focus:border-[#00ED64]'} text-white focus:ring-1 focus:ring-[#00ED64] transition-all outline-none text-sm placeholder:text-slate-500 pr-10`}
                        />
                        <button
                            type="button"
                            onClick={() => field.setter(!field.show)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </motion.div>
                    ))}
                </div>

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="pt-2">
                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#00ED64] hover:bg-[#00c052] disabled:bg-[#00ed64]/50 disabled:cursor-not-allowed text-[#001E2B] font-bold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(0,237,100,0.1)] hover:shadow-[0_0_20px_rgba(0,237,100,0.25)] active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-[#001E2B]/30 border-t-[#001E2B] rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </motion.div>

                {/* Terms Footer */}
                <motion.p variants={itemVariants} className="text-[10px] text-slate-500 text-center leading-relaxed px-4 pt-2">
                  By joining, you agree to our <span className="text-slate-400 hover:text-[#00ED64] cursor-pointer underline">Terms</span> and <span className="text-slate-400 hover:text-[#00ED64] cursor-pointer underline">Privacy Policy</span>.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;