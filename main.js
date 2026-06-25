const { Plugin, Notice } = require('obsidian');
const nodePath = require('path');
const nodeFs = require('fs');

// ─── i18n ────────────────────────────────────────────────────────────────────
let _currentLang = 'en';

const i18n = {
  zh: {
    'popup.title': 'SwiftSwitch',
    'popup.feedback': '反馈',
    'snippet.enabled': '已启用',
    'snippet.disabled': '已禁用',
    'snippet.noSnippets': '暂无 CSS Snippets',
    'snippet.add': '添加 Snippet',
    'snippet.title': '标题',
    'snippet.content': 'CSS 内容',
    'snippet.titlePlaceholder': '输入 snippet 标题...',
    'snippet.contentPlaceholder': '输入 CSS 内容...',
    'snippet.added': 'Snippet 已添加',
    'snippet.addFailed': '添加 Snippet 失败',
    'snippet.toggled': 'Snippet 状态已切换',
    'snippet.toggleFailed': '切换 Snippet 状态失败',
    'snippet.restartRequired': '需要重启生效',
    'context.copy': '复制',
    'context.edit': '编辑',
    'context.editExternal': '编辑(外部程序打开)',
    'context.delete': '删除',
    'context.moveToGroup': '移入分组',
    'context.removeFromGroup': '移出分组',
    'context.renameGroup': '重命名分组',
    'context.deleteGroup': '删除分组',
    'btn.cancel': '取消',
    'btn.save': '保存',
    'btn.copied': '已复制',
    'group.add': '添加分组',
    'group.namePlaceholder': '输入分组名称...',
    'group.ungrouped': '未分组',
    'group.renameTitle': '重命名分组',
    'theme.section': '主题',
    'theme.noThemes': '暂无已安装主题',
    'theme.switched': '主题已切换',
    'theme.switchFailed': '切换主题失败',
    'theme.restartRequired': '需要重启生效',
    'theme.default': '默认',
    'float.edit': '编辑',
    'float.editTitle': '编辑悬浮按钮',
    'float.editText': '按钮文字',
    'float.editStyle': '按钮样式 (CSS)',
    'float.close': '关闭',
    'float.defaultText': ' ',
    'statusBar.edit': '编辑',
    'statusBar.editTitle': '编辑状态栏按钮',
    'statusBar.editText': '按钮文字',
    'statusBar.editStyle': '按钮样式 (CSS)',
    'statusBar.defaultText': 'SwiftSwitch',
    'mode.dark': '深色',
    'mode.light': '浅色',
    'mode.switched': '模式已切换',
    'mode.switchFailed': '切换模式失败',
    'pull.hint': '拉一下切换模式',
    'eyeCare.section': '背景',
    'eyeCare.default': '默认',
    'eyeCare.cream': '奶油',
    'eyeCare.green': '豆绿',
    'eyeCare.yellow': '暖黄',
    'eyeCare.mint': '薄荷',
    'eyeCare.beige': '米色',
    'eyeCare.sepia': '羊皮纸',
    'eyeCare.linen': '亚麻纹',
    'eyeCare.dot': '波点',
    'eyeCare.grid': '方格',
    'eyeCare.stripe': '条纹',
    'eyeCare.aurora': '极光',
    'eyeCare.honeycomb': '蜂窝',
    'eyeCare.waves': '水波',
    'eyeCare.diamond': '菱格',
    'eyeCare.noise': '噪点',
    'eyeCare.paper': '宣纸',
    'eyeCare.crosshatch': '交叉线',
    'eyeCare.breathe': '呼吸',
    'eyeCare.breathe478': '4-7-8呼吸',
    'eyeCare.breatheBox': '方块呼吸',
    'eyeCare.edgeGlow': '边缘呼吸',
    'eyeCare.cursorGlow': '光标呼吸',
    'eyeCare.breathe.hint': '5秒周期，中心光晕呼吸',
    'eyeCare.breathe478.hint': '吸气4秒-屏息7秒-呼气8秒，引导放松呼吸',
    'eyeCare.breatheBox.hint': '吸气4秒-屏息4秒-呼气4秒-屏息4秒，均匀节奏',
    'eyeCare.edgeGlow.hint': '屏幕四周光晕明暗呼吸',
    'eyeCare.cursorGlow.hint': '跟随鼠标的光晕呼吸',
    'eyeCare.imgRemove': '移除',
    'eyeCare.imgOpacity': '透明度',
    'eyeCare.imgTile': '平铺',
    'eyeCare.imgTitle': '图片',
    'eyeCare.imgHelp': '将图片文件放入 .obsidian\\plugins\\SwiftSnippets\\pic\\',
    'eyeCare.imgOpenFolder': '点击打开文件夹',
    'eyeCare.imgRename': '重命名',
    'eyeCare.imgRotate': '旋转',
    'eyeCare.imgDelete': '删除',
    'eyeCare.imgRenameTitle': '重命名图片',
    'eyeCare.imgNamePlaceholder': '输入新名称...',
    'eyeCare.imgRotated': '图片已旋转',
    'eyeCare.imgDeleted': '图片已删除',
    'eyeCare.imgRenameFailed': '重命名失败',
    'eyeCare.imgRotateFailed': '旋转失败',
    'styleMemory.chip': '记忆模式',
    'styleMemory.hint': '记忆模式：记住每个页面的风格，切换时自动恢复',
    'styleMemory.on': '记忆模式已开启',
    'styleMemory.off': '记忆模式已关闭',
    'styleMemory.saved': '页面风格已记忆',
    'styleMemory.restored': '已恢复页面风格',
    'styleMemory.restoreFailed': '恢复页面风格失败',
    'group.exclusive': '互斥分组',
    'group.exclusive.on': '已设为互斥分组',
    'group.exclusive.off': '已取消互斥分组',
    'group.exclusive.hint': '互斥分组中的 Snippet 不能同时开启',
  },
  en: {
    'popup.title': 'SwiftSwitch',
    'popup.feedback': 'Feedback',
    'snippet.enabled': 'Enabled',
    'snippet.disabled': 'Disabled',
    'snippet.noSnippets': 'No CSS Snippets',
    'snippet.add': 'Add Snippet',
    'snippet.title': 'Title',
    'snippet.content': 'CSS Content',
    'snippet.titlePlaceholder': 'Enter snippet title...',
    'snippet.contentPlaceholder': 'Enter CSS content...',
    'snippet.added': 'Snippet added',
    'snippet.addFailed': 'Failed to add snippet',
    'snippet.toggled': 'Snippet toggled',
    'snippet.toggleFailed': 'Failed to toggle snippet',
    'snippet.restartRequired': 'Restart required',
    'context.copy': 'Copy',
    'context.edit': 'Edit',
    'context.editExternal': 'Edit (Open Externally)',
    'context.delete': 'Delete',
    'context.moveToGroup': 'Move to Group',
    'context.removeFromGroup': 'Remove from Group',
    'context.renameGroup': 'Rename Group',
    'context.deleteGroup': 'Delete Group',
    'btn.cancel': 'Cancel',
    'btn.save': 'Save',
    'btn.copied': 'Copied',
    'group.add': 'Add Group',
    'group.namePlaceholder': 'Enter group name...',
    'group.ungrouped': 'Ungrouped',
    'group.renameTitle': 'Rename Group',
    'theme.section': 'Themes',
    'theme.noThemes': 'No themes installed',
    'theme.switched': 'Theme switched',
    'theme.switchFailed': 'Failed to switch theme',
    'theme.restartRequired': 'Restart required',
    'theme.default': 'Default',
    'float.edit': 'Edit',
    'float.editTitle': 'Edit Floating Button',
    'float.editText': 'Button Text',
    'float.editStyle': 'Button Style (CSS)',
    'float.close': 'Close',
    'float.defaultText': ' ',
    'statusBar.edit': 'Edit',
    'statusBar.editTitle': 'Edit Status Bar Button',
    'statusBar.editText': 'Button Text',
    'statusBar.editStyle': 'Button Style (CSS)',
    'statusBar.defaultText': 'SwiftSwitch',
    'mode.dark': 'Dark',
    'mode.light': 'Light',
    'mode.switched': 'Mode switched',
    'mode.switchFailed': 'Failed to switch mode',
    'pull.hint': 'Pull to switch mode',
    'eyeCare.section': 'Background',
    'eyeCare.default': 'Default',
    'eyeCare.cream': 'Cream',
    'eyeCare.green': 'Green',
    'eyeCare.yellow': 'Warm',
    'eyeCare.mint': 'Mint',
    'eyeCare.beige': 'Beige',
    'eyeCare.sepia': 'Sepia',
    'eyeCare.linen': 'Linen',
    'eyeCare.dot': 'Dots',
    'eyeCare.grid': 'Grid',
    'eyeCare.stripe': 'Stripe',
    'eyeCare.aurora': 'Aurora',
    'eyeCare.honeycomb': 'Honeycomb',
    'eyeCare.waves': 'Waves',
    'eyeCare.diamond': 'Diamond',
    'eyeCare.noise': 'Noise',
    'eyeCare.paper': 'Rice Paper',
    'eyeCare.crosshatch': 'Crosshatch',
    'eyeCare.breathe': 'Breathe',
    'eyeCare.breathe478': '4-7-8 Breathe',
    'eyeCare.breatheBox': 'Box Breathe',
    'eyeCare.edgeGlow': 'Edge Glow',
    'eyeCare.cursorGlow': 'Cursor Glow',
    'eyeCare.breathe.hint': '5s cycle, center glow breathing',
    'eyeCare.breathe478.hint': 'Inhale 4s - Hold 7s - Exhale 8s, guided relaxation',
    'eyeCare.breatheBox.hint': 'Inhale 4s - Hold 4s - Exhale 4s - Hold 4s, even rhythm',
    'eyeCare.edgeGlow.hint': 'Screen edge glow breathing',
    'eyeCare.cursorGlow.hint': 'Cursor-following glow breathing',
    'eyeCare.imgRemove': 'Remove',
    'eyeCare.imgOpacity': 'Opacity',
    'eyeCare.imgTile': 'Tile',
    'eyeCare.imgTitle': 'Image',
    'eyeCare.imgHelp': 'Put image files into .obsidian\\plugins\\SwiftSnippets\\pic\\',
    'eyeCare.imgOpenFolder': 'Click to open folder',
    'eyeCare.imgRename': 'Rename',
    'eyeCare.imgRotate': 'Rotate',
    'eyeCare.imgDelete': 'Delete',
    'eyeCare.imgRenameTitle': 'Rename Image',
    'eyeCare.imgNamePlaceholder': 'Enter new name...',
    'eyeCare.imgRotated': 'Image rotated',
    'eyeCare.imgDeleted': 'Image deleted',
    'eyeCare.imgRenameFailed': 'Rename failed',
    'eyeCare.imgRotateFailed': 'Rotate failed',
    'styleMemory.chip': 'Memory Mode',
    'styleMemory.hint': 'Memory mode: remember each page style, auto-restore on switch',
    'styleMemory.on': 'Memory mode on',
    'styleMemory.off': 'Memory mode off',
    'styleMemory.saved': 'Page style saved',
    'styleMemory.restored': 'Page style restored',
    'styleMemory.restoreFailed': 'Failed to restore page style',
    'group.exclusive': 'Exclusive Group',
    'group.exclusive.on': 'Set as exclusive group',
    'group.exclusive.off': 'Exclusive group removed',
    'group.exclusive.hint': 'Snippets in exclusive group cannot be enabled simultaneously',
  }
};

function t(key) {
  if (i18n[_currentLang] && i18n[_currentLang].hasOwnProperty(key)) {
    return i18n[_currentLang][key];
  }
  if (i18n['en'] && i18n['en'].hasOwnProperty(key)) {
    return i18n['en'][key];
  }
  return key;
}

// ─── Plugin ──────────────────────────────────────────────────────────────────
class SwiftSwitchPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    _currentLang = this.settings.language || 'en';

    this._statusBarEl = this.addStatusBarItem();
    this._statusBarEl.setText('SwiftSwitch');
    this._statusBarEl.title = t('popup.title');
    this._statusBarEl.style.cursor = 'pointer';
    this._statusBarEl.style.opacity = '0.8';
    this._applyStatusBarStyle();
    this._statusBarEl.addEventListener('click', () => this.openSnippetsPopup());

    // 右键编辑状态栏按钮
    this._statusBarEl.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._showStatusBarContextMenu(e);
    });

    // 滚轮切换主题
    this._statusBarEl.addEventListener('wheel', async (e) => {
      e.preventDefault();
      const { currentTheme, themeDirs } = await this.getThemeInfo();
      if (themeDirs.length === 0) return;
      // 构建列表：默认 + 已安装主题
      const list = [''].concat(themeDirs);
      const idx = list.indexOf(currentTheme);
      let nextIdx;
      if (e.deltaY > 0) {
        nextIdx = idx < list.length - 1 ? idx + 1 : 0;
      } else {
        nextIdx = idx > 0 ? idx - 1 : list.length - 1;
      }
      await this.switchTheme(list[nextIdx]);
    });

    this.addCommand({
      id: 'open-snippets-popup',
      name: 'Open Snippets Manager',
      callback: () => this.openSnippetsPopup(),
    });

    // 恢复悬浮按钮
    if (this.settings.floatingButton) {
      this.createFloatingButton();
    }
    // 自动创建 pic 文件夹并扫描图片
    this._syncPicFolder();
    // 导出护眼色预设为 CSS snippets
    this._exportEyeCareSnippets();
    // 恢复护眼色
    if (this.settings.eyeCareColor) {
      this.applyEyeCareColor();
    }

    // 页面风格记忆：监听活动 leaf 变化
    this._lastFilePath = this._getActiveFilePath();
    this.registerEvent(this.app.workspace.on('active-leaf-change', async (leaf) => {
      const oldPath = this._lastFilePath;
      const newPath = this._getActiveFilePath();

      if (oldPath === newPath) return;
      this._lastFilePath = newPath;
      if (this.settings.styleMemory) {
        if (oldPath) await this._savePageStyle(oldPath);
        if (newPath) await this._restorePageStyle(newPath);
      }
      const popup = document.getElementById('ss-snippets-popup');
      if (popup && popup._ssRenderContent) {
        await new Promise(r => setTimeout(r, 200));

        popup._ssRenderContent();
      }
    }));

    // 监听深浅模式切换，自动重新应用护眼色
    this._modeObserver = new MutationObserver(() => {
      if (this.settings.eyeCareColor) {
        this.applyEyeCareColor();
      }
      if (this.settings.floatingButton) {
        this.createFloatingButton();
      }
    });
    this._modeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  onunload() {
    if (this._modeObserver) { this._modeObserver.disconnect(); this._modeObserver = null; }
    const fb = document.getElementById('ss-floating-button');
    if (fb) {
      if (fb._ssResizeHandler) window.removeEventListener('resize', fb._ssResizeHandler);
      if (fb._ssCleanup) fb._ssCleanup();
      fb.remove();
    }
    const pc = document.getElementById('ss-pull-cord');
    if (pc) pc.remove();
    const existing = document.getElementById('ss-snippets-popup');
    if (existing) existing.remove();
    const ov = document.getElementById('ss-snippets-overlay');
    if (ov) ov.remove();

    const styleEl = document.getElementById('ss-float-custom-style');
    if (styleEl) styleEl.remove();
    const eyeCareEl = document.getElementById('ss-eyecare-style');
    if (eyeCareEl) eyeCareEl.remove();
    this._removeOverlay('ss-edge-glow-overlay');
    this._removeOverlay('ss-cursor-glow-overlay');
    this._stopCursorTracking();
  }

  async loadSettings() {
    const data = await this.loadData();
    this.settings = Object.assign({
      language: 'en',
      groups: {},          // { groupName: [snippetName, ...], ... }
      groupOrder: [],      // [groupName, ...] 维护分组顺序
      collapsedGroups: {}, // { groupName: true/false, ... }
      floatingButton: null, // { text, css, position: {x, y} } or null
      statusBarButton: null, // { text, css } or null
      eyeCareColor: '',     // preset key: '' | 'cream' | 'green' | 'yellow' | 'mint' | 'beige' | 'sepia' | '__img_0' | '__img_1' ...
      bgImages: [],         // [{ type: 'local', url: '...', label: '...', opacity: 0.3 }, ...]
      popupPosition: null,  // { left, top } or null
      popupSize: null,      // { width, height } or null
      styleMemory: false,   // 记忆模式开关
      pageStyles: {},       // { filePath: { theme, isDark, eyeCareColor, enabledSnippets } }
      exclusiveGroups: ['标题'], // 互斥分组名列表，同组 snippet 不能同时开启
    }, data);
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  // ─── 读取 snippet 列表 ─────────────────────────────────────────────────
  async getSnippetInfo() {
    let enabledSnippets = [];
    if (this._enabledSnippetsCache) {
      enabledSnippets = [...this._enabledSnippetsCache];
    } else {
      try {
        const cc = this.app.customCss;
        if (cc && Array.isArray(cc.enabledCssSnippets)) {
          enabledSnippets = [...cc.enabledCssSnippets];
        }
      } catch (_e) {}
      if (enabledSnippets.length === 0) {
        try {
          const appearancePath = nodePath.join(this.app.vault.adapter.basePath, '.obsidian', 'appearance.json');
          const appearance = JSON.parse(nodeFs.readFileSync(appearancePath, 'utf-8'));
          enabledSnippets = appearance.enabledCssSnippets || [];
        } catch (_e) {
          enabledSnippets = [];
        }
      }
    }

    let snippetFiles = [];
    try {
      const snippetsDir = nodePath.join(this.app.vault.adapter.basePath, '.obsidian', 'snippets');
      if (nodeFs.existsSync(snippetsDir)) {
        snippetFiles = nodeFs.readdirSync(snippetsDir)
          .filter(f => f.endsWith('.css') || f.endsWith('.js'))
          .map(f => f.replace(/\.(css|js)$/, ''));
      }
    } catch (_e) {
      snippetFiles = [];
    }

    this._enabledSnippetsCache = [...enabledSnippets];
    return { enabledSnippets, snippetFiles };
  }

  // ─── 读取主题列表 ─────────────────────────────────────────────────────
  async getThemeInfo() {
    let currentTheme = '';
    try {
      const appearancePath = nodePath.join(this.app.vault.adapter.basePath, '.obsidian', 'appearance.json');
      const appearance = JSON.parse(nodeFs.readFileSync(appearancePath, 'utf-8'));
      currentTheme = appearance.cssTheme || '';
    } catch (_e) {}

    let themeDirs = [];
    try {
      const themesDir = nodePath.join(this.app.vault.adapter.basePath, '.obsidian', 'themes');
      if (nodeFs.existsSync(themesDir)) {
        themeDirs = nodeFs.readdirSync(themesDir, { withFileTypes: true })
          .filter(d => d.isDirectory())
          .map(d => d.name);
      }
    } catch (_e) {}

    return { currentTheme, themeDirs };
  }

  // ─── 切换主题 ────────────────────────────────────────────────────────
  async switchTheme(themeName, silent = false) {
    try {
      const appDataStr = await this.app.vault.adapter.read('.obsidian/appearance.json');
      const appData = JSON.parse(appDataStr);
      appData.cssTheme = themeName;
      await this.app.vault.adapter.write('.obsidian/appearance.json', JSON.stringify(appData, null, 2));
      // 尝试通过 Obsidian API 实时切换
      if (this.app.customCss && typeof this.app.customCss.setTheme === 'function') {
        this.app.customCss.setTheme(themeName);
      } else if (this.app.customCss && typeof this.app.customCss.theme === 'string') {
        this.app.customCss.theme = themeName;
      }
      if (!silent) new Notice(t('theme.switched') + (themeName ? '' : ' - ' + t('theme.restartRequired')));
    } catch (_e) {
      new Notice(t('theme.switchFailed'));
    }
  }

  // ─── 切换深浅模式 ──────────────────────────────────────────────────────
  async toggleMode(silent = false) {
    try {
      const isDark = document.body.classList.contains('theme-dark');
      const appDataStr = await this.app.vault.adapter.read('.obsidian/appearance.json');
      const appData = JSON.parse(appDataStr);
      appData.baseTheme = isDark ? 'moonstone' : 'obsidian';
      await this.app.vault.adapter.write('.obsidian/appearance.json', JSON.stringify(appData, null, 2));
      if (this.app.customCss && typeof this.app.customCss.setMode === 'function') {
        this.app.customCss.setMode(isDark ? 'moonstone' : 'obsidian');
      } else {
        document.body.classList.toggle('theme-dark', !isDark);
        document.body.classList.toggle('theme-light', isDark);
      }
      if (!silent) new Notice(t('mode.switched'));
    } catch (_e) {
      if (!silent) new Notice(t('mode.switchFailed'));
    }
  }

  // ─── 应用护眼色 ──────────────────────────────────────────────────────
  applyEyeCareColor() {
    let styleEl = document.getElementById('ss-eyecare-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'ss-eyecare-style';
      document.head.appendChild(styleEl);
    }
    const key = this.settings.eyeCareColor || '';
    if (!key) {
      styleEl.textContent = '';
      this._removeOverlay('ss-edge-glow-overlay');
      this._removeOverlay('ss-cursor-glow-overlay');
      this._stopCursorTracking();
      return;
    }
    if (key.startsWith('__img_')) {
      const imgIdx = parseInt(key.slice(6), 10);
      const imgItem = (this.settings.bgImages || [])[imgIdx];
      if (!imgItem) { styleEl.textContent = ''; return; }
      const picDir = this._getPluginDir();
      const fullPath = nodePath.join(picDir, 'pic', imgItem.url);
      let imgUrl = '';
      try {
        const buf = nodeFs.readFileSync(fullPath);
        const ext = nodePath.extname(fullPath).toLowerCase();
        const mimeMap = { '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.bmp':'image/bmp','.svg':'image/svg+xml' };
        const mime = mimeMap[ext] || 'image/png';
        imgUrl = 'data:' + mime + ';base64,' + buf.toString('base64');
      } catch (e) {
        console.warn('[SwiftSnippets] Failed to load image:', fullPath, e);
        return;
      }
      const isDark = document.body.classList.contains('theme-dark');
      const opacity = imgItem.opacity ?? 0.3;
      const tile = imgItem.tile ?? false;
      const bg = isDark ? 'rgba(20,20,20,1)' : 'rgba(255,255,255,1)';
      const bgSec = isDark ? 'rgba(28,28,28,1)' : 'rgba(248,248,248,1)';
      const bgSize = tile ? 'auto' : 'cover';
      const bgRepeat = tile ? 'repeat' : 'no-repeat';
      styleEl.textContent = `
        .workspace-leaf-content,
        .markdown-source-view,
        .markdown-preview-view {
          --background-primary: ${bg};
          --background-primary-alt: ${bg};
          --background-secondary: ${bgSec};
          --background-secondary-alt: ${bgSec};
          --background-modifier-border: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
          background-color: ${bg};
          background-image: url('${imgUrl}');
          background-size: ${bgSize};
          background-position: center;
          background-repeat: ${bgRepeat};
          position: relative;
        }
        .workspace-leaf-content::before,
        .markdown-source-view::before,
        .markdown-preview-view::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: ${isDark ? 'rgba(20,20,20,' + (1 - opacity) + ')' : 'rgba(255,255,255,' + (1 - opacity) + ')'};
          pointer-events: none;
          z-index: 0;
        }
        .workspace-leaf-content > :not(.minimap-container):not(.nav-header):not(.view-header),
        .markdown-source-view > :not(.minimap-container),
        .markdown-preview-view > :not(.minimap-container) {
          position: relative;
          z-index: 1;
        }
        .minimap-container {
          position: absolute !important;
          z-index: 10 !important;
        }
        .markdown-source-view .cm-s-obsidian,
        .markdown-preview-view .markdown-reading-view {
          background: transparent;
        }
        .markdown-source-view.mod-cm6 .cm-line {
          background: transparent !important;
        }
      `;
      this._removeOverlay('ss-edge-glow-overlay');
      this._removeOverlay('ss-cursor-glow-overlay');
      this._stopCursorTracking();
      return;
    }
    const isDark = document.body.classList.contains('theme-dark');
    if (key === 'edgeGlow') {
      const glowColor = isDark ? 'rgba(80,180,130,0.2)' : 'rgba(100,200,150,0.2)';
      const glowColorFaint = isDark ? 'rgba(80,180,130,0.08)' : 'rgba(100,200,150,0.08)';
      styleEl.textContent = `
        @keyframes ss-edgeGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        #ss-edge-glow-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none; z-index: 9990;
          box-shadow: inset 0 0 120px 40px ${glowColor}, inset 0 0 40px 10px ${glowColorFaint};
          animation: ss-edgeGlow 5s ease-in-out infinite;
        }
      `;
      this._ensureOverlay('ss-edge-glow-overlay');
      this._stopCursorTracking();
      this._removeOverlay('ss-cursor-glow-overlay');
      return;
    }
    if (key === 'cursorGlow') {
      const cursorColor = isDark ? 'rgba(80,180,130,0.18)' : 'rgba(100,200,150,0.18)';
      styleEl.textContent = `
        @keyframes ss-cursorGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        #ss-cursor-glow-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none; z-index: 9990;
          background: radial-gradient(circle 180px at var(--ss-cursor-x, 50%) var(--ss-cursor-y, 50%), ${cursorColor}, transparent 70%);
          transition: background 0.1s ease;
          animation: ss-cursorGlow 5s ease-in-out infinite;
        }
      `;
      this._ensureOverlay('ss-cursor-glow-overlay');
      this._startCursorTracking();
      this._removeOverlay('ss-edge-glow-overlay');
      return;
    }
    styleEl.textContent = '';
    this._removeOverlay('ss-edge-glow-overlay');
    this._removeOverlay('ss-cursor-glow-overlay');
    this._stopCursorTracking();
  }

  _getPluginDir() {
    // 优先使用 basePath 构建，fallback 到 manifest.dir
    if (this.app && this.app.vault && this.app.vault.adapter && this.app.vault.adapter.basePath) {
      return nodePath.join(this.app.vault.adapter.basePath, '.obsidian', 'plugins', 'SwiftSnippets');
    }
    if (this.manifest && this.manifest.dir) {
      return this.manifest.dir;
    }
    // 最后 fallback：从 __dirname 获取
    return __dirname;
  }

  _exportEyeCareSnippets() {
    const snippetsDir = nodePath.join(this.app.vault.adapter.basePath, '.obsidian', 'snippets');
    try {
      if (!nodeFs.existsSync(snippetsDir)) {
        nodeFs.mkdirSync(snippetsDir, { recursive: true });
      }
    } catch (e) {
      console.warn('[SwiftSnippets] Failed to create snippets dir:', e);
      return;
    }

    const presets = {
      cream:  { bg: '#faf6e9', bgSec: '#f5f0dc', bgMod: '#efe9d5', darkBg: '#2c2820', darkBgSec: '#332e24', darkBgMod: '#3a3428' },
      green: { bg: '#e8f5e9', bgSec: '#d5ecd7', bgMod: '#c8e6c9', darkBg: '#1e2e22', darkBgSec: '#243628', darkBgMod: '#2a3e2e' },
      yellow: { bg: '#fffde7', bgSec: '#fff9c4', bgMod: '#fff59d', darkBg: '#2e2c1e', darkBgSec: '#363424', darkBgMod: '#3e3c2a' },
      mint:  { bg: '#e0f2f1', bgSec: '#d0eceb', bgMod: '#b2dfdb', darkBg: '#1e2a29', darkBgSec: '#243230', darkBgMod: '#2a3a37' },
      beige: { bg: '#f5f0e8', bgSec: '#ebe5d9', bgMod: '#e0d9cc', darkBg: '#2a2620', darkBgSec: '#322e26', darkBgMod: '#3a362c' },
      sepia: { bg: '#f4ecd8', bgSec: '#ebe3c6', bgMod: '#ddd4b4', darkBg: '#2a2618', darkBgSec: '#322e20', darkBgMod: '#3a3628' },
    };

    const patterns = {
      linen:   { bg: '#f5f0e8', bgSec: '#ebe5d9', bgMod: '#e0d9cc', darkBg: '#2a2620', darkBgSec: '#322e26', darkBgMod: '#3a362c', pattern: 'linen' },
      dot:     { bg: '#f0ece4', bgSec: '#e8e3d9', bgMod: '#ddd8ce', darkBg: '#28241e', darkBgSec: '#302c24', darkBgMod: '#38342a', pattern: 'dot' },
      grid:    { bg: '#f5f2eb', bgSec: '#edeae3', bgMod: '#e2dfd8', darkBg: '#282620', darkBgSec: '#302e26', darkBgMod: '#38362c', pattern: 'grid' },
      stripe:  { bg: '#f3efe6', bgSec: '#ebe7de', bgMod: '#e0dcd3', darkBg: '#282420', darkBgSec: '#302c26', darkBgMod: '#38342c', pattern: 'stripe' },
      aurora:  { bg: '#e8f0e8', bgSec: '#dce8dc', bgMod: '#d0ddd0', darkBg: '#1e2820', darkBgSec: '#243026', darkBgMod: '#2a382c', pattern: 'aurora' },
      honeycomb: { bg: '#f5f0e6', bgSec: '#ede8de', bgMod: '#e2ddd3', darkBg: '#282420', darkBgSec: '#302c26', darkBgMod: '#38342c', pattern: 'honeycomb' },
      waves:     { bg: '#e8f0f5', bgSec: '#dce8f0', bgMod: '#d0dde8', darkBg: '#1e2428', darkBgSec: '#243030', darkBgMod: '#2a3838', pattern: 'waves' },
      diamond:   { bg: '#f2efe8', bgSec: '#eae7e0', bgMod: '#dfdbd4', darkBg: '#262420', darkBgSec: '#2e2c26', darkBgMod: '#36342c', pattern: 'diamond' },
      noise:     { bg: '#f0ece4', bgSec: '#e8e4dc', bgMod: '#ddd9d1', darkBg: '#28241e', darkBgSec: '#302c24', darkBgMod: '#38342a', pattern: 'noise' },
      paper:     { bg: '#f4efe2', bgSec: '#ece7da', bgMod: '#e0dbd0', darkBg: '#2a2620', darkBgSec: '#322e26', darkBgMod: '#3a362c', pattern: 'paper' },
      crosshatch:{ bg: '#f0ede6', bgSec: '#e8e5de', bgMod: '#dddad3', darkBg: '#262420', darkBgSec: '#2e2c26', darkBgMod: '#36342c', pattern: 'crosshatch' },
      breathe: { bg: '#eef5ee', bgSec: '#e2ece2', bgMod: '#d6e3d6', darkBg: '#1e2820', darkBgSec: '#243026', darkBgMod: '#2a382c', pattern: 'breathe' },
      breathe478: { bg: '#e8f0e8', bgSec: '#dce8dc', bgMod: '#d0ddd0', darkBg: '#1e2820', darkBgSec: '#243026', darkBgMod: '#2a382c', pattern: 'breathe478' },
      breatheBox: { bg: '#e8f0e8', bgSec: '#dce8dc', bgMod: '#d0ddd0', darkBg: '#1e2820', darkBgSec: '#243026', darkBgMod: '#2a382c', pattern: 'breatheBox' },

    };

    const allPresets = { ...presets, ...patterns };

    const generatePatternCSS = (key, isDark) => {
      if (key === 'linen') {
        const lc = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.015)';
        return `background-image:\n  repeating-linear-gradient(0deg, transparent, transparent 2px, ${lc} 2px, ${lc} 3px),\n  repeating-linear-gradient(90deg, transparent, transparent 2px, ${lc} 2px, ${lc} 3px);`;
      } else if (key === 'dot') {
        const dc = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
        return `background-image: radial-gradient(circle, ${dc} 1px, transparent 1px);\n  background-size: 12px 12px;`;
      } else if (key === 'grid') {
        const gc = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
        return `background-image:\n  linear-gradient(${gc} 1px, transparent 1px),\n  linear-gradient(90deg, ${gc} 1px, transparent 1px);\n  background-size: 20px 20px;`;
      } else if (key === 'stripe') {
        const sc = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.02)';
        return `background-image: repeating-linear-gradient(\n  -45deg, transparent, transparent 4px, ${sc} 4px, ${sc} 5px\n);`;
      } else if (key === 'aurora') {
        if (isDark) {
          return `background-image:\n  linear-gradient(135deg, rgba(80,180,130,0.12) 0%, transparent 50%),\n  linear-gradient(225deg, rgba(80,130,200,0.12) 0%, transparent 50%),\n  linear-gradient(315deg, rgba(150,80,190,0.08) 0%, transparent 50%);\n  animation: ss-aurora 12s ease-in-out infinite;`;
        }
        return `background-image:\n  linear-gradient(135deg, rgba(100,200,150,0.18) 0%, transparent 50%),\n  linear-gradient(225deg, rgba(100,150,220,0.18) 0%, transparent 50%),\n  linear-gradient(315deg, rgba(170,100,210,0.12) 0%, transparent 50%);\n  animation: ss-aurora 12s ease-in-out infinite;`;
      } else if (key === 'honeycomb') {
        const hc = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
        const hc2 = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)';
        return `background-image:\n  linear-gradient(30deg, ${hc} 12%, transparent 12.5%, transparent 87%, ${hc} 87.5%, ${hc}),\n  linear-gradient(150deg, ${hc} 12%, transparent 12.5%, transparent 87%, ${hc} 87.5%, ${hc}),\n  linear-gradient(30deg, ${hc} 12%, transparent 12.5%, transparent 87%, ${hc} 87.5%, ${hc}),\n  linear-gradient(150deg, ${hc} 12%, transparent 12.5%, transparent 87%, ${hc} 87.5%, ${hc}),\n  linear-gradient(60deg, ${hc2} 25%, transparent 25%, transparent 75%, ${hc2} 75%, ${hc2}),\n  linear-gradient(60deg, ${hc2} 25%, transparent 25%, transparent 75%, ${hc2} 75%, ${hc2});\n  background-size: 40px 70px;\n  background-position: 0 0, 0 0, 20px 35px, 20px 35px, 0 0, 20px 35px;`;
      } else if (key === 'waves') {
        const wc = isDark ? 'rgba(100,160,220,0.06)' : 'rgba(60,130,200,0.06)';
        return `background-image:\n  radial-gradient(ellipse at 50% 0%, ${wc} 0%, transparent 50%),\n  radial-gradient(ellipse at 50% 100%, ${wc} 0%, transparent 50%);\n  background-size: 60px 30px;\n  background-position: 0 0, 30px 15px;`;
      } else if (key === 'diamond') {
        const dc = isDark ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.03)';
        return `background-image:\n  linear-gradient(45deg, ${dc} 25%, transparent 25%),\n  linear-gradient(-45deg, ${dc} 25%, transparent 25%),\n  linear-gradient(45deg, transparent 75%, ${dc} 75%),\n  linear-gradient(-45deg, transparent 75%, ${dc} 75%);\n  background-size: 20px 20px;\n  background-position: 0 0, 0 10px, 10px -10px, -10px 0;`;
      } else if (key === 'noise') {
        const nc = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.02)';
        return `background-image:\n  radial-gradient(circle at 20% 30%, ${nc} 1px, transparent 1px),\n  radial-gradient(circle at 60% 70%, ${nc} 1px, transparent 1px),\n  radial-gradient(circle at 80% 20%, ${nc} 1px, transparent 1px),\n  radial-gradient(circle at 40% 80%, ${nc} 1px, transparent 1px),\n  radial-gradient(circle at 10% 60%, ${nc} 1px, transparent 1px),\n  radial-gradient(circle at 90% 50%, ${nc} 1px, transparent 1px);\n  background-size: 7px 7px, 11px 11px, 9px 9px, 13px 13px, 8px 8px, 10px 10px;\n  background-position: 0 0, 3px 3px, 1px 5px, 4px 2px, 2px 6px, 5px 1px;`;
      } else if (key === 'paper') {
        const pc = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)';
        const pc2 = isDark ? 'rgba(255,240,200,0.02)' : 'rgba(180,160,120,0.02)';
        const pc3 = isDark ? 'rgba(255,240,200,0.03)' : 'rgba(180,160,120,0.03)';
        const pc4 = isDark ? 'rgba(255,240,200,0.02)' : 'rgba(180,160,120,0.02)';
        return `background-image:\n  repeating-linear-gradient(0deg, transparent, transparent 3px, ${pc} 3px, ${pc} 4px),\n  repeating-linear-gradient(90deg, transparent, transparent 5px, ${pc2} 5px, ${pc2} 6px),\n  radial-gradient(ellipse at 20% 30%, ${pc3}, transparent 50%),\n  radial-gradient(ellipse at 80% 70%, ${pc4}, transparent 50%);`;
      } else if (key === 'crosshatch') {
        const xc = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)';
        return `background-image:\n  repeating-linear-gradient(45deg, transparent, transparent 3px, ${xc} 3px, ${xc} 4px),\n  repeating-linear-gradient(-45deg, transparent, transparent 3px, ${xc} 3px, ${xc} 4px);`;
      } else if (key === 'breathe') {
        if (isDark) {
          return `background-image: radial-gradient(ellipse at 50% 50%, rgba(80,180,130,0.15) 0%, transparent 70%);\n  animation: ss-breathe 5s ease-in-out infinite;`;
        }
        return `background-image: radial-gradient(ellipse at 50% 50%, rgba(100,200,150,0.22) 0%, transparent 70%);\n  animation: ss-breathe 5s ease-in-out infinite;`;
      } else if (key === 'breathe478') {
        if (isDark) {
          return `background-image: radial-gradient(ellipse at 50% 50%, rgba(80,180,130,0.18) 0%, transparent 70%);\n  animation: ss-breathe478 19s ease-in-out infinite;`;
        }
        return `background-image: radial-gradient(ellipse at 50% 50%, rgba(100,200,150,0.25) 0%, transparent 70%);\n  animation: ss-breathe478 19s ease-in-out infinite;`;
      } else if (key === 'breatheBox') {
        if (isDark) {
          return `background-image: radial-gradient(ellipse at 50% 50%, rgba(80,180,130,0.18) 0%, transparent 70%);\n  animation: ss-breatheBox 16s ease-in-out infinite;`;
        }
        return `background-image: radial-gradient(ellipse at 50% 50%, rgba(100,200,150,0.25) 0%, transparent 70%);\n  animation: ss-breatheBox 16s ease-in-out infinite;`;
      }
      return '';
    };

    const generateAnimCSS = (key) => {
      if (key === 'aurora') {
        return `@keyframes ss-aurora {\n  0%, 100% { background-position: 0% 0%; }\n  33% { background-position: 30% 20%; }\n  66% { background-position: -20% 30%; }\n}`;
      } else if (key === 'breathe') {
        return `@keyframes ss-breathe {\n  0%, 100% { background-size: 80% 80%; opacity: 0.7; }\n  50% { background-size: 140% 140%; opacity: 1; }\n}`;
      } else if (key === 'breathe478') {
        return `@keyframes ss-breathe478 {\n  0% { background-size: 60% 60%; opacity: 0.5; }\n  21.05% { background-size: 140% 140%; opacity: 1; }\n  57.89% { background-size: 140% 140%; opacity: 1; }\n  100% { background-size: 60% 60%; opacity: 0.5; }\n}`;
      } else if (key === 'breatheBox') {
        return `@keyframes ss-breatheBox {\n  0% { background-size: 60% 60%; opacity: 0.5; }\n  25% { background-size: 140% 140%; opacity: 1; }\n  50% { background-size: 140% 140%; opacity: 1; }\n  75% { background-size: 60% 60%; opacity: 0.5; }\n  100% { background-size: 60% 60%; opacity: 0.5; }\n}`;
      }
      return '';
    };

    for (const [key, p] of Object.entries(allPresets)) {
      const fileName = `ss-${key}.css`;
      const filePath = nodePath.join(snippetsDir, fileName);

      const darkBg = p.darkBg;
      const darkBgSec = p.darkBgSec;
      const darkBgMod = p.darkBgMod;
      const lightBg = p.bg;
      const lightBgSec = p.bgSec;
      const lightBgMod = p.bgMod;

      let darkPattern = '';
      let lightPattern = '';
      let animCSS = '';
      if (p.pattern) {
        darkPattern = generatePatternCSS(key, true);
        lightPattern = generatePatternCSS(key, false);
        animCSS = generateAnimCSS(key);
      }

      let darkExtra = '';
      let lightExtra = '';


      let css = `/* SwiftSnippets eyecare preset: ${key} */\n`;
      css += `${animCSS}\n\n`;
      css += `.theme-dark .workspace-leaf-content,\n.theme-dark .markdown-source-view,\n.theme-dark .markdown-preview-view {\n  --background-primary: ${darkBg};\n  --background-primary-alt: ${darkBgSec};\n  --background-secondary: ${darkBgSec};\n  --background-secondary-alt: ${darkBgMod};\n  --background-modifier-border: ${darkBgMod};\n  background-color: ${darkBg};${darkPattern ? '\n  ' + darkPattern : ''}\n}\n.theme-dark .markdown-source-view .cm-s-obsidian,\n.theme-dark .markdown-preview-view .markdown-reading-view {\n  background-color: ${darkBg};${darkPattern ? '\n  ' + darkPattern : ''}\n}\n\n`;
      css += `.theme-light .workspace-leaf-content,\n.theme-light .markdown-source-view,\n.theme-light .markdown-preview-view {\n  --background-primary: ${lightBg};\n  --background-primary-alt: ${lightBgSec};\n  --background-secondary: ${lightBgSec};\n  --background-secondary-alt: ${lightBgMod};\n  --background-modifier-border: ${lightBgMod};\n  background-color: ${lightBg};${lightPattern ? '\n  ' + lightPattern : ''}\n}\n.theme-light .markdown-source-view .cm-s-obsidian,\n.theme-light .markdown-preview-view .markdown-reading-view {\n  background-color: ${lightBg};${lightPattern ? '\n  ' + lightPattern : ''}\n}\n`;

      try {
        nodeFs.writeFileSync(filePath, css, 'utf-8');
      } catch (e) {
        console.warn('[SwiftSnippets] Failed to export preset:', key, e);
      }
    }

    const bgGroupName = '__bg__';
    for (const oldName of ['背景', 'Background']) {
      if (this.settings.groups[oldName]) {
        if (!this.settings.groups[bgGroupName]) {
          this.settings.groups[bgGroupName] = this.settings.groups[oldName];
          this.settings.groupOrder.push(bgGroupName);
        } else {
          for (const m of this.settings.groups[oldName]) {
            if (!this.settings.groups[bgGroupName].includes(m)) this.settings.groups[bgGroupName].push(m);
          }
        }
        delete this.settings.groups[oldName];
        this.settings.groupOrder = this.settings.groupOrder.filter(n => n !== oldName);
        if (this.settings.collapsedGroups[oldName] !== undefined) {
          this.settings.collapsedGroups[bgGroupName] = this.settings.collapsedGroups[oldName];
          delete this.settings.collapsedGroups[oldName];
        }
      }
    }
    if (!this.settings.groups[bgGroupName]) {
      this.settings.groups[bgGroupName] = [];
      this.settings.groupOrder.push(bgGroupName);
    }
    if (!this.settings.exclusiveGroups) this.settings.exclusiveGroups = [];
    if (!this.settings.exclusiveGroups.includes(bgGroupName)) {
      this.settings.exclusiveGroups.push(bgGroupName);
    }

    this.saveSettings();
  }


  _syncPicFolder() {
    const pluginDir = this._getPluginDir();
    const picDir = nodePath.join(pluginDir, 'pic');
    try {
      if (!nodeFs.existsSync(picDir)) {
        nodeFs.mkdirSync(picDir, { recursive: true });
      }
      const imgExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'];
      const files = nodeFs.readdirSync(picDir).filter(f => imgExts.some(ext => f.toLowerCase().endsWith(ext)));
      console.log('[SwiftSnippets] picDir:', picDir, 'files:', files.length);
      // 保留用户自定义的 opacity 和 tile，新增图片默认 opacity 0.3
      const existingMap = {};
      (this.settings.bgImages || []).forEach(img => {
        existingMap[img.label] = { opacity: img.opacity ?? 0.3, tile: img.tile ?? false };
      });
      this.settings.bgImages = files.map(f => ({
        type: 'local',
        url: f,
        label: f,
        opacity: existingMap[f]?.opacity ?? 0.3,
        tile: existingMap[f]?.tile ?? false,
      }));
      this.saveSettings();
    } catch (e) {
      console.warn('[SwiftSnippets] Failed to sync pic folder:', e);
    }
  }

  // ─── 旋转图片 90 度 ──────────────────────────────────────────────────
  async _rotateImage(imgUrl) {
    const picDir = nodePath.join(this._getPluginDir(), 'pic');
    const fullPath = nodePath.join(picDir, imgUrl);
    if (!nodeFs.existsSync(fullPath)) throw new Error('File not found');

    const buf = nodeFs.readFileSync(fullPath);
    const ext = nodePath.extname(fullPath).toLowerCase();
    const mimeMap = { '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.bmp':'image/bmp' };
    const mime = mimeMap[ext] || 'image/png';
    const dataUrl = 'data:' + mime + ';base64,' + buf.toString('base64');

    // 加载图片到 Image 对象
    const imageEl = new Image();
    await new Promise((resolve, reject) => {
      imageEl.onload = resolve;
      imageEl.onerror = reject;
      imageEl.src = dataUrl;
    });

    // 用 canvas 旋转 90 度
    const canvas = document.createElement('canvas');
    canvas.width = imageEl.height;
    canvas.height = imageEl.width;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(imageEl, -imageEl.width / 2, -imageEl.height / 2);

    // 转回 Buffer 并写入文件
    const outMime = (ext === '.jpg' || ext === '.jpeg') ? 'image/jpeg' : (ext === '.webp' ? 'image/webp' : 'image/png');
    const outBuf = await new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) { reject(new Error('toBlob failed')); return; }
        const arrayBuf = await blob.arrayBuffer();
        resolve(Buffer.from(arrayBuf));
      }, outMime, 0.92);
    });

    nodeFs.writeFileSync(fullPath, outBuf);
  }

  _ensureOverlay(id) {
    if (!document.getElementById(id)) {
      const el = document.createElement('div');
      el.id = id;
      document.body.appendChild(el);
    }
  }

  _removeOverlay(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  _startCursorTracking() {
    if (this._cursorTracking) return;
    this._cursorTracking = true;
    this._cursorHandler = (e) => {
      const overlay = document.getElementById('ss-cursor-glow-overlay');
      if (overlay) {
        overlay.style.setProperty('--ss-cursor-x', e.clientX + 'px');
        overlay.style.setProperty('--ss-cursor-y', e.clientY + 'px');
      }
    };
    document.addEventListener('mousemove', this._cursorHandler);
  }

  _stopCursorTracking() {
    if (!this._cursorTracking) return;
    this._cursorTracking = false;
    if (this._cursorHandler) {
      document.removeEventListener('mousemove', this._cursorHandler);
      this._cursorHandler = null;
    }
  }

  // ─── 护眼色预设列表 ──────────────────────────────────────────────────
  _eyeCarePresets() {
    const base = [
      { key: '',       color: 'var(--background-primary)', darkColor: 'var(--background-primary)', label: t('eyeCare.default') },
      { key: 'cream',  color: '#faf6e9', darkColor: '#2c2820', label: t('eyeCare.cream') },
      { key: 'green',  color: '#e8f5e9', darkColor: '#1e2e22', label: t('eyeCare.green') },
      { key: 'yellow', color: '#fffde7', darkColor: '#2e2c1e', label: t('eyeCare.yellow') },
      { key: 'mint',   color: '#e0f2f1', darkColor: '#1e2a29', label: t('eyeCare.mint') },
      { key: 'beige',  color: '#f5f0e8', darkColor: '#2a2620', label: t('eyeCare.beige') },
      { key: 'sepia',  color: '#f4ecd8', darkColor: '#2a2618', label: t('eyeCare.sepia') },
      { key: 'linen',  color: '#f5f0e8', darkColor: '#2a2620', label: t('eyeCare.linen'),  pattern: 'linen' },
      { key: 'dot',    color: '#f0ece4', darkColor: '#28241e', label: t('eyeCare.dot'),    pattern: 'dot' },
      { key: 'grid',   color: '#f5f2eb', darkColor: '#282620', label: t('eyeCare.grid'),   pattern: 'grid' },
      { key: 'stripe', color: '#f3efe6', darkColor: '#282420', label: t('eyeCare.stripe'), pattern: 'stripe' },
      { key: 'aurora', color: '#e8f0e8', darkColor: '#1e2820', label: t('eyeCare.aurora'), pattern: 'aurora' },
      { key: 'honeycomb', color: '#f5f0e6', darkColor: '#282420', label: t('eyeCare.honeycomb'), pattern: 'honeycomb' },
      { key: 'waves',     color: '#e8f0f5', darkColor: '#1e2428', label: t('eyeCare.waves'),     pattern: 'waves' },
      { key: 'diamond',   color: '#f2efe8', darkColor: '#262420', label: t('eyeCare.diamond'),   pattern: 'diamond' },
      { key: 'noise',     color: '#f0ece4', darkColor: '#28241e', label: t('eyeCare.noise'),     pattern: 'noise' },
      { key: 'paper',     color: '#f4efe2', darkColor: '#2a2620', label: t('eyeCare.paper'),     pattern: 'paper' },
      { key: 'crosshatch',color: '#f0ede6', darkColor: '#262420', label: t('eyeCare.crosshatch'),pattern: 'crosshatch' },
      { key: 'breathe',color: '#eef5ee', darkColor: '#1e2820', label: t('eyeCare.breathe'),pattern: 'breathe' },
      { key: 'breathe478', color: '#e8f0e8', darkColor: '#1e2820', label: t('eyeCare.breathe478'), pattern: 'breathe478' },
      { key: 'breatheBox', color: '#e8f0e8', darkColor: '#1e2820', label: t('eyeCare.breatheBox'), pattern: 'breatheBox' },
      { key: 'edgeGlow',   color: '#eef5ee', darkColor: '#1e2820', label: t('eyeCare.edgeGlow'),   pattern: 'edgeGlow' },
      { key: 'cursorGlow', color: '#eef5ee', darkColor: '#1e2820', label: t('eyeCare.cursorGlow'), pattern: 'cursorGlow' },
    ];
    // 追加图片背景（用于滚轮切换）
    const imgs = this.settings.bgImages || [];
    imgs.forEach((img, idx) => {
      base.push({
        key: `__img_${idx}`,
        color: '#888', darkColor: '#888',
        label: img.label || img.url,
        pattern: 'image',
        imgItem: img,
      });
    });
    return base;
  }

  // ─── 悬浮按钮 ────────────────────────────────────────────────────────
  createFloatingButton() {
    const existing = document.getElementById('ss-floating-button');
    if (existing) {
      if (existing._ssResizeHandler) window.removeEventListener('resize', existing._ssResizeHandler);
      if (existing._ssCleanup) existing._ssCleanup();
      existing.remove();
    }
    // 同步移除旧的拉绳，避免主题切换时残留
    const oldCord = document.getElementById('ss-pull-cord');
    if (oldCord) oldCord.remove();

    const oldStyle = document.getElementById('ss-float-custom-style');
    if (oldStyle) oldStyle.remove();

    const fb = this.settings.floatingButton;
    if (!fb) return;

    const btn = document.createElement('div');
    btn.id = 'ss-floating-button';

    const isDark = document.body.classList.contains('theme-dark');
    const hasCustomCss = fb.css && fb.css.trim();
    if (!hasCustomCss) {
      if (isDark) {
        btn.style.cssText = `
          position:fixed;z-index:9999;padding:2px 6px;font-size:12px;
          border-radius:20px;cursor:pointer;user-select:none;white-space:nowrap;
          transition:all 0.15s ease;opacity:0.85;touch-action:none;
          background:linear-gradient(90deg,#ff9a3c,#ffe44d);color:#5c2e00;
          box-shadow:0 2px 10px rgba(255,154,60,0.35);
        `;
      } else {
        btn.style.cssText = `
          position:fixed;z-index:9999;padding:2px 6px;font-size:12px;
          border-radius:20px;cursor:pointer;user-select:none;white-space:nowrap;
          transition:all 0.15s ease;opacity:0.7;touch-action:none;
          background:linear-gradient(90deg,#c8c8c8,#e8e8e8);color:#666;
          box-shadow:0 2px 8px rgba(0,0,0,0.1);
        `;
      }
    } else {
      btn.style.cssText = `
        position: fixed;
        z-index: 9999;
        padding: 4px 10px;
        font-size: 12px;
        border-radius: 14px;
        border: 1px solid var(--interactive-accent);
        background: transparent;
        color: var(--text-normal);
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        user-select: none;
        white-space: nowrap;
        transition: all 0.15s ease;
        opacity: 0.6;
        touch-action: none;
      `;
    }

    // 内部 span 承载文字，方便完整 CSS 定制
    const innerSpan = document.createElement('span');
    innerSpan.className = 'ss-float-inner';
    innerSpan.textContent = fb.text || t('float.defaultText');
    innerSpan.style.cssText = 'display:inline-block;padding:2px 4px;';
    btn.appendChild(innerSpan);

    // 注入用户完整 CSS 规则并应用作用域类名
    if (fb.css) {
      const scopedClassName = this._applyFloatCustomCss(fb.css);
      if (scopedClassName) {
        // 有自定义样式时，移除默认线框样式，改用自定义样式渲染
        btn.style.border = 'none';
        btn.style.boxShadow = 'none';
        btn.style.background = 'none';
        btn.style.borderRadius = '0';
        btn.style.padding = '0';
        innerSpan.className = 'ss-float-inner ' + scopedClassName;
      }
    }

    // 位置
    const pos = fb.position || { x: window.innerWidth - 80, y: 100 };
    const safeX = Math.min(Math.max(5, pos.x), window.innerWidth - 80);
    const safeY = Math.min(Math.max(5, pos.y), window.innerHeight - 40);
    btn.style.left = safeX + 'px';
    btn.style.top = safeY + 'px';

    // ── 拉绳开关 ──────────────────────────────────────────────────────
    const pullCord = document.createElement('div');
    pullCord.id = 'ss-pull-cord';
    pullCord.style.cssText = `
      position: fixed;
      z-index: 9998;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: ns-resize;
      user-select: none;
      touch-action: none;
      opacity: 0;
      transition: opacity 0.2s ease;
    `;

    // 绳子
    const cord = document.createElement('div');
    cord.className = 'ss-cord-line';
    cord.style.cssText = `
      width: 2px;
      height: 20px;
      background: linear-gradient(to bottom, var(--text-faint), var(--text-muted));
      border-radius: 1px;
      transition: height 0.15s ease;
    `;
    pullCord.appendChild(cord);

    // 拉手（小圆球）
    const pullKnob = document.createElement('div');
    pullKnob.className = 'ss-cord-knob';
    pullKnob.style.cssText = `
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, var(--text-normal), var(--text-muted));
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    `;
    pullCord.appendChild(pullKnob);

    // 定位拉绳在按钮正下方居中
    const positionPullCord = () => {
      const btnRect = btn.getBoundingClientRect();
      pullCord.style.left = (btnRect.left + btnRect.width / 2 - 5) + 'px';
      pullCord.style.top = (btnRect.bottom + 2) + 'px';
    };

    // 鼠标进入按钮区域时显示拉绳
    btn.addEventListener('mouseenter', () => {
      btn.style.opacity = '1';
      pullCord.style.opacity = '1';
      positionPullCord();
    });
    btn.addEventListener('mouseleave', () => {
      if (!hasCustomCss) {
        btn.style.opacity = isDark ? '0.85' : '0.7';
      } else {
        btn.style.opacity = '0.6';
      }
      if (!pullCordDragging) pullCord.style.opacity = '0';
    });
    pullCord.addEventListener('mouseenter', () => {
      pullCord.style.opacity = '1';
      btn.style.opacity = '1';
    });
    pullCord.addEventListener('mouseleave', () => {
      if (!pullCordDragging) {
        pullCord.style.opacity = '0';
        if (!hasCustomCss) {
          btn.style.opacity = isDark ? '0.85' : '0.7';
        } else {
          btn.style.opacity = '0.6';
        }
      }
    });

    // 滚轮：普通切换护眼色，Ctrl/Shift切换主题
    btn.addEventListener('wheel', async (e) => {
      e.preventDefault();
      if (e.ctrlKey || e.shiftKey) {
        // Ctrl/Shift+滚轮：切换主题
        const { currentTheme, themeDirs } = await this.getThemeInfo();
        if (themeDirs.length === 0) return;
        const list = [''].concat(themeDirs);
        const idx = list.indexOf(currentTheme);
        let nextIdx;
        if (e.deltaY > 0) {
          nextIdx = idx < list.length - 1 ? idx + 1 : 0;
        } else {
          nextIdx = idx > 0 ? idx - 1 : list.length - 1;
        }
        await this.switchTheme(list[nextIdx]);
      } else {
        const bgGroupName = '__bg__';
        const bgMembers = this.settings.groups[bgGroupName] || [];
        if (bgMembers.length === 0) return;
        const { enabledSnippets } = await this.getSnippetInfo();
        const enabledBg = bgMembers.filter(n => enabledSnippets.includes(n));
        const currentIdx = bgMembers.indexOf(enabledBg[enabledBg.length - 1] || '');
        let nextIdx;
        if (e.deltaY > 0) {
          nextIdx = currentIdx < bgMembers.length - 1 ? currentIdx + 1 : -1;
        } else {
          nextIdx = currentIdx > 0 ? currentIdx - 1 : -1;
        }
        for (const name of enabledBg) {
          this._setSnippetEnabled(name, false);
        }
        if (nextIdx >= 0) {
          this._setSnippetEnabled(bgMembers[nextIdx], true);
          new Notice(bgMembers[nextIdx]);
        } else {
          new Notice(t('eyeCare.default'));
        }
      }
    }, { passive: false });

    // 拖拽按钮
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    const moveThreshold = 5;

    btn.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDragging = false;
      startX = e.clientX;
      startY = e.clientY;
      const rect = btn.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      e.preventDefault();
      document.addEventListener('mousemove', onDragMove);
      document.addEventListener('mouseup', onDragEnd);
    });

    const onDragMove = (e) => {
      if (Math.abs(e.clientX - startX) < moveThreshold && Math.abs(e.clientY - startY) < moveThreshold) return;
      isDragging = true;
      btn.style.transition = 'none';
      let newLeft = initialLeft + (e.clientX - startX);
      let newTop = initialTop + (e.clientY - startY);
      newLeft = Math.max(5, Math.min(newLeft, window.innerWidth - 80));
      newTop = Math.max(5, Math.min(newTop, window.innerHeight - 40));
      btn.style.left = newLeft + 'px';
      btn.style.top = newTop + 'px';
      positionPullCord();
    };

    const onDragEnd = () => {
      document.removeEventListener('mousemove', onDragMove);
      document.removeEventListener('mouseup', onDragEnd);
      if (isDragging) {
        btn.style.transition = 'all 0.3s ease';
        this.settings.floatingButton.position = {
          x: parseFloat(btn.style.left) || 0,
          y: parseFloat(btn.style.top) || 0,
        };
        this.saveSettings();
        pullCord.style.opacity = '0';
      }
      setTimeout(() => { isDragging = false; }, 50);
    };

    // 左键点击打开管理面板
    btn.addEventListener('click', () => {
      if (!isDragging) setTimeout(() => this.openSnippetsPopup(), 0);
    });

    // 双击重置护眼色
    btn.addEventListener('dblclick', (e) => {
      e.preventDefault();
      this.settings.eyeCareColor = '';
      this.applyEyeCareColor();
      this.saveSettings();
      new Notice(t('eyeCare.default'));
    });

    // 右键菜单
    btn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const menu = document.createElement('div');
      menu.style.cssText = `
        position:fixed;left:${e.clientX}px;top:${e.clientY}px;
        background:rgba(var(--mono-rgb-0),0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
        border:1px solid var(--background-modifier-border);border-radius:6px;
        padding:4px 0;z-index:10001;box-shadow:0 4px 16px rgba(0,0,0,0.25);min-width:120px;
      `;

      const mkItem = (label, action) => {
        const item = document.createElement('div');
        item.textContent = label;
        item.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:13px;color:var(--text-normal);';
        item.addEventListener('mouseenter', () => { item.style.background = 'var(--background-modifier-hover)'; });
        item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; });
        item.addEventListener('click', async () => { menu.remove(); await action(); });
        menu.appendChild(item);
      };

      mkItem(t('float.edit'), () => this._showFloatEditForm());
      mkItem(t('float.close'), async () => {
        btn.remove();
        pullCord.remove();
        const styleEl = document.getElementById('ss-float-custom-style');
        if (styleEl) styleEl.remove();
        this.settings.floatingButton = null;
        await this.saveSettings();
        const popupEl = document.getElementById('ss-snippets-popup');
        const ms = popupEl?.querySelector('.ss-mode-switch');
        if (ms) ms.style.display = 'inline-flex';
      });

      document.body.appendChild(menu);
      const closeMenu = () => { if (document.body.contains(menu)) menu.remove(); document.removeEventListener('click', closeMenu); };
      setTimeout(() => document.addEventListener('click', closeMenu), 10);
    });

    // 拉绳拖拽逻辑
    let pullCordDragging = false;
    let pullStartY = 0;
    let cordBaseHeight = 20;
    const pullThreshold = 30; // 拉过此距离触发切换

    pullCord.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      pullCordDragging = true;
      pullStartY = e.clientY;
      cordBaseHeight = 20;
      cord.style.transition = 'none';
      pullKnob.style.transition = 'none';
    });

    const onPullMove = (e) => {
      if (!pullCordDragging) return;
      const dy = e.clientY - pullStartY;
      const newHeight = Math.max(10, cordBaseHeight + dy);
      cord.style.height = newHeight + 'px';
      const scale = 1 + Math.min(dy / pullThreshold, 0.5);
      pullKnob.style.transform = `scale(${scale})`;
      pullKnob.style.boxShadow = dy > pullThreshold * 0.6
        ? '0 2px 8px rgba(0,0,0,0.5), 0 0 6px var(--interactive-accent)'
        : '0 1px 3px rgba(0,0,0,0.3)';
    };

    const onPullEnd = async (e) => {
      if (!pullCordDragging) return;
      pullCordDragging = false;
      const dy = e.clientY - pullStartY;
      cord.style.transition = 'height 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), all 0.15s ease';
      pullKnob.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), all 0.15s ease';

      if (dy > pullThreshold) {
        cord.style.height = cordBaseHeight + 'px';
        pullKnob.style.transform = 'scale(1)';
        pullKnob.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
        pullKnob.style.background = 'radial-gradient(circle at 35% 35%, var(--interactive-accent), var(--text-muted))';
        setTimeout(() => {
          pullKnob.style.background = 'radial-gradient(circle at 35% 35%, var(--text-normal), var(--text-muted))';
        }, 400);
        await this.toggleMode();
      } else {
        cord.style.height = cordBaseHeight + 'px';
        pullKnob.style.transform = 'scale(1)';
        pullKnob.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
      }
      setTimeout(() => { pullCord.style.opacity = '0'; }, 300);
    };

    document.addEventListener('mousemove', onPullMove);
    document.addEventListener('mouseup', onPullEnd);

    document.body.appendChild(btn);
    document.body.appendChild(pullCord);
    requestAnimationFrame(positionPullCord);
    const resizeHandler = () => positionPullCord();
    window.addEventListener('resize', resizeHandler);
    btn._ssResizeHandler = resizeHandler;
    btn._ssCleanup = () => {
      document.removeEventListener('mousemove', onDragMove);
      document.removeEventListener('mouseup', onDragEnd);
      document.removeEventListener('mousemove', onPullMove);
      document.removeEventListener('mouseup', onPullEnd);
    };
  }

  // ─── 注入悬浮按钮自定义 CSS ──────────────────────────────────────────
  _applyFloatCustomCss(cssText) {
    const styleId = 'ss-float-custom-style';
    // 移除旧的
    const old = document.getElementById(styleId);
    if (old) old.remove();

    if (!cssText || !cssText.trim()) return null;

    // 从 CSS 中提取第一个类名作为主类名
    const classMatch = cssText.match(/\.([a-zA-Z_\u4e00-\u9fff][\w\u4e00-\u9fff-]*)/);
    if (!classMatch) return null;

    const rawClassName = classMatch[1];
    const scopedClassName = `ss-custom-${rawClassName}`;

    // 将所有 .rawClassName 替换为 .scopedClassName
    const escapedRaw = rawClassName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const scopedCss = cssText.replace(
      new RegExp(`\\.${escapedRaw}`, 'g'),
      `.${scopedClassName}`
    );

    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = scopedCss;
    document.head.appendChild(styleElement);

    return scopedClassName;
  }

  // ─── 悬浮按钮编辑表单 ────────────────────────────────────────────────
  _showFloatEditForm() {
    const fb = this.settings.floatingButton;
    if (!fb) return;

    const backdrop = document.createElement('div');
    backdrop.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:10002;';

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      position:fixed;
      background:rgba(var(--mono-rgb-0),0.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
      border:1px solid var(--background-modifier-border);border-radius:8px;
      box-shadow:0 8px 32px rgba(0,0,0,0.3);z-index:10003;
      padding:16px 20px;min-width:360px;max-width:520px;max-height:80vh;overflow-y:auto;
    `;
    requestAnimationFrame(() => {
      const w = dialog.offsetWidth, h = dialog.offsetHeight;
      dialog.style.left = Math.round((window.innerWidth - w) / 2) + 'px';
      dialog.style.top = Math.round((window.innerHeight - h) / 2) + 'px';
    });

    const label = dialog.createEl('div', { text: t('float.editTitle') });
    label.style.cssText = 'font-size:13px;font-weight:600;margin-bottom:8px;color:var(--text-normal);';

    const textLabel = dialog.createEl('div', { text: t('float.editText') });
    textLabel.style.cssText = 'font-size:12px;color:var(--text-muted);margin-bottom:4px;';

    const textInput = dialog.createEl('input', { type: 'text' });
    textInput.value = fb.text || t('float.defaultText');
    textInput.style.cssText = 'width:100%;padding:6px 8px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);margin-bottom:10px;';

    const cssLabel = dialog.createEl('div');
    cssLabel.style.cssText = 'font-size:12px;color:var(--text-muted);margin-bottom:4px;display:flex;align-items:center;gap:6px;';
    cssLabel.createEl('span', { text: t('float.editStyle') });
    const cssLink = cssLabel.createEl('a', { href: 'https://github.com/dlsdgj/obsidian-regex-css-highlighter/discussions/1' });
    cssLink.textContent = '?';
    cssLink.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:50%;font-size:10px;font-weight:700;background:var(--interactive-accent);color:#fff;text-decoration:none;line-height:1;';
    cssLink.target = '_blank';

    const cssHint = dialog.createEl('div');
    cssHint.textContent = _currentLang === 'zh' ? '支持完整CSS格式，含伪元素。类名会自动作用域化。' : 'Supports full CSS format including pseudo-elements. Class names are automatically scoped.';
    cssHint.style.cssText = 'font-size:11px;color:var(--text-faint);margin-bottom:4px;';

    const cssInput = dialog.createEl('textarea');
    cssInput.value = fb.css || '';
    cssInput.placeholder = `.ss-float-style {\n  background: linear-gradient(to bottom, #007AFF 0%, #007AFF 33%, #AF52DE 33%, #AF52DE 66%, #FF2D55 66%, #FF2D55 100%);\n  color: #fff;\n  border-radius: 14px;\n  padding: 4px 10px;\n}`;
    cssInput.style.cssText = 'width:100%;height:160px;padding:6px 8px;border:1px solid var(--background-modifier-border);border-radius:4px;font-family:monospace;font-size:11px;resize:vertical;background:var(--background-primary);color:var(--text-normal);margin-bottom:10px;';

    // 预览区域
    const previewDiv = dialog.createDiv();
    previewDiv.style.cssText = 'margin-bottom:12px;padding:12px;border:1px dashed var(--background-modifier-border);border-radius:6px;text-align:center;';

    const previewLabel = previewDiv.createEl('div', { text: _currentLang === 'zh' ? '预览:' : 'Preview:' });
    previewLabel.style.cssText = 'font-size:11px;color:var(--text-muted);margin-bottom:8px;';

    const previewSpan = previewDiv.createEl('span');
    previewSpan.textContent = fb.text || t('float.defaultText');
    previewSpan.style.cssText = 'display:inline-block;padding:4px 8px;';

    const previewStyleId = 'ss-float-preview-style';

    const updatePreview = () => {
      const newLabel = textInput.value.trim() || t('float.defaultText');
      const newCss = cssInput.value.trim();
      previewSpan.textContent = newLabel;
      previewSpan.className = '';
      previewSpan.style.cssText = 'display:inline-block;padding:4px 8px;';

      // 移除旧预览样式
      const oldPreviewStyle = document.getElementById(previewStyleId);
      if (oldPreviewStyle) oldPreviewStyle.remove();

      if (newCss) {
        const classMatch = newCss.match(/\.([a-zA-Z_\u4e00-\u9fff][\w\u4e00-\u9fff-]*)/);
        if (classMatch) {
          const rawClassName = classMatch[1];
          const scopedClassName = `ss-custom-${rawClassName}`;
          const escapedRaw = rawClassName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const scopedCss = newCss.replace(
            new RegExp(`\\.${escapedRaw}`, 'g'),
            `.${scopedClassName}`
          );
          const styleEl = document.createElement('style');
          styleEl.id = previewStyleId;
          styleEl.textContent = scopedCss;
          document.head.appendChild(styleEl);
          previewSpan.className = scopedClassName;
        }
      }
    };

    textInput.addEventListener('input', updatePreview);
    cssInput.addEventListener('input', updatePreview);
    updatePreview();

    const btnRow = dialog.createDiv();
    btnRow.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;';

    const cancelBtn = btnRow.createEl('button', { text: t('btn.cancel') });
    cancelBtn.addEventListener('click', () => {
      const previewStyle = document.getElementById(previewStyleId);
      if (previewStyle) previewStyle.remove();
      backdrop.remove(); dialog.remove();
    });

    const saveBtn = btnRow.createEl('button', { text: t('btn.save') });
    saveBtn.style.cssText = 'background:var(--interactive-accent);color:#fff;border:none;border-radius:4px;padding:4px 12px;cursor:pointer;';
    saveBtn.addEventListener('click', async () => {
      fb.text = textInput.value.trim() || t('float.defaultText');
      fb.css = cssInput.value.trim();
      await this.saveSettings();
      // 重建悬浮按钮
      this.createFloatingButton();
      const previewStyle = document.getElementById(previewStyleId);
      if (previewStyle) previewStyle.remove();
      backdrop.remove();
      dialog.remove();
    });

    backdrop.addEventListener('click', () => {
      const previewStyle = document.getElementById(previewStyleId);
      if (previewStyle) previewStyle.remove();
      backdrop.remove(); dialog.remove();
    });

    document.body.appendChild(backdrop);
    document.body.appendChild(dialog);
    setTimeout(() => textInput.focus(), 50);
  }

  // ─── 状态栏按钮样式应用 ──────────────────────────────────────────────
  _applyStatusBarStyle() {
    const sb = this.settings.statusBarButton;
    const el = this._statusBarEl;
    if (!el) return;

    // 移除旧自定义样式
    const oldStyle = document.getElementById('ss-statusbar-custom-style');
    if (oldStyle) oldStyle.remove();

    // 重置为默认
    el.setText('SwiftSwitch');
    el.title = t('popup.title');
    el.style.cursor = 'pointer';
    el.style.opacity = '0.8';
    el.className = el.className.replace(/\bss-statusbar-\S+/g, '').trim();

    if (!sb) return;

    // 自定义文字
    if (sb.text) {
      el.setText(sb.text);
    }

    // 自定义CSS
    if (sb.css && sb.css.trim()) {
      const classMatch = sb.css.match(/\.([a-zA-Z_\u4e00-\u9fff][\w\u4e00-\u9fff-]*)/);
      if (classMatch) {
        const rawClassName = classMatch[1];
        const scopedClassName = `ss-statusbar-${rawClassName}`;
        const escapedRaw = rawClassName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const scopedCss = sb.css.replace(
          new RegExp(`\\.${escapedRaw}`, 'g'),
          `.${scopedClassName}`
        );
        const styleEl = document.createElement('style');
        styleEl.id = 'ss-statusbar-custom-style';
        styleEl.textContent = scopedCss;
        document.head.appendChild(styleEl);
        el.classList.add(scopedClassName);
      }
    }
  }

  // ─── 状态栏按钮右键菜单 ──────────────────────────────────────────────
  _showStatusBarContextMenu(e) {
    const menu = document.createElement('div');
    menu.style.cssText = `
      position:fixed;z-index:10001;background:var(--background-secondary);
      border:1px solid var(--background-modifier-border);border-radius:6px;
      box-shadow:0 4px 16px rgba(0,0,0,0.25);padding:4px 0;min-width:120px;
    `;
    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';

    const mkItem = (label, action) => {
      const item = document.createElement('div');
      item.textContent = label;
      item.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:13px;color:var(--text-normal);';
      item.addEventListener('mouseenter', () => { item.style.background = 'var(--background-modifier-hover)'; });
      item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; });
      item.addEventListener('click', async () => { menu.remove(); await action(); });
      menu.appendChild(item);
    };

    mkItem(t('statusBar.edit'), () => this._showStatusBarEditForm());

    if (this.settings.statusBarButton) {
      mkItem(_currentLang === 'zh' ? '重置' : 'Reset', async () => {
        this.settings.statusBarButton = null;
        await this.saveSettings();
        this._applyStatusBarStyle();
      });
    }

    const closeMenu = (evt) => {
      if (!menu.contains(evt.target)) { menu.remove(); document.removeEventListener('click', closeMenu); }
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 0);

    document.body.appendChild(menu);
    // 修正位置防止溢出屏幕
    requestAnimationFrame(() => {
      const rect = menu.getBoundingClientRect();
      let x = e.clientX, y = e.clientY;
      if (x + rect.width > window.innerWidth) x = window.innerWidth - rect.width - 4;
      if (y + rect.height > window.innerHeight) y = window.innerHeight - rect.height - 4;
      if (x < 0) x = 4;
      if (y < 0) y = 4;
      menu.style.left = x + 'px';
      menu.style.top = y + 'px';
    });
  }

  // ─── 状态栏按钮编辑表单 ──────────────────────────────────────────────
  _showStatusBarEditForm() {
    const sb = this.settings.statusBarButton || { text: '', css: '' };

    const backdrop = document.createElement('div');
    backdrop.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:10002;';

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      position:fixed;
      background:rgba(var(--mono-rgb-0),0.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
      border:1px solid var(--background-modifier-border);border-radius:8px;
      box-shadow:0 8px 32px rgba(0,0,0,0.3);z-index:10003;
      padding:16px 20px;min-width:360px;max-width:520px;max-height:80vh;overflow-y:auto;
    `;
    requestAnimationFrame(() => {
      const w = dialog.offsetWidth, h = dialog.offsetHeight;
      dialog.style.left = Math.round((window.innerWidth - w) / 2) + 'px';
      dialog.style.top = Math.round((window.innerHeight - h) / 2) + 'px';
    });

    const label = dialog.createEl('div', { text: t('statusBar.editTitle') });
    label.style.cssText = 'font-size:13px;font-weight:600;margin-bottom:8px;color:var(--text-normal);';

    const textLabel = dialog.createEl('div', { text: t('statusBar.editText') });
    textLabel.style.cssText = 'font-size:12px;color:var(--text-muted);margin-bottom:4px;';

    const textInput = dialog.createEl('input', { type: 'text' });
    textInput.value = sb.text || t('statusBar.defaultText');
    textInput.style.cssText = 'width:100%;padding:6px 8px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);margin-bottom:10px;';

    const cssLabel = dialog.createEl('div');
    cssLabel.style.cssText = 'font-size:12px;color:var(--text-muted);margin-bottom:4px;display:flex;align-items:center;gap:6px;';
    cssLabel.createEl('span', { text: t('statusBar.editStyle') });

    const cssHint = dialog.createEl('div');
    cssHint.textContent = _currentLang === 'zh' ? '支持完整CSS格式，含伪元素。类名会自动作用域化。' : 'Supports full CSS format including pseudo-elements. Class names are automatically scoped.';
    cssHint.style.cssText = 'font-size:11px;color:var(--text-faint);margin-bottom:4px;';

    const cssInput = dialog.createEl('textarea');
    cssInput.value = sb.css || '';
    cssInput.placeholder = `.ss-statusbar-style {\n  background: linear-gradient(90deg, #ff9a3c, #ffe44d);\n  color: #5c2e00;\n  border-radius: 14px;\n  padding: 2px 8px;\n}`;
    cssInput.style.cssText = 'width:100%;height:140px;padding:6px 8px;border:1px solid var(--background-modifier-border);border-radius:4px;font-family:monospace;font-size:11px;resize:vertical;background:var(--background-primary);color:var(--text-normal);margin-bottom:10px;';

    // 预览区域
    const previewDiv = dialog.createDiv();
    previewDiv.style.cssText = 'margin-bottom:12px;padding:12px;border:1px dashed var(--background-modifier-border);border-radius:6px;text-align:center;';

    const previewLabel = previewDiv.createEl('div', { text: _currentLang === 'zh' ? '预览:' : 'Preview:' });
    previewLabel.style.cssText = 'font-size:11px;color:var(--text-muted);margin-bottom:8px;';

    const previewSpan = previewDiv.createEl('span');
    previewSpan.textContent = sb.text || t('statusBar.defaultText');
    previewSpan.style.cssText = 'display:inline-block;padding:2px 4px;font-size:12px;';

    const previewStyleId = 'ss-statusbar-preview-style';

    const updatePreview = () => {
      const newLabel = textInput.value.trim() || t('statusBar.defaultText');
      const newCss = cssInput.value.trim();
      previewSpan.textContent = newLabel;
      previewSpan.className = '';
      previewSpan.style.cssText = 'display:inline-block;padding:2px 4px;font-size:12px;';

      const oldPreviewStyle = document.getElementById(previewStyleId);
      if (oldPreviewStyle) oldPreviewStyle.remove();

      if (newCss) {
        const classMatch = newCss.match(/\.([a-zA-Z_\u4e00-\u9fff][\w\u4e00-\u9fff-]*)/);
        if (classMatch) {
          const rawClassName = classMatch[1];
          const scopedClassName = `ss-statusbar-${rawClassName}`;
          const escapedRaw = rawClassName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const scopedCss = newCss.replace(
            new RegExp(`\\.${escapedRaw}`, 'g'),
            `.${scopedClassName}`
          );
          const styleEl = document.createElement('style');
          styleEl.id = previewStyleId;
          styleEl.textContent = scopedCss;
          document.head.appendChild(styleEl);
          previewSpan.className = scopedClassName;
        }
      }
    };

    textInput.addEventListener('input', updatePreview);
    cssInput.addEventListener('input', updatePreview);
    updatePreview();

    const btnRow = dialog.createDiv();
    btnRow.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;';

    const cancelBtn = btnRow.createEl('button', { text: t('btn.cancel') });
    cancelBtn.addEventListener('click', () => {
      const previewStyle = document.getElementById(previewStyleId);
      if (previewStyle) previewStyle.remove();
      backdrop.remove(); dialog.remove();
    });

    const saveBtn = btnRow.createEl('button', { text: t('btn.save') });
    saveBtn.style.cssText = 'background:var(--interactive-accent);color:#fff;border:none;border-radius:4px;padding:4px 12px;cursor:pointer;';
    saveBtn.addEventListener('click', async () => {
      this.settings.statusBarButton = {
        text: textInput.value.trim() || t('statusBar.defaultText'),
        css: cssInput.value.trim(),
      };
      await this.saveSettings();
      this._applyStatusBarStyle();
      const previewStyle = document.getElementById(previewStyleId);
      if (previewStyle) previewStyle.remove();
      backdrop.remove(); dialog.remove();
    });

    backdrop.addEventListener('click', () => {
      const previewStyle = document.getElementById(previewStyleId);
      if (previewStyle) previewStyle.remove();
      backdrop.remove(); dialog.remove();
    });

    dialog.appendChild(btnRow);
    document.body.appendChild(backdrop);
    document.body.appendChild(dialog);
    setTimeout(() => textInput.focus(), 50);
  }

  // ─── 获取当前活动文件路径 ──────────────────────────────────────────────
  _getActiveFilePath() {
    const leaf = this.app.workspace.activeLeaf;
    if (!leaf) return null;
    const file = leaf.view?.file;
    return file ? file.path : null;
  }

  // ─── 捕获当前风格 ──────────────────────────────────────────────────────
  async _captureCurrentStyle() {
    const { currentTheme } = await this.getThemeInfo();
    const isDark = document.body.classList.contains('theme-dark');
    const { enabledSnippets } = await this.getSnippetInfo();
    return {
      theme: currentTheme || '',
      isDark,
      eyeCareColor: this.settings.eyeCareColor || '',
      enabledSnippets: [...enabledSnippets],
    };
  }

  // ─── 保存当前页面风格 ──────────────────────────────────────────────────
  async _savePageStyle(filePath) {
    if (!filePath || !this.settings.styleMemory) return;
    const style = await this._captureCurrentStyle();

    this.settings.pageStyles[filePath] = style;
    await this.saveSettings();
  }

  // ─── 恢复页面风格 ──────────────────────────────────────────────────────
  async _restorePageStyle(filePath) {
    if (!filePath || !this.settings.styleMemory) return;
    const profile = this.settings.pageStyles[filePath];

    if (!profile) return;
    try {
      if (profile.theme !== undefined) {
        await this.switchTheme(profile.theme, true);
      }
      if (profile.isDark !== undefined) {
        const currentIsDark = document.body.classList.contains('theme-dark');
        if (currentIsDark !== profile.isDark) {
          await this.toggleMode(true);
        }
      }
      if (profile.eyeCareColor !== undefined) {
        this.settings.eyeCareColor = profile.eyeCareColor;
        this.applyEyeCareColor();
        await this.saveSettings();
      }
      if (profile.enabledSnippets && Array.isArray(profile.enabledSnippets)) {
        const { snippetFiles } = await this.getSnippetInfo();
        for (const name of snippetFiles) {
          const shouldBeEnabled = profile.enabledSnippets.includes(name);

          this._setSnippetEnabled(name, shouldBeEnabled);
        }
      }
    } catch (_e) {
    }
  }

  // ─── 切换 snippet 状态（带缓存同步）──────────────────────────────────────
  _setSnippetEnabled(snippetName, enable) {
    const cc = this.app.customCss;
    if (cc && typeof cc.setCssEnabledStatus === 'function') {
      cc.setCssEnabledStatus(snippetName, enable);
    }
    if (this._enabledSnippetsCache) {
      if (enable && !this._enabledSnippetsCache.includes(snippetName)) {
        this._enabledSnippetsCache.push(snippetName);
      } else if (!enable) {
        this._enabledSnippetsCache = this._enabledSnippetsCache.filter(n => n !== snippetName);
      }
    }
  }

  // ─── 切换 snippet ──────────────────────────────────────────────────────
  async toggleSnippet(snippetName, enable) {
    this._setSnippetEnabled(snippetName, enable);
    const cc = this.app.customCss;
    if (cc && typeof cc.setCssEnabledStatus === 'function') {
      return;
    }
    let appData = {};
    try {
      const data = await this.app.vault.adapter.read('.obsidian/appearance.json');
      appData = JSON.parse(data);
    } catch (_e) {}
    if (!appData.enabledCssSnippets) appData.enabledCssSnippets = [];
    if (enable) {
      if (!appData.enabledCssSnippets.includes(snippetName)) appData.enabledCssSnippets.push(snippetName);
    } else {
      appData.enabledCssSnippets = appData.enabledCssSnippets.filter(s => s !== snippetName);
    }
    await this.app.vault.adapter.write('.obsidian/appearance.json', JSON.stringify(appData, null, 2));
    new Notice(t('snippet.toggleFailed') + ' - ' + t('snippet.restartRequired'));
  }

  // ─── 查找 snippet 所在分组 ──────────────────────────────────────────────
  _findGroupOf(snippetName) {
    for (const [gName, members] of Object.entries(this.settings.groups)) {
      if (members.includes(snippetName)) return gName;
    }
    return null;
  }

  // ─── 将 snippet 移入分组 ────────────────────────────────────────────────
  async _moveToGroup(snippetName, groupName) {
    // 先从所有分组中移除
    for (const members of Object.values(this.settings.groups)) {
      const idx = members.indexOf(snippetName);
      if (idx !== -1) members.splice(idx, 1);
    }
    if (!this.settings.groups[groupName]) {
      this.settings.groups[groupName] = [];
      this.settings.groupOrder.push(groupName);
    }
    if (!this.settings.groups[groupName].includes(snippetName)) {
      this.settings.groups[groupName].push(snippetName);
    }
    await this.saveSettings();
  }

  // ─── 将 snippet 移出分组 ────────────────────────────────────────────────
  async _removeFromGroup(snippetName) {
    for (const members of Object.values(this.settings.groups)) {
      const idx = members.indexOf(snippetName);
      if (idx !== -1) members.splice(idx, 1);
    }
    await this.saveSettings();
  }

  // ─── 弹出窗口 ──────────────────────────────────────────────────────────
  openSnippetsPopup(restoreLeft, restoreTop) {
    const existing = document.getElementById('ss-snippets-popup');
    if (existing) { existing.remove(); const ov = document.getElementById('ss-snippets-overlay'); if (ov) ov.remove(); const pv0 = document.getElementById('ss-img-preview'); if (pv0) pv0.remove(); const rh0 = document.querySelector('.ss-resize-handle'); if (rh0) rh0.remove(); return; }

    // 每次打开面板时刷新 pic 文件夹
    this._syncPicFolder();

    const overlay = document.createElement('div');
    overlay.id = 'ss-snippets-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;pointer-events:none;';
    setTimeout(() => {
      document.addEventListener('click', function overlayClick(e) {
        if (!document.getElementById('ss-snippets-popup')) {
          document.removeEventListener('click', overlayClick);
          return;
        }
        if (popup.contains(e.target)) return;
        const higherZ = document.querySelector('[style*="z-index:1000"], [style*="z-index: 1000"]');
        if (higherZ && !popup.contains(higherZ)) return;
        this.settings.popupPosition = { left: popup.style.left, top: popup.style.top };
        this.saveSettings();
        popup.remove(); overlay.remove(); resizeHandle.remove();
        const pv1 = document.getElementById('ss-img-preview'); if (pv1) pv1.remove();
        document.removeEventListener('click', overlayClick);
      }.bind(this));
    }, 0);

    const popup = document.createElement('div');
    popup.id = 'ss-snippets-popup';
    popup.style.cssText = `
      position:fixed;
      background:rgba(var(--mono-rgb-0),0.75);backdrop-filter:blur(16px) saturate(180%);-webkit-backdrop-filter:blur(16px) saturate(180%);
      border:1px solid rgba(255,255,255,0.12);border-radius:12px;
      box-shadow:0 12px 40px rgba(0,0,0,0.35);z-index:10000;
      padding:16px 20px;min-width:360px;min-height:200px;max-width:95vw;max-height:90vh;overflow-y:auto;overflow-x:hidden;scrollbar-gutter:stable;
    `;
    // 恢复保存的大小
    if (this.settings.popupSize) {
      popup.style.width = this.settings.popupSize.width + 'px';
      popup.style.height = this.settings.popupSize.height + 'px';
    }
    // 用整数像素居中，避免 transform 亚像素导致模糊
    if (restoreLeft && restoreTop) {
      popup.style.left = restoreLeft;
      popup.style.top = restoreTop;
    } else if (this.settings.popupPosition) {
      popup.style.left = this.settings.popupPosition.left;
      popup.style.top = this.settings.popupPosition.top;
    } else {
      requestAnimationFrame(() => {
        const w = popup.offsetWidth, h = popup.offsetHeight;
        popup.style.left = Math.round((window.innerWidth - w) / 2) + 'px';
        popup.style.top = Math.round((window.innerHeight - h) / 2) + 'px';
      });
    }

    // ── 头部 ──────────────────────────────────────────────────────────
    const header = popup.createDiv();
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding:0;cursor:move;';

    const leftHeader = header.createDiv();
    leftHeader.style.cssText = 'display:flex;align-items:center;gap:8px;';

    const langSwitch = leftHeader.createEl('span');
    langSwitch.style.cssText = 'cursor:pointer;user-select:none;font-size:12px;font-weight:700;padding:2px 6px;border-radius:4px;border:1px solid var(--background-modifier-border);background:var(--background-secondary);color:var(--text-muted);transition:all 0.15s ease;';
    const updateLangSwitch = () => {
      langSwitch.textContent = _currentLang === 'zh' ? 'CN' : 'EN';
      langSwitch.title = _currentLang === 'zh' ? 'Switch to English' : '切换为中文';
    };
    updateLangSwitch();
    langSwitch.addEventListener('click', async () => {
      _currentLang = _currentLang === 'zh' ? 'en' : 'zh';
      this.settings.language = _currentLang;
      await this.saveSettings();
      const prevLeft = popup.style.left;
      const prevTop = popup.style.top;
      popup.remove(); overlay.remove(); resizeHandle.remove();
      const pv2 = document.getElementById('ss-img-preview'); if (pv2) pv2.remove();
      this.openSnippetsPopup(prevLeft, prevTop);
    });
    langSwitch.addEventListener('mouseenter', () => {
      langSwitch.style.borderColor = 'var(--interactive-accent)';
      langSwitch.style.color = 'var(--interactive-accent)';
    });
    langSwitch.addEventListener('mouseleave', () => {
      langSwitch.style.borderColor = 'var(--background-modifier-border)';
      langSwitch.style.color = 'var(--text-muted)';
    });

    const title = leftHeader.createEl('h3', { text: t('popup.title') });
    title.style.cssText = 'margin:0;font-size:15px;color:var(--text-normal);';

    const versionTag = leftHeader.createEl('span');
     versionTag.textContent = 'v' + (this.manifest?.version || '');
    versionTag.style.cssText = 'font-size:10px;color:var(--text-faint);margin-left:2px;align-self:flex-end;margin-bottom:2px;';


    const closeBtn = header.createEl('span');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = 'cursor:pointer;font-size:16px;color:var(--text-muted);padding:2px 6px;';
    closeBtn.addEventListener('click', () => {
      this.settings.popupPosition = { left: popup.style.left, top: popup.style.top };
      this.saveSettings();
      popup.remove(); overlay.remove(); resizeHandle.remove();
      const pv3 = document.getElementById('ss-img-preview'); if (pv3) pv3.remove();
    });

    // ── 拖拽弹窗 ──────────────────────────────────────────────────────
    let isDraggingPopup = false, dragOffX = 0, dragOffY = 0;
    header.addEventListener('mousedown', (e) => {
      if (e.target === closeBtn || e.target === langSwitch) return;
      isDraggingPopup = true;
      const rect = popup.getBoundingClientRect();
      dragOffX = e.clientX - Math.round(rect.left);
      dragOffY = e.clientY - Math.round(rect.top);
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDraggingPopup) return;
      popup.style.left = Math.round(e.clientX - dragOffX) + 'px';
      popup.style.top = Math.round(e.clientY - dragOffY) + 'px';
      updateResizeHandlePosition();
    });
    document.addEventListener('mouseup', () => {
      if (isDraggingPopup) {
        isDraggingPopup = false;
        this.settings.popupPosition = { left: popup.style.left, top: popup.style.top };
        this.saveSettings();
      }
    });

    // ── 主题区域 ──────────────────────────────────────────────────────
    const themeArea = popup.createDiv();
    themeArea.style.cssText = 'margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--background-modifier-border);';

    const renderThemes = async () => {
      themeArea.empty();
      const { currentTheme, themeDirs } = await this.getThemeInfo();

      // 主题标签行 + 记忆模式 + 深浅模式开关
      const themeHeaderRow = themeArea.createDiv();
      themeHeaderRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;';

      const themeLabel = themeHeaderRow.createEl('div', { text: t('theme.section') });
      themeLabel.style.cssText = 'font-size:12px;font-weight:600;color:var(--text-normal);';

      const rightControls = themeHeaderRow.createDiv();
      rightControls.style.cssText = 'display:flex;align-items:center;gap:6px;';

      // 深浅模式切换开关
      const isDark = document.body.classList.contains('theme-dark');

      // 记忆模式 chip（深浅模式左边）
      const memChip = rightControls.createEl('span');
      const memActive = this.settings.styleMemory;
      memChip.textContent = t('styleMemory.chip');
      memChip.title = t('styleMemory.hint');
      memChip.style.cssText = `
        display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;cursor:pointer;
        user-select:none;transition:all 0.2s ease;
        border:1px solid ${memActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
        background:${memActive ? 'var(--interactive-accent)' : 'rgba(var(--mono-rgb-0),0.5)'};
        color:${memActive ? '#fff' : 'var(--text-muted)'};
        ${memActive ? 'box-shadow:0 0 6px rgba(var(--interactive-accent-rgb),0.4);' : ''}
      `;
      memChip.addEventListener('click', async () => {
        this.settings.styleMemory = !this.settings.styleMemory;
        await this.saveSettings();
        const on = this.settings.styleMemory;
        memChip.style.borderColor = on ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
        memChip.style.background = on ? 'var(--interactive-accent)' : 'rgba(var(--mono-rgb-0),0.5)';
        memChip.style.color = on ? '#fff' : 'var(--text-muted)';
        memChip.style.boxShadow = on ? '0 0 6px rgba(var(--interactive-accent-rgb),0.4)' : '';
        new Notice(on ? t('styleMemory.on') : t('styleMemory.off'));
      });

      const modeSwitch = rightControls.createDiv();
      modeSwitch.className = 'ss-mode-switch';
      const hasFloatingBtn = !!this.settings.floatingButton;
      modeSwitch.style.cssText = `
        display:${hasFloatingBtn ? 'none' : 'inline-flex'};align-items:center;justify-content:center;
        width:18px;height:18px;border-radius:50%;cursor:pointer;user-select:none;
        transition:all 0.15s ease;touch-action:none;position:relative;
        background:${isDark ? 'linear-gradient(135deg,#ff9a3c,#ffe44d)' : 'linear-gradient(135deg,#c8c8c8,#e8e8e8)'};
        box-shadow:${isDark ? '0 2px 8px rgba(255,154,60,0.3)' : '0 2px 6px rgba(0,0,0,0.1)'};
        opacity:0.85;
      `;
      modeSwitch.addEventListener('mouseenter', () => { modeSwitch.style.opacity = '1'; });
      modeSwitch.addEventListener('mouseleave', () => { modeSwitch.style.opacity = '0.85'; });

      // 拉绳（绝对定位在按钮正下方）
      const pullCordEl = modeSwitch.createEl('div');
      pullCordEl.style.cssText = `
        position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:2px;
        display:flex;flex-direction:column;align-items:center;cursor:ns-resize;
        user-select:none;opacity:0.6;transition:opacity 0.2s ease;
        touch-action:none;z-index:1;
      `;
      const cordLine = pullCordEl.createEl('div');
      cordLine.style.cssText = `
        width:2px;height:14px;
        background:linear-gradient(to bottom,var(--text-faint),var(--text-muted));
        border-radius:1px;transition:height 0.15s ease;
      `;
      const cordKnob = pullCordEl.createEl('div');
      cordKnob.style.cssText = `
        width:6px;height:6px;border-radius:50%;
        background:radial-gradient(circle at 35% 35%,var(--text-normal),var(--text-muted));
        box-shadow:0 1px 3px rgba(0,0,0,0.3);
        transition:transform 0.15s ease,box-shadow 0.15s ease;
      `;
      pullCordEl.addEventListener('mouseenter', () => { pullCordEl.style.opacity = '1'; modeSwitch.style.opacity = '1'; });
      pullCordEl.addEventListener('mouseleave', () => { if (!pullDragging) pullCordEl.style.opacity = '0.6'; });

      let pullDragging = false;
      let pullStartY = 0;
      const pullThreshold = 20;
      pullCordEl.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        pullDragging = true;
        pullStartY = e.clientY;
        cordLine.style.transition = 'none';
        cordKnob.style.transition = 'none';
      });
      const onPopupPullMove = (e) => {
        if (!pullDragging) return;
        e.preventDefault();
        const dy = e.clientY - pullStartY;
        cordLine.style.height = Math.max(8, 14 + dy) + 'px';
        const scale = 1 + Math.min(dy / pullThreshold, 0.4);
        cordKnob.style.transform = `scale(${scale})`;
        cordKnob.style.boxShadow = dy > pullThreshold * 0.6
          ? '0 2px 6px rgba(0,0,0,0.4), 0 0 4px var(--interactive-accent)'
          : '0 1px 3px rgba(0,0,0,0.3)';
      };
      const onPopupPullEnd = async (e) => {
        if (!pullDragging) return;
        pullDragging = false;
        const dy = e.clientY - pullStartY;
        cordLine.style.transition = 'height 0.3s cubic-bezier(0.34,1.56,0.64,1)';
        cordKnob.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
        cordLine.style.height = '14px';
        cordKnob.style.transform = 'scale(1)';
        cordKnob.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
        if (dy > pullThreshold) {
          cordKnob.style.background = 'radial-gradient(circle at 35% 35%,var(--interactive-accent),var(--text-muted))';
          setTimeout(() => {
            cordKnob.style.background = 'radial-gradient(circle at 35% 35%,var(--text-normal),var(--text-muted))';
          }, 400);
          await this.toggleMode();
          renderThemes();
        }
      };
      document.addEventListener('mousemove', onPopupPullMove);
      document.addEventListener('mouseup', onPopupPullEnd);

      // 点击按钮：显示/隐藏悬浮按钮
      modeSwitch.addEventListener('click', async () => {
        if (this.settings.floatingButton) {
          const existing = document.getElementById('ss-floating-button');
          if (existing) {
            if (existing._ssResizeHandler) window.removeEventListener('resize', existing._ssResizeHandler);
            if (existing._ssCleanup) existing._ssCleanup();
            existing.remove();
            const pc = document.getElementById('ss-pull-cord');
            if (pc) pc.remove();
            const styleEl = document.getElementById('ss-float-custom-style');
            if (styleEl) styleEl.remove();
          }
          this.settings.floatingButton = null;
          await this.saveSettings();
          modeSwitch.style.display = 'inline-flex';
        } else {
          const popupEl = document.getElementById('ss-snippets-popup');
          let fbX = window.innerWidth - 80;
          if (popupEl) {
            const rect = popupEl.getBoundingClientRect();
            fbX = rect.right + 50;
            if (fbX > window.innerWidth - 80) fbX = window.innerWidth - 80;
          }
          this.settings.floatingButton = {
            text: t('float.defaultText'),
            css: '',
            position: { x: fbX, y: 100 },
          };
          await this.saveSettings();
          this.createFloatingButton();
          modeSwitch.style.display = 'none';
        }
      });

      if (themeDirs.length === 0) {
        const hint = themeArea.createEl('span', { text: t('theme.noThemes') });
        hint.style.cssText = 'font-size:12px;color:var(--text-muted);';
        return;
      }

      const themeChips = themeArea.createDiv();
      themeChips.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;';

      // 默认主题 chip
      const defaultChip = themeChips.createEl('span');
      defaultChip.textContent = t('theme.default');
      const isDefaultActive = currentTheme === '';
      defaultChip.style.cssText = `
        display:inline-block;padding:3px 10px;border-radius:14px;font-size:12px;cursor:pointer;
        user-select:none;transition:all 0.15s ease;
        border:1px solid ${isDefaultActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
        background:${isDefaultActive ? 'var(--interactive-accent)' : 'rgba(var(--mono-rgb-0),0.5)'};
        color:${isDefaultActive ? '#fff' : 'var(--text-muted)'};
      `;
      defaultChip.addEventListener('click', async () => {
        if (currentTheme === '') return;
        await this.switchTheme('');
        renderThemes();
      });

      // 已安装主题 chips
      themeDirs.forEach(themeName => {
        const chip = themeChips.createEl('span');
        chip.textContent = themeName;
        const isActive = currentTheme === themeName;
        chip.style.cssText = `
          display:inline-block;padding:3px 10px;border-radius:14px;font-size:12px;cursor:pointer;
          user-select:none;transition:all 0.15s ease;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
          border:1px solid ${isActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
          background:${isActive ? 'var(--interactive-accent)' : 'rgba(var(--mono-rgb-0),0.5)'};
          color:${isActive ? '#fff' : 'var(--text-muted)'};
        `;
        chip.title = themeName;
        chip.addEventListener('click', async () => {
          if (currentTheme === themeName) return;
          await this.switchTheme(themeName);
          renderThemes();
        });
      });

      // "More..." chip → 打开社区主题面板
      const moreChip = themeChips.createEl('span');
      moreChip.textContent = 'More...';
      moreChip.style.cssText = `
        display:inline-block;padding:3px 10px;border-radius:14px;font-size:12px;cursor:pointer;
        user-select:none;transition:all 0.15s ease;
        border:1px dashed var(--background-modifier-border);
        background:rgba(var(--mono-rgb-0),0.3);
        color:var(--text-faint);
      `;
      moreChip.addEventListener('mouseenter', () => {
        moreChip.style.borderColor = 'var(--interactive-accent)';
        moreChip.style.color = 'var(--text-muted)';
      });
      moreChip.addEventListener('mouseleave', () => {
        moreChip.style.borderColor = 'var(--background-modifier-border)';
        moreChip.style.color = 'var(--text-faint)';
      });
      moreChip.addEventListener('click', () => {
        try {
          const app = this.app;
          if (app.setting) {
            if (typeof app.setting.open === 'function') {
              app.setting.open();
            }
            if (typeof app.setting.openTabById === 'function') {
              app.setting.openTabById('appearance');
              return;
            }
            setTimeout(() => {
              const tab = document.querySelector('.modal-setting-content [data-tab="appearance"]')
                || document.querySelector('[data-tab="appearance"]')
                || document.querySelector('.vertical-tab-nav-item[data-tab="appearance"]');
              if (tab) { tab.click(); return; }
              const tabs = document.querySelectorAll('.vertical-tab-nav-item');
              for (const t of tabs) {
                if (t.textContent && (t.textContent.toLowerCase().includes('appearance') || t.textContent.toLowerCase().includes('外观'))) {
                  t.click();
                  return;
                }
              }
            }, 300);
            return;
          }
          if (app.commands && typeof app.commands.executeCommandById === 'function') {
            app.commands.executeCommandById('app:open-settings');
            setTimeout(() => {
              const tabs = document.querySelectorAll('.vertical-tab-nav-item');
              for (const t of tabs) {
                if (t.textContent && (t.textContent.toLowerCase().includes('appearance') || t.textContent.toLowerCase().includes('外观'))) {
                  t.click();
                  return;
                }
              }
            }, 300);
          }
        } catch (e) {
          console.error('SwiftSwitch: failed to open themes', e);
        }
      });
    };

    renderThemes();

    // ── 背景分组 ──────────────────────────────────────────────────
    const eyeCareArea = popup.createDiv();
    eyeCareArea.style.cssText = 'margin-bottom:12px;';

    const BG_GROUP_KEY = '__bg__';

    const renderEyeCare = async () => {
      eyeCareArea.empty();

      const headerRow = eyeCareArea.createDiv();
      headerRow.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:6px;';

      const label = headerRow.createEl('div', { text: t('eyeCare.section') + '/' + t('eyeCare.imgTitle') });
      label.style.cssText = 'font-size:12px;font-weight:600;color:var(--text-normal);';

      const shareLink = headerRow.createEl('a');
      shareLink.textContent = _currentLang === 'zh' ? '分享/更多' : 'Share/More';
      shareLink.href = 'https://github.com/dlsdgj/Obsidian-SwiftSnippets/discussions/2';
      shareLink.target = '_blank';
      shareLink.style.cssText = 'font-size:10px;color:var(--text-muted);text-decoration:none;margin-left:auto;opacity:0.6;transition:opacity 0.15s ease;';
      shareLink.addEventListener('mouseenter', () => { shareLink.style.opacity = '1'; shareLink.style.color = 'var(--interactive-accent)'; });
      shareLink.addEventListener('mouseleave', () => { shareLink.style.opacity = '0.6'; shareLink.style.color = 'var(--text-muted)'; });

      const helpEl = headerRow.createEl('span', { text: '?' });
      helpEl.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:50%;font-size:10px;font-weight:700;background:var(--background-modifier-border);color:var(--text-muted);cursor:pointer;flex-shrink:0;transition:all 0.15s ease;';
      helpEl.setAttribute('title', t('eyeCare.imgHelp') + '\n' + t('eyeCare.imgOpenFolder'));
      helpEl.addEventListener('mouseenter', () => {
        helpEl.style.background = 'var(--interactive-accent)';
        helpEl.style.color = '#fff';
      });
      helpEl.addEventListener('mouseleave', () => {
        helpEl.style.background = 'var(--background-modifier-border)';
        helpEl.style.color = 'var(--text-muted)';
      });
      helpEl.addEventListener('click', (e) => {
        e.stopPropagation();
        try {
          const picDir = nodePath.join(this._getPluginDir(), 'pic');
          if (!nodeFs.existsSync(picDir)) {
            nodeFs.mkdirSync(picDir, { recursive: true });
          }
          const { exec } = require('child_process');
          const cmd = process.platform === 'win32'
            ? `explorer "${picDir.replace(/"/g, '\\"')}"`
            : process.platform === 'darwin'
              ? `open "${picDir}"`
              : `xdg-open "${picDir}"`;
          exec(cmd);
        } catch (e) {
          new Notice('Open folder failed: ' + (e?.message || e));
        }
      });

      const activeImgIdx = this.settings.eyeCareColor?.startsWith('__img_') ? parseInt(this.settings.eyeCareColor.slice(6), 10) : -1;
      const activeImg = activeImgIdx >= 0 ? (this.settings.bgImages || [])[activeImgIdx] : null;
      if (activeImg) {
        const opLabel = headerRow.createEl('span', { text: t('eyeCare.imgOpacity') });
        opLabel.style.cssText = 'font-size:10px;color:var(--text-muted);white-space:nowrap;';
        const slider = headerRow.createEl('input', { type: 'range' });
        slider.min = '5'; slider.max = '100'; slider.value = String(Math.round((activeImg.opacity ?? 0.3) * 100));
        slider.style.cssText = 'width:70px;cursor:pointer;height:4px;';
        const valSpan = headerRow.createEl('span', { text: Math.round((activeImg.opacity ?? 0.3) * 100) + '%' });
        valSpan.style.cssText = 'font-size:10px;color:var(--text-muted);min-width:28px;';
        slider.addEventListener('input', async () => {
          const v = parseInt(slider.value) / 100;
          valSpan.textContent = slider.value + '%';
          activeImg.opacity = v;
          await this.saveSettings();
          this.applyEyeCareColor();
        });
        const tileBtn = headerRow.createEl('span');
        const isTile = activeImg.tile ?? false;
        tileBtn.style.cssText = `font-size:10px;padding:1px 6px;border-radius:8px;cursor:pointer;border:1px solid ${isTile ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};background:${isTile ? 'var(--interactive-accent)' : 'var(--background-primary)'};color:${isTile ? '#fff' : 'var(--text-muted)'};user-select:none;`;
        tileBtn.textContent = t('eyeCare.imgTile');
        tileBtn.addEventListener('click', async () => {
          activeImg.tile = !(activeImg.tile ?? false);
          await this.saveSettings();
          this.applyEyeCareColor();
          renderEyeCare();
        });
      }

      const chipsContainer = eyeCareArea.createDiv();
      chipsContainer.className = 'ss-group-chips';
      chipsContainer.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;min-height:28px;padding:4px;border-radius:6px;border:1px dashed var(--background-modifier-border);transition:border-color 0.15s ease;';

      const bgMembers = this.settings.groups[BG_GROUP_KEY] || [];
      const { enabledSnippets, snippetFiles } = await this.getSnippetInfo();
      for (let i = bgMembers.length - 1; i >= 0; i--) {
        if (!snippetFiles.includes(bgMembers[i])) bgMembers.splice(i, 1);
      }
      const isEnabled = (name) => enabledSnippets.includes(name);

      bgMembers.forEach(snippetName => {
        this._createChip(chipsContainer, snippetName, isEnabled(snippetName), BG_GROUP_KEY, async () => {
          if (enabledSnippets.includes(snippetName) && this.settings.eyeCareColor) {
            this.settings.eyeCareColor = '';
            this.applyEyeCareColor();
            await this.saveSettings();
          }
          renderEyeCare();
          renderContent();
        });
      });

      // 图片 chips
      const imgs = this.settings.bgImages || [];
      let previewEl = document.getElementById('ss-img-preview');
      if (!previewEl && imgs.length > 0) {
        previewEl = document.createElement('div');
        previewEl.id = 'ss-img-preview';
        previewEl.style.cssText = 'position:fixed;z-index:10001;pointer-events:none;opacity:0;transition:opacity 0.15s ease;border-radius:6px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.3);border:1px solid var(--background-modifier-border);';
        document.body.appendChild(previewEl);
      }
      const showPreview = (dataUrl, chipEl) => {
        previewEl.innerHTML = '';
        const imgEl = document.createElement('img');
        imgEl.src = dataUrl;
        imgEl.style.cssText = 'max-width:220px;max-height:160px;display:block;';
        previewEl.appendChild(imgEl);
        const rect = chipEl.getBoundingClientRect();
        previewEl.style.left = rect.left + 'px';
        previewEl.style.top = (rect.top - 170) + 'px';
        requestAnimationFrame(() => {
          const pRect = previewEl.getBoundingClientRect();
          if (pRect.top < 4) {
            previewEl.style.top = (rect.bottom + 6) + 'px';
          }
        });
        previewEl.style.opacity = '1';
      };
      const hidePreview = () => { previewEl.style.opacity = '0'; };

      imgs.forEach((img, idx) => {
        const isActive = this.settings.eyeCareColor === `__img_${idx}`;
        const chip = chipsContainer.createDiv();
        chip.style.cssText = `display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:12px;font-size:11px;cursor:pointer;border:1px solid ${isActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};background:${isActive ? 'var(--interactive-accent)' : 'var(--background-primary)'};color:${isActive ? '#fff' : 'var(--text-normal)'};max-width:150px;transition:border-color 0.15s,background 0.15s,color 0.15s;`;
        const picDir = this._getPluginDir();
        const fullPath = nodePath.join(picDir, 'pic', img.url);
        let dotStyle = `display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#6c9,#69c);`;
        let chipDataUrl = '';
        try {
          const buf = nodeFs.readFileSync(fullPath);
          const ext = nodePath.extname(fullPath).toLowerCase();
          const mimeMap = { '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.bmp':'image/bmp','.svg':'image/svg+xml' };
          const mime = mimeMap[ext] || 'image/png';
          chipDataUrl = 'data:' + mime + ';base64,' + buf.toString('base64');
          dotStyle = `display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0;background:url('${chipDataUrl}') center/cover;`;
        } catch (e) {}
        const dot = chip.createEl('span');
        dot.style.cssText = dotStyle;
        const nameEl = chip.createEl('span', { text: img.label || img.url });
        nameEl.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
        chip.addEventListener('click', async () => {
          if (this.settings.eyeCareColor === `__img_${idx}`) {
            this.settings.eyeCareColor = '';
          } else {
            this.settings.eyeCareColor = `__img_${idx}`;
            for (const name of bgMembers) {
              this._setSnippetEnabled(name, false);
            }
          }
          this.applyEyeCareColor();
          await this.saveSettings();
          renderEyeCare();
          renderContent();
        });
        chip.addEventListener('mouseenter', () => { if (chipDataUrl) showPreview(chipDataUrl, chip); });
        chip.addEventListener('mouseleave', () => { hidePreview(); });
        chip.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          hidePreview();
          const menu = document.createElement('div');
          menu.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;background:rgba(var(--mono-rgb-0),0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--background-modifier-border);border-radius:6px;padding:4px 0;z-index:10001;box-shadow:0 4px 16px rgba(0,0,0,0.25);min-width:120px;`;
          const mkItem = (label, action) => {
            const item = document.createElement('div');
            item.textContent = label;
            item.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:13px;color:var(--text-normal);';
            item.addEventListener('mouseenter', () => { item.style.background = 'var(--background-modifier-hover)'; });
            item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; });
            item.addEventListener('click', async () => { menu.remove(); await action(); });
            menu.appendChild(item);
          };
          mkItem(t('eyeCare.imgRename'), async () => {
            const newName = await this._promptGroupName(img.url, t('eyeCare.imgRenameTitle'));
            if (newName && newName !== img.url) {
              try {
                const oldPath = nodePath.join(picDir, 'pic', img.url);
                const newPath = nodePath.join(picDir, 'pic', newName);
                if (nodeFs.existsSync(oldPath)) {
                  nodeFs.renameSync(oldPath, newPath);
                  img.url = newName;
                  img.label = newName;
                  await this.saveSettings();
                  this.applyEyeCareColor();
                  renderEyeCare();
                }
              } catch (_e) { new Notice(t('eyeCare.imgRenameFailed')); }
            }
          });
          mkItem(t('eyeCare.imgRotate'), async () => {
            try {
              await this._rotateImage(img.url);
              this.applyEyeCareColor();
              renderEyeCare();
              new Notice(t('eyeCare.imgRotated'));
            } catch (_e) { new Notice(t('eyeCare.imgRotateFailed')); }
          });
          mkItem(t('eyeCare.imgDelete'), async () => {
            try {
              const delPath = nodePath.join(picDir, 'pic', img.url);
              if (nodeFs.existsSync(delPath)) nodeFs.unlinkSync(delPath);
              const imgs2 = this.settings.bgImages || [];
              const delIdx = imgs2.findIndex(i => i.url === img.url);
              if (delIdx >= 0) imgs2.splice(delIdx, 1);
              if (this.settings.eyeCareColor === `__img_${delIdx}`) {
                this.settings.eyeCareColor = '';
              } else if (this.settings.eyeCareColor?.startsWith('__img_')) {
                const curIdx = parseInt(this.settings.eyeCareColor.slice(6), 10);
                if (curIdx > delIdx) this.settings.eyeCareColor = `__img_${curIdx - 1}`;
              }
              await this.saveSettings();
              this.applyEyeCareColor();
              renderEyeCare();
              new Notice(t('eyeCare.imgDeleted'));
            } catch (_e) { new Notice('Delete failed'); }
          });
          document.body.appendChild(menu);
          const closeMenu = () => { if (document.body.contains(menu)) menu.remove(); document.removeEventListener('click', closeMenu); };
          setTimeout(() => document.addEventListener('click', closeMenu), 10);
        });
      });

      chipsContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        chipsContainer.style.borderColor = 'var(--interactive-accent)';
      });
      chipsContainer.addEventListener('dragleave', () => {
        chipsContainer.style.borderColor = 'var(--background-modifier-border)';
      });
      chipsContainer.addEventListener('drop', async (e) => {
        e.preventDefault();
        chipsContainer.style.borderColor = 'var(--background-modifier-border)';
        if (!this._dragData) return;
        const snippetName = this._dragData.snippetName;
        this._dragData = null;
        await this._moveToGroup(snippetName, BG_GROUP_KEY);
        renderEyeCare();
        renderContent();
      });
    };

    renderEyeCare();

    // ── 内容区域 ──────────────────────────────────────────────────────
    const contentArea = popup.createDiv();
    contentArea.style.cssText = 'min-height:60px;';

    // 拖拽状态（使用实例属性，避免闭包传值问题）
    this._dragData = null;

    const renderContent = async () => {
      popup._ssRenderContent = renderContent;
      contentArea.empty();
      const { enabledSnippets, snippetFiles } = await this.getSnippetInfo();


      if (snippetFiles.length === 0) {
        const hint = contentArea.createEl('span');
        hint.textContent = t('snippet.noSnippets');
        hint.style.cssText = 'font-size:12px;color:var(--text-muted);';
        return;
      }

      // 清理 settings.groups 中已不存在的 snippet
      for (const members of Object.values(this.settings.groups)) {
        for (let i = members.length - 1; i >= 0; i--) {
          if (!snippetFiles.includes(members[i])) members.splice(i, 1);
        }
      }
      await this.saveSettings();

      const isEnabled = (name) => enabledSnippets.includes(name);

      // ── 渲染各分组 ────────────────────────────────────────────────
      const bgGroupName = '__bg__';
      const orderedGroups = this.settings.groupOrder.filter(g => this.settings.groups[g] && g !== bgGroupName);

      for (const gName of orderedGroups) {
        const members = this.settings.groups[gName];
        if (!members) continue;

        const isCollapsed = this.settings.collapsedGroups[gName] || false;

        const groupEl = contentArea.createDiv();
        groupEl.style.cssText = 'margin-bottom:10px;';
        groupEl.setAttribute('data-group', gName);

        // 分组头
        const groupHeader = groupEl.createDiv();
        groupHeader.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:6px;user-select:none;';

        const collapseIcon = groupHeader.createEl('span');
        collapseIcon.textContent = isCollapsed ? '▶' : '▼';
        collapseIcon.style.cssText = 'font-size:10px;color:var(--text-muted);cursor:pointer;transition:transform 0.15s ease;';

        const groupLabel = groupHeader.createEl('span');
        groupLabel.textContent = gName + ' (' + members.length + ')';
        groupLabel.style.cssText = 'font-size:12px;font-weight:600;color:var(--text-normal);cursor:pointer;';

        const isExclusive = this.settings.exclusiveGroups && this.settings.exclusiveGroups.includes(gName);
        const exclBtn = groupHeader.createEl('span');
        exclBtn.textContent = '⊘';
        exclBtn.title = isExclusive ? t('group.exclusive') + ' — ' + t('group.exclusive.hint') : t('group.exclusive');
        exclBtn.style.cssText = `
          font-size:14px;cursor:pointer;user-select:none;transition:all 0.2s ease;
          color:${isExclusive ? 'var(--interactive-accent)' : 'var(--text-faint)'};
          ${isExclusive ? 'text-shadow:0 0 6px rgba(var(--interactive-accent-rgb),0.5);' : ''}
        `;
        exclBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          if (!this.settings.exclusiveGroups) this.settings.exclusiveGroups = [];
          if (isExclusive) {
            this.settings.exclusiveGroups = this.settings.exclusiveGroups.filter(g => g !== gName);
            new Notice(t('group.exclusive.off'));
          } else {
            this.settings.exclusiveGroups.push(gName);
            new Notice(t('group.exclusive.on'));
          }
          await this.saveSettings();
          renderContent();
        });

        // 分组右键菜单（重命名、删除）
        groupHeader.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this._showGroupContextMenu(e, gName, renderContent);
        });

        // 折叠/展开
        const chipsContainer = groupEl.createDiv();
        chipsContainer.className = 'ss-group-chips';
        chipsContainer.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;min-height:28px;padding:4px;border-radius:6px;border:1px dashed transparent;transition:border-color 0.15s ease;';
        chipsContainer.style.display = isCollapsed ? 'none' : 'flex';

        const toggleCollapse = async () => {
          const collapsed = !this.settings.collapsedGroups[gName];
          this.settings.collapsedGroups[gName] = collapsed;
          await this.saveSettings();
          collapseIcon.textContent = collapsed ? '▶' : '▼';
          chipsContainer.style.display = collapsed ? 'none' : 'flex';
        };
        collapseIcon.addEventListener('click', toggleCollapse);
        groupLabel.addEventListener('click', toggleCollapse);

        // 拖拽进入分组 - 高亮边框
        chipsContainer.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          chipsContainer.style.borderColor = 'var(--interactive-accent)';
        });
        chipsContainer.addEventListener('dragleave', () => {
          chipsContainer.style.borderColor = 'transparent';
        });
        chipsContainer.addEventListener('drop', async (e) => {
          e.preventDefault();
          chipsContainer.style.borderColor = 'transparent';
          if (!this._dragData) return;
          const snippetName = this._dragData.snippetName;
          const sourceGroup = this._dragData.sourceGroup;
          if (sourceGroup === gName) return; // 同组不操作
          await this._moveToGroup(snippetName, gName);
          this._dragData = null;
          renderContent();
        });

        members.forEach(snippetName => {
          this._createChip(chipsContainer, snippetName, isEnabled(snippetName), gName, renderContent);
        });
      }

      // ── 未分组 snippets ───────────────────────────────────────────
      const groupedSnippets = new Set();
      for (const members of Object.values(this.settings.groups)) {
        members.forEach(s => groupedSnippets.add(s));
      }
      const ungrouped = snippetFiles.filter(n => !groupedSnippets.has(n));

      if (ungrouped.length > 0) {
        const isCollapsed = this.settings.collapsedGroups['__ungrouped__'] || false;

        const groupEl = contentArea.createDiv();
        groupEl.style.cssText = 'margin-bottom:10px;';

        const groupHeader = groupEl.createDiv();
        groupHeader.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:6px;user-select:none;';

        const collapseIcon = groupHeader.createEl('span');
        collapseIcon.textContent = isCollapsed ? '▶' : '▼';
        collapseIcon.style.cssText = 'font-size:10px;color:var(--text-muted);cursor:pointer;';

        const groupLabel = groupHeader.createEl('span');
        groupLabel.textContent = t('group.ungrouped') + ' (' + ungrouped.length + ')';
        groupLabel.style.cssText = 'font-size:12px;font-weight:600;color:var(--text-muted);cursor:pointer;';

        const chipsContainer = groupEl.createDiv();
        chipsContainer.className = 'ss-group-chips';
        chipsContainer.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;min-height:28px;padding:4px;border-radius:6px;border:1px dashed transparent;transition:border-color 0.15s ease;';
        chipsContainer.style.display = isCollapsed ? 'none' : 'flex';

        const toggleCollapse = async () => {
          const collapsed = !this.settings.collapsedGroups['__ungrouped__'];
          this.settings.collapsedGroups['__ungrouped__'] = collapsed;
          await this.saveSettings();
          collapseIcon.textContent = collapsed ? '▶' : '▼';
          chipsContainer.style.display = collapsed ? 'none' : 'flex';
        };
        collapseIcon.addEventListener('click', toggleCollapse);
        groupLabel.addEventListener('click', toggleCollapse);

        // 拖入未分组 = 移出分组
        chipsContainer.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          chipsContainer.style.borderColor = 'var(--interactive-accent)';
        });
        chipsContainer.addEventListener('dragleave', () => {
          chipsContainer.style.borderColor = 'transparent';
        });
        chipsContainer.addEventListener('drop', async (e) => {
          e.preventDefault();
          chipsContainer.style.borderColor = 'transparent';
          if (!this._dragData) return;
          await this._removeFromGroup(this._dragData.snippetName);
          this._dragData = null;
          renderContent();
        });

        ungrouped.forEach(snippetName => {
          this._createChip(chipsContainer, snippetName, isEnabled(snippetName), null, renderContent);
        });
      }

      // ── 添加 Snippet 按钮 ─────────────────────────────────────────
      const addRow = contentArea.createDiv();
      addRow.style.cssText = 'display:flex;justify-content:flex-start;margin-top:8px;';

      const addChip = addRow.createEl('span');
      addChip.textContent = '+ ' + t('snippet.add');
      addChip.style.cssText = `
        display:inline-flex;align-items:center;justify-content:center;
        padding:4px 12px;border-radius:14px;font-size:12px;font-weight:500;
        cursor:pointer;user-select:none;transition:all 0.15s ease;
        border:1px dashed var(--background-modifier-border);
        background:rgba(var(--mono-rgb-0),0.3);color:var(--text-muted);
      `;
      addChip.addEventListener('mouseenter', () => {
        addChip.style.borderColor = 'var(--interactive-accent)';
        addChip.style.color = 'var(--interactive-accent)';
      });
      addChip.addEventListener('mouseleave', () => {
        addChip.style.borderColor = 'var(--background-modifier-border)';
        addChip.style.color = 'var(--text-muted)';
      });
      addChip.addEventListener('click', () => {
        this._showAddForm(popup, renderContent);
      });
    };

    // ── 右键空白处 → 添加分组 ─────────────────────────────────────────
    contentArea.addEventListener('contextmenu', (e) => {
      // 只在空白处触发（不在 chip 或 groupHeader 上）
      if (e.target.closest('.ss-chip') || e.target.closest('.ss-group-header')) return;
      e.preventDefault();

      const menu = document.createElement('div');
      menu.style.cssText = `
        position:fixed;left:${e.clientX}px;top:${e.clientY}px;
        background:rgba(var(--mono-rgb-0),0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
        border:1px solid var(--background-modifier-border);border-radius:6px;
        padding:4px 0;z-index:10001;box-shadow:0 4px 16px rgba(0,0,0,0.25);min-width:120px;
      `;

      const addGroupItem = document.createElement('div');
      addGroupItem.textContent = t('group.add');
      addGroupItem.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:13px;color:var(--text-normal);';
      addGroupItem.addEventListener('mouseenter', () => { addGroupItem.style.background = 'var(--background-modifier-hover)'; });
      addGroupItem.addEventListener('mouseleave', () => { addGroupItem.style.background = 'transparent'; });
      addGroupItem.addEventListener('click', async () => {
        menu.remove();
        const groupName = await this._promptGroupName('');
        if (groupName && !this.settings.groups[groupName]) {
          this.settings.groups[groupName] = [];
          this.settings.groupOrder.push(groupName);
          await this.saveSettings();
          renderContent();
        }
      });
      menu.appendChild(addGroupItem);

      document.body.appendChild(menu);
      const closeMenu = () => { if (document.body.contains(menu)) menu.remove(); document.removeEventListener('click', closeMenu); };
      setTimeout(() => document.addEventListener('click', closeMenu), 10);
    });

    renderContent();

    // ── 底部：其他插件链接 ────────────────────────────────────────────
    const footer = popup.createDiv();
    footer.style.cssText = 'padding-top:10px;margin-top:8px;border-top:1px solid var(--background-modifier-border);display:flex;align-items:center;gap:8px;flex-wrap:wrap;opacity:0;transition:opacity 0.3s ease;cursor:default;';

    footer.addEventListener('mouseenter', () => { footer.style.opacity = '1'; });
    footer.addEventListener('mouseleave', () => { footer.style.opacity = '0'; });

    const footerLabel = footer.createEl('span');
    footerLabel.textContent = _currentLang === 'zh' ? '更多插件' : 'More Plugins';
    footerLabel.style.cssText = 'font-size:11px;color:var(--text-faint);';

    const mkPluginChip = (name, searchId) => {
      const chip = footer.createEl('span');
      chip.textContent = name;
      chip.style.cssText = `
        display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;cursor:pointer;
        border:1px solid var(--background-modifier-border);
        background:rgba(var(--mono-rgb-0),0.4);color:var(--text-muted);
        transition:all 0.15s ease;user-select:none;
      `;
      chip.addEventListener('mouseenter', () => {
        chip.style.borderColor = 'var(--interactive-accent)';
        chip.style.color = 'var(--text-normal)';
      });
      chip.addEventListener('mouseleave', () => {
        chip.style.borderColor = 'var(--background-modifier-border)';
        chip.style.color = 'var(--text-muted)';
      });
      chip.addEventListener('click', () => {
        window.open('obsidian://show-plugin?id=' + searchId);
      });
    };

    mkPluginChip('SwiftGloss', 'regex-css-highlighter');
    mkPluginChip('SwiftMatch', 'swift-match');

    const feedbackChip = footer.createEl('span');
    feedbackChip.textContent = t('popup.feedback');
    feedbackChip.style.cssText = `
      display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;cursor:pointer;
      border:1px solid var(--background-modifier-border);
      background:rgba(var(--mono-rgb-0),0.4);color:var(--text-muted);
      transition:all 0.15s ease;user-select:none;
    `;
    feedbackChip.addEventListener('mouseenter', () => {
      feedbackChip.style.borderColor = 'var(--interactive-accent)';
      feedbackChip.style.color = 'var(--text-normal)';
    });
    feedbackChip.addEventListener('mouseleave', () => {
      feedbackChip.style.borderColor = 'var(--background-modifier-border)';
      feedbackChip.style.color = 'var(--text-muted)';
    });
    feedbackChip.addEventListener('click', () => {
      window.open('https://github.com/dlsdgj/Obsidian-SwiftSnippets');
    });

    let animStyle = document.getElementById('ss-popup-anim');
    if (!animStyle) {
      animStyle = document.createElement('style');
      animStyle.id = 'ss-popup-anim';
      animStyle.textContent = `@keyframes ss-dot-breathe{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}@keyframes ss-dot-breathe478{0%{opacity:0.5;transform:scale(0.8)}21%{opacity:1;transform:scale(1.2)}58%{opacity:1;transform:scale(1.2)}100%{opacity:0.5;transform:scale(0.8)}}@keyframes ss-dot-breatheBox{0%{opacity:0.5;transform:scale(0.8)}25%{opacity:1;transform:scale(1.2)}50%{opacity:1;transform:scale(1.2)}75%{opacity:0.5;transform:scale(0.8)}100%{opacity:0.5;transform:scale(0.8)}}`;
      document.head.appendChild(animStyle);
    }

    // ── 右下角调整大小手柄 ────────────────────────────────────────────
    const resizeHandle = document.body.createDiv();
    resizeHandle.className = 'ss-resize-handle';
    resizeHandle.style.cssText = 'position:fixed;width:12px;height:12px;cursor:nwse-resize;z-index:10001;background:linear-gradient(135deg,transparent 50%,var(--text-muted) 50%);pointer-events:auto;border-radius:0 0 8px 0;opacity:0.5;transition:opacity 0.15s ease;';
    resizeHandle.title = _currentLang === 'zh' ? '拖拽调整大小' : 'Drag to resize';
    resizeHandle.addEventListener('mouseenter', () => { resizeHandle.style.opacity = '1'; });
    resizeHandle.addEventListener('mouseleave', () => { resizeHandle.style.opacity = '0.5'; });

    const updateResizeHandlePosition = () => {
      if (!document.body.contains(popup) || !document.body.contains(resizeHandle)) return;
      const rect = popup.getBoundingClientRect();
      resizeHandle.style.right = (window.innerWidth - rect.right + 2) + 'px';
      resizeHandle.style.bottom = (window.innerHeight - rect.bottom + 2) + 'px';
    };
    requestAnimationFrame(() => { requestAnimationFrame(updateResizeHandlePosition); });

    let isResizing = false, resizeStartX = 0, resizeStartY = 0, resizeStartW = 0, resizeStartH = 0;
    resizeHandle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      isResizing = true;
      resizeStartX = e.clientX;
      resizeStartY = e.clientY;
      resizeStartW = popup.offsetWidth;
      resizeStartH = popup.offsetHeight;
      document.addEventListener('mousemove', onResizeMove);
      document.addEventListener('mouseup', onResizeEnd);
    });
    const onResizeMove = (e) => {
      if (!isResizing) return;
      const newW = Math.max(360, resizeStartW + (e.clientX - resizeStartX));
      const newH = Math.max(200, resizeStartH + (e.clientY - resizeStartY));
      popup.style.width = newW + 'px';
      popup.style.height = newH + 'px';
      updateResizeHandlePosition();
    };
    const onResizeEnd = () => {
      document.removeEventListener('mousemove', onResizeMove);
      document.removeEventListener('mouseup', onResizeEnd);
      if (isResizing) {
        isResizing = false;
        this.settings.popupSize = { width: popup.offsetWidth, height: popup.offsetHeight };
        this.saveSettings();
      }
    };

    document.body.appendChild(overlay);
    document.body.appendChild(popup);
  }

  // ─── 简易输入弹窗（替代 prompt）─────────────────────────────────────────
  _promptGroupName(defaultValue, title) {
    return new Promise((resolve) => {
      const backdrop = document.createElement('div');
      backdrop.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:10002;';

      const dialog = document.createElement('div');
      dialog.style.cssText = `
        position:fixed;
        background:rgba(var(--mono-rgb-0),0.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
        border:1px solid var(--background-modifier-border);border-radius:8px;
        box-shadow:0 8px 32px rgba(0,0,0,0.3);z-index:10003;
        padding:16px 20px;min-width:260px;
      `;
      requestAnimationFrame(() => {
        const w = dialog.offsetWidth, h = dialog.offsetHeight;
        dialog.style.left = Math.round((window.innerWidth - w) / 2) + 'px';
        dialog.style.top = Math.round((window.innerHeight - h) / 2) + 'px';
      });

      const label = dialog.createEl('div', { text: title || t('group.add') });
      label.style.cssText = 'font-size:13px;font-weight:600;margin-bottom:8px;color:var(--text-normal);';

      const input = dialog.createEl('input', { type: 'text' });
      input.value = defaultValue;
      input.placeholder = t('group.namePlaceholder');
      input.style.cssText = 'width:100%;padding:6px 8px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);margin-bottom:10px;';

      const btnRow = dialog.createDiv();
      btnRow.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;';

      const cancelBtn = btnRow.createEl('button', { text: t('btn.cancel') });
      cancelBtn.addEventListener('click', () => { backdrop.remove(); dialog.remove(); resolve(null); });

      const okBtn = btnRow.createEl('button', { text: t('btn.save') });
      okBtn.style.cssText = 'background:var(--interactive-accent);color:#fff;border:none;border-radius:4px;padding:4px 12px;cursor:pointer;';
      okBtn.addEventListener('click', () => {
        const val = input.value.trim();
        backdrop.remove(); dialog.remove();
        resolve(val || null);
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { okBtn.click(); }
        if (e.key === 'Escape') { cancelBtn.click(); }
      });

      backdrop.addEventListener('click', () => { backdrop.remove(); dialog.remove(); resolve(null); });

      document.body.appendChild(backdrop);
      document.body.appendChild(dialog);
      setTimeout(() => input.focus(), 50);
    });
  }

  // ─── 分组右键菜单 ──────────────────────────────────────────────────────
  _showGroupContextMenu(e, groupName, rerender) {
    const menu = document.createElement('div');
    menu.style.cssText = `
      position:fixed;left:${e.clientX}px;top:${e.clientY}px;
      background:rgba(var(--mono-rgb-0),0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
      border:1px solid var(--background-modifier-border);border-radius:6px;
      padding:4px 0;z-index:10001;box-shadow:0 4px 16px rgba(0,0,0,0.25);min-width:120px;
    `;

    const mkItem = (label, action) => {
      const item = document.createElement('div');
      item.textContent = label;
      item.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:13px;color:var(--text-normal);';
      item.addEventListener('mouseenter', () => { item.style.background = 'var(--background-modifier-hover)'; });
      item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; });
      item.addEventListener('click', async () => { menu.remove(); await action(); });
      menu.appendChild(item);
    };

    // 重命名
    mkItem(t('context.renameGroup'), async () => {
      const newName = await this._promptGroupName(groupName);
      if (newName && newName !== groupName) {
        const members = this.settings.groups[groupName];
        delete this.settings.groups[groupName];
        this.settings.groups[newName] = members;
        const idx = this.settings.groupOrder.indexOf(groupName);
        if (idx !== -1) this.settings.groupOrder[idx] = newName;
        if (this.settings.collapsedGroups[groupName] !== undefined) {
          this.settings.collapsedGroups[newName] = this.settings.collapsedGroups[groupName];
          delete this.settings.collapsedGroups[groupName];
        }
        await this.saveSettings();
        rerender();
      }
    });

    // 互斥分组
    const isExclusive = this.settings.exclusiveGroups && this.settings.exclusiveGroups.includes(groupName);
    mkItem((isExclusive ? '✓ ' : '') + t('group.exclusive'), async () => {
      if (!this.settings.exclusiveGroups) this.settings.exclusiveGroups = [];
      if (isExclusive) {
        this.settings.exclusiveGroups = this.settings.exclusiveGroups.filter(g => g !== groupName);
        new Notice(t('group.exclusive.off'));
      } else {
        this.settings.exclusiveGroups.push(groupName);
        new Notice(t('group.exclusive.on'));
      }
      await this.saveSettings();
      rerender();
    });

    // 删除分组（snippets 回到未分组）
    mkItem(t('context.deleteGroup'), async () => {
      delete this.settings.groups[groupName];
      this.settings.groupOrder = this.settings.groupOrder.filter(n => n !== groupName);
      delete this.settings.collapsedGroups[groupName];
      await this.saveSettings();
      rerender();
    });

    document.body.appendChild(menu);
    const closeMenu = () => { if (document.body.contains(menu)) menu.remove(); document.removeEventListener('click', closeMenu); };
    setTimeout(() => document.addEventListener('click', closeMenu), 10);
  }

  // ─── 创建 snippet chip ──────────────────────────────────────────────────
  _createChip(container, snippetName, isEnabled, currentGroup, rerender) {
    const chip = container.createEl('span');
    chip.className = 'ss-chip';
    chip.textContent = snippetName;
    chip.setAttribute('draggable', 'true');
    chip.setAttribute('data-snippet', snippetName);

    const isExclusive = currentGroup && this.settings.exclusiveGroups && this.settings.exclusiveGroups.includes(currentGroup);

    const applyStyle = (en) => {
      chip.style.cssText = `
        display:inline-block;padding:3px 10px;border-radius:14px;font-size:12px;cursor:pointer;
        user-select:none;transition:all 0.15s ease;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
        border:1px solid ${en ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
        background:${en ? 'var(--interactive-accent)' : 'rgba(var(--mono-rgb-0),0.5)'};
        color:${en ? '#fff' : 'var(--text-muted)'};
        ${isExclusive ? 'border-style:dashed;' : ''}
      `;
      chip.title = snippetName + (en ? ' (' + t('snippet.enabled') + ')' : ' (' + t('snippet.disabled') + ')') + (isExclusive ? ' [' + t('group.exclusive') + ']' : '');
    };
    applyStyle(isEnabled);

    let chipEnabled = isEnabled;
    chip.addEventListener('click', async (e) => {
      e.stopPropagation();

      if (!chipEnabled && isExclusive) {
        const members = this.settings.groups[currentGroup] || [];

        for (const name of members) {
          if (name !== snippetName) {
            this._setSnippetEnabled(name, false);
          }
        }
      }
      this._setSnippetEnabled(snippetName, !chipEnabled);

      if (!chipEnabled && currentGroup === '__bg__' && this.settings.eyeCareColor) {
        this.settings.eyeCareColor = '';
        this.applyEyeCareColor();
        this.saveSettings();
      }

      chipEnabled = !chipEnabled;
      applyStyle(chipEnabled);
      new Notice(snippetName + ' ' + t('snippet.toggled'));
      if (isExclusive) setTimeout(() => rerender(), 50);
    });

    // 右键菜单
    chip.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const menu = document.createElement('div');
      menu.style.cssText = `
        position:fixed;left:${e.clientX}px;top:${e.clientY}px;
        background:rgba(var(--mono-rgb-0),0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
        border:1px solid var(--background-modifier-border);border-radius:6px;
        padding:4px 0;z-index:10001;box-shadow:0 4px 16px rgba(0,0,0,0.25);min-width:120px;
      `;

      const mkItem = (label, action) => {
        const item = document.createElement('div');
        item.textContent = label;
        item.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:13px;color:var(--text-normal);';
        item.addEventListener('mouseenter', () => { item.style.background = 'var(--background-modifier-hover)'; });
        item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; });
        item.addEventListener('click', async () => { menu.remove(); await action(); });
        menu.appendChild(item);
      };

      // 复制
      mkItem(t('context.copy'), async () => {
        try {
          const cssPath = '.obsidian/snippets/' + snippetName + '.css';
          const jsPath = '.obsidian/snippets/' + snippetName + '.js';
          let content = '';
          try { content = await this.app.vault.adapter.read(cssPath); } catch (_e) {
            try { content = await this.app.vault.adapter.read(jsPath); } catch (_e2) {}
          }
          await navigator.clipboard.writeText(content);
          new Notice(t('btn.copied'));
        } catch (_e) { new Notice('Copy failed'); }
      });

      // 编辑
      mkItem(t('context.edit'), async () => {
        const cssPath = '.obsidian/snippets/' + snippetName + '.css';
        const jsPath = '.obsidian/snippets/' + snippetName + '.js';
        let content = '', editPath = cssPath, readFailed = false;
        console.log('[SwiftSnippets] Edit snippet:', snippetName, 'cssPath:', cssPath, 'jsPath:', jsPath);
        try {
          content = await this.app.vault.adapter.read(cssPath);
          console.log('[SwiftSnippets] Read CSS OK, length:', content.length);
        } catch (_e) {
          console.warn('[SwiftSnippets] Read CSS failed:', _e?.message || _e);
          try {
            content = await this.app.vault.adapter.read(jsPath);
            editPath = jsPath;
            console.log('[SwiftSnippets] Read JS OK, length:', content.length);
          } catch (_e2) {
            console.warn('[SwiftSnippets] Read JS failed:', _e2?.message || _e2);
            readFailed = true;
          }
        }
        if (readFailed) {
          new Notice('[SwiftSnippets] ' + (_currentLang === 'zh' ? '读取文件失败，请检查控制台日志' : 'Failed to read file, check console for details'));
        }
        this._showEditForm(document.getElementById('ss-snippets-popup'), snippetName, content, editPath, rerender);
      });

      // 编辑(外部程序打开)
      mkItem(t('context.editExternal'), async () => {
        try {
          const snippetsDir = nodePath.join(this.app.vault.adapter.basePath, '.obsidian', 'snippets');
          let filePath = nodePath.join(snippetsDir, snippetName + '.css');
          if (!nodeFs.existsSync(filePath)) {
            filePath = nodePath.join(snippetsDir, snippetName + '.js');
          }
          if (nodeFs.existsSync(filePath)) {
            const { shell } = require('electron');
            await shell.openPath(filePath);
          } else {
            new Notice('File not found');
          }
        } catch (_e) { new Notice('Open failed'); }
      });

      // 删除
      mkItem(t('context.delete'), async () => {
        if (confirm(t('context.delete') + ' "' + snippetName + '"?')) {
          if (chipEnabled) {
            this._setSnippetEnabled(snippetName, false);
          }
          const snippetPath = '.obsidian/snippets/' + snippetName + '.css';
          const jsSnippetPath = '.obsidian/snippets/' + snippetName + '.js';
          let deleted = false;
          try { await this.app.vault.adapter.remove(snippetPath); deleted = true; } catch (_e) {}
          if (!deleted) { try { await this.app.vault.adapter.remove(jsSnippetPath); } catch (_e) {} }
          rerender();
        }
      });

      // 移入分组（子菜单）
      const groupNames = this.settings.groupOrder.filter(g => g !== currentGroup);
      if (groupNames.length > 0) {
        const moveItem = document.createElement('div');
        moveItem.textContent = t('context.moveToGroup') + ' ▸';
        moveItem.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:13px;color:var(--text-normal);position:relative;';
        moveItem.addEventListener('mouseenter', () => { moveItem.style.background = 'var(--background-modifier-hover)'; });
        moveItem.addEventListener('mouseleave', () => { moveItem.style.background = 'transparent'; });

        const subMenu = document.createElement('div');
        subMenu.style.cssText = `
          position:absolute;left:100%;top:0;
          background:rgba(var(--mono-rgb-0),0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
          border:1px solid var(--background-modifier-border);border-radius:6px;
          padding:4px 0;box-shadow:0 4px 16px rgba(0,0,0,0.25);min-width:100px;display:none;
        `;

        groupNames.forEach(gName => {
          const subItem = document.createElement('div');
          subItem.textContent = gName;
          subItem.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:13px;color:var(--text-normal);white-space:nowrap;';
          subItem.addEventListener('mouseenter', () => { subItem.style.background = 'var(--background-modifier-hover)'; });
          subItem.addEventListener('mouseleave', () => { subItem.style.background = 'transparent'; });
          subItem.addEventListener('click', async () => {
            menu.remove();
            await this._moveToGroup(snippetName, gName);
            rerender();
          });
          subMenu.appendChild(subItem);
        });

        moveItem.addEventListener('mouseenter', () => { subMenu.style.display = 'block'; });
        moveItem.addEventListener('mouseleave', () => { subMenu.style.display = 'none'; });
        moveItem.appendChild(subMenu);
        menu.appendChild(moveItem);
      }

      // 移出分组
      if (currentGroup) {
        if (currentGroup === '__bg__') {
          mkItem(t('context.delete'), async () => {
            if (confirm(t('context.delete') + ' "' + snippetName + '"?')) {
              if (chipEnabled) {
                this._setSnippetEnabled(snippetName, false);
              }
              const snippetPath = '.obsidian/snippets/' + snippetName + '.css';
              const jsSnippetPath = '.obsidian/snippets/' + snippetName + '.js';
              let deleted = false;
              try { await this.app.vault.adapter.remove(snippetPath); deleted = true; } catch (_e) {}
              if (!deleted) { try { await this.app.vault.adapter.remove(jsSnippetPath); } catch (_e) {} }
              const members = this.settings.groups[currentGroup];
              if (members) {
                const idx = members.indexOf(snippetName);
                if (idx !== -1) members.splice(idx, 1);
              }
              await this.saveSettings();
              rerender();
            }
          });
        } else {
          mkItem(t('context.removeFromGroup'), async () => {
            await this._removeFromGroup(snippetName);
            rerender();
          });
        }
      }

      document.body.appendChild(menu);
      const closeMenu = () => { if (document.body.contains(menu)) menu.remove(); document.removeEventListener('click', closeMenu); };
      setTimeout(() => document.addEventListener('click', closeMenu), 10);
    });

    // 拖拽
    chip.addEventListener('dragstart', (e) => {
      this._dragData = { snippetName, sourceGroup: currentGroup };
      chip.style.opacity = '0.4';
      e.dataTransfer.effectAllowed = 'move';
    });
    chip.addEventListener('dragend', () => {
      chip.style.opacity = '1';
      this._dragData = null;
    });
  }

  // ─── 添加 Snippet 表单 ──────────────────────────────────────────────────
  _showAddForm(popup, rerender) {
    const existingForm = popup.querySelector('.ss-form');
    if (existingForm) existingForm.remove();

    const form = popup.createDiv();
    form.className = 'ss-form';
    form.style.cssText = 'margin-top:10px;padding:10px;border:1px solid var(--background-modifier-border);border-radius:6px;background:rgba(var(--mono-rgb-0),0.4);';

    const titleInput = form.createEl('input', { type: 'text' });
    titleInput.placeholder = t('snippet.titlePlaceholder');
    titleInput.style.cssText = 'width:100%;padding:4px 6px;margin-bottom:6px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);';

    const contentInput = form.createEl('textarea');
    contentInput.placeholder = t('snippet.contentPlaceholder');
    contentInput.style.cssText = 'width:100%;height:100px;padding:4px 6px;border:1px solid var(--background-modifier-border);border-radius:4px;font-family:monospace;font-size:11px;resize:vertical;background:var(--background-primary);color:var(--text-normal);';

    const btnRow = form.createDiv();
    btnRow.style.cssText = 'display:flex;justify-content:flex-end;gap:6px;margin-top:6px;';

    const cancelBtn = btnRow.createEl('button', { text: t('btn.cancel') });
    cancelBtn.addEventListener('click', () => form.remove());

    const saveBtn = btnRow.createEl('button', { text: t('btn.save') });
    saveBtn.style.cssText = 'background:var(--interactive-accent);color:#fff;border:none;border-radius:4px;padding:4px 12px;cursor:pointer;';
    saveBtn.addEventListener('click', async () => {
      const title = titleInput.value.trim();
      const css = contentInput.value.trim();
      if (!title) return;
      try {
        await this.app.vault.adapter.write('.obsidian/snippets/' + title + '.css', css || '/* ' + title + ' */\n');
        this._setSnippetEnabled(title, true);
        new Notice(t('snippet.added'));
        form.remove();
        rerender();
      } catch (_e) {
        new Notice(t('snippet.addFailed'));
      }
    });

    setTimeout(() => titleInput.focus(), 50);
  }

  // ─── 编辑 Snippet 表单 ──────────────────────────────────────────────────
  _showEditForm(popup, snippetName, content, editPath, rerender) {
    const existingForm = popup.querySelector('.ss-form');
    if (existingForm) existingForm.remove();

    const form = popup.createDiv();
    form.className = 'ss-form';
    form.style.cssText = 'margin-top:10px;padding:10px;border:1px solid var(--background-modifier-border);border-radius:6px;background:rgba(var(--mono-rgb-0),0.4);';

    const titleInput = form.createEl('input', { type: 'text' });
    titleInput.value = snippetName;
    titleInput.style.cssText = 'width:100%;padding:4px 6px;margin-bottom:6px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);';

    const contentInput = form.createEl('textarea');
    contentInput.value = content;
    contentInput.style.cssText = 'width:100%;height:150px;padding:4px 6px;border:1px solid var(--background-modifier-border);border-radius:4px;font-family:monospace;font-size:11px;resize:vertical;background:var(--background-primary);color:var(--text-normal);';

    const btnRow = form.createDiv();
    btnRow.style.cssText = 'display:flex;justify-content:flex-end;gap:6px;margin-top:6px;';

    const cancelBtn = btnRow.createEl('button', { text: t('btn.cancel') });
    cancelBtn.addEventListener('click', () => form.remove());

    const saveBtn = btnRow.createEl('button', { text: t('btn.save') });
    saveBtn.style.cssText = 'background:var(--interactive-accent);color:#fff;border:none;border-radius:4px;padding:4px 12px;cursor:pointer;';
    saveBtn.addEventListener('click', async () => {
      const newTitle = titleInput.value.trim();
      const newContent = contentInput.value;
      if (!newTitle) return;
      try {
        if (newTitle !== snippetName) {
          await this.app.vault.adapter.remove(editPath);
          editPath = '.obsidian/snippets/' + newTitle + '.css';
        }
        await this.app.vault.adapter.write(editPath, newContent);
        form.remove();
        rerender();
      } catch (_e) { new Notice('Save failed'); }
    });

    setTimeout(() => titleInput.focus(), 50);
  }
}

module.exports = SwiftSwitchPlugin;
