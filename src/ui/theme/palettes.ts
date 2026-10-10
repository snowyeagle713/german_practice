import type { ThemeId } from '../../domain/palettes';
// Add a complete semantic token map in tokens.css before registering a palette.
export const palettes = [
  { id: 'lingua-learning', label: 'Lingua Learning' },
  { id: 'finance-dashboard', label: 'Finance Dashboard' },
  { id: 'jetbrains-spring', label: 'JetBrains Spring' },
  { id: 'proton-inspired', label: 'Proton-inspired' },
] as const satisfies readonly { id: ThemeId; label: string }[];
