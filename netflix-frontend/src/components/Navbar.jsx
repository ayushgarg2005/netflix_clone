import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";
import ProfileDropdown from "./ProfileDropdown";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all
        ${
          isScrolled
            ? "bg-[#141414]/95 backdrop-blur-md py-3"
            : "bg-gradient-to-b from-black/90 to-transparent py-5"
        }`}
    >
      <div className="flex justify-between items-center px-6 md:px-12">
        <div className="flex items-center gap-10">
          <Logo />
          <DesktopNav />

          <button
            className="lg:hidden text-white flex items-center gap-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            Browse
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <SearchBar open={searchOpen} setOpen={setSearchOpen} />
          <NotificationBell />
          <ProfileDropdown />
        </div>
      </div>

      <MobileMenu open={mobileOpen} setOpen={setMobileOpen} />
    </header>
  );
};

export default Navbar;
