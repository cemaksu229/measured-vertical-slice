# Notes on what changed (brief step 7)

> **Source of these notes:** an internal design review and QA audit of the built slice (22 Oct 2026), not user testing. Findings with file references are in `research/qa-report.md`. Add the results of real user tests in the last section.

## Internal review → changes

| What we found | Why it mattered | What we changed |
|---|---|---|
| Plan screen headline was a 40-word paragraph with decimals ("167.4–184.4 cm") | Unreadable; looked machine-generated | Short goal-based headline ("Reach the top of your range") + one-line summary of the user's answers; ranges rounded |
| Promise numeral truncated to "1… cm" on 360 dp Android phones | First screen the teacher sees | Width-responsive size + fit-to-width |
| App still named "VerticalSlice" with the stock Expo icon and a blank splash | Fails "own name, logo and visuals" | Measured brand: icon, Android adaptive icon, splash, favicon |
| Opening the result from Home showed the onboarding progress bar and sent users back through the quiz | Dead-end feeling after onboarding | Reveal and paywall opened from Home behave as standalone screens |
| Choosing Weekly hid the cancel instructions; cancel path said "Apple ID" on Android | Paywall honesty | Cancel path always visible and platform-specific |
| Parent path still said "you" on Habits, the plan summary and the paywall | Personalisation broke on the second path | "Your child" wording throughout |
| "How we calculate this" always said ±8.5 cm, even when the range was ±10.5/±12 cm | Contradicted the honest range | Text uses the actual range for unknown parents / completed growth |
| Habits screen had no visual | Brief: every screen needs a real visual | Range band visual added |
| Ruler re-rendered ~120 ticks on every drag frame | Possible stutter on mid-range Android | Static tick layer; only the indicator moves |
| Paywall had a "Placeholder review" card with placeholder text | Looked unfinished; against "no placeholder text" | Removed; no reviews or ratings shown at all |
| Our research said GoTall uses a "3-minute countdown" | Checking the actual paywall still showed "2:59:59" | Corrected everywhere to a "Special offer" countdown (2:59:59) |

## User tests (to be added by the team)
| Who (role, age group) | What confused them | What we changed |
|---|---|---|
| | | |
