# Cloudflare Setup For Naptime Web

Naptime currently uses GitHub Pages as the static origin for `naptime.info`. Cloudflare should sit in front of GitHub Pages:

Visitor -> Cloudflare DNS/proxy/Worker -> GitHub Pages origin

Use this setup in two stages.

## Stage 1: Move DNS To Cloudflare

1. Create or log in to a Cloudflare account.
2. Add the domain `naptime.info` as a full DNS zone.
3. Let Cloudflare scan existing records, then verify the website records manually.
4. Add or keep these GitHub Pages records:

| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `@` | `185.199.108.153` | Proxied |
| A | `@` | `185.199.109.153` | Proxied |
| A | `@` | `185.199.110.153` | Proxied |
| A | `@` | `185.199.111.153` | Proxied |
| CNAME | `www` | `wing0.github.io` | Proxied |

5. If DNSSEC is enabled at the registrar, disable it before changing nameservers.
6. Change nameservers at the registrar to the two Cloudflare nameservers shown during onboarding.
7. Wait until Cloudflare marks the zone active.
8. In Cloudflare SSL/TLS, use `Full` mode for GitHub Pages.
9. Verify:

```powershell
curl.exe -I https://naptime.info/
curl.exe -I https://www.naptime.info/
```

## Stage 2: Add Experiment Worker

This Worker keeps GitHub Pages as the origin and only changes selected requests before they reach GitHub Pages.

Current route setup:

| Route | Purpose |
|---|---|
| `naptime.info/android*` | Paid Reddit Max landing-page experiment |
| `www.naptime.info/android*` | Canonicalizes to apex, then serves paid experiment |
| `naptime.info/free.html*` | Free route kept as pass-through safety |
| `www.naptime.info/free.html*` | Canonicalizes to apex; Free experiment is currently disabled |

Recommended paid campaign URL: `https://naptime.info/android`.

## Local Wrangler Commands

Install/use Wrangler from the web repo root:

```powershell
npm exec wrangler -- --version
npm exec wrangler -- login
npm exec wrangler -- deploy --config cloudflare/worker/wrangler.toml
```

If using an API token instead of browser login, set `CLOUDFLARE_API_TOKEN` in your shell. The token should be scoped to this zone and allow Workers script deployment and route management.


## Current live state

Cloudflare DNS is active and the Worker is deployed for paid Reddit Max testing.

Current flags in `worker/src/index.js`:

```js
const ENABLE_FREE_EXPERIMENT = false;
const ENABLE_PAID_EXPERIMENT = true;
```

Paid campaign pages are served through `https://naptime.info/android`. Free routing is intentionally pass-through because Naptime Free is not released yet.

## Landing Arrival Logging

The Worker emits a structured `landing_arrival` log for paid `/android*` experiment requests before GA4, Reddit Pixel, or cookie consent can affect measurement. This is intended to debug Reddit clicks vs GA4 sessions.

The custom log payload intentionally excludes IP addresses, raw user agents, and raw `rdt_cid` values. It includes only campaign/variant fields and coarse request buckets:

- experiment and variant
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_id`, `utm_content`
- `rdt_cid` presence (`present` or `missing`)
- country and Cloudflare colo
- device bucket and browser bucket

Tail live arrivals from `cloudflare/worker/`:

```powershell
npm exec -- wrangler tail naptime-experiments --format json
```

Then visit a test URL:

```powershell
curl.exe "https://naptime.info/android?nt_paid_variant=sleep-start&utm_source=reddit&utm_medium=paid&utm_campaign=tail-test&utm_id=tail-test&utm_content=tail-test&rdt_cid=tail-test"
```

Look for a log message like:

```json
{"event":"landing_arrival","path":"/android","experiment":"paid_reddit_landing_v1","variant":"sleep-start","source":"reddit","medium":"paid","campaign":"tail-test","campaignId":"tail-test","adContent":"tail-test","rdtCid":"present","traffic":"reddit_related","country":"CH","colo":"ZRH","device":"desktop","browser":"other"}
```

Wrangler tail may show Cloudflare request metadata around the log event; do not copy or persist that request metadata if it includes IP addresses.

Optional persistent aggregate counters are supported in `worker/src/index.js` if a KV namespace is later bound as `LANDING_COUNTS`. The current local Cloudflare token could deploy Workers but could not create a KV namespace (`Authentication error [code: 10000]`), so persistent counters still need a dashboard-created KV namespace or a broader token with Workers KV permissions.
## Testing Variants

Force a paid variant with:

- `https://naptime.info/android?nt_paid_variant=sleep-start`
- `https://naptime.info/android?nt_paid_variant=private`
- `https://naptime.info/android?nt_paid_variant=deadline`
- `https://naptime.info/android?nt_paid_variant=full-nap`

The Worker sets a sticky cookie named `nt_paid_landing_v1`, so normal visitors keep seeing the same paid variant.

## Rollback

Fast rollback options:

1. Disable/remove the Worker route in Cloudflare dashboard.
2. Deploy this Worker with the route commented out in `wrangler.toml`.
3. In an emergency, switch DNS records from Proxied to DNS only; this bypasses Cloudflare proxy features but keeps DNS hosted there.


