import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const PlayerTopBar = ({ movie, onBack }) => {
  // Fallback for title and type based on your schema
  const title = movie?.title || "Unknown Title";
  const typeLabel = movie?.type === "series" ? "Series" : "Movie";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="
        pointer-events-none
        w-full
        flex items-center gap-6
        px-6 py-8 md:px-12 md:py-10
        bg-gradient-to-b from-black/90 via-black/60 to-transparent
        z-50
      "
    >
      {/* ===== BACK BUTTON ===== */}
      <button
        onClick={onBack}
        aria-label="Go back"
        className="
          pointer-events-auto
          flex items-center justify-center
          group
          transition-all
          duration-300
        "
      >
        <div className="
          p-2 
          rounded-full 
          text-white 
          group-hover:bg-white/10 
          group-active:scale-90 
          transition-all
        ">
          <ArrowLeft 
            size={32} 
            strokeWidth={2.5} 
            className="group-hover:-translate-x-1 transition-transform"
          />
        </div>
      </button>

      {/* ===== TITLE & INFO ===== */}
      <div className="flex flex-col select-none pointer-events-none">
        {/* Label (e.g., WATCHING MOVIE) */}
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.2 }}
          className="
            text-[10px] md:text-[11px] 
            font-black 
            tracking-[0.4em] 
            text-white 
            uppercase 
            mb-1
          "
        >
          Watching {typeLabel}
        </motion.span>

        {/* Title */}
        <h1
          className="
            text-xl md:text-3xl
            font-black
            tracking-tighter
            text-white
            leading-none
            drop-shadow-md
          "
        >
          {title}
        </h1>
      </div>

      {/* Optional: Right side indicator (e.g. Quality) */}
      <div className="ml-auto hidden md:block">
        <span className="
          px-2 py-1 
          rounded 
          border border-white/20 
          bg-black/20 
          text-[10px] 
          font-bold 
          text-white/60 
          uppercase
        ">
          {movie?.quality || "HD"}
        </span>
      </div>
    </motion.header>
  );
};

export default PlayerTopBar;