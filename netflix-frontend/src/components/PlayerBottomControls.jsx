import { useRef, useState, useEffect, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
} from "lucide-react";

const SEEK_SECONDS = 10;

const PlayerBottomControls = ({
  videoRef,
  isPlaying,
  onToggle,
  currentTime,
  duration,
  onSeek, // <--- We must use this to trigger sync logic
  onOpenSettings,
}) => {
  const progressRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  /* ================= UTILS: FORMAT TIME ================= */
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  /* ================= VOLUME LOGIC ================= */
  useEffect(() => {
    if (!videoRef?.current) return;
    videoRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted, videoRef]);

  const handleVolumeSlide = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  /* ================= PROGRESS LOGIC ================= */
  const progressPercent = useMemo(
    () => (duration ? (currentTime / duration) * 100 : 0),
    [currentTime, duration]
  );

  // FIX: Calculate time but delegate the actual action to the parent
  const handleSeekClick = (e) => {
    if (!progressRef.current || !onSeek) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1);
    const newTime = percent * duration;

    // Call parent handler to ensure Socket emit / Sync state update
    onSeek(newTime);
  };

  // FIX: Helper for Rewind/Forward buttons
  const handleSkip = (seconds) => {
    if (!onSeek) return;
    const newTime = Math.min(Math.max(0, currentTime + seconds), duration);
    onSeek(newTime);
  };

  /* ================= FULLSCREEN LOGIC ================= */
  const toggleFullscreen = async () => {
    if (!videoRef?.current) return;
    const container = videoRef.current.parentElement || videoRef.current;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  return (
    <div className="w-full px-4 md:px-8 pb-6 pt-24 bg-gradient-to-t from-[#001E2B] via-[#001E2B]/80 to-transparent">
      
      {/* 1. PROGRESS BAR CONTAINER */}
      <div 
        className="group relative h-4 flex items-center cursor-pointer mb-4 select-none" 
        onClick={handleSeekClick} // Updated Handler
      >
        {/* Background Rail */}
        <div 
          ref={progressRef}
          className="h-1 w-full bg-white/20 rounded-full overflow-hidden group-hover:h-1.5 transition-all duration-300 ease-out backdrop-blur-sm"
        >
          {/* Active Progress */}
          <div
            className="h-full bg-[#00ED64] relative transition-all duration-100 ease-linear"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Scrubber Dot */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-[#00ED64] rounded-full scale-0 group-hover:scale-100 transition-transform shadow-[0_0_15px_rgba(0,237,100,0.8)] z-10" />
          </div>
        </div>
        
        {/* Hover Highlight */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-full transition-opacity pointer-events-none" />
      </div>

      {/* 2. CONTROLS BAR */}
      <div className="flex justify-between items-center text-slate-200">
        
        {/* LEFT ACTIONS */}
        <div className="flex items-center gap-4">
          
          {/* Play/Pause */}
          <button 
            onClick={onToggle} 
            className="hover:text-white hover:scale-110 transition-all active:scale-95 p-1"
          >
            {isPlaying ? (
              <Pause size={28} fill="currentColor" className="text-[#00ED64]" />
            ) : (
              <Play size={28} fill="currentColor" />
            )}
          </button>

          {/* Seek Buttons (Fixed to use onSeek) */}
          <div className="hidden sm:flex items-center gap-3 text-slate-400">
            <button 
              onClick={() => handleSkip(-SEEK_SECONDS)} 
              className="hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
              title={`Rewind ${SEEK_SECONDS}s`}
            >
              <RotateCcw size={20} />
            </button>
            <button 
              onClick={() => handleSkip(SEEK_SECONDS)} 
              className="hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
              title={`Forward ${SEEK_SECONDS}s`}
            >
              <RotateCw size={20} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 group/volume ml-2">
            <button 
              onClick={toggleMute} 
              className="hover:text-white transition p-1"
            >
              {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            
            <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 ease-in-out">
                <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeSlide}
                className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#00ED64] outline-none"
                />
            </div>
          </div>

          {/* Time Display */}
          <div className="text-xs md:text-sm font-medium tabular-nums select-none text-slate-400">
            <span className="text-white">{formatTime(currentTime)}</span>
            <span className="mx-1.5 opacity-50">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={onOpenSettings} 
            className="p-2 hover:bg-white/10 rounded-full text-slate-300 hover:text-[#00ED64] hover:rotate-45 transition-all duration-500"
          >
            <Settings size={22} />
          </button>

          <button 
            onClick={toggleFullscreen} 
            className="p-2 hover:bg-white/10 rounded-full text-slate-300 hover:text-white hover:scale-110 transition-all"
          >
            {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PlayerBottomControls;