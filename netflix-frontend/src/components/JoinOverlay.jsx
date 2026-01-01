const JoinOverlay = ({ onJoin }) => (
  <div className="absolute inset-0 bg-black/90 z-[200] flex items-center justify-center">
    <button
      onClick={onJoin}
      className="bg-purple-600 hover:bg-purple-700 px-12 py-4 rounded-full text-xl font-bold text-white"
    >
      Enter Watch Party
    </button>
  </div>
);

export default JoinOverlay;