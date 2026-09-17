# Cloudflare operations for Naptime Web

`naptime.info` uses Cloudflare DNS/proxy and a Worker in front of the GitHub Pages origin. Treat the repository configuration and verified live behavior as authoritative; this file records the operating workflow, not the completed onboarding history.

## Current routing

| Route | Purpose |
| --- | --- |
| `naptime.info/android*` | Paid landing-page experiment. |
| `www.naptime.info/android*` | Canonicalizes to apex, then serves the paid experiment. |
| `naptime.info/__nt_event*` | First-party page/click events. |
| `www.naptime.info/__nt_event*` | Canonicalizes event traffic to apex. |
| `naptime.info/free.html*` | Legacy Free URL; pass-through to the homepage redirect. |
| `www.naptime.info/free.html*` | Canonicalizes to apex; Free experiment is disabled. |

The public Free page is `https://naptime.info/`; the paid page is `https://naptime.info/paid.html`; paid campaigns use `https://naptime.info/android`.

Current source flags in `cloudflare/worker/src/index.js`:

```js
const ENABLE_FREE_EXPERIMENT = false;
const ENABLE_PAID_EXPERIMENT = true;
```

Verify these flags, `wrangler.toml`, and live forced variants before changing or describing production state.

## Access and deployment

Run Wrangler from `cloudflare/worker/` so it discovers `wrangler.toml`:

```powershell
npm exec -- wrangler deploy
```

`CLOUDFLARE_API_TOKEN` may be available in the local environment. Never print, commit, or request its value. Use a zone-scoped token with only the permissions required for the operation.

After deploy:

1. Confirm the Worker deployment succeeded.
2. Test the stable homepage and paid page.
3. Test every forced paid variant.
4. Confirm `www` canonicalization and the legacy Free redirect.
5. Tail a synthetic event when analytics behavior changed.

After GitHub Pages HTML/CSS/JS changes, confirm the Pages build, purge relevant Cloudflare URLs/assets, then repeat live verification. The `/android` origin fetch is configured not to cache, but static assets and older pages may remain cached.

## Experiment behavior

Force paid variants with `nt_paid_variant`:

- `sleep-start`
- `private`
- `deadline`
- `full-nap`

Example: `https://naptime.info/android?nt_paid_variant=sleep-start`.

Forced variants must still route to their campaign pages even when arrival analytics are suppressed. Falling through to GitHub Pages `/android` produces a 404 and can lose paid traffic.

After analytics consent, the Worker sets the 30-day `nt_paid_landing_v1` cookie so returning visitors keep the assigned variant. Before consent, no experiment cookie is retained.

## First-party analytics

The Worker writes eligible landing and browser events to the `LANDING_ANALYTICS` Analytics Engine binding and emits a structured `landing_arrival` log for live smoke tests. Events include campaign/variant fields, coarse location/device/browser buckets, CTA/link fields, and only the presence of `rdt_cid`.

Never add or retain IP addresses, raw user agents, or raw `rdt_cid` values. Wrangler tail may show Cloudflare request metadata around application logs; do not copy or persist sensitive request metadata.

Analytics Engine blob mapping is an implementation contract:

| Blob | Field | Blob | Field |
| --- | --- | --- | --- |
| 1 | event | 11 | `rdt_cid` presence |
| 2 | host | 12 | traffic bucket |
| 3 | page path | 13 | country |
| 4 | experiment | 14 | Cloudflare colo |
| 5 | variant | 15 | device bucket |
| 6 | source | 16 | browser bucket |
| 7 | medium | 17 | CTA location |
| 8 | campaign | 18 | link type |
| 9 | campaign ID | 19 | destination host |
| 10 | ad content | 20 | destination path |

Tail from `cloudflare/worker/`:

```powershell
npm exec -- wrangler tail naptime-experiments --format json
```

Then request a synthetic URL with explicit test campaign fields and confirm one `landing_arrival` entry with the expected route, experiment, variant, and coarse buckets. Do not use real click identifiers.

The code supports optional aggregate KV counters through `LANDING_COUNTS`, but no KV binding is declared in the current `wrangler.toml`; Analytics Engine is the durable configured sink.

## Rollback

Preferred rollback is to deploy a known-good Worker revision or disable the affected experiment flag. If the Worker itself must be bypassed, remove/disable its route in Cloudflare. Switching DNS records to DNS-only is an emergency measure because it bypasses all Cloudflare proxy features.

After rollback, verify the homepage, paid page, `/android`, legacy Free redirect, and event endpoint from both apex and `www`.
