import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

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
          // Store time but don't apply until metadata loads
          setCurrentTime(progressRes.data.progress);
        }
      } catch (err) {
        console.error("Failed to load movie", err);
        // navigate("/home"); // Optional: redirect on error
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
      <div className="h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/5 border-t-[#e50914] rounded-full animate-spin mb-6" />
        <p className="text-white/40 text-xs font-black uppercase tracking-[0.4em] animate-pulse">Initializing Player</p>
      </div>
    );
  }

  return (
    <div 
      ref={videoContainerRef}
      onMouseMove={resetHideTimer}
      className={`relative w-screen h-screen bg-black overflow-hidden select-none ${!showControls && "cursor-none"}`}
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
            className="absolute top-24 left-10 z-[100] bg-black/60 backdrop-blur-md border-l-4 border-[#e50914] px-4 py-2 text-white text-sm font-bold shadow-2xl"
          >
            Resuming from where you left off...
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== OVERLAY CONTROLS ===== */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Top Bar with Dynamic Movie Info */}
            <PlayerTopBar movie={movie} onBack={() => { saveProgress(); navigate(-1); }} />

            {/* Center: Play/Pause/Buffering */}
            <PlayerCenterControls 
              isPlaying={isPlaying} 
              isBuffering={isBuffering} 
              onToggle={togglePlay} 
            />

            {/* Bottom: Seek, Volume, Fullscreen, Settings */}
            <PlayerBottomControls
              videoRef={videoRef}
              isPlaying={isPlaying}
              onToggle={togglePlay}
              currentTime={currentTime}
              duration={duration}
              onOpenSettings={() => setShowSettings((prev) => !prev)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SETTINGS MODAL ===== */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-28 right-10 z-[60] w-56 rounded-2xl bg-[#141414]/95 backdrop-blur-2xl border border-white/10 shadow-2xl text-white overflow-hidden"
          >
            <div className="px-5 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/5">
              Playback Speed
            </div>
            <div className="p-2">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => { setPlaybackRate(rate); setShowSettings(false); }}
                  className={`
                    w-full px-4 py-3 text-left text-sm font-bold rounded-lg transition-all
                    ${playbackRate === rate ? "bg-[#e50914] text-white" : "hover:bg-white/5 text-gray-400"}
                  `}
                >
                  {rate === 1 ? "Normal" : `${rate}x`}
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