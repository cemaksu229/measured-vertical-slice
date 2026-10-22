import fs from 'fs';
const m=JSON.parse(fs.readFileSync('meta.json'));
const o={};
o[42]=' VISIBLE TEXT: "Reveal My Results" button; results teaser (locked).';
o[43]=' Results teaser behind paywall: locked growth graph, "See My Potential" button.';
o[44]=' PAYWALL (plan picker). Verbatim (blurred, legible): "Choose your plan", 5 stars + testimonial, "Special offer enabled" toggle ON, countdown chip "2:59:59" above the Yearly card, "Yearly Plan  $0.67/week" ("1800 parents joined today"), "Weekly plan  $5.99/week", button "Start my journey today", "Billed as $34.99 per year". Note: the countdown reads 2:59:59 (a 3-HOUR-format timer, not 3 minutes) in this capture.';
let L=m.slice(0,44).map((x,i)=>`${i+1}. \`${String(i+1).padStart(2,'0')}.png\` - ${x.alt}${o[i+1]||''}`).join('\n');
let P=[59,60,61,62,63].map(i=>`- \`paywall-flow/pw${i}.png\` - ${m[i].alt}`).join('\n');
fs.writeFileSync('../../../research/competitor-screens/SOURCE.md',`# GoTall - Height Predictor: competitor screens (source notes)

- App: GoTall - Height Predictor, Grow Labs LLC (App Store id6747467975). App Store page shows latest version 16.1.0 (history 14, 14.1 ...).
- Fetch date: 2026-10-22
- Source 1 (onboarding): https://screensdesign.com/apps/gotall-height-predictor/ - page lists "170 Screens", developer shown there as "Super Viral Studio" (differs from App Store "Grow Labs LLC"; same App Store id link), released Jun 25, 2025. Screens were downloaded directly as <img> URLs (media.screensdesign.com/avs-pp-640 and avs-pr-640, WebP, 640x1384) and converted to PNG. No screenshotting/cropping was needed.
- Source 2 (marketing): https://apps.apple.com/us/app/id6747467975 - mzstatic.com screenshot URLs fetched at 1290x2796 request.
- **ScreensDesign watermark present** on every onboarding image (top-left "screensdesign" logo). Screens are low resolution (640 px wide) and the paywall images are visibly blurred/gated by ScreensDesign (no bypass attempted); small text (e.g. fine print) is hard to read.
- Captured version is from ScreensDesign's recording (older than current App Store 16.1.0); flow may differ today.

## Gated / missing
- Full-resolution, unblurred images and the 15:10 walkthrough video are behind ScreensDesign's "Get full access"; only the public blurred 640 px stills were used.
- ScreensDesign counts ~31 onboarding steps in its chapter list; the page exposes 44 stills before/including the paywall because it keeps pre-chapter screens (splash, ATT prompt, 6 carousel frames, modal states, duplicates by state). Exact duplicates were skipped. A 3-minute countdown was NOT found in the stills; the paywall shows "2:59:59" (3 hours), and the post-paywall dashboard (screen index 64-65 on the page, not saved) is described as having "a countdown timer".
- The "Reveal" is gated: the results screen (42-43) is shown locked before paywall (44).
- Post-paywall in-app screens (about 120 more on the page) were not saved (out of scope: onboarding).

## Onboarding screens (flow order)
${L}

paywall.png = copy of 44.png (plan-picker paywall).

## Additional paywall variants (shown later in ScreensDesign flow, after onboarding/dashboard tutorial)
${P}
- pw59 verbatim: "We want you to try GoTall for free." / "Unlock Your Max Potential" / "No Payment Due Now" / button "Try for $0.00".
- pw61 verbatim: "Start your FREE 3-Day trial to continue." Timeline: "Today", "In 2 Days - Reminder", "In 3 Days - Billing Starts"; button "Start Free Trial"; "No Payment Due Now"; fine print "3 days free, then ... per year" (amount unreadable in blurred image).

## App Store marketing images (\`appstore/\`)
Files 01-10 are iPhone screenshots (1242x2688); 11-18 are iPad screenshots (1290x1720). These are marketing, not onboarding.

Helper scripts: design/tools/competitor/ (fetch.mjs, convert.mjs, md.mjs; cached raw/ and html).
`);
