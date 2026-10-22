# GoTall moodboard references (research, 2026-10-22)

Verification key: **[F]** = page fetched and read OK; **[S]** = URL returned by search engine (exists, content not opened by me); **[U]** = unverified / from memory. I could not view screenshot images, so "borrow" lines are based on page text and descriptions. Open each link and look before locking it in.

## PART 1 - References (21)

### Promise / hero
1. **Taller - Maximize your height** (closest competitor, height predictor). https://screensdesign.com/showcase/taller-maximize-your-height [F] - Promise + quiz + loading + locked report + paywall. Borrow: 16-step quiz incl. parents' height, "98.5% accuracy" trust stat mid-flow, "Building your plan" step. Avoid: hard paywall with no trial, weekly plan pushed.
2. **Finch** (self-care pet app). https://screensdesign.com/articles/finch-app-onboarding-design/ [S] - Promise/character pick. Borrow: friendly mascot-led onboarding that still feels credible; one decision per screen.
3. **Calm** onboarding. https://screensdesign.com/explore/apps/calm/onboarding/ [S] - Promise/interstitials. Borrow: full-bleed calm imagery + big serif-ish headline, minimal chrome.
4. **I Am** onboarding + paywall. https://screensdesign.com/explore/apps/i-am/onboarding/ and https://screensdesign.com/explore/apps/i-am/paywall/ [S] - Promise + paywall. Borrow: typographic hero with a single CTA.
5. **Headspace onboarding flow**. https://app.lazyweb.com/flow/headspace/onboarding [S] - Promise/goal (multi-select goals). Borrow: let user pick several goals; illustration style with flat shapes.

### Quiz inputs (height / number pickers / sliders)
6. **Height picker bottom sheet (cm / ft-in toggle, horizontal ruler)**. https://kombai.com/gallery/inspirations/slider-ios-27/ [S] - Quiz input. Borrow: cream sheet, rust tick marks, segmented unit control, big cm readout - directly reusable pattern for the height step.
7. **RISE: Sleep Tracker**. https://screensdesign.com/apps/rise-sleep-tracker/ [S] - Quiz (scannable timeline for wake time). Borrow: timeline/scrubber input instead of text fields.
8. **Calm Sleep - Rest & Relax**. https://screensdesign.com/apps/calm-sleep-rest-relax/ [S] - Quiz. Borrow: full-day timeline picker after a one-line "why we ask".
9. **Sleepiest**. https://screensdesign.com/apps/sleepiest-sleep-sounds-app/ [S] - Quiz. Borrow: computed result (duration) appears live as you adjust the input.
10. **BetterSleep**. https://screensdesign.com/apps/bettersleep-relax-and-sleep/ [S] - Quiz. Borrow: "why we ask" copy + visible "Not now" (credible, honest).
11. **Taller's circular slider for sleep hours** (see #1) [F] - Borrow: circular dial for habit inputs.

### Loading / "building your plan"
12. **The Wonder Weeks** (loading screen for personalised leap chart, then paywall). https://screensdesign.com/showcase/the-wonder-weeks-baby-leaps [S] - Loading + plan. Borrow: loading that names real inputs ("using Mia's birth date...") before a chart appears.
13. **Cal AI** (123 A/B tests, 25+ onboarding cards, tailored program locked behind trial). https://superwall.com/case-studies/cal-ai [S]; teardown https://adapty.io/blog/how-to-personalize-onboarding-and-paywalls-in-your-mobile-app/ [S] - Loading/plan/paywall. Borrow: interleave questions with research-backed stat cards; progress-checklist loader.

### Result reveal & charts
14. **Glow Baby Tracker & Growth App** (weight/height/head growth). https://screensdesign.com/showcase/glow-baby-tracker-growth-app [S] - Plan/in-app growth. Borrow: percentile growth-curve visual for kids (your chart should look like a paediatric growth chart, softened).
15. **Huckleberry** (Growth section). https://screensdesign.com/showcase/huckleberry-baby-child [S] - Result/in-app. Borrow: calm data cards on neutral background, one accent colour.
16. **Kinedu: Baby Development**. https://screensdesign.com/showcase/kinedu-baby-development [S] - Plan. Borrow: personalised plan framed as weekly milestones (maps to GoTall habit plan).
17. **Bevel: AI Health Coach**. https://screensdesign.com/apps/bevel-health-performance/ [S] - Result/plan. Borrow: ring/score dashboards, dark-on-light premium health feel.
18. **Noom** (317 screens; ~100+ step quiz). https://screensdesign.com/apps/noom-weight-loss-food-tracker/ [S] - Quiz/plan/paywall. Borrow: "your predicted date / outcome" graph reveal pattern; study pacing, not length.

### Paywall
19. **Calm paywall**. https://screensdesign.com/explore/apps/calm/paywall/ [S] - Borrow: benefit list over hero art, clear trial timeline.
20. **silBe paywall** (3 plans, best-value yearly tag). https://screensdesign.com/apps/silbe-fitness-for-her/ [S] - Borrow: hero image + 3 plan rows with one highlighted.
21. **Yazio / Fabulous paywall reviews** (dated goal outline, testimonial, personalised first name). https://adapty.io/blog/markdown/mobile-paywall-newsletter-9.md and https://adapty.io/blog/markdown/mobile-paywall-newsletter-10.md [S] - Borrow: "your goal by <date>" recap on the paywall; testimonial. Honest-paywall extras: free-trial toggle as in Glow (#14), trial-reminder note, visible close button.

### Overall style direction (market context)
- Paywall placement study: 77.5% of first paywalls sit in the last third of onboarding; plan-reveal/summary screen right before it is the common exception (small sample, directional). https://lazylanding-labs.onrender.com/research/what-screen-comes-right-before-the-onboarding-paywall.md [S]
- Browse more: https://screensdesign.com/showcase (2,400+ apps) [S]; sleep-app onboarding roundup https://screensdesign.com/articles/sleep-app-onboarding-examples/ [F]; baby growth category https://screensdesign.com/categories/baby-growth-milestone-apps/ [S].
- Gap: Mobbin, Pageflows, Dribbble gave no usable direct hits (login-walled / listing pages only). No verified Dribbble height-ruler shot.

## PART 2 - Style directions

### A. "Clinic Warm" (credible-friendly, paediatric-growth-chart feel)
- Brand `#0E6B5C` (deep green-teal) / accent `#FF7A59` (coral) / neutrals `#FBF7EF` cream, `#EAE3D3` sand, `#1C2A28` ink, `#6B7773` mute.
- Type: **Fraunces** (display, soft serif, Google Fonts) + **Figtree** (UI, Google Fonts).
- Imagery: flat paper-cut people silhouettes at different heights, soft grain, hand-drawn growth curve with a coral "you" dot; optional claymation-style 3D height figure for the result.
- Icons: **Phosphor** (duotone/regular).
- Justified by: #6 (cream sheet + tick ruler), #14 Glow, #15 Huckleberry, #3 Calm.

### B. "Bold Measure" (big-number, ruler-tick, sporty)
- Brand `#FF5A1F` (tangerine) / accent `#C6F25B` (lime) / neutrals `#F4F2EC` off-white, `#14161A` charcoal, `#8B8E93` grey.
- Type: **Clash Display** + **General Sans** (both Fontshare) - or fallback Bricolage Grotesque + DM Sans (Google Fonts).
- Imagery: huge tabular numerals for predicted height, ruler-tick pattern as a brand motif, chunky 3D/isometric height figures; dark charcoal result screen for contrast.
- Icons: **Lucide** (2px stroke) or Phosphor bold.
- Justified by: #1 Taller (competitor to out-design), #17 Bevel, #18 Noom reveal graph, #6 ruler.

## PART 3 - Tool stack (one-day sprint)

Licences/pricing from memory unless marked; confirm on site.

| Job | Pick | Why / licence |
|---|---|---|
| Screen design | **Figma** (free Starter); alt **Penpot** (open source) | Auto layout, community UI kits. Figma free = 3 files limit [U]; Penpot MPL-2.0 [U] |
| Illustration / imagery | **Recraft** free tier (consistent style presets, vector export); alt **Ideogram** / Leonardo free credits | Lock one style preset for consistency. Free tiers usually restrict commercial use - check; fine for coursework [U] |
| 3D | **Spline** (free tier, browser) ; alt **Blender** (GPL, free) | Spline for fast chunky figures + export PNG/video; Blender for full control [U] |
| Motion | **LottieFiles** (free animations) ; **Rive** community files | LottieFiles Lottie Simple License (free, commercial OK per page text) ; Rive community mostly CC BY (attribute) [S] |
| Icons | **Phosphor** (MIT) ; **Lucide** (ISC) | Free, commercial OK [U] |
| Type | **Google Fonts** (OFL) ; **Fontshare** (free ITF licence) | Both free for commercial use [U] |
| App Store screenshots | **Figma** frames at 1290x2796 + free device-mockup plugins; alt AppMockUp / Previewed free tiers | Zero extra tool = fastest [U] |

### Specific free animations (all [F] fetched listing pages; open each and check preview)
- Height Measure Tape (Pedro Caluzni): https://lottiefiles.com/free-animation/height-measure-tape-jI04LDoi7B
- Height category (5 items): https://lottiefiles.com/free-animations/height
- Ruler category: https://lottiefiles.com/free-animations/level-ruler [S] ; measuring: https://lottiefiles.com/free-animations/measuring [S] ; single ruler icon: https://lottiefiles.com/fr/free-animation/ruler-icon-MWJ0HWYV7g [S]
- Growth chart: https://lottiefiles.com/free-animation/growth-chart-V7KcVfanz8 ; https://lottiefiles.com/free-animation/chart-grow-up-l1Isfes1Sh ; https://lottiefiles.com/free-animation/line-graph-5zVwwfFVK0
- Growth metrics category (58): https://lottiefiles.com/free-animations/growth-metrics [S]
- Success: https://lottiefiles.com/free-animation/interactive-check-mark-a0Fb0wRg5z [S] ; https://lottiefiles.com/fr/free-animation/success-271zzksTuO [S] ; category https://lottiefiles.com/free-animations/success-tick-mark [S]
- Loading (preloader): https://lottiefiles.com/free-animation/microinteractions-preloader-18-IwTureqZ4d [F listing]
- Rive loading: https://rive.app/community/files/18891-35528-loading-bar-animation (marketplace path: https://rive.app/marketplace/18891-35528-loading-bar-animation) [S]; chart widget https://rive.app/community/files/15091-28446-chart-widget-animation [S] (CC BY)
- Not found: a ready-made growing-plant or child-height-growth Lottie; plan on building the growth curve draw-on animation yourself (SVG stroke-dashoffset or Rive).
