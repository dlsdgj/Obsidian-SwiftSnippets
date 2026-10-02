const { Plugin, Notice, Platform } = require('obsidian');
const isMobile = Platform.isMobile;
const nodePath = isMobile ? null : require('path');
const nodeFs = isMobile ? null : require('fs');

function _joinPath(...parts) {
  if (nodePath) return nodePath.join(...parts);
  return parts.join('/');
}

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
    'theme.delete': '删除主题',
    'theme.deleteConfirm': '确定删除主题「{0}」？',
    'theme.deleted': '主题已删除',
    'theme.deleteFailed': '删除主题失败',
    'theme.activeDeleteHint': '当前正在使用此主题，删除后将切换为默认主题',
    'theme.setAsDefault': '设为新页面默认',
    'theme.setAsDefaultDone': '已设为新页面默认主题',
    'theme.clearDefault': '取消新页面默认主题',
    'theme.clearDefaultDone': '已取消新页面默认主题',
    'eyeCare.setAsDefault': '设为新页面默认',
    'eyeCare.setAsDefaultDone': '已设为新页面默认背景',
    'eyeCare.clearDefault': '取消新页面默认背景',
    'eyeCare.clearDefaultDone': '已取消新页面默认背景',
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
    'eyeCare.lavender': '淡紫',
    'eyeCare.rose': '玫瑰',
    'eyeCare.sky': '天蓝',
    'eyeCare.sand': '沙色',
    'eyeCare.sage': '鼠尾草',
    'eyeCare.blush': '腮红',
    'eyeCare.ivory': '象牙',
    'eyeCare.fog': '雾灰',
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
    'eyeCare.imgStretch': '拉伸',
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
    'eyeCare.addColor': '添加',
    'eyeCare.addColorTitle': '添加背景色',
    'eyeCare.addColorPlaceholder': '输入颜色值(如 #ff6600)',
    'eyeCare.addColorDone': '背景色已添加',
    'eyeCare.addColorInvalid': '无效的颜色值',
    'theme.defaultMode': '新页面默认为:深/浅',
    'eyeCare.defaultMode': '新页面默认为:深/浅',
    'settings.defaultBgMode': '新页面默认深/浅模式',
    'settings.modeNone': '不切换',
    'settings.modeDark': '深色',
    'settings.modeLight': '浅色',
    'settings.title': '设置',
    'settings.autoBgByName': '打开文档时使用同名图片作背景',
    'settings.tabHeaderWheelTheme': '标签页标题栏滚轮切换主题',
    'settings.wheelGroups': '悬浮按钮滚轮切换分组',
    'settings.wheelGroupsHint': '勾选普通滚轮循环切换的分组',
    'settings.chipHoverHint': 'Chip 悬停提示',
    'settings.hoverPreview': '悬停预览',
    'settings.hoverDelay': '悬停延时(ms)',
    'preset.section': '组合',
    'preset.saveCurrent': '保存当前',
    'preset.empty': '暂无组合',
    'preset.namePrompt': '组合名称',
    'preset.applied': '已应用组合',
    'preset.saved': '组合已保存',
    'preset.deleted': '组合已删除',
    'preset.overwrite': '覆盖更新',
    'preset.rename': '重命名',
    'preset.delete': '删除',
    'preset.deleteConfirm': '确定删除组合「{0}」？',
    'preset.overwriteConfirm': '确定用当前风格覆盖组合「{0}」？',
    'navBox.appearance': '外观',
    'navBox.snippets': 'Snippets',
    'navBox.system': '系统',
    'navBox.addBox': '新建分区',
    'navBox.titlePrompt': '分区标题',
    'navBox.deleteBox': '删除分区',
    'navBox.deleteConfirm': '确定删除分区「{0}」？其中的项目将移回默认分区。',
    'navBox.untitled': '未命名',
    'styleMemory.chip': '记忆模式',
    'styleMemory.hint': '记忆模式：记住每个页面的风格，切换时自动恢复',
    'styleMemory.on': '记忆模式已开启',
    'styleMemory.off': '记忆模式已关闭',
    'styleMemory.saved': '页面风格已记忆',
    'styleMemory.restored': '已恢复页面风格',
    'styleMemory.restoreFailed': '恢复页面风格失败',
    'memory.section': '记忆',
    'memory.hint': '各标签页记忆的风格列表',
    'memory.empty': '暂无已记忆的页面',
    'memory.current': '当前',
    'memory.forget': '遗忘',
    'memory.forgetAll': '全部遗忘',
    'memory.forgetDone': '已遗忘该页面风格',
    'memory.forgetAllConfirm': '确定清空所有页面的记忆风格？',
    'memory.forgetAllDone': '已清空全部记忆',
    'memory.searchPlaceholder': '搜索标签页 / 路径',
    'memory.noTheme': '默认',
    'memory.usedBy': '被 {0} 个标签页记住',
    'memory.usedByOne': '被 1 个标签页记住',
    'memory.forgetPage': '遗忘此页面的记忆',
    'memory.invalid': '失效',
    'memory.cleanInvalid': '清空失效项',
    'memory.cleanInvalidDone': '已清空失效项',
    'group.exclusive': '互斥分组',
    'group.exclusive.on': '已设为互斥分组',
    'group.exclusive.off': '已取消互斥分组',
    'group.exclusive.hint': '互斥分组中的 Snippet 不能同时开启',
    'font.section': '字体',
    'font.clickToLoad': '点击加载字体',
    'font.loading': '加载中...',
    'font.color': '颜色',
    'font.opacity': '透明度',
    'font.lineHeight': '行间距',
    'font.marginL': '左边距',
    'font.marginR': '右边距',
    'font.reset': '重置',
    'font.applied': '字体已应用',
    'font.resetDone': '字体已重置',
    'font.noFonts': '未找到系统字体',
    'font.default': '默认字体',
    'font.enabled': '启用',
    'font.disabled': '禁用',
    'font.barChip': 'f',
    'font.barTitle': '字体管理',
    'font.barEdit': '编辑',
    'font.barEditTitle': '编辑字体按钮',
    'font.barEditText': '按钮文字',
    'font.barEditStyle': '按钮样式 (CSS)',
    'font.barDefaultText': 'f',
    'font.noFavorites': '暂无收藏字体',
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
    'theme.delete': 'Delete Theme',
    'theme.deleteConfirm': 'Delete theme "{0}"?',
    'theme.deleted': 'Theme deleted',
    'theme.deleteFailed': 'Failed to delete theme',
    'theme.activeDeleteHint': 'This theme is currently active. It will switch to default after deletion.',
    'theme.setAsDefault': 'Set as default for new pages',
    'theme.setAsDefaultDone': 'Set as default theme for new pages',
    'theme.clearDefault': 'Clear default theme for new pages',
    'theme.clearDefaultDone': 'Cleared default theme for new pages',
    'eyeCare.setAsDefault': 'Set as default for new pages',
    'eyeCare.setAsDefaultDone': 'Set as default background for new pages',
    'eyeCare.clearDefault': 'Clear default background for new pages',
    'eyeCare.clearDefaultDone': 'Cleared default background for new pages',
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
    'eyeCare.section': 'bg',
    'eyeCare.default': 'Default',
    'eyeCare.cream': 'Cream',
    'eyeCare.green': 'Green',
    'eyeCare.yellow': 'Warm',
    'eyeCare.mint': 'Mint',
    'eyeCare.beige': 'Beige',
    'eyeCare.sepia': 'Sepia',
    'eyeCare.lavender': 'Lavender',
    'eyeCare.rose': 'Rose',
    'eyeCare.sky': 'Sky',
    'eyeCare.sand': 'Sand',
    'eyeCare.sage': 'Sage',
    'eyeCare.blush': 'Blush',
    'eyeCare.ivory': 'Ivory',
    'eyeCare.fog': 'Fog',
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
    'eyeCare.imgStretch': 'Stretch',
    'eyeCare.imgTitle': 'image',
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
    'eyeCare.addColor': 'Add',
    'eyeCare.addColorTitle': 'Add Background Color',
    'eyeCare.addColorPlaceholder': 'Enter color (e.g. #ff6600)',
    'eyeCare.addColorDone': 'Background color added',
    'eyeCare.addColorInvalid': 'Invalid color value',
    'theme.defaultMode': 'Default mode for new pages: dark/light',
    'eyeCare.defaultMode': 'Default mode for new pages: dark/light',
    'settings.defaultBgMode': 'Default dark/light mode for new pages',
    'settings.modeNone': 'No switch',
    'settings.modeDark': 'Dark',
    'settings.modeLight': 'Light',
    'settings.title': 'Settings',
    'settings.autoBgByName': 'Use same-name image as background on document open',
    'settings.tabHeaderWheelTheme': 'Wheel on tab header to switch theme',
    'settings.wheelGroups': 'Wheel Switch Groups',
    'settings.wheelGroupsHint': 'Select groups to cycle through with wheel',
    'settings.chipHoverHint': 'Chip Hover Hint',
    'settings.hoverPreview': 'Hover Preview',
    'settings.hoverDelay': 'Hover Delay (ms)',
    'preset.section': 'Presets',
    'preset.saveCurrent': 'Save Current',
    'preset.empty': 'No presets',
    'preset.namePrompt': 'Preset name',
    'preset.applied': 'Preset applied',
    'preset.saved': 'Preset saved',
    'preset.deleted': 'Preset deleted',
    'preset.overwrite': 'Overwrite',
    'preset.rename': 'Rename',
    'preset.delete': 'Delete',
    'preset.deleteConfirm': 'Delete preset "{0}"?',
    'preset.overwriteConfirm': 'Overwrite preset "{0}" with current style?',
    'navBox.appearance': 'Appearance',
    'navBox.snippets': 'Snippets',
    'navBox.system': 'System',
    'navBox.addBox': 'New section',
    'navBox.titlePrompt': 'Section title',
    'navBox.deleteBox': 'Delete section',
    'navBox.deleteConfirm': 'Delete section "{0}"? Items will move back to default section.',
    'navBox.untitled': 'Untitled',
    'styleMemory.chip': 'Memory Mode',
    'styleMemory.hint': 'Memory mode: remember each page style, auto-restore on switch',
    'styleMemory.on': 'Memory mode on',
    'styleMemory.off': 'Memory mode off',
    'styleMemory.saved': 'Page style saved',
    'styleMemory.restored': 'Page style restored',
    'styleMemory.restoreFailed': 'Failed to restore page style',
    'memory.section': 'Memory',
    'memory.hint': 'Remembered styles per tab',
    'memory.empty': 'No remembered pages',
    'memory.current': 'Current',
    'memory.forget': 'Forget',
    'memory.forgetAll': 'Forget All',
    'memory.forgetDone': 'Page style forgotten',
    'memory.forgetAllConfirm': 'Clear all remembered page styles?',
    'memory.forgetAllDone': 'All memories cleared',
    'memory.searchPlaceholder': 'Search tab / path',
    'memory.noTheme': 'Default',
    'memory.usedBy': 'Remembered by {0} tabs',
    'memory.usedByOne': 'Remembered by 1 tab',
    'memory.forgetPage': 'Forget this page style',
    'memory.invalid': 'Invalid',
    'memory.cleanInvalid': 'Clean invalid',
    'memory.cleanInvalidDone': 'Invalid entries cleaned',
    'group.exclusive': 'Exclusive Group',
    'group.exclusive.on': 'Set as exclusive group',
    'group.exclusive.off': 'Exclusive group removed',
    'group.exclusive.hint': 'Snippets in exclusive group cannot be enabled simultaneously',
    'font.section': 'Font',
    'font.clickToLoad': 'Click to load fonts',
    'font.loading': 'Loading...',
    'font.color': 'Color',
    'font.opacity': 'Opacity',
    'font.lineHeight': 'Line Height',
    'font.marginL': 'Margin Left',
    'font.marginR': 'Margin Right',
    'font.reset': 'Reset',
    'font.applied': 'Font applied',
    'font.resetDone': 'Font reset',
    'font.noFonts': 'No system fonts found',
    'font.default': 'Default',
    'font.enabled': 'On',
    'font.disabled': 'Off',
    'font.barChip': 'f',
    'font.barTitle': 'Font Manager',
    'font.barEdit': 'Edit',
    'font.barEditTitle': 'Edit Font Button',
    'font.barEditText': 'Button Text',
    'font.barEditStyle': 'Button Style (CSS)',
    'font.barDefaultText': 'f',
    'font.noFavorites': 'No favorite fonts',
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
      await this._wheelSwitchTheme(e.deltaY > 0);
    });

    // 标签页标题栏滚轮切换主题
    this.registerDomEvent(document, 'wheel', (e) => {
      if (!this.settings.tabHeaderWheelTheme) return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      const tabHeader = target.closest('.workspace-tab-header, .workspace-tab-header-container, .workspace-tab-header-inner');
      if (!tabHeader) return;
      if (target.closest('#ss-snippets-popup, .ss-floating-button, .modal, .modal-bg')) return;
      e.preventDefault();
      this._showThemeWheelPopup(e.clientX, e.clientY, e.deltaY > 0);
    }, { passive: false });

    this.addCommand({
      id: 'open-snippets-popup',
      name: isMobile ? 'SwiftSwitch: 背景与外观' : 'Open Snippets Manager',
      callback: () => this.openSnippetsPopup(),
    });

    // 手机端：左侧栏 ribbon 图标
    if (isMobile) {
      this.addRibbonIcon('palette', 'SwiftSwitch', () => this.openSnippetsPopup());
    }

    // 恢复悬浮按钮（手机端跳过）
    if (!isMobile && this.settings.floatingButton) {
      this.createFloatingButton();
    }
    // 恢复护眼色
    if (this.settings.eyeCareColor) {
      this.applyEyeCareColor();
    }

    // 字体功能
    if (this.settings.activeFont || this.settings.fontColor || this.settings.fontLineHeight || (this.settings.fontOpacity ?? 1) < 1 || (this.settings.fontMarginL ?? 0) !== 0 || (this.settings.fontMarginR ?? 0) !== 0) {
      this.applyFontSettings();
    }

    if (!isMobile && this.settings.fontBarButton) {
      this._createFontBarButton();
    }

    // 延迟到空闲时执行，不阻塞启动
    requestIdleCallback(() => {
      this._syncPicFolder();
      this._exportEyeCareSnippets();
      if (!isMobile) setTimeout(() => this.getSystemFonts(), 1000);
    });

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
      if (this.settings.autoBgByName && newPath) {
        await this._applyAutoBgByName(newPath);
      }
      if (!this.settings.styleMemory && !this.settings.autoBgByName && newPath) {
        await this._applyDefaultBackground();
      }
      // 兜底：延迟重新应用背景，避免 Obsidian 切换页面时重渲染覆盖注入的 CSS
      setTimeout(() => { this.applyEyeCareColor(); }, 150);
      const popup = document.getElementById('ss-snippets-popup');
      if (popup && popup._ssRenderContent) {
        await new Promise(r => setTimeout(r, 200));

        popup._ssRenderContent();
      }
    }));

    // 启动时恢复当前页面的记忆风格
    if (this.settings.styleMemory && this._lastFilePath) {
      this._restorePageStyle(this._lastFilePath);
    }
    if (this.settings.autoBgByName && this._lastFilePath) {
      this._applyAutoBgByName(this._lastFilePath);
    }

    // 监听深浅模式切换，自动重新应用护眼色和字体颜色
    this._modeObserver = new MutationObserver(() => {
      if (this.settings.eyeCareColor) {
        this.applyEyeCareColor();
      }
      if (!isMobile && this.settings.floatingButton) {
        this.createFloatingButton();
      }
      if (this.settings.fontColor || this.settings.activeFont) {
        this.applyFontSettings();
      }
    });
    this._modeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  onunload() {
    if (this.settings.styleMemory && this._lastFilePath) {
      this._savePageStyle(this._lastFilePath);
    }
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
    this._removeFontBarButton();
  }

  async loadSettings() {
    const data = await this.loadData();
    this.settings = Object.assign({
      language: 'en',
      groups: {},          // { groupName: [snippetName, ...], ... }
      groupOrder: [],      // [groupName, ...] 维护分组顺序
      navOrder: [],        // [itemId, ...] nav 项统一顺序（含 theme/分组名/__ungrouped__/bg/font）
      collapsedGroups: {}, // { groupName: true/false, ... }
      floatingButton: null, // { text, css, position: {x, y} } or null
      statusBarButton: null, // { text, css } or null
      eyeCareColor: '',     // preset key: '' | 'cream' | 'green' | 'yellow' | 'mint' | 'beige' | 'sepia' | '__img_0' | '__img_1' ...
      bgImages: [],         // [{ type: 'local', url: '...', label: '...', opacity: 0.3 }, ...]
      customBgColors: [],   // ['#ff6600', ...] 用户自定义背景色
      popupPosition: null,  // { left, top } or null
      popupSize: null,      // { width, height } or null
      styleMemory: false,   // 记忆模式开关
      pageStyles: {},       // { filePath: { theme, isDark, eyeCareColor, enabledSnippets } }
      exclusiveGroups: ['标题'], // 互斥分组名列表，同组 snippet 不能同时开启
      deletedPresets: [],        // 用户删除的预设 key，不再自动重建
      fontFavorites: [],         // 收藏的字体名列表
      activeFont: '',            // 当前应用的字体名
      fontColor: '',             // 字体颜色（空=默认）
      fontOpacity: 1,            // 字体透明度 0~1
      fontLineHeight: 0,         // 行间距倍数 0=默认
      fontMarginL: 0,            // 左边距 px 0=默认
      fontMarginR: 0,            // 右边距 px 0=默认
      fontCollapsed: false,      // 字体区域是否折叠
      fontBarButton: null,       // { text, css } or null — 状态栏字体按钮
      defaultTheme: '',          // 新页面默认主题（空=使用当前主题）
      defaultEyeCareColor: '',   // 新页面默认背景（空=使用当前背景）
      defaultThemeMode: '',      // 新页面默认深浅模式（空=不切换, 'dark'=深色, 'light'=浅色）
      defaultEyeCareMode: '',    // 新页面默认背景深浅模式（空=不切换, 'dark'=深色, 'light'=浅色）
      autoBgByName: false,       // 打开文档时使用同名图片作背景
      tabHeaderWheelTheme: false, // 标签页标题栏滚轮切换主题
      wheelGroups: ['__bg__'],   // 悬浮按钮普通滚轮循环切换的分组
      chipHoverHint: true,       // Chip 悬停提示开关
      hoverPreview: true,        // 悬停预览开关
      hoverDelay: 0,             // 悬停预览延时(ms)
      stylePresets: {},          // { name: { theme, isDark, eyeCareColor, activeFont, ... } } 风格组合
      navBoxes: null,            // [{ id, title, items[], auto? }] 分框配置; null=默认三框
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
          if (isMobile) {
            const appearance = JSON.parse(await this.app.vault.adapter.read('.obsidian/appearance.json'));
            enabledSnippets = appearance.enabledCssSnippets || [];
          } else {
            const appearancePath = _joinPath(this.app.vault.adapter.basePath, '.obsidian', 'appearance.json');
            const appearance = JSON.parse(nodeFs.readFileSync(appearancePath, 'utf-8'));
            enabledSnippets = appearance.enabledCssSnippets || [];
          }
        } catch (_e) {
          enabledSnippets = [];
        }
      }
    }

    let snippetFiles = [];
    try {
      if (isMobile) {
        const files = await this.app.vault.adapter.list('.obsidian/snippets');
        snippetFiles = (files.files || [])
          .map(f => f.replace(/^.*[\/\\]/, ''))
          .filter(f => f.endsWith('.css') || f.endsWith('.js'))
          .map(f => f.replace(/\.(css|js)$/, ''));
      } else {
        const snippetsDir = _joinPath(this.app.vault.adapter.basePath, '.obsidian', 'snippets');
        if (nodeFs.existsSync(snippetsDir)) {
          snippetFiles = nodeFs.readdirSync(snippetsDir)
            .filter(f => f.endsWith('.css') || f.endsWith('.js'))
            .map(f => f.replace(/\.(css|js)$/, ''));
        }
      }
    } catch (_e) {
      snippetFiles = [];
    }

    this._enabledSnippetsCache = [...enabledSnippets];
    return { enabledSnippets, snippetFiles };
  }

  _getAllSnippetFilesSync() {
    try {
      if (isMobile) return [];
      const snippetsDir = _joinPath(this.app.vault.adapter.basePath, '.obsidian', 'snippets');
      if (nodeFs.existsSync(snippetsDir)) {
        return nodeFs.readdirSync(snippetsDir)
          .filter(f => f.endsWith('.css') || f.endsWith('.js'))
          .map(f => f.replace(/\.(css|js)$/, ''));
      }
    } catch (_e) {}
    return [];
  }

  // ─── 读取主题列表 ─────────────────────────────────────────────────────
  async getThemeInfo() {
    let currentTheme = '';
    try {
      if (isMobile) {
        const appearance = JSON.parse(await this.app.vault.adapter.read('.obsidian/appearance.json'));
        currentTheme = appearance.cssTheme || '';
      } else {
        const appearancePath = _joinPath(this.app.vault.adapter.basePath, '.obsidian', 'appearance.json');
        const appearance = JSON.parse(nodeFs.readFileSync(appearancePath, 'utf-8'));
        currentTheme = appearance.cssTheme || '';
      }
    } catch (_e) {}

    let themeDirs = [];
    try {
      if (isMobile) {
        const result = await this.app.vault.adapter.list('.obsidian/themes');
        themeDirs = (result.folders || [])
          .map(f => f.replace(/^.*[\/\\]/, ''))
          .filter(n => n.length > 0);
      } else {
        const themesDir = _joinPath(this.app.vault.adapter.basePath, '.obsidian', 'themes');
        if (nodeFs.existsSync(themesDir)) {
          themeDirs = nodeFs.readdirSync(themesDir, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => d.name);
        }
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

  // ─── 预览主题（仅实时切换 CSS，不写 appearance.json）─────────────────
  _previewTheme(themeName) {
    try {
      if (this.app.customCss && typeof this.app.customCss.setTheme === 'function') {
        this.app.customCss.setTheme(themeName);
      } else if (this.app.customCss && typeof this.app.customCss.theme === 'string') {
        this.app.customCss.theme = themeName;
      }
    } catch (_e) {}
  }


  // ─── 悬停预览绑定（开关+延时）──────────────────────────────────────────
  _bindHoverPreview(el, enterFn, leaveFn) {
    let _timer = null;
    el.addEventListener('mouseenter', () => {
      if (!this.settings.hoverPreview) return;
      const d = this.settings.hoverDelay || 0;
      if (d > 0) { _timer = setTimeout(() => { _timer = null; enterFn(); }, d); }
      else { enterFn(); }
    });
    el.addEventListener('mouseleave', () => {
      if (_timer) { clearTimeout(_timer); _timer = null; return; }
      if (leaveFn) leaveFn();
    });
  }

  // ─── 滚轮切换主题（forward=true 下一个，false 上一个）─────────────────
  async _wheelSwitchTheme(forward) {
    const { currentTheme, themeDirs } = await this.getThemeInfo();
    if (themeDirs.length === 0) return;
    const list = [''].concat(themeDirs);
    const idx = list.indexOf(currentTheme);
    let nextIdx;
    if (forward) {
      nextIdx = idx < list.length - 1 ? idx + 1 : 0;
    } else {
      nextIdx = idx > 0 ? idx - 1 : list.length - 1;
    }
    await this.switchTheme(list[nextIdx]);
    this._refreshPopupIfNeeded();
  }

  async _showThemeWheelPopup(x, y, forward) {
    const _twDark = !!(document.body.classList.contains('theme-dark') || window.matchMedia('(prefers-color-scheme: dark)').matches);
    const _twBg = _twDark ? '#262624' : '#fcfbf8';
    const _twBorder = _twDark ? '#3b3b37' : '#dedbd3';
    const _twText = _twDark ? '#e8e6e0' : '#2b2a27';
    const _twMute = _twDark ? '#8f8c84' : '#8d8a82';
    const _twAccent = _twDark ? '#8fc2ad' : '#4f7a6a';

    const _applyItemStyle = (item, isSel) => {
      item.style.setProperty('padding', '6px 14px', 'important');
      item.style.setProperty('min-height', '32px', 'important');
      item.style.setProperty('box-sizing', 'border-box', 'important');
      item.style.setProperty('border-radius', '4px');
      item.style.setProperty('font-size', '13px');
      item.style.setProperty('line-height', '1.4');
      item.style.setProperty('white-space', 'nowrap');
      item.style.setProperty('overflow', 'hidden');
      item.style.setProperty('text-overflow', 'ellipsis');
      item.style.setProperty('display', 'flex', 'important');
      item.style.setProperty('align-items', 'center', 'important');
      item.style.setProperty('cursor', 'pointer');
      item.style.background = isSel ? _twAccent : '';
      item.style.color = isSel ? '#fff' : _twText;
      item.style.fontWeight = isSel ? '600' : 'normal';
    };

    let pop = document.getElementById('ss-theme-wheel-popup');
    if (!pop) {
      const { currentTheme, themeDirs } = await this.getThemeInfo();
      const list = [''].concat(themeDirs);
      pop = document.createElement('div');
      pop.id = 'ss-theme-wheel-popup';
      pop.style.cssText = `position:fixed;z-index:10005;background:${_twBg};border:1px solid ${_twBorder};border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.3);padding:8px;min-width:240px;max-width:340px;display:flex;flex-direction:column;gap:4px;`;
      pop._themes = list;
      pop._currentIdx = list.indexOf(currentTheme);
      document.body.appendChild(pop);
      const title = pop.createEl('div');
      title.style.cssText = `font-size:11px;font-weight:600;color:${_twMute};padding:0 4px;margin-bottom:2px;`;
      title.textContent = _currentLang === 'zh' ? '主题列表' : 'Themes';
      const listEl = pop.createEl('div');
      listEl.style.cssText = 'overflow-y:auto;max-height:300px;display:flex;flex-direction:column;gap:2px;';
      list.forEach((theme, i) => {
        const item = listEl.createEl('div');
        item.textContent = theme || t('eyeCare.default');
        item._themeIdx = i;
        _applyItemStyle(item, i === pop._currentIdx);
        item.addEventListener('click', async () => {
          pop._currentIdx = i;
          await this.switchTheme(pop._themes[i]);
          this._refreshPopupIfNeeded();
          pop._listEl.querySelectorAll('div').forEach(el => { _applyItemStyle(el, el._themeIdx === i); });
        });
      });
      pop._listEl = listEl;
      pop._moveHandler = (ev) => {
        if (pop.contains(ev.target)) return;
        const rect = pop.getBoundingClientRect();
        const dx = Math.max(0, Math.max(rect.left - ev.clientX, ev.clientX - rect.right));
        const dy = Math.max(0, Math.max(rect.top - ev.clientY, ev.clientY - rect.bottom));
        if (Math.max(dx, dy) > 20) { document.removeEventListener('mousemove', pop._moveHandler); pop.remove(); }
      };
      document.addEventListener('mousemove', pop._moveHandler);
    }
    if (forward) pop._currentIdx = pop._currentIdx < pop._themes.length - 1 ? pop._currentIdx + 1 : 0;
    else pop._currentIdx = pop._currentIdx > 0 ? pop._currentIdx - 1 : pop._themes.length - 1;
    pop._listEl.querySelectorAll('div').forEach(item => { _applyItemStyle(item, item._themeIdx === pop._currentIdx); });
    const items = pop._listEl.querySelectorAll('div');
    if (items[pop._currentIdx]) items[pop._currentIdx].scrollIntoView({ block: 'nearest' });
    pop.style.left = Math.min(x + 14, window.innerWidth - 360) + 'px';
    pop.style.top = Math.min(y + 14, window.innerHeight - 360) + 'px';
    await this.switchTheme(pop._themes[pop._currentIdx]);
    this._refreshPopupIfNeeded();
  }

  async _showGroupWheelPopup(x, y, forward) {
    const _gwDark = !!(document.body.classList.contains('theme-dark') || window.matchMedia('(prefers-color-scheme: dark)').matches);
    const _gwBg = _gwDark ? '#262624' : '#fcfbf8';
    const _gwBorder = _gwDark ? '#3b3b37' : '#dedbd3';
    const _gwText = _gwDark ? '#e8e6e0' : '#2b2a27';
    const _gwMute = _gwDark ? '#8f8c84' : '#8d8a82';
    const _gwAccent = _gwDark ? '#8fc2ad' : '#4f7a6a';

    const wheelGroups = Array.isArray(this.settings.wheelGroups) && this.settings.wheelGroups.length > 0
      ? this.settings.wheelGroups : ['__bg__'];
    const { enabledSnippets } = await this.getSnippetInfo();
    const bgImgs = this.settings.bgImages || [];
    const bgCustomColors = this.settings.customBgColors || [];
    const items = [];
    wheelGroups.forEach(gName => {
      const members = this.settings.groups[gName] || [];
      members.forEach(name => items.push({ type: 'snippet', name, group: gName }));
      if (gName === '__bg__') {
        bgImgs.forEach((_, i) => items.push({ type: 'img', idx: i, group: gName }));
        bgCustomColors.forEach((_, i) => items.push({ type: 'customcolor', idx: i, group: gName }));
      }
    });
    if (items.length === 0) return;

    const _itemLabel = (it) => {
      if (it.type === 'snippet') return it.name;
      if (it.type === 'img') return bgImgs[it.idx]?.label || bgImgs[it.idx]?.url || `Image ${it.idx + 1}`;
      if (it.type === 'customcolor') return bgCustomColors[it.idx] || `Color ${it.idx + 1}`;
      return '';
    };

    let activeItemIdx = -1;
    const currentImgIdx = this.settings.eyeCareColor?.startsWith('__img_') ? parseInt(this.settings.eyeCareColor.slice(6), 10) : -1;
    const currentColorIdx = this.settings.eyeCareColor?.startsWith('__customcolor_') ? parseInt(this.settings.eyeCareColor.slice(14), 10) : -1;
    if (currentColorIdx >= 0) {
      activeItemIdx = items.findIndex(it => it.type === 'customcolor' && it.idx === currentColorIdx);
    } else if (currentImgIdx >= 0) {
      activeItemIdx = items.findIndex(it => it.type === 'img' && it.idx === currentImgIdx);
    } else {
      for (let i = items.length - 1; i >= 0; i--) {
        if (items[i].type === 'snippet' && enabledSnippets.includes(items[i].name)) { activeItemIdx = i; break; }
      }
    }

    const _applyItemStyle = (item, isSel) => {
      item.style.setProperty('padding', '6px 14px', 'important');
      item.style.setProperty('min-height', '32px', 'important');
      item.style.setProperty('box-sizing', 'border-box', 'important');
      item.style.setProperty('border-radius', '4px');
      item.style.setProperty('font-size', '13px');
      item.style.setProperty('line-height', '1.4');
      item.style.setProperty('white-space', 'nowrap');
      item.style.setProperty('overflow', 'hidden');
      item.style.setProperty('text-overflow', 'ellipsis');
      item.style.setProperty('display', 'flex', 'important');
      item.style.setProperty('align-items', 'center', 'important');
      item.style.setProperty('cursor', 'pointer');
      item.style.background = isSel ? _gwAccent : '';
      item.style.color = isSel ? '#fff' : _gwText;
      item.style.fontWeight = isSel ? '600' : 'normal';
    };

    const _switchToItem = async (idx) => {
      wheelGroups.forEach(gName => {
        const members = this.settings.groups[gName] || [];
        members.forEach(name => { if (enabledSnippets.includes(name)) this._setSnippetEnabled(name, false); });
      });
      if (this.settings.eyeCareColor?.startsWith('__img_') || this.settings.eyeCareColor?.startsWith('__customcolor_')) {
        this.settings.eyeCareColor = '';
        this.applyEyeCareColor();
      }
      const it = items[idx];
      if (it.type === 'snippet') {
        this._setSnippetEnabled(it.name, true);
      } else if (it.type === 'img') {
        this.settings.eyeCareColor = `__img_${it.idx}`;
        this.applyEyeCareColor();
      } else if (it.type === 'customcolor') {
        this.settings.eyeCareColor = `__customcolor_${it.idx}`;
        this.applyEyeCareColor();
      }
      await this.saveSettings();
      if (this.settings.styleMemory && this._lastFilePath) {
        await this._savePageStyle(this._lastFilePath);
      }
      this._refreshPopupIfNeeded();
    };

    let pop = document.getElementById('ss-group-wheel-popup');
    if (!pop) {
      pop = document.createElement('div');
      pop.id = 'ss-group-wheel-popup';
      pop.style.cssText = `position:fixed;z-index:10005;background:${_gwBg};border:1px solid ${_gwBorder};border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.3);padding:8px;min-width:240px;max-width:340px;display:flex;flex-direction:column;gap:4px;`;
      pop._currentIdx = activeItemIdx;
      document.body.appendChild(pop);
      const title = pop.createEl('div');
      title.style.cssText = `font-size:11px;font-weight:600;color:${_gwMute};padding:0 4px;margin-bottom:2px;`;
      title.textContent = _currentLang === 'zh' ? '分组列表' : 'Groups';
      const listEl = pop.createEl('div');
      listEl.style.cssText = 'overflow-y:auto;max-height:300px;display:flex;flex-direction:column;gap:2px;';
      items.forEach((it, i) => {
        const item = listEl.createEl('div');
        item.textContent = _itemLabel(it);
        item._itemIdx = i;
        _applyItemStyle(item, i === activeItemIdx);
        item.addEventListener('click', async () => {
          pop._currentIdx = i;
          await _switchToItem(i);
          pop._listEl.querySelectorAll('div').forEach(el => { _applyItemStyle(el, el._itemIdx === i); });
        });
      });
      pop._listEl = listEl;
      pop._moveHandler = (ev) => {
        if (pop.contains(ev.target)) return;
        const rect = pop.getBoundingClientRect();
        const dx = Math.max(0, Math.max(rect.left - ev.clientX, ev.clientX - rect.right));
        const dy = Math.max(0, Math.max(rect.top - ev.clientY, ev.clientY - rect.bottom));
        if (Math.max(dx, dy) > 20) { document.removeEventListener('mousemove', pop._moveHandler); pop.remove(); }
      };
      document.addEventListener('mousemove', pop._moveHandler);
    }
    if (forward) pop._currentIdx = pop._currentIdx < items.length - 1 ? pop._currentIdx + 1 : 0;
    else pop._currentIdx = pop._currentIdx > 0 ? pop._currentIdx - 1 : items.length - 1;
    pop._listEl.querySelectorAll('div').forEach(item => { _applyItemStyle(item, item._itemIdx === pop._currentIdx); });
    const listItems = pop._listEl.querySelectorAll('div');
    if (listItems[pop._currentIdx]) listItems[pop._currentIdx].scrollIntoView({ block: 'nearest' });
    pop.style.left = Math.min(x + 14, window.innerWidth - 360) + 'px';
    pop.style.top = Math.min(y + 14, window.innerHeight - 360) + 'px';
    await _switchToItem(pop._currentIdx);
  }

  // ─── 记忆使用者弹层 ──────────────────────────────────────────────────
  _refreshPopupIfNeeded() {
    const popup = document.getElementById('ss-snippets-popup');
    if (popup && popup._ssRefreshAll) popup._ssRefreshAll();
  }

  _showMemoryPopup(anchorEl, filePaths, valueLabel, fieldType, refreshFn) {
    document.querySelectorAll('.ss-memory-popup').forEach(p => p.remove());
    const pop = document.createElement('div');
    pop.className = 'ss-memory-popup';
    pop.style.cssText = 'position:fixed;z-index:10003;background:rgba(var(--mono-rgb-0),0.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--background-modifier-border);border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.3);padding:10px;min-width:220px;max-width:300px;max-height:280px;display:flex;flex-direction:column;';
    const title = pop.createEl('div');
    title.style.cssText = 'font-size:12px;font-weight:600;margin-bottom:8px;color:var(--text-normal);';
    title.textContent = (filePaths.length === 1 ? t('memory.usedByOne') : t('memory.usedBy').replace('{0}', String(filePaths.length))) + ' · ' + valueLabel;
    const listEl = pop.createEl('div');
    listEl.style.cssText = 'flex:1;overflow-y:auto;min-height:0;';
    for (const fp of filePaths) {
      const item = listEl.createEl('div');
      item.style.cssText = 'display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px dashed var(--background-modifier-border);';
      const name = fp.split('/').pop() || fp;
      const nameEl = item.createEl('span', { text: name });
      nameEl.style.cssText = 'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;color:var(--text-normal);';
      nameEl.title = fp;
      const forgetLink = item.createEl('span', { text: t('memory.forget') });
      forgetLink.style.cssText = 'font-size:11px;color:var(--text-error);cursor:pointer;flex-shrink:0;';
      forgetLink.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (this.settings.pageStyles && this.settings.pageStyles[fp]) {
          if (fieldType === 'theme') {
            delete this.settings.pageStyles[fp].theme;
          } else if (fieldType === 'bg') {
            delete this.settings.pageStyles[fp].eyeCareColor;
          } else {
            delete this.settings.pageStyles[fp];
          }
          if (Object.keys(this.settings.pageStyles[fp]).length === 0) delete this.settings.pageStyles[fp];
          await this.saveSettings();
          item.remove();
          if (refreshFn) await refreshFn();
        }
      });
    }
    if (filePaths.length > 1) {
      const allBtn = pop.createEl('button', { text: t('memory.forgetAll') });
      allBtn.style.cssText = 'margin-top:8px;width:100%;border:1px solid var(--background-modifier-border);background:var(--background-primary);border-radius:6px;padding:5px;cursor:pointer;font-size:12px;color:var(--text-error);';
      allBtn.addEventListener('click', async () => {
        for (const fp of filePaths) {
          if (this.settings.pageStyles && this.settings.pageStyles[fp]) {
            if (fieldType === 'theme') {
              delete this.settings.pageStyles[fp].theme;
            } else if (fieldType === 'bg') {
              delete this.settings.pageStyles[fp].eyeCareColor;
            } else {
              delete this.settings.pageStyles[fp];
            }
            if (this.settings.pageStyles[fp] && Object.keys(this.settings.pageStyles[fp]).length === 0) delete this.settings.pageStyles[fp];
          }
        }
        await this.saveSettings();
        pop.remove();
        if (refreshFn) await refreshFn();
      });
    }
    document.body.appendChild(pop);
    const rect = anchorEl.getBoundingClientRect();
    let left = rect.left;
    let top = rect.bottom + 6;
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    requestAnimationFrame(() => {
      const pRect = pop.getBoundingClientRect();
      if (pRect.right > window.innerWidth) pop.style.left = (window.innerWidth - pRect.width - 8) + 'px';
      if (pRect.bottom > window.innerHeight) pop.style.top = (rect.top - pRect.height - 6) + 'px';
    });
    const closeHandler = (ev) => {
      if (!pop.contains(ev.target)) { pop.remove(); document.removeEventListener('click', closeHandler); }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 0);
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
  async applyEyeCareColor() {
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
      this._removeOverlay('ss-bg-img-overlay');
      this._stopCursorTracking();
      return;
    }
    if (!key.startsWith('__img_') && !key.startsWith('__customcolor_')) {
      this._removeOverlay('ss-bg-img-overlay');
    }
    if (key.startsWith('__customcolor_')) {
      const cIdx = parseInt(key.slice(14), 10);
      const customColors = this.settings.customBgColors || [];
      const colorVal = customColors[cIdx];
      if (!colorVal) { styleEl.textContent = ''; this._removeOverlay('ss-bg-img-overlay'); return; }
      this._removeOverlay('ss-bg-img-overlay');
      this._removeOverlay('ss-edge-glow-overlay');
      this._removeOverlay('ss-cursor-glow-overlay');
      this._stopCursorTracking();
      const isDark = document.body.classList.contains('theme-dark');
      let r = parseInt(colorVal.slice(1,3), 16);
      let g = parseInt(colorVal.slice(3,5), 16);
      let b = parseInt(colorVal.slice(5,7), 16);
      if (isDark) {
        r = 255 - r; g = 255 - g; b = 255 - b;
      }
      const effectiveColor = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
      const bgSec = isDark
        ? `rgba(${Math.round(r*0.85)},${Math.round(g*0.85)},${Math.round(b*0.85)},1)`
        : `rgba(${Math.min(255,Math.round(r*1.02))},${Math.min(255,Math.round(g*1.02))},${Math.min(255,Math.round(b*1.02))},1)`;
      const bgMod = isDark
        ? `rgba(${Math.round(r*0.7)},${Math.round(g*0.7)},${Math.round(b*0.7)},0.15)`
        : `rgba(${Math.round(r*0.8)},${Math.round(g*0.8)},${Math.round(b*0.8)},0.12)`;
      styleEl.textContent = `
        .workspace-leaf-content,
        .markdown-source-view,
        .markdown-preview-view {
          --background-primary: ${effectiveColor};
          --background-primary-alt: ${effectiveColor};
          --background-secondary: ${bgSec};
          --background-secondary-alt: ${bgSec};
          --background-modifier-border: ${bgMod};
          background: ${effectiveColor};
        }
        .markdown-source-view .cm-s-obsidian,
        .markdown-preview-view .markdown-reading-view {
          background: transparent;
        }
        .markdown-source-view.mod-cm6 .cm-line {
          background: transparent !important;
        }
      `;
      return;
    }
    if (key.startsWith('__img_')) {
      const imgIdx = parseInt(key.slice(6), 10);
      const imgItem = (this.settings.bgImages || [])[imgIdx];
      if (!imgItem) { styleEl.textContent = ''; this._removeOverlay('ss-bg-img-overlay'); return; }
      const picDir = this._getPluginDir();
      const resolvedUrl = this._resolveImageForMode(imgItem);
      const finalResolvedUrl = await this._resolvePhoneImageAsync(resolvedUrl);
      const fullPath = _joinPath(picDir, 'pic', finalResolvedUrl);
      let imgUrl = '';
      try {
        if (isMobile) {
          const vaultPath = _joinPath(this._getPluginVaultPath(), 'pic', finalResolvedUrl);
          if (this._cachedImgUrl && this._cachedImgKey === key) {
            imgUrl = this._cachedImgUrl;
          } else {
            const buf = await this.app.vault.adapter.readBinary(vaultPath);
            const ext = finalResolvedUrl.substring(finalResolvedUrl.lastIndexOf('.')).toLowerCase();
            const mimeMap = { '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.bmp':'image/bmp','.svg':'image/svg+xml' };
            const mime = mimeMap[ext] || 'image/png';
            const blob = new Blob([buf], { type: mime });
            imgUrl = URL.createObjectURL(blob);
            this._cachedImgUrl = imgUrl;
            this._cachedImgKey = key;
          }
        } else {
          const buf = nodeFs.readFileSync(fullPath);
          const ext = fullPath.substring(fullPath.lastIndexOf('.')).toLowerCase();
          const mimeMap = { '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.bmp':'image/bmp','.svg':'image/svg+xml' };
          const mime = mimeMap[ext] || 'image/png';
          imgUrl = 'data:' + mime + ';base64,' + buf.toString('base64');
        }
      } catch (e) {
        console.warn('[SwiftSnippets] Failed to load image:', fullPath, e);
        return;
      }
      const isDark = document.body.classList.contains('theme-dark');
      const opacity = imgItem.opacity ?? 0.3;
      const tile = imgItem.tile ?? false;
      const stretch = imgItem.stretch ?? false;
      const bg = isDark ? 'rgba(20,20,20,1)' : 'rgba(255,255,255,1)';
      const bgSec = isDark ? 'rgba(28,28,28,1)' : 'rgba(248,248,248,1)';
      const tintR = isDark ? '20' : '255', tintG = isDark ? '20' : '255', tintB = isDark ? '20' : '255';
      const tintAlpha = 1 - opacity;
      let bgSize, bgRepeat;
      if (stretch) {
        bgSize = '100% 100%';
        bgRepeat = 'no-repeat';
      } else if (tile) {
        bgSize = 'auto';
        bgRepeat = 'repeat';
      } else {
        bgSize = 'cover';
        bgRepeat = 'no-repeat';
      }
      styleEl.textContent = `
        .workspace-leaf-content,
        .markdown-source-view,
        .markdown-preview-view {
          --background-primary: ${bg};
          --background-primary-alt: ${bg};
          --background-secondary: ${bgSec};
          --background-secondary-alt: ${bgSec};
          --background-modifier-border: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
          background: linear-gradient(rgba(${tintR},${tintG},${tintB},${tintAlpha}), rgba(${tintR},${tintG},${tintB},${tintAlpha})), url('${imgUrl}');
          background-size: ${bgSize};
          background-position: center;
          background-repeat: ${bgRepeat};
        }
        .markdown-source-view .cm-s-obsidian,
        .markdown-preview-view .markdown-reading-view {
          background: transparent;
        }
        .markdown-source-view.mod-cm6 .cm-line {
          background: transparent !important;
        }
      `;
      this._removeOverlay('ss-bg-img-overlay');
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

  async getSystemFonts() {
    if (isMobile) return [];
    if (this._cachedFonts) return this._cachedFonts;
    try {
      const { execSync } = require('child_process');
      let cmd;
      if (process.platform === 'win32') {
        cmd = 'chcp 65001 >nul & powershell -NoProfile -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; [System.Reflection.Assembly]::LoadWithPartialName(\'System.Drawing\') | Out-Null; (New-Object System.Drawing.Text.InstalledFontCollection).Families | ForEach-Object { $_.Name }"';
      } else if (process.platform === 'darwin') {
        cmd = 'system_profiler SPFontsDataType 2>/dev/null | awk -F": " "/Full Name:/{print $2}" | sort -u';
      } else {
        cmd = 'fc-list --format="%{family}\\n" | sort -u';
      }
      const output = execSync(cmd, { encoding: 'utf-8', timeout: 15000 });
      const fonts = [...new Set(output.split('\n').map(f => f.trim()).filter(f => f.length > 0))];
      fonts.sort((a, b) => a.localeCompare(b, _currentLang === 'zh' ? 'zh-CN' : 'en'));
      this._cachedFonts = fonts;
      return fonts;
    } catch (e) {
      console.warn('[SwiftSnippets] Failed to get system fonts:', e);
      return [];
    }
  }

  applyFontSettings() {
    let styleEl = document.getElementById('ss-font-style');
    const s = this.settings;
    const mlActive = (s.fontMarginL ?? 0) !== 0;
    const mrActive = (s.fontMarginR ?? 0) !== 0;
    const hasStyleSettings = s.fontColor || s.fontOpacity < 1 || s.fontLineHeight || mlActive || mrActive;
    const hasFontSetting = s.activeFont && !this._fontDisabled;
    if (!hasFontSetting && !hasStyleSettings) {
      if (styleEl) styleEl.remove();
      return;
    }
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'ss-font-style';
      document.head.appendChild(styleEl);
    }

    const ff = hasFontSetting ? (s.activeFont || '') : '';
    const lh = s.fontLineHeight > 0 ? s.fontLineHeight : '';
    const ml = s.fontMarginL ?? 0;
    const mr = s.fontMarginR ?? 0;


    let colorRule = '';
    if (s.fontColor || s.fontOpacity < 1) {
      let effectiveColor = s.fontColor;
      if (effectiveColor && document.body.classList.contains('theme-dark')) {
        const r = parseInt(effectiveColor.slice(1,3), 16);
        const g = parseInt(effectiveColor.slice(3,5), 16);
        const b = parseInt(effectiveColor.slice(5,7), 16);
        effectiveColor = '#' + (255 - r).toString(16).padStart(2, '0') + (255 - g).toString(16).padStart(2, '0') + (255 - b).toString(16).padStart(2, '0');
      }
      if (effectiveColor && s.fontOpacity < 1) {
        const r = parseInt(effectiveColor.slice(1,3), 16);
        const g = parseInt(effectiveColor.slice(3,5), 16);
        const b = parseInt(effectiveColor.slice(5,7), 16);
        colorRule = `rgba(${r},${g},${b},${s.fontOpacity})`;
      } else if (effectiveColor) {
        colorRule = effectiveColor;
      } else {
        colorRule = `rgba(var(--text-normal-rgb, 200,200,200),${s.fontOpacity})`;
      }
    }

    let css = '';
    if (ff) {
      css += `.workspace-leaf-content[data-type="markdown"] .markdown-preview-view,
.workspace-leaf-content[data-type="markdown"] .markdown-preview-sizer,
.workspace-leaf-content[data-type="markdown"] .markdown-preview-view .markdown-rendered {
  font-family: "${ff}", var(--font-text), sans-serif !important;${lh ? `\n  line-height: ${lh} !important;` : ''}${mlActive ? `\n  padding-left: ${ml}px !important;` : ''}${mrActive ? `\n  padding-right: ${mr}px !important;` : ''}
}
.workspace-leaf-content[data-type="markdown"] .markdown-source-view.mod-cm6 .cm-line,
.workspace-leaf-content[data-type="markdown"] .cm-s-obsidian .cm-line {
  font-family: "${ff}", var(--font-text), sans-serif !important;${lh ? `\n  line-height: ${lh} !important;` : ''}
}
.workspace-split .workspace-leaf-content .nav-files-container,
.workspace-split .workspace-leaf-content .search-result-file-title,
.workspace-split .workspace-leaf-content .search-result-file-match,
.workspace-split .workspace-leaf-content .tree-item-inner,
.workspace-split .workspace-leaf-content .nav-file-title,
.workspace-split .workspace-leaf-content .nav-folder-title,
.workspace-split .workspace-leaf-content .outline .tree-item-inner,
.workspace-split .workspace-leaf-content .tag-container .tree-item-inner,
.workspace-split .workspace-leaf-content .backlink-pane .tree-item-inner,
.workspace-split .workspace-leaf-content .workspace-leaf-content {
  font-family: "${ff}", var(--font-text), sans-serif !important;
}`;
    } else if (lh) {
      css += `.workspace-leaf-content[data-type="markdown"] .markdown-preview-view,
.workspace-leaf-content[data-type="markdown"] .markdown-preview-sizer,
.workspace-leaf-content[data-type="markdown"] .markdown-preview-view .markdown-rendered {
  line-height: ${lh} !important;
}
.workspace-leaf-content[data-type="markdown"] .markdown-source-view.mod-cm6 .cm-line,
.workspace-leaf-content[data-type="markdown"] .cm-s-obsidian .cm-line {
  line-height: ${lh} !important;
}`;
    }

    if (mlActive || mrActive) {
      css += `
.workspace-leaf-content[data-type="markdown"] .markdown-preview-view,
.workspace-leaf-content[data-type="markdown"] .markdown-preview-sizer {${mlActive ? `\n  padding-left: ${ml}px !important;` : ''}${mrActive ? `\n  padding-right: ${mr}px !important;` : ''}
}
.workspace-leaf-content[data-type="markdown"] .markdown-source-view.mod-cm6 .cm-scroller,
.workspace-leaf-content[data-type="markdown"] .markdown-source-view.mod-cm6 .cm-content {${mlActive ? `\n  padding-left: ${ml}px !important;` : ''}${mrActive ? `\n  padding-right: ${mr}px !important;` : ''}
}`;
    }

    if (colorRule) {
      css += `
.workspace-leaf-content[data-type="markdown"] .cm-s-obsidian .cm-line,
.workspace-leaf-content[data-type="markdown"] .markdown-preview-view p,
.workspace-leaf-content[data-type="markdown"] .markdown-preview-view li,
.workspace-leaf-content[data-type="markdown"] .markdown-preview-view h1,
.workspace-leaf-content[data-type="markdown"] .markdown-preview-view h2,
.workspace-leaf-content[data-type="markdown"] .markdown-preview-view h3,
.workspace-leaf-content[data-type="markdown"] .markdown-preview-view h4,
.workspace-leaf-content[data-type="markdown"] .markdown-preview-view h5,
.workspace-leaf-content[data-type="markdown"] .markdown-preview-view h6,
.workspace-split .workspace-leaf-content .nav-files-container,
.workspace-split .workspace-leaf-content .search-result-file-title,
.workspace-split .workspace-leaf-content .search-result-file-match,
.workspace-split .workspace-leaf-content .tree-item-inner,
.workspace-split .workspace-leaf-content .nav-file-title,
.workspace-split .workspace-leaf-content .nav-folder-title,
.workspace-split .workspace-leaf-content .outline .tree-item-inner,
.workspace-split .workspace-leaf-content .tag-container .tree-item-inner,
.workspace-split .workspace-leaf-content .backlink-pane .tree-item-inner {
  color: ${colorRule} !important;
}`;
    }

    styleEl.textContent = css;
  }

  _resolveImageForMode(imgItem) {
    if (imgItem.paired && imgItem.urlDark) {
      const isDark = document.body.classList.contains('theme-dark');
      return isDark ? imgItem.urlDark : imgItem.url;
    }
    if (isMobile) return imgItem.url;
    const imgFileName = imgItem.url;
    const picDir = _joinPath(this._getPluginDir(), 'pic');
    const isDark = document.body.classList.contains('theme-dark');
    const ext = imgFileName.substring(imgFileName.lastIndexOf('.'));
    const base = imgFileName.substring(0, imgFileName.lastIndexOf('.'));
    const suffix = isDark ? '-dark' : '-light';
    const oppositeSuffix = isDark ? '-light' : '-dark';
    if (base.endsWith('-light') || base.endsWith('-dark')) {
      const targetBase = base.endsWith(suffix) ? base : base.replace(new RegExp('\\' + oppositeSuffix + '$'), suffix);
      const targetFile = targetBase + ext;
      if (nodeFs.existsSync(_joinPath(picDir, targetFile))) return targetFile;
      return imgFileName;
    }
    const themedFile = base + suffix + ext;
    if (nodeFs.existsSync(_joinPath(picDir, themedFile))) return themedFile;
    return imgFileName;
  }


  async _resolvePhoneImageAsync(resolvedUrl) {
    if (!isMobile) return resolvedUrl;
    const phonePath = 'phone/' + resolvedUrl;
    const vaultPath = _joinPath(this._getPluginVaultPath(), 'pic', phonePath);
    try {
      const exists = await this.app.vault.adapter.exists(vaultPath);
      return exists ? phonePath : resolvedUrl;
    } catch (_e) {
      return resolvedUrl;
    }
  }

  _getPluginDir() {
    const basePath = this.app && this.app.vault && this.app.vault.adapter && this.app.vault.adapter.basePath;
    if (basePath) {
      if (this.manifest && this.manifest.dir) {
        return _joinPath(basePath, this.manifest.dir);
      }
      return _joinPath(basePath, '.obsidian', 'plugins', (this.manifest && this.manifest.id) || 'swift-snippets');
    }
    if (this.manifest && this.manifest.dir) {
      return this.manifest.dir;
    }
    return __dirname;
  }

  _getPluginVaultPath() {
    if (this.manifest && this.manifest.dir) {
      return this.manifest.dir;
    }
    return _joinPath('.obsidian', 'plugins', (this.manifest && this.manifest.id) || 'swift-snippets');
  }

  _exportEyeCareSnippets() {
    if (isMobile) return;
    const snippetsDir = _joinPath(this.app.vault.adapter.basePath, '.obsidian', 'snippets');
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
      lavender: { bg: '#f3f0f7', bgSec: '#e8e4ef', bgMod: '#ddd8e7', darkBg: '#2a2630', darkBgSec: '#322e36', darkBgMod: '#3a363e' },
      rose: { bg: '#fce8ec', bgSec: '#f5dce2', bgMod: '#edd0d8', darkBg: '#2e2024', darkBgSec: '#362428', darkBgMod: '#3e2a2e' },
      sky: { bg: '#e8f0f7', bgSec: '#dce8f3', bgMod: '#d0dcef', darkBg: '#1e2430', darkBgSec: '#242a36', darkBgMod: '#2a303e' },
      sand: { bg: '#f6f0e4', bgSec: '#ede7db', bgMod: '#e2dccc', darkBg: '#2a261e', darkBgSec: '#322e24', darkBgMod: '#3a362a' },
      sage: { bg: '#e8f0e8', bgSec: '#dce8dc', bgMod: '#d0ddd0', darkBg: '#1e2820', darkBgSec: '#243026', darkBgMod: '#2a382c' },
      blush: { bg: '#fce4ec', bgSec: '#f5d8e2', bgMod: '#edccd6', darkBg: '#2e1e24', darkBgSec: '#362428', darkBgMod: '#3e2a2e' },
      ivory: { bg: '#fffef0', bgSec: '#faf9e0', bgMod: '#f0efcc', darkBg: '#2a2a1e', darkBgSec: '#323024', darkBgMod: '#3a382a' },
      fog: { bg: '#eef0f0', bgSec: '#e4e6e6', bgMod: '#d8dadc', darkBg: '#222424', darkBgSec: '#2a2c2c', darkBgMod: '#323434' },
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
      if ((this.settings.deletedPresets || []).includes(key)) continue;
      const fileName = `ss-${key}.css`;
      const filePath = _joinPath(snippetsDir, fileName);

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


  async _syncPicFolder() {
    try {
      let files;
      if (isMobile) {
        const picVaultPath = _joinPath(this._getPluginVaultPath(), 'pic');
        try { await this.app.vault.adapter.mkdir(picVaultPath); } catch (_e) {}
        const result = await this.app.vault.adapter.list(picVaultPath);
        const imgExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'];
        files = (result.files || [])
          .map(f => f.replace(/^.*[\/\\]/, ''))
          .filter(f => imgExts.some(ext => f.toLowerCase().endsWith(ext)));
      } else {
        const pluginDir = this._getPluginDir();
        const picDir = _joinPath(pluginDir, 'pic');
        if (!nodeFs.existsSync(picDir)) {
          nodeFs.mkdirSync(picDir, { recursive: true });
        }
        const imgExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'];
        files = nodeFs.readdirSync(picDir).filter(f => imgExts.some(ext => f.toLowerCase().endsWith(ext)));
      }
      console.log('[SwiftSnippets] pic files:', files.length);
      files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      const existingMap = {};
      (this.settings.bgImages || []).forEach(img => {
        existingMap[img.label] = { opacity: img.opacity ?? 0.3, tile: img.tile ?? false, stretch: img.stretch ?? false };
      });
      const fileSet = new Set(files);
      const paired = new Set();
      const result = [];
      for (const f of files) {
        const ext = f.substring(f.lastIndexOf('.'));
        const base = f.substring(0, f.lastIndexOf('.'));
        if (base.endsWith('-light')) {
          const root = base.slice(0, -6);
          const darkFile = root + '-dark' + ext;
          if (fileSet.has(darkFile)) {
            paired.add(f);
            paired.add(darkFile);
            const label = root;
            result.push({
              type: 'local',
              url: f,
              urlDark: darkFile,
              label: label,
              opacity: existingMap[label]?.opacity ?? 0.3,
              tile: existingMap[label]?.tile ?? false,
              stretch: existingMap[label]?.stretch ?? false,
              paired: true,
            });
          }
        }
      }
      for (const f of files) {
        if (paired.has(f)) continue;
        const ext = f.substring(f.lastIndexOf('.'));
        const base = f.substring(0, f.lastIndexOf('.'));
        if (base.endsWith('-dark')) {
          const root = base.slice(0, -5);
          const lightFile = root + '-light' + ext;
          if (fileSet.has(lightFile)) {
            paired.add(f);
            paired.add(lightFile);
            const label = root;
            const exists = result.some(r => r.label === label && r.paired);
            if (!exists) {
              result.push({
                type: 'local',
                url: lightFile,
                urlDark: f,
                label: label,
                opacity: existingMap[label]?.opacity ?? 0.3,
                tile: existingMap[label]?.tile ?? false,
                stretch: existingMap[label]?.stretch ?? false,
                paired: true,
              });
            }
          }
        }
      }
      for (const f of files) {
        if (paired.has(f)) continue;
        result.push({
          type: 'local',
          url: f,
          label: f,
          opacity: existingMap[f]?.opacity ?? 0.3,
          tile: existingMap[f]?.tile ?? false,
          stretch: existingMap[f]?.stretch ?? false,
        });
      }
      this.settings.bgImages = result;
      this.saveSettings();
    } catch (e) {
      console.warn('[SwiftSnippets] Failed to sync pic folder:', e);
    }
  }

  // ─── 旋转图片 90 度 ──────────────────────────────────────────────────
  async _rotateImage(imgUrl) {
    if (isMobile) throw new Error('Not supported on mobile');
    const picDir = _joinPath(this._getPluginDir(), 'pic');
    const fullPath = _joinPath(picDir, imgUrl);
    if (!nodeFs.existsSync(fullPath)) throw new Error('File not found');

    const buf = nodeFs.readFileSync(fullPath);
    const ext = fullPath.substring(fullPath.lastIndexOf('.')).toLowerCase();
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
      { key: 'lavender', color: '#f3f0f7', darkColor: '#2a2630', label: t('eyeCare.lavender') },
      { key: 'rose',  color: '#fce8ec', darkColor: '#2e2024', label: t('eyeCare.rose') },
      { key: 'sky',   color: '#e8f0f7', darkColor: '#1e2430', label: t('eyeCare.sky') },
      { key: 'sand',  color: '#f6f0e4', darkColor: '#2a261e', label: t('eyeCare.sand') },
      { key: 'sage',  color: '#e8f0e8', darkColor: '#1e2820', label: t('eyeCare.sage') },
      { key: 'blush', color: '#fce4ec', darkColor: '#2e1e24', label: t('eyeCare.blush') },
      { key: 'ivory', color: '#fffef0', darkColor: '#2a2a1e', label: t('eyeCare.ivory') },
      { key: 'fog',   color: '#eef0f0', darkColor: '#222424', label: t('eyeCare.fog') },
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
    const customColors = this.settings.customBgColors || [];
    customColors.forEach((colorVal, cIdx) => {
      base.push({
        key: `__customcolor_${cIdx}`,
        color: colorVal, darkColor: colorVal,
        label: colorVal,
        pattern: 'customcolor',
      });
    });
    return base;
  }

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
    const safeX = Math.min(Math.max(0, pos.x), window.innerWidth - 10);
    const safeY = Math.min(Math.max(0, pos.y), window.innerHeight - 10);
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

    // 滚轮：普通切换选中分组（弹出列表），Ctrl/Shift弹出主题列表
    btn.addEventListener('wheel', async (e) => {
      e.preventDefault();
      if (e.ctrlKey || e.shiftKey) {
        this._showThemeWheelPopup(e.clientX, e.clientY, e.deltaY > 0);
      } else {
        this._showGroupWheelPopup(e.clientX, e.clientY, e.deltaY > 0);
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
      newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - btn.offsetWidth));
      newTop = Math.max(0, Math.min(newTop, window.innerHeight - btn.offsetHeight));
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
      activeFont: this.settings.activeFont || '',
      fontDisabled: this._fontDisabled || false,
      fontColor: this.settings.fontColor || '',
      fontOpacity: this.settings.fontOpacity ?? 1,
      fontLineHeight: this.settings.fontLineHeight ?? 0,
      fontMarginL: this.settings.fontMarginL ?? 0,
      fontMarginR: this.settings.fontMarginR ?? 0,
    };
  }

  // ─── 应用风格组合 ──────────────────────────────────────────────────
  async _applyPreset(preset) {
    if (!preset) return;
    try {
      if (preset.theme !== undefined) {
        await this.switchTheme(preset.theme, true);
      }
      if (preset.isDark !== undefined) {
        const currentIsDark = document.body.classList.contains('theme-dark');
        if (currentIsDark !== preset.isDark) await this.toggleMode(true);
      }
      if (preset.eyeCareColor !== undefined) {
        this.settings.eyeCareColor = preset.eyeCareColor;
        this.applyEyeCareColor();
      }
      if (preset.enabledSnippets && Array.isArray(preset.enabledSnippets)) {
        const { snippetFiles } = await this.getSnippetInfo();
        for (const name of snippetFiles) {
          this._setSnippetEnabled(name, preset.enabledSnippets.includes(name));
        }
      }
      if (preset.activeFont !== undefined) this.settings.activeFont = preset.activeFont;
      if (preset.fontDisabled !== undefined) this._fontDisabled = preset.fontDisabled;
      if (preset.fontColor !== undefined) this.settings.fontColor = preset.fontColor;
      if (preset.fontOpacity !== undefined) this.settings.fontOpacity = preset.fontOpacity;
      if (preset.fontLineHeight !== undefined) this.settings.fontLineHeight = preset.fontLineHeight;
      if (preset.fontMarginL !== undefined) this.settings.fontMarginL = preset.fontMarginL;
      if (preset.fontMarginR !== undefined) this.settings.fontMarginR = preset.fontMarginR;
      this.applyFontSettings();
      await this.saveSettings();
    } catch (_e) {}
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

    if (!profile) {
      const hasDefault = this.settings.defaultTheme || this.settings.defaultEyeCareColor || this.settings.defaultThemeMode || this.settings.defaultEyeCareMode;
      if (!hasDefault) {
        // 无记忆且无默认：保持当前背景不变（不再清空），避免记忆模式下打开新页面背景消失
        if (this.settings.eyeCareColor) {
          this.applyEyeCareColor();
        }
        return;
      }
      try {
        if (this.settings.defaultThemeMode) {
          const currentIsDark = document.body.classList.contains('theme-dark');
          const wantDark = this.settings.defaultThemeMode === 'dark';
          if (currentIsDark !== wantDark) await this.toggleMode(true);
        }
        if (this.settings.defaultTheme) {
          await this.switchTheme(this.settings.defaultTheme, true);
        }
        if (this.settings.defaultEyeCareMode && !this.settings.defaultThemeMode) {
          const currentIsDark = document.body.classList.contains('theme-dark');
          const wantDark = this.settings.defaultEyeCareMode === 'dark';
          if (currentIsDark !== wantDark) await this.toggleMode(true);
        }
        if (this.settings.defaultEyeCareColor) {
          const dec = this.settings.defaultEyeCareColor;
          if (dec.startsWith('__snippet__')) {
            const snippetName = dec.slice('__snippet__'.length);
            this._setSnippetEnabled(snippetName, true);
            this.settings.eyeCareColor = '';
            this.applyEyeCareColor();
          } else {
            this.settings.eyeCareColor = dec;
            this.applyEyeCareColor();
          }
          await this.saveSettings();
        }
      } catch (_e) {}
      return;
    }
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
      if (profile.activeFont !== undefined) {
        this.settings.activeFont = profile.activeFont;
      }
      if (profile.fontDisabled !== undefined) {
        this._fontDisabled = profile.fontDisabled;
      }
      if (profile.fontColor !== undefined) {
        this.settings.fontColor = profile.fontColor;
      }
      if (profile.fontOpacity !== undefined) {
        this.settings.fontOpacity = profile.fontOpacity;
      }
      if (profile.fontLineHeight !== undefined) {
        this.settings.fontLineHeight = profile.fontLineHeight;
      }
      if (profile.fontMarginL !== undefined) {
        this.settings.fontMarginL = profile.fontMarginL;
      }
      if (profile.fontMarginR !== undefined) {
        this.settings.fontMarginR = profile.fontMarginR;
      }
      this.applyFontSettings();
      await this.saveSettings();
    } catch (_e) {
    }
  }

  async _applyAutoBgByName(filePath) {
    if (!this.settings.autoBgByName || !filePath) return;
    const fileName = filePath.replace(/^.*[\/\\]/, '').replace(/\.[^.]+$/, '');
    if (!fileName) return;
    const imgs = this.settings.bgImages || [];
    const matchedIdx = imgs.findIndex(img => {
      const imgLabel = (img.label || img.url || '').replace(/\.[^.]+$/, '');
      return imgLabel === fileName;
    });
    if (matchedIdx >= 0) {
      this.settings.eyeCareColor = `__img_${matchedIdx}`;
      const bgMembers = this.settings.groups['__bg__'] || [];
      for (const name of bgMembers) { this._setSnippetEnabled(name, false); }
      this.applyEyeCareColor();
      await this.saveSettings();
    } else if (!this.settings.styleMemory) {
      // 未匹配到同名图片：保持当前背景不变（不再清空）
      if (this.settings.eyeCareColor) {
        this.applyEyeCareColor();
      }
    }
  }

  async _applyDefaultBackground() {
    const dec = this.settings.defaultEyeCareColor;
    if (dec) {
      if (dec.startsWith('__snippet__')) {
        const snippetName = dec.slice('__snippet__'.length);
        this._setSnippetEnabled(snippetName, true);
        this.settings.eyeCareColor = '';
        this.applyEyeCareColor();
      } else {
        this.settings.eyeCareColor = dec;
        this.applyEyeCareColor();
      }
    } else {
      // 无默认背景时保持当前背景不变（不再无条件清空），避免点击图片后切换页面背景消失
      if (this.settings.eyeCareColor) {
        this.applyEyeCareColor();
      }
    }
    await this.saveSettings();
  }

  _showSsChipTooltip(anchor, options) {
    this._hideSsChipTooltip();
    if (!options || options.length === 0) return;
    const tip = document.createElement('div');
    tip.className = 'ss-chip-tooltip';
    tip.style.cssText = 'position:fixed;z-index:10001;background:rgba(var(--mono-rgb-0),0.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--background-modifier-border);border-radius:6px;padding:4px 0;box-shadow:0 4px 16px rgba(0,0,0,0.25);min-width:120px;';
    options.forEach(opt => {
      const row = document.createElement('div');
      row.textContent = opt.label;
      row.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:13px;color:var(--text-normal);';
      row.addEventListener('mouseenter', () => { row.style.background = 'var(--background-modifier-hover)'; });
      row.addEventListener('mouseleave', () => { row.style.background = 'transparent'; });
      row.addEventListener('click', async (ev) => { ev.stopPropagation(); this._hideSsChipTooltip(); if (opt.action) await opt.action(); });
      tip.appendChild(row);
    });
    tip.addEventListener('mouseleave', () => { this._ssChipTooltipTimer = setTimeout(() => this._hideSsChipTooltip(), 120); });
    tip.addEventListener('mouseenter', () => { if (this._ssChipTooltipTimer) { clearTimeout(this._ssChipTooltipTimer); this._ssChipTooltipTimer = null; } });
    document.body.appendChild(tip);
    const rect = anchor.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    let left = rect.left;
    let top = rect.bottom + 4;
    if (left + tipRect.width > window.innerWidth - 4) left = window.innerWidth - tipRect.width - 4;
    if (left < 4) left = 4;
    if (top + tipRect.height > window.innerHeight - 4) top = rect.top - tipRect.height - 4;
    if (top < 4) top = 4;
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
    this._ssChipTooltip = tip;
  }

  _hideSsChipTooltip() {
    if (this._ssChipTooltipTimer) { clearTimeout(this._ssChipTooltipTimer); this._ssChipTooltipTimer = null; }
    if (this._ssChipTooltip) { this._ssChipTooltip.remove(); this._ssChipTooltip = null; }
  }

  _attachSsChipHover(chip, buildOpts) {
    if (isMobile) return;
    if (!this.settings.chipHoverHint) return;
    chip.addEventListener('mouseenter', () => {
      if (this._ssChipTooltipTimer) { clearTimeout(this._ssChipTooltipTimer); this._ssChipTooltipTimer = null; }
      this._showSsChipTooltip(chip, buildOpts());
    });
    chip.addEventListener('mouseleave', () => {
      this._ssChipTooltipTimer = setTimeout(() => { if (this._ssChipTooltip && !this._ssChipTooltip.matches(':hover')) this._hideSsChipTooltip(); }, 120);
    });
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
    popup.style.cssText = isMobile
      ? `position:fixed;background:rgba(var(--mono-rgb-0),0.9);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid var(--background-modifier-border);border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.4);z-index:10000;padding:10px 0;width:94vw;max-width:94vw;max-height:88vh;display:flex;flex-direction:column;`
      : `position:fixed;background:rgba(var(--mono-rgb-0),0.75);backdrop-filter:blur(16px) saturate(180%);-webkit-backdrop-filter:blur(16px) saturate(180%);border:1px solid rgba(255,255,255,0.12);border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,0.35);z-index:10000;padding:10px 0;min-width:360px;min-height:200px;width:480px;max-width:95vw;max-height:90vh;display:flex;flex-direction:column;`;
    // 恢复保存的大小
    if (!isMobile && this.settings.popupSize) {
      popup.style.width = this.settings.popupSize.width + 'px';
      popup.style.height = this.settings.popupSize.height + 'px';
    }
    if (!isMobile && restoreLeft && restoreTop) {
      popup.style.left = restoreLeft;
      popup.style.top = restoreTop;
    } else if (!isMobile && this.settings.popupPosition) {
      popup.style.left = this.settings.popupPosition.left;
      popup.style.top = this.settings.popupPosition.top;
    } else {
      requestAnimationFrame(() => {
        const w = popup.offsetWidth, h = popup.offsetHeight;
        popup.style.left = Math.round((window.innerWidth - w) / 2) + 'px';
        popup.style.top = Math.round((window.innerHeight - h) / 2) + 'px';
      });
    }

    // ── 固定配色，不跟随主题 ──────────────────────────────────────────
    const _isDark = !!(document.body.classList.contains('theme-dark') ||
                       (this.app.getThemeManager && this.app.getThemeManager().isDark) ||
                       getComputedStyle(document.body).colorScheme === 'dark' ||
                       window.matchMedia('(prefers-color-scheme: dark)').matches);
    const _ssFixed = _isDark ? {
      '--mono-rgb-0': '38, 38, 36',
      '--ss-popup-bg': '#262624',
      '--background-primary': '#262624',
      '--background-secondary': '#2c2c29',
      '--background-modifier-border': '#3b3b37',
      '--background-modifier-hover': '#383834',
      '--text-normal': '#e8e6e0',
      '--text-muted': '#8f8c84',
      '--text-faint': '#5c5a54',
      '--interactive-accent': '#8fc2ad',
      '--interactive-accent-rgb': '143, 194, 173',
      '--text-error': '#e0728b',
    } : {
      '--mono-rgb-0': '252, 251, 248',
      '--ss-popup-bg': '#fcfbf8',
      '--background-primary': '#fcfbf8',
      '--background-secondary': '#f4f2ed',
      '--background-modifier-border': '#dedbd3',
      '--background-modifier-hover': '#ebe8e1',
      '--text-normal': '#2b2a27',
      '--text-muted': '#8d8a82',
      '--text-faint': '#b8b5ac',
      '--interactive-accent': '#4f7a6a',
      '--interactive-accent-rgb': '79, 122, 106',
      '--text-error': '#b0405a',
    };
    for (const [k, v] of Object.entries(_ssFixed)) popup.style.setProperty(k, v);
    popup.style.background = _ssFixed['--ss-popup-bg'];

    const _ssApplyFixedColors = () => {
      const dark = !!(document.body.classList.contains('theme-dark') ||
                       (this.app.getThemeManager && this.app.getThemeManager().isDark) ||
                       window.matchMedia('(prefers-color-scheme: dark)').matches);
      const fixed = dark ? {
        '--mono-rgb-0': '38, 38, 36', '--ss-popup-bg': '#262624',
        '--background-primary': '#262624', '--background-secondary': '#2c2c29',
        '--background-modifier-border': '#3b3b37', '--background-modifier-hover': '#383834',
        '--text-normal': '#e8e6e0', '--text-muted': '#8f8c84', '--text-faint': '#5c5a54',
        '--interactive-accent': '#8fc2ad', '--interactive-accent-rgb': '143, 194, 173',
        '--text-error': '#e0728b',
      } : {
        '--mono-rgb-0': '252, 251, 248', '--ss-popup-bg': '#fcfbf8',
        '--background-primary': '#fcfbf8', '--background-secondary': '#f4f2ed',
        '--background-modifier-border': '#dedbd3', '--background-modifier-hover': '#ebe8e1',
        '--text-normal': '#2b2a27', '--text-muted': '#8d8a82', '--text-faint': '#b8b5ac',
        '--interactive-accent': '#4f7a6a', '--interactive-accent-rgb': '79, 122, 106',
        '--text-error': '#b0405a',
      };
      for (const [k, v] of Object.entries(fixed)) popup.style.setProperty(k, v);
      popup.style.background = fixed['--ss-popup-bg'];
    };
    const _ssThemeObserver = new MutationObserver(() => { if (document.body.contains(popup)) _ssApplyFixedColors(); else _ssThemeObserver.disconnect(); });
    _ssThemeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // ── 头部 ──────────────────────────────────────────────────────────
    const header = popup.createDiv();
    header.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:12px;padding:0 12px;cursor:move;flex-shrink:0;';

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

    if (isMobile) {
      const modeSwitch = leftHeader.createEl('span');
      const isDark = document.body.classList.contains('theme-dark');
      modeSwitch.textContent = isDark ? t('mode.dark') : t('mode.light');
      modeSwitch.style.cssText = 'font-size:11px;padding:2px 8px;border-radius:10px;cursor:pointer;user-select:none;border:1px solid var(--interactive-accent);background:var(--interactive-accent);color:#fff;margin-left:8px;';
      modeSwitch.addEventListener('click', async () => {
        await this.toggleMode();
        modeSwitch.textContent = document.body.classList.contains('theme-dark') ? t('mode.dark') : t('mode.light');
      });
    }

    // Spacer
    const headerSpacer = header.createDiv();
    headerSpacer.style.cssText = 'flex:1;';

    // Memory mode chip (in header)
    const _hdrMemChip = header.createEl('span');
    const _hdrMemActive = this.settings.styleMemory;
    _hdrMemChip.textContent = t('styleMemory.chip');
    _hdrMemChip.title = t('styleMemory.hint');
    _hdrMemChip.style.cssText = `
      display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;cursor:pointer;
      user-select:none;transition:all 0.2s ease;
      border:1px solid ${_hdrMemActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
      background:${_hdrMemActive ? 'var(--interactive-accent)' : 'rgba(var(--mono-rgb-0),0.5)'};
      color:${_hdrMemActive ? '#fff' : 'var(--text-muted)'};
      ${_hdrMemActive ? 'box-shadow:0 0 6px rgba(var(--interactive-accent-rgb),0.4);' : ''}
    `;
    _hdrMemChip.addEventListener('click', async () => {
      this.settings.styleMemory = !this.settings.styleMemory;
      await this.saveSettings();
      const on = this.settings.styleMemory;
      _hdrMemChip.style.borderColor = on ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
      _hdrMemChip.style.background = on ? 'var(--interactive-accent)' : 'rgba(var(--mono-rgb-0),0.5)';
      _hdrMemChip.style.color = on ? '#fff' : 'var(--text-muted)';
      _hdrMemChip.style.boxShadow = on ? '0 0 6px rgba(var(--interactive-accent-rgb),0.4)' : '';
      new Notice(on ? t('styleMemory.on') : t('styleMemory.off'));
    });

    // Desktop: dark/light mode switch with pull cord (in header)
    if (!isMobile) {
      const _hdrIsDark = document.body.classList.contains('theme-dark');
      const _hdrModeSwitch = header.createDiv();
      _hdrModeSwitch.className = 'ss-mode-switch';
      const _hdrHasFloat = !!this.settings.floatingButton;
      _hdrModeSwitch.style.cssText = `
        display:${_hdrHasFloat ? 'none' : 'inline-flex'};align-items:center;justify-content:center;
        width:18px;height:18px;border-radius:50%;cursor:pointer;user-select:none;
        transition:all 0.15s ease;touch-action:none;position:relative;
        background:${_hdrIsDark ? 'linear-gradient(135deg,#ff9a3c,#ffe44d)' : 'linear-gradient(135deg,#c8c8c8,#e8e8e8)'};
        box-shadow:${_hdrIsDark ? '0 2px 8px rgba(255,154,60,0.3)' : '0 2px 6px rgba(0,0,0,0.1)'};
        opacity:0.85;
      `;
      _hdrModeSwitch.addEventListener('mouseenter', () => { _hdrModeSwitch.style.opacity = '1'; });
      _hdrModeSwitch.addEventListener('mouseleave', () => { _hdrModeSwitch.style.opacity = '0.85'; });

      const _hdrPullCord = _hdrModeSwitch.createEl('div');
      _hdrPullCord.style.cssText = `
        position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:2px;
        display:flex;flex-direction:column;align-items:center;cursor:ns-resize;
        user-select:none;opacity:0.6;transition:opacity 0.2s ease;
        touch-action:none;z-index:1;
      `;
      const _hdrCordLine = _hdrPullCord.createEl('div');
      _hdrCordLine.style.cssText = `
        width:2px;height:14px;
        background:linear-gradient(to bottom,var(--text-faint),var(--text-muted));
        border-radius:1px;transition:height 0.15s ease;
      `;
      const _hdrCordKnob = _hdrPullCord.createEl('div');
      _hdrCordKnob.style.cssText = `
        width:6px;height:6px;border-radius:50%;
        background:radial-gradient(circle at 35% 35%,var(--text-normal),var(--text-muted));
        box-shadow:0 1px 3px rgba(0,0,0,0.3);
        transition:transform 0.15s ease,box-shadow 0.15s ease;
      `;
      _hdrPullCord.addEventListener('mouseenter', () => { _hdrPullCord.style.opacity = '1'; _hdrModeSwitch.style.opacity = '1'; });
      _hdrPullCord.addEventListener('mouseleave', () => { if (!_hdrPullDragging) _hdrPullCord.style.opacity = '0.6'; });

      let _hdrPullDragging = false;
      let _hdrPullStartY = 0;
      const _hdrPullThreshold = 20;
      _hdrPullCord.addEventListener('mousedown', (e) => {
        e.preventDefault(); e.stopPropagation();
        _hdrPullDragging = true; _hdrPullStartY = e.clientY;
        _hdrCordLine.style.transition = 'none'; _hdrCordKnob.style.transition = 'none';
      });
      const _hdrOnPullMove = (e) => {
        if (!_hdrPullDragging) return;
        e.preventDefault();
        const dy = e.clientY - _hdrPullStartY;
        _hdrCordLine.style.height = Math.max(8, 14 + dy) + 'px';
        const scale = 1 + Math.min(dy / _hdrPullThreshold, 0.4);
        _hdrCordKnob.style.transform = `scale(${scale})`;
        _hdrCordKnob.style.boxShadow = dy > _hdrPullThreshold * 0.6
          ? '0 2px 6px rgba(0,0,0,0.4), 0 0 4px var(--interactive-accent)'
          : '0 1px 3px rgba(0,0,0,0.3)';
      };
      const _hdrOnPullEnd = async (e) => {
        if (!_hdrPullDragging) return;
        _hdrPullDragging = false;
        const dy = e.clientY - _hdrPullStartY;
        _hdrCordLine.style.transition = 'height 0.3s cubic-bezier(0.34,1.56,0.64,1)';
        _hdrCordKnob.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
        _hdrCordLine.style.height = '14px';
        _hdrCordKnob.style.transform = 'scale(1)';
        _hdrCordKnob.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
        if (dy > _hdrPullThreshold) {
          _hdrCordKnob.style.background = 'radial-gradient(circle at 35% 35%,var(--interactive-accent),var(--text-muted))';
          setTimeout(() => {
            _hdrCordKnob.style.background = 'radial-gradient(circle at 35% 35%,var(--text-normal),var(--text-muted))';
          }, 400);
          await this.toggleMode();
          const nowDark = document.body.classList.contains('theme-dark');
          _hdrModeSwitch.style.background = nowDark ? 'linear-gradient(135deg,#ff9a3c,#ffe44d)' : 'linear-gradient(135deg,#c8c8c8,#e8e8e8)';
          _hdrModeSwitch.style.boxShadow = nowDark ? '0 2px 8px rgba(255,154,60,0.3)' : '0 2px 6px rgba(0,0,0,0.1)';
          if (typeof renderThemes === 'function') await renderThemes();
        }
      };
      document.addEventListener('mousemove', _hdrOnPullMove);
      document.addEventListener('mouseup', _hdrOnPullEnd);

      _hdrModeSwitch.addEventListener('click', async () => {
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
          _hdrModeSwitch.style.display = 'inline-flex';
        } else {
          const popupEl = document.getElementById('ss-snippets-popup');
          let fbX = window.innerWidth - 40;
          if (popupEl) {
            const rect = popupEl.getBoundingClientRect();
            fbX = rect.right + 50;
            if (fbX > window.innerWidth - 40) fbX = window.innerWidth - 40;
          }
          this.settings.floatingButton = {
            text: t('float.defaultText'),
            css: '',
            position: { x: fbX, y: 100 },
          };
          await this.saveSettings();
          this.createFloatingButton();
          _hdrModeSwitch.style.display = 'none';
        }
      });
    }

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
    const startDrag = (clientX, clientY) => {
      isDraggingPopup = true;
      const rect = popup.getBoundingClientRect();
      dragOffX = clientX - Math.round(rect.left);
      dragOffY = clientY - Math.round(rect.top);
    };
    const moveDrag = (clientX, clientY) => {
      if (!isDraggingPopup) return;
      popup.style.left = Math.round(clientX - dragOffX) + 'px';
      popup.style.top = Math.round(clientY - dragOffY) + 'px';
      updateResizeHandlePosition();
    };
    const endDrag = () => {
      if (isDraggingPopup) {
        isDraggingPopup = false;
        this.settings.popupPosition = { left: popup.style.left, top: popup.style.top };
        this.saveSettings();
      }
    };

    header.addEventListener('mousedown', (e) => {
      if (e.target === closeBtn || e.target === langSwitch || e.target === _hdrMemChip || e.target === searchInput || e.target.closest('.ss-mode-switch')) return;
      startDrag(e.clientX, e.clientY);
    });
    document.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    document.addEventListener('mouseup', () => endDrag());
    header.addEventListener('touchstart', (e) => {
      if (e.target === closeBtn || e.target === langSwitch || e.target === _hdrMemChip || e.target === searchInput || e.target.closest('.ss-mode-switch')) return;
      const t = e.touches[0];
      startDrag(t.clientX, t.clientY);
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
      if (!isDraggingPopup) return;
      e.preventDefault();
      const t = e.touches[0];
      moveDrag(t.clientX, t.clientY);
    }, { passive: false });
    document.addEventListener('touchend', () => endDrag());


    // ── 搜索框（手机端 stateBar / 桌面端标题栏悬停展开）──────────────
    let searchInput;
    if (isMobile) {
      const stateBar = popup.createDiv();
      stateBar.style.cssText = 'flex-shrink:0;display:flex;align-items:center;gap:8px;padding:6px 12px;border-bottom:1px solid var(--background-modifier-border);background:rgba(var(--mono-rgb-0),0.3);';
      searchInput = stateBar.createEl('input', { type: 'search' });
      searchInput.placeholder = 'Search...';
      searchInput.style.cssText = 'border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal);border-radius:6px;padding:3px 8px;width:100%;font-size:12px;flex-shrink:0;';
    } else {
      searchInput = header.createEl('input', { type: 'search' });
      searchInput.placeholder = 'Search...';
      searchInput.style.cssText = 'border:1px solid transparent;background:var(--background-primary);color:var(--text-normal);border-radius:6px;padding:3px 0;width:0;font-size:12px;flex-shrink:0;opacity:0;transition:width 0.2s ease,opacity 0.2s ease,padding 0.2s ease,border-color 0.2s ease;overflow:hidden;';
      header.insertBefore(searchInput, _hdrMemChip);
      const _expandSearch = () => {
        searchInput.style.width = '140px';
        searchInput.style.padding = '3px 8px';
        searchInput.style.opacity = '1';
        searchInput.style.borderColor = 'var(--background-modifier-border)';
      };
      const _collapseSearch = () => {
        if (searchInput.value.trim()) return;
        searchInput.style.width = '0';
        searchInput.style.padding = '3px 0';
        searchInput.style.opacity = '0';
        searchInput.style.borderColor = 'transparent';
      };
      header.addEventListener('mouseenter', _expandSearch);
      header.addEventListener('mouseleave', _collapseSearch);
      searchInput.addEventListener('focus', _expandSearch);
      searchInput.addEventListener('blur', _collapseSearch);
    }

    // ── 主体（nav + main）────────────────────────────────────────────
    const body = popup.createDiv();
    body.style.cssText = isMobile
      ? 'flex:1;display:flex;flex-direction:column;min-height:0;'
      : 'flex:1;display:flex;min-height:0;';
    const nav = body.createDiv();
    nav.style.cssText = isMobile
      ? 'flex:none;border-bottom:1px solid var(--background-modifier-border);display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:6px;overflow:visible;'
      : 'width:170px;flex:none;border-right:1px solid var(--background-modifier-border);padding:6px;overflow-y:auto;';
    const main = body.createDiv();
    main.style.cssText = 'flex:1;overflow-y:auto;overflow-x:hidden;padding:8px 12px;min-width:0;';

    // ── 主题区域 ──────────────────────────────────────────────────────
    const themeArea = main.createDiv();
    themeArea.style.cssText = 'margin-bottom:12px;padding-bottom:10px;';

    const renderThemes = async () => {
      themeArea.empty();
      let { currentTheme, themeDirs } = await this.getThemeInfo();

      const themeLabel = themeArea.createEl('div', { text: t('theme.section') });
      themeLabel.style.cssText = 'font-size:12px;font-weight:600;color:var(--text-normal);margin-bottom:6px;';

      if (themeDirs.length === 0) {
        const hint = themeArea.createEl('span', { text: t('theme.noThemes') });
        hint.style.cssText = 'font-size:12px;color:var(--text-muted);';
        return;
      }

      const themeChips = themeArea.createDiv();
      themeChips.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;';

      const applyThemeChipStyle = (el, active) => {
        el.style.borderColor = active ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
        el.style.background = active ? 'var(--interactive-accent)' : 'rgba(var(--mono-rgb-0),0.5)';
        el.style.color = active ? '#fff' : 'var(--text-muted)';
      };

      // 默认主题 chip
      const defaultChip = themeChips.createEl('span');
      const isDefaultActive = currentTheme === '';
      let defaultPreviewing = false;
      defaultChip.style.cssText = `
        display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:14px;font-size:12px;cursor:pointer;
        user-select:none;transition:all 0.15s ease;
        border:1px solid ${isDefaultActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
        background:${isDefaultActive ? 'var(--interactive-accent)' : 'rgba(var(--mono-rgb-0),0.5)'};
        color:${isDefaultActive ? '#fff' : 'var(--text-muted)'};
      `;
      const defaultLabel = defaultChip.createEl('span', { text: t('theme.default') });
      const _defaultUsedBy = Object.entries(this.settings.pageStyles || {}).filter(([fp, p]) => p.theme === '').map(([fp]) => fp);
      if (_defaultUsedBy.length > 0) {
        const badge = defaultChip.createEl('span');
        badge.textContent = '◉' + _defaultUsedBy.length;
        badge.style.cssText = 'font-size:10px;opacity:0.7;border-radius:8px;padding:0 4px;flex-shrink:0;cursor:pointer;';
        badge.title = t('memory.usedBy').replace('{0}', String(_defaultUsedBy.length));
        badge.addEventListener('click', (e) => {
          e.stopPropagation();
          this._showMemoryPopup(badge, _defaultUsedBy, t('theme.default'), 'theme', popup._ssRefreshAfterForget);
        });
      }
      this._bindHoverPreview(defaultChip,
        () => { if (currentTheme === '') return; defaultPreviewing = true; this._previewTheme(''); },
        () => { if (!defaultPreviewing) return; defaultPreviewing = false; this._previewTheme(currentTheme); }
      );
      defaultChip.addEventListener('click', async () => {
        defaultPreviewing = false;
        if (currentTheme === '') return;
        currentTheme = '';
        await this.switchTheme('');
        applyThemeChipStyle(defaultChip, true);
        themeChipEls.forEach(({ el, name }) => applyThemeChipStyle(el, false));
      });
      const buildDefaultThemeOpts = () => {
        const opts = [];
        if (this.settings.defaultTheme !== '') {
          opts.push({ label: t('theme.clearDefault'), action: async () => {
            this.settings.defaultTheme = '';
            await this.saveSettings();
            new Notice(t('theme.clearDefaultDone'));
          }});
        } else {
          opts.push({ label: t('theme.setAsDefault'), action: async () => {
            this.settings.defaultTheme = '';
            await this.saveSettings();
            new Notice(t('theme.setAsDefaultDone'));
          }});
        }
        const _dmOn = !!this.settings.defaultThemeMode;
        opts.push({ label: (_dmOn ? '✓ ' : '○ ') + t('theme.defaultMode'), action: async () => {
          if (this.settings.defaultThemeMode) {
            this.settings.defaultThemeMode = '';
          } else {
            this.settings.defaultThemeMode = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
          }
          await this.saveSettings();
        }});
        return opts;
      };
      defaultChip.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        defaultPreviewing = false;
        const menu = document.createElement('div');
        menu.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;background:rgba(var(--mono-rgb-0),0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--background-modifier-border);border-radius:6px;padding:4px 0;z-index:10001;box-shadow:0 4px 16px rgba(0,0,0,0.25);min-width:120px;`;
        const mkItem = (label, action) => {
          const item = document.createElement('div');
          item.textContent = label;
          item.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:13px;color:var(--text-normal);';
          item.addEventListener('mouseenter', () => { item.style.background = 'var(--background-modifier-hover)'; });
          item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; });
          item.addEventListener('click', async (ev) => { ev.stopPropagation(); menu.remove(); await action(); });
          menu.appendChild(item);
        };
        if (this.settings.defaultTheme !== '') {
          mkItem(t('theme.clearDefault'), async () => {
            this.settings.defaultTheme = '';
            await this.saveSettings();
            new Notice(t('theme.clearDefaultDone'));
          });
        } else {
          mkItem(t('theme.setAsDefault'), async () => {
            this.settings.defaultTheme = '';
            await this.saveSettings();
            new Notice(t('theme.setAsDefaultDone'));
          });
        }
        const mkToggle = (label, isOn, action) => {
          const item = document.createElement('div');
          item.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:13px;color:var(--text-normal);display:flex;align-items:center;justify-content:space-between;gap:12px;';
          const labelEl = document.createElement('span');
          labelEl.textContent = label;
          const toggle = document.createElement('span');
          toggle.style.cssText = `display:inline-block;width:28px;height:16px;border-radius:8px;position:relative;transition:background 0.15s ease;background:${isOn ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};flex-shrink:0;`;
          const knob = document.createElement('span');
          knob.style.cssText = `position:absolute;top:2px;left:${isOn ? '14px' : '2px'};width:12px;height:12px;border-radius:50%;background:#fff;transition:left 0.15s ease;`;
          toggle.appendChild(knob);
          item.appendChild(labelEl);
          item.appendChild(toggle);
          item.addEventListener('mouseenter', () => { item.style.background = 'var(--background-modifier-hover)'; });
          item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; });
          item.addEventListener('click', async (ev) => { ev.stopPropagation(); menu.remove(); await action(); });
          menu.appendChild(item);
        };
        mkToggle(t('theme.defaultMode'), !!this.settings.defaultThemeMode, async () => {
          if (this.settings.defaultThemeMode) {
            this.settings.defaultThemeMode = '';
          } else {
            this.settings.defaultThemeMode = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
          }
          await this.saveSettings();
        });
        document.body.appendChild(menu);
        const closeMenu = (ev) => {
          if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('click', closeMenu); }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 0);
      });
      this._attachSsChipHover(defaultChip, buildDefaultThemeOpts);

      const themeChipEls = [];
      const _themeUsedBy = (themeName) => {
        const ps = this.settings.pageStyles || {};
        return Object.entries(ps).filter(([fp, p]) => p.theme === themeName).map(([fp]) => fp);
      };
      themeDirs.forEach(themeName => {
        const chip = themeChips.createEl('span');
        const isActive = currentTheme === themeName;
        let themePreviewing = false;
        chip.style.cssText = `
          display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:14px;font-size:12px;cursor:pointer;
          user-select:none;transition:all 0.15s ease;max-width:220px;overflow:hidden;
          border:1px solid ${isActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
          background:${isActive ? 'var(--interactive-accent)' : 'rgba(var(--mono-rgb-0),0.5)'};
          color:${isActive ? '#fff' : 'var(--text-muted)'};
        `;
        const chipLabel = chip.createEl('span', { text: themeName });
        chipLabel.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
        chip.title = themeName;
        const _usedBy = _themeUsedBy(themeName);
        if (_usedBy.length > 0) {
          const badge = chip.createEl('span');
          badge.textContent = '◉' + _usedBy.length;
          badge.style.cssText = 'font-size:10px;opacity:0.7;border-radius:8px;padding:0 4px;flex-shrink:0;cursor:pointer;';
          badge.title = t('memory.usedBy').replace('{0}', String(_usedBy.length));
          badge.addEventListener('click', (e) => {
            e.stopPropagation();
            const refresh = popup._ssRefreshAfterForget;
            this._showMemoryPopup(badge, _usedBy, themeName, 'theme', refresh);
          });
        }
        themeChipEls.push({ el: chip, name: themeName });
        this._bindHoverPreview(chip,
          () => { if (currentTheme === themeName) return; themePreviewing = true; this._previewTheme(themeName); },
          () => { if (!themePreviewing) return; themePreviewing = false; this._previewTheme(currentTheme); }
        );
        chip.addEventListener('click', async () => {
          themePreviewing = false;
          if (currentTheme === themeName) return;
          currentTheme = themeName;
          await this.switchTheme(themeName);
          applyThemeChipStyle(defaultChip, false);
          themeChipEls.forEach(({ el, name }) => applyThemeChipStyle(el, name === themeName));
        });
        const buildThemeOpts = () => {
          const opts = [];
          if (this.settings.defaultTheme === themeName) {
            opts.push({ label: t('theme.clearDefault'), action: async () => {
              this.settings.defaultTheme = '';
              await this.saveSettings();
              new Notice(t('theme.clearDefaultDone'));
              await renderThemes();
            }});
          } else {
            opts.push({ label: t('theme.setAsDefault'), action: async () => {
              this.settings.defaultTheme = themeName;
              await this.saveSettings();
              new Notice(t('theme.setAsDefaultDone'));
              await renderThemes();
            }});
          }
          const _dmOn = !!this.settings.defaultThemeMode;
          opts.push({ label: (_dmOn ? '✓ ' : '○ ') + t('theme.defaultMode'), action: async () => {
            if (this.settings.defaultThemeMode) {
              this.settings.defaultThemeMode = '';
            } else {
              this.settings.defaultThemeMode = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
            }
            await this.saveSettings();
          }});
          opts.push({ label: t('theme.delete'), action: async () => {
            const confirmMsg = t('theme.deleteConfirm').replace('{0}', themeName);
            if (isActive) {
              const hint = t('theme.activeDeleteHint');
              if (!confirm(confirmMsg + '\n' + hint)) return;
              await this.switchTheme('');
              currentTheme = '';
            } else {
              if (!confirm(confirmMsg)) return;
            }
            try {
              if (isMobile) {
                await this.app.vault.adapter.rmdir('.obsidian/themes/' + themeName, true);
              } else {
                const themePath = _joinPath(this.app.vault.adapter.basePath, '.obsidian', 'themes', themeName);
                nodeFs.rmSync(themePath, { recursive: true, force: true });
              }
              new Notice(t('theme.deleted'));
              await renderThemes();
            } catch (_e) {
              new Notice(t('theme.deleteFailed'));
            }
          }});
          return opts;
        };
        chip.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          themePreviewing = false;
          const menu = document.createElement('div');
          menu.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;background:rgba(var(--mono-rgb-0),0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--background-modifier-border);border-radius:6px;padding:4px 0;z-index:10001;box-shadow:0 4px 16px rgba(0,0,0,0.25);min-width:120px;`;
          const mkItem = (label, action) => {
            const item = document.createElement('div');
            item.textContent = label;
            item.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:13px;color:var(--text-normal);';
            item.addEventListener('mouseenter', () => { item.style.background = 'var(--background-modifier-hover)'; });
            item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; });
            item.addEventListener('click', async (ev) => { ev.stopPropagation(); menu.remove(); await action(); });
            menu.appendChild(item);
          };
          if (this.settings.defaultTheme === themeName) {
            mkItem(t('theme.clearDefault'), async () => {
              this.settings.defaultTheme = '';
              await this.saveSettings();
              new Notice(t('theme.clearDefaultDone'));
              await renderThemes();
            });
          } else {
            mkItem(t('theme.setAsDefault'), async () => {
              this.settings.defaultTheme = themeName;
              await this.saveSettings();
              new Notice(t('theme.setAsDefaultDone'));
              await renderThemes();
            });
          }
          const mkToggle = (label, isOn, action) => {
            const item = document.createElement('div');
            item.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:13px;color:var(--text-normal);display:flex;align-items:center;justify-content:space-between;gap:12px;';
            const labelEl = document.createElement('span');
            labelEl.textContent = label;
            const toggle = document.createElement('span');
            toggle.style.cssText = `display:inline-block;width:28px;height:16px;border-radius:8px;position:relative;transition:background 0.15s ease;background:${isOn ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};flex-shrink:0;`;
            const knob = document.createElement('span');
            knob.style.cssText = `position:absolute;top:2px;left:${isOn ? '14px' : '2px'};width:12px;height:12px;border-radius:50%;background:#fff;transition:left 0.15s ease;`;
            toggle.appendChild(knob);
            item.appendChild(labelEl);
            item.appendChild(toggle);
            item.addEventListener('mouseenter', () => { item.style.background = 'var(--background-modifier-hover)'; });
            item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; });
            item.addEventListener('click', async (ev) => { ev.stopPropagation(); menu.remove(); await action(); });
            menu.appendChild(item);
          };
          mkToggle(t('theme.defaultMode'), !!this.settings.defaultThemeMode, async () => {
            if (this.settings.defaultThemeMode) {
              this.settings.defaultThemeMode = '';
            } else {
              this.settings.defaultThemeMode = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
            }
            await this.saveSettings();
          });
          mkItem(t('theme.delete'), async () => {
            const confirmMsg = t('theme.deleteConfirm').replace('{0}', themeName);
            if (isActive) {
              const hint = t('theme.activeDeleteHint');
              if (!confirm(confirmMsg + '\n' + hint)) return;
              await this.switchTheme('');
              currentTheme = '';
            } else {
              if (!confirm(confirmMsg)) return;
            }
            try {
              if (isMobile) {
                await this.app.vault.adapter.rmdir('.obsidian/themes/' + themeName, true);
              } else {
                const themePath = _joinPath(this.app.vault.adapter.basePath, '.obsidian', 'themes', themeName);
                nodeFs.rmSync(themePath, { recursive: true, force: true });
              }
              new Notice(t('theme.deleted'));
              await renderThemes();
            } catch (_e) {
              new Notice(t('theme.deleteFailed'));
            }
          });
          document.body.appendChild(menu);
          const closeMenu = (ev) => {
            if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('click', closeMenu); }
          };
          setTimeout(() => document.addEventListener('click', closeMenu), 0);
        });
        this._attachSsChipHover(chip, buildThemeOpts);
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

      // ── 组合 chips ──────────────────────────────────────────────
      const presetArea = themeArea.createDiv();
      presetArea.style.cssText = 'margin-top:10px;padding-top:8px;border-top:1px dashed var(--background-modifier-border);';

      const presetHeader = presetArea.createDiv();
      presetHeader.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px;';
      const presetLabel = presetHeader.createEl('div', { text: t('preset.section') });
      presetLabel.style.cssText = 'font-size:12px;font-weight:600;color:var(--text-normal);';
      const presetCount = Object.keys(this.settings.stylePresets || {});
      const presetCountBadge = presetHeader.createEl('span', { text: String(presetCount.length) });
      presetCountBadge.style.cssText = 'font-size:11px;color:var(--text-muted);background:var(--background-modifier-border);border-radius:8px;padding:0 6px;';
      const presetSpacer = presetHeader.createEl('span');
      presetSpacer.style.cssText = 'flex:1;';
      const saveBtn = presetHeader.createEl('button', { text: '+ ' + t('preset.saveCurrent') });
      saveBtn.style.cssText = 'border:1px dashed var(--background-modifier-border);background:var(--background-primary);border-radius:6px;padding:3px 10px;cursor:pointer;font-size:11px;color:var(--text-muted);';
      saveBtn.addEventListener('mouseenter', () => { saveBtn.style.borderColor = 'var(--interactive-accent)'; saveBtn.style.color = 'var(--interactive-accent)'; });
      saveBtn.addEventListener('mouseleave', () => { saveBtn.style.borderColor = 'var(--background-modifier-border)'; saveBtn.style.color = 'var(--text-muted)'; });
      saveBtn.addEventListener('click', async () => {
        const name = await this._promptGroupName('', t('preset.namePrompt'));
        if (!name) return;
        const style = await this._captureCurrentStyle();
        if (!this.settings.stylePresets) this.settings.stylePresets = {};
        this.settings.stylePresets[name] = style;
        await this.saveSettings();
        new Notice(t('preset.saved') + ': ' + name);
        await renderThemes();
      });

      const presetChips = presetArea.createDiv();
      presetChips.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;min-height:24px;';

      if (presetCount.length === 0) {
        const hint = presetChips.createEl('span', { text: t('preset.empty') });
        hint.style.cssText = 'font-size:12px;color:var(--text-faint);';
      }

      const _presetGetBgLabel = (key) => {
        if (!key) return '';
        if (key.startsWith('__customcolor_')) return (this.settings.customBgColors || [])[parseInt(key.slice(14), 10)] || key;
        if (key.startsWith('__img_')) { const img = (this.settings.bgImages || [])[parseInt(key.slice(6), 10)]; return img ? (img.name || 'img') : key; }
        return key;
      };

      for (const [presetName, preset] of Object.entries(this.settings.stylePresets || {})) {
        const chip = presetChips.createEl('span');
        const chipLabel = chip.createEl('span', { text: presetName });
        chipLabel.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:140px;';
        const parts = [];
        if (preset.theme) parts.push(preset.theme);
        if (preset.eyeCareColor) { const bg = _presetGetBgLabel(preset.eyeCareColor); if (bg) parts.push(bg); }
        if (preset.activeFont) parts.push(preset.activeFont);
        chip.title = parts.join(' · ');
        chip.style.cssText = 'display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:14px;font-size:12px;cursor:pointer;border:1px solid var(--background-modifier-border);background:rgba(var(--mono-rgb-0),0.5);color:var(--text-muted);user-select:none;transition:all 0.15s ease;';

        this._bindHoverPreview(chip,
          async () => {
            chip.style.borderColor = 'var(--interactive-accent)';
            chip.style.background = 'var(--interactive-accent)';
            chip.style.color = '#fff';
            const snap = await this._captureCurrentStyle();
            await this._applyPreset(preset);
            chip._snap = snap;
          },
          async () => {
            if (chip._snap) { await this._applyPreset(chip._snap); chip._snap = null; }
            chip.style.borderColor = 'var(--background-modifier-border)';
            chip.style.background = 'rgba(var(--mono-rgb-0),0.5)';
            chip.style.color = 'var(--text-muted)';
          }
        );

        chip.addEventListener('click', async (e) => {
          e.stopPropagation();
          chip._snap = null;
          await this._applyPreset(preset);
          new Notice(t('preset.applied') + ': ' + presetName);
          await renderThemes();
          await renderEyeCare();
          renderNav();
        });

        chip.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const menu = document.createElement('div');
          menu.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;background:rgba(var(--mono-rgb-0),0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--background-modifier-border);border-radius:6px;padding:4px 0;z-index:10001;box-shadow:0 4px 16px rgba(0,0,0,0.25);min-width:120px;`;
          const mkItem = (label, action) => {
            const item = document.createElement('div');
            item.textContent = label;
            item.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:13px;color:var(--text-normal);';
            item.addEventListener('mouseenter', () => { item.style.background = 'var(--background-modifier-hover)'; });
            item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; });
            item.addEventListener('click', async (ev) => { ev.stopPropagation(); menu.remove(); await action(); });
            menu.appendChild(item);
          };
          mkItem(t('preset.overwrite'), async () => {
            if (!confirm(t('preset.overwriteConfirm').replace('{0}', presetName))) return;
            this.settings.stylePresets[presetName] = await this._captureCurrentStyle();
            await this.saveSettings();
            new Notice(t('preset.saved') + ': ' + presetName);
            await renderThemes();
          });
          mkItem(t('preset.rename'), async () => {
            const newName = await this._promptGroupName(presetName, t('preset.rename'));
            if (!newName || newName === presetName) return;
            if (this.settings.stylePresets[newName]) { new Notice('!'); return; }
            this.settings.stylePresets[newName] = this.settings.stylePresets[presetName];
            delete this.settings.stylePresets[presetName];
            await this.saveSettings();
            await renderThemes();
          });
          mkItem(t('preset.delete'), async () => {
            if (!confirm(t('preset.deleteConfirm').replace('{0}', presetName))) return;
            delete this.settings.stylePresets[presetName];
            await this.saveSettings();
            new Notice(t('preset.deleted'));
            await renderThemes();
          });
          document.body.appendChild(menu);
          const closeMenu = (ev) => { if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('click', closeMenu); } };
          setTimeout(() => document.addEventListener('click', closeMenu), 0);
        });
      }
    };

    renderThemes();

    // ── 背景分组 ──────────────────────────────────────────────────
    const eyeCareArea = main.createDiv();
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
        if (isMobile) { new Notice('pic: ' + _joinPath(this._getPluginVaultPath(), 'pic') + '/'); return; }
        try {
          const picDir = _joinPath(this._getPluginDir(), 'pic');
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
          if (activeImg.tile) activeImg.stretch = false;
          await this.saveSettings();
          this.applyEyeCareColor();
          renderEyeCare();
        });
        const stretchBtn = headerRow.createEl('span');
        const isStretch = activeImg.stretch ?? false;
        stretchBtn.style.cssText = `font-size:10px;padding:1px 6px;border-radius:8px;cursor:pointer;border:1px solid ${isStretch ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};background:${isStretch ? 'var(--interactive-accent)' : 'var(--background-primary)'};color:${isStretch ? '#fff' : 'var(--text-muted)'};user-select:none;`;
        stretchBtn.textContent = t('eyeCare.imgStretch');
        stretchBtn.addEventListener('click', async () => {
          activeImg.stretch = !(activeImg.stretch ?? false);
          if (activeImg.stretch) activeImg.tile = false;
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

      let prevEyeCareColor = null;

      imgs.forEach((img, idx) => {
        const isActive = this.settings.eyeCareColor === `__img_${idx}`;
        const chip = chipsContainer.createDiv();
        chip.style.cssText = `display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:12px;font-size:11px;cursor:pointer;border:1px solid ${isActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};background:${isActive ? 'var(--interactive-accent)' : 'var(--background-primary)'};color:${isActive ? '#fff' : 'var(--text-normal)'};max-width:150px;transition:border-color 0.15s,background 0.15s,color 0.15s;`;
        const picDir = this._getPluginDir();
        const isPaired = !!img.paired;
        let dotStyle = '';
        let chipDataUrl = '';
        if (isPaired) {
          dotStyle = `display:inline-block;width:12px;height:12px;border-radius:50%;flex-shrink:0;animation:ss-yin-yang 3s linear infinite;background:conic-gradient(#fff 0deg 180deg,#222 180deg 360deg);position:relative;`;
          if (!isMobile) {
          const lightPath = _joinPath(picDir, 'pic', img.url);
          try {
            const buf = nodeFs.readFileSync(lightPath);
            const ext = lightPath.substring(lightPath.lastIndexOf('.')).toLowerCase();
            const mimeMap = { '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.bmp':'image/bmp','.svg':'image/svg+xml' };
            const mime = mimeMap[ext] || 'image/png';
            chipDataUrl = 'data:' + mime + ';base64,' + buf.toString('base64');
          } catch (e) {}
          }
        } else {
          if (!isMobile) {
          const fullPath = _joinPath(picDir, 'pic', img.url);
          try {
            const buf = nodeFs.readFileSync(fullPath);
            const ext = fullPath.substring(fullPath.lastIndexOf('.')).toLowerCase();
            const mimeMap = { '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.bmp':'image/bmp','.svg':'image/svg+xml' };
            const mime = mimeMap[ext] || 'image/png';
            chipDataUrl = 'data:' + mime + ';base64,' + buf.toString('base64');
            dotStyle = `display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0;background:url('${chipDataUrl}') center/cover;`;
          } catch (e) {
            dotStyle = `display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#6c9,#69c);`;
          }
          } else {
            dotStyle = `display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#6c9,#69c);`;
          }
        }
        const dot = chip.createEl('span');
        dot.style.cssText = dotStyle;
        if (isPaired) {
          const dotInner = dot.createEl('span');
          dotInner.style.cssText = 'position:absolute;top:0;left:25%;width:50%;height:50%;border-radius:50%;background:#fff;';
          const dotInner2 = dot.createEl('span');
          dotInner2.style.cssText = 'position:absolute;bottom:0;right:25%;width:50%;height:50%;border-radius:50%;background:#222;';
          const dotDot1 = dot.createEl('span');
          dotDot1.style.cssText = 'position:absolute;top:12.5%;left:37.5%;width:25%;height:25%;border-radius:50%;background:#222;';
          const dotDot2 = dot.createEl('span');
          dotDot2.style.cssText = 'position:absolute;bottom:12.5%;right:37.5%;width:25%;height:25%;border-radius:50%;background:#fff;';
        }
        const nameEl = chip.createEl('span', { text: img.label || img.url });
        nameEl.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';

        const applyChipStyle = (active) => {
          chip.style.borderColor = active ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
          chip.style.background = active ? 'var(--interactive-accent)' : 'var(--background-primary)';
          chip.style.color = active ? '#fff' : 'var(--text-normal)';
        };

        let imgPreviewing = false;
        chip.addEventListener('mouseenter', () => {
          if (isActive) { if (chipDataUrl) showPreview(chipDataUrl, chip); return; }
          imgPreviewing = true;
          prevEyeCareColor = this.settings.eyeCareColor;
          this.settings.eyeCareColor = `__img_${idx}`;
          for (const name of bgMembers) {
            this._setSnippetEnabled(name, false);
          }
          this.applyEyeCareColor();
          applyChipStyle(true);
          if (chipDataUrl) showPreview(chipDataUrl, chip);
        });
        chip.addEventListener('mouseleave', () => {
          hidePreview();
          if (!imgPreviewing) return;
          imgPreviewing = false;
          this.settings.eyeCareColor = prevEyeCareColor;
          this.applyEyeCareColor();
          applyChipStyle(isActive);
        });

        chip.addEventListener('click', async () => {
          if (imgPreviewing) {
            imgPreviewing = false;
            this.settings.eyeCareColor = prevEyeCareColor;
            this.applyEyeCareColor();
          }
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
        const buildImgOpts = () => {
          const opts = [];
          opts.push({ label: t('eyeCare.imgRename'), action: async () => {
            const newName = await this._promptGroupName(img.paired ? img.label : img.url, t('eyeCare.imgRenameTitle'));
            if (!newName) return;
            try {
              if (isMobile) {
                if (img.paired) {
                  const ext = img.url.substring(img.url.lastIndexOf('.'));
                  const picBase = _joinPath(this._getPluginVaultPath(), 'pic') + '/';
                  try { await this.app.vault.adapter.rename(picBase + img.url, picBase + newName + '-light' + ext); } catch (_e) {}
                  try { await this.app.vault.adapter.rename(picBase + img.urlDark, picBase + newName + '-dark' + ext); } catch (_e) {}
                  img.url = newName + '-light' + ext;
                  img.urlDark = newName + '-dark' + ext;
                  img.label = newName;
                } else {
                  const picBase = _joinPath(this._getPluginVaultPath(), 'pic') + '/';
                  try { await this.app.vault.adapter.rename(picBase + img.url, picBase + newName); img.url = newName; img.label = newName; } catch (_e) {}
                }
              } else {
              if (img.paired) {
                const ext = img.url.substring(img.url.lastIndexOf('.'));
                const oldLightPath = _joinPath(picDir, 'pic', img.url);
                const oldDarkPath = _joinPath(picDir, 'pic', img.urlDark);
                const newLightPath = _joinPath(picDir, 'pic', newName + '-light' + ext);
                const newDarkPath = _joinPath(picDir, 'pic', newName + '-dark' + ext);
                if (nodeFs.existsSync(oldLightPath)) nodeFs.renameSync(oldLightPath, newLightPath);
                if (nodeFs.existsSync(oldDarkPath)) nodeFs.renameSync(oldDarkPath, newDarkPath);
                img.url = newName + '-light' + ext;
                img.urlDark = newName + '-dark' + ext;
                img.label = newName;
              } else {
                const oldPath = _joinPath(picDir, 'pic', img.url);
                const newPath = _joinPath(picDir, 'pic', newName);
                if (nodeFs.existsSync(oldPath)) {
                  nodeFs.renameSync(oldPath, newPath);
                  img.url = newName;
                  img.label = newName;
                }
              }
              }
              await this.saveSettings();
              this.applyEyeCareColor();
              renderEyeCare();
            } catch (_e) { new Notice(t('eyeCare.imgRenameFailed')); }
          }});
          opts.push({ label: t('eyeCare.imgRotate'), action: async () => {
            try {
              if (img.paired) {
                await this._rotateImage(img.url);
                await this._rotateImage(img.urlDark);
              } else {
                await this._rotateImage(img.url);
              }
              this.applyEyeCareColor();
              renderEyeCare();
              new Notice(t('eyeCare.imgRotated'));
            } catch (_e) { new Notice(t('eyeCare.imgRotateFailed')); }
          }});
          if (this.settings.defaultEyeCareColor === `__img_${idx}`) {
            opts.push({ label: t('eyeCare.clearDefault'), action: async () => {
              this.settings.defaultEyeCareColor = '';
              await this.saveSettings();
              new Notice(t('eyeCare.clearDefaultDone'));
              renderEyeCare();
            }});
          } else {
            opts.push({ label: t('eyeCare.setAsDefault'), action: async () => {
              this.settings.defaultEyeCareColor = `__img_${idx}`;
              await this.saveSettings();
              new Notice(t('eyeCare.setAsDefaultDone'));
              renderEyeCare();
            }});
          }

          opts.push({ label: t('eyeCare.imgDelete'), action: async () => {
            try {
              if (isMobile) {
                if (img.paired) {
                  try { await this.app.vault.adapter.remove(_joinPath(this._getPluginVaultPath(), 'pic', img.url)); } catch (_e) {}
                  try { await this.app.vault.adapter.remove(_joinPath(this._getPluginVaultPath(), 'pic', img.urlDark)); } catch (_e) {}
                } else {
                  try { await this.app.vault.adapter.remove(_joinPath(this._getPluginVaultPath(), 'pic', img.url)); } catch (_e) {}
                }
              } else {
              if (img.paired) {
                const lightPath = _joinPath(picDir, 'pic', img.url);
                const darkPath = _joinPath(picDir, 'pic', img.urlDark);
                if (nodeFs.existsSync(lightPath)) nodeFs.unlinkSync(lightPath);
                if (nodeFs.existsSync(darkPath)) nodeFs.unlinkSync(darkPath);
              } else {
                const delPath = _joinPath(picDir, 'pic', img.url);
                if (nodeFs.existsSync(delPath)) nodeFs.unlinkSync(delPath);
              }
              }
              const imgs2 = this.settings.bgImages || [];
              const delIdx = imgs2.findIndex(i => i === img);
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
          }});
          return opts;
        };
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
        item.addEventListener('click', async (e) => { e.stopPropagation(); menu.remove(); await action(); });
            menu.appendChild(item);
          };
          mkItem(t('eyeCare.imgRename'), async () => {
            const newName = await this._promptGroupName(img.paired ? img.label : img.url, t('eyeCare.imgRenameTitle'));
            if (!newName) return;
            try {
              if (isMobile) {
                if (img.paired) {
                  const ext = img.url.substring(img.url.lastIndexOf('.'));
                  const picBase = _joinPath(this._getPluginVaultPath(), 'pic') + '/';
                  try { await this.app.vault.adapter.rename(picBase + img.url, picBase + newName + '-light' + ext); } catch (_e) {}
                  try { await this.app.vault.adapter.rename(picBase + img.urlDark, picBase + newName + '-dark' + ext); } catch (_e) {}
                  img.url = newName + '-light' + ext;
                  img.urlDark = newName + '-dark' + ext;
                  img.label = newName;
                } else {
                  const picBase = _joinPath(this._getPluginVaultPath(), 'pic') + '/';
                  try { await this.app.vault.adapter.rename(picBase + img.url, picBase + newName); img.url = newName; img.label = newName; } catch (_e) {}
                }
              } else {
              if (img.paired) {
                const ext = img.url.substring(img.url.lastIndexOf('.'));
                const oldLightPath = _joinPath(picDir, 'pic', img.url);
                const oldDarkPath = _joinPath(picDir, 'pic', img.urlDark);
                const newLightPath = _joinPath(picDir, 'pic', newName + '-light' + ext);
                const newDarkPath = _joinPath(picDir, 'pic', newName + '-dark' + ext);
                if (nodeFs.existsSync(oldLightPath)) nodeFs.renameSync(oldLightPath, newLightPath);
                if (nodeFs.existsSync(oldDarkPath)) nodeFs.renameSync(oldDarkPath, newDarkPath);
                img.url = newName + '-light' + ext;
                img.urlDark = newName + '-dark' + ext;
                img.label = newName;
              } else {
                const oldPath = _joinPath(picDir, 'pic', img.url);
                const newPath = _joinPath(picDir, 'pic', newName);
                if (nodeFs.existsSync(oldPath)) {
                  nodeFs.renameSync(oldPath, newPath);
                  img.url = newName;
                  img.label = newName;
                }
              }
              }
              await this.saveSettings();
              this.applyEyeCareColor();
              renderEyeCare();
            } catch (_e) { new Notice(t('eyeCare.imgRenameFailed')); }
          });
          mkItem(t('eyeCare.imgRotate'), async () => {
            try {
              if (img.paired) {
                await this._rotateImage(img.url);
                await this._rotateImage(img.urlDark);
              } else {
                await this._rotateImage(img.url);
              }
              this.applyEyeCareColor();
              renderEyeCare();
              new Notice(t('eyeCare.imgRotated'));
            } catch (_e) { new Notice(t('eyeCare.imgRotateFailed')); }
          });
          if (this.settings.defaultEyeCareColor === `__img_${idx}`) {
            mkItem(t('eyeCare.clearDefault'), async () => {
              this.settings.defaultEyeCareColor = '';
              await this.saveSettings();
              new Notice(t('eyeCare.clearDefaultDone'));
              renderEyeCare();
            });
          } else {
            mkItem(t('eyeCare.setAsDefault'), async () => {
              this.settings.defaultEyeCareColor = `__img_${idx}`;
              await this.saveSettings();
              new Notice(t('eyeCare.setAsDefaultDone'));
              renderEyeCare();
            });
          }
          const mkToggle = (label, isOn, action) => {
            const item = document.createElement('div');
            item.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:13px;color:var(--text-normal);display:flex;align-items:center;justify-content:space-between;gap:12px;';
            const labelEl = document.createElement('span');
            labelEl.textContent = label;
            const toggle = document.createElement('span');
            toggle.style.cssText = `display:inline-block;width:28px;height:16px;border-radius:8px;position:relative;transition:background 0.15s ease;background:${isOn ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};flex-shrink:0;`;
            const knob = document.createElement('span');
            knob.style.cssText = `position:absolute;top:2px;left:${isOn ? '14px' : '2px'};width:12px;height:12px;border-radius:50%;background:#fff;transition:left 0.15s ease;`;
            toggle.appendChild(knob);
            item.appendChild(labelEl);
            item.appendChild(toggle);
            item.addEventListener('mouseenter', () => { item.style.background = 'var(--background-modifier-hover)'; });
            item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; });
            item.addEventListener('click', async (ev) => { ev.stopPropagation(); menu.remove(); await action(); });
            menu.appendChild(item);
          };

          mkItem(t('eyeCare.imgDelete'), async () => {
            try {
              if (isMobile) {
                if (img.paired) {
                  try { await this.app.vault.adapter.remove(_joinPath(this._getPluginVaultPath(), 'pic', img.url)); } catch (_e) {}
                  try { await this.app.vault.adapter.remove(_joinPath(this._getPluginVaultPath(), 'pic', img.urlDark)); } catch (_e) {}
                } else {
                  try { await this.app.vault.adapter.remove(_joinPath(this._getPluginVaultPath(), 'pic', img.url)); } catch (_e) {}
                }
              } else {
              if (img.paired) {
                const lightPath = _joinPath(picDir, 'pic', img.url);
                const darkPath = _joinPath(picDir, 'pic', img.urlDark);
                if (nodeFs.existsSync(lightPath)) nodeFs.unlinkSync(lightPath);
                if (nodeFs.existsSync(darkPath)) nodeFs.unlinkSync(darkPath);
              } else {
                const delPath = _joinPath(picDir, 'pic', img.url);
                if (nodeFs.existsSync(delPath)) nodeFs.unlinkSync(delPath);
              }
              }
              const imgs2 = this.settings.bgImages || [];
              const delIdx = imgs2.findIndex(i => i === img);
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
        this._attachSsChipHover(chip, buildImgOpts);
      });

      const customColors = this.settings.customBgColors || [];
      customColors.forEach((colorVal, cIdx) => {
        const isActive = this.settings.eyeCareColor === `__customcolor_${cIdx}`;
        const chip = chipsContainer.createDiv();
        chip.style.cssText = `display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:12px;font-size:11px;cursor:pointer;border:1px solid ${isActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};background:${isActive ? 'var(--interactive-accent)' : 'var(--background-primary)'};color:${isActive ? '#fff' : 'var(--text-normal)'};transition:border-color 0.15s,background 0.15s,color 0.15s;`;
        const dot = chip.createEl('span');
        dot.style.cssText = `display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0;background:${colorVal};`;
        const nameEl = chip.createEl('span', { text: colorVal });
        nameEl.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
        const _bgKey = `__customcolor_${cIdx}`;
        const _bgUsedBy = Object.entries(this.settings.pageStyles || {}).filter(([fp, p]) => p.eyeCareColor === _bgKey).map(([fp]) => fp);
        if (_bgUsedBy.length > 0) {
          const badge = chip.createEl('span');
          badge.textContent = '◉' + _bgUsedBy.length;
          badge.style.cssText = 'font-size:10px;opacity:0.7;border-radius:8px;padding:0 4px;flex-shrink:0;cursor:pointer;';
          badge.title = t('memory.usedBy').replace('{0}', String(_bgUsedBy.length));
          badge.addEventListener('click', (e) => {
            e.stopPropagation();
            this._showMemoryPopup(badge, _bgUsedBy, colorVal, 'bg', popup._ssRefreshAfterForget);
          });
        }
        const applyChipStyle = (active) => {
          chip.style.borderColor = active ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
          chip.style.background = active ? 'var(--interactive-accent)' : 'var(--background-primary)';
          chip.style.color = active ? '#fff' : 'var(--text-normal)';
        };
        let _colorPreviewing = false;
        let _colorPrevEyeCare = '';
        if (!isMobile) {
        this._bindHoverPreview(chip,
          () => {
            if (this.settings.eyeCareColor === `__customcolor_${cIdx}`) return;
            _colorPreviewing = true;
            _colorPrevEyeCare = this.settings.eyeCareColor;
            this.settings.eyeCareColor = `__customcolor_${cIdx}`;
            this.applyEyeCareColor();
          },
          () => {
            if (!_colorPreviewing) return;
            _colorPreviewing = false;
            this.settings.eyeCareColor = _colorPrevEyeCare;
            this.applyEyeCareColor();
          }
        );
        }
        chip.addEventListener('click', async () => {
          if (_colorPreviewing) {
            _colorPreviewing = false;
            this.settings.eyeCareColor = _colorPrevEyeCare;
            this.applyEyeCareColor();
          }
          if (this.settings.eyeCareColor === `__customcolor_${cIdx}`) {
            this.settings.eyeCareColor = '';
          } else {
            this.settings.eyeCareColor = `__customcolor_${cIdx}`;
            for (const name of bgMembers) { this._setSnippetEnabled(name, false); }
          }
          this.applyEyeCareColor();
          await this.saveSettings();
          renderEyeCare();
          renderContent();
        });
        const buildColorOpts = () => {
          const opts = [];
          if (this.settings.defaultEyeCareColor === `__customcolor_${cIdx}`) {
            opts.push({ label: t('eyeCare.clearDefault'), action: async () => {
              this.settings.defaultEyeCareColor = '';
              await this.saveSettings();
              new Notice(t('eyeCare.clearDefaultDone'));
              renderEyeCare();
            }});
          } else {
            opts.push({ label: t('eyeCare.setAsDefault'), action: async () => {
              this.settings.defaultEyeCareColor = `__customcolor_${cIdx}`;
              await this.saveSettings();
              new Notice(t('eyeCare.setAsDefaultDone'));
              renderEyeCare();
            }});
          }
          opts.push({ label: t('eyeCare.imgDelete'), action: async () => {
            this.settings.customBgColors.splice(cIdx, 1);
            if (this.settings.eyeCareColor === `__customcolor_${cIdx}`) {
              this.settings.eyeCareColor = '';
            } else if (this.settings.eyeCareColor?.startsWith('__customcolor_')) {
              const curIdx = parseInt(this.settings.eyeCareColor.slice(14), 10);
              if (curIdx > cIdx) this.settings.eyeCareColor = `__customcolor_${curIdx - 1}`;
            }
            this.applyEyeCareColor();
            await this.saveSettings();
            renderEyeCare();
            new Notice(t('eyeCare.imgDeleted'));
          }});
          return opts;
        };
        chip.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const menu = document.createElement('div');
          menu.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;background:rgba(var(--mono-rgb-0),0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--background-modifier-border);border-radius:6px;padding:4px 0;z-index:10001;box-shadow:0 4px 16px rgba(0,0,0,0.25);min-width:120px;`;
          const mkItem = (label, action) => {
            const item = document.createElement('div');
            item.textContent = label;
            item.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:13px;color:var(--text-normal);';
            item.addEventListener('mouseenter', () => { item.style.background = 'var(--background-modifier-hover)'; });
            item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; });
            item.addEventListener('click', async (ev) => { ev.stopPropagation(); menu.remove(); await action(); });
            menu.appendChild(item);
          };
          buildColorOpts().forEach(o => mkItem(o.label, o.action));
          document.body.appendChild(menu);
          const closeMenu = () => { if (document.body.contains(menu)) menu.remove(); document.removeEventListener('click', closeMenu); };
          setTimeout(() => document.addEventListener('click', closeMenu), 10);
        });
        this._attachSsChipHover(chip, buildColorOpts);
      });

      const addColorChip = chipsContainer.createEl('span');
      addColorChip.textContent = '+ ' + t('eyeCare.addColor');
      addColorChip.title = t('eyeCare.addColorTitle');
      addColorChip.style.cssText = `
        display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:12px;font-size:11px;cursor:pointer;
        border:1px dashed var(--background-modifier-border);background:transparent;color:var(--text-muted);
        transition:all 0.15s ease;user-select:none;
      `;
      addColorChip.addEventListener('mouseenter', () => {
        addColorChip.style.borderColor = 'var(--interactive-accent)';
        addColorChip.style.color = 'var(--interactive-accent)';
      });
      addColorChip.addEventListener('mouseleave', () => {
        addColorChip.style.borderColor = 'var(--background-modifier-border)';
        addColorChip.style.color = 'var(--text-muted)';
      });
      addColorChip.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const existingPicker = document.getElementById('ss-color-picker-popup');
        if (existingPicker) { existingPicker.remove(); return; }
        const picker = document.createElement('div');
        picker.id = 'ss-color-picker-popup';
        picker.style.cssText = `
          position:fixed;z-index:10002;
          background:rgba(var(--mono-rgb-0),0.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
          border:1px solid var(--background-modifier-border);border-radius:8px;
          box-shadow:0 4px 16px rgba(0,0,0,0.25);padding:12px;min-width:200px;
        `;
        const rect = addColorChip.getBoundingClientRect();
        picker.style.left = rect.left + 'px';
        picker.style.top = (rect.bottom + 6) + 'px';
        requestAnimationFrame(() => {
          const pRect = picker.getBoundingClientRect();
          if (pRect.right > window.innerWidth) picker.style.left = (window.innerWidth - pRect.width - 8) + 'px';
          if (pRect.bottom > window.innerHeight) picker.style.top = (rect.top - pRect.height - 6) + 'px';
        });
        const row = picker.createDiv();
        row.style.cssText = 'display:flex;align-items:center;gap:8px;';
        const colorInput = row.createEl('input', { type: 'color' });
        colorInput.value = '#ff6600';
        colorInput.style.cssText = 'width:36px;height:28px;padding:0;cursor:pointer;border:1px solid var(--background-modifier-border);border-radius:4px;';
        const textInput = row.createEl('input', { type: 'text' });
        textInput.placeholder = t('eyeCare.addColorPlaceholder');
        textInput.value = '#ff6600';
        textInput.style.cssText = 'flex:1;padding:4px 8px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:12px;';
        colorInput.addEventListener('input', () => { textInput.value = colorInput.value; });
        textInput.addEventListener('input', () => {
          const v = textInput.value.trim();
          if (/^#[0-9a-fA-F]{6}$/.test(v)) colorInput.value = v;
        });
        const btnRow = picker.createDiv();
        btnRow.style.cssText = 'display:flex;justify-content:flex-end;gap:6px;margin-top:8px;';
        const cancelBtn = btnRow.createEl('button', { text: t('btn.cancel') });
        cancelBtn.style.cssText = 'padding:3px 10px;border:1px solid var(--background-modifier-border);border-radius:4px;background:transparent;color:var(--text-muted);cursor:pointer;font-size:11px;';
        cancelBtn.addEventListener('click', () => picker.remove());
        const addBtn = btnRow.createEl('button', { text: t('eyeCare.addColor') });
        addBtn.style.cssText = 'padding:3px 10px;border:none;border-radius:4px;background:var(--interactive-accent);color:#fff;cursor:pointer;font-size:11px;';
        addBtn.addEventListener('click', async () => {
          const colorVal = textInput.value.trim();
          if (!/^#[0-9a-fA-F]{6}$/.test(colorVal)) {
            new Notice(t('eyeCare.addColorInvalid'));
            return;
          }
          if (!this.settings.customBgColors) this.settings.customBgColors = [];
          this.settings.customBgColors.push(colorVal);
          const newIdx = this.settings.customBgColors.length - 1;
          this.settings.eyeCareColor = `__customcolor_${newIdx}`;
          for (const name of bgMembers) { this._setSnippetEnabled(name, false); }
          this.applyEyeCareColor();
          await this.saveSettings();
          picker.remove();
          new Notice(t('eyeCare.addColorDone'));
          renderEyeCare();
        });
        document.body.appendChild(picker);
        const closePicker = (e) => {
          if (!picker.contains(e.target) && e.target !== addColorChip) { picker.remove(); document.removeEventListener('click', closePicker); }
        };
        setTimeout(() => document.addEventListener('click', closePicker), 10);
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
    const _ssSpecialIds = ['theme', 'bg', 'font', 'fontStyle', 'memory'];
    const contentArea = main.createDiv();
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

      const _q = searchInput.value.trim().toLowerCase();
      const _isGroupMode = !_ssSpecialIds.includes(_ssCur);

      // ── 渲染各分组 ────────────────────────────────────────────────
      const bgGroupName = '__bg__';
      const orderedGroups = this.settings.groupOrder.filter(g => this.settings.groups[g] && g !== bgGroupName);

      for (const gName of orderedGroups) {
        if (_isGroupMode && !_q && _ssCur !== gName) continue;
        const members = this.settings.groups[gName];
        if (!members) continue;
        const _filtered = _q ? members.filter(m => m.toLowerCase().includes(_q)) : members;
        if (_q && _filtered.length === 0) continue;

        const isCollapsed = this.settings.collapsedGroups[gName] || false;

        const groupEl = contentArea.createDiv();
        groupEl.style.cssText = 'margin-bottom:20px;';
        groupEl.setAttribute('data-group', gName);

        // 分组头
        const groupHeader = groupEl.createDiv();
        groupHeader.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:8px;user-select:none;';

        const collapseIcon = groupHeader.createEl('span');
        collapseIcon.textContent = isCollapsed ? '▶' : '▼';
        collapseIcon.style.cssText = 'font-size:10px;color:var(--text-muted);cursor:pointer;transition:transform 0.15s ease;';

        const groupLabel = groupHeader.createEl('span');
        groupLabel.textContent = gName + ' (' + _filtered.length + ')';
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
        chipsContainer.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;min-height:28px;padding:8px;border-radius:6px;border:1px dashed transparent;transition:border-color 0.15s ease;';
        chipsContainer.style.display = isCollapsed ? 'none' : 'flex';

        const toggleCollapse = async (e) => {
          if (e) e.stopPropagation();
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
          if (sourceGroup === gName) return;
          await this._moveToGroup(snippetName, gName);
          this._dragData = null;
          renderContent();
          if (sourceGroup === '__bg__') renderEyeCare();
        });

        _filtered.forEach(snippetName => {
          this._createChip(chipsContainer, snippetName, isEnabled(snippetName), gName, renderContent);
        });
      }

      // ── 未分组 snippets ───────────────────────────────────────────
      if (_q || !_isGroupMode || _ssCur === '__ungrouped__') {
      const groupedSnippets = new Set();
      for (const members of Object.values(this.settings.groups)) {
        members.forEach(s => groupedSnippets.add(s));
      }
      const ungrouped = snippetFiles.filter(n => !groupedSnippets.has(n));

      const _ungroupedFiltered = _q ? ungrouped.filter(n => n.toLowerCase().includes(_q)) : ungrouped;

      if (_ungroupedFiltered.length > 0) {
        const isCollapsed = this.settings.collapsedGroups['__ungrouped__'] || false;

        const groupEl = contentArea.createDiv();
        groupEl.style.cssText = 'margin-bottom:16px;';

        const groupHeader = groupEl.createDiv();
        groupHeader.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:6px;user-select:none;';

        const collapseIcon = groupHeader.createEl('span');
        collapseIcon.textContent = isCollapsed ? '▶' : '▼';
        collapseIcon.style.cssText = 'font-size:10px;color:var(--text-muted);cursor:pointer;';

        const groupLabel = groupHeader.createEl('span');
        groupLabel.textContent = t('group.ungrouped') + ' (' + _ungroupedFiltered.length + ')';
        groupLabel.style.cssText = 'font-size:12px;font-weight:600;color:var(--text-muted);cursor:pointer;';

        const chipsContainer = groupEl.createDiv();
        chipsContainer.className = 'ss-group-chips';
        chipsContainer.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;min-height:28px;padding:8px;border-radius:6px;border:1px dashed transparent;transition:border-color 0.15s ease;';
        chipsContainer.style.display = isCollapsed ? 'none' : 'flex';

        const toggleCollapse = async (e) => {
          if (e) e.stopPropagation();
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
          const srcGroup = this._dragData.sourceGroup;
          await this._removeFromGroup(this._dragData.snippetName);
          this._dragData = null;
          renderContent();
          if (srcGroup === '__bg__') renderEyeCare();
        });

        _ungroupedFiltered.forEach(snippetName => {
          this._createChip(chipsContainer, snippetName, isEnabled(snippetName), null, renderContent);
        });
      }
      } // end if (_q || !_isGroupMode || _ssCur === '__ungrouped__')

      if (_q && contentArea.children.length === 0) {
        const noMatch = contentArea.createEl('span');
        noMatch.textContent = 'No snippet matches "' + _q + '"';
        noMatch.style.cssText = 'font-size:12px;color:var(--text-muted);';
      }

      if (_q) return;

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


    // ── 字体区域（手机端隐藏） ──────────────────────────────────────────────
    const fontArea = main.createDiv();
    fontArea.style.cssText = 'margin-top:8px;';

    const fontHeader = fontArea.createDiv();
    fontHeader.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:6px;user-select:none;';


    const fontLabel = fontHeader.createEl('span', { text: t('font.section') });
    fontLabel.style.cssText = 'font-size:12px;font-weight:600;color:var(--text-normal);cursor:pointer;';

    const fontHint = fontHeader.createEl('span', { text: isMobile ? '' : t('font.clickToLoad') });
    fontHint.style.cssText = 'font-size:10px;color:var(--text-muted);';

    const fontBarChip = fontHeader.createEl('span');
    fontBarChip.textContent = t('font.barChip');
    fontBarChip.style.cssText = `
      display:inline-flex;align-items:center;justify-content:center;
      width:18px;height:18px;border-radius:50%;font-size:11px;font-weight:700;
      cursor:pointer;user-select:none;transition:all 0.15s ease;
      border:1px solid var(--background-modifier-border);
      background:rgba(var(--mono-rgb-0),0.5);color:var(--text-muted);
    `;
    fontBarChip.title = _currentLang === 'zh' ? '添加状态栏字体按钮' : 'Add font button to status bar';
    fontBarChip.addEventListener('mouseenter', () => {
      fontBarChip.style.borderColor = 'var(--interactive-accent)';
      fontBarChip.style.color = 'var(--interactive-accent)';
    });
    fontBarChip.addEventListener('mouseleave', () => {
      fontBarChip.style.borderColor = 'var(--background-modifier-border)';
      fontBarChip.style.color = 'var(--text-muted)';
    });
    fontBarChip.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (this.settings.fontBarButton) {
        this._removeFontBarButton();
        this.settings.fontBarButton = null;
        await this.saveSettings();
        fontBarChip.style.borderColor = 'var(--background-modifier-border)';
        fontBarChip.style.background = 'rgba(var(--mono-rgb-0),0.5)';
        fontBarChip.style.color = 'var(--text-muted)';
      } else {
        this.settings.fontBarButton = { text: t('font.barDefaultText'), css: '' };
        await this.saveSettings();
        this._createFontBarButton();
        fontBarChip.style.borderColor = 'var(--interactive-accent)';
        fontBarChip.style.background = 'var(--interactive-accent)';
        fontBarChip.style.color = '#fff';
      }
    });
    if (this.settings.fontBarButton) {
      fontBarChip.style.borderColor = 'var(--interactive-accent)';
      fontBarChip.style.background = 'var(--interactive-accent)';
      fontBarChip.style.color = '#fff';
    }
    if (isMobile) fontBarChip.style.display = 'none';

    const fontToggle = fontHeader.createEl('span');
    const isFontOn = !this._fontDisabled;
    fontToggle.textContent = isFontOn ? t('font.disabled') : t('font.enabled');
    fontToggle.style.cssText = `
      font-size:10px;padding:1px 8px;border-radius:8px;cursor:pointer;
      border:1px solid ${isFontOn ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
      background:${isFontOn ? 'var(--interactive-accent)' : 'transparent'};
      color:${isFontOn ? '#fff' : 'var(--text-muted)'};
      margin-left:auto;user-select:none;transition:all 0.15s ease;
    `;
    fontToggle.addEventListener('click', async (e) => {
      e.stopPropagation();
      this._fontDisabled = !this._fontDisabled;
      const on = !this._fontDisabled;
      fontToggle.textContent = on ? t('font.disabled') : t('font.enabled');
      fontToggle.style.borderColor = on ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
      fontToggle.style.background = on ? 'var(--interactive-accent)' : 'transparent';
      fontToggle.style.color = on ? '#fff' : 'var(--text-muted)';
      this.applyFontSettings();
      await this.saveSettings();
    });

    const fontChipsContainer = fontArea.createDiv();
    fontChipsContainer.setAttribute('data-ss-font-chips', '');
    fontChipsContainer.style.cssText = isMobile ? 'display:none;' : 'display:flex;flex-wrap:wrap;gap:4px;max-height:200px;overflow-y:auto;padding:4px;';

    const fontStyleArea = main.createDiv();
    fontStyleArea.style.cssText = 'margin-top:4px;';

    const fontStyleHeader = fontStyleArea.createDiv();
    fontStyleHeader.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:4px;user-select:none;';

    const fontStyleLabel = fontStyleHeader.createEl('span', { text: t('font.section') + ' ' + (_currentLang === 'zh' ? '样式' : 'Style') });
    fontStyleLabel.style.cssText = 'font-size:12px;font-weight:600;color:var(--text-normal);';

    const fontSettingsPanel = fontStyleArea.createDiv();
    fontSettingsPanel.style.cssText = `display:block;margin-top:4px;padding:8px;border:1px solid var(--background-modifier-border);border-radius:6px;background:rgba(var(--mono-rgb-0),0.3);`;

    let fontsLoaded = false;

    const applyFontChipStyle = (chip, star, active) => {
      chip.style.borderColor = active ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
      chip.style.background = active ? 'var(--interactive-accent)' : 'var(--background-primary)';
      chip.style.color = active ? '#fff' : 'var(--text-normal)';
      star.style.borderColor = active ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
      star.style.background = active ? 'var(--interactive-accent)' : 'var(--background-primary)';
    };

    const renderFontChips = (fonts) => {
      fontChipsContainer.innerHTML = '';
      const favorites = this.settings.fontFavorites || [];

      const defaultChipWrap = fontChipsContainer.createDiv();
      defaultChipWrap.style.cssText = 'display:inline-flex;align-items:center;gap:0;';
      const isDefaultActive = !this.settings.activeFont;
      const defaultChip = defaultChipWrap.createEl('span');
      defaultChip.textContent = t('font.default');
      defaultChip.style.cssText = `
        display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;cursor:pointer;
        user-select:none;transition:all 0.15s ease;
        border:1px solid ${isDefaultActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
        background:${isDefaultActive ? 'var(--interactive-accent)' : 'var(--background-primary)'};
        color:${isDefaultActive ? '#fff' : 'var(--text-normal)'};
      `;
      const defaultStar = defaultChipWrap.createEl('span');
      defaultStar.style.cssText = 'display:none;';

      let defaultPreviewing = false;
      this._bindHoverPreview(defaultChip,
        () => {
          if (isDefaultActive) return;
          defaultPreviewing = true;
          defaultChip._prevFont = this.settings.activeFont;
          this.settings.activeFont = '';
          this.applyFontSettings();
          defaultChip.style.borderColor = 'var(--interactive-accent)';
          defaultChip.style.background = 'var(--interactive-accent)';
          defaultChip.style.color = '#fff';
        },
        () => {
          if (!defaultPreviewing) return;
          defaultPreviewing = false;
          this.settings.activeFont = defaultChip._prevFont;
          this.applyFontSettings();
          defaultChip.style.borderColor = isDefaultActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
          defaultChip.style.background = isDefaultActive ? 'var(--interactive-accent)' : 'var(--background-primary)';
          defaultChip.style.color = isDefaultActive ? '#fff' : 'var(--text-normal)';
        }
      );
      defaultChip.addEventListener('click', async () => {
        if (defaultPreviewing) {
          defaultPreviewing = false;
          this.settings.activeFont = defaultChip._prevFont;
          this.applyFontSettings();
        }
        this.settings.activeFont = '';
        this.applyFontSettings();
        await this.saveSettings();
        renderFontChips(fonts);
        renderFontSettings();
      });

      const sorted = [...fonts].sort((a, b) => {
        const aFav = favorites.includes(a) ? 0 : 1;
        const bFav = favorites.includes(b) ? 0 : 1;
        return aFav - bFav || a.localeCompare(b);
      });

      sorted.forEach(fontName => {
        const isFav = favorites.includes(fontName);
        const isActive = this.settings.activeFont === fontName;

        const chipWrap = fontChipsContainer.createDiv();
        chipWrap.style.cssText = 'display:inline-flex;align-items:center;gap:0;';

        const chip = chipWrap.createEl('span');
        chip.textContent = fontName;
        chip.style.cssText = `
          display:inline-block;padding:2px 4px 2px 8px;border-radius:12px 0 0 12px;font-size:11px;cursor:pointer;
          user-select:none;transition:all 0.15s ease;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
          border:1px solid ${isActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
          border-right:none;
          background:${isActive ? 'var(--interactive-accent)' : 'var(--background-primary)'};
          color:${isActive ? '#fff' : 'var(--text-normal)'};
          font-family:"${fontName}";
        `;

        const star = chipWrap.createEl('span');
        star.textContent = isFav ? '★' : '☆';
        star.style.cssText = `
          display:inline-flex;align-items:center;justify-content:center;
          padding:2px 6px;border-radius:0 12px 12px 0;font-size:11px;cursor:pointer;
          user-select:none;transition:all 0.15s ease;
          border:1px solid ${isActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
          border-left:none;
          background:${isActive ? 'var(--interactive-accent)' : 'var(--background-primary)'};
          color:${isFav ? '#f5a623' : 'var(--text-muted)'};
        `;

        let fontPreviewing = false;
        this._bindHoverPreview(chip,
          () => {
            if (isActive) return;
            fontPreviewing = true;
            chip._prevFont = this.settings.activeFont;
            this.settings.activeFont = fontName;
            this.applyFontSettings();
            chip.style.borderColor = 'var(--interactive-accent)';
            chip.style.background = 'var(--interactive-accent)';
            chip.style.color = '#fff';
            star.style.borderColor = 'var(--interactive-accent)';
            star.style.background = 'var(--interactive-accent)';
          },
          () => {
            if (!fontPreviewing) return;
            fontPreviewing = false;
            this.settings.activeFont = chip._prevFont;
            this.applyFontSettings();
            applyFontChipStyle(chip, star, isActive);
            star.style.color = isFav ? '#f5a623' : 'var(--text-muted)';
          }
        );

        chip.addEventListener('click', async () => {
          if (fontPreviewing) {
            fontPreviewing = false;
            this.settings.activeFont = chip._prevFont;
            this.applyFontSettings();
          }
          if (this.settings.activeFont === fontName) {
            this.settings.activeFont = '';
          } else {
            this.settings.activeFont = fontName;
          }
          this.applyFontSettings();
          await this.saveSettings();
          renderFontChips(fonts);
          renderFontSettings();
        });

        star.addEventListener('click', async (e) => {
          e.stopPropagation();
          if (!this.settings.fontFavorites) this.settings.fontFavorites = [];
          const idx = this.settings.fontFavorites.indexOf(fontName);
          if (idx >= 0) {
            this.settings.fontFavorites.splice(idx, 1);
          } else {
            this.settings.fontFavorites.push(fontName);
          }
          await this.saveSettings();
          renderFontChips(fonts);
        });
      });
    };

    const renderFontSettings = () => {
      fontSettingsPanel.innerHTML = '';

      fontStyleArea.style.display = 'block';
      fontSettingsPanel.style.display = 'block';

      const mkLabel = (text) => {
        const el = document.createElement('span');
        el.textContent = text;
        el.style.cssText = 'font-size:10px;color:var(--text-muted);white-space:nowrap;min-width:60px;';
        return el;
      };

      const mkRow = () => {
        const r = fontSettingsPanel.createDiv();
        r.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:8px;';
        return r;
      };

      const rColor = mkRow();
      rColor.appendChild(mkLabel(t('font.color')));
      const colorInput = rColor.createEl('input', { type: 'color' });
      colorInput.value = this.settings.fontColor || '#ffffff';
      colorInput.style.cssText = 'width:28px;height:22px;padding:0;cursor:pointer;';
      colorInput.addEventListener('input', async () => {
        this.settings.fontColor = colorInput.value;
        this.applyFontSettings();
        await this.saveSettings();
      });
      const colorDefaultBtn = rColor.createEl('span');
      colorDefaultBtn.textContent = t('theme.default');
      colorDefaultBtn.style.cssText = 'font-size:10px;padding:1px 6px;border-radius:8px;cursor:pointer;border:1px solid var(--background-modifier-border);color:var(--text-muted);user-select:none;';
      colorDefaultBtn.addEventListener('click', async () => {
        this.settings.fontColor = '';
        this.applyFontSettings();
        await this.saveSettings();
        renderFontSettings();
      });

      const rOp = mkRow();
      rOp.appendChild(mkLabel(t('font.opacity')));
      const opSlider = rOp.createEl('input', { type: 'range' });
      opSlider.min = '10'; opSlider.max = '100'; opSlider.value = String(Math.round((this.settings.fontOpacity ?? 1) * 100));
      opSlider.style.cssText = 'flex:1;cursor:pointer;height:4px;min-width:80px;';
      const opVal = rOp.createEl('span', { text: Math.round((this.settings.fontOpacity ?? 1) * 100) + '%' });
      opVal.style.cssText = 'font-size:10px;color:var(--text-muted);min-width:28px;';
      opSlider.addEventListener('input', async () => {
        const v = parseInt(opSlider.value) / 100;
        opVal.textContent = opSlider.value + '%';
        this.settings.fontOpacity = v;
        this.applyFontSettings();
        await this.saveSettings();
      });

      const rLh = mkRow();
      rLh.appendChild(mkLabel(t('font.lineHeight')));
      const lhSlider = rLh.createEl('input', { type: 'range' });
      lhSlider.min = '10'; lhSlider.max = '30'; lhSlider.step = '1'; lhSlider.value = String(Math.round((this.settings.fontLineHeight ?? 1.5) * 10));
      lhSlider.style.cssText = 'flex:1;cursor:pointer;height:4px;min-width:80px;';
      const lhVal = rLh.createEl('span', { text: (this.settings.fontLineHeight ?? 0) > 0 ? (this.settings.fontLineHeight).toFixed(1) : '-' });
      lhVal.style.cssText = 'font-size:10px;color:var(--text-muted);min-width:22px;';
      lhSlider.addEventListener('input', async () => {
        const v = parseInt(lhSlider.value) / 10;
        lhVal.textContent = v.toFixed(1);
        this.settings.fontLineHeight = v;
        this.applyFontSettings();
        await this.saveSettings();
      });

      const rMl = mkRow();
      rMl.appendChild(mkLabel(t('font.marginL')));
      const mlSlider = rMl.createEl('input', { type: 'range' });
      mlSlider.min = '-40'; mlSlider.max = '80'; mlSlider.value = String(this.settings.fontMarginL ?? 0);
      mlSlider.style.cssText = 'flex:1;cursor:pointer;height:4px;min-width:80px;';
      const mlVal = rMl.createEl('span', { text: (this.settings.fontMarginL ?? 0) + 'px' });
      mlVal.style.cssText = 'font-size:10px;color:var(--text-muted);min-width:28px;';
      mlSlider.addEventListener('input', async () => {
        const v = parseInt(mlSlider.value);
        mlVal.textContent = v + 'px';
        this.settings.fontMarginL = v;
        this.applyFontSettings();
        await this.saveSettings();
      });

      const rMr = mkRow();
      rMr.appendChild(mkLabel(t('font.marginR')));
      const mrSlider = rMr.createEl('input', { type: 'range' });
      mrSlider.min = '-40'; mrSlider.max = '80'; mrSlider.value = String(this.settings.fontMarginR ?? 0);
      mrSlider.style.cssText = 'flex:1;cursor:pointer;height:4px;min-width:80px;';
      const mrVal = rMr.createEl('span', { text: (this.settings.fontMarginR ?? 0) + 'px' });
      mrVal.style.cssText = 'font-size:10px;color:var(--text-muted);min-width:28px;';
      mrSlider.addEventListener('input', async () => {
        const v = parseInt(mrSlider.value);
        mrVal.textContent = v + 'px';
        this.settings.fontMarginR = v;
        this.applyFontSettings();
        await this.saveSettings();
      });

      const rReset = mkRow();
      const resetBtn = rReset.createEl('span');
      resetBtn.textContent = t('font.reset');
      resetBtn.style.cssText = `
        font-size:10px;padding:1px 8px;border-radius:8px;cursor:pointer;
        border:1px solid var(--background-modifier-border);color:var(--text-muted);
        user-select:none;
      `;
      resetBtn.addEventListener('click', async () => {
        this.settings.activeFont = '';
        this.settings.fontColor = '';
        this.settings.fontOpacity = 1;
        this.settings.fontLineHeight = 0;
        this.settings.fontMarginL = 0;
        this.settings.fontMarginR = 0;
        this.applyFontSettings();
        await this.saveSettings();
        renderFontChips(fontsLoaded);
        renderFontSettings();
        new Notice(t('font.resetDone'));
      });
    };

    const loadFontsIfNeeded = async () => {
      if (fontsLoaded) return;
      if (isMobile) { fontsLoaded = []; return; }
      fontHint.textContent = t('font.loading');
      const fonts = await this.getSystemFonts();
      fontsLoaded = fonts;
      if (fonts.length === 0) {
        fontHint.textContent = t('font.noFonts');
        return;
      }
      fontHint.textContent = '';
      renderFontChips(fonts);
      renderFontSettings();
    };

    fontLabel.addEventListener('click', () => { loadFontsIfNeeded(); });

    renderFontSettings();

    // ── 记忆区域 ──────────────────────────────────────────────────────
    const memoryArea = main.createDiv();
    memoryArea.style.cssText = 'padding:4px 0;';

    const _memoryGetBgLabel = (key) => {
      if (!key) return '';
      if (key.startsWith('__customcolor_')) {
        const idx = parseInt(key.slice(14), 10);
        return (this.settings.customBgColors || [])[idx] || key;
      }
      if (key.startsWith('__img_')) {
        const idx = parseInt(key.slice(6), 10);
        const img = (this.settings.bgImages || [])[idx];
        return img ? (img.name || `img${idx}`) : key;
      }
      if (key.startsWith('__snippet__')) {
        return key.slice('__snippet__'.length);
      }
      return key;
    };

    const _memoryBuildChips = (profile) => {
      const chips = [];
      if (profile.theme !== undefined && profile.theme !== '') {
        chips.push({ label: profile.theme, type: 'theme' });
      }
      if (profile.isDark !== undefined) {
        chips.push({ label: profile.isDark ? 'Dark' : 'Light', type: 'mode' });
      }
      const bgLabel = _memoryGetBgLabel(profile.eyeCareColor);
      if (profile.eyeCareColor && bgLabel) {
        chips.push({ label: bgLabel, type: 'bg', color: (profile.eyeCareColor.startsWith('__customcolor_') ? (this.settings.customBgColors || [])[parseInt(profile.eyeCareColor.slice(14), 10)] : '') });
      }
      if (profile.activeFont) {
        chips.push({ label: profile.activeFont, type: 'font' });
      }
      if (profile.enabledSnippets && profile.enabledSnippets.length > 0) {
        chips.push({ label: profile.enabledSnippets.length + ' snippets', type: 'snippet' });
      }
      return chips;
    };

    const _memoryGetAllEntries = () => {
      const pageStyles = this.settings.pageStyles || {};
      const allFiles = this.app.vault.getFiles().map(f => f.path);
      const entries = [];
      for (const [filePath, profile] of Object.entries(pageStyles)) {
        const exists = allFiles.includes(filePath);
        entries.push({ filePath, profile, exists });
      }
      return entries;
    };

    const renderMemory = async () => {
      memoryArea.empty();
      const pageStyles = this.settings.pageStyles || {};
      const entryCount = Object.keys(pageStyles).length;

      const headerRow = memoryArea.createDiv();
      headerRow.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;';
      const titleLabel = headerRow.createEl('div', { text: t('memory.section') });
      titleLabel.style.cssText = 'font-size:12px;font-weight:600;color:var(--text-normal);';
      const countBadge = headerRow.createEl('span', { text: String(entryCount) });
      countBadge.style.cssText = 'font-size:11px;color:var(--text-muted);background:var(--background-modifier-border);border-radius:8px;padding:0 6px;';

      if (entryCount === 0) {
        const hint = memoryArea.createEl('div', { text: t('memory.empty') });
        hint.style.cssText = 'font-size:12px;color:var(--text-muted);padding:20px 0;text-align:center;';
        return;
      }

      const toolRow = memoryArea.createDiv();
      toolRow.style.cssText = 'display:flex;gap:6px;margin-bottom:8px;align-items:center;flex-wrap:wrap;';
      const searchInput = toolRow.createEl('input');
      searchInput.type = 'text';
      searchInput.placeholder = t('memory.searchPlaceholder');
      searchInput.style.cssText = 'flex:1;min-width:120px;border:1px solid var(--background-modifier-border);border-radius:6px;padding:5px 9px;font-size:12px;background:var(--background-primary);color:var(--text-normal);';
      const cleanBtn = toolRow.createEl('button');
      cleanBtn.textContent = t('memory.cleanInvalid');
      cleanBtn.style.cssText = 'border:1px solid var(--background-modifier-border);background:var(--background-primary);border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px;color:var(--text-muted);';
      const clearAllBtn = toolRow.createEl('button');
      clearAllBtn.textContent = t('memory.forgetAll');
      clearAllBtn.style.cssText = 'border:1px solid var(--background-modifier-border);background:var(--background-primary);border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px;color:var(--text-error);';

      const listContainer = memoryArea.createDiv();
      listContainer.style.cssText = 'min-height:40px;';


      const currentFilePath = this._getActiveFilePath();
      const allEntries = _memoryGetAllEntries();

      const renderList = () => {
        listContainer.empty();
        const q = searchInput.value.trim().toLowerCase();
        let entries = allEntries.slice();
        if (q) {
          entries = entries.filter(e => e.filePath.toLowerCase().includes(q));
        }
        entries.sort((a, b) => {
          if (a.filePath === currentFilePath) return -1;
          if (b.filePath === currentFilePath) return 1;
          if (a.exists !== b.exists) return a.exists ? -1 : 1;
          return a.filePath.localeCompare(b.filePath);
        });

        if (entries.length === 0) {
          const hint = listContainer.createEl('div', { text: t('memory.empty') });
          hint.style.cssText = 'font-size:12px;color:var(--text-muted);padding:12px 0;text-align:center;';
          return;
        }

        for (const entry of entries) {
          const row = listContainer.createDiv();
          const isCurrent = entry.filePath === currentFilePath;
          row.style.cssText = `display:flex;align-items:center;gap:10px;padding:8px 10px;border:1px solid ${isCurrent ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};border-radius:8px;margin-bottom:6px;background:${isCurrent ? 'rgba(var(--interactive-accent-rgb),0.08)' : 'var(--background-primary)'};`;

          const nameCol = row.createDiv();
          nameCol.style.cssText = 'width:160px;flex:none;overflow:hidden;';
          const fileName = entry.filePath.split('/').pop() || entry.filePath;
          const nameEl = nameCol.createEl('div');
          nameEl.style.cssText = 'font-weight:600;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;display:flex;align-items:center;gap:4px;cursor:pointer;';
          nameEl.textContent = fileName;
          nameEl.title = entry.filePath;
          if (entry.exists) {
            nameEl.addEventListener('click', (e) => {
              e.stopPropagation();
              this.app.workspace.openLinkText(entry.filePath, '');
            });
          }
          if (isCurrent) {
            const curTag = nameEl.createEl('span', { text: t('memory.current') });
            curTag.style.cssText = 'font-size:10px;color:var(--interactive-accent);border:1px solid var(--interactive-accent);border-radius:8px;padding:0 5px;flex:none;';
          }
          if (!entry.exists) {
            const invTag = nameEl.createEl('span', { text: t('memory.invalid') });
            invTag.style.cssText = 'font-size:10px;color:var(--text-error);border:1px solid var(--text-error);border-radius:8px;padding:0 5px;flex:none;';
          }
          const pathEl = nameCol.createEl('div', { text: entry.filePath });
          pathEl.style.cssText = 'font-size:11px;color:var(--text-muted);white-space:nowrap;text-overflow:ellipsis;overflow:hidden;';

          const chipsCol = row.createDiv();
          chipsCol.style.cssText = 'display:flex;gap:5px;flex-wrap:wrap;flex:1;align-items:center;';
          const chips = _memoryBuildChips(entry.profile);
          if (chips.length === 0) {
            const none = chipsCol.createEl('span', { text: '—' });
            none.style.cssText = 'color:var(--text-faint);font-size:12px;';
          }
          for (const c of chips) {
            const chip = chipsCol.createEl('span');
            chip.style.cssText = 'display:inline-flex;align-items:center;gap:3px;border:1px solid var(--background-modifier-border);border-radius:12px;padding:1px 8px;font-size:11px;color:var(--text-normal);background:var(--background-primary);';
            if (c.color) {
              const dot = chip.createEl('span');
              dot.style.cssText = `display:inline-block;width:7px;height:7px;border-radius:50%;flex-shrink:0;background:${c.color};`;
            }
            const lbl = chip.createEl('span', { text: c.label });
            lbl.style.cssText = 'white-space:nowrap;max-width:140px;overflow:hidden;text-overflow:ellipsis;';
          }

          const actionCol = row.createDiv();
          actionCol.style.cssText = 'display:flex;gap:4px;flex:none;';
          const forgetBtn = actionCol.createEl('button');
          forgetBtn.textContent = t('memory.forget');
          forgetBtn.style.cssText = 'border:1px solid var(--background-modifier-border);background:var(--background-primary);border-radius:6px;padding:3px 9px;cursor:pointer;font-size:11px;color:var(--text-error);opacity:0.5;transition:opacity 0.15s ease;';
          row.addEventListener('mouseenter', () => { forgetBtn.style.opacity = '1'; });
          row.addEventListener('mouseleave', () => { forgetBtn.style.opacity = '0.5'; });
          forgetBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            delete this.settings.pageStyles[entry.filePath];
            await this.saveSettings();
            new Notice(t('memory.forgetDone'));
            await _refreshChipsAfterForget();
          });
        }
      };

      searchInput.addEventListener('input', renderList);
      cleanBtn.addEventListener('click', async () => {
        const allFiles = this.app.vault.getFiles().map(f => f.path);
        let cleaned = 0;
        for (const fp of Object.keys(this.settings.pageStyles || {})) {
          if (!allFiles.includes(fp)) {
            delete this.settings.pageStyles[fp];
            cleaned++;
          }
        }
        if (cleaned > 0) await this.saveSettings();
        new Notice(t('memory.cleanInvalidDone') + (cleaned > 0 ? ` (${cleaned})` : ''));
        await _refreshChipsAfterForget();
      });
      clearAllBtn.addEventListener('click', async () => {
        if (!confirm(t('memory.forgetAllConfirm'))) return;
        this.settings.pageStyles = {};
        await this.saveSettings();
        new Notice(t('memory.forgetAllDone'));
        await _refreshChipsAfterForget();
      });

      renderList();
    };
    popup._ssRenderMemory = renderMemory;
    const _refreshChipsAfterForget = async () => {
      await renderThemes();
      await renderEyeCare();
      await renderMemory();
    };
    popup._ssRefreshAfterForget = _refreshChipsAfterForget;
    popup._ssRefreshAll = async () => {
      await renderThemes();
      await renderEyeCare();
      await renderMemory();
      renderNav();
    };

    // ── nav + state 逻辑 ──────────────────────────────────────────────
    const _firstGroup = this.settings.groupOrder.find(g => this.settings.groups[g] && g !== '__bg__') || '__ungrouped__';
    let _ssCur = isMobile ? _firstGroup : 'theme';
    const _ssAreas = { theme: themeArea, bg: eyeCareArea, snippets: contentArea, font: fontArea, fontStyle: fontStyleArea, memory: memoryArea };

    const renderState = async () => {};

    const _specialNavIds = ['theme', '__ungrouped__', 'bg', 'font', 'memory'];
    const renderNav = () => {
      nav.empty();

      if (!this.settings.navBoxes || !Array.isArray(this.settings.navBoxes) || this.settings.navBoxes.length === 0) {
        this.settings.navBoxes = [
          { id: 'appearance', title: '', items: ['theme', 'bg', 'font'] },
          { id: 'snippets', title: '', auto: true },
          { id: 'system', title: '', items: ['memory'] }
        ];
      }

      const _requiredInBox = { appearance: ['theme', 'bg', 'font'], system: ['memory'] };
      for (const [bid, reqs] of Object.entries(_requiredInBox)) {
        const box = this.settings.navBoxes.find(b => b.id === bid);
        if (box && !box.auto) {
          if (!box.items) box.items = [];
          for (const r of reqs) { if (!box.items.includes(r)) box.items.push(r); }
        }
      }

      const orderedGroups = this.settings.groupOrder.filter(g => this.settings.groups[g] && g !== '__bg__');
      const _allNavItems = ['theme', ...orderedGroups, '__ungrouped__', 'bg', 'font', 'memory'];

      const claimedItems = new Set();
      for (const box of this.settings.navBoxes) {
        if (!box.auto && box.items) box.items.forEach(id => { if (_allNavItems.includes(id)) claimedItems.add(id); });
      }

      const getBoxItems = (box) => {
        if (box.auto) return [...orderedGroups, '__ungrouped__'].filter(id => !claimedItems.has(id) && _allNavItems.includes(id));
        return (box.items || []).filter(id => _allNavItems.includes(id));
      };

      const _allSnippetFiles = this._getAllSnippetFilesSync();
      const _groupedSet = new Set();
      for (const members of Object.values(this.settings.groups)) { members.forEach(s => _groupedSet.add(s)); }
      const _ungroupedCount = _allSnippetFiles.filter(n => !_groupedSet.has(n)).length;
      const _bgMembers = this.settings.groups['__bg__'] || [];
      const _bgColors = this.settings.customBgColors || [];
      const _bgCount = _bgMembers.length + _bgColors.length;
      const cc = this.app.customCss;

      const getItemInfo = (id) => {
        if (id === 'theme') return { name: t('theme.section'), count: '', active: true };
        if (id === '__ungrouped__') return { name: _currentLang === 'zh' ? '未分组 Snippets' : 'ungrouped Snippets', count: String(_ungroupedCount), active: false };
        if (id === 'bg') return { name: t('eyeCare.section'), count: String(_bgCount), active: !!(this.settings.eyeCareColor) };
        if (id === 'font') return { name: t('font.section'), count: '', active: !!(this.settings.activeFont) };
        if (id === 'memory') return { name: t('memory.section'), count: String(Object.keys(this.settings.pageStyles || {}).length), active: !!(this.settings.styleMemory) };
        const members = this.settings.groups[id] || [];
        const onCount = members.filter(n => cc && cc.enabledSnippets && cc.enabledSnippets.has(n)).length;
        return { name: id, count: onCount > 0 ? onCount + '/' + members.length : String(members.length), active: onCount > 0 };
      };

      const _curBoxId = (() => {
        for (const box of this.settings.navBoxes) { if (getBoxItems(box).includes(_ssCur)) return box.id; }
        return null;
      })();

      let _dragSrcItem = null;
      let _dragSrcBoxId = null;
      const _defaultBoxIds = ['appearance', 'snippets', 'system'];

      for (const box of this.settings.navBoxes) {
        const boxItems = getBoxItems(box);
        if (boxItems.length === 0 && box.auto) continue;

        const isSystem = box.id === 'system';
        const isHit = _curBoxId === box.id;
        const boxTitle = box.title || t('navBox.' + box.id) || t('navBox.untitled');

        const boxEl = nav.createDiv();
        const hitColor = isSystem ? 'var(--text-error)' : 'var(--interactive-accent)';
        boxEl.style.cssText = `position:relative;border:1.5px solid ${isHit ? hitColor : 'var(--background-modifier-border)'};border-radius:11px;background:var(--ss-popup-bg);padding:10px 6px 6px;margin-bottom:12px;transition:border-color 0.15s;${box.id === 'system' ? 'margin-top:auto;' : ''}`;

        const hd = boxEl.createDiv();
        hd.style.cssText = 'position:absolute;top:-9px;left:12px;display:flex;align-items:center;gap:4px;background:var(--ss-popup-bg);padding:0 6px;font-size:11.5px;color:var(--text-muted);user-select:none;z-index:1;';

        const hdLabel = hd.createEl('span');
        hdLabel.textContent = boxTitle;
        hdLabel.style.cursor = 'pointer';

        if (box.id === 'snippets' && !isMobile) {
          const addBtn = hd.createEl('span');
          addBtn.textContent = '+';
          addBtn.style.cssText = 'width:18px;height:18px;border-radius:5px;display:grid;place-items:center;cursor:pointer;color:var(--text-muted);font-size:14px;line-height:1;';
          addBtn.addEventListener('mouseenter', () => { addBtn.style.background = 'var(--background-modifier-hover)'; addBtn.style.color = 'var(--text-normal)'; });
          addBtn.addEventListener('mouseleave', () => { addBtn.style.background = ''; addBtn.style.color = 'var(--text-muted)'; });
          addBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const groupName = await this._promptGroupName('');
            if (groupName && !this.settings.groups[groupName]) {
              this.settings.groups[groupName] = [];
              this.settings.groupOrder.push(groupName);
              await this.saveSettings();
              _ssCur = groupName; updateAreas(); renderNav();
            }
          });
        }

        if (!_defaultBoxIds.includes(box.id)) {
          hdLabel.addEventListener('contextmenu', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!confirm(t('navBox.deleteConfirm').replace('{0}', boxTitle))) return;
            this.settings.navBoxes = this.settings.navBoxes.filter(b => b.id !== box.id);
            await this.saveSettings();
            renderNav();
          });
        }

        hdLabel.addEventListener('dblclick', async (e) => {
          e.stopPropagation();
          const newTitle = await this._promptGroupName(boxTitle, t('navBox.titlePrompt'));
          if (newTitle && newTitle !== boxTitle) {
            box.title = newTitle;
            await this.saveSettings();
            renderNav();
          }
        });

        const listEl = boxEl.createDiv();
        listEl.style.cssText = 'display:flex;flex-direction:column;gap:1px;';

        if (boxItems.length === 0 && !box.auto) {
          const hint = listEl.createEl('span');
          hint.textContent = _currentLang === 'zh' ? '拖入项目' : 'Drag items here';
          hint.style.cssText = 'font-size:11px;color:var(--text-faint);padding:4px 9px;font-style:italic;';
        }

        for (const itemId of boxItems) {
          const info = getItemInfo(itemId);
          const isSel = _ssCur === itemId && !searchInput.value;
          const selColor = isSystem ? 'var(--text-error)' : 'var(--interactive-accent)';

          const btn = listEl.createEl('button');
          btn.style.cssText = `display:flex;width:100%;align-items:center;gap:6px;background:none;border:0;border-radius:7px;padding:6px 9px;text-align:left;cursor:pointer;font-size:12px;color:${isSel ? selColor : 'var(--text-normal)'};${isSel ? 'background:' + (isSystem ? 'rgba(var(--mono-rgb-0),0.15)' : 'rgba(var(--interactive-accent-rgb),0.12)') + ';font-weight:600;' : ''}`;
          if (isMobile) btn.style.cssText += 'border:1px solid var(--background-modifier-border);min-width:0;';

          const dot = btn.createEl('span');
          dot.style.cssText = `width:7px;height:7px;border-radius:50%;flex:none;border:1.5px solid ${info.active ? 'var(--interactive-accent)' : 'var(--text-faint)'};${info.active ? 'background:var(--interactive-accent);' : ''}`;

          const lbl = btn.createEl('span');
          lbl.textContent = info.name;
          lbl.style.cssText = 'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';

          if (info.count !== '' && !isMobile) {
            const n = btn.createEl('span');
            n.textContent = info.count;
            n.style.cssText = `font-size:11.5px;color:${isSel ? selColor : 'var(--text-muted)'};font-variant-numeric:tabular-nums;`;
          }

          btn.addEventListener('click', (e) => { e.stopPropagation(); searchInput.value = ''; _ssCur = itemId; updateAreas(); renderNav(); });
          btn.addEventListener('contextmenu', (e) => {
            e.preventDefault(); e.stopPropagation();
            document.querySelectorAll('.ss-nav-ctx-menu').forEach(m => m.remove());
            const menu = document.createElement('div');
            menu.className = 'ss-nav-ctx-menu';
            const _ctxDark = !!(document.body.classList.contains('theme-dark') || window.matchMedia('(prefers-color-scheme: dark)').matches);
            const _ctxBg = _ctxDark ? '#262624' : '#fcfbf8';
            const _ctxBorder = _ctxDark ? '#3b3b37' : '#dedbd3';
            const _ctxHover = _ctxDark ? '#383834' : '#ebe8e1';
            const _ctxText = _ctxDark ? '#e8e6e0' : '#2b2a27';
            menu.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;background:${_ctxBg};border:1px solid ${_ctxBorder};border-radius:6px;padding:4px 0;z-index:10001;box-shadow:0 4px 16px rgba(0,0,0,0.25);min-width:120px;`;
            const mkItem = (label, action) => {
              const item = document.createElement('div');
              item.textContent = label;
              item.style.cssText = `padding:6px 16px;cursor:pointer;font-size:12px;color:${_ctxText};`;
              item.addEventListener('mouseenter', () => { item.style.background = _ctxHover; });
              item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; });
              item.addEventListener('click', async () => { menu.remove(); await action(); });
              menu.appendChild(item);
            };
            const isGroup = !_specialNavIds.includes(itemId) && itemId !== '__ungrouped__';
            if (isGroup) {
              mkItem(t('context.renameGroup'), async () => {
                const newName = await this._promptGroupName(itemId);
                if (newName && newName !== itemId) {
                  const members = this.settings.groups[itemId];
                  delete this.settings.groups[itemId];
                  this.settings.groups[newName] = members;
                  const idx = this.settings.groupOrder.indexOf(itemId);
                  if (idx !== -1) this.settings.groupOrder[idx] = newName;
                  if (Array.isArray(this.settings.navBoxes)) {
                    for (const b of this.settings.navBoxes) { if (b.items) { const bi = b.items.indexOf(itemId); if (bi !== -1) b.items[bi] = newName; } }
                  }
                  await this.saveSettings(); renderNav();
                }
              });
              const isEx = this.settings.exclusiveGroups && this.settings.exclusiveGroups.includes(itemId);
              mkItem((isEx ? '✓ ' : '') + t('group.exclusive'), async () => {
                if (!this.settings.exclusiveGroups) this.settings.exclusiveGroups = [];
                if (isEx) this.settings.exclusiveGroups = this.settings.exclusiveGroups.filter(g => g !== itemId);
                else this.settings.exclusiveGroups.push(itemId);
                await this.saveSettings(); renderNav();
              });
              mkItem(t('context.deleteGroup'), async () => {
                delete this.settings.groups[itemId];
                this.settings.groupOrder = this.settings.groupOrder.filter(n => n !== itemId);
                if (Array.isArray(this.settings.navBoxes)) {
                  for (const b of this.settings.navBoxes) { if (b.items) b.items = b.items.filter(n => n !== itemId); }
                }
                await this.saveSettings(); renderNav();
              });
              const sep = document.createElement('div');
              sep.style.cssText = `height:1px;background:${_ctxBorder};margin:4px 0;`;
              menu.appendChild(sep);
            }
            const moveLabel = _currentLang === 'zh' ? '移至' : 'Move to';
            for (const targetBox of this.settings.navBoxes) {
              if (targetBox.id === box.id) continue;
              if (targetBox.auto && !isGroup) continue;
              const targetTitle = targetBox.title || t('navBox.' + targetBox.id) || t('navBox.untitled');
              mkItem(moveLabel + ' → ' + targetTitle, async () => {
                if (!targetBox.auto) {
                  if (!targetBox.items) targetBox.items = [];
                  if (!targetBox.items.includes(itemId)) targetBox.items.push(itemId);
                }
                if (!box.auto && box.id !== targetBox.id) {
                  box.items = (box.items || []).filter(id => id !== itemId);
                }
                await this.saveSettings(); renderNav();
              });
            }
            document.body.appendChild(menu);
            const closeMenu = (ev) => { if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('click', closeMenu); } };
            setTimeout(() => document.addEventListener('click', closeMenu), 0);
          });
          if (!isMobile) {
            this._bindHoverPreview(btn,
              () => { if (_ssCur === itemId && !searchInput.value) return; searchInput.value = ''; _ssCur = itemId; updateAreas(); renderNav(); }
            );
            btn.draggable = true;
            btn.addEventListener('dragstart', (e) => {
              _dragSrcItem = itemId; _dragSrcBoxId = box.id;
              e.dataTransfer.effectAllowed = 'move';
              try { e.dataTransfer.setData('text/plain', itemId); } catch (_) {}
              btn.style.opacity = '0.4';
            });
            btn.addEventListener('dragend', () => { btn.style.opacity = ''; _dragSrcItem = null; _dragSrcBoxId = null; });
            btn.addEventListener('dragover', (e) => {
              if (!_dragSrcItem) return;
              e.preventDefault(); e.dataTransfer.dropEffect = 'move';
              btn.style.background = 'rgba(var(--interactive-accent-rgb),0.2)';
            });
            btn.addEventListener('dragleave', () => { if (_ssCur === itemId && !searchInput.value) return; btn.style.background = ''; });
            btn.addEventListener('drop', async (e) => {
              e.preventDefault(); btn.style.background = '';
              if (!_dragSrcItem || _dragSrcItem === itemId) return;
              const targetBox = this.settings.navBoxes.find(b => b.id === box.id);
              const srcBox = this.settings.navBoxes.find(b => b.id === _dragSrcBoxId);
              if (targetBox && !targetBox.auto) {
                if (!targetBox.items) targetBox.items = [];
                if (!targetBox.items.includes(_dragSrcItem)) {
                  const ti = targetBox.items.indexOf(itemId);
                  if (ti >= 0) targetBox.items.splice(ti, 0, _dragSrcItem);
                  else targetBox.items.push(_dragSrcItem);
                }
              }
              if (srcBox && !srcBox.auto && srcBox.id !== box.id) {
                srcBox.items = (srcBox.items || []).filter(id => id !== _dragSrcItem);
              }
              if (box.auto && _dragSrcBoxId === box.id) {
                const items = getBoxItems(box);
                const from = items.indexOf(_dragSrcItem), to = items.indexOf(itemId);
                if (from !== -1 && to !== -1) {
                  const newOrder = items.slice();
                  newOrder.splice(from, 1); newOrder.splice(to, 0, _dragSrcItem);
                  this.settings.groupOrder = newOrder.filter(id => !_specialNavIds.includes(id) && this.settings.groups[id]);
                  for (const g of items) { if (!this.settings.groupOrder.includes(g) && this.settings.groups[g]) this.settings.groupOrder.push(g); }
                }
              }
              await this.saveSettings(); renderNav();
            });
          }
        }

        if (!isMobile && !box.auto) {
          boxEl.addEventListener('dragover', (e) => { if (!_dragSrcItem) return; e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
          boxEl.addEventListener('drop', async (e) => {
            if (!_dragSrcItem || e.target.closest('button')) return;
            e.preventDefault();
            const targetBox = this.settings.navBoxes.find(b => b.id === box.id);
            const srcBox = this.settings.navBoxes.find(b => b.id === _dragSrcBoxId);
            if (targetBox && !targetBox.items) targetBox.items = [];
            if (targetBox && !targetBox.items.includes(_dragSrcItem)) targetBox.items.push(_dragSrcItem);
            if (srcBox && !srcBox.auto && srcBox.id !== box.id) srcBox.items = (srcBox.items || []).filter(id => id !== _dragSrcItem);
            await this.saveSettings(); renderNav();
          });
        }
      }

      if (!isMobile) {
        const addBoxBtn = nav.createEl('button');
        addBoxBtn.textContent = '+ ' + t('navBox.addBox');
        addBoxBtn.style.cssText = 'display:flex;width:100%;align-items:center;gap:6px;background:none;border:1px dashed var(--background-modifier-border);border-radius:8px;padding:6px 8px;text-align:left;cursor:pointer;font-size:12px;color:var(--text-muted);margin-top:4px;';
        addBoxBtn.addEventListener('mouseenter', () => { addBoxBtn.style.borderColor = 'var(--interactive-accent)'; addBoxBtn.style.color = 'var(--interactive-accent)'; });
        addBoxBtn.addEventListener('mouseleave', () => { addBoxBtn.style.borderColor = 'var(--background-modifier-border)'; addBoxBtn.style.color = 'var(--text-muted)'; });
        addBoxBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const title = await this._promptGroupName('', t('navBox.titlePrompt'));
          if (!title) return;
          this.settings.navBoxes.push({ id: 'custom_' + Date.now(), title: title, items: [] });
          await this.saveSettings(); renderNav();
        });
      }
    };


    const updateAreas = () => {
      const q = searchInput.value.trim().toLowerCase();
      const isGroup = !_ssSpecialIds.includes(_ssCur);
      Object.entries(_ssAreas).forEach(([id, area]) => {
        if (q || isGroup) {
          area.style.display = id === 'snippets' ? 'block' : 'none';
        } else if (_ssCur === 'font') {
          area.style.display = (id === 'font' || id === 'fontStyle') ? 'block' : 'none';
        } else {
          area.style.display = _ssCur === id ? 'block' : 'none';
        }
      });
      if (!q && _ssCur === 'font') loadFontsIfNeeded();
      if (!q && _ssCur === 'memory') renderMemory();
      if (q || isGroup) renderContent();
    };

    searchInput.addEventListener('input', () => { updateAreas(); renderNav(); });

    const renderAll = async () => { await renderState(); renderNav(); updateAreas(); };
    popup._ssRenderAll = renderAll;
    popup._ssRenderNav = renderNav;

    renderAll();
    const footer = popup.createDiv();
    footer.style.cssText = 'padding-top:10px;margin-top:auto;border-top:1px solid var(--background-modifier-border);display:flex;align-items:center;gap:8px;flex-wrap:wrap;opacity:0.5;transition:opacity 0.3s ease;cursor:default;position:relative;flex-shrink:0;';


    footer.addEventListener('mouseenter', () => { footer.style.opacity = '1'; });
    footer.addEventListener('mouseleave', () => { footer.style.opacity = '0.5'; });

    const settingsIcon = footer.createEl('span');
    settingsIcon.textContent = '\u2699';
    settingsIcon.title = t('settings.title');
    settingsIcon.style.cssText = `
      font-size:16px;cursor:pointer;user-select:none;opacity:0.6;transition:opacity 0.15s ease;
      margin-right:4px;
    `;
    let _ssSettingsHoverTimer = null;
    const _ssCloseSettings = () => { const sp = document.getElementById('ss-settings-popup'); if (sp) sp.remove(); };
    const _ssOpenSettings = () => {
      if (document.getElementById('ss-settings-popup')) return;
      const settingsPopup = document.createElement('div');
      settingsPopup.id = 'ss-settings-popup';
      settingsPopup.style.cssText = `
        position:fixed;z-index:10002;
        background:rgba(var(--mono-rgb-0),0.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
        border:1px solid var(--background-modifier-border);border-radius:8px;
        box-shadow:0 4px 16px rgba(0,0,0,0.25);padding:14px 18px;min-width:300px;max-width:460px;
      `;
      const rect = settingsIcon.getBoundingClientRect();
      settingsPopup.style.left = rect.left + 'px';
      settingsPopup.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
      requestAnimationFrame(() => {
        const pRect = settingsPopup.getBoundingClientRect();
        if (pRect.left + pRect.width > window.innerWidth) settingsPopup.style.left = (window.innerWidth - pRect.width - 8) + 'px';
      });
      const title = settingsPopup.createEl('div', { text: t('settings.title') });
      title.style.cssText = 'font-size:13px;font-weight:600;margin-bottom:10px;color:var(--text-normal);';

      const autoBgRow = settingsPopup.createDiv();
      autoBgRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;';
      const autoBgLabel = autoBgRow.createEl('span', { text: t('settings.autoBgByName') });
      autoBgLabel.style.cssText = 'font-size:12px;color:var(--text-normal);';
      const autoBgToggle = autoBgRow.createEl('span');
      const isAutoBgOn = !!this.settings.autoBgByName;
      autoBgToggle.style.cssText = `display:inline-block;width:36px;height:20px;border-radius:10px;position:relative;cursor:pointer;transition:background 0.15s ease;background:${isAutoBgOn ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};flex-shrink:0;`;
      const autoBgKnob = autoBgToggle.createEl('span');
      autoBgKnob.style.cssText = `position:absolute;top:2px;left:${isAutoBgOn ? '18px' : '2px'};width:16px;height:16px;border-radius:50%;background:#fff;transition:left 0.15s ease;`;
      autoBgToggle.addEventListener('click', async () => {
        this.settings.autoBgByName = !this.settings.autoBgByName;
        const on = this.settings.autoBgByName;
        autoBgToggle.style.background = on ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
        autoBgKnob.style.left = on ? '18px' : '2px';
        await this.saveSettings();
      });

      const tabWheelRow = settingsPopup.createDiv();
      tabWheelRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:10px;';
      const tabWheelLabel = tabWheelRow.createEl('span', { text: t('settings.tabHeaderWheelTheme') });
      tabWheelLabel.style.cssText = 'font-size:12px;color:var(--text-normal);';
      const tabWheelToggle = tabWheelRow.createEl('span');
      const isTabWheelOn = !!this.settings.tabHeaderWheelTheme;
      tabWheelToggle.style.cssText = `display:inline-block;width:36px;height:20px;border-radius:10px;position:relative;cursor:pointer;transition:background 0.15s ease;background:${isTabWheelOn ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};flex-shrink:0;`;
      const tabWheelKnob = tabWheelToggle.createEl('span');
      tabWheelKnob.style.cssText = `position:absolute;top:2px;left:${isTabWheelOn ? '18px' : '2px'};width:16px;height:16px;border-radius:50%;background:#fff;transition:left 0.15s ease;`;
      tabWheelToggle.addEventListener('click', async () => {
        this.settings.tabHeaderWheelTheme = !this.settings.tabHeaderWheelTheme;
        const on = this.settings.tabHeaderWheelTheme;
        tabWheelToggle.style.background = on ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
        tabWheelKnob.style.left = on ? '18px' : '2px';
        await this.saveSettings();
      });

      // 悬浮按钮滚轮切换分组复选框
      const wheelGroupsRow = settingsPopup.createDiv();
      wheelGroupsRow.style.cssText = 'margin-top:10px;';
      const wheelGroupsLabel = wheelGroupsRow.createEl('div', { text: t('settings.wheelGroups') });
      wheelGroupsLabel.style.cssText = 'font-size:12px;color:var(--text-normal);margin-bottom:4px;';
      const wheelGroupsHint = wheelGroupsRow.createEl('div', { text: t('settings.wheelGroupsHint') });
      wheelGroupsHint.style.cssText = 'font-size:11px;color:var(--text-muted);margin-bottom:6px;';
      const wheelGroupsList = wheelGroupsRow.createDiv();
      wheelGroupsList.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;';
      const _wheelGroupNames = (this.settings.groupOrder || []).filter(g => this.settings.groups[g]);
      if (!_wheelGroupNames.includes('__bg__') && this.settings.groups['__bg__']) _wheelGroupNames.unshift('__bg__');
      const _wheelSelected = Array.isArray(this.settings.wheelGroups) ? this.settings.wheelGroups : ['__bg__'];
      _wheelGroupNames.forEach(gName => {
        const chip = wheelGroupsList.createEl('span');
        const isSel = _wheelSelected.includes(gName);
        chip.style.cssText = `display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:4px;font-size:11px;cursor:pointer;border:1px solid ${isSel ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};background:${isSel ? 'var(--interactive-accent)' : 'var(--background-primary)'};color:${isSel ? '#fff' : 'var(--text-normal)'};`;
        chip.textContent = gName === '__bg__' ? (t('eyeCare.default') === 'Default' ? 'Background' : '背景色') : gName;
        chip.addEventListener('click', async () => {
          const idx = this.settings.wheelGroups.indexOf(gName);
          if (idx >= 0) this.settings.wheelGroups.splice(idx, 1);
          else this.settings.wheelGroups.push(gName);
          const sel = this.settings.wheelGroups.includes(gName);
          chip.style.border = `1px solid ${sel ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'}`;
          chip.style.background = sel ? 'var(--interactive-accent)' : 'var(--background-primary)';
          chip.style.color = sel ? '#fff' : 'var(--text-normal)';
          await this.saveSettings();
        });
      });

      const chipHintRow = settingsPopup.createDiv();
      chipHintRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:10px;';
      const chipHintLabel = chipHintRow.createEl('span', { text: t('settings.chipHoverHint') });
      chipHintLabel.style.cssText = 'font-size:12px;color:var(--text-normal);';
      const chipHintToggle = chipHintRow.createEl('span');
      const isChipHintOn = this.settings.chipHoverHint !== false;
      chipHintToggle.style.cssText = `display:inline-block;width:36px;height:20px;border-radius:10px;position:relative;cursor:pointer;transition:background 0.15s ease;background:${isChipHintOn ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};flex-shrink:0;`;
      const chipHintKnob = chipHintToggle.createEl('span');
      chipHintKnob.style.cssText = `position:absolute;top:2px;left:${isChipHintOn ? '18px' : '2px'};width:16px;height:16px;border-radius:50%;background:#fff;transition:left 0.15s ease;`;
      chipHintToggle.addEventListener('click', async () => {
        this.settings.chipHoverHint = !this.settings.chipHoverHint;
        const on = this.settings.chipHoverHint;
        chipHintToggle.style.background = on ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
        chipHintKnob.style.left = on ? '18px' : '2px';
        await this.saveSettings();
      });

      const hoverRow = settingsPopup.createDiv();
      hoverRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:10px;';
      const hoverLabel = hoverRow.createEl('span', { text: t('settings.hoverPreview') });
      hoverLabel.style.cssText = 'font-size:12px;color:var(--text-normal);';
      const hoverToggle = hoverRow.createEl('span');
      const isHoverOn = !!this.settings.hoverPreview;
      hoverToggle.style.cssText = `display:inline-block;width:36px;height:20px;border-radius:10px;position:relative;cursor:pointer;transition:background 0.15s ease;background:${isHoverOn ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};flex-shrink:0;`;
      const hoverKnob = hoverToggle.createEl('span');
      hoverKnob.style.cssText = `position:absolute;top:2px;left:${isHoverOn ? '18px' : '2px'};width:16px;height:16px;border-radius:50%;background:#fff;transition:left 0.15s ease;`;
      hoverToggle.addEventListener('click', async () => {
        this.settings.hoverPreview = !this.settings.hoverPreview;
        const on = this.settings.hoverPreview;
        hoverToggle.style.background = on ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
        hoverKnob.style.left = on ? '18px' : '2px';
        await this.saveSettings();
      });

      const hoverDelayRow = settingsPopup.createDiv();
      hoverDelayRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:10px;';
      const hoverDelayLabel = hoverDelayRow.createEl('span', { text: t('settings.hoverDelay') });
      hoverDelayLabel.style.cssText = 'font-size:12px;color:var(--text-normal);';
      const hoverDelayInput = hoverDelayRow.createEl('input');
      hoverDelayInput.type = 'number';
      hoverDelayInput.min = '0';
      hoverDelayInput.max = '2000';
      hoverDelayInput.value = String(this.settings.hoverDelay || 0);
      hoverDelayInput.style.cssText = 'width:80px;border:1px solid var(--background-modifier-border);border-radius:6px;padding:4px 8px;font-size:12px;background:var(--background-primary);color:var(--text-normal);';
      hoverDelayInput.addEventListener('change', async () => {
        const v = Math.max(0, Math.min(2000, parseInt(hoverDelayInput.value) || 0));
        this.settings.hoverDelay = v;
        hoverDelayInput.value = String(v);
        await this.saveSettings();
      });

      const modeRow = settingsPopup.createDiv();
      modeRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:10px;';
      const modeLabel = modeRow.createEl('span', { text: t('settings.defaultBgMode') });
      modeLabel.style.cssText = 'font-size:12px;color:var(--text-normal);';
      const modeBtns = modeRow.createDiv();
      modeBtns.style.cssText = 'display:flex;gap:4px;';
      const modeOptions = [
        { key: '', label: t('settings.modeNone') },
        { key: 'dark', label: t('settings.modeDark') },
        { key: 'light', label: t('settings.modeLight') },
      ];
      const renderModeBtns = () => {
        modeBtns.innerHTML = '';
        modeOptions.forEach(opt => {
          const btn = modeBtns.createEl('span');
          const active = this.settings.defaultEyeCareMode === opt.key;
          btn.textContent = opt.label;
          btn.style.cssText = `padding:2px 8px;border-radius:8px;font-size:11px;cursor:pointer;border:1px solid ${active ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};background:${active ? 'var(--interactive-accent)' : 'transparent'};color:${active ? '#fff' : 'var(--text-normal)'};user-select:none;`;
          btn.addEventListener('click', async () => {
            this.settings.defaultEyeCareMode = opt.key;
            await this.saveSettings();
            renderModeBtns();
          });
      });
      };

      renderModeBtns();

      document.body.appendChild(settingsPopup);
      settingsPopup.addEventListener('mouseenter', () => { if (_ssSettingsHoverTimer) { clearTimeout(_ssSettingsHoverTimer); _ssSettingsHoverTimer = null; } });
      settingsPopup.addEventListener('mouseleave', () => { _ssSettingsHoverTimer = setTimeout(_ssCloseSettings, 200); });
    };
    settingsIcon.addEventListener('mouseenter', () => {
      settingsIcon.style.opacity = '1';
      if (_ssSettingsHoverTimer) { clearTimeout(_ssSettingsHoverTimer); _ssSettingsHoverTimer = null; }
      _ssOpenSettings();
    });
    settingsIcon.addEventListener('mouseleave', () => {
      settingsIcon.style.opacity = '0.6';
      _ssSettingsHoverTimer = setTimeout(_ssCloseSettings, 200);
    });

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
    mkPluginChip('file ops plus', 'file-ops-plus');

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
      animStyle.textContent = `@keyframes ss-dot-breathe{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}@keyframes ss-dot-breathe478{0%{opacity:0.5;transform:scale(0.8)}21%{opacity:1;transform:scale(1.2)}58%{opacity:1;transform:scale(1.2)}100%{opacity:0.5;transform:scale(0.8)}}@keyframes ss-dot-breatheBox{0%{opacity:0.5;transform:scale(0.8)}25%{opacity:1;transform:scale(1.2)}50%{opacity:1;transform:scale(1.2)}75%{opacity:0.5;transform:scale(0.8)}100%{opacity:0.5;transform:scale(0.8)}}@keyframes ss-yin-yang{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`;
      document.head.appendChild(animStyle);
    }

    // ── 右下角调整大小手柄 ────────────────────────────────────────────
    const resizeHandle = document.body.createDiv();
    resizeHandle.className = 'ss-resize-handle';
    resizeHandle.style.cssText = isMobile ? 'display:none;' : 'position:fixed;width:12px;height:12px;cursor:nwse-resize;z-index:10001;background:linear-gradient(135deg,transparent 50%,var(--text-muted) 50%);pointer-events:auto;border-radius:0 0 8px 0;opacity:0.5;transition:opacity 0.15s ease;';
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
        if (Array.isArray(this.settings.navOrder)) {
          const ni = this.settings.navOrder.indexOf(groupName);
          if (ni !== -1) this.settings.navOrder[ni] = newName;
        }
        if (Array.isArray(this.settings.navBoxes)) {
          for (const box of this.settings.navBoxes) {
            if (box.items) { const bi = box.items.indexOf(groupName); if (bi !== -1) box.items[bi] = newName; }
          }
        }
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
      if (Array.isArray(this.settings.navOrder)) this.settings.navOrder = this.settings.navOrder.filter(n => n !== groupName);
      if (Array.isArray(this.settings.navBoxes)) {
        for (const box of this.settings.navBoxes) {
          if (box.items) box.items = box.items.filter(n => n !== groupName);
        }
      }
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
    chip._applyStyle = applyStyle;
    chip._syncEnabled = (en) => { chipEnabled = en; applyStyle(en); };
    let isPreviewing = false;
    let previewDisabledMembers = [];

    this._bindHoverPreview(chip,
      () => {
        if (chipEnabled) return;
        isPreviewing = true;
        if (isExclusive) {
          const members = this.settings.groups[currentGroup] || [];
          previewDisabledMembers = [];
          for (const name of members) {
            if (name !== snippetName) {
              const cc = this.app.customCss;
              const wasEnabled = cc && cc.enabledSnippets && cc.enabledSnippets.has(name);
              if (wasEnabled) {
                this._setSnippetEnabled(name, false);
                previewDisabledMembers.push(name);
              }
            }
          }
        }
        this._setSnippetEnabled(snippetName, true);
        applyStyle(true);
      },
      () => {
        if (!isPreviewing) return;
        isPreviewing = false;
        this._setSnippetEnabled(snippetName, false);
        for (const name of previewDisabledMembers) {
          this._setSnippetEnabled(name, true);
        }
        previewDisabledMembers = [];
        applyStyle(chipEnabled);
      }
    );

    chip.addEventListener('click', async (e) => {
      e.stopPropagation();
      isPreviewing = false;

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
      if (isExclusive) {
        const groupEl = chip.closest('[data-group]');
        if (groupEl) {
          groupEl.querySelectorAll('.ss-chip').forEach(c => {
            if (c === chip || !c._syncEnabled) return;
            const name = c.getAttribute('data-snippet');
            const cc = this.app.customCss;
            const en = cc && cc.enabledSnippets && cc.enabledSnippets.has(name);
            c._syncEnabled(en);
          });
        }
      }
      const _popupEl = document.getElementById('ss-snippets-popup');
      if (_popupEl && _popupEl._ssRenderNav) _popupEl._ssRenderNav();
    });

    const buildSnippetOpts = () => {
      const opts = [];
      if (currentGroup === '__bg__') {
        if (this.settings.defaultEyeCareColor === '__snippet__' + snippetName) {
          opts.push({ label: t('eyeCare.clearDefault'), action: async () => {
            this.settings.defaultEyeCareColor = '';
            await this.saveSettings();
            new Notice(t('eyeCare.clearDefaultDone'));
            rerender();
          }});
        } else {
          opts.push({ label: t('eyeCare.setAsDefault'), action: async () => {
            this.settings.defaultEyeCareColor = '__snippet__' + snippetName;
            await this.saveSettings();
            new Notice(t('eyeCare.setAsDefaultDone'));
            rerender();
          }});
        }

      }
      opts.push({ label: t('context.copy'), action: async () => {
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
      }});
      opts.push({ label: t('context.edit'), action: async () => {
        const cssPath = '.obsidian/snippets/' + snippetName + '.css';
        const jsPath = '.obsidian/snippets/' + snippetName + '.js';
        let content = '', editPath = cssPath, readFailed = false;
        try {
          content = await this.app.vault.adapter.read(cssPath);
        } catch (_e) {
          try {
            content = await this.app.vault.adapter.read(jsPath);
            editPath = jsPath;
          } catch (_e2) {
            readFailed = true;
          }
        }
        if (readFailed) {
          new Notice('[SwiftSnippets] ' + (_currentLang === 'zh' ? '读取文件失败，请检查控制台日志' : 'Failed to read file, check console for details'));
        }
        this._showEditForm(document.getElementById('ss-snippets-popup'), snippetName, content, editPath, rerender);
      }});
      if (!isMobile) {
        opts.push({ label: t('context.editExternal'), action: async () => {
          try {
            const snippetsDir = _joinPath(this.app.vault.adapter.basePath, '.obsidian', 'snippets');
            let filePath = _joinPath(snippetsDir, snippetName + '.css');
            if (!nodeFs.existsSync(filePath)) {
              filePath = _joinPath(snippetsDir, snippetName + '.js');
            }
            if (nodeFs.existsSync(filePath)) {
              const { shell } = require('electron');
              await shell.openPath(filePath);
            } else {
              new Notice('File not found');
            }
          } catch (_e) { new Notice('Open failed'); }
        }});
      }
      opts.push({ label: t('context.delete'), action: async () => {
          if (chipEnabled) {
            this._setSnippetEnabled(snippetName, false);
          }
          const presetMatch = snippetName.match(/^ss-(.+)$/);
          if (presetMatch) {
            if (!this.settings.deletedPresets) this.settings.deletedPresets = [];
            if (!this.settings.deletedPresets.includes(presetMatch[1])) {
              this.settings.deletedPresets.push(presetMatch[1]);
            }
          }
          const snippetPath = '.obsidian/snippets/' + snippetName + '.css';
          const jsSnippetPath = '.obsidian/snippets/' + snippetName + '.js';
          let deleted = false;
          try { await this.app.vault.adapter.remove(snippetPath); deleted = true; } catch (_e) {}
          if (!deleted) { try { await this.app.vault.adapter.remove(jsSnippetPath); } catch (_e) {} }
          await this.saveSettings();
          rerender();
      }});
      const _groupNames = this.settings.groupOrder.filter(g => g !== currentGroup);
      _groupNames.forEach(gName => {
        opts.push({ label: t('context.moveToGroup') + ' ▸ ' + gName, action: async () => {
          await this._moveToGroup(snippetName, gName);
          rerender();
        }});
      });
      if (currentGroup) {
        if (currentGroup === '__bg__') {
          opts.push({ label: t('context.delete'), action: async () => {
              if (chipEnabled) {
                this._setSnippetEnabled(snippetName, false);
              }
              const presetMatch = snippetName.match(/^ss-(.+)$/);
              if (presetMatch) {
                if (!this.settings.deletedPresets) this.settings.deletedPresets = [];
                if (!this.settings.deletedPresets.includes(presetMatch[1])) {
                  this.settings.deletedPresets.push(presetMatch[1]);
                }
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
          }});
        } else {
          opts.push({ label: t('context.removeFromGroup'), action: async () => {
            await this._removeFromGroup(snippetName);
            rerender();
          }});
        }
      }
      return opts;
    };

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
      if (currentGroup === '__bg__') {
        if (this.settings.defaultEyeCareColor === '__snippet__' + snippetName) {
          mkItem(t('eyeCare.clearDefault'), async () => {
            this.settings.defaultEyeCareColor = '';
            await this.saveSettings();
            new Notice(t('eyeCare.clearDefaultDone'));
            rerender();
          });
        } else {
          mkItem(t('eyeCare.setAsDefault'), async () => {
            this.settings.defaultEyeCareColor = '__snippet__' + snippetName;
            await this.saveSettings();
            new Notice(t('eyeCare.setAsDefaultDone'));
            rerender();
          });
        }
        const mkToggle = (label, isOn, action) => {
          const item = document.createElement('div');
          item.style.cssText = 'padding:6px 16px;cursor:pointer;font-size:13px;color:var(--text-normal);display:flex;align-items:center;justify-content:space-between;gap:12px;';
          const labelEl = document.createElement('span');
          labelEl.textContent = label;
          const toggle = document.createElement('span');
          toggle.style.cssText = `display:inline-block;width:28px;height:16px;border-radius:8px;position:relative;transition:background 0.15s ease;background:${isOn ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};flex-shrink:0;`;
          const knob = document.createElement('span');
          knob.style.cssText = `position:absolute;top:2px;left:${isOn ? '14px' : '2px'};width:12px;height:12px;border-radius:50%;background:#fff;transition:left 0.15s ease;`;
          toggle.appendChild(knob);
          item.appendChild(labelEl);
          item.appendChild(toggle);
          item.addEventListener('mouseenter', () => { item.style.background = 'var(--background-modifier-hover)'; });
          item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; });
          item.addEventListener('click', async () => { menu.remove(); await action(); });
          menu.appendChild(item);
        };

      }
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

      // 编辑(外部程序打开)（手机端隐藏）
      if (!isMobile) {
      mkItem(t('context.editExternal'), async () => {
        try {
          const snippetsDir = _joinPath(this.app.vault.adapter.basePath, '.obsidian', 'snippets');
          let filePath = _joinPath(snippetsDir, snippetName + '.css');
          if (!nodeFs.existsSync(filePath)) {
            filePath = _joinPath(snippetsDir, snippetName + '.js');
          }
          if (nodeFs.existsSync(filePath)) {
            const { shell } = require('electron');
            await shell.openPath(filePath);
          } else {
            new Notice('File not found');
          }
        } catch (_e) { new Notice('Open failed'); }
      });
      }

      // 删除
      mkItem(t('context.delete'), async () => {
          if (chipEnabled) {
            this._setSnippetEnabled(snippetName, false);
          }
          const presetMatch = snippetName.match(/^ss-(.+)$/);
          if (presetMatch) {
            if (!this.settings.deletedPresets) this.settings.deletedPresets = [];
            if (!this.settings.deletedPresets.includes(presetMatch[1])) {
              this.settings.deletedPresets.push(presetMatch[1]);
            }
          }
          const snippetPath = '.obsidian/snippets/' + snippetName + '.css';
          const jsSnippetPath = '.obsidian/snippets/' + snippetName + '.js';
          let deleted = false;
          try { await this.app.vault.adapter.remove(snippetPath); deleted = true; } catch (_e) {}
          if (!deleted) { try { await this.app.vault.adapter.remove(jsSnippetPath); } catch (_e) {} }
          await this.saveSettings();
          rerender();
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

              if (chipEnabled) {
                this._setSnippetEnabled(snippetName, false);
              }
              const presetMatch = snippetName.match(/^ss-(.+)$/);
              if (presetMatch) {
                if (!this.settings.deletedPresets) this.settings.deletedPresets = [];
                if (!this.settings.deletedPresets.includes(presetMatch[1])) {
                  this.settings.deletedPresets.push(presetMatch[1]);
                }
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
    this._attachSsChipHover(chip, buildSnippetOpts);

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
    const container = popup.firstChild || popup;
    const existingForm = popup.querySelector('.ss-form');
    if (existingForm) existingForm.remove();

    const form = container.createDiv();
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
    if (!popup) return;
    const container = popup.firstChild || popup;
    const existingForm = popup.querySelector('.ss-form');
    if (existingForm) existingForm.remove();

    const form = container.createDiv();
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

  // ─── 状态栏字体按钮 ──────────────────────────────────────────────────
  _createFontBarButton() {
    this._removeFontBarButton();
    const fb = this.settings.fontBarButton;
    if (!fb) return;

    const el = this.addStatusBarItem();
    el.id = 'ss-font-bar-button';
    el.setText(fb.text || t('font.barDefaultText'));
    el.title = t('font.barTitle');
    el.style.cursor = 'pointer';
    el.style.opacity = '0.8';

    const hasCustomCss = fb.css && fb.css.trim();

    if (hasCustomCss) {
      const scopedClassName = this._applyFontBarCustomCss(fb.css);
      if (scopedClassName) {
        el.className += ' ' + scopedClassName;
      }
    }

    el.addEventListener('mouseenter', () => {
      this._openFontManagerPopup(el);
    });

    el.addEventListener('wheel', async (e) => {
      e.preventDefault();
      const favorites = this.settings.fontFavorites || [];
      if (favorites.length === 0) {
        new Notice(t('font.noFavorites'));
        return;
      }
      const cur = this.settings.activeFont || '';
      let idx = favorites.indexOf(cur);
      if (e.deltaY > 0) {
        idx = idx < favorites.length - 1 ? idx + 1 : -1;
      } else {
        idx = idx > 0 ? idx - 1 : -1;
      }
      this.settings.activeFont = idx >= 0 ? favorites[idx] : '';
      this.applyFontSettings();
      await this.saveSettings();
      new Notice(idx >= 0 ? favorites[idx] : t('font.default'));
    }, { passive: false });

    el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._showFontBarContextMenu(e);
    });

    this._fontBarEl = el;
  }

  _removeFontBarButton() {
    if (this._fontBarEl) {
      this._fontBarEl.remove();
      this._fontBarEl = null;
    }
    const styleEl = document.getElementById('ss-fontbar-custom-style');
    if (styleEl) styleEl.remove();
  }

  _applyFontBarCustomCss(cssText) {
    const styleId = 'ss-fontbar-custom-style';
    const old = document.getElementById(styleId);
    if (old) old.remove();
    if (!cssText || !cssText.trim()) return null;
    const classMatch = cssText.match(/\.([a-zA-Z_\u4e00-\u9fff][\w\u4e00-\u9fff-]*)/);
    if (!classMatch) return null;
    const rawClassName = classMatch[1];
    const scopedClassName = `ss-fontbar-${rawClassName}`;
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

  _showFontBarContextMenu(e) {
    const menu = document.createElement('div');
    menu.style.cssText = `
      position:fixed;z-index:10001;background:rgba(var(--mono-rgb-0),0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
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

    mkItem(t('font.barEdit'), () => this._showFontBarEditForm());
    mkItem(_currentLang === 'zh' ? '移除' : 'Remove', async () => {
      this._removeFontBarButton();
      this.settings.fontBarButton = null;
      await this.saveSettings();
    });

    document.body.appendChild(menu);
    const closeMenu = (evt) => {
      if (!menu.contains(evt.target)) { menu.remove(); document.removeEventListener('click', closeMenu); }
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 0);
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

  _showFontBarEditForm() {
    const fb = this.settings.fontBarButton || { text: '', css: '' };

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

    const label = dialog.createEl('div', { text: t('font.barEditTitle') });
    label.style.cssText = 'font-size:13px;font-weight:600;margin-bottom:8px;color:var(--text-normal);';

    const textLabel = dialog.createEl('div', { text: t('font.barEditText') });
    textLabel.style.cssText = 'font-size:12px;color:var(--text-muted);margin-bottom:4px;';

    const textInput = dialog.createEl('input', { type: 'text' });
    textInput.value = fb.text || t('font.barDefaultText');
    textInput.style.cssText = 'width:100%;padding:6px 8px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);margin-bottom:10px;';

    const cssLabel = dialog.createEl('div', { text: t('font.barEditStyle') });
    cssLabel.style.cssText = 'font-size:12px;color:var(--text-muted);margin-bottom:4px;';

    const cssInput = dialog.createEl('textarea');
    cssInput.value = fb.css || '';
    cssInput.style.cssText = 'width:100%;height:140px;padding:6px 8px;border:1px solid var(--background-modifier-border);border-radius:4px;font-family:monospace;font-size:11px;resize:vertical;background:var(--background-primary);color:var(--text-normal);margin-bottom:10px;';

    const btnRow = dialog.createDiv();
    btnRow.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;';

    const cancelBtn = btnRow.createEl('button', { text: t('btn.cancel') });
    cancelBtn.addEventListener('click', () => { backdrop.remove(); dialog.remove(); });

    const saveBtn = btnRow.createEl('button', { text: t('btn.save') });
    saveBtn.style.cssText = 'background:var(--interactive-accent);color:#fff;border:none;border-radius:4px;padding:4px 12px;cursor:pointer;';
    saveBtn.addEventListener('click', async () => {
      this.settings.fontBarButton = {
        text: textInput.value.trim() || t('font.barDefaultText'),
        css: cssInput.value.trim(),
      };
      await this.saveSettings();
      this._removeFontBarButton();
      this._createFontBarButton();
      backdrop.remove();
      dialog.remove();
    });

    backdrop.addEventListener('click', () => { backdrop.remove(); dialog.remove(); });

    document.body.appendChild(backdrop);
    document.body.appendChild(dialog);
    setTimeout(() => textInput.focus(), 50);
  }

  // ─── 独立字体管理面板 ──────────────────────────────────────────────
  _openFontManagerPopup(triggerEl) {
    const existing = document.getElementById('ss-font-popup');
    if (existing) return;

    const popup = document.createElement('div');
    popup.id = 'ss-font-popup';
    popup.style.cssText = `
      position:fixed;
      background:rgba(var(--mono-rgb-0),0.75);backdrop-filter:blur(16px) saturate(180%);-webkit-backdrop-filter:blur(16px) saturate(180%);
      border:1px solid rgba(255,255,255,0.12);border-radius:12px;
      box-shadow:0 12px 40px rgba(0,0,0,0.35);z-index:10000;
      padding:16px 20px;min-width:360px;min-height:200px;width:480px;max-width:95vw;max-height:90vh;overflow-y:auto;overflow-x:hidden;scrollbar-gutter:stable;
    `;

    let isPinned = false;
    let isDraggingPopup = false, dragOffX = 0, dragOffY = 0;

    const positionAtBottomRight = () => {
      const pw = 480;
      popup.style.left = Math.max(4, window.innerWidth - pw - 16) + 'px';
      popup.style.top = Math.max(4, window.innerHeight - Math.min(popup.offsetHeight || 400, window.innerHeight * 0.9) - 16) + 'px';
    };

    const header = popup.createDiv();
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;cursor:move;';

    const title = header.createEl('h3', { text: t('font.barTitle') });
    title.style.cssText = 'margin:0;font-size:15px;color:var(--text-normal);';

    const closeBtn = header.createEl('span');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = 'cursor:pointer;font-size:16px;color:var(--text-muted);padding:2px 6px;';
    closeBtn.addEventListener('click', () => popup.remove());

    header.addEventListener('mousedown', (e) => {
      if (e.target === closeBtn) return;
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
        isPinned = true;
      }
    });

    // ── 启用/禁用 ──────────────────────────────────────────────────
    const toggleRow = popup.createDiv();
    toggleRow.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:8px;';

    const fontToggle = toggleRow.createEl('span');
    const isFontOn = !this._fontDisabled;
    fontToggle.textContent = isFontOn ? t('font.disabled') : t('font.enabled');
    fontToggle.style.cssText = `
      font-size:10px;padding:1px 8px;border-radius:8px;cursor:pointer;
      border:1px solid ${isFontOn ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
      background:${isFontOn ? 'var(--interactive-accent)' : 'transparent'};
      color:${isFontOn ? '#fff' : 'var(--text-muted)'};
      user-select:none;transition:all 0.15s ease;
    `;
    fontToggle.addEventListener('click', async () => {
      this._fontDisabled = !this._fontDisabled;
      const on = !this._fontDisabled;
      fontToggle.textContent = on ? t('font.disabled') : t('font.enabled');
      fontToggle.style.borderColor = on ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
      fontToggle.style.background = on ? 'var(--interactive-accent)' : 'transparent';
      fontToggle.style.color = on ? '#fff' : 'var(--text-muted)';
      this.applyFontSettings();
      await this.saveSettings();
    });

    const currentFontLabel = toggleRow.createEl('span');
    currentFontLabel.textContent = this.settings.activeFont ? this.settings.activeFont : t('font.default');
    currentFontLabel.style.cssText = 'font-size:11px;color:var(--text-muted);margin-left:auto;';

    // ── 字体 chips ──────────────────────────────────────────────────
    const fontChipsContainer = popup.createDiv();
    fontChipsContainer.style.cssText = 'display:none;flex-wrap:wrap;gap:4px;max-height:200px;overflow-y:auto;padding:4px;';

    const fontSettingsPanel = popup.createDiv();
    fontSettingsPanel.style.cssText = 'display:none;margin-top:6px;padding:8px;border:1px solid var(--background-modifier-border);border-radius:6px;background:rgba(var(--mono-rgb-0),0.3);';

    let fontsLoaded = false;

    const applyFontChipStyle = (chip, star, active) => {
      chip.style.borderColor = active ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
      chip.style.background = active ? 'var(--interactive-accent)' : 'var(--background-primary)';
      chip.style.color = active ? '#fff' : 'var(--text-normal)';
      star.style.borderColor = active ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
      star.style.background = active ? 'var(--interactive-accent)' : 'var(--background-primary)';
    };

    const renderFontChips = (fonts) => {
      fontChipsContainer.innerHTML = '';
      const favorites = this.settings.fontFavorites || [];

      const defaultChipWrap = fontChipsContainer.createDiv();
      defaultChipWrap.style.cssText = 'display:inline-flex;align-items:center;gap:0;';
      const isDefaultActive = !this.settings.activeFont;
      const defaultChip = defaultChipWrap.createEl('span');
      defaultChip.textContent = t('font.default');
      defaultChip.style.cssText = `
        display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;cursor:pointer;
        user-select:none;transition:all 0.15s ease;
        border:1px solid ${isDefaultActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
        background:${isDefaultActive ? 'var(--interactive-accent)' : 'var(--background-primary)'};
        color:${isDefaultActive ? '#fff' : 'var(--text-normal)'};
      `;
      const defaultStar = defaultChipWrap.createEl('span');
      defaultStar.style.cssText = 'display:none;';

      let defaultPreviewing = false;
      this._bindHoverPreview(defaultChip,
        () => {
          if (isDefaultActive) return;
          defaultPreviewing = true;
          defaultChip._prevFont = this.settings.activeFont;
          this.settings.activeFont = '';
          this.applyFontSettings();
          defaultChip.style.borderColor = 'var(--interactive-accent)';
          defaultChip.style.background = 'var(--interactive-accent)';
          defaultChip.style.color = '#fff';
        },
        () => {
          if (!defaultPreviewing) return;
          defaultPreviewing = false;
          this.settings.activeFont = defaultChip._prevFont;
          this.applyFontSettings();
          defaultChip.style.borderColor = isDefaultActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
          defaultChip.style.background = isDefaultActive ? 'var(--interactive-accent)' : 'var(--background-primary)';
          defaultChip.style.color = isDefaultActive ? '#fff' : 'var(--text-normal)';
        }
      );
      defaultChip.addEventListener('click', async () => {
        if (defaultPreviewing) {
          defaultPreviewing = false;
          this.settings.activeFont = defaultChip._prevFont;
          this.applyFontSettings();
        }
        this.settings.activeFont = '';
        this.applyFontSettings();
        await this.saveSettings();
        currentFontLabel.textContent = t('font.default');
        renderFontChips(fonts);
        renderFontSettings();
      });

      const sorted = [...fonts].sort((a, b) => {
        const aFav = favorites.includes(a) ? 0 : 1;
        const bFav = favorites.includes(b) ? 0 : 1;
        return aFav - bFav || a.localeCompare(b);
      });

      sorted.forEach(fontName => {
        const isFav = favorites.includes(fontName);
        const isActive = this.settings.activeFont === fontName;

        const chipWrap = fontChipsContainer.createDiv();
        chipWrap.style.cssText = 'display:inline-flex;align-items:center;gap:0;';

        const chip = chipWrap.createEl('span');
        chip.textContent = fontName;
        chip.style.cssText = `
          display:inline-block;padding:2px 4px 2px 8px;border-radius:12px 0 0 12px;font-size:11px;cursor:pointer;
          user-select:none;transition:all 0.15s ease;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
          border:1px solid ${isActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
          border-right:none;
          background:${isActive ? 'var(--interactive-accent)' : 'var(--background-primary)'};
          color:${isActive ? '#fff' : 'var(--text-normal)'};
          font-family:"${fontName}";
        `;

        const star = chipWrap.createEl('span');
        star.textContent = isFav ? '★' : '☆';
        star.style.cssText = `
          display:inline-flex;align-items:center;justify-content:center;
          padding:2px 6px;border-radius:0 12px 12px 0;font-size:11px;cursor:pointer;
          user-select:none;transition:all 0.15s ease;
          border:1px solid ${isActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
          border-left:none;
          background:${isActive ? 'var(--interactive-accent)' : 'var(--background-primary)'};
          color:${isFav ? '#f5a623' : 'var(--text-muted)'};
        `;

        let fontPreviewing = false;
        this._bindHoverPreview(chip,
          () => {
            if (isActive) return;
            fontPreviewing = true;
            chip._prevFont = this.settings.activeFont;
            this.settings.activeFont = fontName;
            this.applyFontSettings();
            chip.style.borderColor = 'var(--interactive-accent)';
            chip.style.background = 'var(--interactive-accent)';
            chip.style.color = '#fff';
            star.style.borderColor = 'var(--interactive-accent)';
            star.style.background = 'var(--interactive-accent)';
          },
          () => {
            if (!fontPreviewing) return;
            fontPreviewing = false;
            this.settings.activeFont = chip._prevFont;
            this.applyFontSettings();
            applyFontChipStyle(chip, star, isActive);
            star.style.color = isFav ? '#f5a623' : 'var(--text-muted)';
          }
        );

        chip.addEventListener('click', async () => {
          if (fontPreviewing) {
            fontPreviewing = false;
            this.settings.activeFont = chip._prevFont;
            this.applyFontSettings();
          }
          if (this.settings.activeFont === fontName) {
            this.settings.activeFont = '';
          } else {
            this.settings.activeFont = fontName;
          }
          this.applyFontSettings();
          await this.saveSettings();
          currentFontLabel.textContent = this.settings.activeFont || t('font.default');
          renderFontChips(fonts);
          renderFontSettings();
        });

        star.addEventListener('click', async (e) => {
          e.stopPropagation();
          if (!this.settings.fontFavorites) this.settings.fontFavorites = [];
          const idx = this.settings.fontFavorites.indexOf(fontName);
          if (idx >= 0) {
            this.settings.fontFavorites.splice(idx, 1);
          } else {
            this.settings.fontFavorites.push(fontName);
          }
          await this.saveSettings();
          renderFontChips(fonts);
        });
      });
    };

    const renderFontSettings = () => {
      fontSettingsPanel.innerHTML = '';

      fontSettingsPanel.style.display = 'block';

      const row1 = fontSettingsPanel.createDiv();
      row1.style.cssText = 'display:flex;align-items:center;gap:8px;flex-wrap:wrap;';

      const mkLabel = (text) => {
        const el = document.createElement('span');
        el.textContent = text;
        el.style.cssText = 'font-size:10px;color:var(--text-muted);white-space:nowrap;';
        return el;
      };

      row1.appendChild(mkLabel(t('font.color')));
      const colorInput = row1.createEl('input', { type: 'color' });
      colorInput.value = this.settings.fontColor || '#ffffff';
      colorInput.style.cssText = 'width:28px;height:22px;padding:0;cursor:pointer;';
      colorInput.addEventListener('input', async () => {
        this.settings.fontColor = colorInput.value;
        this.applyFontSettings();
        await this.saveSettings();
      });
      const colorDefaultBtn = row1.createEl('span');
      colorDefaultBtn.textContent = t('theme.default');
      colorDefaultBtn.style.cssText = 'font-size:10px;padding:1px 6px;border-radius:8px;cursor:pointer;border:1px solid var(--background-modifier-border);color:var(--text-muted);user-select:none;';
      colorDefaultBtn.addEventListener('click', async () => {
        this.settings.fontColor = '';
        this.applyFontSettings();
        await this.saveSettings();
        renderFontSettings();
      });

      row1.appendChild(mkLabel(t('font.opacity')));
      const opSlider = row1.createEl('input', { type: 'range' });
      opSlider.min = '10'; opSlider.max = '100'; opSlider.value = String(Math.round((this.settings.fontOpacity ?? 1) * 100));
      opSlider.style.cssText = 'width:60px;cursor:pointer;height:4px;';
      const opVal = row1.createEl('span', { text: Math.round((this.settings.fontOpacity ?? 1) * 100) + '%' });
      opVal.style.cssText = 'font-size:10px;color:var(--text-muted);min-width:28px;';
      opSlider.addEventListener('input', async () => {
        const v = parseInt(opSlider.value) / 100;
        opVal.textContent = opSlider.value + '%';
        this.settings.fontOpacity = v;
        this.applyFontSettings();
        await this.saveSettings();
      });

      row1.appendChild(mkLabel(t('font.lineHeight')));
      const lhSlider = row1.createEl('input', { type: 'range' });
      lhSlider.min = '10'; lhSlider.max = '30'; lhSlider.step = '1'; lhSlider.value = String(Math.round((this.settings.fontLineHeight ?? 1.5) * 10));
      lhSlider.style.cssText = 'width:60px;cursor:pointer;height:4px;';
      const lhVal = row1.createEl('span', { text: (this.settings.fontLineHeight ?? 0) > 0 ? (this.settings.fontLineHeight).toFixed(1) : '-' });
      lhVal.style.cssText = 'font-size:10px;color:var(--text-muted);min-width:22px;';
      lhSlider.addEventListener('input', async () => {
        const v = parseInt(lhSlider.value) / 10;
        lhVal.textContent = v.toFixed(1);
        this.settings.fontLineHeight = v;
        this.applyFontSettings();
        await this.saveSettings();
      });

      const row2 = fontSettingsPanel.createDiv();
      row2.style.cssText = 'display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:4px;';

      row2.appendChild(mkLabel(t('font.marginL')));
      const mlSlider = row2.createEl('input', { type: 'range' });
      mlSlider.min = '-40'; mlSlider.max = '80'; mlSlider.value = String(this.settings.fontMarginL ?? 0);
      mlSlider.style.cssText = 'width:60px;cursor:pointer;height:4px;';
      const mlVal = row2.createEl('span', { text: (this.settings.fontMarginL ?? 0) + 'px' });
      mlVal.style.cssText = 'font-size:10px;color:var(--text-muted);min-width:28px;';
      mlSlider.addEventListener('input', async () => {
        const v = parseInt(mlSlider.value);
        mlVal.textContent = v + 'px';
        this.settings.fontMarginL = v;
        this.applyFontSettings();
        await this.saveSettings();
      });

      row2.appendChild(mkLabel(t('font.marginR')));
      const mrSlider = row2.createEl('input', { type: 'range' });
      mrSlider.min = '-40'; mrSlider.max = '80'; mrSlider.value = String(this.settings.fontMarginR ?? 0);
      mrSlider.style.cssText = 'width:60px;cursor:pointer;height:4px;';
      const mrVal = row2.createEl('span', { text: (this.settings.fontMarginR ?? 0) + 'px' });
      mrVal.style.cssText = 'font-size:10px;color:var(--text-muted);min-width:28px;';
      mrSlider.addEventListener('input', async () => {
        const v = parseInt(mrSlider.value);
        mrVal.textContent = v + 'px';
        this.settings.fontMarginR = v;
        this.applyFontSettings();
        await this.saveSettings();
      });

      const resetBtn = row2.createEl('span');
      resetBtn.textContent = t('font.reset');
      resetBtn.style.cssText = `
        font-size:10px;padding:1px 8px;border-radius:8px;cursor:pointer;
        border:1px solid var(--background-modifier-border);color:var(--text-muted);
        user-select:none;margin-left:auto;
      `;
      resetBtn.addEventListener('click', async () => {
        this.settings.activeFont = '';
        this.settings.fontColor = '';
        this.settings.fontOpacity = 1;
        this.settings.fontLineHeight = 0;
        this.settings.fontMarginL = 0;
        this.settings.fontMarginR = 0;
        this.applyFontSettings();
        await this.saveSettings();
        currentFontLabel.textContent = t('font.default');
        renderFontChips(fontsLoaded);
        renderFontSettings();
        new Notice(t('font.resetDone'));
      });
    };

    // 自动加载字体
    (async () => {
      const fonts = await this.getSystemFonts();
      if (fonts.length === 0) return;
      fontsLoaded = fonts;
      fontChipsContainer.style.display = 'flex';
      renderFontChips(fonts);
      renderFontSettings();
      requestAnimationFrame(positionAtBottomRight);
    })();

    // 鼠标离开弹窗区域关闭（仅未固定时）
    let leaveTimer = null;
    const scheduleClose = () => {
      if (isPinned) return;
      leaveTimer = setTimeout(() => {
        if (document.getElementById('ss-font-popup') && !isPinned) {
          popup.remove();
        }
      }, 300);
    };
    const cancelClose = () => {
      if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
    };

    popup.addEventListener('mouseleave', scheduleClose);
    popup.addEventListener('mouseenter', cancelClose);

    if (triggerEl) {
      triggerEl.addEventListener('mouseleave', scheduleClose);
      triggerEl.addEventListener('mouseenter', cancelClose);
    }

    document.body.appendChild(popup);
    requestAnimationFrame(positionAtBottomRight);
  }
}

module.exports = SwiftSwitchPlugin;
