import { useState } from "react";
import PlayerTopBar from "../components//PlayerTopBar";
import PlayerCenterControls from "../components/PlayerCenterControls";
import PlayerBottomControls from "../components/PlayerBottomControls";

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

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isAdmin) {
      if (video.paused) {
        video.play().catch(() => {});
        socketApi.emitAction({
          type: "play",
          timestamp: video.currentTime,
        });
      } else {
        video.pause();
        socketApi.emitAction({
          type: "pause",
          timestamp: video.currentTime,
        });
      }
    } else {
      // Guest: local control only + mark out of sync
      video.paused ? video.play().catch(() => {}) : video.pause();
      setIsOutOfSync(true);
    }
  };

  const handleSeek = (time) => {
    const video = videoRef.current;
    if (!video) return;

    if (isAdmin) {
      video.currentTime = time;
      socketApi.emitAction({
        type: "seek",
        timestamp: time,
      });
    } else {
      video.currentTime = time;
      setIsOutOfSync(true);
    }
  };

  return (
    <div className="relative flex-1 bg-black flex items-center justify-center">
      {/* VIDEO */}
      <video
        ref={videoRef}
        src={movie?.videoUrl}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        playsInline
        preload="metadata"
        onTimeUpdate={() =>
          setCurrentTime(videoRef.current?.currentTime || 0)
        }
        onLoadedMetadata={() =>
          setDuration(videoRef.current?.duration || 0)
        }
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* PLAYER UI LAYERS */}
      {/* Container blocks clicks, children allow clicks */}
      <div className="absolute inset-0 z-[60] flex flex-col justify-between pointer-events-none">
        
        {/* TOP BAR */}
        <div className="pointer-events-auto">
          <PlayerTopBar movie={movie} onBack={onBack} />
        </div>

        {/* CENTER CONTROLS */}
        <div className="flex-grow flex items-center justify-center">
          <div className="pointer-events-auto">
            <PlayerCenterControls
              isAdmin={isAdmin}
              isPlaying={isPlaying}
              onToggle={togglePlay}
            />
          </div>
        </div>

        {/* BOTTOM CONTROLS */}
        <div className="px-4 pb-4 pointer-events-auto">
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