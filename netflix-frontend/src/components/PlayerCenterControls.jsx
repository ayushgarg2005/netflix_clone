import { Play, Pause, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= ANIMATION PHYSICS ================= */
const ICON_VARIANTS = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  exit: { 
    scale: 1.5, 
    opacity: 0, 
    transition: { duration: 0.3, ease: "easeIn" } 
  },
};

const PlayerCenterControls = ({
  isPlaying = false,
  isBuffering = false,
  onToggle,
}) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center">
      
      {/* 1. INTERACTION OVERLAY 
          This allows the user to click anywhere in the middle to toggle play/pause.
      */}
      <div 
        className="absolute inset-0 pointer-events-auto cursor-pointer"
        onClick={onToggle}
      />

      <AnimatePresence mode="wait">
        {/* 2. BUFFERING STATE */}
        {isBuffering ? (
          <motion.div
            key="buffering"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex items-center justify-center"
          >
            {/* The Outer Glow */}
            <div className="absolute w-24 h-24 bg-[#e50914]/20 rounded-full blur-2xl animate-pulse" />
            
            {/* The Main Spinner */}
            <Loader2 
              size={80} 
              strokeWidth={1.5}
              className="text-[#e50914] animate-spin drop-shadow-[0_0_15px_rgba(229,9,20,0.5)]" 
            />
          </motion.div>
        ) : (
          /* 3. PLAY/PAUSE ICON FEEDBACK */
          !isPlaying && (
            <motion.div
              key="play-pause"
              variants={ICON_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="
                relative
                z-50
                p-10
                rounded-full
                bg-black/30
                backdrop-blur-xl
                border border-white/10
                text-white
                shadow-2xl
                pointer-events-none
              "
            >
              {/* Using Play icon when paused. 
                  Note: You can also briefly show Pause icon when playing 
                  by adding a timeout state in the parent.
              */}
              <Play 
                size={64} 
                fill="white" 
                className="ml-1 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]" 
              />
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* 4. TAP INDICATOR (Subtle center pulse when clicking) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full max-w-xs max-h-xs bg-white/5 rounded-full blur-3xl opacity-0 active:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};

export default PlayerCenterControls;