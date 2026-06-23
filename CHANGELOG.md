## 🆕 v1.0.7 (2026-06-22)

- **Image Background / 图片背景** — Support local image backgrounds from `pic` folder; auto-detected and displayed as pill-shaped chips / 支持本地图片背景，自动检测 `pic` 文件夹并以药丸形 chip 显示
- **Tile Mode / 平铺模式** — Added "Tile" option for image backgrounds to repeat small images instead of cover / 图片背景新增"平铺"选项，小图重复排列而非铺满
- **Opacity Control / 透明度控制** — Inline opacity slider in title row when an image is selected / 选中图片时标题行内联透明度滑块
- **Minimap Fix / 小地图修复** — Fixed SwiftMatch minimap being displaced by image background CSS / 修复图片背景 CSS 导致 SwiftMatch 小地图偏移
- **Plugin Dir Helper / 插件目录辅助** — Added `_getPluginDir()` with fallback chain to fix image loading path issues / 新增 `_getPluginDir()` 多级回退修复图片加载路径问题
- **Image Section Redesign / 图片区重设计** — New "背景-图片" title with "?" help tooltip; controls in title row, no duplicate display / 新增"背景-图片"标题及"?"提示；控件在标题行，不再重复显示

## v1.0.6 (2026-06-20)

- **Silent Page Switch / 静默页面切换** — No more notification popups when switching between pages with style memory / 切换页面时不再显示通知弹窗
- **Popup Scroll-through Fix / 面板滚轮穿透修复** — Mouse wheel properly passes through popup overlay to scroll the page beneath / 滚轮事件正确穿透面板传递到下方页面
- **Pull Cord Fix / 拉绳修复** — Pull cord no longer stretches the popup layout; positioned absolutely below the indicator button / 拉绳不再拉伸面板布局，绝对定位在指示按钮下方
- **Indicator Button Redesign / 指示按钮重设计** — Compact circular gradient button matching floating button style; click toggles floating button, pull cord switches dark/light mode / 紧凑圆形渐变按钮匹配悬浮按钮样式；点击切换悬浮按钮，拉绳切换深浅模式
- **Stable Scrollbar / 稳定滚动条** — scrollbar-gutter: stable prevents chip reflow / 防止滚动条出现时 chip 重排
- **Dialog Protection / 对话框保护** — Adding/deleting groups no longer accidentally closes the management popup / 添加/删除分组不再意外关闭管理面板

## v1.0.5 (2026-06-20)

- **Page Style Memory / 页面风格记忆** — Remember each page's theme, dark/light mode, eye care color, and enabled snippets; auto-restore on page switch / 记住每个页面的主题、深浅模式、护眼色和已启用 Snippet，切换页面时自动恢复
- **Exclusive Groups / 互斥分组** — Snippets in exclusive groups (e.g. "标题") cannot be enabled simultaneously; toggle via group header ⊘ button or right-click menu / 互斥分组中的 Snippet 不能同时开启，通过分组头 ⊘ 按钮或右键菜单切换
- **Floating Button Toggle / 悬浮按钮切换** — Dark/light indicator button in popup now toggles floating button visibility; pull cord switches dark/light mode / 面板深浅指示按钮点击切换悬浮按钮显隐，拉绳切换深浅模式
- **Popup Scroll-through / 面板滚轮穿透** — Mouse wheel events pass through the popup overlay to the page beneath / 滚轮事件穿透面板传递到下方页面
- **Stable Scrollbar / 稳定滚动条** — Popup uses scrollbar-gutter: stable to prevent chip reflow / 面板使用 scrollbar-gutter 防止滚动条出现时 chip 重排
- **Snippet Cache / Snippet 缓存** — In-memory cache for snippet enabled state, fixing stale chip status after toggling / 内存缓存 Snippet 启用状态，修复切换后 chip 状态延迟问题

## v1.0.4 (2026-06-19)

- **Meditation Breathing / 冥想呼吸** — Added 4-7-8 breathing (inhale 4s-hold 7s-exhale 8s) and Box breathing (4-4-4-4) guided visual animations / 新增4-7-8呼吸法和方块呼吸引导动画
- **Edge Glow / 边缘呼吸** — Screen edge glow breathing effect via box-shadow overlay / 屏幕四周光晕明暗呼吸
- **Cursor Glow / 光标呼吸** — Mouse-following radial glow with breathing animation / 跟随鼠标的径向光晕呼吸
- **Scroll Wheel Swap / 滚轮行为调转** — Scroll now cycles eye care colors; Ctrl/Shift+scroll switches themes / 滚轮切换护眼色，Ctrl/Shift+滚轮切换主题
- **Breathing Chip Hints / 呼吸提示** — Hover on breathing chips to see rhythm description / 悬停呼吸chip查看节奏说明

## v1.0.3 (2026-06-19)

- **Pull Cord Fix / 拉绳修复** — Fixed pull cord not hiding after drag, stale event listeners causing ghost pull cord / 修复拉绳操作后不消失、残留幽灵拉绳的问题
- **Floating Button Cleanup / 悬浮按钮清理** — Properly cleanup global event listeners when recreating floating button on mode switch / 模式切换重建悬浮按钮时正确清理全局事件监听器

## v1.0.2 (2026-06-19)

- **Rename to SwiftSwitch / 更名为 SwiftSwitch** — Plugin renamed from SwiftSnippets to SwiftSwitch (id unchanged) / 插件从 SwiftSnippets 更名为 SwiftSwitch（id 不变）
- **Eye Care Patterns / 护眼纹理** — Added 6 textured eye care presets: linen, dots, grid, stripe, aurora, breathe / 新增 6 种纹理护眼色：亚麻纹、波点、方格、条纹、极光、呼吸
- **Dark Mode Eye Care / 深色模式护眼色** — All eye care presets now have dark mode counterparts with auto-switching / 所有护眼色预设新增深色模式版本，切换模式时自动适配
- **Floating Button Redesign / 悬浮按钮重设计** — New default gradient style: tangerine (dark mode) / grey (light mode) / 新默认渐变样式：深色模式橙黄渐变 / 浅色模式灰白渐变
- **Popup Position Memory / 面板位置记忆** — Popup remembers its position after being dragged / 面板拖拽后记住坐标，下次打开恢复
- **Feedback Chip / 反馈链接** — Added a "Feedback" link to GitHub in the popup footer / 面板底部新增"反馈"链接

## v1.0.1 (2026-06-18)

- **Fix Description / 修复描述** — Removed "Obsidian" from plugin description per community plugin guidelines / 按社区插件规范移除描述中的 "Obsidian"
- **Fix Release Workflow / 修复发布工作流** — Removed non-existent styles.css from release workflow, added write permission / 从发布工作流移除不存在的 styles.css，添加写权限

## v1.0.0 (2026-06-18)

- **Initial Release / 首次发布** — SwiftSnippets is a status bar popup for quickly toggling Obsidian CSS Snippets / SwiftSnippets 是一个状态栏弹窗，用于快速切换 Obsidian CSS Snippets
- **Status Bar Button / 状态栏按钮** — Click SwiftSnippets in the status bar to open the management popup / 点击状态栏的 SwiftSnippets 按钮打开管理弹窗
- **Toggle Snippets / 切换 Snippet** — Click any snippet chip to enable/disable instantly / 点击 chip 即可启用/禁用
- **Custom Groups / 自定义分组** — Right-click empty space to add groups, drag snippets into them / 右键空白处添加分组，拖拽 snippet 移入分组
- **Drag & Drop / 拖拽排序** — Drag snippet chips between groups or back to Ungrouped / 在分组间拖拽 chip 或拖回未分组
- **Fold/Expand Groups / 折叠展开分组** — Click group header to collapse/expand, state persisted / 点击分组头折叠/展开，状态持久化
- **i18n / 中英文切换** — Switch between Chinese and English via CN/EN toggle / 通过 CN/EN 切换按钮切换中英文
- **Right-click Menu / 右键菜单** — Copy content, edit, edit (open externally), delete, move to group / 复制内容、编辑、编辑(外部程序打开)、删除、移入分组
- **Add New Snippet / 添加新 Snippet** — Create new CSS snippets directly from the popup / 在弹窗中直接创建新 CSS snippet
