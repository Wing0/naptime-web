# Cloudflare operations for Naptime Web

`naptime.info` uses Cloudflare DNS/proxy and a Worker in front of the GitHub Pages origin. Treat the repository configuration and verified live behavior as authoritative; this file records the operating workflow, not the completed onboarding history.

## Live routing

The retired Paid-route revision is deployed. On 26 September 2026, `/paid.html`, `/android`, and a representative `/campaigns/paid/*` URL returned a 301 to `/`; `www` canonicalized to the apex first. Verify live responses after future changes. Production deployments require explicit approval.

| Route | Purpose |
| --- | --- |
| `naptime.info/android*` | Redirects retired Paid landing traffic to `/`. |
| `www.naptime.info/android*` | Canonicalizes to apex, then redirects to `/`. |
| `naptime.info/__nt_event*` | First-party page/click events. |
| `www.naptime.info/__nt_event*` | Canonicalizes event traffic to apex. |
| `naptime.info/free.html*` | Legacy Free URL; pass-through to the origin's HTML meta-refresh to `/`. |
| `www.naptime.info/free.html*` | Canonicalizes to apex; Free experiment is disabled. |

The supported product page is `https://naptime.info/`. The live Worker redirects retired `/paid.html`, `/android`, `/campaigns/paid/*`, and `/experiments/paid/*` paths there. The Paid privacy policy remains available at `/privacy.html` for existing users.

Current source flags in `cloudflare/worker/src/index.js`:

```js
const ENABLE_FREE_EXPERIMENT = false;
```

Verify the flag, `wrangler.toml`, and live redirects before changing or describing production state.

## Access and deployment

Run Wrangler from `cloudflare/worker/` so it discovers `wrangler.toml`:

```powershell
npm exec -- wrangler deploy
```

`CLOUDFLARE_API_TOKEN` may be available in the local environment. Never print, commit, or request its value. Use a zone-scoped token with only the permissions required for the operation.

After deploy:

1. Confirm the Worker deployment succeeded.
2. Test the stable homepage and retired Paid redirects.
3. Test a representative old campaign URL.
4. Confirm `www` canonicalization and the legacy Free redirect.
5. Tail a synthetic event when analytics behavior changed.

After GitHub Pages HTML/CSS/JS changes, confirm the Pages build, purge relevant Cloudflare URLs/assets, then repeat live verification. Static assets and older pages may remain cached.

## Experiment behavior

The Free experiment code remains disabled. Old Paid experiment URLs redirect to the supported homepage, including URLs with `nt_paid_variant`.

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

After rollback, verify the homepage, retired Paid redirects, legacy Free redirect, and event endpoint from both apex and `www`.
