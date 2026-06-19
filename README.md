# SwiftSwitch

Quickly toggle Obsidian CSS Snippets from a status bar popup.

## Features

- **Status Bar Button** — Click the SwiftSwitch button in the status bar to open the management popup
- **Toggle Snippets** — Click any snippet chip to enable/disable it instantly
- **Custom Groups** — Right-click empty space to add groups, then drag snippets into them
- **Drag & Drop** — Drag snippet chips between groups or back to "Ungrouped"
- **Fold/Expand Groups** — Click group header to collapse/expand, state is persisted
- **i18n** — Switch between Chinese and English via the CN/EN toggle in the popup header
- **Right-click Menu** — Copy content, edit, edit (open externally), delete, move to group
- **Add New Snippet** — Create new CSS snippets directly from the popup
- **Eye Care Colors** — Choose from warm background presets to reduce eye strain
- **Eye Care Patterns** — Textured backgrounds: linen, dots, grid, stripe, aurora, breathe
- **Dark/Light Mode Auto-Switch** — Eye care colors and floating button auto-adapt when switching modes
- **Floating Button** — Pin a draggable floating button with tangerine (dark) / grey (light) gradient style
- **Popup Position Memory** — Popup remembers its last position after being dragged

## Installation

### From GitHub

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/nilmarko/obsidian-swift-snippets/releases/latest)
2. Create a folder named `SwiftSnippets` in your vault's `.obsidian/plugins/` directory
3. Place the downloaded files inside that folder
4. Enable the plugin in Obsidian Settings → Community Plugins

### From Obsidian Community Plugins (pending review)

1. Open Settings → Community Plugins
2. Search for "SwiftSwitch"
3. Click Install, then Enable

## Usage

1. After enabling the plugin, a "SwiftSwitch" button appears in the status bar
2. Click it to open the snippet management popup
3. Click a snippet chip to toggle it on/off
4. Right-click a chip for more options (edit, delete, copy, move to group)
5. Right-click empty space in the popup to add a new group
6. Drag snippets between groups to organize them

## Changelog

### v1.0.3 (2026-06-19)

- **Pull Cord Fix** — Fixed pull cord not hiding after drag, stale event listeners causing ghost pull cord on screen
- **Floating Button Cleanup** — Properly cleanup global event listeners when recreating floating button on mode switch

### v1.0.2 (2026-06-19)

- **Rename to SwiftSwitch** — Plugin renamed from SwiftSnippets to SwiftSwitch (id unchanged)
- **Eye Care Patterns** — Added 6 textured eye care presets: linen, dots, grid, stripe, aurora, breathe
- **Dark Mode Eye Care** — All eye care presets now have dark mode counterparts with auto-switching
- **Floating Button Redesign** — New default gradient style: tangerine (dark mode) / grey (light mode)
- **Popup Position Memory** — Popup remembers its position after being dragged
- **Feedback Chip** — Added a "Feedback" link to GitHub in the popup footer

## Development

This plugin is desktop-only because it uses Node.js APIs for file operations.

## License

MIT
