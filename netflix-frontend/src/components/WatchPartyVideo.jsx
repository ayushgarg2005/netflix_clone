import { useState, useRef, useEffect, useCallback } from "react";
import PlayerTopBar from "../components/PlayerTopBar";
import PlayerCenterControls from "../components/PlayerCenterControls";
import PlayerBottomControls from "../components/PlayerBottomControls";
import { Crown } from "lucide-react";

const CONTROLS_HIDE_DELAY = 3000;

const WatchPartyVideo = ({
  movie,
  videoRef,
  isAdmin,
  setIsOutOfSync,
  socketApi,
  onBack,
  toggleChat,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Visibility State
  const [showControls, setShowControls] = useState(true);
  const hideTimerRef = useRef(null);

  // 1. Controls Visibility Logic
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    if (isPlaying) {
      hideTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, CONTROLS_HIDE_DELAY);
    }
  }, [isPlaying]);

  useEffect(() => {
    resetHideTimer();
    return () => clearTimeout(hideTimerRef.current);
  }, [isPlaying, resetHideTimer]);

  // 2. Playback Handlers
  const togglePlay = (e) => {
    // Prevent double-toggling if clicking a button that bubbles up
    if (e) e.stopPropagation();

    const video = videoRef.current;
    if (!video) return;

    if (isAdmin) {
      if (video.paused) {
        video.play().catch(() => {});
        socketApi.emitAction({ type: "play", timestamp: video.currentTime });
      } else {
        video.pause();
        socketApi.emitAction({ type: "pause", timestamp: video.currentTime });
      }
    } else {
      video.paused ? video.play().catch(() => {}) : video.pause();
      setIsOutOfSync(true);
    }
    resetHideTimer();
  };

  const handleSeek = (time) => {
    const video = videoRef.current;
    if (!video) return;

    if (isAdmin) {
      video.currentTime = time;
      socketApi.emitAction({ type: "seek", timestamp: time });
    } else {
      video.currentTime = time;
      setIsOutOfSync(true);
    }
    resetHideTimer();
  };

  return (
    <div 
      className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden selection:bg-[#00ED64] selection:text-[#001E2B] ${!showControls ? 'cursor-none' : ''}`}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={resetHideTimer}
    >
      
      {/* VIDEO ELEMENT */}
      <video
        ref={videoRef}
        src={movie?.videoUrl}
        className="w-full h-full object-contain outline-none"
        onClick={togglePlay}
        playsInline
        preload="metadata"
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* CINEMATIC OVERLAY */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none transition-opacity duration-300 ease-in-out z-10 ${showControls ? "opacity-100" : "opacity-0"}`} 
      />

      {/* PLAYER UI LAYER */}
      {/* pointer-events-none ensures clicks on empty areas go to the video */}
      <div className={`absolute inset-0 z-20 flex flex-col justify-between pointer-events-none transition-opacity duration-300 ease-in-out ${showControls ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        
        {/* TOP BAR */}
        <div className="w-full p-6 pointer-events-auto flex justify-between items-start">
          <PlayerTopBar movie={movie} onBack={onBack} />
          
          {/* Host Badge */}
          {isAdmin && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00ED64]/90 backdrop-blur-md text-[#001E2B] rounded-full shadow-[0_0_15px_rgba(0,237,100,0.3)] border border-[#00ED64]/50">
                <Crown size={14} fill="currentColor" strokeWidth={2.5} />
                <span className="text-[10px] font-extrabold uppercase tracking-widest">Host</span>
            </div>
          )}
        </div>

        {/* CENTER CONTROLS */}
        <div className="flex-grow flex items-center justify-center">
          {/* pointer-events-auto ensures the play button itself IS clickable */}
          <div className="pointer-events-auto transform transition-transform duration-200 hover:scale-110 drop-shadow-2xl">
            <PlayerCenterControls
              isAdmin={isAdmin}
              isPlaying={isPlaying}
              onToggle={togglePlay}
            />
          </div>
        </div>

        {/* BOTTOM CONTROLS */}
        <div className="w-full px-8 pb-8 pt-12 pointer-events-auto">
          <PlayerBottomControls
            isAdmin={isAdmin}
            videoRef={videoRef}
            isPlaying={isPlaying}
            onToggle={togglePlay}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            onOpenSettings={toggleChat}
          />
        </div>
      </div>
    </div>
  );
};

export default WatchPartyVideo;