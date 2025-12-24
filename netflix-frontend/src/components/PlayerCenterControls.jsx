import { Play, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= ANIMATION ================= */
const ICON_VARIANTS = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 240,
      damping: 18,
    },
  },
  exit: { scale: 1.1, opacity: 0, transition: { duration: 0.2 } },
};

/* ================= COMPONENT ================= */
const PlayerCenterControls = ({
  isPlaying = false,
  isBuffering = false,
  onToggle,
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <AnimatePresence mode="wait">
        {/* Buffering */}
        {isBuffering && (
          <motion.div
            key="buffering"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[#e50914]"
          >
            <Loader2 size={72} className="animate-spin" />
          </motion.div>
        )}

        {/* Play Button */}
        {!isBuffering && !isPlaying && (
          <motion.button
            key="play"
            variants={ICON_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onToggle}
            aria-label="Play video"
            className="
              pointer-events-auto
              p-8
              rounded-full
              bg-black/40
              backdrop-blur-xl
              border border-white/10
              text-white
              transition
              hover:bg-black/55
              active:scale-95
              focus:outline-none
            "
          >
            <Play size={56} fill="white" className="ml-1" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayerCenterControls;
