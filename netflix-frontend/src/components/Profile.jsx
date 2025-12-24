import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, History, Heart, Calendar } from "lucide-react";
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
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-[#e50914] rounded-full animate-spin" />
      </div>
    );
  }

  // Fallback for avatar from schema
  const profileImage = user?.avatar || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png";

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto pt-32 px-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* 1. IDENTITY HEADER */}
          <section className="flex flex-col md:flex-row items-center gap-8 border-b border-white/10 pb-10">
            <div className="relative">
              <img 
                src={profileImage} 
                alt={user?.name} 
                className="w-32 h-32 rounded-lg object-cover ring-4 ring-white/5 shadow-2xl"
              />
              {user?.role === "admin" && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#e50914] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                  Admin
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">{user?.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-4 text-gray-400">
                <div className="flex items-center gap-1.5 text-sm">
                  <Mail size={16} />
                  {user?.email}
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar size={16} />
                  Joined {new Date(user?.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </section>

          {/* 2. ACTIVITY STATS (From Schema Arrays) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
              <div className="space-y-1">
                <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">Watch History</p>
                <p className="text-3xl font-bold">{user?.watchHistory?.length || 0}</p>
                <p className="text-sm text-gray-400">Videos partially or fully watched</p>
              </div>
              <History size={48} className="text-white/10 group-hover:text-[#e50914] transition-colors" />
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
              <div className="space-y-1">
                <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">Liked Videos</p>
                <p className="text-3xl font-bold">{user?.likedVideos?.length || 0}</p>
                <p className="text-sm text-gray-400">Titles saved to your favorites</p>
              </div>
              <Heart size={48} className="text-white/10 group-hover:text-[#e50914] transition-colors" />
            </div>
          </section>

          {/* 3. CORE ACCOUNT DATA */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-gray-400 uppercase tracking-widest px-2">Account Details</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl divide-y divide-white/10">
              
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <User className="text-[#e50914]" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-black">Display Name</p>
                    <p className="text-base font-medium">{user?.name}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-600 font-bold uppercase cursor-pointer hover:text-white transition">Edit</span>
              </div>

              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Mail className="text-[#e50914]" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-black">Email Address</p>
                    <p className="text-base font-medium">{user?.email}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-[#46d369]/20 text-[#46d369] px-2 py-1 rounded font-black uppercase tracking-tighter">Verified</span>
              </div>

              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Shield className="text-[#e50914]" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-black">Access Level</p>
                    <p className="text-base font-medium capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* FOOTER DATA */}
          <p className="text-center text-[10px] text-gray-600 uppercase tracking-[0.3em]">
            Last Updated: {new Date(user?.updatedAt).toLocaleString()}
          </p>

        </motion.div>
      </main>
    </div>
  );
};

export default Profile;