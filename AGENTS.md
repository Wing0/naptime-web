# Repository Notes

- When implementing feature or content changes, make a separate git commit for each implemented feature.
## Cloudflare

- Cloudflare DNS is active for `naptime.info`; GitHub Pages remains the origin.
- Wrangler configuration lives under `cloudflare/worker/` and setup notes live in `cloudflare/README.md`.
- A Worker named `naptime-experiments` is deployed on paid `/android*` routes and pass-through Free `/free.html*` routes.
- Paid experiment routing is enabled with `ENABLE_PAID_EXPERIMENT = true`; Free experiment routing is disabled with `ENABLE_FREE_EXPERIMENT = false` because Naptime Free is not released yet. Test paid forced variants after every Worker deploy.
- Use `CLOUDFLARE_API_TOKEN` from the local environment for Wrangler if available. Never print, commit, or request the token value in chat.
- Run Wrangler from `cloudflare/worker/` so it discovers `wrangler.toml`, for example: `npm exec wrangler -- deploy`.
- After deploying, verify live behavior with `https://naptime.info/android?nt_paid_variant=<variant>` before sending traffic.
- Analytics and consent setup is documented in ANALYTICS.md.

