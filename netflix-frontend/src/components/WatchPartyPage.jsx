import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react"; 

// Local Components
import WatchPartyVideo from "../components/WatchPartyVideo";
import WatchPartyChat from "../components/WatchPartyChat";
import JoinOverlay from "../components/JoinOverlay";
import SyncButton from "../components/SyncButton"; // Ensure this component exists
import useWatchPartySocket from "../components/useWatchPartySocket"; // Check path

const WatchPartyPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get("room");

  const videoRef = useRef(null);

  // Data States
  const [movie, setMovie] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [messages, setMessages] = useState([]);

  // Session States
  const [hasJoined, setHasJoined] = useState(false);
  const [showChat, setShowChat] = useState(true);
  
  // --- CRITICAL STATE FOR SYNC LOGIC ---
  const [isOutOfSync, setIsOutOfSync] = useState(false);

  // 1. Init session (Fetch User, Room, Movie, Messages)
  useEffect(() => {
    if (!roomId) return;

    const init = async () => {
      try {
        const [userRes, roomRes] = await Promise.all([
          axios.get("http://localhost:5000/api/auth/me", { withCredentials: true }),
          axios.get(`http://localhost:5000/api/room/search/${roomId}`)
        ]);

        const userId = String(userRes.data.user.id || userRes.data.user._id);
        setIsAdmin(userId === String(roomRes.data.adminId));
        setCurrentUser(userRes.data.user);

        const [movieRes, msgRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/movies/${id}`, { withCredentials: true }),
          axios.get(`http://localhost:5000/api/room/messages/${roomId}`)
        ]);

        setMovie(movieRes.data);
        setMessages(msgRes.data);
      } catch (error) {
        console.error("Init Error:", error);
        toast.error("Invalid or expired session");
        navigate("/");
      }
    };

    init();
  }, [roomId, id, navigate]);

  // 2. Socket Hook Integration
  // We now pass 'isOutOfSync' so the hook knows when to ignore host updates
  const socketApi = useWatchPartySocket({
    roomId,
    videoRef,
    isAdmin,
    hasJoined,
    isOutOfSync,    // <--- PASSED HERE
    setIsOutOfSync,
    setMessages
  });

  // 3. Loading View
  if (!movie || !currentUser) {
    return (
      <div className="h-screen w-full bg-[#001E2B] flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 className="w-12 h-12 text-[#00ED64] animate-spin" />
        <p className="text-sm uppercase tracking-widest font-mono">Initializing Stream...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#001E2B] text-slate-100 font-sans selection:bg-[#00ED64] selection:text-[#001E2B] overflow-hidden relative">
      
      {/* A. JOIN OVERLAY (Modal) */}
      {!hasJoined && (
        <div className="absolute inset-0 z-50 bg-[#001E2B]/90 backdrop-blur-md flex items-center justify-center">
           <JoinOverlay onJoin={() => setHasJoined(true)} />
        </div>
      )}

      {/* B. SYNC WARNING (Floating Button) */}
      {/* Only visible if NOT admin, HAS joined, and IS out of sync */}
      {!isAdmin && isOutOfSync && hasJoined && (
        <div className="absolute bottom-32 right-1/2 translate-x-1/2 md:translate-x-0 md:right-10 z-50 animate-bounce">
           {/* If you don't have a separate SyncButton component, you can use a standard button here */}
           <SyncButton onSync={socketApi.requestSync} />
        </div>
      )}

      {/* C. MAIN CONTENT GRID */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* VIDEO CONTAINER */}
        <div className={`flex-1 relative bg-black transition-all duration-300 ${showChat ? "mr-0" : "mr-0"}`}>
           <WatchPartyVideo
             movie={movie}
             videoRef={videoRef}
             isAdmin={isAdmin}
             setIsOutOfSync={setIsOutOfSync} // Pass setter to allow manual drift trigger
             socketApi={socketApi}
             onBack={() => navigate(-1)}
             toggleChat={() => setShowChat(!showChat)}
           />
        </div>

        {/* CHAT SIDEBAR (Collapsible) */}
        <div 
          className={`
            border-l border-white/5 bg-[#021019] transition-all duration-300 ease-in-out relative z-30
            ${showChat ? "w-[350px] translate-x-0" : "w-0 translate-x-full opacity-0"}
          `}
        >
          <div className="h-full w-[350px] absolute right-0 top-0">
             <WatchPartyChat
               show={showChat}
               messages={messages}
               currentUser={currentUser}
               onSend={socketApi.sendMessage}
             />
          </div>
        </div>

      </main>
    </div>
  );
};

export default WatchPartyPage;