# Mishu Theme - Sample Markdown

> A calm, low-contrast dark theme designed for **eye comfort** during long coding sessions.

## Features

### 🌙 Eye Comfort First

- **Low contrast** design reduces eye strain
- *Warm, muted colors* that don't fatigue your eyes
- No harsh pure whites or blacks

### 🎨 Semantic Syntax Highlighting

Colors are assigned based on importance:

| Element | Color | Purpose |
|---------|-------|---------|
| Functions | Blue | High visibility |
| Classes | Teal | Structural |
| Keywords | Mauve | Control flow |
| Strings | Green | Data |

## Installation

```bash
# Clone the repository
git clone https://github.com/codewithmishu/mishu-theme.git

# Navigate to directory
cd mishu-theme

# Install dependencies (if any)
npm install
```

## Code Examples

### JavaScript

```javascript
const greeting = (name) => {
  return `Hello, ${name}!`;
};

console.log(greeting('World'));
```

### Python

```python
def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence."""
    if n <= 0:
        return []
    
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    
    return sequence[:n]

print(fibonacci(10))
```

## Links

- [GitHub Repository](https://github.com/codewithmishu/mishu-theme)
- [VS Code Marketplace](https://marketplace.visualstudio.com)
- [Documentation](https://docs.example.com)

## Task List

- [x] Create base theme
- [x] Add semantic highlighting
- [x] Write documentation
- [ ] Add light theme variant
- [ ] Create icon theme

---

## Blockquotes

> "Good design is obvious. Great design is transparent."
> — Joe Sparano

## Inline Code

Use `npm install` to install dependencies, or run `npm run build` to compile.

## Math (if supported)

The quadratic formula: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

---

**Made with 💙 by [CodeWithMishu](https://github.com/codewithmishu)**
