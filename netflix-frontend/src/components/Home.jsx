// import { useEffect, useMemo, useState } from "react";
// import { motion } from "framer-motion";
// import Navbar from "../components/Navbar";
// import HeroBanner from "../components/HeroBanner";
// import MovieCard from "../components/MovieCard";

// const Home = () => {
//   const [videos, setVideos] = useState([]);
//   const [continueWatching, setContinueWatching] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [videoRes, progressRes] = await Promise.all([
//           fetch("http://localhost:5000/api/movies/all", { credentials: "include" }),
//           fetch("http://localhost:5000/api/progress/continue-watching", { credentials: "include" })
//         ]);

//         const videoData = await videoRes.json();
//         const progressData = await progressRes.json();

//         setVideos(Array.isArray(videoData) ? videoData : []);
//         setContinueWatching(Array.isArray(progressData) ? progressData : []);
//       } catch (error) {
//         console.error("Fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const featuredMovie = useMemo(() => {
//     if (!videos.length) return null;
//     // Prioritize non-premium content for the banner
//     return videos.find((m) => !m.isPremium) || videos[0];
//   }, [videos]);

//   // Animation Variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { y: 0, opacity: 1 }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#141414] flex items-center justify-center">
//         <div className="w-16 h-16 border-4 border-white/5 border-t-[#e50914] rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#141414] min-h-screen text-white overflow-x-hidden selection:bg-[#e50914] selection:text-white">
//       <Navbar />

//       {/* HERO SECTION */}
//       <section className="relative h-[75vh] md:h-[85vh] lg:h-[95vh] w-full">
//         <HeroBanner movies={videos.slice(0, 5)} />
//         {/* Cinematic Blend Overlay */}
//         <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent z-10" />
//       </section>

//       {/* MAIN CONTENT AREA */}
//       <main className="relative z-20 px-6 md:px-14 pb-20 -mt-24 md:-mt-32 space-y-8">
        
//         {/* CONTINUE WATCHING SECTION */}
//         {continueWatching.length > 0 && (
//           <motion.section 
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={containerVariants}
//             className="space-y-6"
//           >
//             <div className="flex items-end justify-between">
//               <div className="space-y-1">
//                 <span className="text-[#e50914] text-xs font-black uppercase tracking-[0.3em]">Resume</span>
//                 <h2 className="text-xl md:text-2xl font-bold tracking-tighter">Continue Watching</h2>
//               </div>
//             </div>
            
//             <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x">
//               {continueWatching.map((item) => (
//                 <motion.div 
//                   variants={itemVariants}
//                   key={item._id} 
//                   className="flex-shrink-0 w-44 sm:w-52 md:w-64 lg:w-72 snap-start"
//                 >
//                   <MovieCard
//                     movie={item.videoId} 
//                     progress={item.progress}
//                     showProgress={true}
//                   />
//                 </motion.div>
//               ))}
//             </div>
//           </motion.section>
//         )}

//         {/* TRENDING SECTION */}
//         <motion.section 
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, margin: "-100px" }}
//           variants={containerVariants}
//           className="space-y-8"
//         >
//           <div className="flex items-end justify-between border-b border-white/10 pb-4">
//              <div className="space-y-1">
//                 <span className="text-gray-500 text-xs font-black uppercase tracking-[0.3em]">Popular</span>
//                 <h2 className="text-xl md:text-2xl font-bold tracking-tighter">Trending Now</h2>
//              </div>
//              <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#e50914] transition-colors">
//                Explore All
//              </button>
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-5 gap-y-12">
//             {videos.map((v) => (
//               <motion.div variants={itemVariants} key={v._id}>
//                 <MovieCard movie={v} />
//               </motion.div>
//             ))}
//           </div>
//         </motion.section>
//       </main>

//       {/* FOOTER SPACER */}
//       <footer className="py-10 text-center border-t border-white/5 opacity-30 text-[10px] uppercase tracking-[0.5em]">
//         &copy; {new Date().getFullYear()} YourStreamingService. All Rights Reserved.
//       </footer>
//     </div>
//   );
// };

// export default Home;




import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import MovieCard from "../components/MovieCard";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [recommendations, setRecommendations] = useState([]); // ✅ NEW STATE
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ FETCH RECOMMENDATIONS IN PARALLEL
        const [videoRes, progressRes, recRes] = await Promise.all([
          fetch("http://localhost:5000/api/movies/all", { credentials: "include" }),
          fetch("http://localhost:5000/api/progress/continue-watching", { credentials: "include" }),
          fetch("http://localhost:5000/api/movies/recommendations", { credentials: "include" }) // ✅ NEW CALL
        ]);

        const videoData = await videoRes.json();
        const progressData = await progressRes.json();
        const recData = await recRes.json();

        setVideos(Array.isArray(videoData) ? videoData : []);
        setContinueWatching(Array.isArray(progressData) ? progressData : []);
        setRecommendations(Array.isArray(recData) ? recData : []); // ✅ SET DATA
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredMovie = useMemo(() => {
    if (!videos.length) return null;
    return videos.find((m) => !m.isPremium) || videos[0];
  }, [videos]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/5 border-t-[#e50914] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#141414] min-h-screen text-white overflow-x-hidden selection:bg-[#e50914] selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-[75vh] md:h-[85vh] lg:h-[95vh] w-full">
        <HeroBanner movies={videos.slice(0, 5)} />
        {/* Cinematic Blend Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent z-10" />
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-20 px-6 md:px-14 pb-20 -mt-24 md:-mt-32 space-y-12">
        
        {/* 1. CONTINUE WATCHING SECTION */}
        {continueWatching.length > 0 && (
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-6"
          >
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <span className="text-[#e50914] text-xs font-black uppercase tracking-[0.3em]">Resume</span>
                <h2 className="text-xl md:text-2xl font-bold tracking-tighter">Continue Watching</h2>
              </div>
            </div>
            
            <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x">
              {continueWatching.map((item) => (
                <motion.div 
                  variants={itemVariants}
                  key={item._id} 
                  className="flex-shrink-0 w-44 sm:w-52 md:w-64 lg:w-72 snap-start"
                >
                  <MovieCard
                    movie={item.videoId} 
                    progress={item.progress}
                    showProgress={true}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* 2. ✅ RECOMMENDED FOR YOU (AI POWERED) */}
        {recommendations.length > 0 && (
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="space-y-6"
          >
             <div className="flex items-end justify-between">
               <div className="space-y-1">
                  <span className="text-green-500 text-xs font-black uppercase tracking-[0.3em]">For You</span>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tighter">Because you watched...</h2>
               </div>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10">
               {recommendations.map((v) => (
                 <motion.div variants={itemVariants} key={v._id}>
                   <MovieCard movie={v} />
                 </motion.div>
               ))}
             </div>
          </motion.section>
        )}

        {/* 3. TRENDING SECTION */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="space-y-8"
        >
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
             <div className="space-y-1">
                <span className="text-gray-500 text-xs font-black uppercase tracking-[0.3em]">Popular</span>
                <h2 className="text-xl md:text-2xl font-bold tracking-tighter">Trending Now</h2>
             </div>
             <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#e50914] transition-colors">
               Explore All
             </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-5 gap-y-12">
            {videos.map((v) => (
              <motion.div variants={itemVariants} key={v._id}>
                <MovieCard movie={v} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* FOOTER */}
      <footer className="py-10 text-center border-t border-white/5 opacity-30 text-[10px] uppercase tracking-[0.5em]">
        &copy; {new Date().getFullYear()} Streamflix. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Home;