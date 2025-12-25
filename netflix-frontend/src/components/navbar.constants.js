import { User, Settings, HelpCircle } from "lucide-react";

export const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "TV Shows", path: "/tv-shows" },
  { name: "Movies", path: "/movies" },
  { name: "New & Popular", path: "/latest" },
  { name: "My List", path: "/my-list" },
];

export const PROFILE_MENU = [
  { icon: User, text: "Profile", path: "/profile" },
  { icon: Settings, text: "Account", path: "/account" },
  { icon: HelpCircle, text: "Help Center", path: "/help" },
];
