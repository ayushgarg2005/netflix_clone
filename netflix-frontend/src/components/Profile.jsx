import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, History, Heart, Calendar, Edit2, CheckCircle, Activity } from "lucide-react";
import Navbar from "../components/Navbar";

const Profile = () => {
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
      <div className="min-h-screen bg-[#001E2B] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#001E2B] border-t-[#00ED64] rounded-full animate-spin shadow-[0_0_20px_rgba(0,237,100,0.2)]" />
      </div>
    );
  }

  // Fallback for avatar
  const profileImage = user?.avatar || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png";

  return (
    <div className="min-h-screen bg-[#001E2B] text-slate-100 font-sans selection:bg-[#00ED64] selection:text-[#001E2B]">
      <Navbar />

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00ED64]/5 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto pt-32 px-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          {/* 1. IDENTITY HEADER */}
          <section className="flex flex-col md:flex-row items-center gap-8 border-b border-slate-700/50 pb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#00ED64] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
              <img 
                src={profileImage} 
                alt={user?.name} 
                className="relative w-32 h-32 rounded-full object-cover border-4 border-[#001E2B] ring-2 ring-[#00ED64]/50 shadow-2xl"
              />
              {user?.role === "admin" && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#00ED64] text-[#001E2B] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg border border-[#001E2B]">
                  Admin
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">{user?.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-400 font-medium">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-[#00ED64]" />
                  {user?.email}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-[#00ED64]" />
                  Member since {new Date(user?.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </section>

          {/* 2. ACTIVITY STATS (Tech Cards) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#021019] border border-slate-700/50 p-8 rounded-2xl flex items-center justify-between group hover:border-[#00ED64]/50 transition-all shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#00ED64] mb-1">
                    <Activity size={16} />
                    <p className="text-xs font-bold uppercase tracking-widest">Watch History</p>
                </div>
                <p className="text-4xl font-bold text-white">{user?.watchHistory?.length || 0}</p>
                <p className="text-sm text-slate-500">Total videos engaged</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-full group-hover:bg-[#00ED64]/10 transition-colors">
                  <History size={32} className="text-slate-400 group-hover:text-[#00ED64] transition-colors" />
              </div>
            </div>

            <div className="bg-[#021019] border border-slate-700/50 p-8 rounded-2xl flex items-center justify-between group hover:border-[#00ED64]/50 transition-all shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#00ED64] mb-1">
                    <Heart size={16} />
                    <p className="text-xs font-bold uppercase tracking-widest">Favorites</p>
                </div>
                <p className="text-4xl font-bold text-white">{user?.likedVideos?.length || 0}</p>
                <p className="text-sm text-slate-500">Saved to library</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-full group-hover:bg-[#00ED64]/10 transition-colors">
                  <Heart size={32} className="text-slate-400 group-hover:text-[#00ED64] transition-colors" />
              </div>
            </div>
          </section>

          {/* 3. CORE ACCOUNT DATA TABLE */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-[#00ED64] uppercase tracking-widest px-1">Account Specifications</h2>
            <div className="bg-[#021019] border border-slate-700/50 rounded-2xl overflow-hidden divide-y divide-slate-700/50">
              
              {/* Display Name Row */}
              <div className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-5">
                  <div className="p-2 bg-slate-800 rounded-lg text-slate-300">
                      <User size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Display Name</p>
                    <p className="text-base font-medium text-white">{user?.name}</p>
                  </div>
                </div>
                <button className="text-xs flex items-center gap-1 text-slate-400 hover:text-[#00ED64] font-bold uppercase tracking-wider transition-colors">
                    <Edit2 size={12} /> Edit
                </button>
              </div>

              {/* Email Row */}
              <div className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-5">
                  <div className="p-2 bg-slate-800 rounded-lg text-slate-300">
                      <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Email Address</p>
                    <p className="text-base font-medium text-white">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#00ED64]/10 border border-[#00ED64]/20 text-[#00ED64] text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle size={12} /> Verified
                </div>
              </div>

              {/* Role Row */}
              <div className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-5">
                  <div className="p-2 bg-slate-800 rounded-lg text-slate-300">
                      <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Access Level</p>
                    <p className="text-base font-medium text-white capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* FOOTER DATA */}
          <div className="flex justify-center pt-8 border-t border-slate-800">
            <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em]">
              System Last Sync: {new Date(user?.updatedAt).toLocaleString()}
            </p>
          </div>

        </motion.div>
      </main>
    </div>
  );
};

export default Profile;