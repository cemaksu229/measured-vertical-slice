# GoTall - Height Predictor: competitor research

## Sources
Fetch date: 2026-10-22 for all.
- Apple RSS reviews (JSON), storefronts us/gb/ca/au, pages 1-10 each, sortby=mostrecent: `https://itunes.apple.com/{cc}/rss/customerreviews/page={n}/id=6747467975/sortby=mostrecent/json`. US returned 3 non-empty pages; gb/ca/au only page 1 each. Total 150 reviews fetched.
- App Store listing (used for Part 2): https://apps.apple.com/us/app/id6747467975 and https://apps.apple.com/us/app/gotall-height-predictor/id6747467975 (**Grow Labs LLC, id6747467975** = the listing used throughout).
- Near-duplicate: https://apps.apple.com/app/id6754962274 = "Height Predictor - goTall", publisher BESTRONG STUDIOS (PRIVATE) LIMITED, 1 rating (1.0). NOT used for reviews. Also seen in search: "GoTaller" (id6753605862), a different app.
- ScreensDesign teardown: https://screensdesign.com/showcase/gotall-height-predictor
- TrustMRR: https://trustmrr.com/startup/gotall
- Stork blog (secondary, unverified): https://www.stork.ai/blog/this-students-dumb-app-makes-100kmo
- marlvel.ai versions page: 403, not fetched. Mobbin / TikTok: no GoTall content found.

## Review themes
Sample: 150 reviews fetched; **119 are 1-3 star** (us 83, ca 14, au 11, gb 11 approx.; 109 are 1 star). 30 are 5 star, 1 is 4 star. RSS returns only the most recent reviews per storefront, so this is a recent-skewed sample.
Counts are keyword-based tallies over the 119 low-star reviews and **overlap** (one review can sit in several themes); treat as approximate.

| # | Theme | Count (approx.) |
|---|---|---|
| 1 | Prediction/results locked behind paywall after long quiz ("bait and switch") | ~95 |
| 2 | Time wasted: long, personal questionnaire before any value | ~43 |
| 3 | Billing surprises: "$0.67/week" vs real charge, trial charged, cannot cancel, no refund | ~19 |
| 4 | Distrust of accuracy / contradictory output | ~13 |
| 5 | Personal data / privacy fear (incl. minors, photo request, parent height) | ~9 |
| 6 | Feature bugs & gaps (food logging, sleep score, referral reward, coach vs goal mismatch) | ~5 |

### 1. Results paywalled after quiz
- "I did the whole questionnaire and wanted to get my results but at the last second told me I had to pay" (ca, 1★)
- "Don't waste your time it will not show you anything without a payment. Bait and switch Beware!" (ca, 1★)
- "I wouldn't have rated it one star if it made me pay before I used the app, but it made me take a 15 minute survey and needed me to pay to continue." (us, 1★)
- "I get paying for the custom plan but not the prediction" (us, 1★)
- Opportunity: show a real (even coarse/range) prediction before any paywall; paywall only the plan/coach.

### 2. Time wasted
- "Tell me up front so that I don't waste my time." (us, 1★)
- "They ask you your birth your parents height and other stuff and make you take a picture of yourself" (us, 2★)
- "I dislike apps that are constructed to waste your time by making you fill out a long survey just to charge you a 'super deal'. They prey on people with a sunk cost fallacy" (gb, 2★)
- Opportunity: state "free prediction in N questions" at the start, progress bar, minimal required inputs, rest optional after the result.

### 3. Billing surprises
- "It said $0.67 per week but it really charged me $35." (us, 1★)
- "they trick you into thinking you get a free subscription and then makes you pay for a whole year which is like 55$" (us, 1★)
- "Had the app used it worked fine, got a 7 day supposedly free trial which i then canceled... I was then charged 50 dollars with no refund" (us, 1★)
- Also: "tried charging me 87 cent and later on they're tryna charge me $87 and i'm a minor" (us, 1★)
- Opportunity: show the full billed amount first, plain trial-end date + reminder, in-app cancel link, no weekly-price framing of annual plans.

### 4. Accuracy / contradictions
- "I typed in a dream height of 185cm and the app says that the probability is very low. (19%). However the coach is predicting a height of 186cm." (au, 2★)
- "it said I will be 6'4 but my parents aren't even that tall" (gb, 1★)
- "you can get the same info from chat GPT" (us, 1★)
- Opportunity: one consistent model, show uncertainty range and inputs used, "with current habits vs improved habits" comparison (explicitly requested by the au reviewer).

### 5. Privacy / sensitive inputs
- "they basically run off with the info you give them" (us, 1★)
- "Not fair how it asks me how tall my dad is when I've never met the guy" (gb, 1★)
- "The app makes you give so much personal information away to force to to subscribe" (us, 1★)
- Opportunity: allow "unknown parent" paths, explain why each input matters, no photo required, no account before value, clear data statement.

### 6. Feature bugs / gaps
- "every-time I log food, and write it down the ai just dosent identify it? It only works when I take a picture" (au, 3★)
- "What happened to the sleep score? It stopped going after week 13" (us, 3★)
- "I invited a few friends and when they joined it didn't give me anything" (us, 1★)
- Opportunity: reliable text food logging, keep streak/score features working, honour referral rewards or skip referrals.

Other noted: manipulative framing ("The costs of being short... people under 6 feet are less likely to get dates", gb, 1★ - reviewer describing the paywall copy); ad promised no paywall ("saw an ad on insta and it didnt say there was a paywall", us, 1★).

## What users love
(4-5★ reviews; many are very short/low-signal, some look like incentivised or minimal - inferred)
1. Plan/structure that tells you *how* to grow: "I knew that it's possible to grow taller but I didn't know how - this app just provided the necessary structure I needed" (us, 5★).
2. Credibility via CDC/doctor link: "they recommended me to just use this app instead since it uses the same CDC data" (us, 5★).
3. Prediction felt on point and motivating: "Height prediction was on point, excited to see if I can hit my target!" (ca, 5★); "this app gave me new hope" (us, 5★).
4. Bundle of tracking features: "it scans ur meals, predicts ur height, gives you exercises, tracks ur sleep" (ca, 5★); stretching "actually feel really good and I can feel my spine decompress" (au, 3★).
5. Visible progress/results claims: "grew 1 inch so far" (us, 5★) - self-reported, unverified.

## App Store promise & pricing
Source: https://apps.apple.com/us/app/id6747467975 (summarised by fetch tool; only short quotes verbatim).
- Name: GoTall - Height Predictor; publisher Grow Labs LLC; category Health & Fitness; Free with IAP.
- Subtitle: "#1 height predictor & maxxer"
- Rating: 4.6 / 5 from 6.8K ratings (note: the recent RSS sample is heavily 1★, so the store average likely reflects the in-app review prompt gating - inferred).
- Age rating: 9+ (listing mentions Messaging and Chat, User-Generated Content, Health or Wellness Topics).
- Description claims: "the most accurate height predictor"; uses CDC data ("GoTall uses data from the CDC, a group of top doctors and scientists who study how kids grow."); "our results are more accurate than just using a growth chart"; asks parents'/relatives' heights, sleep, food, activity, puberty stage; custom growth plan, daily exercises, nutrition analysis, lifestyle tracking; "Some features require a premium subscription"; disclaimer "GoTall doesn't offer medical advice".
- IAP list as shown: Yearly Plan $59.99; Yearly Pro $59.99; Yearly Access $59.99 / $34.99 / $9.99; Weekly Plan $4.99; Weekly Access $5.99 / $3.99 / $1.99; GoTall Access $4.99. (Listing does not state subscription vs one-time.) Reviews cite $9.99/mo, $34.99/yr, ~$50-60/yr, $5/week.
- Screenshot captions: **not obtainable** (page exposed no alt text). Gap - capture manually.
- Version notes: 11.0.1 "New growth check-ins to help keep your height prediction accurate"; 14.0.0 "Improvements to Habits, Nutrition, and Coach"; 16.1.0 "smoother Home animations and improved height-journey video sharing."
- TrustMRR: all-time revenue $907,705; last 30d $28,862; MRR $57,777; 17,588 active subs; Superwall for paywalls; founder Chenglin, founded Jul 2025; channels incl. TikTok/Meta ads, ASO; page says "Moving on to another app and cofounders separating." Value prop: "Track your height journey, predict your adult height, and build the daily habits that support healthy development."

## Known onboarding flow & paywall
Source: ScreensDesign (only primary teardown found); the page says 31 onboarding steps but does **not** list them.
Known sequence (timestamps from the teardown video):
1. 00:21-02:31 deep dive into personal data: genetics, lifestyle, habits (parent heights, age/birth date, etc. - reviewers also mention a photo request and sleep/food/puberty questions per store description).
2. 02:31 "building your plan" screen (personalisation theatre - inferred).
3. 02:57 paywall, shown *before* the result.
4. 04:10 trial timeline explainer screen before purchase confirmation.
5. 05:03 puberty quiz answers later referenced by AI Coach (post-purchase features: AI Coach, food scanning, "What if?" planner).
Paywall (ScreensDesign): 3-day free trial converting to yearly plan; yearly shown as "$0.67/week"; "3-minute countdown timer"; testimonial + star rating. Not covered: other plans, exact prices, close-button behaviour, discount offers. Reviewers mention a later "discount" offer ("A free subscription was also never offered, just a 'discount'", us, 1★) and a weekly option (~$5/wk).
Stork (secondary, unverified): paywall after quiz, before reveal; claims "91% of users who hit the app's paywall convert" (implausible; do not rely on it).
Gaps: full 31 question list, close-button behaviour, plan screen layout. Needs our own screenshots.

## Honesty issues
- Core promise ("height predictor") is withheld behind the paywall after ~15 min (one reviewer's estimate) of data entry; ad creatives reportedly show no paywall (reviews).
- Price framing: "$0.67/week" for an annual plan; multiple reviewers report being charged $35-$60 at once (reviews, anecdotal).
- Fake urgency: 3-minute countdown timer (ScreensDesign).
- Fear/status copy reportedly used ("costs of being short", reviewer gb 1★, paraphrase of paywall copy - not verified by us).
- Accuracy claims: "most accurate", "more accurate than just using a growth chart" with no published validation or error range; CDC growth charts describe population percentiles for ages 2-20, not an adult-height guarantee (inferred, general knowledge). Contradictory outputs between prediction screen and coach reported (au 2★). One teardown note: AI food analysis scored "2 boiled eggs" at "0%".
- Mixed signals on ratings: 4.6 avg on 6.8K ratings vs ~80% 1-3★ in the recent review feed; a review says "They make you send a review and then long after you have to pay" (us, 1★) suggesting a review-gate (inferred, unverified).
- Reviews from minors/parents of minors (age rating 9+) with subscription charges.
