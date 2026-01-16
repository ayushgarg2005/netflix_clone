import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  Search, 
  Play, 
  Film, 
  Star, 
  Calendar, 
  Clock, 
  LayoutGrid, 
  Library,
  X // Added X icon for clearing search
} from "lucide-react";
import Navbar from "../components/Navbar";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 1. Fetch Movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/movies/all");
        const data = res.data.content || res.data;
        setMovies(data);
        setFilteredMovies(data);
      } catch (err) {
        console.error("Failed to fetch movies", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // 2. Filter Logic
  useEffect(() => {
    let result = movies;
    if (search) {
      result = result.filter((m) =>
        m.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredMovies(result);
  }, [search, movies]);

  return (
    <div className="min-h-screen bg-[#001E2B] text-slate-100 font-sans selection:bg-[#00ED64] selection:text-[#001E2B]">
      <Navbar />

      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00ED64]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pt-32 px-6 pb-20">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#00ED64]">
                <Library size={16} />
                <p className="text-xs font-bold uppercase tracking-widest">Library</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Explore Movies</h1>
          </div>

          {/* Controls Container */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            
            {/* --- IMPROVED SEARCH INPUT --- */}
            <div className="relative group w-full md:w-80 focus-within:md:w-96 transition-all duration-300 ease-out">
              {/* Search Icon */}
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                <Search 
                  size={20} 
                  className="text-slate-500 group-focus-within:text-[#00ED64] transition-colors duration-300" 
                />
              </div>
              
              <input
                type="text"
                placeholder="Find a movie..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0b161e]/80 backdrop-blur-xl border border-slate-700/50 rounded-full pl-12 pr-10 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00ED64] focus:ring-1 focus:ring-[#00ED64] focus:bg-[#021019] shadow-lg group-focus-within:shadow-[0_0_20px_rgba(0,237,100,0.15)] transition-all duration-300"
              />

              {/* Clear Button (Visible only when typing) */}
              {search && (
                <button 
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-white transition-colors"
                >
                  <div className="bg-slate-700/50 rounded-full p-1 hover:bg-slate-600">
                    <X size={14} />
                  </div>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* CONTENT GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-12 h-12 border-4 border-[#00ED64]/20 border-t-[#00ED64] rounded-full animate-spin" />
            <p className="text-slate-500 text-xs uppercase tracking-widest animate-pulse">Loading Content...</p>
          </div>
        ) : (
          <>
            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
                {filteredMovies.map((movie, index) => (
                  <MovieCard key={movie._id || movie.id} movie={movie} index={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 bg-white/5 rounded-3xl border border-dashed border-white/10 backdrop-blur-sm">
                <div className="p-4 bg-white/5 rounded-full mb-4">
                    <Film size={32} className="text-slate-500 opacity-50" />
                </div>
                <h3 className="text-white font-medium text-lg">No movies found</h3>
                <p className="text-slate-500 text-sm mt-1">Try adjusting your search query.</p>
                <button 
                    onClick={() => { setSearch(""); }}
                    className="mt-6 text-[#00ED64] text-xs font-bold uppercase tracking-widest hover:underline"
                >
                    Clear Search
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

/* --- SUB-COMPONENT: MOVIE CARD --- */
const MovieCard = ({ movie, index }) => (
  <Link 
    to={`/watch/${movie._id || movie.id}`}
    className="group relative flex flex-col gap-3"
  >
    {/* Poster Container */}
    <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-slate-800 shadow-2xl transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(0,237,100,0.15)] group-hover:scale-[1.02]">
      
      {/* Image */}
      <img
        src={movie.image || movie.thumbnailUrl || "https://via.placeholder.com/300x450?text=No+Poster"}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-[2px]">
        <div className="w-14 h-14 bg-[#00ED64] rounded-full flex items-center justify-center transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-lg text-[#001E2B]">
          <Play size={24} fill="currentColor" className="ml-1" />
        </div>
        <p className="mt-3 text-white text-xs font-bold uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Watch Now
        </p>
      </div>

      {/* Rating Badge */}
      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
        <Star size={10} className="text-yellow-400" fill="currentColor" />
        <span className="text-[10px] font-bold text-white">{movie.rating || "4.5"}</span>
      </div>
    </div>

    {/* Metadata with Icons */}
    <div className="space-y-1 px-1">
      <h3 className="text-white font-semibold text-base leading-tight truncate group-hover:text-[#00ED64] transition-colors">
        {movie.title}
      </h3>
      
      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-slate-500 text-xs font-medium">
        {/* Year */}
        <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{new Date(movie.releaseDate || Date.now()).getFullYear()}</span>
        </div>

        <span className="w-1 h-1 rounded-full bg-slate-600" />

        {/* Category */}
        <div className="flex items-center gap-1">
            <LayoutGrid size={12} />
            <span className="uppercase">{movie.category || "Action"}</span>
        </div>

        <span className="w-1 h-1 rounded-full bg-slate-600" />

        {/* Duration */}
        <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{movie.duration || "2h 10m"}</span>
        </div>
      </div>
    </div>
  </Link>
);

export default Movies;