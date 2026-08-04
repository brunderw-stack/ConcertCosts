"use client";

import { Palette } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import type { AppThemeId } from "@/lib/themes";

type ThemeSelectorProps = {
  className?: string;
  compact?: boolean;
};

export function ThemeSelector({
  className = "",
  compact = false,
}: ThemeSelectorProps) {
  const { theme, setTheme, themes } = useTheme();

  return (
    <label
      className={`flex items-center gap-2 ${className}`}
      title="Change the look of the app"
    >
      <Palette className="size-4 shrink-0 opacity-70" aria-hidden />
      {!compact && (
        <span className="text-sm whitespace-nowrap opacity-80">Theme</span>
      )}
      <select
        className="select select-bordered select-sm min-w-32"
        value={theme}
        aria-label="Choose app theme"
        onChange={(event) => setTheme(event.target.value as AppThemeId)}
      >
        {themes.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
