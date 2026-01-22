import { UI_TEXTS } from "../constants/uiTexts";

export const NAV_ITEMS = [
  { to: "/dashboard", label: UI_TEXTS.menus.dashboard, icon: "🏠" },
  { to: "/books",     label: UI_TEXTS.menus.books,     icon: "📚" },
  { to: "/raffle",    label: UI_TEXTS.menus.raffle,    icon: "🎲" },
  { to: "/members",   label: UI_TEXTS.menus.members,   icon: "👥" },
] as const;