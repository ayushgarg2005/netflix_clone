import { useRef, useState, useEffect, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
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
  const [muted, setMuted] = useState(false);

  /* ================= VOLUME ================= */
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = muted ? 0 : volume;
    videoRef.current.muted = muted;
  }, [volume, muted, videoRef]);

  /* ================= PROGRESS ================= */
  const progress = useMemo(
    () => (duration ? (currentTime / duration) * 100 : 0),
    [currentTime, duration]
  );

  /* ================= SEEK ================= */
  const seekTo = (time) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(
      Math.max(0, time),
      duration
    );
  };

  const seekBy = (seconds) => {
    seekTo(videoRef.current.currentTime + seconds);
  };

  const seekOnBar = (e) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seekTo(percent * duration);
  };

  return (
    <div className="p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
      {/* ===== PROGRESS BAR ===== */}
      <div
        ref={progressRef}
        onClick={seekOnBar}
        className="relative h-1.5 w-full bg-white/20 rounded-full cursor-pointer"
      >
        <div
          className="absolute h-full bg-[#e50914]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ===== CONTROLS ===== */}
      <div className="mt-4 flex justify-between items-center text-white">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button onClick={onToggle}>
            {isPlaying ? <Pause /> : <Play />}
          </button>

          <button onClick={() => seekBy(-SEEK_SECONDS)}>
            <RotateCcw />
          </button>

          <button onClick={() => seekBy(SEEK_SECONDS)}>
            <RotateCw />
          </button>

          <button onClick={() => setMuted(!muted)}>
            {muted ? <VolumeX /> : <Volume2 />}
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5">
          <button onClick={onOpenSettings}>
            <Settings />
          </button>

          <button
            onClick={() =>
              videoRef.current.parentElement.requestFullscreen()
            }
          >
            <Maximize />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerBottomControls;
