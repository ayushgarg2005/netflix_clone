import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const SyncButton = ({ onSync }) => (
  <motion.button
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    onClick={onSync}
    className="absolute top-24 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full flex gap-2 font-bold"
  >
    <RefreshCw size={18} /> Sync with Host
  </motion.button>
);

export default SyncButton;