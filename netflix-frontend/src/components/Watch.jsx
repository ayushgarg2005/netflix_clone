import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { 
   Users, Plus, LogIn, X
} from "lucide-react"; 
import { nanoid } from "nanoid";
import toast from "react-hot-toast";

// Components
import PlayerTopBar from "../components/PlayerTopBar";
import PlayerCenterControls from "../components/PlayerCenterControls";
import PlayerBottomControls from "../components/PlayerBottomControls";
import PlayBack from "./PlayBack";

const CONTROLS_HIDE_DELAY = 3000;

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Refs
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const hideTimerRef = useRef(null);

  // State
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  
  // Progress & Duration
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Settings & Party
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState("");

  /* ================= 1. FETCH & INIT ================= */
  useEffect(() => {
    const initPlayer = async () => {
      try {
        const [movieRes, progressRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/movies/${id}`, { withCredentials: true }),
          axios.get(`http://localhost:5000/api/progress/${id}`, { withCredentials: true }),
        ]);

        setMovie(movieRes.data);

        // Seek video element immediately if progress exists
        if (progressRes.data && progressRes.data.progress > 5) {
          setCurrentTime(progressRes.data.progress);
          if (videoRef.current) {
            videoRef.current.currentTime = progressRes.data.progress;
          }
        }
      } catch (err) {
        console.error("Init Error:", err);
        toast.error("Failed to load video data");
      } finally {
        setLoading(false);
      }
    };
    initPlayer();
  }, [id]);

  /* ================= 2. HELPERS ================= */
  const saveProgress = useCallback(async () => {
    if (!videoRef.current || !id) return;
    try {
      await axios.post(
        "http://localhost:5000/api/progress/update",
        {
          videoId: id,
          progress: Math.round(videoRef.current.currentTime),
          duration: Math.round(videoRef.current.duration || 0),
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Save Error:", err);
    }
  }, [id]);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    
    // Only auto-hide if playing and no modals are open
    if (isPlaying && !showSettings && !showPartyModal) {
      hideTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, CONTROLS_HIDE_DELAY);
    }
  }, [isPlaying, showSettings, showPartyModal]);

  /* ================= 3. PLAYER CONTROLS ================= */
  
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(e => console.error("Play error:", e));
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
      saveProgress();
    }
    resetHideTimer();
  }, [saveProgress, resetHideTimer]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen().catch(e => console.error(e));
    } else {
      document.exitFullscreen().catch(e => console.error(e));
    }
  }, []);

  // Skip Forward 10s
  const skipForward = useCallback(() => {
    if (videoRef.current) {
      const newTime = Math.min(videoRef.current.currentTime + 10, videoRef.current.duration);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      resetHideTimer();
    }
  }, [resetHideTimer]);

  // Skip Backward 10s
  const skipBackward = useCallback(() => {
    if (videoRef.current) {
      const newTime = Math.max(videoRef.current.currentTime - 10, 0);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      resetHideTimer();
    }
  }, [resetHideTimer]);

  // Handle Seeking (Progress Bar)
  const handleSeek = useCallback((time) => {
    if (videoRef.current) {
      const newTime = Math.min(Math.max(0, time), videoRef.current.duration);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      resetHideTimer();
    }
  }, [resetHideTimer]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent scrolling for Space/Arrows
      if(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
      }

      switch(e.key) {
        case " ":
        case "k":
        case "K":
          togglePlay();
          break;
        case "ArrowRight":
        case "l":
        case "L":
          skipForward();
          break;
        case "ArrowLeft":
        case "j":
        case "J":
          skipBackward();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        default: 
          break;
      }
      resetHideTimer();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, skipForward, skipBackward, toggleFullscreen, resetHideTimer]);

  // Sync Playback Rate
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  /* ================= 4. PARTY HANDLERS ================= */

  const openPartyModal = () => {
    setShowSettings(false);
    if (videoRef.current) videoRef.current.pause();
    setIsPlaying(false);
    setShowPartyModal(true);
  };

  const handleCreateRoom = async () => {
    try {
      await saveProgress();
      const roomId = nanoid(8);
      
      const adminRes = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true });
      if (!adminRes.data?.user?.id) throw new Error("Not Authenticated");

      await axios.post("http://localhost:5000/api/room/add", {
        roomId: roomId,
        movieId: id,
        adminId: adminRes.data.user.id,
      });

      navigate(`/watchparty/${id}?room=${roomId}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create party");
    }
  };

  const handleJoinRoom = async () => {
    if (!joinRoomId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/room/search/${joinRoomId}`);
      
      if (!res.data.found) {
        toast.error("Room ID not found!");
        return;
      }
      
      await saveProgress();
      navigate(`/watchparty/${id}?room=${joinRoomId}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to join party");
    }
  };

  /* ================= 5. RENDER ================= */

  if (loading)
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  return (
    <div
      ref={videoContainerRef}
      onMouseMove={resetHideTimer}
      onClick={resetHideTimer}
      className={`relative w-screen h-screen bg-black overflow-hidden select-none font-sans ${
        !showControls && !showSettings && !showPartyModal ? "cursor-none" : ""
      }`}
    >
      <video
        ref={videoRef}
        src={movie?.videoUrl}
        className="w-full h-full object-contain"
        autoPlay
        playsInline
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={() => {
          setDuration(videoRef.current?.duration);
          if (videoRef.current) videoRef.current.playbackRate = playbackRate;
        }}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* OVERLAY CONTROLS */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col justify-between pointer-events-none"
          >
            {/* Top Bar */}
            <div className="pointer-events-auto bg-gradient-to-b from-black/70 to-transparent p-4">
              <PlayerTopBar movie={movie} onBack={() => navigate(-1)} />
            </div>
            
            {/* Center Controls */}
            <div className="pointer-events-auto flex-grow relative flex items-center justify-center">
              <PlayerCenterControls
                isPlaying={isPlaying}
                onToggle={togglePlay}
                onForward={skipForward}   
                onBackward={skipBackward} 
              />
            </div>
            
            {/* Bottom Controls */}
            <div className="pointer-events-auto bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pb-6">
              <PlayerBottomControls
                videoRef={videoRef}
                isPlaying={isPlaying}
                onToggle={togglePlay}
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek} 
                onOpenSettings={() => setShowSettings(!showSettings)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SETTINGS MODAL */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-28 right-10 z-[60] w-72 rounded-xl bg-[#021019]/95 backdrop-blur-xl border border-slate-700/50 p-4 shadow-2xl"
          >
            <button
              onClick={openPartyModal}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 border border-purple-500/30 rounded-lg text-purple-300 font-bold mb-4 group transition-all"
            >
              <div className="p-2 bg-purple-600 rounded-full text-white group-hover:scale-110 transition">
                <Users size={16} />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm">Watch Party</span>
                <span className="text-[10px] text-purple-400/70">Create or Join</span>
              </div>
            </button>
            <PlayBack playbackRate={playbackRate} setPlaybackRate={setPlaybackRate} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* WATCH PARTY MODAL */}
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
              <p className="text-gray-400 text-sm mb-6">
                Watch this movie in sync with friends.
              </p>

              <div className="space-y-4">
                {/* CREATE */}
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

                {/* DIVIDER */}
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="h-[1px] bg-gray-800 flex-1"></div>
                  <span className="text-xs font-bold uppercase">OR</span>
                  <div className="h-[1px] bg-gray-800 flex-1"></div>
                </div>

                {/* JOIN */}
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
                      placeholder="Enter Room ID"
                      value={joinRoomId}
                      onChange={(e) => setJoinRoomId(e.target.value)}
                      className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
                    />
                    <button
                      onClick={handleJoinRoom}
                      disabled={!joinRoomId}
                      className="bg-white text-black font-bold px-4 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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