import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { Check, Settings, Video } from "lucide-react"; // Import necessary icons

import PlayerTopBar from "../components/PlayerTopBar";
import PlayerCenterControls from "../components/PlayerCenterControls";
import PlayerBottomControls from "../components/PlayerBottomControls";

const CONTROLS_HIDE_DELAY = 3000;
const SAVE_INTERVAL = 10000;

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const hideTimerRef = useRef(null);
  const saveTimerRef = useRef(null);

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

  /* ================= FETCH MOVIE & PROGRESS ================= */
  useEffect(() => {
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
      } catch (err) {
        console.error("Failed to load movie", err);
      } finally {
        setLoading(false);
      }
    };
    initPlayer();
  }, [id, navigate]);

  /* ================= PROGRESS SAVING ================= */
  const saveProgress = useCallback(async () => {
    if (!videoRef.current || !id) return;

    const currentPos = Math.round(videoRef.current.currentTime);
    const totalDuration = Math.round(videoRef.current.duration);

    if (currentPos === 0 || isNaN(totalDuration)) return;

    try {
      await axios.post(
        "http://localhost:5000/api/progress/update",
        { videoId: id, progress: currentPos, duration: totalDuration },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  }, [id]);

  useEffect(() => {
    saveTimerRef.current = setInterval(() => {
      if (isPlaying) saveProgress();
    }, SAVE_INTERVAL);

    return () => {
      clearInterval(saveTimerRef.current);
      saveProgress();
    };
  }, [isPlaying, saveProgress]);

  /* ================= VIDEO EVENTS ================= */
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);

    if (currentTime > 0 && !hasResumed) {
      video.currentTime = currentTime;
      setHasResumed(true);
      setShowResumeToast(true);
      setTimeout(() => setShowResumeToast(false), 3000);
    }
  };

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
      saveProgress();
    }
  }, [saveProgress]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  /* ================= KEYBOARD SHORTCUTS ================= */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " ") { e.preventDefault(); togglePlay(); }
      if (e.key === "f") { e.preventDefault(); toggleFullscreen(); }
      if (e.key === "ArrowRight") { videoRef.current.currentTime += 10; }
      if (e.key === "ArrowLeft") { videoRef.current.currentTime -= 10; }
      resetHideTimer();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, toggleFullscreen]);

  /* ================= CONTROLS VISIBILITY ================= */
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (isPlaying && !showSettings) setShowControls(false);
    }, CONTROLS_HIDE_DELAY);
  }, [isPlaying, showSettings]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  if (loading) {
    return (
      <div className="h-screen bg-[#001E2B] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#001E2B] border-t-[#00ED64] rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(0,237,100,0.2)]" />
        <p className="text-[#00ED64] text-xs font-bold uppercase tracking-[0.2em] animate-pulse">Initializing Stream</p>
      </div>
    );
  }

  return (
    <div 
      ref={videoContainerRef}
      onMouseMove={resetHideTimer}
      className={`relative w-screen h-screen bg-black overflow-hidden select-none font-sans ${!showControls && "cursor-none"}`}
    >
      {/* ===== VIDEO ELEMENT ===== */}
      <video
        ref={videoRef}
        src={movie?.videoUrl}
        className="w-full h-full object-contain cursor-pointer"
        autoPlay
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* ===== RESUME TOAST ===== */}
      <AnimatePresence>
        {showResumeToast && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-24 left-10 z-[100] bg-[#001E2B]/80 backdrop-blur-md border-l-4 border-[#00ED64] px-5 py-3 text-white text-sm font-bold shadow-2xl flex items-center gap-3 rounded-r-md"
          >
             <div className="p-1 bg-[#00ED64]/10 rounded-full">
                <Video size={14} className="text-[#00ED64]" />
             </div>
             <div>
                <span className="block text-[#00ED64] text-[10px] uppercase tracking-wider">System</span>
                Resuming playback...
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== OVERLAY CONTROLS ===== */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col justify-between pointer-events-none" // pointer-events-none lets clicks pass through to video for play/pause
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Pointer events auto re-enabled inside children components */}
            <div className="pointer-events-auto">
               <PlayerTopBar movie={movie} onBack={() => { saveProgress(); navigate(-1); }} />
            </div>

            <div className="pointer-events-auto flex-grow relative">
                <PlayerCenterControls 
                  isPlaying={isPlaying} 
                  isBuffering={isBuffering} 
                  onToggle={togglePlay} 
                />
            </div>

            <div className="pointer-events-auto">
               <PlayerBottomControls
                 videoRef={videoRef}
                 isPlaying={isPlaying}
                 onToggle={togglePlay}
                 currentTime={currentTime}
                 duration={duration}
                 onOpenSettings={() => setShowSettings((prev) => !prev)}
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SETTINGS MODAL (Speed Control) ===== */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute bottom-24 right-6 md:right-10 z-[60] w-64 rounded-xl bg-[#021019]/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-3.5 flex items-center gap-2 border-b border-slate-700/50 bg-[#001E2B]/50">
              <Settings size={14} className="text-[#00ED64]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Playback Speed</span>
            </div>
            
            <div className="p-2 space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => { setPlaybackRate(rate); setShowSettings(false); }}
                  className={`
                    w-full px-4 py-2.5 text-left text-sm font-medium rounded-lg transition-all flex items-center justify-between group
                    ${playbackRate === rate 
                      ? "bg-[#00ED64]/10 text-[#00ED64] border border-[#00ED64]/20" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"}
                  `}
                >
                  <span>{rate === 1 ? "Normal" : `${rate}x`}</span>
                  {playbackRate === rate && <Check size={14} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Watch;