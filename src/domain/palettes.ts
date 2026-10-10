export const themeIds = ['lingua-learning', 'finance-dashboard', 'jetbrains-spring', 'proton-inspired'] as const;
export type ThemeId = typeof themeIds[number];
export function isThemeId(value: string): value is ThemeId { return (themeIds as readonly string[]).includes(value); }
