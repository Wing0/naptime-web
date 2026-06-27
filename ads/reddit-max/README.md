# Reddit Max Creative Pack

Purpose: first paid Reddit test for Naptime Free closed testing and early paid-page learning.

Primary CTA URL:

- `https://naptime.info/early-access.html`

Tracking URL pattern:

- `https://naptime.info/early-access.html?utm_source=reddit&utm_medium=paid_social&utm_campaign=free_closed_test_001&utm_content=<creative_id>`

## Positioning Rules

- Lead with the unique job: the nap timer starts after sleep begins.
- Keep the first line plain enough to work in a Reddit feed.
- Do not position Naptime as a broad sleep suite or audio relaxation app.
- Mention trust clearly for free testing: anonymous usage/session data is collected only if a nap or sleep session is started.
- Avoid medical claims. Keep research and performance claims out of first-test ad creative unless the landing page explains them.

## Creative Candidates

### `sleep-start`

Hook:

> Your nap timer starts after you actually fall asleep.

Body:

> Set 20 minutes. Get 20 minutes of rest, not 5 minutes after tossing around.

Best audience:

- Students, developers, founders, parents, shift workers.

Why test:

- Clearest mechanism. Strongest match to the landing-page winner candidate.

Suggested Reddit ad text:

> Normal timers start too early. Naptime uses your Android phone on the mattress to start the nap countdown after sleep is detected. Looking for closed testers.

UTM content:

- `sleep_start_static_v1`

### `full-nap`

Hook:

> Stop losing your nap while trying to fall asleep.

Body:

> A 20-minute nap should mean 20 minutes asleep.

Best audience:

- Productivity, student, parent, and burnout/recovery communities.

Why test:

- Outcome-led and frustration-based. Easier emotional click than mechanism-first copy.

Suggested Reddit ad text:

> Ever set a 20-minute nap and spend most of it trying to fall asleep? Naptime waits for sleep, then starts the timer.

UTM content:

- `full_nap_static_v1`

### `no-wearable`

Hook:

> Smart naps, no wearable.

Body:

> Place your Android phone on the mattress. Naptime watches movement and protects your wake deadline.

Best audience:

- Android, fitness, quantified-self, and sleep-curious users who do not want new hardware.

Why test:

- Reduces setup friction and differentiates against wearable-heavy sleep tracking.

Suggested Reddit ad text:

> No watch, ring, microphone, or account needed. Naptime is a focused Android nap alarm that starts counting after sleep begins.

UTM content:

- `no_wearable_static_v1`

### `tester-trust`

Hook:

> Help test a better nap alarm.

Body:

> Quick install/open helps. Optional: try one nap. Anonymous data is collected only if you start a session.

Best audience:

- Tester-exchange communities, Android developer communities, privacy-conscious early adopters.

Why test:

- Highest trust fit for closed testing. Lower threshold than asking strangers to actually nap immediately.

Suggested Reddit ad text:

> I need Android closed testers for Naptime Free. Staying opted in for 14 days helps; starting a nap is optional. Anonymous usage/session data is collected only if a nap or sleep session is started.

UTM content:

- `tester_trust_static_v1`

## Recommended First Test

Start with two very different messages:

1. `sleep-start`: highest product clarity.
2. `tester-trust`: lowest-friction closed-test recruitment.

If Reddit Max can rotate multiple assets, include all four. If budget is tight, start with `sleep-start` and `tester-trust`, then add `full-nap` after the first 500-1000 impressions per creative.

## Export Notes

Recommended upload format: 4:3 landscape at 1200 by 900. These files are exported under `export/*-1200x900.png`.

Square 1200 by 1200 exports are also kept under `export/*-1200x1200.png` for placements that prefer square inventory.

`creatives.html` contains both formats:

- Square preview/export: `creatives.html?creative=sleep-start`
- 4:3 preview/export: `creatives.html?ratio=4x3&creative=sleep-start`


