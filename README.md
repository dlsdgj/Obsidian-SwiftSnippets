# SwiftSnippets

Quickly toggle Obsidian CSS Snippets from a status bar popup.

![Demo](assets/demo.gif)

## Features

- **Status Bar Button** — Click the SwiftSnippets button in the status bar to open the management popup
- **Toggle Snippets** — Click any snippet chip to enable/disable it instantly
- **Custom Groups** — Right-click empty space to add groups, then drag snippets into them
- **Drag & Drop** — Drag snippet chips between groups or back to "Ungrouped"
- **Fold/Expand Groups** — Click group header to collapse/expand, state is persisted
- **i18n** — Switch between Chinese and English via the CN/EN toggle in the popup header
- **Right-click Menu** — Copy content, edit, edit (open externally), delete, move to group
- **Add New Snippet** — Create new CSS snippets directly from the popup

## Installation

### From GitHub

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/nilmarko/obsidian-swift-snippets/releases/latest)
2. Create a folder named `SwiftSnippets` in your vault's `.obsidian/plugins/` directory
3. Place the downloaded files inside that folder
4. Enable the plugin in Obsidian Settings → Community Plugins

### From Obsidian Community Plugins (pending review)

1. Open Settings → Community Plugins
2. Search for "SwiftSnippets"
3. Click Install, then Enable

## Usage

1. After enabling the plugin, a "SwiftSnippets" button appears in the status bar
2. Click it to open the snippet management popup
3. Click a snippet chip to toggle it on/off
4. Right-click a chip for more options (edit, delete, copy, move to group)
5. Right-click empty space in the popup to add a new group
6. Drag snippets between groups to organize them

## Development

This plugin is desktop-only because it uses Node.js APIs for file operations.

## License

MIT

## Sponsor / 赞助

If you find this plugin helpful, consider buying me a coffee! / 如果这个插件对你有帮助，请考虑支持我！

<img src="assets/reward.png" width="300" />
