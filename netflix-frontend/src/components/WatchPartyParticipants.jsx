import React from 'react'

const WatchPartyParticipants = ({ participants, adminId, currentUser }) => {

  const sortedParticipants = [...participants].sort((a, b) => {
    const aIsYou = a.userId?._id === currentUser?.id;
    const bIsYou = b.userId?._id === currentUser?.id;

    const aIsHost = a.userId?._id === adminId;
    const bIsHost = b.userId?._id === adminId;

    if (aIsYou && !bIsYou) return -1;
    if (!aIsYou && bIsYou) return 1;

    if (aIsHost && !bIsHost) return -1;
    if (!aIsHost && bIsHost) return 1;

    return 0;
  });

  return (
    <div className="p-4 space-y-3 overflow-y-auto h-full">
      {sortedParticipants.map((p) => (
        <div
          key={p.socketId}
          className="flex items-center justify-between bg-[#01141f] px-4 py-3 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
              {p.userId?.name?.[0] || "U"}
            </div>
            <span className="text-sm text-white">
              {p.userId?.name || "Unknown"}
            </span>
          </div>

          {p.userId?._id === adminId && (
            <span className="text-xs text-purple-400 font-bold">HOST</span>
          )}
          {p.userId?._id === currentUser?.id && (
            <span className="text-s text-purple-400 font-bold">You</span>
          )}
        </div>
      ))}
    </div>
  )
}

export default WatchPartyParticipants
