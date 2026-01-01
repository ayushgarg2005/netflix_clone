import { useEffect, useRef } from "react";
import io from "socket.io-client";
import toast from "react-hot-toast";

const socket = io("http://localhost:5000");

const useWatchPartySocket = ({
  roomId,
  videoRef,
  isAdmin,
  hasJoined,
  setIsOutOfSync,
  setMessages
}) => {
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    if (!roomId || !hasJoined) return;

    socket.emit("join_room", roomId);

    socket.on("request_sync_from_host", ({ requesterId }) => {
      if (!isAdmin || !videoRef.current) return;
      socket.emit("send_sync_state", {
        requesterId,
        timestamp: videoRef.current.currentTime,
        isPlaying: !videoRef.current.paused
      });
    });

    socket.on("receive_sync_state", (data) => {
      if (!videoRef.current) return;
      isRemoteUpdate.current = true;
      videoRef.current.currentTime = data.timestamp;
      data.isPlaying ? videoRef.current.play() : videoRef.current.pause();
      toast.success("Synced with host");
      setIsOutOfSync(false);
      setTimeout(() => (isRemoteUpdate.current = false), 500);
    });

    socket.on("receive_video_action", (data) => {
      if (isAdmin || !videoRef.current) return;
      isRemoteUpdate.current = true;
      if (data.type === "play") videoRef.current.play();
      if (data.type === "pause") videoRef.current.pause();
      if (data.type === "seek") videoRef.current.currentTime = data.timestamp;
      setTimeout(() => (isRemoteUpdate.current = false), 500);
    });

    socket.on("receive_message", (msg) =>
      setMessages((prev) => [...prev, msg])
    );

    return () => socket.removeAllListeners();
  }, [roomId, hasJoined, isAdmin]);

  return {
    emitAction: (payload) => socket.emit("video_action", { roomId, ...payload }),
    requestSync: () => socket.emit("request_sync", { roomId }),
    sendMessage: (msg) => socket.emit("send_message", { roomId, ...msg })
  };
};

export default useWatchPartySocket;
