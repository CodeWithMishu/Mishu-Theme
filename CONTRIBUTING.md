# Contributing to Mishu Theme

Thank you for your interest in contributing to Mishu Theme! This document provides guidelines and information for contributors.

## 🎯 Design Philosophy

Before contributing, please understand our core principles:

1. **Eye Comfort First**: All color choices must prioritize reducing eye strain
2. **Semantic Highlighting**: Colors should reflect code importance, not just token type
3. **Visual Harmony**: New additions must maintain the calm, cohesive aesthetic
4. **Accessibility**: Consider color blindness and low-vision users

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- VS Code 1.74+
- Git

### Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/mishu-theme.git
cd mishu-theme

# Open in VS Code
code .
```

### Testing Your Changes

1. Press `F5` to open the Extension Development Host
2. Select your theme variant (`Ctrl+K Ctrl+T`)
3. Open various file types to test syntax highlighting
4. Check the integrated terminal, sidebar, and panels

## 📝 How to Contribute

### Reporting Issues

- Use the GitHub issue tracker
- Include VS Code version and OS
- Provide screenshots if it's a visual issue
- Include the file type/language affected

### Suggesting Enhancements

- Open a discussion first for major changes
- Explain the problem you're solving
- Provide mockups or examples if possible

### Submitting Changes

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly with multiple languages
4. Commit with clear messages: `git commit -m "feat: add Python docstring styling"`
5. Push and create a Pull Request

## 🎨 Color Guidelines

### Adding New Colors

When adding colors, ensure they:

- Have sufficient contrast (WCAG AA minimum)
- Fit within the existing warm, muted palette
- Don't introduce visual noise
- Are consistent across all three variants

### Contrast Ratios

| Element        | Minimum Ratio |
|----------------|---------------|
| Primary text   | 4.5:1         |
| Secondary text | 3:1           |
| UI elements    | 3:1           |
| Decorative     | No minimum    |

### Testing Colors

Use these tools to verify your color choices:

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colorblindly](https://chrome.google.com/webstore/detail/colorblindly) Chrome extension

## 📁 File Structure

```text
mishu-theme/
├── themes/
│   ├── mishu-dark.json          # Main theme
│   ├── mishu-dark-soft.json     # Low contrast variant
│   └── mishu-midnight.json      # OLED variant
├── images/
│   ├── icon.jpg                 # Extension icon (128x128)
│   └── preview.png              # Marketplace preview
├── package.json                 # Extension manifest
├── README.md                    # Documentation
├── CHANGELOG.md                 # Version history
├── LICENSE                      # MIT license
└── CONTRIBUTING.md              # This file
```

## ✅ Pull Request Checklist

- [ ] Tested with JavaScript/TypeScript
- [ ] Tested with Python
- [ ] Tested with HTML/CSS
- [ ] Tested with Markdown
- [ ] All three theme variants updated (if applicable)
- [ ] No contrast accessibility issues
- [ ] CHANGELOG.md updated
- [ ] Screenshots provided (for visual changes)

## 🏷️ Commit Message Format

We use conventional commits:

```text
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (not CSS)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:

```bash
feat(syntax): add Rust lifetime highlighting
fix(ui): correct notification border color
docs: update installation instructions
```

## 📞 Getting Help

- Open an issue for bugs or questions
- Start a discussion for ideas
- Check existing issues before creating new ones

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Mishu Theme better! 💙
