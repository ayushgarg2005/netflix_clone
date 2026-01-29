import { ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { PROFILE_MENU } from "./navbar.constants";

const ProfileDropdown = () => {
  const navigate = useNavigate();

  // Handle Logout Logic
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, {
        withCredentials: true // 👈 Critical for clearing cookies
      });
      
      toast.success("Logged out successfully");
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="group relative">
      {/* Trigger Area */}
      <div className="flex items-center gap-2.5 cursor-pointer py-1">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
          alt="avatar"
          className="w-8 h-8 rounded-lg border border-transparent group-hover:border-[#00ED64]/50 transition-all duration-300 object-cover"
        />
        <ChevronDown 
            size={14} 
            className="text-slate-400 group-hover:text-[#00ED64] transition-all duration-300 group-hover:rotate-180" 
        />
      </div>

      {/* Dropdown Menu */}
      <div className="absolute top-full right-0 w-60 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out transform origin-top-right z-50">
        <div className="bg-[#021019] border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/50">
          
          {/* Menu Items */}
          <div className="p-2 space-y-1">
            {PROFILE_MENU.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all group/item"
                >
                  <Icon 
                    size={16} 
                    className="text-slate-500 group-hover/item:text-[#00ED64] transition-colors" 
                  />
                  {item.text}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-700/50 mx-2" />

          {/* Sign Out Button (Updated) */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-4 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wider"
          >
            <LogOut size={14} className="text-slate-500" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;