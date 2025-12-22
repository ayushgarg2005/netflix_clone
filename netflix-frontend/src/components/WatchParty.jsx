import { useEffect, useRef } from "react";
import { socket } from "../socket.js";

function WatchParty({ roomId }) {
  const videoRef = useRef(null);

  useEffect(() => {
    socket.emit("join-room", { roomId });

    socket.on("sync-state", ({ isPlaying, currentTime }) => {
      videoRef.current.currentTime = currentTime;
      isPlaying ? videoRef.current.play() : videoRef.current.pause();
    });

    socket.on("play", (time) => {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    });

    socket.on("pause", (time) => {
      videoRef.current.currentTime = time;
      videoRef.current.pause();
    });

    socket.on("seek", (time) => {
      videoRef.current.currentTime = time;
    });

    return () => socket.disconnect();
  }, []);

  const handlePlay = () => {
    socket.emit("play", {
      roomId,
      time: videoRef.current.currentTime,
    });
  };

  const handlePause = () => {
    socket.emit("pause", {
      roomId,
      time: videoRef.current.currentTime,
    });
  };

  const handleSeek = () => {
    socket.emit("seek", {
      roomId,
      time: videoRef.current.currentTime,
    });
  };

  return (
    <video
      ref={videoRef}
      src="C:\Users\ASUS\OneDrive\Desktop\Netflix_Project\netflix_backend\netflix-frontend\src\components\Screen Recording 2025-04-06 192219.mp4"
      controls
      onPlay={handlePlay}
      onPause={handlePause}
      onSeeked={handleSeek}
    />
  );
}

export default WatchParty;