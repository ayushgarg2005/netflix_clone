// import { Play, Info, Calendar, Clock, Star } from "lucide-react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// const HeroBanner = ({ movie }) => {
//   const navigate = useNavigate();

//   if (!movie) return null;

//   // Extract year from releaseDate
//   const releaseYear = movie.releaseDate 
//     ? new Date(movie.releaseDate).getFullYear() 
//     : "N/A";

//   return (
//     <section className="relative h-[80vh] md:h-[85vh] w-full overflow-hidden bg-black">
//       {/* 1. CINEMATIC BACKGROUND */}
//       <motion.div
//         initial={{ scale: 1.1, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 2, ease: "easeOut" }}
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//         style={{ backgroundImage: `url(${movie.bannerUrl})` }}
//       >
//         {/* Layered Gradients for maximum readability */}
//         {/* Bottom fade to blend with the page grid */}
//         <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent z-[2]" />
//         {/* Left-to-Right shadow to make text pop */}
//         <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent z-[1]" />
//       </motion.div>

//       {/* 2. CONTENT AREA */}
//       <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 pb-24 max-w-4xl">
        
//         {/* Branding/Type Label */}
//         <motion.div 
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="flex items-center gap-2 mb-3"
//         >
//           <div className="w-1 h-6 bg-[#e50914] rounded-full" />
//           <span className="text-gray-200 text-xs font-bold uppercase tracking-[0.3em]">
//             Featured {movie.type}
//           </span>
//         </motion.div>

//         {/* Title */}
//         <motion.h1
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.9]"
//         >
//           {movie.title}
//         </motion.h1>

//         {/* Metadata Row */}
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.4 }}
//           className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/90 mb-6"
//         >
//           {/* Rating - using your rating schema */}
//           <div className="flex items-center gap-1 text-[#46d369] font-bold">
//             <Star size={14} fill="#46d369" />
//             <span>{movie.rating > 0 ? `${movie.rating * 10}% Match` : "New"}</span>
//           </div>

//           <span className="text-gray-300 font-bold border border-gray-600 px-1.5 py-0.5 rounded text-[10px]">
//             {movie.ageRestriction}
//           </span>

//           <span className="flex items-center gap-1">
//             <Calendar size={14} className="text-gray-400" />
//             {releaseYear}
//           </span>

//           <span className="flex items-center gap-1">
//             <Clock size={14} className="text-gray-400" />
//             {movie.duration}m
//           </span>

//           <span className="bg-white/10 px-1.5 rounded text-[10px] uppercase font-bold text-gray-300">
//             {movie.quality}
//           </span>
//         </motion.div>

//         {/* Genres Row */}
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className="flex flex-wrap gap-2 mb-6"
//         >
//           {movie.genres?.map((genre, index) => (
//             <span key={index} className="text-xs text-gray-300 flex items-center">
//               {genre}
//               {index !== movie.genres.length - 1 && (
//                 <span className="mx-2 text-gray-600">•</span>
//               )}
//             </span>
//           ))}
//         </motion.div>

//         {/* Description */}
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="text-gray-300 text-base md:text-lg max-w-xl mb-8 line-clamp-3 leading-relaxed drop-shadow-lg"
//         >
//           {movie.description}
//         </motion.p>

//         {/* Call to Actions */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.7 }}
//           className="flex items-center gap-4"
//         >
//           <button
//             onClick={() => navigate(`/watch/${movie._id}`)}
//             className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded-md 
//              font-bold text-lg hover:bg-white/90 transition shadow-lg active:scale-95"
//           >
//             <Play size={24} fill="black" />
//             Play
//           </button>

//           <button 
//             onClick={() => navigate(`/movie/${movie._id}`)}
//             className="flex items-center gap-3 bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-md 
//               font-bold text-lg border border-white/20 hover:bg-white/20 transition active:scale-95"
//           >
//             <Info size={24} />
//             More Info
//           </button>

//         </motion.div>
//       </div>

//       {/* Decorative side vignetting */}
//       <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
//     </section>
//   );
// };

// export default HeroBanner;











import { useState } from "react";
import { Play, Info, Calendar, Clock, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroBanner = ({ movies }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Guard clause
  if (!movies || movies.length === 0) return null;

  const movie = movies[currentIndex];

  // Navigation logic
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
    <section className="relative h-[80vh] md:h-[85vh] w-full overflow-hidden bg-black">
      {/* 1. CINEMATIC BACKGROUND (Wrapped in AnimatePresence for smooth transitions) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={movie._id} // Key changes trigger the animation
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${movie.bannerUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent z-[2]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent z-[1]" />
        </motion.div>
      </AnimatePresence>

      {/* 2. TOGGLE BUTTONS */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 z-30 pointer-events-none">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-black/20 hover:bg-black/50 text-white/50 hover:text-white transition-all pointer-events-auto backdrop-blur-sm border border-white/10"
          aria-label="Previous Banner"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-black/20 hover:bg-black/50 text-white/50 hover:text-white transition-all pointer-events-auto backdrop-blur-sm border border-white/10"
          aria-label="Next Banner"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* 3. CONTENT AREA */}
      <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 pb-24 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={movie._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Branding */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-6 bg-[#e50914] rounded-full" />
              <span className="text-gray-200 text-xs font-bold uppercase tracking-[0.3em]">
                Featured {movie.type}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
              {movie.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/90 mb-6">
              <div className="flex items-center gap-1 text-[#46d369] font-bold">
                <Star size={14} fill="#46d369" />
                <span>{movie.rating > 0 ? `${movie.rating * 10}% Match` : "New"}</span>
              </div>
              <span className="text-gray-300 font-bold border border-gray-600 px-1.5 py-0.5 rounded text-[10px]">
                {movie.ageRestriction}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} className="text-gray-400" />
                {releaseYear}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} className="text-gray-400" />
                {movie.duration}m
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-base md:text-lg max-w-xl mb-8 line-clamp-3 leading-relaxed drop-shadow-lg">
              {movie.description}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/watch/${movie._id}`)}
                className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded-md font-bold text-lg hover:bg-white/90 transition shadow-lg active:scale-95"
              >
                <Play size={24} fill="black" /> Play
              </button>
              <button 
                onClick={() => navigate(`/movie/${movie._id}`)}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-md font-bold text-lg border border-white/20 hover:bg-white/20 transition active:scale-95"
              >
                <Info size={24} /> More Info
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative side vignetting */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/40 to-transparent pointer-events-none z-20" />

      {/* Slide Indicators (Optional: The dots at the bottom) */}
      <div className="absolute bottom-10 right-10 flex gap-2 z-30">
        {movies.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 transition-all duration-300 rounded-full ${i === currentIndex ? "w-8 bg-[#e50914]" : "w-2 bg-gray-500"}`} 
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;