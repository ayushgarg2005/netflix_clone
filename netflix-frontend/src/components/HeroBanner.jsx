import { Play, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroBanner = ({ movie }) => {
  if (!movie) return null;

  const navigate = useNavigate();

  return (
    <section className="relative h-[60vh] md:h-[65vh] w-full overflow-hidden bg-[#141414]">
      {/* BACKGROUND */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.bannerUrl})` }}
      />

      {/* GRADIENTS */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

      {/* CONTENT */}
      <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-14 pb-12 max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4"
        >
          {movie.title}
        </motion.h1>

        {/* META */}
        <div className="flex items-center gap-3 text-xs font-semibold mb-4">
          <span className="text-gray-300 border border-gray-600 px-1 rounded-sm">
            {movie.ageRestriction}
          </span>
          <span className="text-white">{movie.duration}m</span>
          <span className="text-gray-300">{movie.quality}</span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-gray-300 text-sm md:text-base max-w-md mb-6 line-clamp-2">
          {movie.description}
        </p>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/watch/${movie._id}`)}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-md 
             font-bold hover:bg-white/90 transition"
          >
            <Play size={20} fill="black" />
            Play
          </button>

          <button className="flex items-center gap-2 bg-gray-500/40 text-white px-6 py-2 rounded-md">
            <Info size={18} />
            Info
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
