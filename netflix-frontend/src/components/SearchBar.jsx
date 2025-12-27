import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = ({ open, setOpen }) => {
  return (
    <motion.div
      initial={false}
      animate={{ width: open ? 260 : 40 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`
        flex items-center h-10 overflow-hidden rounded-lg border transition-all duration-300
        ${
          open
            ? "bg-[#021019] border-[#00ED64]/50 shadow-[0_0_15px_rgba(0,237,100,0.15)] px-3"
            : "bg-transparent border-transparent hover:bg-white/5 justify-center"
        }
      `}
    >
      <button 
        onClick={() => setOpen(!open)} 
        className={`transition-colors duration-300 shrink-0 ${open ? "text-[#00ED64]" : "text-slate-300 hover:text-white"}`}
      >
        <Search size={18} strokeWidth={open ? 3 : 2.5} />
      </button>

      <input
        placeholder="Search titles, genres..."
        className={`
          bg-transparent ml-3 w-full text-sm outline-none text-white placeholder:text-slate-500 caret-[#00ED64]
          transition-opacity duration-200
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      <AnimatePresence>
        {open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setOpen(false)}
            className="shrink-0 text-slate-500 hover:text-white transition-colors"
          >
            <X size={14} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;