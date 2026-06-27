# Paid Landing Page Experiment Jury Synthesis

Branch: `experiment/landing-page-candidates`

Shared brief: `MARKETING_FEATURE_BRIEF.md`

Paid candidate pages:

- `experiments/paid/candidate-private-nap-alarm.html`
- `experiments/paid/candidate-paid-private-nap.html`
- `experiments/paid/candidate-quiet-nap.html`
- `experiments/paid/candidate-private-rest-notes.html`
- `experiments/paid/candidate-private-rest-log.html`

## Paid Page Context

The paid app is launched in selected countries under package `com.naptime.app`.

Paid-page promise:

> True-duration naps, paid once, with all session data kept on-device.

Paid pages should not recruit closed testers. They should sell the launched paid app.

## Jury Personas

### 1. Privacy-Conscious Buyer

Wants: no account, no uploads, clear paid/free distinction.

Most persuaded by:

- Private Nap Alarm
- Private Rest Log
- Private Rest Notes

Concern:

- The privacy promise must appear above the fold, not buried in a policy section.

### 2. Busy Professional / Founder

Wants: fast, bounded recovery without overthinking sleep.

Most persuaded by:

- Paid Private Nap
- Private Nap Alarm
- Quiet Nap, Clear Data

Concern:

- Sleep-history sections should not make the app feel like a dashboard chore.

### 3. Parent / Shift Worker

Wants: reliable alarms and hard deadlines.

Most persuaded by:

- Paid Private Nap
- Private Nap Alarm
- Private Rest Log

Concern:

- The latest wake-up cutoff must be prominent.

### 4. Sleep Tracker Skeptic

Wants: useful timing without a broad sleep suite, wearable, or audio ritual.

Most persuaded by:

- Quiet Nap, Clear Data
- Private Rest Notes
- Private Nap Alarm

Concern:

- Avoid sounding like a smaller Sleep as Android or Pzizz.

### 5. Conversion Reviewer

Wants: one clear paid reason to click the Play Store.

Most persuaded by:

- Private Nap Alarm
- Paid Private Nap
- Private Rest Log

Concern:

- Combining too many messages can dilute conversion. Lead with one: private smart nap alarm.

## Scorecard

Scores are 1-5, where 5 is strongest.

| Candidate | Paid Value Clarity | Privacy Trust | Nap Hook | CTA Fit | Distinctiveness | Total |
|---|---:|---:|---:|---:|---:|---:|
| Private Nap Alarm | 5 | 5 | 5 | 5 | 5 | 25 |
| Paid Private Nap | 5 | 4 | 5 | 5 | 4 | 23 |
| Private Rest Log | 4 | 5 | 4 | 5 | 4 | 22 |
| Quiet Nap, Clear Data | 4 | 5 | 4 | 4 | 4 | 21 |
| Private Rest Notes | 4 | 5 | 3 | 4 | 4 | 20 |

## Final 5 Paid Candidates

### Candidate A: Private Nap Alarm

Best use:

- Primary paid landing-page test.
- General paid Play Store traffic.
- Privacy-sensitive Android users.

Hypothesis:

- The simplest paid framing converts best: Naptime is the private smart nap alarm.

Primary metric:

- Paid Play Store CTA click-through rate.

Why keep it:

- It combines the nap hook and privacy promise without overexplaining.
- It cleanly differentiates paid from free.
- It does not drift into broad sleep-suite territory.

### Candidate B: Paid Private Nap

Best use:

- Outcome-led community or search traffic.
- Users already frustrated by normal nap timers.

Hypothesis:

- "Get the full nap you paid for" makes the paid value concrete and memorable.

Primary metric:

- Hero CTA click-through and bounce rate.

Why keep it:

- It makes the user's purchase feel tied to a specific benefit: protected sleep time.
- It is emotionally sharper than a neutral privacy message.

### Candidate C: Private Rest Log

Best use:

- Paid users who want both naps and local history.
- Landing pages for privacy-first sleep tracking.

Hypothesis:

- "Paid once and kept private" increases conversion among people who dislike subscriptions and cloud sleep profiles.

Primary metric:

- Play Store clicks after privacy/on-device section.

Why keep it:

- It has a strong purchase model story.
- It supports paid conversion beyond only the nap-timer hook.

### Candidate D: Quiet Nap, Clear Data

Best use:

- Traffic comparing Naptime to complex sleep trackers.
- Users put off by dashboards, accounts, and wearable ecosystems.

Hypothesis:

- A calm, less-is-more framing reduces friction for people who want useful sleep timing without a sleep suite.

Primary metric:

- CTA clicks from visitors who scroll past the comparison section.

Why keep it:

- It is the best anti-complexity candidate.
- It protects against sounding like Sleep as Android.

### Candidate E: Private Rest Notes

Best use:

- Later retention/education page or email drip landing page.
- Users interested in sleep patterns and tags.

Hypothesis:

- "Sleep insights without an account or wearable" appeals to habit experimenters who want local notes, not cloud sleep tracking.

Primary metric:

- Scroll depth, repeat visits, and Play Store clicks after insight sections.

Why keep it:

- It is useful for a more reflective buyer segment.
- It should not be the first paid homepage test because the nap hook is slightly less immediate.

## Recommended Paid Test Order

1. Test **Private Nap Alarm** against the current paid homepage.
2. Test **Paid Private Nap** against Private Nap Alarm for outcome-led traffic.
3. Test **Private Rest Log** for privacy/subscription-averse traffic.
4. Test **Quiet Nap, Clear Data** for sleep-tracker comparison traffic.
5. Hold **Private Rest Notes** for email/drip or educational content.

## Tracking Events

Use the same event family as the free experiments, with paid-specific properties:

- `paid_candidate_view`
- `paid_hero_cta_click`
- `paid_play_store_click`
- `paid_privacy_section_view`
- `paid_privacy_cta_click`

Recommended properties:

- `candidate`
- `cta_location`
- `traffic_source`
- `country`
- `is_android`
- `positioning_angle`

## Implementation Notes

- These pages are standalone experiment files under `experiments/paid/`.
- They do not modify `_template.html`, `index.html`, or `free.html`.
- If a paid winner is selected, adapt the winning copy into `_template.html` and run `node build.js`.
- Preserve paid/free differences: paid page may promise no session uploads; free page must explain anonymous, consent-gated data donation.
