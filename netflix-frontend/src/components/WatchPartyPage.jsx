import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import io from "socket.io-client";
import { MessageSquare, Send, X, Users, Copy } from "lucide-react";
import toast from "react-hot-toast";

// Import your existing custom controls
import PlayerTopBar from "../components/PlayerTopBar";
import PlayerCenterControls from "../components/PlayerCenterControls";
import PlayerBottomControls from "../components/PlayerBottomControls";

// Initialize Socket once
const socket = io("http://localhost:5000");

const CONTROLS_HIDE_DELAY = 3000;

const WatchPartyPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get("room") || id;

  // Refs
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const hideTimerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Sync Lock (Prevents Loop)
  const isRemoteUpdate = useRef(false);

  // State
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false); // Default false for parties
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showChat, setShowChat] = useState(true); // Toggle Chat sidebar
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  /* ================= 1. FETCH MOVIE ================= */
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/${id}`, { withCredentials: true });
        setMovie(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load movie");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  /* ================= 2. SOCKET SYNC ENGINE ================= */
  useEffect(() => {
    if (!roomId) return;
    socket.emit("join_room", roomId);
    toast.success("Connected to Party!");

    socket.on("receive_video_action", (data) => {
      // 🔒 LOCK: This event is from the server, not the user
      isRemoteUpdate.current = true;
      const video = videoRef.current;
      if (!video) return;

      switch (data.type) {
        case "play":
            // Sync time if drift > 1s
            if (Math.abs(video.currentTime - data.timestamp) > 1) {
                video.currentTime = data.timestamp;
            }
            video.play().catch(() => {}); // Catch autoplay blocks
            setIsPlaying(true);
            toast("Playing...", { icon: "▶️", duration: 1000 });
            break;
        case "pause":
            video.pause();
            setIsPlaying(false);
            toast("Paused", { icon: "⏸️", duration: 1000 });
            break;
        case "seek":
            video.currentTime = data.timestamp;
            break;
        default: break;
      }

      // 🔓 UNLOCK after 1 second (allow buffer time)
      setTimeout(() => { isRemoteUpdate.current = false; }, 1000);
    });

    socket.on("receive_message", (data) => {
        setMessages(prev => [...prev, data]);
        scrollToBottom();
    });

    return () => {
      socket.off("receive_video_action");
      socket.off("receive_message");
      socket.emit("leave_room", roomId);
    };
  }, [roomId]);

  /* ================= 3. USER ACTIONS (Emit Events) ================= */
  
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Only emit if UNLOCKED (User action)
    if (!isRemoteUpdate.current) {
        if (video.paused) {
            video.play();
            setIsPlaying(true);
            socket.emit("video_action", { roomId, type: "play", timestamp: video.currentTime });
        } else {
            video.pause();
            setIsPlaying(false);
            socket.emit("video_action", { roomId, type: "pause", timestamp: video.currentTime });
        }
    }
  }, [roomId]);

  // Handle Seeking (Triggered by your Custom Controls changing video.currentTime)
  const handleSeeked = () => {
    if (!isRemoteUpdate.current && videoRef.current) {
        socket.emit("video_action", { roomId, type: "seek", timestamp: videoRef.current.currentTime });
    }
  };

  /* ================= 4. UI HELPERS ================= */
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, CONTROLS_HIDE_DELAY);
  }, [isPlaying]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) videoContainerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    socket.emit("send_message", {
        roomId,
        message: newMessage,
        user: "User " + Math.floor(Math.random()*100),
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
    setNewMessage("");
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); toast.success("Link Copied!"); };

  if (loading) return <div className="h-screen bg-black text-white flex items-center justify-center">Loading Party...</div>;

  return (
    <div className="flex h-screen w-screen bg-black overflow-hidden">
      
      {/* ===== LEFT: VIDEO AREA (Native Video + Custom Controls) ===== */}
      <div 
        ref={videoContainerRef}
        onMouseMove={resetHideTimer}
        className={`relative flex-1 bg-black flex items-center justify-center group ${!showControls && "cursor-none"}`}
      >
        <video
            ref={videoRef}
            src={movie?.videoUrl}
            className="w-full h-full object-contain"
            onClick={togglePlay}
            onDoubleClick={toggleFullscreen}
            onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
            onLoadedMetadata={() => setDuration(videoRef.current?.duration)}
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => { setIsBuffering(false); setIsPlaying(true); }}
            onPause={() => setIsPlaying(false)}
            onSeeked={handleSeeked} // 👈 Critical for syncing seeking
        />

        {/* Custom Overlays (Reused from Watch.jsx) */}
        <AnimatePresence>
            {showControls && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex flex-col justify-between pointer-events-none"
                >
                    <div className="pointer-events-auto">
                        <PlayerTopBar movie={movie} onBack={() => navigate(-1)} />
                    </div>
                    
                    <div className="pointer-events-auto flex-grow relative">
                        {/* Play/Pause Center Button */}
                        <PlayerCenterControls isPlaying={isPlaying} isBuffering={isBuffering} onToggle={togglePlay} />
                    </div>

                    <div className="pointer-events-auto px-4 pb-4">
                        {/* Bottom Bar (Seekbar, Volume, etc) */}
                        <PlayerBottomControls 
                            videoRef={videoRef}
                            isPlaying={isPlaying}
                            onToggle={togglePlay}
                            currentTime={currentTime}
                            duration={duration}
                            // We hide specific settings for guests to keep it simple, or add a chat toggle
                            onOpenSettings={() => setShowChat(!showChat)} 
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* ===== RIGHT: CHAT SIDEBAR (Toggleable) ===== */}
      <AnimatePresence>
      {showChat && (
        <motion.div 
            initial={{ width: 0, opacity: 0 }} 
            animate={{ width: 320, opacity: 1 }} 
            exit={{ width: 0, opacity: 0 }}
            className="bg-[#101010] border-l border-gray-800 flex flex-col z-50"
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-800 bg-[#161616] flex justify-between items-center text-white">
                <div className="flex items-center gap-2 font-bold text-purple-400">
                    <Users size={18} /> Party Chat
                </div>
                <button onClick={copyLink} className="p-2 hover:bg-gray-800 rounded-full" title="Copy Invite Link">
                    <Copy size={16} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {messages.map((msg, i) => (
                    <div key={i} className="flex flex-col animate-fade-in">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span className="font-bold text-gray-400">{msg.user}</span>
                            <span>{msg.time}</span>
                        </div>
                        <div className="bg-[#202020] p-2 rounded-lg text-sm text-gray-200 border border-gray-700">
                            {msg.message}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-3 border-t border-gray-800 bg-[#161616] relative">
                <input 
                    value={newMessage} 
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-black border border-gray-700 text-white rounded-full py-2 px-4 pr-10 text-sm focus:border-purple-500 outline-none"
                />
                <button type="submit" className="absolute right-5 top-5 text-purple-500 hover:text-white transition">
                    <Send size={16} />
                </button>
            </form>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default WatchPartyPage;