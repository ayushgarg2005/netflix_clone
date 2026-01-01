import { AnimatePresence, motion } from "framer-motion";
import { Send, Users } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const WatchPartyChat = ({ show, messages, currentUser, onSend }) => {
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend({ message: text, user: currentUser?.username || "Guest" });
    setText("");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 350 }}
          exit={{ width: 0 }}
          className="bg-[#0c0c0c] border-l border-gray-800 flex flex-col"
        >
          <div className="p-4 text-purple-400 font-bold flex gap-2">
            <Users size={18} /> Party Chat
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.user === currentUser?.username ? "text-right" : ""}>
                <p className="text-xs text-gray-500">{m.user}</p>
                <p className="bg-purple-600 inline-block p-2 rounded-lg text-white text-sm">
                  {m.message}
                </p>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form onSubmit={submit} className="p-4 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 bg-black border rounded-full px-4 py-2 text-white"
            />
            <button><Send /></button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WatchPartyChat;