# Mosaic UI

Mosaic is an ergonomic React component framework built for inclusive, themeable interfaces. It ships with an opinionated theming system, accessibility-first primitives, and helpers for color vision, high-contrast, and reduced-motion experiences — all powered by Bun.

## Features

- **Adaptive theming** – Toggle light/dark appearance, swap accent palettes, and generate CSS variables for any surface.
- **Color vision awareness** – Built-in palettes for protanopia, deuteranopia, tritanopia, and achromatopsia modes maintain contrast and readability.
- **High contrast & reduced motion** – Global switches alter tokens, shadows, and motion variables so interactions remain comfortable for every user.
- **Keyboard-first navigation** – Global shortcuts, a modal command palette (`⌘/Ctrl + K`), tooltip hints, and context menus all share the same registry.
- **Composable primitives** – Buttons, cards, text, inputs, layout utilities, and form helpers share a unified design language.
- **Developer ergonomics** – A single `ThemeProvider`, ergonomic hooks, and a drop-in `ThemePanel` make experimentation fast.
- **Kitchen-sink playground** – Run `bun dev` to explore every primitive with live tokens, accessibility toggles, and keyboard shortcuts.

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

Wrap your application with the `ThemeProvider`, `ShortcutsProvider`, `ToastProvider`, and `CommandPalette` to wire theming, keyboard shortcuts, and notifications. Mosaic automatically syncs with system preferences and exposes helpers via `useTheme`.

```tsx
import {
  Button,
  Card,
  CommandPalette,
  ShortcutsProvider,
  Stack,
  Text,
  ThemePanel,
  ThemeProvider,
  ToastProvider,
} from "mosaic-ui";

export function App() {
  return (
    <ThemeProvider>
      <ShortcutsProvider>
        <ToastProvider>
          <CommandPalette>
            <Stack gap="lg" style={{ padding: "2rem" }}>
              <Card tone="primary" hoverable>
                <Stack gap="sm">
                  <Text variant="headline">Welcome to Mosaic</Text>
                  <Text>
                    Use the controls below to explore palettes, accessibility modes, keyboard shortcuts, and motion preferences.
                  </Text>
                  <Button onClick={() => console.log("hello")}>Open palette (⌘/Ctrl + K)</Button>
                </Stack>
              </Card>
              <ThemePanel />
            </Stack>
          </CommandPalette>
        </ToastProvider>
      </ShortcutsProvider>
    </ThemeProvider>
  );
}
```

### Registering keyboard commands

`useCommand` ties actions to the shortcut registry and command palette:

```tsx
import { Button, useCommand, useCommandPalette, useToast } from "mosaic-ui";

function KeyboardDemo() {
  const { toggle } = useCommandPalette();
  const { toast } = useToast();

  useCommand(
    {
      id: "demo.toast",
      title: "Trigger success toast",
      combo: "mod+shift+t",
      run: () => toast({ title: "Notified!", tone: "success" }),
      keywords: ["toast", "notification"],
    },
    [toast],
  );

  return <Button onClick={toggle}>Open command palette</Button>;
}
```

### Accessing theme tokens

`useTheme` returns the active theme and ergonomic setters:

```tsx
import { useTheme } from "mosaic-ui";

const { appearance, toggleAppearance, highContrast, toggleHighContrast } = useTheme();
```

Use `getCssVar("color-primary")` inside component styles to reference tokens, or grab `cssVariables` for inline styles.

### Tabs

`Tabs` exposes a roving-tabindex implementation with automatic or manual activation and horizontal or vertical orientation:

```tsx
import { Tabs, Text } from "mosaic-ui";

<Tabs defaultValue="overview" activationMode="automatic">
  <Tabs.List aria-label="Project views">
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
    <Tabs.Trigger value="settings" disabled>
      Settings
    </Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="overview">
    <Text variant="body">Give stakeholders a quick health summary.</Text>
  </Tabs.Panel>
  <Tabs.Panel value="activity">
    <Text variant="body">Show audit trails, deploys, and alerts.</Text>
  </Tabs.Panel>
  <Tabs.Panel value="settings">
    <Text variant="body">Configure integrations and access policies.</Text>
  </Tabs.Panel>
</Tabs>;
```

Use `activationMode="manual"` to require <kbd>Enter</kbd>/<kbd>Space</kbd> confirmation, and set `orientation="vertical"` for sidebar layouts. Always label the tab list with `aria-label` or `aria-labelledby` when no visible heading is present.

### Accordion

`Accordion` renders collapsible sections with arrow-key navigation. Choose `type="single"` (default) for an allow-one-open experience, or `type="multiple"` to keep several panels expanded.

```tsx
import { Accordion, Text } from "mosaic-ui";

<Accordion defaultValue="notifications" collapsible>
  <Accordion.Item value="notifications">
    <Accordion.Trigger>Email notifications</Accordion.Trigger>
    <Accordion.Content>
      <Text variant="body">Send weekly digests and escalation alerts to collaborators.</Text>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="integrations">
    <Accordion.Trigger>Integrations</Accordion.Trigger>
    <Accordion.Content>
      <Text variant="body">Connect to Slack, PagerDuty, or a custom webhook destination.</Text>
    </Accordion.Content>
  </Accordion.Item>
</Accordion>;
```

Pass an array to `defaultValue`/`value` when `type="multiple"`, and set `collapsible` to `true` on single accordions to allow toggling the final open section closed.

### Components

- `Alert` – Tone-aware banners with dismissible info, success, warning, and error states.
- `Avatar` – Adaptive initials and imagery with sizing and fallback states.
- `Badge` – Tone-aware indicators with solid, soft, and outline variants.
- `Button` – Solid, soft, outline, ghost, and loading states with tone tokens.
- `Card` – Themed surfaces with padding controls, elevation, and hover affordances.
- `Checkbox` – Supports indeterminate and descriptive labels out of the box.
- `Combobox` – Searchable option list with keyboard support and optional clearing.
- `CommandPalette` – Global spotlight surfaced via `⌘/Ctrl + K`, powered by shared shortcuts.
- `ContextMenu` – Accessible right-click menus with shortcut hints and keyboard navigation.
- `DataTable` – Sortable tabular data with alignment controls and empty states.
- `DatePicker` – Styled native date input that adopts Mosaic tokens.
- `Dialog` & `Sheet` – Modal and slide-over overlays with focus traps and motion awareness.
- `Field` – Form wrapper that wires labels, hints, and errors to controls automatically.
- `Input` – Accessible text input with size and validation states.
- `RadioGroup` & `Radio` – Keyboard navigable sets with descriptions and validation styling.
- `Tabs` – Orientation-aware tablist with roving focus, manual/automatic activation, and accessible panels.
- `Accordion` – Arrow-key navigable disclosure with single or multiple expansion modes.
- `Select` – Styled native select that adopts Mosaic tokens and focus treatments.
- `Slider` – Accessible range input with accent-aware focus and error states.
- `Pagination` – Paginated navigation with ellipsis handling.
- `Progress` – Determinate and indeterminate indicators with optional labels.
- `Skeleton` – Animated placeholders that pause automatically when reduced motion is enabled.
- `Spinner` – Inline loading indicator that shares motion tokens with `Progress`.
- `Textarea` – Multi-line input with size controls and shared token styling.
- `Stack` – Flexbox layout utility for column/row alignment and spacing.
- `Switch` – Accessible toggle with descriptive text support.
- `Text` – Semantic typography variants with tone helpers and truncation support.
- `ThemePanel` – Drop-in accessibility toolbar for rapid prototyping.
- `Tooltip` – Directional hover/focus hints with shortcut callouts.
- `ToastProvider` / `useToast` – Toast notifications with tone variants and actions.
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

## Documentation playground

Explore every primitive, shortcut, and accessibility toggle by running the kitchen-sink demo:

```bash
bun dev
```

Vite serves the site on [http://localhost:5173](http://localhost:5173) with hot reloading.

## Scripts

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `bun run build`      | Emit `.d.ts` files and ESM bundle.   |
| `bun run typecheck`  | Type-check the source code.          |
| `bun test`           | Reserved for future unit tests.      |

## License

MIT © 2024 Mosaic Contributors
