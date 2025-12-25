import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "./navbar.constants";

const DesktopNav = () => {
  const location = useLocation();

  return (
    <nav className="hidden lg:flex items-center gap-6">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className={`text-[13px] font-medium relative group
            ${
              location.pathname === link.path
                ? "text-white"
                : "text-gray-300 hover:text-white"
            }`}
        >
          {link.name}
          <span
            className={`absolute -bottom-1 left-0 h-[2px] bg-[#e50914] transition-all
              ${
                location.pathname === link.path
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
          />
        </Link>
      ))}
    </nav>
  );
};

export default DesktopNav;
