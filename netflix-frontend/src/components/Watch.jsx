import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

import PlayerTopBar from "../components/PlayerTopBar";
import PlayerCenterControls from "../components/PlayerCenterControls";
import PlayerBottomControls from "../components/PlayerBottomControls";

const CONTROLS_HIDE_DELAY = 3000;

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const hideTimerRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // ✅ SETTINGS STATE
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  /* ================= FETCH MOVIE ================= */
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/movies/${id}`
        );
        setMovie(data);
      } catch (err) {
        console.error("Failed to load movie", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  /* ================= PLAY / PAUSE ================= */
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  /* ================= APPLY SETTINGS ================= */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  /* ================= AUTO HIDE CONTROLS ================= */
  const resetHideTimer = useCallback(() => {
    setShowControls(true);

    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, CONTROLS_HIDE_DELAY);
  }, [isPlaying]);

  useEffect(() => {
    window.addEventListener("mousemove", resetHideTimer);
    window.addEventListener("keydown", resetHideTimer);

    return () => {
      window.removeEventListener("mousemove", resetHideTimer);
      window.removeEventListener("keydown", resetHideTimer);
      clearTimeout(hideTimerRef.current);
    };
  }, [resetHideTimer]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`relative w-screen h-screen bg-black overflow-hidden ${
        !showControls && "cursor-none"
      }`}
    >
      {/* ===== VIDEO ===== */}
      <video
        ref={videoRef}
        src={movie?.videoUrl}
        className="w-full h-full object-contain cursor-pointer"
        autoPlay
        onClick={togglePlay}
        onTimeUpdate={() =>
          setCurrentTime(videoRef.current?.currentTime || 0)
        }
        onLoadedMetadata={() =>
          setDuration(videoRef.current?.duration || 0)
        }
      />

      {/* ===== CONTROLS ===== */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PlayerTopBar
              title={movie?.title}
              onBack={() => navigate(-1)}
            />

            <PlayerCenterControls
              isPlaying={isPlaying}
              onToggle={togglePlay}
            />

            <PlayerBottomControls
              videoRef={videoRef}
              isPlaying={isPlaying}
              onToggle={togglePlay}
              currentTime={currentTime}
              duration={duration}
              onOpenSettings={() =>
                setShowSettings((prev) => !prev)
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SETTINGS PANEL ===== */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="
              absolute bottom-28 right-10 z-[60]
              w-48 rounded-xl
              bg-black/90 backdrop-blur-xl
              border border-white/10
              shadow-xl
              text-white
              overflow-hidden
            "
          >
            <div className="px-4 py-3 text-xs font-bold text-white/60">
              Playback Speed
            </div>

            {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
              <button
                key={rate}
                onClick={() => {
                  setPlaybackRate(rate);
                  setShowSettings(false);
                }}
                className={`
                  w-full px-4 py-2 text-left text-sm
                  hover:bg-white/10 transition
                  ${playbackRate === rate ? "text-[#e50914]" : ""}
                `}
              >
                {rate}x
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Watch;
