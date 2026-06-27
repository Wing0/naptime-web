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

Initial route recommendation:

| Route | Purpose |
|---|---|
| `naptime.info/free.html*` | A/B test Naptime Free landing variants |
| `www.naptime.info/free.html*` | Same test for www traffic |

After the first test works, add routes for paid pages or early-access pages.

## Local Wrangler Commands

Install/use Wrangler from the web repo root:

```powershell
npm exec wrangler -- --version
npm exec wrangler -- login
npm exec wrangler -- deploy --config cloudflare/worker/wrangler.toml
```

If using an API token instead of browser login, set `CLOUDFLARE_API_TOKEN` in your shell. The token should be scoped to this zone and allow Workers script deployment and route management.


## Current live state

Cloudflare DNS is active and the Worker has been deployed to the `free.html` routes, but experiment routing is intentionally disabled in `worker/src/index.js` with:

```js
const ENABLE_FREE_EXPERIMENT = false;
```

Keep it disabled until the experiment pages under `/experiments/` are published to the live GitHub Pages branch. When those pages are live, switch the flag to `true`, deploy again, and test forced variants before sending paid traffic.
## Testing Variants

Force a variant with:

- `https://naptime.info/free.html?nt_variant=sleep-start`
- `https://naptime.info/free.html?nt_variant=full-nap`
- `https://naptime.info/free.html?nt_variant=tester-trust`
- `https://naptime.info/free.html?nt_variant=no-wearable`

The Worker sets a sticky cookie named `nt_free_landing_v1`, so normal visitors keep seeing the same variant.

## Rollback

Fast rollback options:

1. Disable/remove the Worker route in Cloudflare dashboard.
2. Deploy this Worker with the route commented out in `wrangler.toml`.
3. In an emergency, switch DNS records from Proxied to DNS only; this bypasses Cloudflare proxy features but keeps DNS hosted there.


