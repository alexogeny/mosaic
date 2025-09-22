export const baseStyles = `
:root {
  --mosaic-focus-ring: 0 0 0 1px var(--mosaic-color-inverted), 0 0 0 4px var(--mosaic-color-ring);
}

.mosaic-button {
  appearance: none;
  border: var(--mosaic-border-width) solid var(--mosaic-button-border, transparent);
  border-radius: var(--mosaic-radius-md);
  background-color: var(--mosaic-button-bg, transparent);
  color: var(--mosaic-button-fg, var(--mosaic-color-text));
  font-family: var(--mosaic-font-family-base);
  font-weight: 600;
  font-size: var(--mosaic-button-font-size, var(--mosaic-text-size-md));
  line-height: var(--mosaic-line-height-tight);
  padding-block: var(--mosaic-button-padding-y, var(--mosaic-spacing-sm));
  padding-inline: var(--mosaic-button-padding-x, var(--mosaic-spacing-md));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--mosaic-spacing-xs);
  cursor: pointer;
  text-decoration: none;
  position: relative;
  transition: background-color var(--mosaic-motion-duration) var(--mosaic-motion-ease),
    color var(--mosaic-motion-duration) var(--mosaic-motion-ease),
    border-color var(--mosaic-motion-duration) var(--mosaic-motion-ease),
    box-shadow var(--mosaic-motion-duration) var(--mosaic-motion-ease),
    transform var(--mosaic-motion-duration) var(--mosaic-motion-ease);
  min-height: calc(2.5rem + var(--mosaic-button-size-adjust, 0));
}

.mosaic-button[data-full-width="true"] {
  width: 100%;
}

.mosaic-button:focus-visible {
  outline: none;
  box-shadow: var(--mosaic-focus-ring);
}

.mosaic-button[data-variant="solid"]:hover:not(:disabled),
.mosaic-button[data-variant="solid"]:focus-visible:not(:disabled) {
  background-color: var(--mosaic-button-bg-hover, var(--mosaic-button-bg));
}

.mosaic-button[data-variant="solid"]:active:not(:disabled) {
  background-color: var(--mosaic-button-bg-active, var(--mosaic-button-bg));
  transform: translateY(1px);
}

.mosaic-button[data-variant="soft"] {
  border-color: var(--mosaic-button-border, transparent);
}

.mosaic-button[data-variant="soft"]:hover:not(:disabled),
.mosaic-button[data-variant="soft"]:focus-visible:not(:disabled) {
  background-color: var(--mosaic-button-bg-hover, var(--mosaic-button-bg));
  border-color: var(--mosaic-button-border-hover, var(--mosaic-button-border));
}

.mosaic-button[data-variant="soft"]:active:not(:disabled) {
  background-color: var(--mosaic-button-bg-active, var(--mosaic-button-bg));
}

.mosaic-button[data-variant="outline"] {
  background-color: transparent;
  border-color: var(--mosaic-button-border, var(--mosaic-color-border));
}

.mosaic-button[data-variant="outline"]:hover:not(:disabled),
.mosaic-button[data-variant="outline"]:focus-visible:not(:disabled) {
  background-color: var(--mosaic-button-bg-hover, var(--mosaic-color-surface-hover));
  border-color: var(--mosaic-button-border-hover, var(--mosaic-button-border));
}

.mosaic-button[data-variant="outline"]:active:not(:disabled) {
  background-color: var(--mosaic-button-bg-active, var(--mosaic-color-surface-active));
}

.mosaic-button[data-variant="ghost"] {
  background-color: transparent;
  border-color: transparent;
}

.mosaic-button[data-variant="ghost"]:hover:not(:disabled),
.mosaic-button[data-variant="ghost"]:focus-visible:not(:disabled) {
  background-color: var(--mosaic-button-bg-hover, var(--mosaic-color-surface-hover));
}

.mosaic-button[data-variant="ghost"]:active:not(:disabled) {
  background-color: var(--mosaic-button-bg-active, var(--mosaic-color-surface-active));
}

.mosaic-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.mosaic-button[data-loading="true"] {
  cursor: progress;
}

.mosaic-button__label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mosaic-button__spinner {
  width: 1em;
  height: 1em;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-right-color: currentColor;
  animation: mosaic-spin 0.8s linear infinite;
}

[data-mosaic-reduced-motion="true"] .mosaic-button__spinner {
  animation: none;
  border-top-color: currentColor;
  border-right-color: currentColor;
}

@keyframes mosaic-spin {
  to {
    transform: rotate(360deg);
  }
}

.mosaic-card {
  background-color: var(--mosaic-card-bg, var(--mosaic-color-surface));
  color: var(--mosaic-card-fg, var(--mosaic-color-text));
  border: var(--mosaic-border-width) solid var(--mosaic-card-border, var(--mosaic-color-border));
  border-radius: var(--mosaic-radius-lg);
  padding: var(--mosaic-card-padding, var(--mosaic-spacing-lg));
  box-shadow: var(--mosaic-card-shadow, var(--mosaic-shadow-sm));
  display: flex;
  flex-direction: column;
  gap: var(--mosaic-spacing-md);
  transition: box-shadow var(--mosaic-motion-duration) var(--mosaic-motion-ease),
    transform var(--mosaic-motion-duration) var(--mosaic-motion-ease);
}

.mosaic-card[data-hoverable="true"]:hover {
  box-shadow: var(--mosaic-card-shadow-hover, var(--mosaic-shadow-md));
  transform: translateY(-1px);
}

.mosaic-card[data-elevated="true"] {
  box-shadow: var(--mosaic-shadow-md);
}

.mosaic-card[data-tone="primary"] {
  --mosaic-card-bg: var(--mosaic-color-primary-soft);
  --mosaic-card-border: var(--mosaic-color-primary-border);
}

.mosaic-text {
  margin: 0;
  color: var(--mosaic-text-color, inherit);
  font-family: var(--mosaic-font-family-base);
}

.mosaic-text[data-variant="muted"] {
  color: var(--mosaic-color-text-muted);
}

.mosaic-text[data-variant="subtle"] {
  color: var(--mosaic-color-text-subtle);
}

.mosaic-text[data-variant="code"] {
  font-family: var(--mosaic-font-family-mono);
  font-size: var(--mosaic-text-size-sm);
  background: var(--mosaic-color-surface-hover);
  padding: 0.125rem 0.25rem;
  border-radius: var(--mosaic-radius-sm);
}

.mosaic-text[data-variant="headline"] {
  font-size: var(--mosaic-text-size-2xl);
  font-weight: 700;
  line-height: var(--mosaic-line-height-tight);
}

.mosaic-text[data-variant="title"] {
  font-size: var(--mosaic-text-size-xl);
  font-weight: 600;
  line-height: var(--mosaic-line-height-tight);
}

.mosaic-text[data-variant="label"] {
  font-size: var(--mosaic-text-size-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--mosaic-color-text-subtle);
}

.mosaic-text[data-variant="caption"] {
  font-size: var(--mosaic-text-size-sm);
  color: var(--mosaic-color-text-muted);
}

.mosaic-stack {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--mosaic-stack-gap, var(--mosaic-spacing-md));
  align-items: var(--mosaic-stack-align, stretch);
  justify-content: var(--mosaic-stack-justify, flex-start);
}

.mosaic-stack[data-direction="column"] {
  flex-direction: column;
}

.mosaic-stack[data-direction="row"] {
  flex-direction: row;
}

.mosaic-input {
  width: 100%;
  font: inherit;
  padding-block: var(--mosaic-input-padding-y, var(--mosaic-spacing-sm));
  padding-inline: var(--mosaic-input-padding-x, var(--mosaic-spacing-md));
  border-radius: var(--mosaic-radius-md);
  border: var(--mosaic-border-width) solid var(--mosaic-color-border);
  background-color: var(--mosaic-color-surface);
  color: var(--mosaic-color-text);
  font-size: var(--mosaic-input-font-size, var(--mosaic-text-size-md));
  line-height: var(--mosaic-line-height-normal);
  transition: border-color var(--mosaic-motion-duration) var(--mosaic-motion-ease),
    box-shadow var(--mosaic-motion-duration) var(--mosaic-motion-ease),
    background-color var(--mosaic-motion-duration) var(--mosaic-motion-ease);
}

.mosaic-input::placeholder {
  color: var(--mosaic-color-text-muted);
}

.mosaic-input:focus-visible {
  outline: none;
  border-color: var(--mosaic-color-ring);
  box-shadow: var(--mosaic-focus-ring);
}

.mosaic-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mosaic-field {
  display: flex;
  flex-direction: column;
  gap: var(--mosaic-spacing-xs);
}

.mosaic-field__label {
  font-size: var(--mosaic-text-size-sm);
  font-weight: 600;
  color: var(--mosaic-color-text);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.mosaic-field__required {
  color: var(--mosaic-color-danger);
}

.mosaic-field__control {
  display: flex;
  flex-direction: column;
}

.mosaic-field__description {
  font-size: var(--mosaic-text-size-sm);
  color: var(--mosaic-color-text-subtle);
}

.mosaic-field__hint {
  font-size: var(--mosaic-text-size-sm);
  color: var(--mosaic-color-text-muted);
}

.mosaic-field__error {
  font-size: var(--mosaic-text-size-sm);
  color: var(--mosaic-color-danger);
}

.mosaic-field[data-invalid="true"] .mosaic-input {
  border-color: var(--mosaic-color-danger);
  box-shadow: 0 0 0 1px var(--mosaic-color-danger);
}

.mosaic-visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
`;
