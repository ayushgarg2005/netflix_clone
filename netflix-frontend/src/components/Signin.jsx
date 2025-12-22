import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

/* ================= API ================= */
const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
});

const signinUser = (data) => API.post("/login", data);

/* ================= COMPONENT ================= */
const Signin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignin = async () => {
    if (!form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await signinUser(form);
      navigate("/browse");
    } catch (err) {
      alert(err?.response?.data?.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 bg-black text-white overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e50914]/20 via-black to-black" />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl
                      bg-white/5 backdrop-blur-xl
                      border border-white/10
                      shadow-[0_20px_60px_rgba(0,0,0,0.8)]
                      p-8 md:p-10 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-wide">
            Sign in to <span className="text-[#e50914]">Netflix</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Welcome back. Let’s continue watching.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">

          {/* Email */}
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg
                         bg-neutral-900/80 border border-neutral-800
                         focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914]/60
                         outline-none transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-11 py-3 rounded-lg
                         bg-neutral-900/80 border border-neutral-800
                         focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914]/60
                         outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         text-gray-400 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Button */}
          <button
            onClick={handleSignin}
            disabled={loading}
            className="w-full mt-2 py-3 rounded-lg
                       bg-[#e50914] hover:bg-red-700
                       font-semibold tracking-wide
                       transition-all duration-200
                       disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400">
          New to Netflix?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#e50914] cursor-pointer hover:underline"
          >
            Sign up now
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signin;