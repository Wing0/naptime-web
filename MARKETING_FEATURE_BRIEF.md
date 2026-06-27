# Naptime Marketing Feature Brief

Use this as the shared reference for website experiment agents. The goal is to create alternative landing-page candidates for conversion testing, not to invent a different product.

## Product

Naptime is an Android alarm and sleep app. Its core promise:

> The nap timer starts after the user actually falls asleep.

If a user sets a 20-minute nap but spends 15 minutes falling asleep, a normal timer gives only 5 minutes of real rest. Naptime uses the phone's accelerometer on the mattress to detect sleep onset, then starts the countdown so the user gets the planned sleep duration.

## Competitive Lane

Naptime should not be positioned as a generic sleep app.

- Sleep as Android owns the broad Android sleep-suite lane: sleep tracking, smart wake-up, anti-snoring, wearables, integrations, and advanced settings.
- Pzizz owns the audio relaxation lane: voice, music, and soundscapes to help users fall asleep, nap, or focus.
- Naptime owns the true-duration nap lane: the alarm/timer starts counting after sleep begins.

Simple comparison:

| App | Core Job |
|---|---|
| Pzizz | Helps you fall asleep with audio |
| Sleep as Android | Tracks sleep and wakes you intelligently |
| Naptime | Starts your nap timer after sleep begins |

Preferred contrast copy:

- "Not another sleep dashboard."
- "Not an audio relaxation app."
- "A practical smart nap alarm that protects the sleep time you asked for."

Keep competitors out of public-facing page copy unless explicitly creating comparison pages. Use the distinction to sharpen Naptime's own words.

## Current Release State

- Paid app: launched in selected countries.
- Free app: currently in Google Play closed testing.
- Current immediate marketing challenge: recruit enough real Android closed testers and improve conversion to Play Store download / tester signup.

## Flavors And Trust Positioning

Naptime has two Android flavors:

- Paid: all session data stays on-device only. No anonymous uploads.
- Free: anonymous, consent-gated data donation supports the free version.

For Naptime Free, anonymous session/usage data is collected only when a nap or sleep session is started. Merely installing or opening the app should not be framed as contributing session data.

Trust is a major conversion factor. Copy must be clear, calm, and non-evasive about the free app's data donation model.

## Primary Features

### Smart Sleep Detection

Uses the phone accelerometer to distinguish settling movement from stillness associated with sleep onset. No wearable is required. The user places the phone on the mattress.

### True Duration Nap Timer

The countdown starts when sleep is detected, not when the user presses Start. A 20-minute nap aims to deliver 20 minutes of actual sleep.

### Hard Deadline / Never Oversleep

Users can set a latest wake-up time. Even if sleep is not detected, the alarm fires by the cutoff.

### Night Sleep Tracking

Tracks overnight sleep sessions and builds movement-based history: latency, efficiency, wake events, and trends.

### Tags And Insights

Users can tag sessions with context like caffeine, workout, noisy room, window open, stress, or late meal. History and insights help users spot patterns.

### Post-Session Rating

Users can rate how they feel after sessions. Ratings help identify personal sweet spots and compare habits.

### Regular Alarms

Includes a standard alarm mode for normal wake-up use.

### Pure Dark Mode

Dark, OLED-friendly interface intended for use near bedtime.

## Evidence And Claims

Naptime can reference sleep and nap research, including NASA nap findings, but copy should avoid overclaiming.

Preferred language:

- "Research suggests..."
- "Short naps can improve alertness..."
- "Naptime helps you time naps around when you actually fall asleep."

Avoid:

- Medical claims.
- Disease treatment/prevention claims.
- Guarantees about health outcomes.
- Claiming Naptime diagnoses sleep quality or sleep disorders.

## Target Audiences

Prioritize audiences that plausibly benefit from intentional rest:

- Students.
- Parents.
- Shift workers.
- Developers/founders/knowledge workers.
- Athletes and fitness-minded users.
- People experimenting with better sleep habits.
- Android users willing to test early apps.

## Conversion Goals

Primary:

- Click Play Store / join early access / download CTA.

Secondary:

- Join closed testing instructions.
- Email signup for a sleep/napping guide or launch updates.
- Privacy page engagement.

## Candidate Strategy

Create distinct positioning candidates, not minor button-color variants. Good candidate angles:

- "Get the full nap you asked for."
- "The alarm that starts after you fall asleep."
- "A smarter power nap without a wearable."
- "Nap and night sleep insights in one calm Android app."
- "Free tester-first version: help shape a better sleep alarm."

Across all candidates, keep the core lane visible: Naptime is the practical sleep-start alarm for true-duration naps. Night tracking, tags, and insights support that promise; they should not bury it.


## Paid Page Candidate Strategy

Paid-page variants should sell the launched paid app, not the free closed test.

Primary paid value:

- True-duration smart naps.
- All session data stays on-device.
- Pay once, no account, no sleep-data donation.

Paid page positioning must still keep the same competitive lane:

- Not a broad sleep suite.
- Not an audio relaxation app.
- A practical sleep-start alarm for true-duration naps, with night tracking and insights as supporting value.

Good paid-page candidate angles:

- "The private smart nap alarm."
- "Get the full nap you paid for, with no data uploads."
- "A calmer alternative to complex sleep trackers."
- "Sleep insights without an account or wearable."
- "One-time purchase, on-device sleep history."

Paid CTA should point to the paid Play Store listing. If candidate pages use static experiment links, use `https://play.google.com/store/apps/details?id=com.naptime.app`.
## Website Constraints

This repo is a static GitHub Pages site.

- `index.html` and `free.html` are generated files.
- Edit `_template.html` for shared paid/free marketing page changes.
- Run `node build.js` after template changes.
- Preserve paid/free differences marked by `PAID_ONLY` and `FREE_ONLY`.
- Keep `early-access.html`, `privacy-free.html`, and `delete-data.html` consistent with privacy/trust claims.

For this experiment branch, agents may create proposal files or variant pages. Do not overwrite the main template unless explicitly chosen for final implementation.

## Evaluation Criteria

Candidate pages should be judged by:

- Clear first-screen value proposition.
- Trustworthiness around free data donation.
- Fit for Android closed testing and eventual public release.
- Strength of CTA.
- Specificity to Naptime's unique timer-after-sleep feature.
- Credibility of research/benefit claims.
- Mobile readability.
- Likelihood of converting real testers, not just curiosity clicks.
