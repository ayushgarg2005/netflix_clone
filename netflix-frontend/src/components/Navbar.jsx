import React, { useState, useEffect } from "react";
import { Search, Bell, User, LogOut, Settings, HelpCircle, X, Menu, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Home", "TV Shows", "Movies", "New & Popular", "My List"];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-in-out
        ${isScrolled ? "bg-[#141414]/95 backdrop-blur-md shadow-2xl py-3" : "bg-gradient-to-b from-black/90 via-black/40 to-transparent py-5"}`}
    >
      <div className="max-w-[1920px] mx-auto flex items-center justify-between px-6 md:px-12 lg:px-16">
        
        {/* LEFT: LOGO & NAVIGATION */}
        <div className="flex items-center gap-4 lg:gap-12">
          {/* BRAND LOGO */}
          <motion.h1 
            whileHover={{ scale: 1.02 }}
            className="text-2xl md:text-3xl font-black tracking-tighter text-[#e50914] cursor-pointer select-none"
          >
            STREAMFLIX
          </motion.h1>

          {/* DESKTOP LINKS */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link}
                className="text-[13px] font-medium text-gray-300 hover:text-white transition-colors duration-300 relative group"
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#e50914] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* MOBILE MENU TRIGGER */}
          <button 
            className="lg:hidden flex items-center gap-1 text-white text-xs font-bold"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            Browse <ChevronDown size={14} className={mobileMenuOpen ? "rotate-180 transition-transform" : "transition-transform"} />
          </button>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-3 md:gap-6">
          
          {/* SEARCH BAR */}
          <motion.div 
            animate={{ width: searchOpen ? (window.innerWidth > 768 ? 280 : 180) : 35 }}
            className={`flex items-center h-9 overflow-hidden rounded-full border transition-colors duration-300 ${
              searchOpen ? 'bg-black/60 border-white/30 px-3' : 'bg-transparent border-transparent'
            }`}
          >
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="text-white hover:text-gray-300 transition-colors shrink-0"
            >
              <Search size={18} strokeWidth={2.5} />
            </button>
            <input 
              type="text" 
              placeholder="Titles, people, genres" 
              className={`bg-transparent border-none outline-none text-xs ml-3 w-full text-white placeholder:text-gray-500 transition-opacity duration-300 ${searchOpen ? 'opacity-100' : 'opacity-0'}`}
            />
            {searchOpen && (
              <X 
                size={14} 
                className="cursor-pointer text-gray-400 hover:text-white transition-colors" 
                onClick={() => setSearchOpen(false)} 
              />
            )}
          </motion.div>

          {/* NOTIFICATIONS */}
          <button className="text-white hover:text-gray-300 transition-all relative p-1">
            <Bell size={20} strokeWidth={2} />
            <span className="absolute top-0 right-0 bg-[#e50914] text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-[#141414]">
              3
            </span>
          </button>

          {/* PROFILE DROPDOWN */}
          <div className="group relative">
            <div className="flex items-center gap-2 cursor-pointer py-2">
              <div className="w-8 h-8 rounded-md overflow-hidden ring-1 ring-white/20 group-hover:ring-white transition-all">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
                  alt="User" 
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown size={14} className="text-gray-400 group-hover:text-white transition-all group-hover:rotate-180" />
            </div>
            
            {/* DROPDOWN MENU */}
            <AnimatePresence>
              <div className="absolute top-full right-0 w-64 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="bg-[#141414] border border-white/10 shadow-2xl rounded-lg overflow-hidden backdrop-blur-xl">
                  {/* Top Pointer */}
                  <div className="absolute -top-1 right-10 w-3 h-3 bg-[#141414] border-l border-t border-white/10 rotate-45" />
                  
                  <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
                     <div className="w-10 h-10 rounded-md overflow-hidden">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Avatar" />
                     </div>
                     <div>
                       <p className="text-sm font-bold text-white">John Doe</p>
                       <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Premium Member</p>
                     </div>
                  </div>
                  
                  <div className="p-2">
                    {[
                      { icon: <User size={16} />, text: "Profile" },
                      { icon: <Settings size={16} />, text: "Account" },
                      { icon: <HelpCircle size={16} />, text: "Help Center" }
                    ].map((item, i) => (
                      <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] text-gray-300 hover:bg-white/10 hover:text-white rounded-md transition-all">
                        {item.icon} {item.text}
                      </button>
                    ))}
                  </div>
                  
                  <button className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#e50914] transition-all duration-300">
                    <LogOut size={14} /> Sign Out of Streamflix
                  </button>
                </div>
              </div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* MOBILE NAV OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-[#141414] border-t border-white/10 py-6 px-10 lg:hidden shadow-3xl"
          >
            <div className="grid grid-cols-2 gap-y-4">
              {navLinks.map((link) => (
                <button key={link} className="text-sm font-medium text-gray-300 hover:text-white text-left">
                  {link}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;