import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, User, ChevronRight, ShieldCheck, Monitor, Globe, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", { 
          credentials: "include" 
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/5 border-t-[#e50914] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white selection:bg-[#e50914]">
      <Navbar />

      <main className="max-w-4xl mx-auto pt-32 px-6 pb-20">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="space-y-10"
        >
          {/* HEADER */}
          <div className="border-b border-white/10 pb-6">
            <h1 className="text-3xl font-bold tracking-tight">Account</h1>
          </div>

          {/* SECTION 1: MEMBERSHIP & SECURITY */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-gray-500 uppercase text-xs font-black tracking-widest pt-1">
              Membership & Security
            </div>
            
            <div className="md:col-span-2 space-y-6">
              {/* Email Update */}
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <Mail className="text-gray-400 group-hover:text-white transition-colors" size={20} />
                  <div>
                    <p className="text-sm font-semibold">{user?.email}</p>
                    <p className="text-xs text-gray-500">Primary Account Email</p>
                  </div>
                </div>
                <button className="text-blue-500 text-xs font-bold hover:underline">Change email</button>
              </div>

              {/* Password Update */}
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <Lock className="text-gray-400 group-hover:text-white transition-colors" size={20} />
                  <div>
                    <p className="text-sm font-semibold">••••••••••••</p>
                    <p className="text-xs text-gray-500">Last changed recently</p>
                  </div>
                </div>
                <button className="text-blue-500 text-xs font-bold hover:underline">Change password</button>
              </div>

              {/* Name Update */}
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <User className="text-gray-400 group-hover:text-white transition-colors" size={20} />
                  <div>
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-500">Legal Name</p>
                  </div>
                </div>
                <button className="text-blue-500 text-xs font-bold hover:underline">Edit</button>
              </div>
            </div>
          </section>

          <hr className="border-white/10" />

          {/* SECTION 2: SETTINGS & PREFERENCES */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-gray-500 uppercase text-xs font-black tracking-widest pt-1">
              Settings
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="bg-white/5 rounded-lg overflow-hidden border border-white/5">
                {[
                  { icon: <ShieldCheck size={18} />, label: "Privacy & Data", desc: "Manage what you share with us" },
                  { icon: <Monitor size={18} />, label: "Playback Settings", desc: "Set default video quality and data usage" },
                  { icon: <Globe size={18} />, label: "Language", desc: "English (Primary)" }
                ].map((item, idx) => (
                  <button 
                    key={idx}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">{item.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-200">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-600" />
                  </button>
                ))}
              </div>
            </div>
          </section>

          <hr className="border-white/10" />

          {/* SECTION 3: DANGER ZONE */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-gray-500 uppercase text-xs font-black tracking-widest pt-1">
              Account Control
            </div>
            <div className="md:col-span-2">
              <button className="flex items-center gap-2 text-red-500/80 hover:text-red-500 transition-colors text-sm font-bold group">
                <Trash2 size={18} />
                <span className="group-hover:underline">Delete account permanently</span>
              </button>
              <p className="text-[11px] text-gray-600 mt-2 max-w-sm leading-relaxed">
                Deleting your account will remove all your data, including your watch history ({user?.watchHistory?.length} titles) and liked videos ({user?.likedVideos?.length} titles).
              </p>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default Account;