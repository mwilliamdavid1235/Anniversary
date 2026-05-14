"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "day" | "night";

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
  isOverride: boolean;
}

const Ctx = createContext<ThemeCtx>({ theme: "night", toggle: () => {}, isOverride: false });

export function useTheme() { return useContext(Ctx); }

function autoTheme(): Theme {
  const h = new Date().getHours();
  return h >= 20 || h < 7 ? "night" : "day";
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("night");
  const [isOverride, setIsOverride] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme_override") as Theme | null;
    const active = stored ?? autoTheme();
    setTheme(active);
    setIsOverride(!!stored);
    document.documentElement.setAttribute("data-theme", active);
  }, []);

  function toggle() {
    const next: Theme = theme === "night" ? "day" : "night";
    const auto = autoTheme();
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    if (next !== auto) {
      localStorage.setItem("theme_override", next);
      setIsOverride(true);
    } else {
      localStorage.removeItem("theme_override");
      setIsOverride(false);
    }
  }

  return <Ctx.Provider value={{ theme, toggle, isOverride }}>{children}</Ctx.Provider>;
}
