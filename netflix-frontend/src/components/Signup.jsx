import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ChevronRight, Play } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async () => {
    if (!form.name || !form.email || !form.password) return;
    if (form.password !== form.confirmPassword) return;

    try {
      setLoading(true);
      // await axios.post("YOUR_API/send-otp", form);
      navigate("/verify-otp", { state: form });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen w-full relative bg-[#0a0a0a] text-white selection:bg-[#e50914] selection:text-white overflow-hidden font-sans">
      
      {/* 1. CINEMATIC BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6366944-ed4d-4a1b-974a-14d23719058b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-center opacity-30 brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]/40" />
      </div>

      {/* 2. TOP HEADER */}
      <nav className="absolute top-0 left-0 w-full z-50 px-6 py-8 md:px-14 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-[#e50914] cursor-pointer">
          STREAMFLIX
        </h1>
        <button 
          onClick={() => navigate("/signin")}
          className="text-sm font-bold bg-[#e50914] px-5 py-2 rounded hover:bg-[#b90912] transition-colors"
        >
          Sign In
        </button>
      </nav>

      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT SECTION: BRANDING */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Live & Exclusive Content</span>
            </div>

            <h2 className="text-6xl xl:text-7xl font-black leading-[1.05] tracking-tighter">
              Unlimited <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#ff4d4d]">Entertainment</span>.
            </h2>
            
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed font-medium">
              Join the future of streaming. One subscription for all your devices. Cancel anytime.
            </p>

            <div className="flex items-center gap-8 pt-6">
               <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">5M+</span>
                  <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Active Users</span>
               </div>
               <div className="w-px h-10 bg-white/10" />
               <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">4K</span>
                  <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Ultra HD</span>
               </div>
            </div>
          </motion.div>

          {/* RIGHT SECTION: SIGNUP CARD */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              
              <motion.div variants={itemVariants} className="mb-10 text-center lg:text-left">
                <h3 className="text-3xl font-black tracking-tight mb-2">Create Account</h3>
                <p className="text-gray-500 text-sm">Join Streamflix today and start watching.</p>
              </motion.div>

              <div className="space-y-5">
                {/* Inputs */}
                {[
                  { name: "name", label: "Full Name", icon: <User size={18} />, type: "text" },
                  { name: "email", label: "Email Address", icon: <Mail size={18} />, type: "email" },
                ].map((field) => (
                  <motion.div variants={itemVariants} key={field.name} className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#e50914] transition-colors">
                      {field.icon}
                    </div>
                    <input
                      name={field.name}
                      type={field.type}
                      placeholder={field.label}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#e50914]/50 focus:ring-4 focus:ring-[#e50914]/10 transition-all outline-none text-sm placeholder:text-gray-600"
                    />
                  </motion.div>
                ))}

                {/* Password Fields */}
                {[
                  { name: "password", label: "Password", show: showPassword, setter: setShowPassword },
                  { name: "confirmPassword", label: "Confirm Password", show: showConfirmPassword, setter: setShowConfirmPassword },
                ].map((field) => (
                  <motion.div variants={itemVariants} key={field.name} className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#e50914] transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      name={field.name}
                      type={field.show ? "text" : "password"}
                      placeholder={field.label}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#e50914]/50 focus:ring-4 focus:ring-[#e50914]/10 transition-all outline-none text-sm placeholder:text-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => field.setter(!field.show)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {field.show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </motion.div>
                ))}

                <motion.button
                  variants={itemVariants}
                  onClick={handleSendOtp}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative group overflow-hidden py-4 rounded-xl bg-[#e50914] font-black text-white transition-all shadow-lg shadow-[#e50914]/20"
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Get Started</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                  {/* Hover Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.button>
              </div>

              <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <button 
                  onClick={() => navigate("/signin")}
                  className="text-white font-bold hover:text-[#e50914] transition-colors"
                >
                  Sign In
                </button>
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;