import { User, Settings, HelpCircle } from "lucide-react";

export const NAV_LINKS = [
  { name: "Home", path: "/browse" },
  { name: "Watch Party", path: "/watchParty" },
  { name: "Movies", path: "/movies" },
  { name: "My List", path: "/my-list" },
];

export const PROFILE_MENU = [
  { icon: User, text: "Profile", path: "/profile" },
  { icon: Settings, text: "Account", path: "/account" },
  { icon: HelpCircle, text: "Help Center", path: "/help" },
];
