import { ArrowLeft } from "lucide-react";

/* ================= COMPONENT ================= */
const PlayerTopBar = ({ title = "", onBack }) => {
  return (
    <header
      className="
        pointer-events-auto
        flex items-center gap-5
        p-6 md:p-10
        bg-gradient-to-b from-black/90 via-black/50 to-transparent
      "
    >
      {/* ===== BACK BUTTON ===== */}
      <button
        onClick={onBack}
        aria-label="Go back"
        className="
          flex items-center justify-center
          w-12 h-12
          rounded-full
          text-white
          hover:bg-white/10
          active:scale-90
          transition
        "
      >
        <ArrowLeft size={30} strokeWidth={2.5} />
      </button>

      {/* ===== TITLE ===== */}
      <div className="hidden sm:flex flex-col">
        <span className="text-[10px] font-bold tracking-[0.35em] text-[#e50914] uppercase">
          Now Watching
        </span>
        <h1
          className="
            text-lg md:text-2xl
            font-extrabold
            uppercase
            tracking-tight
            text-white
            leading-tight
          "
        >
          {title || "Untitled"}
        </h1>
      </div>
    </header>
  );
};

export default PlayerTopBar;
