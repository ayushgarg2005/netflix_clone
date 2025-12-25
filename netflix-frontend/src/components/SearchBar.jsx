import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

const SearchBar = ({ open, setOpen }) => {
  return (
    <motion.div
      animate={{ width: open ? 280 : 35 }}
      className={`flex items-center h-9 overflow-hidden rounded-full border
        ${
          open
            ? "bg-black/60 border-white/30 px-3"
            : "border-transparent"
        }`}
    >
      <button onClick={() => setOpen(!open)} className="text-white">
        <Search size={18} strokeWidth={2.5} />
      </button>

      <input
        placeholder="Titles, people, genres"
        className={`bg-transparent ml-3 text-xs outline-none text-white
          ${open ? "opacity-100" : "opacity-0"}`}
      />

      {open && (
        <X
          size={14}
          className="cursor-pointer text-gray-400"
          onClick={() => setOpen(false)}
        />
      )}
    </motion.div>
  );
};

export default SearchBar;
