import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Calendar, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Using axios for consistency if you prefer, or keeping fetch
        const res = await axios.get("http://localhost:5000/api/auth/me", { 
          withCredentials: true 
        });
        setUser(res.data.user || res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
        // Optional: Redirect if unauthorized
        // navigate("/signin");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  // 2. Handle Logout Logic
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, {
        withCredentials: true
      });
      toast.success("Logged out successfully");
      navigate("/"); // Redirect to Home or Sign In
    } catch (err) {
      console.error("Logout failed", err);
      toast.error("Failed to log out");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001E2B] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#00ED64]/20 border-t-[#00ED64] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#001E2B] text-slate-100 font-sans">
      <Navbar />

      <main className="max-w-2xl mx-auto pt-32 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#021019] border border-slate-800 rounded-3xl p-8 shadow-xl"
        >
          {/* HEADER: AVATAR & NAME */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 bg-[#00ED64] rounded-full flex items-center justify-center text-[#001E2B] text-4xl font-bold mb-4 shadow-[0_0_20px_rgba(0,237,100,0.2)]">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
            <p className="text-[#00ED64] text-xs font-bold uppercase tracking-widest mt-1">
              {user?.role || "Member"}
            </p>
          </div>

          {/* USER DETAILS LIST */}
          <div className="space-y-1">
            <InfoRow 
              icon={<Mail size={18} />} 
              label="Email Address" 
              value={user?.email} 
            />
            <InfoRow 
              icon={<Calendar size={18} />} 
              label="Account Created" 
              value={new Date(user?.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} 
            />
            <InfoRow 
              icon={<Shield size={18} />} 
              label="Account Status" 
              value="Verified" 
              isVerified 
            />
          </div>

          {/* ACTIONS */}
          <div className="mt-10 pt-8 border-t border-slate-800 flex justify-center">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors text-sm font-bold uppercase tracking-wider"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

/* Helper Component */
const InfoRow = ({ icon, label, value, isVerified }) => (
  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.02] transition-colors">
    <div className="flex items-center gap-4">
      <div className="text-slate-500">{icon}</div>
      <div>
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{label}</p>
        <p className="text-base text-slate-200">{value}</p>
      </div>
    </div>
    {isVerified && (
      <span className="bg-[#00ED64]/10 text-[#00ED64] text-[10px] px-2 py-0.5 rounded font-bold uppercase border border-[#00ED64]/20">
        Active
      </span>
    )}
  </div>
);

export default Profile;