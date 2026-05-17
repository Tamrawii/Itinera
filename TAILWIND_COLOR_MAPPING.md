# Tailwind CSS Configuration - Color Token Integration

## Overview

This document explains the integration between your custom design tokens (`tokens.css`) and Tailwind CSS configuration.

## Color Mapping Reference

### Primary Blue Palette (Replaces Tailwind Default Blue)

Your custom blue colors are now mapped to Tailwind's color scale:

| Tailwind Class                  | CSS Variable     | Hex Value | Usage                          |
| ------------------------------- | ---------------- | --------- | ------------------------------ |
| `bg-blue-50` / `text-blue-50`   | `--color-blue-0` | #e7f5ff   | Backgrounds, subtle highlights |
| `bg-blue-100` / `text-blue-100` | `--color-blue-1` | #d0ebff   | Hover backgrounds              |
| `bg-blue-200` / `text-blue-200` | `--color-blue-2` | #a5d8ff   | Disabled states, borders       |
| `bg-blue-300` / `text-blue-300` | `--color-blue-3` | #74c0fc   | Icons, secondary elements      |
| `bg-blue-400` / `text-blue-400` | `--color-blue-4` | #4dabf7   | Hover on interactive elements  |
| `bg-blue-500` / `text-blue-500` | `--color-blue-5` | #339af0   | **PRIMARY** - main CTAs, links |
| `bg-blue-600` / `text-blue-600` | `--color-blue-6` | #228be6   | Primary hover                  |
| `bg-blue-700` / `text-blue-700` | `--color-blue-7` | #1c7ed6   | Primary active / pressed       |
| `bg-blue-800` / `text-blue-800` | `--color-blue-8` | #1971c2   | Dark mode primary              |
| `bg-blue-900` / `text-blue-900` | `--color-blue-9` | #1864ab   | Dark mode primary hover        |

### Neutral/Gray Palette (Replaces Tailwind Default Gray)

Cool gray with blue tint, used throughout the interface:

| Tailwind Class                  | CSS Variable        | Hex Value | Usage                              |
| ------------------------------- | ------------------- | --------- | ---------------------------------- |
| `bg-gray-50` / `text-gray-50`   | `--color-neutral-0` | #f8fafc   | Page background (light)            |
| `bg-gray-100` / `text-gray-100` | `--color-neutral-1` | #f1f5f9   | Card / surface background          |
| `bg-gray-200` / `text-gray-200` | `--color-neutral-2` | #e2e8f0   | Borders, dividers                  |
| `bg-gray-300` / `text-gray-300` | `--color-neutral-3` | #cbd5e1   | Placeholder text, disabled borders |
| `bg-gray-400` / `text-gray-400` | `--color-neutral-4` | #94a3b8   | Muted text, icons                  |
| `bg-gray-500` / `text-gray-500` | `--color-neutral-5` | #64748b   | Secondary text                     |
| `bg-gray-600` / `text-gray-600` | `--color-neutral-6` | #475569   | Body text (light mode)             |
| `bg-gray-700` / `text-gray-700` | `--color-neutral-7` | #334155   | Strong body text                   |
| `bg-gray-800` / `text-gray-800` | `--color-neutral-8` | #1e293b   | Headings                           |
| `bg-gray-900` / `text-gray-900` | `--color-neutral-9` | #0f172a   | Page background (dark)             |

### Semantic Colors

Use these for status-driven UI elements:

#### Success

```html
<div class="bg-success">...</div>
<!-- #40c057 -->
<div class="bg-success-light">...</div>
<!-- #d3f9d8 -->
<div class="bg-success-dark">...</div>
<!-- #2f9e44 -->
<div class="shadow-success">...</div>
<!-- Green glow -->
```

#### Warning

```html
<div class="bg-warning">...</div>
<!-- #fab005 -->
<div class="bg-warning-light">...</div>
<!-- #fff3bf -->
<div class="bg-warning-dark">...</div>
<!-- #e67700 -->
<div class="shadow-warning">...</div>
<!-- Amber glow -->
```

#### Danger

```html
<div class="bg-danger">...</div>
<!-- #fa5252 -->
<div class="bg-danger-light">...</div>
<!-- #ffe3e3 -->
<div class="bg-danger-dark">...</div>
<!-- #c92a2a -->
<div class="shadow-danger">...</div>
<!-- Red glow -->
```

#### Info

```html
<div class="bg-info">...</div>
<!-- #22b8cf -->
<div class="bg-info-light">...</div>
<!-- #e3fafc -->
<div class="bg-info-dark">...</div>
<!-- #0c8599 -->
```

### Brand Aliases

Convenient shortcuts for brand-specific colors:

```html
<div class="bg-brand">...</div>
<!-- Equivalent to bg-blue-500 -->
<div class="bg-brand-soft">...</div>
<!-- Equivalent to bg-blue-50 -->
<div class="bg-brand-strong">...</div>
<!-- Equivalent to bg-blue-800 -->
```

### Custom Shadows

Your shadow system is now available as Tailwind utilities:

```html
<div class="shadow-xs">...</div>
<!-- Extra small elevation -->
<div class="shadow-sm">...</div>
<!-- Small elevation -->
<div class="shadow-md">...</div>
<!-- Medium elevation -->
<div class="shadow-lg">...</div>
<!-- Large elevation -->
<div class="shadow-xl">...</div>
<!-- Extra large elevation -->
<div class="shadow-brand">...</div>
<!-- Blue brand glow -->
<div class="shadow-focus">...</div>
<!-- Focus ring shadow -->
<div class="shadow-success">...</div>
<!-- Green success glow -->
<div class="shadow-warning">...</div>
<!-- Amber warning glow -->
<div class="shadow-danger">...</div>
<!-- Red danger glow -->
```

## How It Works

1. **CSS Variables Source**: All colors are defined as CSS variables in `src/styles/tokens.css`
2. **Tailwind Integration**: The `tailwind.config.ts` file references these CSS variables
3. **No Recompilation Needed**: Changes to CSS variable values in `tokens.css` automatically apply to Tailwind utilities

## Using the Colors in Components

### Example 1: Button with brand color

```html
<!-- Before: Using custom classes -->
<button class="bg-brand hover:bg-brand-strong">Action</button>

<!-- Now also works: Using Tailwind utilities -->
<button class="bg-blue-500 hover:bg-blue-800">Action</button>
```

### Example 2: Status badges

```html
<span class="bg-success-light text-success-dark px-2 py-1 rounded">Confirmed</span>
<span class="bg-warning-light text-warning-dark px-2 py-1 rounded">Pending</span>
<span class="bg-danger-light text-danger-dark px-2 py-1 rounded">Cancelled</span>
```

### Example 3: Cards with shadow

```html
<div class="bg-gray-50 border border-gray-200 rounded-lg shadow-md p-4">
  <h3 class="text-gray-800 font-semibold">Card Title</h3>
  <p class="text-gray-600">Card content goes here...</p>
</div>
```

### Example 4: Typography colors

```html
<h1 class="text-gray-900 font-bold">Heading</h1>
<p class="text-gray-700">Body text</p>
<span class="text-gray-500">Muted text</span>
```

## Existing Custom Classes

Your project may still use custom CSS classes (e.g., `bg-neutral-primary`, `text-heading`). These continue to work because they reference the same CSS variables. Over time, you can migrate these to use standard Tailwind utilities for consistency.

## Build Process

No changes needed! The existing build pipeline handles everything:

- `src/styles.css` imports both `tokens.css` and `@tailwindcss`
- `.postcssrc.json` processes Tailwind with PostCSS
- Angular's build system includes `src/styles.css` automatically

## Verification Checklist

- ✅ `tailwind.config.ts` created
- ✅ Color variables properly mapped to Tailwind scale
- ✅ Semantic colors available as utilities
- ✅ Shadow system integrated
- ✅ Font family configuration included
- ✅ Flowbite plugin enabled
- ✅ Existing build process unchanged

## Next Steps

1. Run your dev server: `npm start`
2. Check that styles load correctly in the browser
3. Inspect an element to verify CSS variables are resolved
4. Gradually refactor custom class names to use standard Tailwind utilities where beneficial
