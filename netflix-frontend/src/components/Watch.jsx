import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { Check, Settings, Video, Users, Plus, LogIn, X } from "lucide-react"; // ✅ Added Icons
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import PlayerTopBar from "../components/PlayerTopBar";
import PlayerCenterControls from "../components/PlayerCenterControls";
import PlayerBottomControls from "../components/PlayerBottomControls";

const CONTROLS_HIDE_DELAY = 3000;
const SAVE_INTERVAL = 10000;

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ... (Keep existing refs: videoContainerRef, videoRef, etc.)
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const hideTimerRef = useRef(null);
  const saveTimerRef = useRef(null);

  // ... (Keep existing state: movie, loading, isPlaying, etc.)
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasResumed, setHasResumed] = useState(false);
  const [showResumeToast, setShowResumeToast] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  /* ================= NEW STATES ================= */
  const [showPartyModal, setShowPartyModal] = useState(false); // Controls the Create/Join popup
  const [joinRoomId, setJoinRoomId] = useState(""); // Stores input for joining

  /* ================= FETCH DATA (Keep same) ================= */
  useEffect(() => {
    // ... (Your existing fetch logic)
    const initPlayer = async () => {
        try {
          const [movieRes, progressRes] = await Promise.all([
            axios.get(`http://localhost:5000/api/movies/${id}`, { withCredentials: true }),
            axios.get(`http://localhost:5000/api/progress/${id}`, { withCredentials: true })
          ]);
          setMovie(movieRes.data);
          if (progressRes.data && progressRes.data.progress > 5) {
            setCurrentTime(progressRes.data.progress);
          }
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    initPlayer();
  }, [id, navigate]);

  // ... (Keep existing saveProgress and handleLoadedMetadata)
  const saveProgress = useCallback(async () => {
    if (!videoRef.current || !id) return;
    try {
      await axios.post("http://localhost:5000/api/progress/update",
        { videoId: id, progress: Math.round(videoRef.current.currentTime), duration: Math.round(videoRef.current.duration) },
        { withCredentials: true }
      );
    } catch (err) {}
  }, [id]);

  /* ================= NEW: PARTY HANDLERS ================= */
  
  // 1. Open the Modal (Called from Settings)
  const openPartyModal = () => {
    setShowSettings(false); // Close settings
    setIsPlaying(false); // Pause video so they can decide
    setShowPartyModal(true); // Open Party Modal
  };

  // 2. Create New Room
  const handleCreateRoom = async () => {
    saveProgress();
    const roomId = nanoid(8);
    const res=await axios.post("http://localhost:5000/api/room/add", { roomId });
    navigate(`/watchparty/${id}?room=${roomId}`);
  };

  // 3. Join Existing Room
  const handleJoinRoom = async () => {
    const res=await axios.get(`http://localhost:5000/api/room/search/${joinRoomId}`);
    if (!res.data.found) {
      toast.error("Room ID not found!");
      return;
    }
    saveProgress();
    navigate(`/watchparty/${id}?room=${joinRoomId}`);
  };

  // ... (Keep existing togglePlay, toggleFullscreen, etc.)
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play(); setIsPlaying(true); } 
    else { video.pause(); setIsPlaying(false); saveProgress(); }
  }, [saveProgress]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) videoContainerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  }, []);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (isPlaying && !showSettings && !showPartyModal) setShowControls(false); // Don't hide if modal is open
    }, CONTROLS_HIDE_DELAY);
  }, [isPlaying, showSettings, showPartyModal]);


  /* ================= RENDER ================= */
  
  if (loading) return <div className="h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  return (
    <div 
      ref={videoContainerRef}
      onMouseMove={resetHideTimer}
      className={`relative w-screen h-screen bg-black overflow-hidden select-none font-sans ${!showControls && "cursor-none"}`}
    >
      <video
        ref={videoRef}
        src={movie?.videoUrl}
        className="w-full h-full object-contain"
        autoPlay
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration)}
        // ... other events
      />

      {/* ... (Keep Resume Toast and Overlay Controls) ... */}
       <AnimatePresence>
        {showControls && (
          <motion.div className="absolute inset-0 z-50 flex flex-col justify-between pointer-events-none">
             <div className="pointer-events-auto">
                <PlayerTopBar movie={movie} onBack={() => navigate(-1)} />
             </div>
             <div className="pointer-events-auto flex-grow relative">
                <PlayerCenterControls isPlaying={isPlaying} onToggle={togglePlay} />
             </div>
             <div className="pointer-events-auto">
                <PlayerBottomControls
                  videoRef={videoRef}
                  isPlaying={isPlaying}
                  onToggle={togglePlay}
                  currentTime={currentTime}
                  duration={duration}
                  onOpenSettings={() => setShowSettings(!showSettings)}
                />
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SETTINGS MODAL (Updated) ===== */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-24 right-10 z-[60] w-72 rounded-xl bg-[#021019]/95 backdrop-blur-xl border border-slate-700/50 p-2"
          >
            {/* Start Party Button */}
            <button
              onClick={openPartyModal}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 border border-purple-500/30 rounded-lg text-purple-300 font-bold mb-2 group"
            >
                <div className="p-2 bg-purple-600 rounded-full text-white group-hover:scale-110 transition">
                    <Users size={16} />
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-sm">Watch Party</span>
                    <span className="text-[10px] text-purple-400/70">Create or Join</span>
                </div>
            </button>

            {/* Speed Controls (Keep existing) */}
            <div className="px-4 py-2 text-xs font-bold text-white uppercase bg-[#001E2B]/50 rounded">Playback Speed</div>
            <div className="max-h-40 overflow-y-auto mt-2">
               {[0.5, 1, 1.25, 1.5, 2].map(rate => (
                  <button key={rate} onClick={() => setPlaybackRate(rate)} className="block w-full text-left px-4 py-2 text-slate-400 hover:text-white">
                     {rate}x {playbackRate === rate && <Check size={12} className="inline ml-2"/>}
                  </button>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== 🚀 NEW: CREATE / JOIN MODAL ===== */}
      <AnimatePresence>
        {showPartyModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-[#0f0f0f] border border-gray-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative"
             >
                <button 
                  onClick={() => setShowPartyModal(false)} 
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                   <Users className="text-purple-500" /> Watch Party
                </h2>
                <p className="text-gray-400 text-sm mb-6">Watch this movie in sync with friends.</p>

                <div className="space-y-4">
                    {/* OPTION 1: CREATE */}
                    <button 
                      onClick={handleCreateRoom}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-xl hover:border-purple-500 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition">
                                <Plus size={24} />
                            </div>
                            <div className="text-left">
                                <h3 className="text-white font-bold">Create New Room</h3>
                                <p className="text-gray-400 text-xs">Start a new party and invite others</p>
                            </div>
                        </div>
                    </button>

                    <div className="flex items-center gap-4 text-gray-600">
                        <div className="h-[1px] bg-gray-800 flex-1"></div>
                        <span className="text-xs font-bold uppercase">OR</span>
                        <div className="h-[1px] bg-gray-800 flex-1"></div>
                    </div>

                    {/* OPTION 2: JOIN */}
                    <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3 mb-3">
                             <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
                                <LogIn size={16} />
                             </div>
                             <h3 className="text-white font-bold text-sm">Join Existing Room</h3>
                        </div>
                        <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Enter Room ID (e.g. x7k9p)"
                              value={joinRoomId}
                              onChange={(e) => setJoinRoomId(e.target.value)}
                              className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
                            />
                            <button 
                                onClick={handleJoinRoom}
                                disabled={!joinRoomId}
                                className="bg-white text-black font-bold px-4 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Watch;