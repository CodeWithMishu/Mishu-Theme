import * as vscode from 'vscode';

// Accent colors available for customization
const ACCENT_COLORS: { [key: string]: { name: string; color: string } } = {
    teal: { name: 'Teal', color: '#80CBC4' },
    cyan: { name: 'Cyan', color: '#89DDFF' },
    blue: { name: 'Blue', color: '#82AAFF' },
    purple: { name: 'Purple', color: '#C792EA' },
    pink: { name: 'Pink', color: '#FF9CAC' },
    red: { name: 'Red', color: '#FF5370' },
    orange: { name: 'Orange', color: '#F78C6C' },
    yellow: { name: 'Yellow', color: '#FFCB6B' },
    green: { name: 'Green', color: '#C3E88D' },
    lime: { name: 'Lime', color: '#A5D6A7' }
};

// Theme variants
const THEME_VARIANTS = [
    { label: '$(color-mode) Mishu Teal', description: 'Material-style with teal accent', id: 'Mishu Teal' },
    { label: '$(color-mode) Mishu Ocean', description: 'Deep blue-black variant', id: 'Mishu Ocean' },
    { label: '$(color-mode) Mishu Carbon', description: 'Dark gray variant', id: 'Mishu Carbon' },
    { label: '$(color-mode) Mishu Palenight', description: 'Purple-tinted variant', id: 'Mishu Palenight' },
    { label: '$(color-mode) Mishu Graphene', description: 'Neutral gray variant', id: 'Mishu Graphene' },
    { label: '$(color-mode) Mishu Deepforest', description: 'Green-tinted variant', id: 'Mishu Deepforest' },
    { label: '$(color-mode) Mishu Dark', description: 'Original comfort theme', id: 'Mishu Dark' },
    { label: '$(color-mode) Mishu Dark Soft', description: 'Lower contrast variant', id: 'Mishu Dark Soft' },
    { label: '$(color-mode) Mishu Midnight', description: 'Ultra-dark OLED variant', id: 'Mishu Midnight' }
];

// Icon themes
const ICON_THEMES = [
    { label: '$(file-media) Mishu Icons Teal', description: 'Material-style file icons', id: 'mishu-icons-teal' }
];

export function activate(context: vscode.ExtensionContext) {
    console.log('Mishu Theme is now active!');

    // Store original theme for cancel/escape
    let originalTheme: string | undefined;
    let originalIconTheme: string | undefined;

    // Command: Switch Theme (with live preview)
    const switchThemeCmd = vscode.commands.registerCommand('mishu-theme.switchTheme', async () => {
        originalTheme = vscode.workspace.getConfiguration('workbench').get<string>('colorTheme');
        
        const quickPick = vscode.window.createQuickPick();
        quickPick.items = THEME_VARIANTS;
        quickPick.placeholder = 'Select a Mishu Theme variant (↑↓ to preview)';
        quickPick.title = 'Mishu Theme: Switch Theme';
        quickPick.matchOnDescription = true;

        // Live preview on selection change
        quickPick.onDidChangeActive(async (items) => {
            if (items[0]) {
                const theme = (items[0] as any).id;
                await vscode.workspace.getConfiguration('workbench').update(
                    'colorTheme',
                    theme,
                    vscode.ConfigurationTarget.Global
                );
            }
        });

        // Confirm selection
        quickPick.onDidAccept(async () => {
            const selected = quickPick.selectedItems[0] as any;
            if (selected) {
                await vscode.workspace.getConfiguration('workbench').update(
                    'colorTheme',
                    selected.id,
                    vscode.ConfigurationTarget.Global
                );
                vscode.window.showInformationMessage(`Switched to ${selected.id}`);
            }
            quickPick.hide();
        });

        // Restore original on cancel
        quickPick.onDidHide(async () => {
            if (!quickPick.selectedItems.length && originalTheme) {
                await vscode.workspace.getConfiguration('workbench').update(
                    'colorTheme',
                    originalTheme,
                    vscode.ConfigurationTarget.Global
                );
            }
            quickPick.dispose();
        });

        quickPick.show();
    });

    // Command: Set Color Theme (for extension page button)
    const setColorThemeCmd = vscode.commands.registerCommand('mishu-theme.setColorTheme', async () => {
        vscode.commands.executeCommand('mishu-theme.switchTheme');
    });

    // Command: Change Accent Color (with live preview)
    const changeAccentCmd = vscode.commands.registerCommand('mishu-theme.changeAccent', async () => {
        const items = Object.entries(ACCENT_COLORS).map(([key, value]) => ({
            label: `$(circle-filled) ${value.name}`,
            description: value.color,
            id: key
        }));

        const quickPick = vscode.window.createQuickPick();
        quickPick.items = items;
        quickPick.placeholder = 'Select an accent color (↑↓ to preview)';
        quickPick.title = 'Mishu Theme: Change Accent Color';

        // Live preview on selection change
        quickPick.onDidChangeActive(async (activeItems) => {
            if (activeItems[0]) {
                const accentId = (activeItems[0] as any).id;
                await applyAccentColor(accentId);
            }
        });

        // Confirm selection
        quickPick.onDidAccept(async () => {
            const selected = quickPick.selectedItems[0] as any;
            if (selected) {
                const config = vscode.workspace.getConfiguration('mishuTheme');
                await config.update('accentColor', selected.id, vscode.ConfigurationTarget.Global);
                await applyAccentColor(selected.id);
                vscode.window.showInformationMessage(`Accent color changed to ${ACCENT_COLORS[selected.id].name}`);
            }
            quickPick.hide();
        });

        quickPick.onDidHide(() => {
            quickPick.dispose();
        });

        quickPick.show();
    });

    // Command: Set File Icon Theme (with live preview)
    const setFileIconThemeCmd = vscode.commands.registerCommand('mishu-theme.setFileIconTheme', async () => {
        originalIconTheme = vscode.workspace.getConfiguration('workbench').get<string>('iconTheme');

        const quickPick = vscode.window.createQuickPick();
        quickPick.items = ICON_THEMES;
        quickPick.placeholder = 'Select a file icon theme (↑↓ to preview)';
        quickPick.title = 'Mishu Theme: Set File Icon Theme';

        // Live preview on selection change
        quickPick.onDidChangeActive(async (items) => {
            if (items[0]) {
                const iconTheme = (items[0] as any).id;
                await vscode.workspace.getConfiguration('workbench').update(
                    'iconTheme',
                    iconTheme,
                    vscode.ConfigurationTarget.Global
                );
            }
        });

        // Confirm selection
        quickPick.onDidAccept(async () => {
            const selected = quickPick.selectedItems[0] as any;
            if (selected) {
                await vscode.workspace.getConfiguration('workbench').update(
                    'iconTheme',
                    selected.id,
                    vscode.ConfigurationTarget.Global
                );
                vscode.window.showInformationMessage(`File icons set to ${selected.label.replace('$(file-media) ', '')}`);
            }
            quickPick.hide();
        });

        // Restore original on cancel
        quickPick.onDidHide(async () => {
            if (!quickPick.selectedItems.length && originalIconTheme !== undefined) {
                await vscode.workspace.getConfiguration('workbench').update(
                    'iconTheme',
                    originalIconTheme,
                    vscode.ConfigurationTarget.Global
                );
            }
            quickPick.dispose();
        });

        quickPick.show();
    });

    // Command: Toggle Compact Mode
    const toggleCompactCmd = vscode.commands.registerCommand('mishu-theme.toggleCompact', async () => {
        const config = vscode.workspace.getConfiguration('mishuTheme');
        const current = config.get<boolean>('compactMode', false);
        await config.update('compactMode', !current, vscode.ConfigurationTarget.Global);
        
        // Apply compact mode settings
        const workbenchConfig = vscode.workspace.getConfiguration('workbench');
        await workbenchConfig.update('tree.indent', current ? 8 : 12, vscode.ConfigurationTarget.Global);
        
        vscode.window.showInformationMessage(`Compact mode ${!current ? 'enabled' : 'disabled'}`);
    });

    // Command: Toggle Bold Keywords
    const toggleBoldCmd = vscode.commands.registerCommand('mishu-theme.toggleBoldKeywords', async () => {
        const config = vscode.workspace.getConfiguration('mishuTheme');
        const current = config.get<boolean>('boldKeywords', true);
        await config.update('boldKeywords', !current, vscode.ConfigurationTarget.Global);
        
        vscode.window.showInformationMessage(`Bold keywords ${!current ? 'enabled' : 'disabled'}. Reload window to apply.`);
    });

    // Command: Toggle Italic Comments
    const toggleItalicCmd = vscode.commands.registerCommand('mishu-theme.toggleItalicComments', async () => {
        const config = vscode.workspace.getConfiguration('mishuTheme');
        const current = config.get<boolean>('italicComments', true);
        await config.update('italicComments', !current, vscode.ConfigurationTarget.Global);
        
        vscode.window.showInformationMessage(`Italic comments ${!current ? 'enabled' : 'disabled'}. Reload window to apply.`);
    });

    // Command: Toggle High Contrast
    const toggleContrastCmd = vscode.commands.registerCommand('mishu-theme.toggleHighContrast', async () => {
        const config = vscode.workspace.getConfiguration('mishuTheme');
        const current = config.get<boolean>('highContrast', false);
        await config.update('highContrast', !current, vscode.ConfigurationTarget.Global);
        
        vscode.window.showInformationMessage(`High contrast mode ${!current ? 'enabled' : 'disabled'}. Reload window to apply.`);
    });

    // Command: Enable File Icons (legacy - redirects to new command)
    const enableIconsCmd = vscode.commands.registerCommand('mishu-theme.enableFileIcons', async () => {
        vscode.commands.executeCommand('mishu-theme.setFileIconTheme');
    });

    // Command: Reset to Defaults
    const resetCmd = vscode.commands.registerCommand('mishu-theme.resetSettings', async () => {
        const confirm = await vscode.window.showWarningMessage(
            'Reset all Mishu Theme settings to defaults?',
            { modal: true },
            'Yes', 'No'
        );

        if (confirm === 'Yes') {
            const config = vscode.workspace.getConfiguration('mishuTheme');
            await config.update('accentColor', undefined, vscode.ConfigurationTarget.Global);
            await config.update('compactMode', undefined, vscode.ConfigurationTarget.Global);
            await config.update('boldKeywords', undefined, vscode.ConfigurationTarget.Global);
            await config.update('italicComments', undefined, vscode.ConfigurationTarget.Global);
            await config.update('highContrast', undefined, vscode.ConfigurationTarget.Global);
            await config.update('cursorStyle', undefined, vscode.ConfigurationTarget.Global);
            
            // Clear color customizations
            const workbenchConfig = vscode.workspace.getConfiguration('workbench');
            await workbenchConfig.update('colorCustomizations', undefined, vscode.ConfigurationTarget.Global);
            
            vscode.window.showInformationMessage('Mishu Theme settings reset to defaults');
        }
    });

    // Command: Open Settings
    const openSettingsCmd = vscode.commands.registerCommand('mishu-theme.openSettings', () => {
        vscode.commands.executeCommand('workbench.action.openSettings', 'mishuTheme');
    });

    // Command: Show Theme Info
    const showInfoCmd = vscode.commands.registerCommand('mishu-theme.showInfo', () => {
        const panel = vscode.window.createWebviewPanel(
            'mishuThemeInfo',
            'Mishu Theme',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = getThemeInfoHtml();
        
        // Handle messages from webview
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'setColorTheme':
                    vscode.commands.executeCommand('mishu-theme.switchTheme');
                    break;
                case 'setFileIconTheme':
                    vscode.commands.executeCommand('mishu-theme.setFileIconTheme');
                    break;
            }
        });
    });

    // Register all commands
    context.subscriptions.push(
        switchThemeCmd,
        setColorThemeCmd,
        changeAccentCmd,
        setFileIconThemeCmd,
        toggleCompactCmd,
        toggleBoldCmd,
        toggleItalicCmd,
        toggleContrastCmd,
        enableIconsCmd,
        resetCmd,
        openSettingsCmd,
        showInfoCmd
    );

    // Apply saved accent color on activation
    const savedAccent = vscode.workspace.getConfiguration('mishuTheme').get<string>('accentColor');
    if (savedAccent && ACCENT_COLORS[savedAccent]) {
        applyAccentColor(savedAccent);
    }

    // Listen for configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('mishuTheme.accentColor')) {
                const newAccent = vscode.workspace.getConfiguration('mishuTheme').get<string>('accentColor');
                if (newAccent && ACCENT_COLORS[newAccent]) {
                    applyAccentColor(newAccent);
                }
            }
        })
    );
}

async function applyAccentColor(accentId: string): Promise<void> {
    const accentColor = ACCENT_COLORS[accentId]?.color;
    if (!accentColor) return;

    const workbenchConfig = vscode.workspace.getConfiguration('workbench');
    const currentCustomizations = workbenchConfig.get<{ [key: string]: string }>('colorCustomizations') || {};

    // Apply accent color to various UI elements
    const accentCustomizations: { [key: string]: string } = {
        'activityBarBadge.background': accentColor,
        'badge.background': accentColor,
        'button.background': accentColor,
        'checkbox.background': accentColor,
        'editor.selectionHighlightBorder': accentColor,
        'editorCursor.foreground': accentColor,
        'editorSuggestWidget.selectedBackground': `${accentColor}33`,
        'extensionButton.prominentBackground': accentColor,
        'focusBorder': accentColor,
        'inputOption.activeBorder': accentColor,
        'list.activeSelectionBackground': `${accentColor}33`,
        'list.highlightForeground': accentColor,
        'menu.selectionBackground': `${accentColor}33`,
        'notificationLink.foreground': accentColor,
        'panelTitle.activeBorder': accentColor,
        'pickerGroup.foreground': accentColor,
        'progressBar.background': accentColor,
        'scrollbarSlider.activeBackground': `${accentColor}66`,
        'settings.modifiedItemIndicator': accentColor,
        'tab.activeBorder': accentColor,
        'tab.activeModifiedBorder': accentColor,
        'textLink.activeForeground': accentColor,
        'textLink.foreground': accentColor
    };

    await workbenchConfig.update(
        'colorCustomizations',
        { ...currentCustomizations, ...accentCustomizations },
        vscode.ConfigurationTarget.Global
    );
}

function getThemeInfoHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mishu Theme</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            padding: 20px;
            background: #1a1d23;
            color: #d4d4d8;
            line-height: 1.6;
        }
        h1 { color: #80CBC4; margin-bottom: 10px; }
        h2 { color: #82AAFF; margin-top: 30px; }
        .accent { color: #80CBC4; }
        .feature { 
            background: #252830;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            border-left: 3px solid #80CBC4;
        }
        code {
            background: #2d3139;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Fira Code', monospace;
        }
        .colors {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin: 20px 0;
        }
        .color-swatch {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: inline-block;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .color-swatch:hover {
            transform: scale(1.2);
        }
        .btn {
            background: #80CBC4;
            color: #1a1d23;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            margin: 5px;
            transition: opacity 0.2s;
        }
        .btn:hover {
            opacity: 0.8;
        }
        .btn-secondary {
            background: #252830;
            color: #d4d4d8;
            border: 1px solid #80CBC4;
        }
        .button-group {
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>🎨 Mishu Theme</h1>
    <p>A calm, low-contrast dark theme designed for eye comfort during long coding sessions.</p>
    
    <div class="button-group">
        <button class="btn" onclick="setTheme()">Set Color Theme</button>
        <button class="btn btn-secondary" onclick="setIcons()">Set File Icon Theme</button>
    </div>
    
    <h2>Theme Variants</h2>
    <div class="feature">
        <strong>Mishu Teal</strong> - Material-style with teal accent<br>
        <strong>Mishu Ocean</strong> - Deep blue-black variant<br>
        <strong>Mishu Carbon</strong> - Dark gray variant<br>
        <strong>Mishu Palenight</strong> - Purple-tinted variant<br>
        <strong>Mishu Graphene</strong> - Neutral gray variant<br>
        <strong>Mishu Deepforest</strong> - Green-tinted variant<br>
        <strong>Mishu Dark</strong> - Original comfort theme<br>
        <strong>Mishu Dark Soft</strong> - Lower contrast variant<br>
        <strong>Mishu Midnight</strong> - Ultra-dark OLED variant
    </div>
    
    <h2>Accent Colors</h2>
    <div class="colors">
        <span class="color-swatch" style="background: #80CBC4" title="Teal"></span>
        <span class="color-swatch" style="background: #89DDFF" title="Cyan"></span>
        <span class="color-swatch" style="background: #82AAFF" title="Blue"></span>
        <span class="color-swatch" style="background: #C792EA" title="Purple"></span>
        <span class="color-swatch" style="background: #FF9CAC" title="Pink"></span>
        <span class="color-swatch" style="background: #FF5370" title="Red"></span>
        <span class="color-swatch" style="background: #F78C6C" title="Orange"></span>
        <span class="color-swatch" style="background: #FFCB6B" title="Yellow"></span>
        <span class="color-swatch" style="background: #C3E88D" title="Green"></span>
        <span class="color-swatch" style="background: #A5D6A7" title="Lime"></span>
    </div>
    
    <h2>Commands</h2>
    <div class="feature">
        <code>Mishu: Switch Theme</code> - Quick theme switcher with live preview<br>
        <code>Mishu: Change Accent Color</code> - Pick an accent color with preview<br>
        <code>Mishu: Set File Icon Theme</code> - Set file icons with preview<br>
        <code>Mishu: Toggle Compact Mode</code> - Compact UI mode<br>
        <code>Mishu: Open Settings</code> - Open theme settings
    </div>
    
    <h2>Keyboard Shortcuts</h2>
    <div class="feature">
        <code>Ctrl+K Ctrl+T</code> - Open theme picker<br>
        <code>Ctrl+Shift+P</code> - Open command palette, then type "Mishu"
    </div>
    
    <p style="margin-top: 40px; opacity: 0.7;">
        Made with ❤️ by CodeWithMishu
    </p>

    <script>
        const vscode = acquireVsCodeApi();
        function setTheme() { vscode.postMessage({ command: 'setColorTheme' }); }
        function setIcons() { vscode.postMessage({ command: 'setFileIconTheme' }); }
    </script>
</body>
</html>`;
}

export function deactivate() {
    console.log('Mishu Theme deactivated');
}
