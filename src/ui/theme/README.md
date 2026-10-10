# Semantic theme contract

`tokens.css` owns all palette literals. `styles.css` owns shared layout, spacing,
typography and component composition; it consumes CSS custom properties only for
colors and shadows. `src/main.tsx` supplies the Lingua fallback; the application applies the saved palette after opening local preferences.
The default CSS map also lives on `:root`, so the initial render has a palette.

The Lingua Learning layout uses a rounded learning sidebar, soft canvas, study
overview cards, a block card and stored progress cards. A study-position
bar on Learn represents the current URL-selected construction, not completion,
accuracy or mastery. Theme selection creates no practice records or gamification.

| Role | Token names (all prefixed with `--`) |
|---|---|
| App and shell | app-background, shell-background, sidebar-background |
| Reading surfaces | surface-background, surface-elevated, surface-subtle |
| Separation | border, shadow-card, shadow-elevated |
| Text | text-primary, text-secondary, text-inverse, sidebar-text, sidebar-text-secondary |
| Accents | accent-primary, accent-primary-hover, accent-primary-subtle, accent-primary-text, accent-secondary, accent-secondary-subtle |
| Status | success, warning, error, info, and their matching `-subtle` surfaces |
| Progress | progress-track, progress-fill, progress-secondary |
| Navigation | nav-active-background, nav-active-text, nav-inactive-text, nav-hover-background |
| Controls/accessibility | disabled-background, disabled-text, focus-ring |

`finance-dashboard` is a complete alternate map: navy sidebar, blue
primary accent and restrained teal secondary accent. It reuses the Lingua layout;
there are no theme-specific components or layout overrides. Sidebar foreground
roles keep the dark Finance sidebar readable without changing ordinary card text.

Settings exposes the palette registry in `palettes.ts`. Selection is persisted in
IndexedDB through the application operation queue; it never duplicates components.
JetBrains Spring uses a near-black sidebar, bright spring-green accents and dark green
accent text to retain contrast on light surfaces. Proton-inspired uses a soft violet
canvas, white cards and deep violet accents. Both are light palettes.

To add another palette later, add a complete token map in
`tokens.css`, register its ID/label, register the ID in `src/domain/palettes.ts` (shared by settings and backup validation), and verify
contrast plus shared screens at 768, 1280 and 1920 px. Dark palettes should set
`color-scheme: dark`. Domain practice/grading and layouts require no changes.

Radius tokens are shared across palettes; swapping a palette does not change the
product structure. Current browser tests exercise all four palette maps, core text
contrast, navigation, enabled practice entry points and honest progress semantics. They do not
constitute a complete accessibility audit or Windows/Edge device verification.
