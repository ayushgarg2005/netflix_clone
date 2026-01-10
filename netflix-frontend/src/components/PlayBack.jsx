import { Check } from "lucide-react";

const PlayBack = ({playbackRate, setPlaybackRate}) => {
  return (
    <div>
      {/* Speed Controls (Keep existing) */}
      <div className="px-4 py-2 text-xs font-bold text-white uppercase bg-[#001E2B]/50 rounded">
        Playback Speed
      </div>
      <div className="max-h-40 overflow-y-auto mt-2">
        {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
          <button
            key={rate}
            onClick={() => setPlaybackRate(rate)}
            className="block w-full text-left px-4 py-2 text-slate-400 hover:text-white"
          >
            {rate}x{" "}
            {playbackRate === rate && (
              <Check size={12} className="inline ml-2" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayBack;
