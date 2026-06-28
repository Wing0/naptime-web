# Analytics Setup

The website uses a consent-aware GA4 setup. The canonical Google tag is loaded directly in the page `<head>` so Google Analytics can detect it normally. `analytics.js` handles consent updates, custom page views, and CTA events.

Current Measurement ID:

- `G-M9EH844KS8`

If this is not the correct GA4 web stream for Naptime, update the Google tag snippets in `_template.html`, `build-paid-campaigns.js`, and static pages such as `early-access.html`.

## Consent Behavior

- Consent defaults to denied for:
  - `analytics_storage`
  - `ad_storage`
  - `ad_user_data`
  - `ad_personalization`
- The cookie banner stores consent in `localStorage` as `naptime_cookie_consent`.
- On accept, `analytics.js` updates Google Consent Mode to granted.
- On decline, the site remains usable and consent remains denied.

## Events

`analytics.js` sends a manual `page_view` with:

- `content_variant`
- `page_flavor`
- `traffic_source`

CTA links marked with `data-analytics-event` send events. Current paid campaign pages emit:

- `play_store_click`
- `learn_more_click`

Useful event params:

- `content_variant`
- `page_flavor`
- `cta_location`
- `destination`
- `link_text`

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
```

The Cloudflare Worker sets sticky cookie `nt_paid_landing_v1`.
