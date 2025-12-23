import React, { useState, useEffect } from "react";
import { Search, Bell, User, LogOut, Settings, HelpCircle, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${isScrolled ? "bg-[#141414] shadow-2xl py-2" : "bg-gradient-to-b from-black/80 to-transparent py-4"}`}
    >
      <div className="max-w-[1920px] mx-auto flex items-center justify-between px-6 md:px-14">
        
        {/* LEFT: LOGO & NAV */}
        <div className="flex items-center gap-10">
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-[#e50914] cursor-pointer hover:opacity-80 transition-opacity">
            STREAMFLIX
          </h1>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link}
                className="text-[13px] font-medium text-gray-200 hover:text-white transition-colors duration-300 relative group"
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#e50914] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>
        </div>

        {/* RIGHT: SEARCH, NOTIFS, PROFILE */}
        <div className="flex items-center gap-6">
          
          {/* REFINED EXPANDABLE SEARCH */}
          <div className={`flex items-center transition-all duration-500 overflow-hidden rounded-md ${searchOpen ? 'w-48 md:w-64 bg-black/40 border border-white/20 px-3 py-1.5' : 'w-10'}`}>
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="text-white hover:text-gray-400 transition-colors"
            >
              <Search size={20} strokeWidth={2} />
            </button>
            <input 
              type="text" 
              placeholder="Titles, people, genres" 
              autoFocus={searchOpen}
              className={`bg-transparent border-none outline-none text-xs ml-3 w-full text-white placeholder:text-gray-500 transition-opacity duration-300 ${searchOpen ? 'opacity-100' : 'opacity-0'}`}
            />
            {searchOpen && <X size={14} className="cursor-pointer text-gray-500" onClick={() => setSearchOpen(false)} />}
          </div>

          {/* NOTIFICATIONS */}
          <button className="text-white hover:text-gray-400 transition-colors relative">
            <Bell size={20} strokeWidth={2} />
            <span className="absolute -top-1.5 -right-1.5 bg-[#e50914] text-[9px] font-black px-1.5 rounded-full ring-2 ring-black">
              3
            </span>
          </button>

          {/* PROFILE SECTION */}
          <div className="group relative">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-blue-600 to-indigo-700 p-[1px] shadow-lg group-hover:ring-2 group-hover:ring-white transition-all">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
                  alt="Avatar" 
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
              <div className="hidden md:block w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-gray-400 group-hover:border-t-white transition-all group-hover:rotate-180" />
            </div>
            
            {/* CLEANER DROPDOWN */}
            <div className="absolute top-full right-0 w-60 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <div className="bg-[#141414]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg overflow-hidden">
                <div className="p-3 border-b border-white/5 bg-white/5">
                   <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Active Profile</p>
                   <p className="text-sm font-bold text-white mt-1">John Doe</p>
                </div>
                
                <div className="p-2">
                  {[
                    { icon: <Settings size={16} />, text: "Account Settings" },
                    { icon: <HelpCircle size={16} />, text: "Help Center" }
                  ].map((item, i) => (
                    <button key={i} className="w-full flex items-center gap-3 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white rounded-md transition-all">
                      {item.icon} {item.text}
                    </button>
                  ))}
                </div>
                
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#e50914] text-white text-[11px] font-black uppercase tracking-tighter hover:bg-red-700 transition-colors">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;