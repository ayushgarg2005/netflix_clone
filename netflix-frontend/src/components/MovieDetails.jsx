import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Plus, ThumbsUp, X, Clock, Calendar, Star, Activity, Tag, Users, ArrowLeft } from "lucide-react";
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
        const res = await fetch(`http://localhost:5000/api/movies/${id}`, { credentials: "include" });
        const data = await res.json();
        setMovie(data);

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
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001E2B] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#001E2B] border-t-[#00ED64] rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) return <div className="min-h-screen bg-[#001E2B] flex items-center justify-center text-slate-400">Movie not found.</div>;

  const rating = movie.rating || 0;

  return (
    <div className="bg-[#001E2B] min-h-screen text-slate-100 font-sans selection:bg-[#00ED64] selection:text-[#001E2B] pb-20">
      <Navbar />

      {/* 1. HERO HEADER (Reduced Height + Clean Overlay) */}
      <div className="relative w-full h-[450px] md:h-[500px] overflow-hidden group">
        
        {/* Background Image Layer */}
        <div className="absolute inset-0">
            <img 
                src={movie.bannerUrl} 
                alt={movie.title}
                className="w-full h-full object-cover object-top opacity-80" // object-top ensures faces aren't cut off
            />
            {/* Tech Grid Overlay (Subtle Texture) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,30,43,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(0,30,43,0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />
            
            {/* Professional Gradients for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#001E2B] via-[#001E2B]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#001E2B] via-[#001E2B]/40 to-transparent" />
        </div>

        {/* Navigation / Back Button */}
        <div className="absolute top-24 left-6 md:left-12 z-30">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 bg-[#021019]/80 backdrop-blur-md border border-white/10 rounded-full text-slate-300 hover:text-white hover:border-[#00ED64] transition-all group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold">Back</span>
            </button>
        </div>

        {/* Hero Content (Bottom Aligned) */}
        <div className="absolute bottom-0 left-0 w-full px-6 md:px-16 pb-12 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            {/* Badge Row */}
            <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#00ED64]/10 border border-[#00ED64]/20 text-[#00ED64] text-[10px] font-bold uppercase tracking-wide">
                    <Activity size={12} />
                    <span>Trending</span>
                </div>
                <div className="h-px w-8 bg-white/20" />
                <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">{movie.type || "Movie"}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white leading-none drop-shadow-xl">
              {movie.title}
            </h1>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <button 
                onClick={() => navigate(`/watch/${movie._id}`)}
                className="flex items-center gap-2 bg-[#00ED64] text-[#001E2B] px-8 py-3.5 rounded-xl font-bold hover:bg-[#00c052] transition-all shadow-[0_0_20px_rgba(0,237,100,0.2)] active:scale-95"
              >
                <Play size={20} fill="currentColor" /> 
                Start Watching
              </button>
              <button className="p-3.5 bg-[#021019]/60 backdrop-blur-md border border-slate-600 rounded-xl text-slate-300 hover:text-white hover:border-[#00ED64] transition-all active:scale-95">
                <Plus size={20} />
              </button>
              <button className="p-3.5 bg-[#021019]/60 backdrop-blur-md border border-slate-600 rounded-xl text-slate-300 hover:text-white hover:border-[#00ED64] transition-all active:scale-95">
                <ThumbsUp size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. MAIN DETAILS GRID */}
      <main className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-6 relative z-30">
        
        {/* LEFT COLUMN: Synopsis & Metadata */}
        <div className="lg:col-span-2 space-y-8 bg-[#021019] p-8 rounded-2xl border border-white/5 shadow-2xl">
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-400 border-b border-white/5 pb-6">
            <div className="flex items-center gap-2 text-[#00ED64] bg-[#00ED64]/5 px-3 py-1.5 rounded-lg border border-[#00ED64]/10">
                <Star size={16} fill="currentColor" />
                <span className="text-white font-bold text-lg">{rating.toFixed(1)}</span>
            </div>
            
            <div className="w-px h-4 bg-slate-700" />
            
            <span className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(movie.releaseDate).getFullYear()}
            </span>

            <div className="w-px h-4 bg-slate-700" />

            <span className="flex items-center gap-2">
                <Clock size={16} />
                {movie.duration}m
            </span>

            <div className="w-px h-4 bg-slate-700" />

            <span className="border border-slate-600 px-2 py-0.5 text-xs rounded text-slate-300 font-mono">
              {movie.ageRestriction}+
            </span>
            <span className="bg-white/5 text-slate-300 border border-white/10 px-2 py-0.5 text-xs rounded font-bold uppercase tracking-wider">
              {movie.quality || 'HD'}
            </span>
          </div>

          {/* Synopsis */}
          <div className="space-y-4">
             <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1 h-5 bg-[#00ED64] rounded-full" />
                Synopsis
             </h3>
             <p className="text-base md:text-lg leading-relaxed text-slate-300 font-light">
                {movie.description}
             </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Cast & Tags (Sidebar) */}
        <div className="hidden lg:flex flex-col gap-6">
          {/* Cast Card */}
          <div className="bg-[#021019] border border-white/5 rounded-xl p-6 shadow-lg">
             <div className="flex items-center gap-2 mb-4 text-[#00ED64]">
                <Users size={18} />
                <h4 className="font-bold text-white text-sm uppercase tracking-wider">Cast & Crew</h4>
             </div>
             <div className="space-y-5">
                <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Starring</span>
                    <p className="text-slate-200 text-sm leading-relaxed font-medium">{movie.cast?.length > 0 ? movie.cast.join(', ') : "N/A"}</p>
                </div>
                <div className="h-px bg-white/5" />
                <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Director</span>
                    <p className="text-slate-200 text-sm font-medium">{movie.director || "Unknown"}</p>
                </div>
             </div>
          </div>

          {/* Tags Card */}
          <div className="bg-[#021019] border border-white/5 rounded-xl p-6 shadow-lg">
             <div className="flex items-center gap-2 mb-4 text-[#00ED64]">
                <Tag size={18} />
                <h4 className="font-bold text-white text-sm uppercase tracking-wider">Genre & Tags</h4>
             </div>
             <div className="flex flex-wrap gap-2">
                {movie.genres?.map(g => (
                    <span key={g} className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-white/5 text-slate-300 text-xs hover:bg-slate-700/50 hover:text-white transition cursor-default">
                        {g}
                    </span>
                ))}
             </div>
          </div>
        </div>
      </main>

      {/* 3. RECOMMENDATIONS SECTION */}
      <section className="container mx-auto px-6 md:px-12 mt-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 bg-[#00ED64] rounded-full shadow-[0_0_10px_#00ED64]" />
          <h3 className="text-2xl font-bold tracking-tight text-white">More Like This</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {similarMovies.map((m) => (
            <motion.div 
              key={m._id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
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