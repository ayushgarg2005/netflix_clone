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
    scale: 1.2, 
    opacity: 0, 
    transition: { duration: 0.2 } 
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
          Click anywhere to toggle.
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative flex items-center justify-center pointer-events-none"
          >
            {/* The Outer Glow */}
            <div className="absolute w-24 h-24 bg-[#00ED64]/10 rounded-full blur-2xl animate-pulse" />
            
            {/* The Background Disc */}
            <div className="absolute inset-0 bg-[#001E2B]/80 backdrop-blur-sm rounded-full scale-75" />

            {/* The Main Spinner */}
            <Loader2 
              size={64} 
              className="relative text-[#00ED64] animate-spin drop-shadow-[0_0_15px_rgba(0,237,100,0.4)]" 
            />
          </motion.div>
        ) : (
          /* 3. PAUSED STATE (Show Play Icon) */
          !isPlaying && (
            <motion.div
              key="play-icon"
              variants={ICON_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="
                relative
                z-50
                p-8
                rounded-full
                bg-[#001E2B]/60
                backdrop-blur-xl
                border border-[#00ED64]/30
                shadow-[0_0_30px_rgba(0,0,0,0.5)]
                pointer-events-none
                group
              "
            >
              {/* Green Inner Glow */}
              <div className="absolute inset-0 rounded-full bg-[#00ED64]/5" />
              
              <Play 
                size={56} 
                fill="#00ED64" 
                className="relative ml-2 text-[#00ED64] drop-shadow-[0_0_10px_rgba(0,237,100,0.3)]" 
              />
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* 4. TAP INDICATOR (Subtle green pulse on click) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full max-w-xs max-h-xs bg-[#00ED64]/5 rounded-full blur-3xl opacity-0 active:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};

export default PlayerCenterControls;