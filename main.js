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
    'mode.dark': '深色',
    'mode.light': '浅色',
    'mode.switched': '模式已切换',
    'mode.switchFailed': '切换模式失败',
    'pull.hint': '拉一下切换模式',
    'eyeCare.section': '护眼色',
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
    'eyeCare.breathe': '呼吸',
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
    'mode.dark': 'Dark',
    'mode.light': 'Light',
    'mode.switched': 'Mode switched',
    'mode.switchFailed': 'Failed to switch mode',
    'pull.hint': 'Pull to switch mode',
    'eyeCare.section': 'Eye Care',
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
    'eyeCare.breathe': 'Breathe',
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
    this._statusBarEl.addEventListener('click', () => this.openSnippetsPopup());

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
    // 恢复护眼色
    if (this.settings.eyeCareColor) {
      this.applyEyeCareColor();
    }

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
    const existing = document.getElementById('ss-snippets-popup');
    if (existing) existing.remove();
    const ov = document.getElementById('ss-snippets-overlay');
    if (ov) ov.remove();
    const fb = document.getElementById('ss-floating-button');
    if (fb) fb.remove();
    const pc = document.getElementById('ss-pull-cord');
    if (pc) pc.remove();
    const styleEl = document.getElementById('ss-float-custom-style');
    if (styleEl) styleEl.remove();
    const eyeCareEl = document.getElementById('ss-eyecare-style');
    if (eyeCareEl) eyeCareEl.remove();
  }

  async loadSettings() {
    const data = await this.loadData();
    this.settings = Object.assign({
      language: 'en',
      groups: {},          // { groupName: [snippetName, ...], ... }
      groupOrder: [],      // [groupName, ...] 维护分组顺序
      collapsedGroups: {}, // { groupName: true/false, ... }
      floatingButton: null, // { text, css, position: {x, y} } or null
      eyeCareColor: '',     // preset key: '' | 'cream' | 'green' | 'yellow' | 'mint' | 'beige' | 'sepia'
      popupPosition: null,  // { left, top } or null
    }, data);
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  // ─── 读取 snippet 列表 ─────────────────────────────────────────────────
  async getSnippetInfo() {
    let enabledSnippets = [];
    try {
      const appearancePath = nodePath.join(this.app.vault.adapter.basePath, '.obsidian', 'appearance.json');
      const appearance = JSON.parse(nodeFs.readFileSync(appearancePath, 'utf-8'));
      enabledSnippets = appearance.enabledCssSnippets || [];
    } catch (_e) {
      try {
        const cc = this.app.customCss;
        if (cc && Array.isArray(cc.enabledCssSnippets)) {
          enabledSnippets = [...cc.enabledCssSnippets];
        }
      } catch (_e2) {
        enabledSnippets = [];
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
  async switchTheme(themeName) {
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
      new Notice(t('theme.switched') + (themeName ? '' : ' - ' + t('theme.restartRequired')));
    } catch (_e) {
      new Notice(t('theme.switchFailed'));
    }
  }

  // ─── 切换深浅模式 ──────────────────────────────────────────────────────
  async toggleMode() {
    try {
      const isDark = document.body.classList.contains('theme-dark');
      const appDataStr = await this.app.vault.adapter.read('.obsidian/appearance.json');
      const appData = JSON.parse(appDataStr);
      appData.baseTheme = isDark ? 'moonstone' : 'obsidian';
      await this.app.vault.adapter.write('.obsidian/appearance.json', JSON.stringify(appData, null, 2));
      // 实时切换
      if (this.app.customCss && typeof this.app.customCss.setMode === 'function') {
        this.app.customCss.setMode(isDark ? 'moonstone' : 'obsidian');
      } else {
        document.body.classList.toggle('theme-dark', !isDark);
        document.body.classList.toggle('theme-light', isDark);
      }
      new Notice(t('mode.switched'));
    } catch (_e) {
      new Notice(t('mode.switchFailed'));
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
      return;
    }
    const isDark = document.body.classList.contains('theme-dark');
    const presets = {
      cream:  { bg: '#faf6e9', bgSec: '#f5f0dc', bgMod: '#efe9d5', darkBg: '#2c2820', darkBgSec: '#332e24', darkBgMod: '#3a3428' },
      green: { bg: '#e8f5e9', bgSec: '#d5ecd7', bgMod: '#c8e6c9', darkBg: '#1e2e22', darkBgSec: '#243628', darkBgMod: '#2a3e2e' },
      yellow: { bg: '#fffde7', bgSec: '#fff9c4', bgMod: '#fff59d', darkBg: '#2e2c1e', darkBgSec: '#363424', darkBgMod: '#3e3c2a' },
      mint:  { bg: '#e0f2f1', bgSec: '#d0eceb', bgMod: '#b2dfdb', darkBg: '#1e2a29', darkBgSec: '#243230', darkBgMod: '#2a3a37' },
      beige: { bg: '#f5f0e8', bgSec: '#ebe5d9', bgMod: '#e0d9cc', darkBg: '#2a2620', darkBgSec: '#322e26', darkBgMod: '#3a362c' },
      sepia: { bg: '#f4ecd8', bgSec: '#ebe3c6', bgMod: '#ddd4b4', darkBg: '#2a2618', darkBgSec: '#322e20', darkBgMod: '#3a3628' },
    };
    const patterns = {
      linen:   { bg: '#f5f0e8', bgSec: '#ebe5d9', bgMod: '#e0d9cc', darkBg: '#2a2620', darkBgSec: '#322e26', darkBgMod: '#3a362c' },
      dot:     { bg: '#f0ece4', bgSec: '#e8e3d9', bgMod: '#ddd8ce', darkBg: '#28241e', darkBgSec: '#302c24', darkBgMod: '#38342a' },
      grid:    { bg: '#f5f2eb', bgSec: '#edeae3', bgMod: '#e2dfd8', darkBg: '#282620', darkBgSec: '#302e26', darkBgMod: '#38362c' },
      stripe:  { bg: '#f3efe6', bgSec: '#ebe7de', bgMod: '#e0dcd3', darkBg: '#282420', darkBgSec: '#302c26', darkBgMod: '#38342c' },
      aurora:  { bg: '#e8f0e8', bgSec: '#dce8dc', bgMod: '#d0ddd0', darkBg: '#1e2820', darkBgSec: '#243026', darkBgMod: '#2a382c' },
      breathe: { bg: '#eef5ee', bgSec: '#e2ece2', bgMod: '#d6e3d6', darkBg: '#1e2820', darkBgSec: '#243026', darkBgMod: '#2a382c' },
    };
    const p = presets[key];
    if (p) {
      const bg = isDark ? p.darkBg : p.bg;
      const bgSec = isDark ? p.darkBgSec : p.bgSec;
      const bgMod = isDark ? p.darkBgMod : p.bgMod;
      styleEl.textContent = `
        .workspace-leaf-content,
        .markdown-source-view,
        .markdown-preview-view {
          --background-primary: ${bg};
          --background-primary-alt: ${bgSec};
          --background-secondary: ${bgSec};
          --background-secondary-alt: ${bgMod};
          --background-modifier-border: ${bgMod};
          background: ${bg};
        }
        .markdown-source-view .cm-s-obsidian,
        .markdown-preview-view .markdown-reading-view {
          background: ${bg};
        }
      `;
      return;
    }
    const pt = patterns[key];
    if (!pt) { styleEl.textContent = ''; return; }
    const bg = isDark ? pt.darkBg : pt.bg;
    const bgSec = isDark ? pt.darkBgSec : pt.bgSec;
    const bgMod = isDark ? pt.darkBgMod : pt.bgMod;
    let patternCSS = '';
    if (key === 'linen') {
      const lineColor = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.015)';
      patternCSS = `background-image:
        repeating-linear-gradient(0deg, transparent, transparent 2px, ${lineColor} 2px, ${lineColor} 3px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, ${lineColor} 2px, ${lineColor} 3px);`;
    } else if (key === 'dot') {
      const dotColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
      patternCSS = `background-image: radial-gradient(circle, ${dotColor} 1px, transparent 1px);
        background-size: 12px 12px;`;
    } else if (key === 'grid') {
      const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
      patternCSS = `background-image:
        linear-gradient(${gridColor} 1px, transparent 1px),
        linear-gradient(90deg, ${gridColor} 1px, transparent 1px);
        background-size: 20px 20px;`;
    } else if (key === 'stripe') {
      const stripeColor = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.02)';
      patternCSS = `background-image: repeating-linear-gradient(
        -45deg, transparent, transparent 4px, ${stripeColor} 4px, ${stripeColor} 5px
      );`;
    } else if (key === 'aurora') {
      if (isDark) {
        patternCSS = `background-image:
          linear-gradient(135deg, rgba(80,180,130,0.12) 0%, transparent 50%),
          linear-gradient(225deg, rgba(80,130,200,0.12) 0%, transparent 50%),
          linear-gradient(315deg, rgba(150,80,190,0.08) 0%, transparent 50%);
          animation: ss-aurora 12s ease-in-out infinite;`;
      } else {
        patternCSS = `background-image:
          linear-gradient(135deg, rgba(100,200,150,0.18) 0%, transparent 50%),
          linear-gradient(225deg, rgba(100,150,220,0.18) 0%, transparent 50%),
          linear-gradient(315deg, rgba(170,100,210,0.12) 0%, transparent 50%);
          animation: ss-aurora 12s ease-in-out infinite;`;
      }
    } else if (key === 'breathe') {
      if (isDark) {
        patternCSS = `background-image: radial-gradient(ellipse at 50% 50%, rgba(80,180,130,0.15) 0%, transparent 70%);
          animation: ss-breathe 5s ease-in-out infinite;`;
      } else {
        patternCSS = `background-image: radial-gradient(ellipse at 50% 50%, rgba(100,200,150,0.22) 0%, transparent 70%);
          animation: ss-breathe 5s ease-in-out infinite;`;
      }
    }
    let animCSS = '';
    if (key === 'aurora') {
      animCSS = `
        @keyframes ss-aurora {
          0%, 100% { background-position: 0% 0%; }
          33% { background-position: 30% 20%; }
          66% { background-position: -20% 30%; }
        }
      `;
    } else if (key === 'breathe') {
      animCSS = `
        @keyframes ss-breathe {
          0%, 100% { background-size: 80% 80%; opacity: 0.7; }
          50% { background-size: 140% 140%; opacity: 1; }
        }
      `;
    }
    styleEl.textContent = `
      ${animCSS}
      .workspace-leaf-content,
      .markdown-source-view,
      .markdown-preview-view {
        --background-primary: ${bg};
        --background-primary-alt: ${bgSec};
        --background-secondary: ${bgSec};
        --background-secondary-alt: ${bgMod};
        --background-modifier-border: ${bgMod};
        background-color: ${bg};
        ${patternCSS}
      }
      .markdown-source-view .cm-s-obsidian,
      .markdown-preview-view .markdown-reading-view {
        background-color: ${bg};
        ${patternCSS}
      }
    `;
  }

  // ─── 护眼色预设列表 ──────────────────────────────────────────────────
  _eyeCarePresets() {
    return [
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
      { key: 'breathe',color: '#eef5ee', darkColor: '#1e2820', label: t('eyeCare.breathe'),pattern: 'breathe' },
    ];
  }

  // ─── 悬浮按钮 ────────────────────────────────────────────────────────
  createFloatingButton() {
    const existing = document.getElementById('ss-floating-button');
    if (existing) existing.remove();

    // 移除旧的自定义样式
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

    // 滚轮：普通切换主题，Ctrl/Shift切换护眼色
    btn.addEventListener('wheel', async (e) => {
      e.preventDefault();
      if (e.ctrlKey || e.shiftKey) {
        // Ctrl/Shift+滚轮：切换护眼色
        const presets = this._eyeCarePresets();
        const currentKey = this.settings.eyeCareColor || '';
        const idx = presets.findIndex(p => p.key === currentKey);
        let nextIdx;
        if (e.deltaY > 0) {
          nextIdx = idx < presets.length - 1 ? idx + 1 : 0;
        } else {
          nextIdx = idx > 0 ? idx - 1 : presets.length - 1;
        }
        this.settings.eyeCareColor = presets[nextIdx].key;
        this.applyEyeCareColor();
        this.saveSettings();
        new Notice(presets[nextIdx].label);
      } else {
        // 普通滚轮：切换主题
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
      }
    });

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
      }
      setTimeout(() => { isDragging = false; }, 50);
    };

    // 左键点击打开管理面板
    btn.addEventListener('click', () => {
      if (!isDragging) this.openSnippetsPopup();
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

    document.addEventListener('mousemove', (e) => {
      if (!pullCordDragging) return;
      const dy = e.clientY - pullStartY;
      const newHeight = Math.max(10, cordBaseHeight + dy);
      cord.style.height = newHeight + 'px';
      // 拉得越远，拉手越大
      const scale = 1 + Math.min(dy / pullThreshold, 0.5);
      pullKnob.style.transform = `scale(${scale})`;
      pullKnob.style.boxShadow = dy > pullThreshold * 0.6
        ? '0 2px 8px rgba(0,0,0,0.5), 0 0 6px var(--interactive-accent)'
        : '0 1px 3px rgba(0,0,0,0.3)';
    });

    document.addEventListener('mouseup', async (e) => {
      if (!pullCordDragging) return;
      pullCordDragging = false;
      const dy = e.clientY - pullStartY;
      cord.style.transition = 'height 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), all 0.15s ease';
      pullKnob.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), all 0.15s ease';

      if (dy > pullThreshold) {
        // 触发切换！回弹动画
        cord.style.height = cordBaseHeight + 'px';
        pullKnob.style.transform = 'scale(1)';
        pullKnob.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
        // 闪烁效果
        pullKnob.style.background = 'radial-gradient(circle at 35% 35%, var(--interactive-accent), var(--text-muted))';
        setTimeout(() => {
          pullKnob.style.background = 'radial-gradient(circle at 35% 35%, var(--text-normal), var(--text-muted))';
        }, 400);
        await this.toggleMode();
      } else {
        // 回弹
        cord.style.height = cordBaseHeight + 'px';
        pullKnob.style.transform = 'scale(1)';
        pullKnob.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
      }
    });

    document.body.appendChild(btn);
    document.body.appendChild(pullCord);
    // 初始定位
    requestAnimationFrame(positionPullCord);
    // 窗口大小变化时更新位置
    const resizeHandler = () => positionPullCord();
    window.addEventListener('resize', resizeHandler);
    // 存储以便清理
    btn._ssResizeHandler = resizeHandler;
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

  // ─── 切换 snippet ──────────────────────────────────────────────────────
  async toggleSnippet(snippetName, enable) {
    const cc = this.app.customCss;
    if (cc && typeof cc.setCssEnabledStatus === 'function') {
      cc.setCssEnabledStatus(snippetName, enable);
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
    if (existing) { existing.remove(); const ov = document.getElementById('ss-snippets-overlay'); if (ov) ov.remove(); return; }

    const overlay = document.createElement('div');
    overlay.id = 'ss-snippets-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;';
    overlay.addEventListener('click', () => {
      this.settings.popupPosition = { left: popup.style.left, top: popup.style.top };
      this.saveSettings();
      popup.remove(); overlay.remove();
    });

    const popup = document.createElement('div');
    popup.id = 'ss-snippets-popup';
    popup.style.cssText = `
      position:fixed;
      background:rgba(var(--mono-rgb-0),0.75);backdrop-filter:blur(16px) saturate(180%);-webkit-backdrop-filter:blur(16px) saturate(180%);
      border:1px solid rgba(255,255,255,0.12);border-radius:12px;
      box-shadow:0 12px 40px rgba(0,0,0,0.35);z-index:10000;
      padding:16px 20px;min-width:360px;max-width:560px;max-height:75vh;overflow-y:auto;
    `;
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
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;cursor:move;';

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
      popup.remove(); overlay.remove();
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
     versionTag.textContent = 'v1.0.2';
    versionTag.style.cssText = 'font-size:10px;color:var(--text-faint);margin-left:2px;align-self:flex-end;margin-bottom:2px;';

    const pinBtn = leftHeader.createEl('span');
    pinBtn.textContent = '📌';
    pinBtn.style.cssText = 'cursor:pointer;font-size:14px;opacity:0.7;transition:opacity 0.15s ease;';
    pinBtn.title = t('float.edit');
    pinBtn.addEventListener('mouseenter', () => { pinBtn.style.opacity = '1'; });
    pinBtn.addEventListener('mouseleave', () => { pinBtn.style.opacity = '0.7'; });
    pinBtn.addEventListener('click', () => {
      if (!this.settings.floatingButton) {
        this.settings.floatingButton = {
          text: t('float.defaultText'),
          css: '',
          position: { x: window.innerWidth - 80, y: 100 },
        };
        this.saveSettings();
      }
      this.createFloatingButton();
    });

    const closeBtn = header.createEl('span');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = 'cursor:pointer;font-size:16px;color:var(--text-muted);padding:2px 6px;';
    closeBtn.addEventListener('click', () => {
      this.settings.popupPosition = { left: popup.style.left, top: popup.style.top };
      this.saveSettings();
      popup.remove(); overlay.remove();
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

      // 主题标签行 + 深浅模式开关
      const themeHeaderRow = themeArea.createDiv();
      themeHeaderRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;';

      const themeLabel = themeHeaderRow.createEl('div', { text: t('theme.section') });
      themeLabel.style.cssText = 'font-size:12px;font-weight:600;color:var(--text-normal);';

      // 深浅模式切换开关
      const isDark = document.body.classList.contains('theme-dark');
      const modeSwitch = themeHeaderRow.createDiv();
      modeSwitch.style.cssText = `
        display:flex;align-items:center;gap:4px;cursor:pointer;user-select:none;
        padding:2px 8px;border-radius:10px;font-size:11px;
        border:1px solid var(--background-modifier-border);
        background:rgba(var(--mono-rgb-0),0.5);
        transition:all 0.2s ease;
      `;
      const modeIcon = modeSwitch.createEl('span');
      modeIcon.textContent = isDark ? '🌙' : '☀️';
      modeIcon.style.cssText = 'font-size:12px;transition:transform 0.3s ease;';
      const modeText = modeSwitch.createEl('span');
      modeText.textContent = isDark ? t('mode.dark') : t('mode.light');
      modeText.style.cssText = 'color:var(--text-muted);';
      modeSwitch.addEventListener('click', async () => {
        modeIcon.style.transform = 'rotate(360deg)';
        await this.toggleMode();
        renderThemes();
      });
      modeSwitch.addEventListener('mouseenter', () => {
        modeSwitch.style.borderColor = 'var(--interactive-accent)';
      });
      modeSwitch.addEventListener('mouseleave', () => {
        modeSwitch.style.borderColor = 'var(--background-modifier-border)';
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

    // ── 护眼色 chips ──────────────────────────────────────────────────
    const eyeCareArea = popup.createDiv();
    eyeCareArea.style.cssText = 'margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--background-modifier-border);';

    const renderEyeCare = () => {
      eyeCareArea.empty();
      const currentKey = this.settings.eyeCareColor || '';

      const label = eyeCareArea.createEl('div', { text: t('eyeCare.section') });
      label.style.cssText = 'font-size:12px;font-weight:600;color:var(--text-normal);margin-bottom:6px;';

      const chipsRow = eyeCareArea.createDiv();
      chipsRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;';

      const presets = this._eyeCarePresets();
      const isDarkChip = document.body.classList.contains('theme-dark');
      presets.forEach(p => {
        const chip = chipsRow.createEl('span');
        const isActive = currentKey === p.key;
        chip.style.cssText = `
          display:inline-flex;align-items:center;gap:4px;
          padding:3px 8px;border-radius:14px;font-size:11px;cursor:pointer;
          user-select:none;transition:all 0.15s ease;
          border:1px solid ${isActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
          background:${isActive ? 'var(--interactive-accent)' : 'rgba(var(--mono-rgb-0),0.5)'};
          color:${isActive ? '#fff' : 'var(--text-muted)'};
        `;
        const dotColor = isDarkChip ? (p.darkColor || p.color) : p.color;
        const dotBorder = isDarkChip ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
        const dot = chip.createEl('span');
        if (p.pattern === 'linen') {
          const lc = isDarkChip ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
          dot.style.cssText = `display:inline-block;width:10px;height:10px;border-radius:2px;background:${dotColor};border:1px solid ${dotBorder};flex-shrink:0;background-image:repeating-linear-gradient(0deg,transparent,transparent 2px,${lc} 2px,${lc} 3px),repeating-linear-gradient(90deg,transparent,transparent 2px,${lc} 2px,${lc} 3px);`;
        } else if (p.pattern === 'dot') {
          const dc = isDarkChip ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)';
          dot.style.cssText = `display:inline-block;width:10px;height:10px;border-radius:2px;background:${dotColor};border:1px solid ${dotBorder};flex-shrink:0;background-image:radial-gradient(circle,${dc} 1px,transparent 1px);background-size:4px 4px;`;
        } else if (p.pattern === 'grid') {
          const gc = isDarkChip ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
          dot.style.cssText = `display:inline-block;width:10px;height:10px;border-radius:2px;background:${dotColor};border:1px solid ${dotBorder};flex-shrink:0;background-image:linear-gradient(${gc} 1px,transparent 1px),linear-gradient(90deg,${gc} 1px,transparent 1px);background-size:4px 4px;`;
        } else if (p.pattern === 'stripe') {
          const sc = isDarkChip ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
          dot.style.cssText = `display:inline-block;width:10px;height:10px;border-radius:2px;background:${dotColor};border:1px solid ${dotBorder};flex-shrink:0;background-image:repeating-linear-gradient(-45deg,transparent,transparent 2px,${sc} 2px,${sc} 2.5px);`;
        } else if (p.pattern === 'aurora') {
          if (isDarkChip) {
            dot.style.cssText = `display:inline-block;width:10px;height:10px;border-radius:2px;background:linear-gradient(135deg,rgba(80,180,130,0.35),rgba(80,130,200,0.35),rgba(150,80,190,0.25));border:1px solid ${dotBorder};flex-shrink:0;`;
          } else {
            dot.style.cssText = `display:inline-block;width:10px;height:10px;border-radius:2px;background:linear-gradient(135deg,rgba(100,200,150,0.3),rgba(100,150,200,0.3),rgba(150,100,200,0.2));border:1px solid ${dotBorder};flex-shrink:0;`;
          }
        } else if (p.pattern === 'breathe') {
          if (isDarkChip) {
            dot.style.cssText = `display:inline-block;width:10px;height:10px;border-radius:2px;background:radial-gradient(ellipse at 50% 50%,rgba(80,180,130,0.5),transparent);border:1px solid ${dotBorder};flex-shrink:0;animation:ss-dot-breathe 2s ease-in-out infinite;`;
          } else {
            dot.style.cssText = `display:inline-block;width:10px;height:10px;border-radius:2px;background:radial-gradient(ellipse at 50% 50%,rgba(100,180,130,0.4),transparent);border:1px solid ${dotBorder};flex-shrink:0;animation:ss-dot-breathe 2s ease-in-out infinite;`;
          }
        } else {
          dot.style.cssText = `display:inline-block;width:10px;height:10px;border-radius:50%;background:${dotColor};border:1px solid ${dotBorder};flex-shrink:0;`;
        }
        chip.createEl('span', { text: p.label });
        chip.addEventListener('click', async () => {
          this.settings.eyeCareColor = p.key;
          this.applyEyeCareColor();
          await this.saveSettings();
          renderEyeCare();
        });
      });
    };

    renderEyeCare();

    // ── 内容区域 ──────────────────────────────────────────────────────
    const contentArea = popup.createDiv();
    contentArea.style.cssText = 'min-height:60px;';

    // 拖拽状态（使用实例属性，避免闭包传值问题）
    this._dragData = null;

    const renderContent = async () => {
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
      const orderedGroups = this.settings.groupOrder.filter(g => this.settings.groups[g]);

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
      animStyle.textContent = `@keyframes ss-dot-breathe{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}`;
      document.head.appendChild(animStyle);
    }

    document.body.appendChild(overlay);
    document.body.appendChild(popup);
  }

  // ─── 简易输入弹窗（替代 prompt）─────────────────────────────────────────
  _promptGroupName(defaultValue) {
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

      const label = dialog.createEl('div', { text: t('group.add') });
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

    const applyStyle = (en) => {
      chip.style.cssText = `
        display:inline-block;padding:3px 10px;border-radius:14px;font-size:12px;cursor:pointer;
        user-select:none;transition:all 0.15s ease;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
        border:1px solid ${en ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
        background:${en ? 'var(--interactive-accent)' : 'rgba(var(--mono-rgb-0),0.5)'};
        color:${en ? '#fff' : 'var(--text-muted)'};
      `;
      chip.title = snippetName + (en ? ' (' + t('snippet.enabled') + ')' : ' (' + t('snippet.disabled') + ')');
    };
    applyStyle(isEnabled);

    let chipEnabled = isEnabled;
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      const cc = this.app.customCss;
      if (cc && typeof cc.setCssEnabledStatus === 'function') {
        cc.setCssEnabledStatus(snippetName, !chipEnabled);
      } else {
        this.toggleSnippet(snippetName, !chipEnabled);
      }
      chipEnabled = !chipEnabled;
      applyStyle(chipEnabled);
      new Notice(snippetName + ' ' + t('snippet.toggled'));
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
        try {
          const cssPath = '.obsidian/snippets/' + snippetName + '.css';
          const jsPath = '.obsidian/snippets/' + snippetName + '.js';
          let content = '', editPath = cssPath;
          try { content = await this.app.vault.adapter.read(cssPath); } catch (_e) {
            try { content = await this.app.vault.adapter.read(jsPath); editPath = jsPath; } catch (_e2) {}
          }
          this._showEditForm(document.getElementById('ss-snippets-popup'), snippetName, content, editPath, rerender);
        } catch (_e) { new Notice('Read failed'); }
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
          const cc = this.app.customCss;
          if (chipEnabled && cc && typeof cc.setCssEnabledStatus === 'function') {
            cc.setCssEnabledStatus(snippetName, false);
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
        mkItem(t('context.removeFromGroup'), async () => {
          await this._removeFromGroup(snippetName);
          rerender();
        });
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
        const cc = this.app.customCss;
        if (cc && typeof cc.setCssEnabledStatus === 'function') {
          cc.setCssEnabledStatus(title, true);
        }
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
