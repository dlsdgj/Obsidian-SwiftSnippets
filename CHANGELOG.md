## 🆕 v1.1.9 (2026-08-13)

- **Chip Hover Tooltip / Chip悬停提示** — Hover any chip (theme, background, snippet, etc.) to instantly see its right-click options as an interactive tooltip; click an option to execute it directly without right-clicking / 鼠标悬停任意Chip（主题、背景、snippet等）即可显示其全部右键选项的互动提示，点击选项可直接执行，无需右键
- **Background Leak Fix / 背景泄漏修复** — Fixed background leaking to new pages when switching documents with style memory enabled; "Set as default for new pages" now works independently even when style memory is off; same-name image background no longer leaks to pages without a matching image / 修复记忆模式下切换文档时背景泄漏到新页面的问题；"设为新页面默认"在风格记忆关闭时也独立生效；同名图片背景不再泄漏到无同名图片的页面

## v1.1.8 (2026-07-06)

- **Custom Background Color / 自定义背景色** — Add "+ Add" chip at the end of background/image chips; click to open a color picker with manual hex input; custom colors auto-invert when switching dark/light mode / 背景/图片区域末尾添加"+ 添加"chip，点击弹出颜色选择器支持手动输入色值，深浅模式自动反色
- **Default Mode Toggle / 新页面默认深浅模式** — Right-click theme or background chip to set "Default mode for new pages: dark/light" toggle below "Set as default for new pages" / 主题chip和背景chip右键菜单"设为新页面默认"下方添加"新页面默认为:深/浅"开关
- **Cyclic Background Scroll / 循环滚动切换背景** — Floating button scroll wheel now cycles through backgrounds (wraps from last to first and vice versa) / 悬浮按钮滚轮切换背景改为循环滚动（到末尾回到开头）
- **Independent Font Style Settings / 独立字体样式设置** — Color, opacity, line height, and margin settings moved from under "Font" to a separate "Font Style" section at the same level; works regardless of font toggle state / 字体颜色/透明度/行间距/边距设置从"字体"标题下独立为"字体 样式"同级区域，无论字体切换是否启用均可工作
- **Settings Panel / 设置面板** — ⚙️ icon in footer opens a settings popup; includes "Use same-name image as background on document open" option / 底部⚙️图标打开设置窗口，含"打开文档时使用同名图片作背景"选项
- **Fixed Footer / 底部固定** — Settings icon and plugin links are now pinned to the bottom of the management panel / 设置按钮和更多插件链接固定在管理面板窗口底部

## v1.1.7 (2026-07-05)

- **Theme Delete / 主题删除** — Right-click theme chip to delete theme; auto-switches to default if deleting active theme; confirmation dialog with hint / 右键主题chip可删除主题；删除当前主题时自动切换为默认；带确认对话框
- **Default Theme for New Pages / 新页面默认主题** — Right-click theme chip to set as default for new pages; when memory mode is on and a page has no saved style, the default theme is applied automatically / 右键主题chip设为新页面默认主题；记忆模式下无保存风格的新页面自动应用默认主题
- **Default Background for New Pages / 新页面默认背景** — Right-click background/image chip to set as default for new pages; supports preset snippets and custom images; auto-applied to pages without saved style / 右键背景/图片chip设为新页面默认背景；支持预设snippet和自定义图片；无保存风格的新页面自动应用

## v1.1.6 (2026-07-02)

- **Mobile Support / 支持移动端背景切换** — Background/image switching now works on Obsidian Mobile; ribbon icon entry; mobile font color/opacity/line-height/margin settings; pic/phone/ subfolder for mobile-specific images / 背景图片切换现已支持 Obsidian 移动端；左侧栏图标入口；手机端字体颜色/透明度/行间距/边距设置；pic/phone/ 子目录存放手机专属图片

## v1.1.5 (2026-07-01)

- **Mac Edit Crash Fix / Mac编辑崩溃修复** — Fixed `Cannot read properties of null` error when editing snippets via right-click menu on macOS; click event no longer bubbles to overlay and closes popup prematurely / 修复 macOS 上右键菜单编辑 Snippet 时的空指针崩溃；点击事件不再冒泡到 overlay 导致 popup 提前关闭

## v1.1.4 (2026-07-01)

- **Font Preload / 字体预加载** — System font list is preloaded in background after startup; first hover on font button no longer has long delay / 系统字体列表在启动后后台预加载，首次悬浮字体按钮不再有长延迟
- **Startup Speed / 启动速度** — Non-essential init tasks (pic folder scan, eye care snippet export) deferred to idle callback; no longer blocks Obsidian startup / 非必要初始化任务延迟到空闲时执行，不再阻塞 Obsidian 启动
- **Dark/Light Font Color Inversion / 深浅模式字体颜色反色** — Font color auto-inverts (RGB 255-x) when switching to dark mode; reverts to original in light mode / 切换到深色模式时字体颜色自动取反（RGB 255-x），浅色模式恢复原色
- **Font Color for Side Panels / 字体颜色应用到侧面板** — Font color now also applies to side panels (file explorer, search, outline, tags, backlinks) / 字体颜色同时应用到左右侧面板（文件树、搜索、大纲、标签、反向链接）
- **Style Memory Fix / 记忆模式修复** — Scroll-wheel background changes on floating button now properly saved to page style memory; no longer lost on restart / 悬浮按钮滚轮切换背景现在正确保存到页面风格记忆，重启后不再丢失
- **Startup Memory Restore / 启动时恢复记忆** — Current page's remembered style is now restored on plugin startup, not only on tab switch / 当前页面的记忆风格在插件启动时即恢复，而非仅切换标签页时
- **Floating Button Edge / 悬浮按钮边缘** — Dragging floating button to right/bottom edge no longer blocked by hardcoded 80px/40px margin / 拖拽悬浮按钮到右/下边缘不再被硬编码的 80px/40px 边距阻挡

## v1.1.3 (2026-06-26)

- **Font Memory / 字体记忆** — Style memory mode now also remembers font settings (active font, enable/disable, color, opacity, line height, margins) / 记忆模式现在同时记忆字体设置（活动字体、启用/禁用、颜色、透明度、行间距、边距）
- **Font Toggle Reversed / 字体按钮逆转** — Font enable/disable button now shows the opposite action: "Disable" when enabled, "Enable" when disabled / 字体启用/禁用按钮显示相反操作：启用时显示"禁用"，禁用时显示"启用"
- **Font Section Collapse / 字体区域折叠** — Added ▶/▼ collapse toggle before font section header; collapse state is persisted / 字体标题前添加▶/▼折叠按钮，折叠状态持久化
- **Font Collapse on Close / 关闭时折叠** — If font section is expanded when closing the management popup, it starts collapsed on next open / 关闭面板时字体区域为展开状态，下次打开时设为折叠
- **Font Applied to Side Panels / 字体应用到侧面板** — Font settings now also apply to side panels (file explorer, search, outline, tags, backlinks) / 字体设置同时应用到左右侧面板（文件树、搜索、大纲、标签、反向链接）
- **Image Stretch Mode / 图片拉伸模式** — Added "Stretch" chip option for background images (100%×100% fill), mutually exclusive with "Tile" / 背景图片添加"拉伸"chip选项（100%×100%填充），与"平铺"互斥
- **Status Bar Font Button / 状态栏字体按钮** — New "f" chip in font section header adds a font button to the status bar; scroll wheel cycles through favorite fonts; hover to open standalone font manager panel / 字体标题后添加"f" chip，点击创建状态栏字体按钮；滚轮切换收藏字体；悬浮打开独立字体管理面板
- **Standalone Font Manager / 独立字体管理面板** — Hovering the status bar font button opens a font management panel in the bottom-right corner; mouse-leave auto-closes; dragging the panel pins it (no auto-close) / 悬浮状态栏字体按钮打开右下角字体管理面板；鼠标离开自动关闭；拖动面板后固定（不自动关闭）

## v1.1.2 (2026-06-26)

- **Hover Preview / 悬浮预览** — Hover on snippet/theme/font chips to instantly preview the effect; mouse leave restores previous state; click to apply / 悬浮 snippet/主题/字体 chip 即时预览效果，鼠标离开恢复原状，点击应用
- **Font Management / 字体管理** — New "Font" section with system font chips, ⭐ favorites, and settings (color, opacity, line height, left/right margin); lazy-loaded on click / 新增"字体"区域，系统字体 chip、⭐收藏、颜色/透明度/行间距/左右边距设置，点击标题懒加载
- **Font Enable/Disable / 字体开关** — Toggle button in font section header to quickly disable/enable all font customizations / 字体标题栏启用/禁用按钮，快速切换字体自定义
- **Default Font Chip / 默认字体** — First chip in font list resets to system default font / 字体列表首个 chip 恢复系统默认字体
- **Theme Hover Preview / 主题悬浮预览** — Hover theme chips to preview theme in real-time without applying / 悬浮主题 chip 实时预览主题效果
- **Image Chip Preview / 图片 chip 预览** — Hover image background chips to preview the image effect on the editor / 悬浮图片背景 chip 预览图片效果
- **Exclusive Group Preview / 互斥分组预览** — Hover preview on exclusive group chips temporarily disables other group members / 悬浮互斥分组 chip 预览时临时禁用同组其他成员
- **Drag Refresh Fix / 拖拽刷新修复** — Dragging snippets out of Background/Image group now properly refreshes both areas / 从背景/图片分组拖出 snippet 时正确刷新两个区域
- **Image Click Fix / 图片点击修复** — Clicking image chips now correctly applies instead of toggling off due to preview state / 修复图片 chip 因预览状态导致点击反而取消的问题

## v1.1.1 (2026-06-25)

- **Dark/Light Image Auto-Switch / 深浅模式图片自动切换** — Background images with `-light`/`-dark` suffix (e.g. `田-light.png` + `田-dark.png`) auto-switch when toggling dark/light mode / 带有 `-light`/`-dark` 后缀的背景图片（如 `田-light.png` + `田-dark.png`）在切换深浅模式时自动切换
- **Paired Image Chips / 配对图片合并** — Paired light/dark images merge into a single chip with a rotating yin-yang icon and base name only / 配对的深浅图片合并为单个 chip，显示旋转太极图和基础名称
- **Floating Button Wheel / 悬浮按钮滚轮** — Scroll wheel on floating button now cycles through both CSS snippets and background images / 悬浮按钮滚轮现在可切换 CSS 片段和背景图片
- **Delete Preset Persistence / 删除预设持久化** — Deleted `ss-` preset snippets are remembered; no longer recreated on plugin reload / 删除的 `ss-` 预设片段会被记住，插件重启后不再重建
- **No Delete Confirmation / 删除无需确认** — Removed confirm dialog when deleting snippet chips / 删除 snippet chip 时不再弹出确认窗口
- **Default Panel Width / 默认面板宽度** — Management popup starts at 480px width instead of full viewport; still resizable via drag handle / 管理面板默认宽度 480px 而非全屏，仍可通过拖拽手柄调整

## v1.1.0 (2026-06-25)

- **Eye Care Presets as CSS Snippets / 护眼色预设导出为CSS片段** — Exported all 22 eye care presets (colors + patterns) to `.obsidian/snippets/ss-*.css` files with `.theme-dark`/`.theme-light` selectors for automatic dark/light mode adaptation / 将22个护眼色预设（纯色+图案）导出为 `.obsidian/snippets/ss-*.css` 文件，使用 `.theme-dark`/`.theme-light` 选择器自动适配深浅模式
- **Background/Image Unified Group / 背景图片统一分组** — Merged background colors and image backgrounds into a single "Background/Image" group with mutual exclusion; drag snippets in from other groups / 将背景色和图片背景合并为统一的"背景/图片"分组，互斥切换；支持从其他分组拖入snippet
- **Mode Switch Visibility / 模式开关可见性** — Dark/light mode toggle in popup header now hides when floating button is active, reappears when floating button is closed / 管理面板中的深浅模式开关在有悬浮按钮时隐藏，关闭悬浮按钮后显示
- **Exclusive Background Group / 背景分组互斥** — Background/Image group is exclusive by default; enabling one snippet disables others; selecting an image disables all snippets and vice versa / 背景分组默认互斥，启用一个snippet自动禁用其他；选中图片时禁用所有snippet
- **Language-Safe Group Key / 语言安全分组键** — Background group uses fixed `__bg__` key instead of localized name, preventing duplicate groups on language switch; auto-migrates old groups / 背景分组使用固定 `__bg__` 键而非本地化名称，避免语言切换时重复生成分组；自动迁移旧分组
- **Delete from Background Group / 从背景分组删除** — Deleting a snippet from the Background/Image group now removes the file entirely instead of moving it to "Ungrouped" / 从背景/图片分组删除snippet时直接删除文件，而非移到"未分组"
- **Share/More Link / 分享链接** — Added a "Share/More" link in the Background/Image section header linking to GitHub Discussions / 在背景/图片标题栏添加"分享/更多"链接至GitHub Discussions

## v1.0.9 (2026-06-25)

- **Open Folder Fix / 打开文件夹修复** — Fixed "open background image folder" button not working; switched from `electron.shell` to `child_process.exec` / 修复"打开背景图片文件夹"按钮点击无效，改用 `child_process.exec` 调用系统命令
- **Header Bar Redesign / 标题栏重设计** — Removed standalone white header bar; header now flows naturally with popup content, no more floating white strip or content clipping / 移除独立白色标题栏，标题栏融入面板内容流，不再悬浮白条或遮挡内容
- **Horizontal Scrollbar Fix / 横向滚动条修复** — Removed unwanted horizontal scrollbar in the management popup / 移除管理面板底部多余的横向滚动条
- **Resize Handle Repositioned / 调整手柄重定位** — Resize handle now sits at the true bottom-right corner of the popup (SwiftGloss style), using `position: fixed` with dynamic position tracking / 调整大小手柄移至面板真正右下角（参考SwiftGloss），使用固定定位动态跟踪
- **Wheel Event Violation Fix / 滚轮事件警告修复** — Added `{ passive: false }` to wheel event listener to eliminate Chrome violation warning / 为滚轮事件添加 `{ passive: false }` 消除 Chrome 违规警告
- **Click Handler Performance / 点击性能优化** — Deferred popup opening with `setTimeout` to avoid blocking the click handler / 使用 `setTimeout` 延迟打开面板，避免阻塞点击事件

## v1.0.8 (2026-06-22)

- **Status Bar Editable / 状态栏按钮可编辑** — Right-click status bar button to edit text and CSS style, with live preview / 右键状态栏按钮可修改文字和CSS样式，带实时预览
- **Context Menu Overflow Fix / 右键菜单溢出修复** — Status bar right-click menu auto-adjusts position to stay within screen / 状态栏右键菜单自动修正位置防止溢出屏幕
- **Version Auto-Read / 版本号自动读取** — Popup version tag now reads from manifest instead of hardcoded value / 管理面板版本号从 manifest 自动读取，不再硬编码
- **Snippet Edit Error Handling / 编辑错误处理** — Failed to read snippet file now shows Notice with details instead of silent empty form / 读取snippet文件失败时显示Notice提示，不再静默打开空表单
- **Debug Console Logs / 调试日志** — Added console logging for snippet edit file read operations / 添加snippet编辑文件读取的控制台日志

## v1.0.7 (2026-06-22)

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
