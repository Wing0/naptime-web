# Analytics Setup

The website uses a consent-aware GA4 and Reddit Pixel setup. The canonical Google tag is loaded directly in the page `<head>` so Google Analytics can detect it normally. `analytics.js` handles consent updates, custom page views, CTA events, and Reddit Pixel events.

All tracked HTML pages load one Google tag and one `analytics.js` helper. Automatic GA page views are disabled with `send_page_view: false`; `analytics.js` sends the page view so every page view can include Naptime-specific flavor and variant fields.

Current Measurement ID:

- `G-M9EH844KS8`

Current Reddit Pixel ID:

- `a2_izauxup9ioln`

If this is not the correct GA4 web stream for Naptime, update the Google tag snippets in `_template.html`, `build-paid-campaigns.js`, and static pages such as `early-access.html`.

## Consent Behavior

- Consent defaults to denied for:
  - `analytics_storage`
  - `ad_storage`
  - `ad_user_data`
  - `ad_personalization`
- The cookie banner stores consent in `localStorage` as `naptime_cookie_consent`.
- On accept, `analytics.js` updates Google Consent Mode to granted.
- On accept, `analytics.js` initializes Reddit Pixel and sends the current page visit if it has not already been sent to Reddit.
- On decline, the site remains usable and consent remains denied.

## Events

`analytics.js` sends a manual `page_view` with:

- `content_variant`
- `landing_variant`
- `page_flavor`
- `traffic_source`
- UTM params when present

Links are tracked automatically on pages that load `analytics.js`. Important CTA links can still set `data-analytics-event` and `data-cta-location` for clearer event names and placement labels.

Pages can declare tracking metadata on the `<html>` element:

```html
<html data-page-flavor="paid-campaign" data-variant="sleep-start">
```

When metadata is missing, `analytics.js` infers a useful `page_flavor` and `content_variant` from the URL path, so experiment and static pages are still distinguishable in GA.

Current event names include:

- `play_store_click`
- `learn_more_click`
- `navigation_click`
- `anchor_navigation`
- `outbound_click`
- `consent_choice`

Reddit Pixel mapping:

- `page_view` -> Reddit `PageVisit`
- `play_store_click` -> Reddit `Lead`
- `learn_more_click`, `navigation_click`, `anchor_navigation`, `outbound_click` -> Reddit `Custom`

Useful event params:

- `content_variant`
- `landing_variant`
- `page_flavor`
- `cta_location`
- `destination`
- `destination_host`
- `link_text`
- `link_type`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`

## Paid Reddit Max URLs

Use this as the campaign URL:

```text
https://naptime.info/android?utm_source=reddit&utm_medium=paid_social&utm_campaign=paid_android_001&utm_content=<ad_id>
```

Forced test variants:

```text
https://naptime.info/android?nt_paid_variant=sleep-start
https://naptime.info/android?nt_paid_variant=private
https://naptime.info/android?nt_paid_variant=deadline
https://naptime.info/android?nt_paid_variant=full-nap
https://naptime.info/android?nt_paid_variant=caffeine-alternative
```

The Cloudflare Worker sets sticky cookie `nt_paid_landing_v1`.
