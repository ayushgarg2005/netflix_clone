import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <motion.h1
        whileHover={{ scale: 1.03 }}
        className="text-2xl md:text-3xl font-black tracking-tighter text-[#e50914]"
      >
        STREAMFLIX
      </motion.h1>
    </Link>
  );
};

export default Logo;
