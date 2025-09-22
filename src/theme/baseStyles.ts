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

.mosaic-textarea {
  width: 100%;
  min-height: 6rem;
  font: inherit;
  padding-block: var(--mosaic-textarea-padding-y, var(--mosaic-spacing-sm));
  padding-inline: var(--mosaic-textarea-padding-x, var(--mosaic-spacing-md));
  border-radius: var(--mosaic-radius-md);
  border: var(--mosaic-border-width) solid var(--mosaic-color-border);
  background-color: var(--mosaic-color-surface);
  color: var(--mosaic-color-text);
  font-size: var(--mosaic-textarea-font-size, var(--mosaic-text-size-md));
  line-height: var(--mosaic-line-height-normal);
  resize: vertical;
  transition: border-color var(--mosaic-motion-duration) var(--mosaic-motion-ease),
    box-shadow var(--mosaic-motion-duration) var(--mosaic-motion-ease),
    background-color var(--mosaic-motion-duration) var(--mosaic-motion-ease);
}

.mosaic-textarea::placeholder {
  color: var(--mosaic-color-text-muted);
}

.mosaic-textarea:focus-visible {
  outline: none;
  border-color: var(--mosaic-color-ring);
  box-shadow: var(--mosaic-focus-ring);
}

.mosaic-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mosaic-select {
  width: 100%;
  font: inherit;
  padding-block: var(--mosaic-select-padding-y, var(--mosaic-spacing-sm));
  padding-inline: var(--mosaic-select-padding-x, var(--mosaic-spacing-md));
  padding-inline-end: calc(var(--mosaic-select-padding-x, var(--mosaic-spacing-md)) + 1.75rem);
  border-radius: var(--mosaic-radius-md);
  border: var(--mosaic-border-width) solid var(--mosaic-color-border);
  background-color: var(--mosaic-color-surface);
  color: var(--mosaic-color-text);
  font-size: var(--mosaic-select-font-size, var(--mosaic-text-size-md));
  line-height: var(--mosaic-line-height-normal);
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--mosaic-color-text-muted) 50%),
    linear-gradient(135deg, var(--mosaic-color-text-muted) 50%, transparent 50%);
  background-position: calc(100% - 1.15rem) 52%, calc(100% - 0.65rem) 52%;
  background-size: 0.45rem 0.45rem;
  background-repeat: no-repeat;
  transition: border-color var(--mosaic-motion-duration) var(--mosaic-motion-ease),
    box-shadow var(--mosaic-motion-duration) var(--mosaic-motion-ease),
    background-color var(--mosaic-motion-duration) var(--mosaic-motion-ease);
  cursor: pointer;
}

.mosaic-select:focus-visible {
  outline: none;
  border-color: var(--mosaic-color-ring);
  box-shadow: var(--mosaic-focus-ring);
}

.mosaic-select:disabled {
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

.mosaic-field[data-invalid="true"] .mosaic-input,
.mosaic-input[data-invalid="true"] {
  border-color: var(--mosaic-color-danger);
  box-shadow: 0 0 0 1px var(--mosaic-color-danger);
}

.mosaic-field[data-invalid="true"] .mosaic-textarea,
.mosaic-textarea[data-invalid="true"] {
  border-color: var(--mosaic-color-danger);
  box-shadow: 0 0 0 1px var(--mosaic-color-danger);
}

.mosaic-field[data-invalid="true"] .mosaic-select,
.mosaic-select[data-invalid="true"] {
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

.mosaic-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--mosaic-spacing-lg);
  background-color: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(8px);
}

[data-mosaic-theme="dark"] .mosaic-overlay {
  background-color: rgba(15, 23, 42, 0.6);
}

[data-mosaic-reduced-motion="true"] .mosaic-overlay {
  backdrop-filter: none;
}

.mosaic-overlay[data-variant="sheet"] {
  align-items: stretch;
  padding: 0;
}

.mosaic-overlay[data-variant="sheet"][data-side="left"] {
  justify-content: flex-start;
}

.mosaic-overlay[data-variant="sheet"][data-side="right"] {
  justify-content: flex-end;
}

.mosaic-overlay[data-variant="sheet"][data-side="bottom"] {
  justify-content: center;
  align-items: flex-end;
}

.mosaic-dialog {
  background-color: var(--mosaic-color-surface);
  color: var(--mosaic-color-text);
  border-radius: var(--mosaic-radius-lg);
  border: var(--mosaic-border-width) solid var(--mosaic-color-border);
  box-shadow: var(--mosaic-shadow-lg);
  min-width: min(32rem, calc(100vw - 4rem));
  max-width: calc(100vw - 4rem);
  max-height: calc(100vh - 4rem);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.mosaic-dialog[data-size="sm"] {
  min-width: min(24rem, calc(100vw - 4rem));
}

.mosaic-dialog[data-size="lg"] {
  min-width: min(40rem, calc(100vw - 4rem));
}

.mosaic-dialog[data-size="xl"] {
  min-width: min(48rem, calc(100vw - 4rem));
}

.mosaic-dialog[data-size="full"] {
  min-width: calc(100vw - 2rem);
}

.mosaic-dialog[data-variant="sheet"] {
  border-radius: 0;
  max-width: min(28rem, 100vw);
  min-width: min(24rem, 100vw);
  height: 100%;
  max-height: none;
}

.mosaic-dialog[data-variant="sheet"][data-side="left"] {
  border-right: var(--mosaic-border-width) solid var(--mosaic-color-border);
}

.mosaic-dialog[data-variant="sheet"][data-side="right"] {
  border-left: var(--mosaic-border-width) solid var(--mosaic-color-border);
}

.mosaic-dialog[data-variant="sheet"][data-side="bottom"] {
  width: 100%;
  max-width: none;
  height: min(32rem, 100%);
  border-top: var(--mosaic-border-width) solid var(--mosaic-color-border);
}

.mosaic-dialog__close {
  position: absolute;
  top: var(--mosaic-spacing-sm);
  right: var(--mosaic-spacing-sm);
  border: none;
  background: transparent;
  color: var(--mosaic-color-text-muted);
  font-size: var(--mosaic-text-size-xl);
  line-height: 1;
  padding: var(--mosaic-spacing-xs);
  border-radius: var(--mosaic-radius-sm);
  cursor: pointer;
}

.mosaic-dialog__close:hover,
.mosaic-dialog__close:focus-visible {
  background-color: var(--mosaic-color-surface-hover);
  color: var(--mosaic-color-text);
}

.mosaic-dialog__header {
  padding: var(--mosaic-spacing-lg);
  border-bottom: var(--mosaic-border-width) solid var(--mosaic-color-border);
}

.mosaic-dialog__title {
  font-size: var(--mosaic-text-size-xl);
  font-weight: 600;
  margin: 0;
}

.mosaic-dialog__description {
  margin: var(--mosaic-spacing-xs) 0 0;
  color: var(--mosaic-color-text-subtle);
  font-size: var(--mosaic-text-size-sm);
}

.mosaic-dialog__body {
  padding: var(--mosaic-spacing-lg);
  overflow-y: auto;
  flex: 1 1 auto;
}

.mosaic-dialog__footer {
  padding: var(--mosaic-spacing-md) var(--mosaic-spacing-lg);
  border-top: var(--mosaic-border-width) solid var(--mosaic-color-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--mosaic-spacing-sm);
}

.mosaic-dialog[data-variant="command"] {
  max-width: min(40rem, calc(100vw - 3rem));
}

.mosaic-dialog[data-variant="command"] .mosaic-dialog__body {
  padding: 0;
}

.mosaic-command {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.mosaic-command__search {
  padding: var(--mosaic-spacing-lg);
  border-bottom: var(--mosaic-border-width) solid var(--mosaic-color-border);
  display: flex;
  flex-direction: column;
  gap: var(--mosaic-spacing-xs);
}

.mosaic-command__label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--mosaic-text-size-sm);
  color: var(--mosaic-color-text-subtle);
}

.mosaic-command__shortcut {
  background-color: var(--mosaic-color-surface-hover);
  border-radius: var(--mosaic-radius-sm);
  padding: 0.125rem 0.5rem;
  font-size: var(--mosaic-text-size-sm);
  color: var(--mosaic-color-text-muted);
}

.mosaic-command__input {
  width: 100%;
  border: none;
  outline: none;
  background: var(--mosaic-color-surface-hover);
  color: var(--mosaic-color-text);
  padding: var(--mosaic-spacing-sm);
  border-radius: var(--mosaic-radius-md);
  font-size: var(--mosaic-text-size-md);
}

.mosaic-command__results {
  max-height: 22rem;
  overflow-y: auto;
}

.mosaic-command__list {
  display: flex;
  flex-direction: column;
  padding: var(--mosaic-spacing-xs) 0;
}

.mosaic-command__section {
  padding: var(--mosaic-spacing-xs) var(--mosaic-spacing-md);
}

.mosaic-command__section-label {
  font-size: var(--mosaic-text-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  color: var(--mosaic-color-text-muted);
  margin-bottom: var(--mosaic-spacing-xs);
}

.mosaic-command__option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--mosaic-spacing-sm) var(--mosaic-spacing-md);
  border-radius: var(--mosaic-radius-md);
  cursor: pointer;
  color: var(--mosaic-color-text);
}

.mosaic-command__option:hover,
.mosaic-command__option--active {
  background-color: var(--mosaic-color-surface-hover);
}

.mosaic-command__option-title {
  font-weight: 500;
}

.mosaic-command__option-description {
  display: block;
  font-size: var(--mosaic-text-size-sm);
  color: var(--mosaic-color-text-muted);
}

.mosaic-command__option-shortcut {
  font-size: var(--mosaic-text-size-sm);
  color: var(--mosaic-color-text-muted);
}

.mosaic-command__empty {
  padding: var(--mosaic-spacing-lg);
  text-align: center;
  color: var(--mosaic-color-text-muted);
}

.mosaic-tooltip {
  position: fixed;
  z-index: 1100;
  background-color: var(--mosaic-color-text);
  color: var(--mosaic-color-inverted);
  padding: 0.35rem 0.55rem;
  border-radius: var(--mosaic-radius-sm);
  font-size: var(--mosaic-text-size-sm);
  box-shadow: var(--mosaic-shadow-sm);
  pointer-events: none;
  display: inline-flex;
  gap: var(--mosaic-spacing-xs);
  align-items: center;
}

.mosaic-tooltip[data-side="top"]::after,
.mosaic-tooltip[data-side="bottom"]::after,
.mosaic-tooltip[data-side="left"]::after,
.mosaic-tooltip[data-side="right"]::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.mosaic-tooltip[data-side="top"]::after {
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px 6px 0 6px;
  border-color: var(--mosaic-color-text) transparent transparent transparent;
}

.mosaic-tooltip[data-side="bottom"]::after {
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 6px 6px 6px;
  border-color: transparent transparent var(--mosaic-color-text) transparent;
}

.mosaic-tooltip[data-side="left"]::after {
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 6px 0 6px 6px;
  border-color: transparent transparent transparent var(--mosaic-color-text);
}

.mosaic-tooltip[data-side="right"]::after {
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 6px 6px 6px 0;
  border-color: transparent var(--mosaic-color-text) transparent transparent;
}

.mosaic-tooltip__shortcut {
  font-weight: 600;
}

.mosaic-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--mosaic-spacing-sm);
  cursor: pointer;
}

.mosaic-switch__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.mosaic-switch__track {
  width: 2.75rem;
  height: 1.5rem;
  background-color: var(--mosaic-color-surface-hover);
  border-radius: 999px;
  position: relative;
  transition: background-color var(--mosaic-motion-duration) var(--mosaic-motion-ease);
}

.mosaic-switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1.1rem;
  height: 1.1rem;
  background-color: var(--mosaic-color-inverted);
  border-radius: 50%;
  box-shadow: var(--mosaic-shadow-sm);
  transition: transform var(--mosaic-motion-duration) var(--mosaic-motion-ease);
}

.mosaic-switch__input:checked + .mosaic-switch__track {
  background-color: var(--mosaic-color-primary);
}

.mosaic-switch__input:checked + .mosaic-switch__track .mosaic-switch__thumb {
  transform: translateX(1.25rem);
}

.mosaic-switch__input:focus-visible + .mosaic-switch__track {
  box-shadow: var(--mosaic-focus-ring);
}

.mosaic-switch__content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.mosaic-switch__label {
  font-weight: 500;
}

.mosaic-switch__description,
.mosaic-checkbox__description,
.mosaic-radio__description {
  font-size: var(--mosaic-text-size-sm);
  color: var(--mosaic-color-text-muted);
}

.mosaic-checkbox {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--mosaic-spacing-sm);
  cursor: pointer;
}

.mosaic-checkbox__control {
  position: relative;
  width: 1.2rem;
  height: 1.2rem;
}

.mosaic-checkbox__input {
  position: absolute;
  opacity: 0;
  inset: 0;
}

.mosaic-checkbox__indicator {
  width: 100%;
  height: 100%;
  border-radius: var(--mosaic-radius-sm);
  border: var(--mosaic-border-width) solid var(--mosaic-color-border);
  background: var(--mosaic-color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--mosaic-motion-duration) var(--mosaic-motion-ease),
    border-color var(--mosaic-motion-duration) var(--mosaic-motion-ease);
}

.mosaic-checkbox__input:checked + .mosaic-checkbox__indicator {
  background-color: var(--mosaic-color-primary);
  border-color: var(--mosaic-color-primary);
  color: var(--mosaic-color-primary-contrast);
}

.mosaic-checkbox__input:checked + .mosaic-checkbox__indicator::after {
  content: "✔";
  font-size: 0.75rem;
}

.mosaic-checkbox__input:indeterminate + .mosaic-checkbox__indicator::after {
  content: "";
  width: 0.6rem;
  height: 0.15rem;
  background-color: currentColor;
  border-radius: var(--mosaic-radius-sm);
}

.mosaic-checkbox__input:focus-visible + .mosaic-checkbox__indicator {
  box-shadow: var(--mosaic-focus-ring);
}

.mosaic-checkbox__label {
  font-weight: 500;
}

.mosaic-radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--mosaic-spacing-sm);
}

.mosaic-radio-group[data-orientation="horizontal"] {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--mosaic-spacing-md);
}

.mosaic-radio {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--mosaic-spacing-sm);
  cursor: pointer;
  color: var(--mosaic-color-text);
}

.mosaic-radio[data-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.6;
  pointer-events: none;
}

.mosaic-radio__control {
  position: relative;
  width: 1.2rem;
  height: 1.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mosaic-radio__input {
  position: absolute;
  opacity: 0;
  inset: 0;
}

.mosaic-radio__indicator {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  border: var(--mosaic-border-width) solid var(--mosaic-color-border);
  background: var(--mosaic-color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--mosaic-motion-duration) var(--mosaic-motion-ease),
    border-color var(--mosaic-motion-duration) var(--mosaic-motion-ease);
}

.mosaic-radio__indicator::after {
  content: "";
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background-color: transparent;
  transition: background-color var(--mosaic-motion-duration) var(--mosaic-motion-ease);
}

.mosaic-radio__input:checked + .mosaic-radio__indicator {
  border-color: var(--mosaic-color-primary);
  background-color: var(--mosaic-color-primary-soft);
}

.mosaic-radio__input:checked + .mosaic-radio__indicator::after {
  background-color: var(--mosaic-color-primary);
}

.mosaic-radio__input:focus-visible + .mosaic-radio__indicator {
  box-shadow: var(--mosaic-focus-ring);
}

.mosaic-radio__content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.mosaic-radio__label {
  font-weight: 500;
}

.mosaic-radio-group[data-invalid="true"] .mosaic-radio__indicator,
.mosaic-field[data-invalid="true"] .mosaic-radio__indicator,
.mosaic-radio[data-invalid="true"] .mosaic-radio__indicator {
  border-color: var(--mosaic-color-danger);
}

.mosaic-radio-group[data-invalid="true"] .mosaic-radio__input:checked + .mosaic-radio__indicator,
.mosaic-field[data-invalid="true"] .mosaic-radio__input:checked + .mosaic-radio__indicator,
.mosaic-radio[data-invalid="true"] .mosaic-radio__input:checked + .mosaic-radio__indicator {
  background-color: var(--mosaic-color-danger);
  border-color: var(--mosaic-color-danger);
}

.mosaic-radio-group[data-invalid="true"] .mosaic-radio__input:checked + .mosaic-radio__indicator::after,
.mosaic-field[data-invalid="true"] .mosaic-radio__input:checked + .mosaic-radio__indicator::after,
.mosaic-radio[data-invalid="true"] .mosaic-radio__input:checked + .mosaic-radio__indicator::after {
  background-color: var(--mosaic-color-danger);
}

.mosaic-radio-group[data-invalid="true"] .mosaic-radio__input:focus-visible + .mosaic-radio__indicator,
.mosaic-field[data-invalid="true"] .mosaic-radio__input:focus-visible + .mosaic-radio__indicator,
.mosaic-radio[data-invalid="true"] .mosaic-radio__input:focus-visible + .mosaic-radio__indicator {
  box-shadow: 0 0 0 1px var(--mosaic-color-inverted), 0 0 0 4px var(--mosaic-color-danger);
}

.mosaic-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border-radius: 999px;
  border: 1px solid var(--mosaic-badge-border, transparent);
  background-color: var(--mosaic-badge-bg, transparent);
  color: var(--mosaic-badge-fg, var(--mosaic-color-text));
  font-size: var(--mosaic-text-size-sm);
  font-weight: 600;
  padding: 0.2rem 0.6rem;
}

.mosaic-badge__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mosaic-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--mosaic-color-surface-hover);
  color: var(--mosaic-color-text);
  font-weight: 600;
  position: relative;
  overflow: hidden;
}

.mosaic-avatar[data-shape="square"] {
  border-radius: var(--mosaic-radius-md);
}

.mosaic-avatar[data-size="sm"] {
  width: 2rem;
  height: 2rem;
  font-size: var(--mosaic-text-size-sm);
}

.mosaic-avatar[data-size="md"] {
  width: 2.5rem;
  height: 2.5rem;
  font-size: var(--mosaic-text-size-md);
}

.mosaic-avatar[data-size="lg"] {
  width: 3.5rem;
  height: 3.5rem;
  font-size: var(--mosaic-text-size-lg);
}

.mosaic-avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mosaic-avatar__fallback {
  letter-spacing: 0.05em;
}

.mosaic-progress {
  display: flex;
  flex-direction: column;
  gap: var(--mosaic-spacing-xs);
}

.mosaic-progress__meta {
  display: flex;
  justify-content: space-between;
  font-size: var(--mosaic-text-size-sm);
  color: var(--mosaic-color-text-muted);
}

.mosaic-progress__track {
  width: 100%;
  height: 0.5rem;
  border-radius: 999px;
  background-color: var(--mosaic-color-surface-hover);
  overflow: hidden;
}

.mosaic-progress__indicator {
  height: 100%;
  background: linear-gradient(90deg, var(--mosaic-color-primary) 0%, var(--mosaic-color-primary-border) 100%);
  transition: width var(--mosaic-motion-duration) var(--mosaic-motion-ease);
}

.mosaic-progress[data-indeterminate="true"] .mosaic-progress__indicator {
  width: 40%;
  animation: mosaic-progress-indeterminate 1.2s linear infinite;
}

@keyframes mosaic-progress-indeterminate {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(20%);
  }
  100% {
    transform: translateX(100%);
  }
}

.mosaic-slider {
  width: 100%;
  display: block;
  height: 1.25rem;
  margin: 0;
  background: transparent;
  accent-color: var(--mosaic-color-primary);
  cursor: pointer;
  touch-action: pan-y;
}

.mosaic-slider:focus-visible {
  outline: none;
}

.mosaic-slider:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mosaic-slider::-webkit-slider-runnable-track {
  height: 0.4rem;
  border-radius: 999px;
  background-color: var(--mosaic-color-border);
  transition: background-color var(--mosaic-motion-duration) var(--mosaic-motion-ease);
}

.mosaic-slider::-moz-range-track {
  height: 0.4rem;
  border-radius: 999px;
  background-color: var(--mosaic-color-border);
  transition: background-color var(--mosaic-motion-duration) var(--mosaic-motion-ease);
}

.mosaic-slider::-moz-range-progress {
  height: 0.4rem;
  border-radius: 999px;
  background-color: var(--mosaic-color-primary);
}

.mosaic-slider::-webkit-slider-thumb {
  appearance: none;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background-color: var(--mosaic-color-primary);
  border: var(--mosaic-border-width) solid var(--mosaic-color-primary);
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.2);
  transition: box-shadow var(--mosaic-motion-duration) var(--mosaic-motion-ease),
    background-color var(--mosaic-motion-duration) var(--mosaic-motion-ease);
  margin-top: -0.35rem;
}

.mosaic-slider::-moz-range-thumb {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background-color: var(--mosaic-color-primary);
  border: var(--mosaic-border-width) solid var(--mosaic-color-primary);
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.2);
  transition: box-shadow var(--mosaic-motion-duration) var(--mosaic-motion-ease),
    background-color var(--mosaic-motion-duration) var(--mosaic-motion-ease);
}

.mosaic-slider:focus-visible::-webkit-slider-thumb {
  box-shadow: var(--mosaic-focus-ring), 0 2px 6px rgba(15, 23, 42, 0.2);
}

.mosaic-slider:focus-visible::-moz-range-thumb {
  box-shadow: var(--mosaic-focus-ring), 0 2px 6px rgba(15, 23, 42, 0.2);
}

.mosaic-slider[data-invalid="true"],
.mosaic-field[data-invalid="true"] .mosaic-slider {
  accent-color: var(--mosaic-color-danger);
}

.mosaic-slider[data-invalid="true"]::-webkit-slider-thumb,
.mosaic-field[data-invalid="true"] .mosaic-slider::-webkit-slider-thumb,
.mosaic-slider[data-invalid="true"]::-moz-range-thumb,
.mosaic-field[data-invalid="true"] .mosaic-slider::-moz-range-thumb {
  background-color: var(--mosaic-color-danger);
  border-color: var(--mosaic-color-danger);
}

.mosaic-slider[data-invalid="true"]:focus-visible::-webkit-slider-thumb,
.mosaic-field[data-invalid="true"] .mosaic-slider:focus-visible::-webkit-slider-thumb,
.mosaic-slider[data-invalid="true"]:focus-visible::-moz-range-thumb,
.mosaic-field[data-invalid="true"] .mosaic-slider:focus-visible::-moz-range-thumb {
  box-shadow: 0 0 0 1px var(--mosaic-color-inverted), 0 0 0 4px var(--mosaic-color-danger),
    0 2px 6px rgba(15, 23, 42, 0.2);
}

.mosaic-slider[data-invalid="true"]::-moz-range-progress,
.mosaic-field[data-invalid="true"] .mosaic-slider::-moz-range-progress {
  background-color: var(--mosaic-color-danger);
}

.mosaic-date-picker {
  position: relative;
}

.mosaic-combobox {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--mosaic-spacing-xs);
}

.mosaic-combobox__control {
  position: relative;
}

.mosaic-combobox__input {
  padding-right: 2.5rem;
}

.mosaic-combobox__clear {
  position: absolute;
  right: 0.4rem;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: var(--mosaic-color-text-muted);
  font-size: var(--mosaic-text-size-lg);
  cursor: pointer;
}

.mosaic-combobox__list {
  position: absolute;
  z-index: 900;
  margin-top: 0.25rem;
  width: 100%;
  max-height: 16rem;
  overflow-y: auto;
  background: var(--mosaic-color-surface);
  border-radius: var(--mosaic-radius-md);
  border: var(--mosaic-border-width) solid var(--mosaic-color-border);
  box-shadow: var(--mosaic-shadow-md);
}

.mosaic-combobox__option {
  padding: var(--mosaic-spacing-sm) var(--mosaic-spacing-md);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.mosaic-combobox__option--active,
.mosaic-combobox__option:hover {
  background-color: var(--mosaic-color-surface-hover);
}

.mosaic-combobox__option--selected {
  font-weight: 600;
}

.mosaic-combobox__option--disabled {
  color: var(--mosaic-color-text-muted);
  cursor: not-allowed;
}

.mosaic-combobox__empty {
  padding: var(--mosaic-spacing-md);
  text-align: center;
  color: var(--mosaic-color-text-muted);
}

.mosaic-context-menu {
  position: fixed;
  z-index: 950;
  min-width: 12rem;
  background: var(--mosaic-color-surface);
  border: var(--mosaic-border-width) solid var(--mosaic-color-border);
  border-radius: var(--mosaic-radius-md);
  box-shadow: var(--mosaic-shadow-lg);
  padding: var(--mosaic-spacing-xs);
  display: flex;
  flex-direction: column;
}

.mosaic-context-menu__item {
  width: 100%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--mosaic-spacing-sm);
  padding: var(--mosaic-spacing-sm) var(--mosaic-spacing-md);
  border-radius: var(--mosaic-radius-sm);
  cursor: pointer;
  color: var(--mosaic-color-text);
}

.mosaic-context-menu__item--active,
.mosaic-context-menu__item:not([disabled]):hover {
  background-color: var(--mosaic-color-surface-hover);
}

.mosaic-context-menu__item[disabled],
.mosaic-context-menu__item[data-disabled="true"] {
  color: var(--mosaic-color-text-muted);
  cursor: not-allowed;
}

.mosaic-context-menu__separator {
  height: 1px;
  margin: var(--mosaic-spacing-xs) 0;
  background-color: var(--mosaic-color-border);
}

.mosaic-context-menu__shortcut {
  font-size: var(--mosaic-text-size-sm);
  color: var(--mosaic-color-text-muted);
}

.mosaic-toast-viewport {
  position: fixed;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  gap: var(--mosaic-spacing-sm);
  padding: var(--mosaic-spacing-sm);
  width: min(24rem, 100vw);
}

.mosaic-toast-viewport[data-placement="top-left"] {
  top: 0;
  left: 0;
}

.mosaic-toast-viewport[data-placement="top-right"] {
  top: 0;
  right: 0;
}

.mosaic-toast-viewport[data-placement="bottom-left"] {
  bottom: 0;
  left: 0;
}

.mosaic-toast-viewport[data-placement="bottom-right"] {
  bottom: 0;
  right: 0;
}

.mosaic-toast {
  background-color: var(--mosaic-color-surface);
  color: var(--mosaic-color-text);
  border-radius: var(--mosaic-radius-md);
  border: var(--mosaic-border-width) solid var(--mosaic-color-border);
  box-shadow: var(--mosaic-shadow-md);
  padding: var(--mosaic-spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--mosaic-spacing-sm);
}

.mosaic-toast--success {
  border-color: var(--mosaic-color-success);
}

.mosaic-toast--warning {
  border-color: var(--mosaic-color-warning);
}

.mosaic-toast--danger {
  border-color: var(--mosaic-color-danger);
}

.mosaic-toast--primary {
  border-color: var(--mosaic-color-primary);
}

.mosaic-toast__body {
  display: flex;
  justify-content: space-between;
  gap: var(--mosaic-spacing-sm);
}

.mosaic-toast__content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mosaic-toast__title {
  font-weight: 600;
}

.mosaic-toast__description {
  font-size: var(--mosaic-text-size-sm);
  color: var(--mosaic-color-text-muted);
}

.mosaic-toast__actions {
  display: flex;
  align-items: center;
  gap: var(--mosaic-spacing-xs);
}

.mosaic-toast__action,
.mosaic-toast__close {
  border: none;
  background: transparent;
  color: var(--mosaic-color-text);
  cursor: pointer;
  font-weight: 600;
}

.mosaic-toast__action:hover,
.mosaic-toast__close:hover,
.mosaic-toast__action:focus-visible,
.mosaic-toast__close:focus-visible {
  color: var(--mosaic-color-primary);
}

.mosaic-pagination {
  display: flex;
  align-items: center;
  gap: var(--mosaic-spacing-sm);
}

.mosaic-pagination__list {
  display: flex;
  gap: var(--mosaic-spacing-xs);
  list-style: none;
  margin: 0;
  padding: 0;
}

.mosaic-pagination__ellipsis {
  padding: 0 var(--mosaic-spacing-sm);
  color: var(--mosaic-color-text-muted);
  align-self: center;
}

.mosaic-table-container {
  width: 100%;
  overflow-x: auto;
  border-radius: var(--mosaic-radius-lg);
  border: var(--mosaic-border-width) solid var(--mosaic-color-border);
}

.mosaic-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: var(--mosaic-color-surface);
}

.mosaic-table__caption {
  text-align: left;
  padding: var(--mosaic-spacing-md);
  font-weight: 600;
}

.mosaic-table th,
.mosaic-table td {
  padding: var(--mosaic-spacing-sm) var(--mosaic-spacing-md);
  border-bottom: var(--mosaic-border-width) solid var(--mosaic-color-border);
}

.mosaic-table__header {
  text-align: left;
  background-color: var(--mosaic-color-surface-hover);
  font-size: var(--mosaic-text-size-sm);
  color: var(--mosaic-color-text-subtle);
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 1;
}

.mosaic-table__header--center,
.mosaic-table__cell--center {
  text-align: center;
}

.mosaic-table__header--right,
.mosaic-table__cell--right {
  text-align: right;
}

.mosaic-table__sort {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--mosaic-spacing-xs);
  background: transparent;
  border: none;
  padding: 0;
  color: inherit;
  cursor: pointer;
  font: inherit;
}

.mosaic-table__sort-indicator {
  font-size: var(--mosaic-text-size-sm);
}

.mosaic-table__cell {
  font-size: var(--mosaic-text-size-sm);
}

.mosaic-table__empty {
  text-align: center;
  padding: var(--mosaic-spacing-lg);
  color: var(--mosaic-color-text-muted);
}
`;
