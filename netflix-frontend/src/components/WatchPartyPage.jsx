import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import WatchPartyVideo from "../components/WatchPartyVideo";
import WatchPartyChat from "../components/WatchPartyChat";
import JoinOverlay from "../components/JoinOverlay";
import SyncButton from "../components/SyncButton";
import useWatchPartySocket from "../components/useWatchPartySocket";

const WatchPartyPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get("room");

  const videoRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [isOutOfSync, setIsOutOfSync] = useState(false);

  const [messages, setMessages] = useState([]);
  const [showChat, setShowChat] = useState(true);

  // 🔹 Init session
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
      } catch {
        toast.error("Invalid or expired session");
        navigate("/");
      }
    };

    init();
  }, [roomId, id, navigate]);

  // 🔹 Socket Hook
  const socketApi = useWatchPartySocket({
    roomId,
    videoRef,
    isAdmin,
    hasJoined,
    setIsOutOfSync,
    setMessages
  });

  return (
    <div className="flex h-screen bg-black overflow-hidden relative">
      {!hasJoined && <JoinOverlay onJoin={() => setHasJoined(true)} />}

      {!isAdmin && isOutOfSync && hasJoined && (
        <SyncButton onSync={socketApi.requestSync} />
      )}

      <WatchPartyVideo
        movie={movie}
        videoRef={videoRef}
        isAdmin={isAdmin}
        setIsOutOfSync={setIsOutOfSync}
        socketApi={socketApi}
        onBack={() => navigate(-1)}
        toggleChat={() => setShowChat(!showChat)}
      />

      <WatchPartyChat
        show={showChat}
        messages={messages}
        currentUser={currentUser}
        onSend={socketApi.sendMessage}
      />
    </div>
  );
};

export default WatchPartyPage;
