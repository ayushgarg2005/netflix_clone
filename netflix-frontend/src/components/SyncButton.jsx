import { RefreshCw, Zap } from "lucide-react";
import { motion } from "framer-motion";

const SyncButton = ({ onSync }) => (
  <motion.button
    initial={{ y: -50, opacity: 0, scale: 0.9 }}
    animate={{ y: 0, opacity: 1, scale: 1 }}
    exit={{ y: -50, opacity: 0 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onSync}
    className="group relative flex items-center gap-3 px-6 py-3 rounded-full bg-[#00ED64]/90 backdrop-blur-md text-[#001E2B] font-extrabold text-sm uppercase tracking-wide shadow-[0_0_25px_rgba(0,237,100,0.4)] border border-white/20 z-50 overflow-hidden"
  >
    {/* Animated Background Pulse */}
    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
    
    <RefreshCw size={18} className="animate-spin-slow group-hover:animate-spin" />
    <span>Sync to Host</span>
    
    {/* Optional: 'Live' Dot */}
    <div className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
  </motion.button>
);

export default SyncButton;