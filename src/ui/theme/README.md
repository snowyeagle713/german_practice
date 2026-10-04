# Semantic theme contract

`tokens.css` owns all palette literals. `styles.css` owns shared layout, spacing,
typography and component composition; it consumes CSS custom properties only for
colors and shadows. `src/main.tsx` selects `lingua-learning` on the document root.
The default CSS map also lives on `:root`, so the initial render has a palette.

The Lingua Learning layout uses a rounded learning sidebar, soft canvas, study
overview cards, a block card and an honest progress empty state. A study-position
bar on Learn represents the current URL-selected construction, not completion,
accuracy or mastery. No practice results, gamification or storage are introduced.

| Role | Token names (all prefixed with `--`) |
|---|---|
| App and shell | app-background, shell-background, sidebar-background |
| Reading surfaces | surface-background, surface-elevated, surface-subtle |
| Separation | border, shadow-card, shadow-elevated |
| Text | text-primary, text-secondary, text-inverse, sidebar-text, sidebar-text-secondary |
| Accents | accent-primary, accent-primary-hover, accent-primary-subtle, accent-secondary, accent-secondary-subtle |
| Status | success, warning, error, info, and their matching `-subtle` surfaces |
| Progress | progress-track, progress-fill, progress-secondary |
| Navigation | nav-active-background, nav-active-text, nav-inactive-text, nav-hover-background |
| Controls/accessibility | disabled-background, disabled-text, focus-ring |

`finance-dashboard` is a complete, internal alternate map: navy sidebar, blue
primary accent and restrained teal secondary accent. It reuses the Lingua layout;
there are no theme-specific components or layout overrides. Sidebar foreground
roles keep the dark Finance sidebar readable without changing ordinary card text.

To preview it during development, set `document.documentElement.dataset.theme =
'finance-dashboard'` in the browser console. This is intentionally not a user
feature and does not persist; a fresh app load selects Lingua. No Settings switcher,
theme storage, or query-string override is implemented.

To add JetBrains Spring or another palette later, add a complete
`:root[data-theme="palette-id"]` token map to `tokens.css`, then validate foreground/
background contrast and the shared UI at 768, 1280 and 1920 px. No domain, storage,
content or component refactoring is needed. The future Settings selector can set
the same root attribute and persist through the planned settings storage adapter.
Do not implement that persistence before its stage.

Radius tokens are shared across palettes; swapping a palette does not change the
product structure. Current browser tests exercise both palette maps, core text
contrast, navigation, disabled practice and honest progress semantics. They do not
constitute a complete accessibility audit or Windows/Edge device verification.
