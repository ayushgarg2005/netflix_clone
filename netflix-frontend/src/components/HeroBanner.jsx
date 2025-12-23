import React from "react";
import { Play, Info } from "lucide-react";
import { motion } from "framer-motion";

const HeroBanner = ({ movie }) => {
  if (!movie) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    /* Height reduced to 65vh for a tighter look */
    <section className="relative h-[60vh] md:h-[65vh] w-full overflow-hidden bg-[#141414]">
      {/* BACKGROUND IMAGE */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${movie.thumbnailUrl})` }}
      />

      {/* GRADIENT OVERLAYS */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-1" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent z-1" />

      {/* CONTENT WRAPPER - Reduced padding-bottom */}
      <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-14 pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-xl lg:max-w-2xl"
        >
          {/* TAGLINE - Scaled down font */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-3">
            <span className="bg-[#e50914] text-white text-[10px] font-black px-1.2 py-0.2 rounded-sm shadow-md">
              N
            </span>
            <span className="text-gray-300 text-[10px] font-bold tracking-[0.2em] uppercase">
              {movie.isPremium ? "Original" : "Featured"}
            </span>
          </motion.div>

          {/* TITLE - Scaled down from 8xl to 6xl */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1] tracking-tighter drop-shadow-xl mb-4"
          >
            {movie.title}
          </motion.h1>

          {/* METADATA BAR - Smaller icons/text */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 text-xs font-semibold mb-4">
            <span className="text-green-500">98% Match</span>
            <span className="text-gray-300 border border-gray-600/50 px-1 rounded-sm text-[9px]">
              {movie.ageRestriction || "16+"}
            </span>
            <span className="text-white">{movie.duration}m</span>
            <div className="flex gap-1 opacity-80">
               <span className="text-[9px] bg-white/10 px-1 rounded-sm border border-white/5 text-gray-300">4K</span>
            </div>
          </motion.div>

          {/* DESCRIPTION - Reduced margin and line-clamp */}
          <motion.p 
            variants={itemVariants}
            className="text-gray-300 text-sm md:text-base leading-snug max-w-md font-medium mb-6 line-clamp-2 opacity-90"
          >
            {movie.description || "Every choice counts in this high-stakes thriller."}
          </motion.p>

          {/* ACTION BUTTONS - Slightly smaller padding */}
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <button className="group flex items-center gap-2 bg-white text-black px-6 py-2 rounded-md font-bold hover:bg-white/80 transition-all active:scale-95 shadow-lg">
              <Play size={18} fill="black" className="group-hover:scale-110 transition-transform" />
              <span className="text-base">Play</span>
            </button>

            <button className="flex items-center gap-2 bg-gray-500/40 text-white px-6 py-2 rounded-md font-bold backdrop-blur-md border border-white/10 hover:bg-gray-500/60 transition-all active:scale-95 shadow-lg">
              <Info size={18} />
              <span className="text-base">Info</span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* BOTTOM BLEND */}
      <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-[#141414] to-transparent z-[1]" />
    </section>
  );
};

export default HeroBanner;