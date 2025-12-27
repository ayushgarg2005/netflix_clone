import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, PlayCircle, TrendingUp, ArrowRight, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import MovieCard from "../components/MovieCard";

// ✅ Updated Row Component: Buttons fixed to sides, Gaps added
const SectionRow = ({ title, icon: Icon, movies, isLarge = false, showProgress = false }) => {
  const rowRef = useRef(null);
  const [isMoved, setIsMoved] = useState(false);

  if (!movies || movies.length === 0) return null;

  const handleClick = (direction) => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="space-y-4 py-8 group/row relative z-20"
    >
      {/* Section Header */}
      <div className="px-12 flex items-end justify-between mb-4">
        <div className="flex items-center gap-3">
           <div className="w-1 h-6 bg-[#00ED64] rounded-full shadow-[0_0_10px_#00ED64]" />
           <div className="flex items-center gap-2 text-white">
             {Icon && <Icon className="text-[#00ED64]" size={20} />}
             <h2 className="text-xl md:text-2xl font-bold tracking-tight hover:text-[#00ED64] transition-colors cursor-pointer">
               {title}
             </h2>
           </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#00ED64] transition-colors cursor-pointer group/btn">
           View All <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Slider Container - Relative for positioning buttons */}
      <div className="relative group/slider w-full">
        
        {/* Left Arrow Button - Fixed to Left Edge */}
        <div 
            className={`
              absolute top-0 bottom-0 left-0 z-40 
              w-12 h-full 
              flex items-center justify-center 
              bg-[#001E2B]/80 backdrop-blur-sm
              cursor-pointer 
              opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300
              hover:bg-[#00ED64]/10 border-r border-white/5
              ${!isMoved && "hidden"} 
            `}
            onClick={() => handleClick("left")}
        >
            <ChevronLeft className="text-white hover:text-[#00ED64] hover:scale-125 transition-all" size={32} />
        </div>

        {/* Scrollable Area - Added px-12 for the gap on sides */}
        <div 
          ref={rowRef}
          className="
            flex gap-4 md:gap-6 overflow-x-scroll 
            px-12 
            no-scrollbar scroll-smooth
            w-full
          "
        >
          {movies.map((movie) => (
            <div 
              key={movie._id} 
              className={`
                flex-shrink-0 transition-transform duration-300
                ${isLarge ? "w-[280px] md:w-[350px]" : "w-[200px] md:w-[240px]"}
              `}
            >
              <MovieCard 
                movie={isLarge ? movie.videoId : movie} 
                progress={showProgress ? movie.progress : 0}
                showProgress={showProgress}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow Button - Fixed to Right Edge */}
        <div 
            className="
              absolute top-0 bottom-0 right-0 z-40 
              w-12 h-full 
              flex items-center justify-center 
              bg-[#001E2B]/80 backdrop-blur-sm
              cursor-pointer 
              opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300
              hover:bg-[#00ED64]/10 border-l border-white/5
            "
            onClick={() => handleClick("right")}
        >
            <ChevronRight className="text-white hover:text-[#00ED64] hover:scale-125 transition-all" size={32} />
        </div>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videoRes, progressRes, recRes] = await Promise.all([
          fetch("http://localhost:5000/api/movies/all", { credentials: "include" }),
          fetch("http://localhost:5000/api/progress/continue-watching", { credentials: "include" }),
          fetch("http://localhost:5000/api/movies/recommendations", { credentials: "include" })
        ]);

        const videoData = await videoRes.json();
        const progressData = await progressRes.json();
        const recData = await recRes.json();

        setVideos(Array.isArray(videoData) ? videoData : []);
        setContinueWatching(Array.isArray(progressData) ? progressData : []);
        setRecommendations(Array.isArray(recData) ? recData : []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001E2B] flex items-center justify-center">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-[#001E2B] border-t-[#00ED64] rounded-full animate-spin" />
            <div className="absolute inset-0 bg-[#00ED64] opacity-20 blur-xl rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#001E2B] min-h-screen text-slate-100 font-sans selection:bg-[#00ED64] selection:text-[#001E2B] overflow-x-hidden">
      <Navbar />

      {/* 1. GLOBAL BACKGROUND FX */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00ED64] opacity-[0.03] blur-[150px] rounded-full" />
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative z-10 w-full pt-6">
        <HeroBanner movies={videos.slice(0, 5)} />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#001E2B] via-[#001E2B]/80 to-transparent pointer-events-none z-20" />
      </section>

      {/* 3. MAIN CONTENT STACK */}
      <main className="relative z-20 pb-20 space-y-2 md:space-y-12 -mt-10 md:-mt-12">
        {continueWatching.length > 0 && (
          <SectionRow title="Continue Watching" icon={PlayCircle} movies={continueWatching} isLarge={true} showProgress={true} />
        )}
        {recommendations.length > 0 && (
          <SectionRow title="Recommended For You" icon={Sparkles} movies={recommendations} />
        )}
        <SectionRow title="Trending Now" icon={Flame} movies={videos} />
        <SectionRow title="New Releases" icon={TrendingUp} movies={[...videos].reverse()} />
      </main>

      {/* 4. FOOTER */}
      <footer className="relative z-20 py-16 border-t border-slate-800 bg-[#021019]">
        <div className="container mx-auto px-6 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 mb-8 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                <div className="w-8 h-8 bg-[#00ED64] rounded-lg flex items-center justify-center text-[#001E2B] font-bold text-lg shadow-[0_0_15px_rgba(0,237,100,0.3)]">S</div>
                <span className="text-white font-bold text-xl tracking-tight">Streamflix</span>
            </div>
            <p className="text-slate-600 text-xs uppercase tracking-widest font-semibold">
                &copy; {new Date().getFullYear()} Streamflix Inc. Engineered for Performance.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;