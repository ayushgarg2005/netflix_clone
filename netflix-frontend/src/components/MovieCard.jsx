import { Play, Star, Plus, ThumbsUp } from "lucide-react";

const MovieCard = ({ movie }) => {
  return (
    <div className="group relative flex flex-col cursor-pointer">

      {/* IMAGE CONTAINER */}
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-[#141414] shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">

        {/* THUMBNAIL */}
        <img
          src={movie.thumbnailUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* TOP BADGES */}
        <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
          <span className="bg-black/40 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider border border-white/10">
            {movie.type}
          </span>

          <span className="bg-white/10 text-white text-[9px] px-2 py-0.5 rounded-sm border border-white/10">
            {movie.quality}
          </span>
        </div>

        {/* PLAY BUTTON */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-2xl">
            <Play size={24} fill="black" className="ml-1" />
          </div>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="flex gap-2">
            <button className="p-1.5 bg-[#2a2a2a]/80 rounded-full border border-white/20">
              <Plus size={14} className="text-white" />
            </button>
            <button className="p-1.5 bg-[#2a2a2a]/80 rounded-full border border-white/20">
              <ThumbsUp size={14} className="text-white" />
            </button>
          </div>

          <span className="text-[10px] text-white border border-white/40 px-1 rounded-sm">
            {movie.ageRestriction}
          </span>
        </div>
      </div>

      {/* METADATA */}
      <div className="mt-3 px-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-gray-100 truncate">
            {movie.title}
          </h3>

          {movie.rating > 0 && (
            <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded">
              <Star size={10} fill="#f5c518" stroke="none" />
              <span className="text-[10px] text-gray-300 font-bold">
                {movie.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
          <span>{movie.duration}m</span>
          <span className="w-1 h-1 bg-gray-700 rounded-full" />
          <span className="truncate">
            {movie.genres?.slice(0, 2).join(" • ")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;