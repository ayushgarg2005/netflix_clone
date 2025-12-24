import { Play, Star, Plus, ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MovieCard = ({ movie, progress = 0, showProgress = false }) => {
  const navigate = useNavigate();

  if (!movie) return null;

  // Unit Consistency: Convert movie.duration (minutes) to seconds to match progress
  const durationInSeconds = (movie.duration || 0) * 60;
  const progressPercent = showProgress && durationInSeconds > 0
    ? Math.min((progress / durationInSeconds) * 100, 100) 
    : 0;

  // Logic for a "Match" score based on rating (e.g., 8.5 rating = 85% match)
  const matchScore = movie.rating ? Math.round(movie.rating * 10) : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative flex flex-col cursor-pointer"
      onClick={() => navigate(`/watch/${movie._id}`)}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[#1c1c1c] shadow-md transition-shadow duration-300 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
        
        {/* THUMBNAIL */}
        <img
          src={movie.thumbnailUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          loading="lazy"
        />

        {/* HOVER OVERLAY: Deeper gradient for button visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* TOP BADGES: Modern Glassmorphism */}
        <div className="absolute top-2 left-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
          <span className="bg-white/10 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-sm font-black uppercase tracking-widest border border-white/20">
            {movie.type}
          </span>
          <span className="bg-black/40 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-sm border border-white/10 font-bold">
            {movie.quality}
          </span>
        </div>

        {/* CENTER PLAY BUTTON: Glow effect on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            <Play size={24} fill="black" stroke="black" className="ml-1" />
          </div>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,1)", color: "black" }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 bg-[#2a2a2a]/90 text-white rounded-full border border-white/10 backdrop-blur-sm transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus size={14} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,1)", color: "black" }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 bg-[#2a2a2a]/90 text-white rounded-full border border-white/10 backdrop-blur-sm transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ThumbsUp size={14} />
            </motion.button>
          </div>
          <span className="text-[10px] text-white/90 font-bold bg-black/40 backdrop-blur-sm border border-white/20 px-1.5 py-0.5 rounded-sm uppercase">
            {movie.ageRestriction}
          </span>
        </div>

        {/* 🔥 PROGRESS BAR: Cinematic Neon Glow */}
        {showProgress && (
          <div className="absolute bottom-0 left-0 w-full h-[3.5px] bg-white/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-[#e50914] shadow-[0_0_12px_rgba(229,9,20,0.8)]"
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        )}
      </div>

      {/* METADATA: Clean Typography */}
      <div className="mt-3 px-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold text-gray-100 truncate flex-1 tracking-tight">
            {movie.title}
          </h3>
          {matchScore && (
             <span className="text-[#46d369] text-[11px] font-black tracking-tight">
               {matchScore}% Match
             </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
          <span className="text-gray-300">{movie.duration}m</span>
          <span className="w-1 h-1 bg-gray-700 rounded-full" />
          <div className="flex gap-1 truncate">
            {movie.genres?.slice(0, 2).map((genre, i) => (
              <span key={genre}>
                {genre}{i < 1 && movie.genres.length > 1 ? "," : ""}
              </span>
            ))}
          </div>
          {movie.rating > 0 && (
            <>
              <span className="w-1 h-1 bg-gray-700 rounded-full" />
              <div className="flex items-center gap-1">
                <Star size={10} fill="#f5c518" stroke="none" />
                <span className="text-gray-300">{movie.rating.toFixed(1)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;