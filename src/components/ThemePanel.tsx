import { useMemo } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Field } from "./Field";
import { Stack } from "./Stack";
import { Text } from "./Text";
import { useTheme } from "../theme/ThemeProvider";
import type { Accent, Appearance, ColorVisionMode } from "../theme/types";

const appearanceOptions: Appearance[] = ["light", "dark"];
const accentOptions: Accent[] = [
  "indigo",
  "azure",
  "violet",
  "emerald",
  "amber",
  "rose",
  "neutral",
];
const colorVisionOptions: ColorVisionMode[] = [
  "normal",
  "protanopia",
  "deuteranopia",
  "tritanopia",
  "achromatopsia",
];

export const ThemePanel = () => {
  const {
    appearance,
    accent,
    colorVision,
    highContrast,
    reducedMotion,
    setAppearance,
    toggleAppearance,
    setAccent,
    setColorVision,
    toggleHighContrast,
    toggleReducedMotion,
  } = useTheme();

  const appearanceLabel = useMemo(() => {
    return appearance === "light" ? "Light" : "Dark";
  }, [appearance]);

  return (
    <Card tone="neutral" padding="lg" hoverable>
      <Stack gap="md">
        <Stack direction="row" align="center" justify="space-between">
          <Text variant="title">Theme settings</Text>
          <Button variant="outline" tone="neutral" onClick={toggleAppearance}>
            Toggle {appearanceLabel}
          </Button>
        </Stack>
        <Stack gap="sm">
          <Field label="Appearance">
            <select
              className="mosaic-input"
              value={appearance}
              onChange={(event) => setAppearance(event.target.value as Appearance)}
            >
              {appearanceOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Accent">
            <select
              className="mosaic-input"
              value={accent}
              onChange={(event) => setAccent(event.target.value as Accent)}
            >
              {accentOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Color vision mode">
            <select
              className="mosaic-input"
              value={colorVision}
              onChange={(event) => setColorVision(event.target.value as ColorVisionMode)}
            >
              {colorVisionOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </Field>
        </Stack>
        <Stack direction="row" gap="sm" wrap>
          <Button
            variant={highContrast ? "solid" : "soft"}
            tone={highContrast ? "danger" : "neutral"}
            onClick={toggleHighContrast}
          >
            {highContrast ? "Disable" : "Enable"} high contrast
          </Button>
          <Button
            variant={reducedMotion ? "solid" : "soft"}
            tone={reducedMotion ? "warning" : "neutral"}
            onClick={toggleReducedMotion}
          >
            {reducedMotion ? "Disable" : "Enable"} reduced motion
          </Button>
        </Stack>
        <Text variant="caption" tone="subtle">
          Mosaic adapts automatically to system preferences and exposes helpers for color vision,
          high contrast, and motion reduction so you can ship inclusive interfaces.
        </Text>
      </Stack>
    </Card>
  );
};
