# Design System Documentation

## Colors

Our color system is built around a primary blue palette and a neutral grayscale, complemented by semantic colors for success, error, and warning states.

### Primary Colors
- `primary-50`: #f0f9ff - Light blue background
- `primary-500`: #0ea5e9 - Main blue
- `primary-700`: #0369a1 - Dark blue

### Neutral Colors
- `neutral-50`: #fafafa - Lightest background
- `neutral-200`: #e5e5e5 - Border light
- `neutral-700`: #404040 - Primary text
- `neutral-900`: #171717 - Darkest text

### Semantic Colors
- Success: `success-500`: #22c55e
- Error: `error-500`: #ef4444
- Warning: `warning-500`: #f59e0b

## Typography

### Font Families
- Sans-serif: Inter (Primary font)
- Monospace: System monospace stack

### Font Sizes
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)

### Font Weights
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Line Heights
- none: 1
- tight: 1.25
- normal: 1.5
- relaxed: 1.625

## Spacing

Our spacing system follows an 8-point grid:
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 4: 1rem (16px)
- 6: 1.5rem (24px)
- 8: 2rem (32px)
- 12: 3rem (48px)
- 16: 4rem (64px)

## Shadows

- sm: Subtle shadow for small elements
- DEFAULT: Standard shadow for cards
- md: Medium shadow for hoverable elements
- lg: Large shadow for modals
- xl: Extra large shadow for overlays

## Border Radius

- sm: 0.125rem (2px)
- DEFAULT: 0.25rem (4px)
- md: 0.375rem (6px)
- lg: 0.5rem (8px)
- xl: 0.75rem (12px)
- 2xl: 1rem (16px)
- full: 9999px (Circular)

## Transitions

- DEFAULT: 150ms
- fast: 100ms
- slow: 300ms

All transitions use a cubic-bezier timing function (0.4, 0, 0.2, 1) for smooth easing.

## Usage Examples

### Buttons
```tsx
// Primary Button
<button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition">
  Click me
</button>

// Secondary Button
<button className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-md transition">
  Cancel
</button>
```

### Text Styles
```tsx
// Headings
<h1 className="text-4xl font-bold text-neutral-900">
<h2 className="text-2xl font-semibold text-neutral-800">
<h3 className="text-xl font-medium text-neutral-700">

// Body Text
<p className="text-base text-neutral-700">
<p className="text-sm text-neutral-600">
```

### Cards
```tsx
<div className="bg-white shadow-md rounded-lg p-6">
  <h3 className="text-lg font-semibold mb-4">Card Title</h3>
  <p className="text-neutral-600">Card content</p>
</div>
``` 