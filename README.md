# Mosaic UI

Mosaic is an ergonomic React component framework built for inclusive, themeable interfaces. It ships with an opinionated theming system, accessibility-first primitives, and helpers for color vision, high-contrast, and reduced-motion experiences — all powered by Bun.

## Features

- **Adaptive theming** – Toggle light/dark appearance, swap accent palettes, and generate CSS variables for any surface.
- **Color vision awareness** – Built-in palettes for protanopia, deuteranopia, tritanopia, and achromatopsia modes maintain contrast and readability.
- **High contrast & reduced motion** – Global switches alter tokens, shadows, and motion variables so interactions remain comfortable for every user.
- **Composable primitives** – Buttons, cards, text, inputs, layout utilities, and form helpers share a unified design language.
- **Developer ergonomics** – A single `ThemeProvider`, ergonomic hooks, and a drop-in `ThemePanel` make experimentation fast.

## Installation

```bash
bun install mosaic-ui
```

During development you can link the package locally:

```bash
bun install
bun run build
```

The build script emits both ESM bundles and TypeScript declarations in `dist/`.

## Usage

Wrap your application with the `ThemeProvider`. Mosaic automatically syncs with system preferences and exposes helpers via `useTheme`.

```tsx
import { ThemeProvider, Stack, Card, Button, Text, ThemePanel } from "mosaic-ui";

export function App() {
  return (
    <ThemeProvider>
      <Stack gap="lg" style={{ padding: "2rem" }}>
        <Card tone="primary" hoverable>
          <Stack gap="sm">
            <Text variant="headline">Welcome to Mosaic</Text>
            <Text>
              Use the controls below to explore color palettes, accessibility modes, and motion preferences.
            </Text>
            <Button onClick={() => console.log("hello")}>
              Get started
            </Button>
          </Stack>
        </Card>
        <ThemePanel />
      </Stack>
    </ThemeProvider>
  );
}
```

### Accessing theme tokens

`useTheme` returns the active theme and ergonomic setters:

```tsx
import { useTheme } from "mosaic-ui";

const { appearance, toggleAppearance, highContrast, toggleHighContrast } = useTheme();
```

Use `getCssVar("color-primary")` inside component styles to reference tokens, or grab `cssVariables` for inline styles.

### Components

- `Button` – Solid, soft, outline, and ghost variants with tone-aware styling and loading states.
- `Card` – Themed surfaces with padding controls, elevation, and hover affordances.
- `Text` – Semantic typography variants with tone helpers and truncation support.
- `Stack` – Flexbox layout utility for column/row alignment and spacing.
- `Input` – Accessible text input with size and validation states.
- `Field` – Form wrapper that wires labels, hints, and errors to controls automatically.
- `ThemePanel` – Drop-in accessibility toolbar for rapid prototyping.
- `VisuallyHidden` – A utility for screen-reader only content.

## Theming API

`ThemeProvider` accepts optional configuration:

```tsx
<ThemeProvider
  initialTheme={{ appearance: "dark", accent: "emerald" }}
  storageKey="mosaic-theme"
>
  {children}
</ThemeProvider>
```

Options include:

- `appearance`: `"light" | "dark"`
- `accent`: palette token (`"indigo"`, `"azure"`, `"violet"`, `"emerald"`, `"amber"`, `"rose"`, or `"neutral"`)
- `colorVision`: color-vision mode (`"normal"`, `"protanopia"`, `"deuteranopia"`, `"tritanopia"`, `"achromatopsia"`)
- `highContrast`: boolean for contrast-first visuals
- `reducedMotion`: boolean to shorten or remove transitions

When `storageKey` is provided, preferences persist to `localStorage`. Setting `syncWithSystem={false}` disables automatic media-query syncing.

## Scripts

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `bun run build`      | Emit `.d.ts` files and ESM bundle.   |
| `bun run typecheck`  | Type-check the source code.          |
| `bun test`           | Reserved for future unit tests.      |

## License

MIT © 2024 Mosaic Contributors
