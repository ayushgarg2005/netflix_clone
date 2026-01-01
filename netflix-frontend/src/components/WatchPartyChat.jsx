// import { AnimatePresence, motion } from "framer-motion";
// import { Send, Users } from "lucide-react";
// import { useRef, useEffect, useState } from "react";

// const WatchPartyChat = ({ show, messages, currentUser, onSend }) => {
//   const [text, setText] = useState("");
//   const endRef = useRef(null);

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const submit = (e) => {
//     e.preventDefault();
//     if (!text.trim()) return;
//     onSend({ message: text, user: currentUser?.username || "Guest" });
//     setText("");
//   };

//   return (
//     <AnimatePresence>
//       {show && (
//         <motion.div
//           initial={{ width: 0 }}
//           animate={{ width: 350 }}
//           exit={{ width: 0 }}
//           className="bg-[#0c0c0c] border-l border-gray-800 flex flex-col"
//         >
//           <div className="p-4 text-purple-400 font-bold flex gap-2">
//             <Users size={18} /> Party Chat
//           </div>

//           <div className="flex-1 overflow-y-auto p-4 space-y-3">
//             {messages.map((m, i) => (
//               <div key={i} className={m.user === currentUser?.username ? "text-right" : ""}>
//                 <p className="text-xs text-gray-500">{m.user}</p>
//                 <p className="bg-purple-600 inline-block p-2 rounded-lg text-white text-sm">
//                   {m.message}
//                 </p>
//               </div>
//             ))}
//             <div ref={endRef} />
//           </div>

//           <form onSubmit={submit} className="p-4 flex gap-2">
//             <input
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               className="flex-1 bg-black border rounded-full px-4 py-2 text-white"
//             />
//             <button><Send /></button>
//           </form>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default WatchPartyChat;

import { AnimatePresence, motion } from "framer-motion";
import { Send, Users, MessageSquare } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const WatchPartyChat = ({ show, messages, currentUser, onSend }) => {
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, show]);

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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full flex flex-col bg-[#021019] border-l border-white/5 shadow-2xl relative z-40"
        >
          {/* HEADER */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0b0c0f]/50 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[#00ED64]">
              <Users size={18} />
              <span className="font-bold text-sm uppercase tracking-wider">Live Chat</span>
            </div>
            <div className="text-xs text-slate-500 font-mono">
                {messages.length} msgs
            </div>
          </div>

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50 space-y-2">
                    <MessageSquare size={40} />
                    <p className="text-xs uppercase tracking-widest">No messages yet</p>
                </div>
            ) : (
                messages.map((m, i) => {
                  const isMe = m.user === currentUser?.username;
                  return (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i} 
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <span className="text-[10px] text-slate-500 mb-1 px-1">
                        {isMe ? "You" : m.user}
                      </span>
                      <div 
                        className={`
                            max-w-[85%] px-3 py-2 rounded-2xl text-sm font-medium leading-relaxed shadow-sm
                            ${isMe 
                                ? "bg-[#00ED64] text-[#001E2B] rounded-tr-sm" 
                                : "bg-[#1a2c38] text-slate-200 border border-white/5 rounded-tl-sm"
                            }
                        `}
                      >
                        {m.message}
                      </div>
                    </motion.div>
                  );
                })
            )}
            <div ref={endRef} />
          </div>

          {/* INPUT AREA */}
          <div className="p-4 border-t border-white/5 bg-[#0b0c0f]/80 backdrop-blur-md">
            <form onSubmit={submit} className="flex gap-2 relative">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#001E2B] border border-slate-700 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#00ED64]/50 focus:ring-1 focus:ring-[#00ED64]/50 transition-all"
              />
              <button 
                type="submit"
                disabled={!text.trim()}
                className="bg-[#00ED64] hover:bg-[#00c052] disabled:bg-slate-700 disabled:cursor-not-allowed text-[#001E2B] p-3 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center"
              >
                <Send size={18} fill={text.trim() ? "currentColor" : "none"} />
              </button>
            </form>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WatchPartyChat;