import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, ThumbsUp, X, Clock, Calendar, Star, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        // Fetch specific movie
        const res = await fetch(`http://localhost:5000/api/movies/${id}`, { credentials: "include" });
        const data = await res.json();
        setMovie(data);

        // Fetch recommendations (adjust endpoint as per your backend)
        const recRes = await fetch(`http://localhost:5000/api/movies/all`, { credentials: "include" });
        const recData = await recRes.json();
        setSimilarMovies(recData.filter(m => m._id !== id).slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
    window.scrollTo(0, 0); // Reset scroll on entry
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/5 border-t-[#e50914] rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) return <div className="text-white text-center mt-20">Movie not found.</div>;

  return (
    <div className="bg-[#141414] min-h-screen text-white pb-20">
      <Navbar />

      {/* HERO SECTION - BACKDROP */}
      <div className="relative h-[60vh] md:h-[80vh] w-full">
        <div className="absolute inset-0">
          <img 
            src={movie.bannerUrl} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#141414]/60 to-[#141414]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent" />
        </div>

        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-24 left-6 md:left-12 p-2 bg-black/50 rounded-full hover:bg-black/80 transition z-30"
        >
          <X size={28} />
        </button>

        {/* HERO CONTENT */}
        <div className="absolute bottom-0 left-0 w-full px-6 md:px-16 pb-12 z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter uppercase italic">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button 
                onClick={() => navigate(`/watch/${movie._id}`)}
                className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-bold hover:bg-white/90 transition active:scale-95"
              >
                <Play size={24} fill="black" /> Play
              </button>
              <button className="p-3 border-2 border-gray-500 rounded-full hover:border-white transition">
                <Plus size={24} />
              </button>
              <button className="p-3 border-2 border-gray-500 rounded-full hover:border-white transition">
                <ThumbsUp size={24} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* DETAILED INFO SECTION */}
      <main className="px-6 md:px-16 grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-10 relative z-30">
        
        {/* LEFT COL: Description & Metadata */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm md:text-base font-medium">
            <span className="text-[#46d369] font-bold">{movie.rating * 10}% Match</span>
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
            <span className="border border-gray-500 px-1.5 py-0.5 text-xs rounded uppercase tracking-wider">
              {movie.ageRestriction}
            </span>
            <span>{movie.duration}m</span>
            <span className="bg-white/10 px-1.5 py-0.5 text-[10px] rounded border border-white/20 uppercase">
              {movie.quality}
            </span>
          </div>

          <p className="text-lg md:text-xl leading-relaxed text-gray-200 font-light">
            {movie.description}
          </p>

          {/* Cast/Genres for Mobile (Hidden on Desktop Col 3) */}
          <div className="lg:hidden space-y-4 pt-4 border-t border-white/10">
             <p className="text-sm"><span className="text-gray-500">Cast:</span> {movie.cast?.join(', ')}</p>
             <p className="text-sm"><span className="text-gray-500">Genres:</span> {movie.genres?.join(', ')}</p>
          </div>
        </div>

        {/* RIGHT COL: Cast & Crew Details */}
        <div className="hidden lg:block space-y-6">
          <div className="text-sm">
            <span className="text-gray-500">Cast:</span> 
            <span className="text-gray-200 ml-2 leading-relaxed">
              {movie.cast?.length > 0 ? movie.cast.join(', ') : "Information not available"}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Genres:</span> 
            <span className="text-gray-200 ml-2 uppercase tracking-tight">
              {movie.genres?.join(', ')}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">This movie is:</span> 
            <span className="text-gray-200 ml-2">Exciting, Intense, Cinematic</span>
          </div>
        </div>
      </main>

      {/* RECOMMENDATIONS SECTION */}
      <section className="px-6 md:px-16 mt-20">
        <div className="flex items-center gap-2 mb-8">
          <h3 className="text-2xl font-bold tracking-tight">More Like This</h3>
          <ChevronRight className="text-[#e50914]" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {similarMovies.map((m) => (
            <motion.div 
              key={m._id}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <MovieCard movie={m} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieDetails;