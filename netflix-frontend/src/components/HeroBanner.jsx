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
    <div className="relative w-full group z-0">
      {/* 1. CONTAINER HEIGHT: Taller for a more cinematic feel */}
      <div className="relative h-[550px] lg:h-[650px] w-full overflow-hidden bg-[#0b0c0f]">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={movie._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* 2. BACKGROUND IMAGE */}
            <div className="absolute inset-0">
               <img 
                 src={movie.bannerUrl} 
                 alt={movie.title}
                 className="w-full h-full object-cover object-top opacity-100" 
               />
            </div>

            {/* 3. PROFESSIONAL GRADIENTS (The "Vignette" Effect) */}
            
            {/* Bottom Fade: seamless transition to the page background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0f] via-[#0b0c0f]/20 to-transparent" />

            {/* Left Fade: Protects text readability without obscuring the image */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c0f] via-[#0b0c0f]/60 to-transparent lg:w-[70%]" />
            
            {/* Top Fade: Subtle shadow for navbar visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b0c0f]/60 via-transparent to-transparent h-32" />
            
          </motion.div>
        </AnimatePresence>

        {/* 4. CONTENT LAYER */}
        <div className="relative z-10 h-full container mx-auto px-6 md:px-12 flex flex-col justify-center pt-12 md:pt-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={movie._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-3xl space-y-6"
            >
              {/* Trending Badge */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#00ED64] text-[#0b0c0f] text-[11px] font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(0,237,100,0.4)]">
                  <Activity size={12} strokeWidth={3} />
                  <span>#{currentIndex + 1} Trending</span>
                </div>
                <div className="px-3 py-1.5 rounded border border-white/20 bg-white/5 backdrop-blur-md text-white/80 text-[11px] font-bold uppercase tracking-wider">
                    {movie.type || "Movie"}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.95] drop-shadow-2xl">
                {movie.title}
              </h1>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-300">
                <div className="flex items-center gap-1 text-[#00ED64]">
                  <Star size={16} fill="currentColor" />
                  <span className="text-white font-bold text-base">{movie.rating?.toFixed(1) || "N/A"}</span>
                </div>
                
                <span className="text-white/20">|</span>

                <span className="flex items-center gap-2">
                    <Calendar size={16} /> {releaseYear}
                </span>
                
                <span className="text-white/20">|</span>

                <span className="flex items-center gap-2">
                    <Clock size={16} /> {movie.duration}m
                </span>
                
                <span className="ml-2 border border-slate-500 px-2 py-0.5 rounded text-xs text-slate-300 font-bold">
                  {movie.ageRestriction}+
                </span>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-base md:text-lg leading-relaxed line-clamp-3 max-w-xl drop-shadow-md font-light">
                {movie.description}
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={() => navigate(`/watch/${movie._id}`)}
                  className="flex items-center gap-3 bg-[#00ED64] hover:bg-[#00c052] text-[#0b0c0f] px-8 py-4 rounded-xl font-bold text-base transition-all shadow-[0_0_20px_rgba(0,237,100,0.2)] hover:shadow-[0_0_30px_rgba(0,237,100,0.4)] active:scale-95"
                >
                  <Play size={20} fill="currentColor" /> 
                  Play Now
                </button>
                <button 
                  onClick={() => navigate(`/movie/${movie._id}`)}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-base border border-white/10 backdrop-blur-md transition-all active:scale-95"
                >
                  <Info size={22} /> 
                  More Info
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 5. NAVIGATION ARROWS (Floating Right) */}
        <div className="absolute bottom-12 right-12 z-20 flex gap-4">
            <button 
                onClick={handlePrev}
                className="p-4 rounded-full bg-black/40 hover:bg-[#00ED64] text-white hover:text-[#0b0c0f] border border-white/10 hover:border-[#00ED64] transition-all backdrop-blur-md group"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={handleNext}
                className="p-4 rounded-full bg-black/40 hover:bg-[#00ED64] text-white hover:text-[#0b0c0f] border border-white/10 hover:border-[#00ED64] transition-all backdrop-blur-md group"
            >
                <ChevronRight size={24} />
            </button>
        </div>

        {/* 6. PROGRESS BAR INDICATORS */}
        <div className="absolute bottom-0 left-0 right-0 flex z-20 px-4 pb-1">
            {movies.map((_, i) => (
                <div key={i} className="flex-1 h-[2px] bg-white/10 mx-1 rounded-full overflow-hidden">
                    <div 
                        className={`h-full bg-[#00ED64] shadow-[0_0_10px_#00ED64] transition-all duration-500 ease-out ${i === currentIndex ? "w-full" : "w-0"}`} 
                    />
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default HeroBanner;