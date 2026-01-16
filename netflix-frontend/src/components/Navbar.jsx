import { useState } from "react";
import { ChevronDown } from "lucide-react";

import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import SearchBar from "./SearchBar";
// import NotificationBell from "./NotificationBell";
import ProfileDropdown from "./ProfileDropdown";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#001E2B] border-b border-white/5 py-4 shadow-lg shadow-black/20">
      <div className="container mx-auto flex justify-between items-center px-6 md:px-12">
        
        {/* LEFT: Logo & Navigation */}
        <div className="flex items-center gap-10">
          <Logo />
          <DesktopNav />

          {/* Mobile "Browse" Trigger */}
          <button
            className="lg:hidden text-slate-300 hover:text-[#00ED64] flex items-center gap-1.5 transition-colors font-semibold text-sm"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span>Browse</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${mobileOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* RIGHT: Utilities */}
        <div className="flex items-center gap-6">
          <SearchBar open={searchOpen} setOpen={setSearchOpen} />
          
          {/* Vertical Divider */}
          <div className="w-px h-6 bg-slate-700/50 hidden md:block" /> 
          
          {/* <NotificationBell /> */}
          <ProfileDropdown />
        </div>
      </div>

      <MobileMenu open={mobileOpen} setOpen={setMobileOpen} />
    </header>
  );
};

export default Navbar;