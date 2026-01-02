import { useEffect, useRef } from "react";
import io from "socket.io-client";
import toast from "react-hot-toast";

const socket = io("http://localhost:5000");

const useWatchPartySocket = ({
  roomId,
  videoRef,
  isAdmin,
  hasJoined,
  isOutOfSync,    // <--- NEW: Accept the boolean value
  setIsOutOfSync,
  setMessages,
}) => {
  const isRemoteUpdate = useRef(false);
  
  // Keep a Ref of the sync state so the socket listener always sees the latest value
  const isOutOfSyncRef = useRef(isOutOfSync);
  useEffect(() => {
    isOutOfSyncRef.current = isOutOfSync;
  }, [isOutOfSync]);

  // --- 1. Socket Event Listeners ---
  useEffect(() => {
    if (!roomId || !hasJoined) return;

    socket.emit("join_room", roomId);

    socket.on("request_sync_from_host", ({ requesterId }) => {
      if (!isAdmin || !videoRef.current) return;
      socket.emit("send_sync_state", {
        requesterId,
        timestamp: videoRef.current.currentTime,
        isPlaying: !videoRef.current.paused,
      });
    });

    socket.on("receive_sync_state", (data) => {
      if (!videoRef.current) return;
      isRemoteUpdate.current = true;
      
      // Force sync (This always runs because it's a manual "Sync with Host" request)
      videoRef.current.currentTime = data.timestamp;
      data.isPlaying ? videoRef.current.play().catch(() => {}) : videoRef.current.pause();
      
      toast.success("Synced with host");
      setIsOutOfSync(false);
      setTimeout(() => (isRemoteUpdate.current = false), 500);
    });

    socket.on("receive_video_action", (data) => {
      if (isAdmin || !videoRef.current) return;
      
      // CRITICAL CHANGE: 
      // If user is out of sync, ignore ALL host actions (Play/Pause/Seek).
      // They are in their own timeline now.
      if (isOutOfSyncRef.current) return;

      isRemoteUpdate.current = true;

      // Sync time if needed
      if (data.timestamp !== undefined && Math.abs(videoRef.current.currentTime - data.timestamp) > 0.5) {
        videoRef.current.currentTime = data.timestamp;
      }

      if (data.type === "play") videoRef.current.play().catch(() => {});
      if (data.type === "pause") videoRef.current.pause();
      if (data.type === "seek") videoRef.current.currentTime = data.timestamp;

      setTimeout(() => (isRemoteUpdate.current = false), 500);
    });

    socket.on("receive_message", (msg) =>
      setMessages((prev) => [...prev, msg])
    );

    return () => socket.removeAllListeners();
  }, [roomId, hasJoined, isAdmin, setIsOutOfSync, setMessages, videoRef]);


  // --- 2. Drift Detection ---
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || isAdmin) return;

    const handleManualInteraction = () => {
      if (!isRemoteUpdate.current) {
        setIsOutOfSync(true);
      }
    };

    videoEl.addEventListener("seeking", handleManualInteraction);
    // Optional: You can also add 'pause' here if you want pausing to trigger desync immediately
    // videoEl.addEventListener("pause", handleManualInteraction); 

    return () => {
      videoEl.removeEventListener("seeking", handleManualInteraction);
      // videoEl.removeEventListener("pause", handleManualInteraction);
    };
  }, [videoRef, isAdmin, setIsOutOfSync]);

  return {
    emitAction: (payload) => {
      if (videoRef.current) {
         socket.emit("video_action", { 
           roomId, 
           timestamp: videoRef.current.currentTime, 
           ...payload 
         });
      }
    },
    requestSync: () => socket.emit("request_sync", { roomId }),
    sendMessage: (msg) => socket.emit("send_message", { roomId, ...msg }),
  };
};

export default useWatchPartySocket;