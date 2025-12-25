import { Bell } from "lucide-react";

const NotificationBell = () => {
  return (
    <button className="relative text-white p-1">
      <Bell size={20} />
      <span className="absolute top-0 right-0 bg-[#e50914] text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
        3
      </span>
    </button>
  );
};

export default NotificationBell;
