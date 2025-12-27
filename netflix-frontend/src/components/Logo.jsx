import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      {/* 1. Icon Box with Green Glow */}
      <motion.div 
        whileHover={{ scale: 1.05, rotate: 3 }}
        whileTap={{ scale: 0.95 }}
        className="w-8 h-8 md:w-9 md:h-9 bg-[#00ED64] rounded-lg flex items-center justify-center text-[#001E2B] font-extrabold text-xl shadow-[0_0_15px_rgba(0,237,100,0.3)] transition-shadow duration-300 group-hover:shadow-[0_0_25px_rgba(0,237,100,0.6)]"
      >
        S
      </motion.div>

      {/* 2. Text Branding */}
      <span className="text-xl md:text-2xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-[#00ED64]">
        Streamflix
      </span>
    </Link>
  );
};

export default Logo;