# AGENTS Guidelines

These instructions apply to all files in this repository.

## Accessibility First
- Treat accessibility as a release blocker. Every change should be evaluated against WCAG 2.0, 2.1, and 2.2 success criteria.
- Provide semantic HTML structure, meaningful ARIA attributes only when necessary, and ensure that interactive controls are fully operable with keyboard and assistive technologies.
- Avoid color-only communication. Maintain sufficient contrast ratios and offer alternatives for sensory or motion-dependent cues. Provide motion reduction fallbacks when animations are unavoidable.

## Design Tokens & Visuals
- Prefer reusable, ergonomic design tokens (e.g., for color, spacing, typography, and motion). Centralize tokens rather than scattering hard-coded values.
- Aim for clean, crisp visuals with balanced spacing and a consistent visual hierarchy that supports readability.

## Implementation Practices
- Favor minimal code surface. Stick to React and TypeScript primitives; avoid adding dependencies unless absolutely necessary and justified.
- Keep components small, composable, and easy to test. Reuse existing utilities and patterns instead of duplicating logic.
- Document any accessibility considerations, token updates, or design decisions directly in code comments or accompanying docs when clarity is needed.

## Quality Checks
- Before submitting work, verify linting, tests, and accessibility validations relevant to the change.

