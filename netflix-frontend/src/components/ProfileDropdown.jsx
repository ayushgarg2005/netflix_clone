import { ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PROFILE_MENU } from "./navbar.constants";

const ProfileDropdown = () => {
  const navigate = useNavigate();

  return (
    <div className="group relative">
      <div className="flex items-center gap-2 cursor-pointer">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
          alt="avatar"
          className="w-8 h-8 rounded-md"
        />
        <ChevronDown size={14} />
      </div>

      <div className="absolute top-full right-0 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <div className="bg-[#141414] rounded-lg overflow-hidden">
          <div className="p-2">
            {PROFILE_MENU.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-white/10"
                >
                  <Icon size={16} />
                  {item.text}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => navigate("/login")}
            className="w-full py-4 bg-white/5 text-xs font-bold text-white hover:bg-[#e50914]"
          >
            <LogOut size={14} className="inline mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
