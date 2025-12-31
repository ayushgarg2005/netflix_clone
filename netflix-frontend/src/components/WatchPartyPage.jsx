import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import io from "socket.io-client";
import { Send, Users, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import PlayerTopBar from "../components/PlayerTopBar";
import PlayerCenterControls from "../components/PlayerCenterControls";
import PlayerBottomControls from "../components/PlayerBottomControls";

const socket = io("http://localhost:5000");

const WatchPartyPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get("room");

  const videoRef = useRef(null);
  const isRemoteUpdate = useRef(false); 
  const messagesEndRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showChat, setShowChat] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [isOutOfSync, setIsOutOfSync] = useState(false);

  // 1. Initialize Session
  useEffect(() => {
    const initializeParty = async () => {
      try {
        const [userRes, roomRes] = await Promise.all([
          axios.get("http://localhost:5000/api/auth/me", { withCredentials: true }),
          axios.get(`http://localhost:5000/api/room/search/${roomId}`)
        ]);

        const loggedInUserId = String(userRes.data.user.id || userRes.data.user._id);
        const dbAdminId = String(roomRes.data.adminId);

        setCurrentUser(userRes.data.user);
        setIsAdmin(loggedInUserId === dbAdminId);

        const [movieRes, msgRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/movies/${id}`, { withCredentials: true }),
          axios.get(`http://localhost:5000/api/room/messages/${roomId}`)
        ]);

        setMovie(movieRes.data);
        setMessages(msgRes.data);
      } catch (err) {
        toast.error("Session expired or invalid");
        navigate("/");
      }
    };
    if (roomId) initializeParty();
  }, [roomId, id, navigate]);

  // 2. Socket Logic
  useEffect(() => {
    if (!roomId || !movie || !hasJoined) return;

    socket.emit("join_room", roomId);

    socket.on("request_sync_from_host", ({ requesterId }) => {
      if (isAdmin && videoRef.current) {
        socket.emit("send_sync_state", {
          requesterId,
          timestamp: videoRef.current.currentTime,
          isPlaying: !videoRef.current.paused
        });
      }
    });

    socket.on("receive_sync_state", (data) => {
      if (videoRef.current) {
        isRemoteUpdate.current = true;
        videoRef.current.currentTime = data.timestamp;
        if (data.isPlaying) videoRef.current.play().catch(() => {});
        else videoRef.current.pause();
        
        setIsOutOfSync(false);
        toast.success("Synced with host");
        setTimeout(() => (isRemoteUpdate.current = false), 500);
      }
    });

    socket.on("receive_video_action", (data) => {
      if (isAdmin || isOutOfSync || !videoRef.current) return;

      isRemoteUpdate.current = true;
      if (data.type === "play") {
        videoRef.current.currentTime = data.timestamp;
        videoRef.current.play().catch(() => {});
      } else if (data.type === "pause") {
        videoRef.current.pause();
      } else if (data.type === "seek") {
        videoRef.current.currentTime = data.timestamp;
      }
      setTimeout(() => (isRemoteUpdate.current = false), 500);
    });

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("request_sync_from_host");
      socket.off("receive_sync_state");
      socket.off("receive_video_action");
      socket.off("receive_message");
    };
  }, [roomId, movie, hasJoined, isAdmin, isOutOfSync]);

  // 3. Handlers
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isAdmin) {
      if (video.paused) {
        video.play();
        socket.emit("video_action", { roomId, type: "play", timestamp: video.currentTime });
      } else {
        video.pause();
        socket.emit("video_action", { roomId, type: "pause", timestamp: video.currentTime });
      }
    } else {
      // Guest: Local control + Detach from host
      if (video.paused) video.play(); else video.pause();
      setIsOutOfSync(true);
    }
  };

  const handleSeek = (time) => {
    const video = videoRef.current;
    if (!video) return;

    if (isAdmin) {
      video.currentTime = time;
      socket.emit("video_action", { roomId, type: "seek", timestamp: time });
    } else {
      video.currentTime = time;
      setIsOutOfSync(true);
    }
  };

  const requestSync = () => {
    socket.emit("request_sync", { roomId });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    socket.emit("send_message", { roomId, message: newMessage, user: currentUser?.username || "Guest" });
    setNewMessage("");
  };

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-black overflow-hidden relative">
      
      {/* JOIN OVERLAY */}
      {!hasJoined && (
        <div className="absolute inset-0 z-[200] bg-black/90 flex items-center justify-center">
          <button 
            onClick={() => setHasJoined(true)} 
            className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 rounded-full font-bold text-xl transition-all"
          >
            Enter Watch Party
          </button>
        </div>
      )}

      {/* SYNC BUTTON */}
      {!isAdmin && isOutOfSync && hasJoined && (
        <motion.button 
          initial={{ y: -100 }} animate={{ y: 0 }}
          onClick={requestSync}
          className="absolute top-24 left-1/2 -translate-x-1/2 z-[100] bg-white text-black px-6 py-2 rounded-full flex items-center gap-2 font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all pointer-events-auto"
        >
          <RefreshCw size={18} className="text-purple-600" /> Sync with Host
        </motion.button>
      )}

      <div className="relative flex-1 bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          src={movie?.videoUrl}
          className="w-full h-full object-contain pointer-events-auto cursor-pointer"
          onClick={togglePlay}
          onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {/* PLAYER UI LAYERS */}
        {/* pointer-events-none on container, pointer-events-auto on children */}
        <div className="absolute inset-0 z-[60] flex flex-col justify-between pointer-events-none">
          <div className="pointer-events-auto">
            <PlayerTopBar movie={movie} onBack={() => navigate(-1)} />
          </div>
          
          <div className="flex-grow flex items-center justify-center">
            <div className="pointer-events-auto">
              <PlayerCenterControls isAdmin={true} isPlaying={isPlaying} onToggle={togglePlay} />
            </div>
          </div>

          <div className="px-4 pb-4 pointer-events-auto">
            <PlayerBottomControls 
               isAdmin={true} 
               videoRef={videoRef} 
               isPlaying={isPlaying} 
               onToggle={togglePlay}
               currentTime={currentTime} 
               duration={duration}
               onSeek={handleSeek} 
               onOpenSettings={() => setShowChat(!showChat)} 
            />
          </div>
        </div>
      </div>

      {/* CHAT PANEL */}
      <AnimatePresence>
        {showChat && (
          <motion.div 
            initial={{ width: 0 }} animate={{ width: 350 }} exit={{ width: 0 }} 
            className="bg-[#0c0c0c] border-l border-gray-800 flex flex-col z-[70]"
          >
            <div className="p-4 border-b border-gray-800 flex justify-between items-center text-white">
              <span className="flex items-center gap-2 text-purple-400 font-bold"><Users size={18}/> Party Chat</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.user === currentUser?.username ? "items-end" : "items-start"}`}>
                  <span className="text-[10px] text-gray-500 font-bold">{msg.user}</span>
                  <p className={`p-2 rounded-lg text-sm mt-1 ${msg.user === currentUser?.username ? "bg-purple-600 text-white" : "bg-[#1a1a1a] text-gray-200"}`}>
                    {msg.message}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="p-4 bg-[#121212] flex gap-2">
              <input 
                value={newMessage} 
                onChange={e => setNewMessage(e.target.value)} 
                className="flex-1 bg-black border border-gray-800 rounded-full px-4 py-2 text-sm text-white outline-none focus:border-purple-500" 
                placeholder="Message..."/>
              <button type="submit" className="text-purple-500 hover:scale-110 transition-transform"><Send size={20}/></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WatchPartyPage;