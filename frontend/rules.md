# Frontend Agent Rules

Use these rules for UI, product, and web application work.

## Product Behavior

- Build the actual user workflow, not a placeholder landing page.
- Preserve existing navigation, state, and data-loading patterns.
- Make loading, empty, error, and success states explicit.
- Keep controls discoverable and predictable.

## Visual Design

- Match the existing design system.
- Use stable layout dimensions to prevent jumps.
- Make text fit on mobile and desktop.
- Avoid overlapping UI elements.
- Use icons for common tool actions when the project already has an icon library.
- Do not rely on color alone to communicate state.

## Accessibility

- Use semantic elements where possible.
- Add labels to interactive controls.
- Preserve keyboard navigation.
- Keep focus states visible.
- Respect reduced-motion preferences for large animations.

## Verification

- Check at least one desktop and one mobile viewport for meaningful UI changes.
- Confirm that important text does not overflow.
- Confirm that primary interactions work.
