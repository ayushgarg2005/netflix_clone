import { Play, Star, Plus, ThumbsUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MovieCard = ({ movie, progress = 0, showProgress = false }) => {
  const navigate = useNavigate();

  if (!movie) return null;

  // Safe Fallbacks
  const rating = movie.rating || 0;
  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "N/A";

  // Progress Bar Calculation
  const durationInSeconds = (movie.duration || 0) * 60;
  const progressPercent = showProgress && durationInSeconds > 0
    ? Math.min((progress / durationInSeconds) * 100, 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col w-full h-full cursor-pointer bg-transparent"
      onClick={() => navigate(`/watch/${movie._id}`)}
    >
      {/* 1. IMAGE CONTAINER */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-900 shadow-md group-hover:shadow-xl transition-shadow duration-300">
        
        {/* Thumbnail Image */}
        <img
          src={movie.thumbnailUrl || movie.bannerUrl || "https://via.placeholder.com/640x360?text=No+Image"}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-100"
          loading="lazy"
        />

        {/* Minimal Gradient Overlay (Bottom only, for text readability if needed inside) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Center Play Button (Only visible on hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                <Play size={16} fill="black" className="ml-0.5 text-black" />
            </div>
        </div>

        {/* Progress Bar (Bottom Edge) */}
        {showProgress && (
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/20">
            <div 
                style={{ width: `${progressPercent}%` }} 
                className="h-full bg-[#00ED64]" 
            />
          </div>
        )}
      </div>

      {/* 2. METADATA (Below Image) */}
      <div className="mt-2.5 flex flex-col gap-1 px-0.5">
        
        {/* Title */}
        <h3 className="text-[13px] font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
          {movie.title}
        </h3>

        {/* Info Row: Year • Duration • Rating */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span>{releaseYear}</span>
            <span className="w-0.5 h-0.5 bg-slate-600 rounded-full" />
            
            <div className="flex items-center gap-1">
                <Star size={10} className="text-[#00ED64]" fill="currentColor" />
                <span className="text-slate-400">{rating.toFixed(1)}</span>
            </div>
            
            <span className="w-0.5 h-0.5 bg-slate-600 rounded-full" />
            
            <span className="border border-slate-700 px-1 rounded-[2px] text-[9px] text-slate-400">
                {movie.quality || "HD"}
            </span>
        </div>

      </div>
    </motion.div>
  );
};

export default MovieCard;