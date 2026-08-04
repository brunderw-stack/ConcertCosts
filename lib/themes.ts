export const APP_THEMES = [
  { id: "night", label: "Night" },
  { id: "dark", label: "Dark" },
  { id: "synthwave", label: "Synthwave" },
  { id: "dim", label: "Dim" },
  { id: "light", label: "Light" },
  { id: "cupcake", label: "Cupcake" },
] as const;

export const DEFAULT_THEME = "night";

export type AppThemeId = (typeof APP_THEMES)[number]["id"];

export function isAppTheme(value: string | null | undefined): value is AppThemeId {
  return APP_THEMES.some((theme) => theme.id === value);
}
