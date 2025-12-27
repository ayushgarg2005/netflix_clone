import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "./navbar.constants";

const DesktopNav = () => {
  const location = useLocation();

  return (
    <nav className="hidden lg:flex items-center gap-8">
      {NAV_LINKS.map((link) => {
        const isActive = location.pathname === link.path;
        
        return (
          <Link
            key={link.name}
            to={link.path}
            className={`text-sm font-semibold tracking-wide transition-colors relative py-1
              ${isActive ? "text-white" : "text-slate-400 hover:text-[#00ED64]"}
            `}
          >
            {link.name}
            
            {/* Active Indicator Line with Glow */}
            <span
              className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#00ED64] shadow-[0_0_8px_rgba(0,237,100,0.6)] transition-all duration-300 ease-out
                ${isActive ? "w-full opacity-100" : "w-0 opacity-0"}
              `}
            />
          </Link>
        );
      })}
    </nav>
  );
};

export default DesktopNav;
