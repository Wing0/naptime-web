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
| `naptime.info/__nt_event*` | First-party browser event collection for page views and clicks |
| `www.naptime.info/__nt_event*` | Canonicalizes to apex for browser event collection |
| `naptime.info/free.html*` | Legacy Free URL kept as pass-through to the homepage redirect |
| `www.naptime.info/free.html*` | Canonicalizes to apex; Free experiment is currently disabled |

Recommended paid campaign URL: `https://naptime.info/android`. The public Free page is `https://naptime.info/`, and the public paid page is `https://naptime.info/paid.html`.

## Local Wrangler Commands

Install/use Wrangler from the web repo root:

```powershell
npx wrangler --version
npx wrangler login
npx wrangler deploy --config cloudflare/worker/wrangler.toml
```

If using an API token instead of browser login, set `CLOUDFLARE_API_TOKEN` in your shell. The token should be scoped to this zone and allow Workers script deployment and route management.


## Current live state

Cloudflare DNS is active and the Worker is deployed for paid Reddit Max testing.

Current flags in `worker/src/index.js`:

```js
const ENABLE_FREE_EXPERIMENT = false;
const ENABLE_PAID_EXPERIMENT = true;
```

Paid campaign pages are served through `https://naptime.info/android`. Naptime Free is launched worldwide from the stable homepage, so the legacy Free experiment routing remains disabled.

## Landing Arrival Tracking

The Worker records eligible paid `/android*` experiment requests and accepts first-party browser events at `/__nt_event` for page views, landing clicks, and Play Store clicks. Experiment assignment is not persisted until the visitor explicitly accepts analytics cookies: the browser then sends `naptime_analytics_consent=granted`, which permits the Worker to set the 30-day sticky variant cookie. Before consent, landing measurement remains aggregate but no experiment cookie is retained.

Durable tracking uses Workers Analytics Engine:

```toml
[[analytics_engine_datasets]]
binding = "LANDING_ANALYTICS"
dataset = "naptime_landing_events"
```

The Worker also emits a structured `landing_arrival` log for live smoke tests with `wrangler tail`.

The custom Analytics Engine/log payload intentionally excludes IP addresses, raw user agents, and raw `rdt_cid` values. It includes only campaign/variant fields and coarse request buckets:

- experiment and variant
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_id`, `utm_content`
- `rdt_cid` presence (`present` or `missing`)
- country and Cloudflare colo
- device bucket and browser bucket
- click CTA location, link type, destination host, and destination path for browser click events

Analytics Engine blob column map:

| Blob | Field |
|---|---|
| `blob1` | event |
| `blob2` | host |
| `blob3` | page path |
| `blob4` | experiment |
| `blob5` | variant |
| `blob6` | source |
| `blob7` | medium |
| `blob8` | campaign |
| `blob9` | campaign ID |
| `blob10` | ad content |
| `blob11` | `rdt_cid` presence |
| `blob12` | traffic bucket |
| `blob13` | country |
| `blob14` | Cloudflare colo |
| `blob15` | device bucket |
| `blob16` | browser bucket |
| `blob17` | CTA location |
| `blob18` | link type |
| `blob19` | destination host |
| `blob20` | destination path |

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

After analytics consent, the Worker sets a sticky cookie named `nt_paid_landing_v1`, so returning visitors keep seeing the same paid variant.

## Rollback

Fast rollback options:

1. Disable/remove the Worker route in Cloudflare dashboard.
2. Deploy this Worker with the route commented out in `wrangler.toml`.
3. In an emergency, switch DNS records from Proxied to DNS only; this bypasses Cloudflare proxy features but keeps DNS hosted there.


