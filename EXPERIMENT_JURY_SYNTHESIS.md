# Landing Page Experiment Jury Synthesis

Branch: `experiment/landing-page-candidates`

Shared brief: `MARKETING_FEATURE_BRIEF.md`

Testable candidate pages:

- `experiments/candidate-full-nap.html`
- `experiments/candidate-sleep-start.html`
- `experiments/candidate-no-wearable.html`
- `experiments/candidate-rest-ledger.html`
- `experiments/candidate-trustworthy-tester.html`

## Jury Personas

### 1. Sleep-Deprived Parent

Wants: reliable short rest, no accidental oversleeping, low cognitive load.

Most persuaded by:

- Full Nap Mode
- Sleep-Start Alarm
- Trustworthy Tester

Concern:

- Insights-heavy copy can feel like homework when the user just needs rest.

### 2. Student / Exam Prep User

Wants: quick recharge between study blocks, free access, simple instructions.

Most persuaded by:

- Full Nap Mode
- No Wearable
- Trustworthy Tester

Concern:

- Paid/free differences must not feel like a trap.

### 3. Shift Worker

Wants: bounded rest windows, reliability, confidence that the alarm fires.

Most persuaded by:

- Sleep-Start Alarm
- Full Nap Mode
- No Wearable

Concern:

- Any "smart" alarm must clearly explain the hard deadline.

### 4. Privacy-Conscious Android User

Wants: clear data boundaries, no account, no microphone/location, paid option.

Most persuaded by:

- Trustworthy Tester
- No Wearable
- Rest Ledger

Concern:

- "Anonymous data donation" must be explained before the first CTA or immediately after it for free testing traffic.

### 5. Growth / Conversion Reviewer

Wants: clear first screen, distinct CTA, low-friction tester path, measurable hypothesis.

Most persuaded by:

- Sleep-Start Alarm
- Full Nap Mode
- Trustworthy Tester

Concern:

- Rest Ledger may convert a more thoughtful audience but could dilute the unique nap-timer hook above the fold.

## Scorecard

Scores are 1-5, where 5 is strongest.

| Candidate | Clarity | Trust | CTA Fit | Distinctiveness | Tester Conversion | Long-Term Positioning | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| Sleep-Start Alarm | 5 | 4 | 5 | 5 | 5 | 4 | 28 |
| Full Nap Mode | 5 | 4 | 5 | 4 | 5 | 4 | 27 |
| Trustworthy Tester | 4 | 5 | 5 | 4 | 5 | 3 | 26 |
| No Wearable | 4 | 5 | 4 | 4 | 4 | 4 | 25 |
| Rest Ledger | 3 | 4 | 3 | 4 | 3 | 5 | 22 |

## Final 5 Candidates

These are the five candidates worth testing. They are not ranked as "best to worst" for all uses; each has a specific job.

### Candidate A: Sleep-Start Alarm

Best use:

- Primary public landing page test.
- Play Store traffic.
- Search / ASO-aligned traffic.

Hypothesis:

- The clearest statement of Naptime's unique mechanism converts best: "The alarm that starts after you fall asleep."

Recommended primary metric:

- Play Store / early-access CTA click-through rate.

Why keep it:

- It is the simplest explanation of the product.
- It makes the difference from a normal timer obvious.
- It works for both paid and free.

### Candidate B: Full Nap Mode

Best use:

- Productivity, student, parent, and shift-work audiences.
- Reddit/community posts focused on "I set 20 minutes but only slept 5."

Hypothesis:

- Outcome-led copy converts users who immediately recognize the frustration of losing nap time while falling asleep.

Recommended primary metric:

- Hero CTA click rate and scroll depth to "hard deadline."

Why keep it:

- It sells the user benefit, not the mechanism.
- It handles the emotional frustration well.

### Candidate C: Trustworthy Free Tester

Best use:

- Closed testing recruitment page.
- Reddit tester exchange traffic.
- Upwork tester instructions.
- Any traffic where users may worry about data donation.

Hypothesis:

- Putting the free data model and tester ask up front increases qualified opt-ins and reduces privacy-related drop-off.

Recommended primary metric:

- Completed early-access flow, not just page CTA clicks.

Why keep it:

- The free flavor is currently in closed testing.
- It directly addresses the near-term business need: 12 testers / 14 days.

### Candidate D: No Wearable

Best use:

- Fitness/sleep audiences comparing wearables.
- Users curious about sleep tracking but not ready to buy hardware.
- Paid ads or posts with "no wearable" angle.

Hypothesis:

- "No watch, ring, account, or microphone" reduces setup friction and trust anxiety.

Recommended primary metric:

- CTA rate from Android visitors and privacy-section CTA recovery.

Why keep it:

- It creates a strong hardware-free contrast.
- It pairs well with privacy and simplicity messaging.

### Candidate E: Rest Ledger

Best use:

- Later lifecycle positioning after tester acquisition.
- Email drip landing page.
- Users interested in sleep habits and long-term insights.

Hypothesis:

- Users who already care about sleep patterns may convert better when Naptime is framed as nap plus night sleep insight, not only an alarm.

Recommended primary metric:

- Email signup, scroll depth, and repeat page visits.

Why keep it:

- It broadens Naptime beyond one nap feature.
- It may support retention and paid conversion better than immediate closed-test acquisition.

## Recommended Test Order

1. Test **Trustworthy Free Tester** against the current `early-access.html` for closed-test recruitment.
2. Test **Sleep-Start Alarm** against the current `free.html` hero.
3. Test **Full Nap Mode** against Sleep-Start Alarm for community traffic.
4. Test **No Wearable** for fitness/sleep hardware-adjacent audiences.
5. Hold **Rest Ledger** for email/drip or post-launch retention-oriented campaigns.

## Tracking Events To Add Later

- `candidate_view`
- `hero_cta_click`
- `early_access_click`
- `play_store_click`
- `privacy_link_click`
- `tester_group_click`
- `instructions_step_click`
- `email_signup_submit`

Recommended event properties:

- `candidate`
- `traffic_source`
- `cta_location`
- `flavor`
- `is_android`

## Implementation Notes

- The current experiment pages are standalone static HTML files under `experiments/`.
- They intentionally do not edit `_template.html`, `index.html`, or `free.html`.
- If one candidate is selected for production, adapt the winning copy into `_template.html` and run `node build.js`.
- Keep the paid/free privacy distinction intact when moving copy into the generated template.
