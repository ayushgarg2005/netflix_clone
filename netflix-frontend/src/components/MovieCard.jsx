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

        {/* CINEMATIC OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* TOP BADGES (Glassmorphism) */}
        <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0">
          {movie.isPremium && (
            <span className="bg-[#e50914] text-white text-[10px] px-2 py-0.5 rounded-sm font-black tracking-tighter shadow-lg">
              PREMIUM
            </span>
          )}
          <span className="bg-black/40 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider border border-white/10">
            {movie.type}
          </span>
        </div>

        {/* CENTER PLAY BUTTON */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
          <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-black shadow-2xl hover:bg-white transition-colors">
            <Play size={24} fill="black" className="ml-1" />
          </div>
        </div>

        {/* BOTTOM QUICK ACTIONS (Netflix Style) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[10px] group-hover:translate-y-0">
          <div className="flex gap-2">
            <button className="p-1.5 bg-[#2a2a2a]/80 backdrop-blur-md rounded-full border border-white/20 hover:border-white transition-colors">
              <Plus size={14} className="text-white" />
            </button>
            <button className="p-1.5 bg-[#2a2a2a]/80 backdrop-blur-md rounded-full border border-white/20 hover:border-white transition-colors">
              <ThumbsUp size={14} className="text-white" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-green-500">95% Match</span>
            <span className="text-[10px] text-white border border-white/40 px-1 rounded-sm uppercase">
               {movie.ageRestriction || "PG"}
            </span>
          </div>
        </div>
      </div>

      {/* METADATA BELOW */}
      <div className="mt-3 px-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-gray-100 truncate flex-1 group-hover:text-white transition-colors">
            {movie.title}
          </h3>
          {movie.rating > 0 && (
            <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded">
              <Star size={10} fill="#f5c518" stroke="none" />
              <span className="text-[10px] font-bold text-gray-300">{movie.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 font-medium">
          <span>{movie.duration}m</span>
          <span className="w-1 h-1 bg-gray-700 rounded-full" />
          <span className="truncate">Action • Thriller</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;