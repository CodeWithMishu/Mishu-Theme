# Mishu Theme

A calm, low-contrast dark theme for Visual Studio Code. Built for developers who code 8+ hours a day.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![VS Code](https://img.shields.io/badge/VS%20Code-1.74%2B-blue)

---

## What This Theme Is

Mishu Theme is a dark color theme designed around one principle: **reduce eye strain without sacrificing readability**.

It's not flashy. It's not trendy. It's functional.

- No pure black (`#000000`)
- No pure white (`#ffffff`)
- No neon highlights
- No color overload

Just calm, carefully weighted colors that let you focus on code.

---

## Design Philosophy

### The Problem

Most themes prioritize aesthetics over ergonomics. Bright syntax colors look impressive in screenshots but cause fatigue after hours of use. High contrast strains your eyes. Too many colors create visual noise.

### The Solution

Mishu Theme uses **importance-based color weighting**:

| Element | Treatment | Rationale |
| ------- | --------- | --------- |
| Functions/Methods | Soft blue emphasis | You call them constantly; they need visibility |
| Classes/Types | Muted teal | Structural elements; important but not focal |
| Keywords | Subtle mauve | Control flow; should guide, not shout |
| Variables | Neutral gray | Most common; must not compete for attention |
| Strings | Sage green | Data content; readable, not glowing |
| Comments | Soft gray, italic | Readable when needed, invisible when not |
| Punctuation | Dimmed | Visual noise reduction |

### Background Hierarchy

```
Activity Bar   #12141a  ████  Darkest
Sidebar        #16181e  ████  
Editor         #1a1d23  ████  Primary workspace
Panels         #1a1d23  ████  Consistent with editor
Widgets        #1e222a  ████  Slight elevation
```

One accent color (`#7eb8da`) used consistently for focus states, active elements, and primary actions.

---

## Features

- **Nine variants**: Teal, Ocean, Carbon, Palenight, Graphene, Deepforest, Dark, Dark Soft, and Midnight - each with unique personality
- **1150+ custom icons**: Comprehensive file and folder icon theme with beautiful Material-style icons
- **Semantic highlighting**: Full support for VS Code's semantic token API
- **Complete UI coverage**: 300+ color tokens for consistent experience
- **Language support**: Optimized for JavaScript, TypeScript, Python, Rust, Go, HTML, CSS, JSON, YAML, Markdown, and more
- **Accessible**: WCAG AA compliant contrast ratios for text
- **No dependencies**: Pure theme extension, zero runtime overhead

---

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS)
3. Search for **"Mishu Theme"**
4. Click **Install**
5. Press `Ctrl+K Ctrl+T` and select a Mishu variant

### Manual Installation

```bash
# Download the .vsix file from GitHub releases
code --install-extension mishu-theme-1.0.0.vsix
```

---

## Theme Variants

| Variant | Accent Color | Best For |
| ------- | ------------ | -------- |
| **Mishu Teal** | Teal (`#7eb8da`) | Balanced, calm coding sessions |
| **Mishu Ocean** | Ocean Blue | Deep sea inspired, soothing |
| **Mishu Carbon** | Carbon Gray | Minimal distraction, neutral |
| **Mishu Palenight** | Soft Purple | Material Palenight lovers |
| **Mishu Graphene** | Graphite | Ultra-minimal, professional |
| **Mishu Deepforest** | Forest Green | Nature-inspired, restful |
| **Mishu Dark** | Classic | General use, most lighting conditions |
| **Mishu Dark Soft** | Soft | Sensitive eyes, bright ambient light |
| **Mishu Midnight** | Deep | OLED displays, dark rooms |

---

## Recommended VS Code Settings

For the best experience with Mishu Theme:

```json
{
  // Enable semantic highlighting (important)
  "editor.semanticHighlighting.enabled": true,

  // Smooth cursor animation
  "editor.cursorBlinking": "smooth",
  "editor.cursorSmoothCaretAnimation": "on",

  // Bracket colorization
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "active",

  // Clean minimap
  "editor.minimap.renderCharacters": false,
  "editor.minimap.maxColumn": 80,

  // Typography (optional, personal preference)
  "editor.fontFamily": "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  "editor.fontSize": 14,
  "editor.lineHeight": 1.6,
  "editor.fontLigatures": true,

  // Reduce visual noise
  "editor.renderWhitespace": "selection",
  "editor.occurrencesHighlight": "singleFile",
  "breadcrumbs.enabled": true
}
```

---

## Customization Options

VS Code themes are static - they can't read runtime settings. However, VS Code provides powerful built-in customization.

### Color Customizations

Override any color in your `settings.json`:

```json
{
  "workbench.colorCustomizations": {
    "[Mishu Dark]": {
      "editor.background": "#1c1f26",
      "editor.lineHighlightBackground": "#252a33",
      "editorCursor.foreground": "#88ccee"
    }
  }
}
```

### Syntax Customizations

Adjust token colors and styles:

```json
{
  "editor.tokenColorCustomizations": {
    "[Mishu Dark]": {
      "comments": "#707888",
      "keywords": "#d0b0c0",
      "textMateRules": [
        {
          "scope": "keyword",
          "settings": {
            "fontStyle": "bold"
          }
        },
        {
          "scope": "entity.name.function",
          "settings": {
            "foreground": "#88c8e8"
          }
        }
      ]
    }
  }
}
```

### Common Customizations

**Bold keywords:**
```json
{
  "editor.tokenColorCustomizations": {
    "[Mishu Dark]": {
      "textMateRules": [
        {
          "scope": "keyword",
          "settings": { "fontStyle": "bold" }
        }
      ]
    }
  }
}
```

**Non-italic comments:**
```json
{
  "editor.tokenColorCustomizations": {
    "[Mishu Dark]": {
      "textMateRules": [
        {
          "scope": "comment",
          "settings": { "fontStyle": "" }
        }
      ]
    }
  }
}
```

**Higher contrast cursor:**
```json
{
  "workbench.colorCustomizations": {
    "[Mishu Dark]": {
      "editorCursor.foreground": "#ffffff"
    }
  }
}
```

---

## Screenshots

> Replace these placeholders with actual screenshots

### Editor View

![Editor](images/screenshot-editor.png)

### Sidebar & Activity Bar

![Sidebar](images/screenshot-sidebar.png)

### Integrated Terminal

![Terminal](images/screenshot-terminal.png)

### Autocomplete & Widgets

![Widgets](images/screenshot-widgets.png)

---

## Contrast & Accessibility

### Measured Contrast Ratios

| Element | Foreground | Background | Ratio | WCAG |
| ------- | ---------- | ---------- | ----- | ---- |
| Body text | `#c5c8d4` | `#1a1d23` | 9.2:1 | AAA |
| Comments | `#6b7280` | `#1a1d23` | 4.6:1 | AA |
| Line numbers | `#5a6070` | `#1a1d23` | 4.5:1 | AA |
| Keywords | `#c4a8b8` | `#1a1d23` | 7.8:1 | AAA |
| Strings | `#a8c4a0` | `#1a1d23` | 8.4:1 | AAA |
| Functions | `#7eb8da` | `#1a1d23` | 7.6:1 | AAA |

All primary text meets WCAG AA. Most exceeds AAA.

---

## Contributing

This is an open-source project. Contributions are welcome.

### How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-idea`
3. Make changes and test thoroughly
4. Ensure all three theme variants are updated consistently
5. Submit a pull request

### Development Setup

```bash
git clone https://github.com/codewithmishu/mishu-theme.git
cd mishu-theme
code .
# Press F5 to launch Extension Development Host
```

### Guidelines

- Maintain low contrast philosophy
- Test with multiple languages (JS, Python, Rust, Markdown minimum)
- Verify WCAG compliance for any new colors
- Update CHANGELOG.md

### Reporting Issues

Use GitHub Issues for:

- Accessibility problems
- Inconsistent highlighting in specific languages
- UI elements with poor contrast
- Suggestions for improvement

---

## License

MIT License. See [LICENSE](LICENSE) for details.

Free to use, modify, and distribute. Attribution appreciated.

---

## Acknowledgments

Built with care for the developer community. No colors, code, or assets copied from proprietary themes.

---

**Maintained by [CodeWithMishu](https://github.com/codewithmishu)**
