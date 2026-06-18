const { Plugin, Notice } = require('obsidian');
const nodePath = require('path');
const nodeFs = require('fs');

// ─── i18n ────────────────────────────────────────────────────────────────────
let _currentLang = 'en';

const i18n = {
  zh: {
    'popup.title': '管理 CSS Snippets',
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
  },
  en: {
    'popup.title': 'Manage CSS Snippets',
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
class SwiftSnippetsPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    _currentLang = this.settings.language || 'en';

    this._statusBarEl = this.addStatusBarItem();
    this._statusBarEl.setText('SwiftSnippets');
    this._statusBarEl.title = t('popup.title');
    this._statusBarEl.style.cursor = 'pointer';
    this._statusBarEl.style.opacity = '0.8';
    this._statusBarEl.addEventListener('click', () => this.openSnippetsPopup());

    this.addCommand({
      id: 'open-snippets-popup',
      name: 'Open Snippets Manager',
      callback: () => this.openSnippetsPopup(),
    });
  }

  onunload() {
    const existing = document.getElementById('ss-snippets-popup');
    if (existing) existing.remove();
    const ov = document.getElementById('ss-snippets-overlay');
    if (ov) ov.remove();
  }

  async loadSettings() {
    const data = await this.loadData();
    this.settings = Object.assign({
      language: 'en',
      groups: {},          // { groupName: [snippetName, ...], ... }
      groupOrder: [],      // [groupName, ...] 维护分组顺序
      collapsedGroups: {}, // { groupName: true/false, ... }
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
  openSnippetsPopup() {
    const existing = document.getElementById('ss-snippets-popup');
    if (existing) { existing.remove(); const ov = document.getElementById('ss-snippets-overlay'); if (ov) ov.remove(); return; }

    const overlay = document.createElement('div');
    overlay.id = 'ss-snippets-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;';
    overlay.addEventListener('click', () => { popup.remove(); overlay.remove(); });

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
    requestAnimationFrame(() => {
      const w = popup.offsetWidth, h = popup.offsetHeight;
      popup.style.left = Math.round((window.innerWidth - w) / 2) + 'px';
      popup.style.top = Math.round((window.innerHeight - h) / 2) + 'px';
    });

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
      popup.remove(); overlay.remove();
      this.openSnippetsPopup();
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

    const closeBtn = header.createEl('span');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = 'cursor:pointer;font-size:16px;color:var(--text-muted);padding:2px 6px;';
    closeBtn.addEventListener('click', () => { popup.remove(); overlay.remove(); });

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
    document.addEventListener('mouseup', () => { isDraggingPopup = false; });

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
        position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
        background:rgba(var(--mono-rgb-0),0.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
        border:1px solid var(--background-modifier-border);border-radius:8px;
        box-shadow:0 8px 32px rgba(0,0,0,0.3);z-index:10003;
        padding:16px 20px;min-width:260px;
      `;

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

module.exports = SwiftSnippetsPlugin;
