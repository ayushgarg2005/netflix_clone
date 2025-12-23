import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import MovieCard from "../components/MovieCard";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/movies/all", {
          credentials: "include",
        });
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.error("Failed to fetch movies", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const featuredMovie = useMemo(() => {
    if (!movies.length) return null;
    return movies.find((m) => !m.isPremium) || movies[0];
  }, [movies]);

  const gridMovies = useMemo(() => movies, [movies]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-neutral-800 border-t-[#e50914] rounded-full animate-spin shadow-lg" />
      </div>
    );
  }

  return (
    <div className="bg-[#141414] min-h-screen text-white overflow-x-hidden selection:bg-[#e50914]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-[60vh] md:h-[65vh] w-full">
        <HeroBanner movie={featuredMovie} />
      </section>

      {/* MAIN CONTENT 
          Changed -mt to pt (padding-top) to move the section down.
          pt-4 to pt-8 gives it a modern, spacious feel.
      */}
      
      <main className="relative z-20 px-6 md:px-14 pb-20 pt-4 md:pt-8 lg:pt-12">
        <section className="space-y-8">
          
          {/* Row Header */}
          <div className="flex items-end justify-between border-b border-white/5 pb-3">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-black tracking-tighter">
                Trending <span className="text-[#e50914]">Now</span>
              </h2>
              <div className="h-1 w-10 bg-[#e50914] rounded-full" />
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
              Browse All
            </button>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
            {gridMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>
      </main>

      <div className="h-24 bg-gradient-to-t from-black to-transparent opacity-40" />
    </div>
  );
};

export default Home;