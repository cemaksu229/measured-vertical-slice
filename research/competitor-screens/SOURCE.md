# GoTall - Height Predictor: competitor screens (source notes)

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
1. `01.png` - undefined
2. `02.png` - undefined
3. `03.png` - undefined
4. `04.png` - undefined
5. `05.png` - undefined
6. `06.png` - undefined
7. `07.png` - undefined
8. `08.png` - undefined
9. `09.png` - undefined
10. `10.png` - undefined
11. `11.png` - undefined
12. `12.png` - undefined
13. `13.png` - undefined
14. `14.png` - undefined
15. `15.png` - undefined
16. `16.png` - undefined
17. `17.png` - undefined
18. `18.png` - undefined
19. `19.png` - undefined
20. `20.png` - undefined
21. `21.png` - undefined
22. `22.png` - undefined
23. `23.png` - undefined
24. `24.png` - undefined
25. `25.png` - undefined
26. `26.png` - undefined
27. `27.png` - undefined
28. `28.png` - undefined
29. `29.png` - undefined
30. `30.png` - undefined
31. `31.png` - undefined
32. `32.png` - undefined
33. `33.png` - undefined
34. `34.png` - undefined
35. `35.png` - undefined
36. `36.png` - undefined
37. `37.png` - undefined
38. `38.png` - undefined
39. `39.png` - undefined
40. `40.png` - undefined
41. `41.png` - undefined
42. `42.png` - undefined VISIBLE TEXT: "Reveal My Results" button; results teaser (locked).
43. `43.png` - undefined Results teaser behind paywall: locked growth graph, "See My Potential" button.
44. `44.png` - undefined PAYWALL (plan picker). Verbatim (blurred, legible): "Choose your plan", 5 stars + testimonial, "Special offer enabled" toggle ON, countdown chip "2:59:59" above the Yearly card, "Yearly Plan  $0.67/week" ("1800 parents joined today"), "Weekly plan  $5.99/week", button "Start my journey today", "Billed as $34.99 per year". Note: the countdown reads 2:59:59 (a 3-HOUR-format timer, not 3 minutes) in this capture.

paywall.png = copy of 44.png (plan-picker paywall).

## Additional paywall variants (shown later in ScreensDesign flow, after onboarding/dashboard tutorial)
- `paywall-flow/pw59.png` - undefined
- `paywall-flow/pw60.png` - undefined
- `paywall-flow/pw61.png` - undefined
- `paywall-flow/pw62.png` - undefined
- `paywall-flow/pw63.png` - undefined
- pw59 verbatim: "We want you to try GoTall for free." / "Unlock Your Max Potential" / "No Payment Due Now" / button "Try for $0.00".
- pw61 verbatim: "Start your FREE 3-Day trial to continue." Timeline: "Today", "In 2 Days - Reminder", "In 3 Days - Billing Starts"; button "Start Free Trial"; "No Payment Due Now"; fine print "3 days free, then ... per year" (amount unreadable in blurred image).

## App Store marketing images (`appstore/`)
Files 01-10 are iPhone screenshots (1242x2688); 11-18 are iPad screenshots (1290x1720). These are marketing, not onboarding.

Helper scripts: design/tools/competitor/ (fetch.mjs, convert.mjs, md.mjs; cached raw/ and html).
