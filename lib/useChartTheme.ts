"use client";

import { useEffect, useState } from "react";

export type ChartTheme = {
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  content: string;
  palette: string[];
};

const FALLBACK: ChartTheme = {
  primary: "oklch(0.7 0.15 220)",
  secondary: "oklch(0.7 0.15 300)",
  accent: "oklch(0.75 0.15 160)",
  muted: "oklch(0.6 0.02 260 / 0.25)",
  content: "oklch(0.85 0.02 260)",
  palette: [
    "oklch(0.7 0.15 220)",
    "oklch(0.7 0.15 300)",
    "oklch(0.75 0.15 160)",
    "oklch(0.75 0.14 40)",
    "oklch(0.72 0.16 350)",
    "oklch(0.7 0.12 250)",
    "oklch(0.74 0.14 120)",
    "oklch(0.7 0.13 20)",
  ],
};

function readColor(styles: CSSStyleDeclaration, name: string, fallback: string) {
  const value = styles.getPropertyValue(name).trim();
  return value || fallback;
}

export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState<ChartTheme>(FALLBACK);

  useEffect(() => {
    function sync() {
      const styles = getComputedStyle(document.documentElement);
      const primary = readColor(styles, "--color-primary", FALLBACK.primary);
      const secondary = readColor(
        styles,
        "--color-secondary",
        FALLBACK.secondary,
      );
      const accent = readColor(styles, "--color-accent", FALLBACK.accent);
      const content = readColor(
        styles,
        "--color-base-content",
        FALLBACK.content,
      );

      setTheme({
        primary,
        secondary,
        accent,
        muted: readColor(styles, "--color-base-300", FALLBACK.muted),
        content,
        palette: [
          primary,
          secondary,
          accent,
          readColor(styles, "--color-info", FALLBACK.palette[3]),
          readColor(styles, "--color-warning", FALLBACK.palette[4]),
          readColor(styles, "--color-error", FALLBACK.palette[5]),
          readColor(styles, "--color-success", FALLBACK.palette[6]),
          primary,
        ],
      });
    }

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
}
