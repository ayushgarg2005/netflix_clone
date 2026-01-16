import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const LeaveRoom = ({ show, onCancel, onExit }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#021019] border border-slate-700/60 rounded-2xl w-full max-w-sm p-6"
          >
            <h2 className="text-lg font-semibold text-white">
              Leave Watch Party?
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              If you leave, you will exit the room and video sync will stop.
            </p>

            <div className="mt-6 flex gap-3 justify-end">
              {/* Cancel */}
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm hover:bg-slate-600 transition"
              >
                Cancel
              </button>

              {/* Exit */}
              <button
                onClick={onExit}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition"
              >
                Exit Room
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeaveRoom;