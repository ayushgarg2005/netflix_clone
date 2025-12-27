import { useState } from "react";
import { Play, Info, Calendar, Clock, Star, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroBanner = ({ movies }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!movies || movies.length === 0) return null;

  const movie = movies[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const releaseYear = movie.releaseDate 
    ? new Date(movie.releaseDate).getFullYear() 
    : "N/A";

  return (
    <div className="relative w-full group">
      {/* 1. CONTAINER HEIGHT */}
      <div className="relative h-[500px] lg:h-[650px] w-full overflow-hidden bg-black">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={movie._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* 2. BACKGROUND IMAGE - High Quality & Clear */}
            <div className="absolute inset-0">
               {/* object-cover: Fills screen
                  object-top: Prioritizes faces/heads usually at top of posters
               */}
               <img 
                 src={movie.bannerUrl} 
                 alt={movie.title}
                 className="w-full h-full object-cover object-top opacity-90" 
               />
            </div>

            {/* 3. GRADIENTS - Redesigned for Clarity */}
            
            {/* Gradient A: Bottom Fade (Seamless blend into content) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

            {/* Gradient B: Left Text Protection (Subtle Scrim) 
                Instead of a solid block, this is a soft shadow behind text only.
            */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent lg:w-[60%]" />
            
          </motion.div>
        </AnimatePresence>

        {/* 4. CONTENT LAYER */}
        <div className="relative z-10 h-full container mx-auto px-6 md:px-12 flex flex-col justify-center pt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={movie._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl space-y-6"
            >
              {/* Trending Badge */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#00ED64] text-black text-[11px] font-extrabold uppercase tracking-wide">
                  <Activity size={12} />
                  <span># {currentIndex + 1} Trending</span>
                </div>
              </div>

              {/* Title - Bigger & Cleaner */}
              <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[0.9] drop-shadow-lg">
                {movie.title}
              </h1>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-200">
                <div className="flex items-center gap-1 text-[#46d369]">
                  <Star size={16} fill="currentColor" />
                  <span className="text-white font-bold text-base">{movie.rating?.toFixed(1) || "N/A"}</span>
                </div>
                
                <span className="text-gray-400">|</span>

                <span>{releaseYear}</span>
                
                <span className="text-gray-400">|</span>

                <span>{movie.duration}m</span>
                
                <span className="border border-gray-500 px-2 py-0.5 rounded text-xs text-gray-300">
                  {movie.ageRestriction}+
                </span>
              </div>

              {/* Description - Limited width for readability against background */}
              <p className="text-gray-300 text-base md:text-lg leading-relaxed line-clamp-3 max-w-xl drop-shadow-md">
                {movie.description}
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={() => navigate(`/watch/${movie._id}`)}
                  className="flex items-center gap-3 bg-white hover:bg-gray-200 text-black px-8 py-3.5 rounded font-bold text-base transition-all active:scale-95"
                >
                  <Play size={20} fill="currentColor" /> 
                  Play
                </button>
                <button 
                  onClick={() => navigate(`/movie/${movie._id}`)}
                  className="flex items-center gap-3 bg-gray-600/60 hover:bg-gray-600/80 text-white px-8 py-3.5 rounded font-bold text-base transition-all active:scale-95 backdrop-blur-sm"
                >
                  <Info size={22} /> 
                  More Info
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 5. NAVIGATION ARROWS (Clean & Minimal) */}
        <div className="absolute bottom-8 right-12 z-20 flex gap-4">
            <button 
                onClick={handlePrev}
                className="p-3 rounded-full bg-black/30 hover:bg-white hover:text-black border border-white/20 transition-all backdrop-blur-sm group"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={handleNext}
                className="p-3 rounded-full bg-black/30 hover:bg-white hover:text-black border border-white/20 transition-all backdrop-blur-sm group"
            >
                <ChevronRight size={24} />
            </button>
        </div>

      </div>
    </div>
  );
};

export default HeroBanner;