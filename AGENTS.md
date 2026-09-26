# Repository Notes

- When implementing feature or content changes, make a separate git commit for each implemented feature.
## Cloudflare

- Cloudflare DNS is active for `naptime.info`; GitHub Pages remains the origin.
- Wrangler configuration lives under `cloudflare/worker/` and setup notes live in `cloudflare/README.md`.
- A Worker named `naptime-experiments` handles first-party events and legacy `/free.html*` routes. Its Paid-route redirect revision is committed but awaits explicit production approval; verify live routing before relying on redirects. The supported product page is `/`.
- The committed Worker revision redirects retired Paid paths to `/`. Free experiment routing remains disabled with `ENABLE_FREE_EXPERIMENT = false` so the worldwide Free launch uses the stable homepage.
- Use `CLOUDFLARE_API_TOKEN` from the local environment for Wrangler if available. Never print, commit, or request the token value in chat.
- Run Wrangler from `cloudflare/worker/` so it discovers `wrangler.toml`, for example: `npm exec wrangler -- deploy`.
- After deploying, verify `/`, `/paid.html`, `/android`, and a representative old Paid campaign URL.
- After pushing website HTML/CSS/JS changes and confirming GitHub Pages has rebuilt, purge Cloudflare cache for the changed URLs/assets before final live verification.
- Analytics and consent setup is documented in ANALYTICS.md.

