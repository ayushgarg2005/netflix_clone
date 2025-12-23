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
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignin = async () => {
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/auth/login",
        form,
        { withCredentials: true } // 🔥 REQUIRED
      );

      // ✅ Login success → now navigate
      navigate("/browse", { replace: true });

    } catch (err) {
      // ✅ Express-validator & auth errors
      setError(
        err?.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black text-white">
      <motion.div className="w-full max-w-[450px] px-6">
        <div className="bg-[#141414]/80 rounded-3xl p-10 shadow-xl">

          <h2 className="text-3xl font-bold mb-6">Sign In</h2>

          <div className="space-y-6">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-12 py-4 bg-neutral-900 rounded-xl"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-4 bg-neutral-900 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* ❌ Error Message */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Button */}
            <button
              onClick={handleSignin}
              disabled={loading}
              className="w-full py-4 bg-[#e50914] rounded-xl font-bold"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <p className="text-gray-500 mt-8 text-sm">
            New to Streamflix?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-white underline"
            >
              Sign up now
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signin;