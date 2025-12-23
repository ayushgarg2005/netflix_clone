// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Eye, EyeOff, Mail, Lock } from "lucide-react";

// /* ================= API ================= */
// const API = axios.create({
//   baseURL: "http://localhost:5000/api/auth",
//   withCredentials: true,
// });

// const signinUser = (data) => API.post("/login", data);

// /* ================= COMPONENT ================= */
// const Signin = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSignin = async () => {
//     if (!form.email || !form.password) {
//       alert("All fields are required");
//       return;
//     }

//     try {
//       setLoading(true);
//       await signinUser(form);
//       navigate("/browse");
//     } catch (err) {
//       alert(err?.response?.data?.message || "Signin failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen relative flex items-center justify-center px-4 bg-black text-white overflow-hidden">
      
//       {/* Background glow */}
//       <div className="absolute inset-0 bg-gradient-to-br from-[#e50914]/20 via-black to-black" />
//       <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

//       {/* Card */}
//       <div className="relative z-10 w-full max-w-md rounded-2xl
//                       bg-white/5 backdrop-blur-xl
//                       border border-white/10
//                       shadow-[0_20px_60px_rgba(0,0,0,0.8)]
//                       p-8 md:p-10 space-y-6">

//         {/* Header */}
//         <div className="text-center space-y-2">
//           <h1 className="text-3xl font-bold tracking-wide">
//             Sign in to <span className="text-[#e50914]">Netflix</span>
//           </h1>
//           <p className="text-gray-400 text-sm">
//             Welcome back. Let’s continue watching.
//           </p>
//         </div>

//         {/* Form */}
//         <div className="space-y-4">

//           {/* Email */}
//           <div className="relative">
//             <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               name="email"
//               type="email"
//               placeholder="Email"
//               value={form.email}
//               onChange={handleChange}
//               className="w-full pl-10 pr-4 py-3 rounded-lg
//                          bg-neutral-900/80 border border-neutral-800
//                          focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914]/60
//                          outline-none transition"
//             />
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               name="password"
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={form.password}
//               onChange={handleChange}
//               className="w-full pl-10 pr-11 py-3 rounded-lg
//                          bg-neutral-900/80 border border-neutral-800
//                          focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914]/60
//                          outline-none transition"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2
//                          text-gray-400 hover:text-white transition"
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>

//           {/* Button */}
//           <button
//             onClick={handleSignin}
//             disabled={loading}
//             className="w-full mt-2 py-3 rounded-lg
//                        bg-[#e50914] hover:bg-red-700
//                        font-semibold tracking-wide
//                        transition-all duration-200
//                        disabled:opacity-70"
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>
//         </div>

//         {/* Footer */}
//         <div className="text-center text-sm text-gray-400">
//           New to Netflix?{" "}
//           <span
//             onClick={() => navigate("/signup")}
//             className="text-[#e50914] cursor-pointer hover:underline"
//           >
//             Sign up now
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signin;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, ChevronRight } from "lucide-react";

const Signin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignin = async () => {
    if (!form.email || !form.password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      // await signinUser(form); // Your logic here
      navigate("/browse");
    } catch (err) {
      alert(err?.response?.data?.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black text-white selection:bg-[#e50914]">
      
      {/* CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-[#e50914]/20 via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-[#e50914]/10 via-transparent to-transparent opacity-40" />
      </div>

      {/* SIGNIN CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[450px] px-6"
      >
        <div className="bg-[#141414]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-10 md:p-14 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          
          {/* LOGO AREA (Optional) */}
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-[#e50914] tracking-tighter mb-2">
              STREAMFLIX
            </h1>
            <h2 className="text-2xl font-bold text-white tracking-tight">Sign In</h2>
          </div>

          <div className="space-y-6">
            {/* Email Field */}
            <div className="group relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#e50914] transition-colors duration-300">
                <Mail size={18} />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-neutral-900/50 border border-neutral-800 focus:border-[#e50914]/50 focus:ring-4 focus:ring-[#e50914]/10 outline-none transition-all duration-300 text-sm placeholder:text-gray-600"
              />
            </div>

            {/* Password Field */}
            <div className="group relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#e50914] transition-colors duration-300">
                <Lock size={18} />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-4 rounded-xl bg-neutral-900/50 border border-neutral-800 focus:border-[#e50914]/50 focus:ring-4 focus:ring-[#e50914]/10 outline-none transition-all duration-300 text-sm placeholder:text-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSignin}
              disabled={loading}
              className="w-full group relative overflow-hidden py-4 rounded-xl bg-[#e50914] hover:bg-[#ff0f1a] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50 mt-4 shadow-lg shadow-red-900/20"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>

            {/* Help Links */}
            <div className="flex items-center justify-between text-xs text-gray-500 mt-2 px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="accent-[#e50914] w-4 h-4 rounded" />
                <span className="group-hover:text-gray-300 transition-colors">Remember me</span>
              </label>
              <span className="hover:underline cursor-pointer">Need help?</span>
            </div>
          </div>

          {/* Footer Section */}
          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-gray-500 text-sm text-center lg:text-left">
              New to Streamflix?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-white font-semibold hover:underline decoration-[#e50914] underline-offset-4 decoration-2 transition-all"
              >
                Sign up now
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signin;