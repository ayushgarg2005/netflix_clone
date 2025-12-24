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
    if (!videoRef.current) return;
    videoRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted, videoRef]);

  const handleVolumeSlide = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (value > 0) setIsMuted(false);
    else setIsMuted(true);
  };

  /* ================= PROGRESS LOGIC ================= */
  const progressPercent = useMemo(
    () => (duration ? (currentTime / duration) * 100 : 0),
    [currentTime, duration]
  );

  const handleSeek = (e) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1);
    videoRef.current.currentTime = percent * duration;
  };

  /* ================= FULLSCREEN LOGIC ================= */
  const toggleFullscreen = () => {
    const container = videoRef.current.parentElement;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="w-full px-6 pb-8 pt-20 bg-gradient-to-t from-black via-black/70 to-transparent">
      
      {/* 1. PROGRESS BAR CONTAINER */}
      <div className="group relative h-6 flex items-center cursor-pointer mb-2" onClick={handleSeek}>
        {/* Background Rail */}
        <div 
          ref={progressRef}
          className="h-1 w-full bg-white/30 rounded-full overflow-hidden group-hover:h-1.5 transition-all"
        >
          {/* Active Progress */}
          <div
            className="h-full bg-[#e50914] relative"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Scrubber Dot (Netflix style) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-[#e50914] rounded-full scale-0 group-hover:scale-100 transition-transform shadow-[0_0_10px_rgba(229,9,20,0.8)]" />
          </div>
        </div>
      </div>

      {/* 2. CONTROLS BAR */}
      <div className="flex justify-between items-center text-white">
        
        {/* LEFT ACTIONS */}
        <div className="flex items-center gap-2 md:gap-6">
          {/* Play/Pause */}
          <button onClick={onToggle} className="hover:scale-110 transition active:scale-90 p-1">
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
          </button>

          {/* Seek Back/Forward */}
          <div className="flex items-center gap-4">
            <button onClick={() => (videoRef.current.currentTime -= SEEK_SECONDS)} className="hover:text-gray-300 transition">
              <RotateCcw size={24} />
            </button>
            <button onClick={() => (videoRef.current.currentTime += SEEK_SECONDS)} className="hover:text-gray-300 transition">
              <RotateCw size={24} />
            </button>
          </div>

          {/* Volume Control Group */}
          <div className="flex items-center gap-2 group/volume ml-2">
            <button onClick={() => setIsMuted(!isMuted)} className="hover:text-gray-300 transition p-1">
              {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            
            {/* Slider that expands on hover */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeSlide}
              className="w-0 overflow-hidden group-hover/volume:w-24 transition-all accent-[#e50914] cursor-pointer h-1"
            />
          </div>

          {/* Time Display */}
          <div className="text-sm font-medium tabular-nums select-none ml-2">
            <span>{formatTime(currentTime)}</span>
            <span className="mx-1 opacity-50">/</span>
            <span className="opacity-70">{formatTime(duration)}</span>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Settings */}
          <button 
            onClick={onOpenSettings} 
            className="hover:rotate-45 transition-transform duration-300 p-1"
          >
            <Settings size={24} />
          </button>

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} className="hover:scale-110 transition p-1">
            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PlayerBottomControls;