import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

/* ================= API ================= */
const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
});

const sendSignupOtp = (data) => API.post("/signup/send-otp", data);

/* ================= COMPONENT ================= */
const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ================= TYPING EFFECT ================= */
  const fullText = "Unlimited movies, series and more.";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 45);
      return () => clearTimeout(timer);
    }
  }, [index]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await sendSignupOtp({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      navigate("/verify-otp", {
        state: {
          name: form.name,
          email: form.email,
          password: form.password,
        },
      });
    } catch (err) {
      alert(err?.response?.data?.message || "OTP service unavailable");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 bg-black text-white overflow-hidden">

      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e50914]/20 via-black to-black" />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT – HERO */}
        <div className="hidden md:block space-y-4">
          <h1 className="text-5xl font-extrabold leading-tight">
            {displayText.split(" ").map((word, i) => (
              <span
                key={i}
                className={
                  word === "Unlimited" || word === "more."
                    ? "text-[#e50914]"
                    : "text-white"
                }
              >
                {word}{" "}
              </span>
            ))}
            <span className="text-[#e50914] animate-pulse">|</span>
          </h1>

          <p className="text-gray-400 text-lg tracking-wide">
            Stream on your terms.
            <span className="block text-white font-semibold mt-1">
              No commitments. No limits.
            </span>
          </p>


          <div className="w-20 h-1 bg-[#e50914] rounded-full" />
        </div>

        {/* RIGHT – CARD */}
        <div className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-xl
                        border border-white/10 rounded-2xl
                        shadow-[0_20px_60px_rgba(0,0,0,0.8)]
                        p-8 space-y-6">

          <h2 className="text-3xl font-bold text-center">
            Create your <span className="text-[#e50914]">account</span>
          </h2>

          <div className="space-y-4">

            {/* Username */}
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="name"
                placeholder="Username"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-neutral-900/80
                           border border-neutral-800 focus:border-[#e50914]
                           focus:ring-1 focus:ring-[#e50914]/60 outline-none"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-neutral-900/80
                           border border-neutral-800 focus:border-[#e50914]
                           focus:ring-1 focus:ring-[#e50914]/60 outline-none"
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
                className="w-full pl-10 pr-11 py-3 rounded-lg bg-neutral-900/80
                           border border-neutral-800 focus:border-[#e50914]
                           focus:ring-1 focus:ring-[#e50914]/60 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-11 py-3 rounded-lg bg-neutral-900/80
                           border border-neutral-800 focus:border-[#e50914]
                           focus:ring-1 focus:ring-[#e50914]/60 outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Button */}
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full mt-2 py-3 rounded-lg bg-[#e50914]
                         hover:bg-red-700 font-semibold tracking-wide
                         transition disabled:opacity-70"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </div>

          <p className="text-gray-400 text-sm text-center">
            Already registered?{" "}
            <span
              onClick={() => navigate("/signin")}
              className="text-[#e50914] cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;