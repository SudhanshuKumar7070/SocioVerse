# Midnight Blue Theme Guide

## Background Gradient
```css
background: linear-gradient(to right, #0f172a, #1e40af, #0f172a);
```

## Text Colors

### Primary Text (Headers, Important Text)
- Color: Sky 100 (#e0f2fe)
- Tailwind: `text-sky-100`
- Hex: #e0f2fe
- RGB: rgb(224, 242, 254)

### Secondary Text (Body Text, Paragraphs)
- Color: Slate 200 (#e2e8f0)
- Tailwind: `text-slate-200`
- Hex: #e2e8f0
- RGB: rgb(226, 232, 240)

### Tertiary Text (Captions, Secondary Information)
- Color: Slate 300 (#cbd5e1)
- Tailwind: `text-slate-300`
- Hex: #cbd5e1
- RGB: rgb(203, 213, 225)

### Accent Text (Highlights, User Mentions, Hashtags)
- Color: Cyan 400 (#22d3ee)
- Tailwind: `text-cyan-400`
- Hex: #22d3ee
- RGB: rgb(34, 211, 238)

### Links and Interactive Elements
- Color: Sky 400 (#38bdf8)
- Hover: Sky 300 (#7dd3fc)
- Tailwind: `text-sky-400 hover:text-sky-300`
- Hex: #38bdf8, #7dd3fc
- RGB: rgb(56, 189, 248), rgb(125, 211, 252)

### Warning or Important Notifications
- Color: Amber 300 (#fcd34d)
- Tailwind: `text-amber-300`
- Hex: #fcd34d
- RGB: rgb(252, 211, 77)

### Success Messages
- Color: Emerald 400 (#34d399)
- Tailwind: `text-emerald-400`
- Hex: #34d399
- RGB: rgb(52, 211, 153)

### Error Messages
- Color: Rose 400 (#fb7185)
- Tailwind: `text-rose-400`
- Hex: #fb7185
- RGB: rgb(251, 113, 133)

### Input Text
- Color: White (#ffffff)
- Placeholder: Slate 400 (#94a3b8)
- Tailwind: `text-white placeholder:text-slate-400`
- Hex: #ffffff, #94a3b8
- RGB: rgb(255, 255, 255), rgb(148, 163, 184)

## Component-Specific Colors

### Tweet Card Username
- Color: Sky 200 (#bae6fd)
- Tailwind: `text-sky-200`
- Hex: #bae6fd
- RGB: rgb(186, 230, 253)

### Tweet Card Handle/Timestamp
- Color: Slate 400 (#94a3b8)
- Tailwind: `text-slate-400`
- Hex: #94a3b8
- RGB: rgb(148, 163, 184)

## UI Element Colors

### Buttons (Primary)
- Background: Blue 600 (#2563eb)
- Hover: Blue 500 (#3b82f6)
- Text: White (#ffffff)
- Tailwind: `bg-blue-600 hover:bg-blue-500 text-white`
- Hex: #2563eb, #3b82f6, #ffffff
- RGB: rgb(37, 99, 235), rgb(59, 130, 246), rgb(255, 255, 255)

### Buttons (Secondary)
- Background: Slate 700 (#334155)
- Hover: Slate 600 (#475569)
- Text: Slate 200 (#e2e8f0)
- Tailwind: `bg-slate-700 hover:bg-slate-600 text-slate-200`
- Hex: #334155, #475569, #e2e8f0
- RGB: rgb(51, 65, 85), rgb(71, 85, 105), rgb(226, 232, 240)

### Cards and Containers
- Background: Slate 800 with opacity (#1e293b with 75% opacity)
- Border: Slate 700 (#334155)
- Tailwind: `bg-slate-800/75 border border-slate-700`
- Hex: #1e293b (with opacity), #334155
- RGB: rgba(30, 41, 59, 0.75), rgb(51, 65, 85)

### Dividers
- Color: Slate 700 (#334155)
- Tailwind: `border-slate-700`
- Hex: #334155
- RGB: rgb(51, 65, 85)

### Icons
- Primary: Sky 300 (#7dd3fc)
- Secondary: Slate 400 (#94a3b8)
- Interactive: Cyan 400 (#22d3ee)
- Tailwind: `text-sky-300`, `text-slate-400`, `text-cyan-400`
- Hex: #7dd3fc, #94a3b8, #22d3ee
- RGB: rgb(125, 211, 252), rgb(148, 163, 184), rgb(34, 211, 238)

## Accessibility Notes
- The background-to-text contrast ratios for primary and secondary text meet WCAG AA standards for accessibility.
- For small text, consider using the lighter text colors (sky-100, slate-200) for better readability.
- Interactive elements should maintain distinct hover/focus states for better usability.