# Measured design export tools

Setup once: `cd design/tools && npm install && npx playwright install chromium`

- Everything: `npm run all` (stylesheet, then web build + screen capture, light and dark).
- Style sheet only: `npx tsx stylesheet.ts` -> `design/export/stylesheet.{html,png}` (reads `mobile/src/theme/tokens.ts`).
- Screens only: `node capture.mjs [--skip-build] [--only light|dark]` -> `design/export/screens/*.png` and `board-ours.png`.
- The web build runs from a shadow copy (`.web-src`) with `web.output = "single"`; `mobile/` is never modified.
- Seeded state lives in the `steps` / `demo` objects at the top of `capture.mjs`. `.web-dist` and `.web-src` are disposable.

## Demo deck
`npm run deck` rebuilds `deliverables/demo-deck.pptx` from `deliverables/deck/build.cjs` (uses the latest `design/export` screenshots). Fill the `[measure]` / `[x/5]` / `[Team names]` placeholders in that script, or edit the .pptx directly.
