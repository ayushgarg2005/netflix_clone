import { Play, Users } from "lucide-react";

const JoinOverlay = ({ onJoin }) => (
  <div className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-[#001E2B]/95 backdrop-blur-xl transition-all duration-500">
    
    {/* Animated Icon Container */}
    <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-[#00ED64] rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000 animate-pulse" />
        <div className="relative w-24 h-24 bg-[#00ED64]/10 rounded-full flex items-center justify-center border border-[#00ED64]/20 shadow-2xl">
            <Users size={40} className="text-[#00ED64]" />
        </div>
    </div>

    {/* Text Content */}
    <div className="text-center space-y-3 mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight">
            Watch Party Lobby
        </h1>
        <p className="text-slate-400 text-base max-w-xs mx-auto leading-relaxed">
            Ready to sync up? Click below to join the session and start watching together.
        </p>
    </div>

    {/* Action Button */}
    <button
      onClick={onJoin}
      className="group relative flex items-center gap-3 bg-[#00ED64] hover:bg-[#00c052] px-10 py-4 rounded-full text-[#001E2B] text-lg font-bold transition-all duration-300 shadow-[0_0_30px_rgba(0,237,100,0.3)] hover:shadow-[0_0_50px_rgba(0,237,100,0.5)] hover:scale-105 active:scale-95"
    >
      <Play size={22} fill="currentColor" className="ml-1" />
      <span>Enter Party</span>
    </button>

  </div>
);

export default JoinOverlay;