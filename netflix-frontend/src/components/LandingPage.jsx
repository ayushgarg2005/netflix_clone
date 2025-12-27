import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Terminal } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    // h-screen + overflow-hidden ensures NO SCROLLING
    <div className="h-screen w-full bg-[#001E2B] text-slate-100 font-sans selection:bg-[#00ED64] selection:text-[#001E2B] overflow-hidden relative flex flex-col">
      
      {/* 1. NAVBAR */}
      <header className="w-full z-50 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00ED64] rounded-lg flex items-center justify-center text-[#001E2B] font-bold text-sm shadow-[0_0_15px_rgba(0,237,100,0.3)]">S</div>
            <span className="text-white font-bold text-xl tracking-tight">Streamflix</span>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={() => navigate("/signin")} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign In</button>
            <button onClick={() => navigate("/signup")} className="px-5 py-2 rounded-lg bg-[#00ED64] text-[#001E2B] font-bold text-sm hover:bg-[#00c052] transition-all shadow-[0_0_15px_rgba(0,237,100,0.2)]">Sign Up</button>
        </div>
      </header>

      {/* 2. MAIN CONTENT (Centered) */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6 z-10">
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ED64] opacity-[0.04] blur-[100px] rounded-full pointer-events-none" />

        {/* Text Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-8 md:mb-12"
        >
            <span className="inline-block py-1 px-3 rounded-full bg-[#00ED64]/10 border border-[#00ED64]/20 text-[#00ED64] text-[10px] font-bold uppercase tracking-widest mb-4">
                Next Gen Streaming
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4 leading-[1.1]">
                Unlimited movies, <br />
                <span className="bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">engineered for you.</span>
            </h1>
            <p className="text-sm md:text-lg text-slate-400 max-w-xl mx-auto mb-6 leading-relaxed">
                Zero buffering. 4K HDR. A library that never sleeps.
            </p>
            <button 
                onClick={() => navigate("/signup")}
                className="px-8 py-3 rounded-xl bg-[#00ED64] text-[#001E2B] font-bold text-base hover:bg-[#00c052] hover:scale-105 transition-all inline-flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,237,100,0.25)]"
            >
                Get Started <ChevronRight size={18} />
            </button>
        </motion.div>

        {/* Terminal Section (Scaled to fit) */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-full max-w-3xl"
        >
            <div className="relative rounded-xl overflow-hidden bg-[#0a0f14] border border-slate-700/50 shadow-2xl ring-1 ring-white/5">
                {/* Header */}
                <div className="w-full h-8 bg-[#021019] border-b border-slate-800 flex items-center px-4 justify-between select-none">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <Terminal size={10} />
                        <span>streamflix_core</span>
                    </div>
                    <div className="w-8" />
                </div>

                {/* Body */}
                <div className="p-4 font-mono text-[10px] md:text-xs text-left leading-relaxed h-[220px] md:h-auto overflow-hidden">
                    <div className="mb-3">
                        <span className="text-[#00ED64]">root@streamflix:~/engine$</span>
                        <span className="text-slate-100 ml-2">./deploy_cinematic_experience.sh --mode=ultra</span>
                    </div>

                    <div className="space-y-1 text-slate-400 mb-4">
                        <div className="flex justify-between"><span>[init] Compiling 4K assets...</span><span className="text-slate-600">[DONE 0.02s]</span></div>
                        <div className="flex justify-between"><span>[auth] Verifying secure handshake...</span><span className="text-slate-600">[DONE 0.05s]</span></div>
                        <div className="flex justify-between"><span>[cdn] Optimizing global routes...</span><span className="text-[#00ED64]">[SUCCESS]</span></div>
                    </div>

                    {/* JSON Block */}
                    <div className="p-3 bg-[#001E2B]/50 rounded border border-white/5 grid grid-cols-2 gap-x-8 gap-y-1">
                        <div><span className="text-sky-400">"res"</span>: <span className="text-yellow-300">"4K_HDR"</span>,</div>
                        <div><span className="text-sky-400">"audio"</span>: <span className="text-yellow-300">"Atmos"</span>,</div>
                        <div><span className="text-sky-400">"buffer"</span>: <span className="text-pink-400">false</span>,</div>
                        <div><span className="text-sky-400">"latency"</span>: <span className="text-yellow-300">"&lt;20ms"</span></div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-slate-300">
                        <span className="text-[#00ED64]">➜</span>
                        <span>Stream Ready.</span>
                        <span className={`w-2 h-4 bg-[#00ED64] ${cursorVisible ? "opacity-100" : "opacity-0"}`} />
                    </div>
                </div>
                
                {/* Shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            </div>
        </motion.div>

      </main>

      {/* 3. FOOTER (Minimal) */}
      <footer className="w-full py-4 text-center text-[10px] text-slate-600 uppercase tracking-widest shrink-0 border-t border-white/5">
        &copy; {new Date().getFullYear()} Streamflix Inc. Engineered for Performance.
      </footer>

    </div>
  );
};

export default LandingPage;