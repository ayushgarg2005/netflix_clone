import { Play, Star, Plus, ThumbsUp, Clock, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MovieCard = ({ movie, progress = 0, showProgress = false }) => {
  const navigate = useNavigate();

  if (!movie) return null;

  // SAFEGUARD: Default to 0 if rating is missing
  const rating = movie.rating || 0; 

  // Duration Logic
  const durationInSeconds = (movie.duration || 0) * 60;
  const progressPercent = showProgress && durationInSeconds > 0
    ? Math.min((progress / durationInSeconds) * 100, 100) 
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative flex flex-col cursor-pointer bg-[#021019] rounded-xl overflow-hidden border border-white/5 hover:border-[#00ED64]/50 transition-colors duration-300 shadow-lg"
      onClick={() => navigate(`/watch/${movie._id}`)}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#001E2B]">
        
        {/* THUMBNAIL */}
        <img
          src={movie.thumbnailUrl || "https://via.placeholder.com/640x360?text=No+Image"}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        {/* HOVER OVERLAY */}
        <div className="absolute inset-0 bg-[#001E2B]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            {/* CENTER PLAY BUTTON */}
            <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-[#00ED64] rounded-full flex items-center justify-center text-[#001E2B] shadow-[0_0_20px_rgba(0,237,100,0.4)]"
            >
                <Play size={20} fill="currentColor" className="ml-1" />
            </motion.div>
        </div>

        {/* ABSOLUTE BADGES */}
        <div className="absolute top-2 left-2 flex gap-1.5 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className="bg-[#001E2B]/90 text-[#00ED64] text-[10px] font-bold px-2 py-0.5 rounded border border-[#00ED64]/20 backdrop-blur-md uppercase tracking-wide">
            {movie.quality || "HD"}
          </span>
        </div>

        {/* PROGRESS BAR: Spring Green Glow */}
        {showProgress && (
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#001E2B]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-[#00ED64] shadow-[0_0_8px_rgba(0,237,100,0.8)]"
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        )}
      </div>

      {/* METADATA: Clean Tech Look */}
      <div className="p-3 bg-[#021019]">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-sm font-bold text-white group-hover:text-[#00ED64] transition-colors truncate leading-tight">
            {movie.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0 bg-[#00ED64]/10 px-1.5 py-0.5 rounded">
            <Star size={10} className="text-[#00ED64]" fill="currentColor" />
            {/* ✅ FIX: Used the safe 'rating' variable defined at top */}
            <span className="text-[10px] font-bold text-[#00ED64]">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-1">
                <Clock size={10} />
                {movie.duration || 0}m
            </span>
            <span className="w-0.5 h-3 bg-slate-700 rounded-full" />
            <span className="truncate max-w-[80px]">
                {movie.genres?.[0] || "General"}
            </span>
            <span className="w-0.5 h-3 bg-slate-700 rounded-full" />
            <span className="text-slate-500 border border-slate-700 px-1 rounded-[2px] leading-none py-[1px]">
                {movie.ageRestriction || "13"}+
            </span>
        </div>

        {/* HOVER ACTIONS (Hidden by default, slide up) */}
        <div className="h-0 group-hover:h-8 overflow-hidden transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-2 pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                <button 
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-[#00ED64] hover:text-[#001E2B] text-slate-200 text-[10px] font-bold py-1.5 rounded transition-colors"
                >
                    <Plus size={12} /> List
                </button>
                <button 
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-[#00ED64] hover:text-[#001E2B] text-slate-200 text-[10px] font-bold py-1.5 rounded transition-colors"
                >
                    <ThumbsUp size={12} /> Like
                </button>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;