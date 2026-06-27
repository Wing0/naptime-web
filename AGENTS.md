# Repository Notes

- When implementing feature or content changes, make a separate git commit for each implemented feature.
## Cloudflare

- Cloudflare DNS is active for `naptime.info`; GitHub Pages remains the origin.
- Wrangler configuration lives under `cloudflare/worker/` and setup notes live in `cloudflare/README.md`.
- A Worker named `naptime-experiments` is deployed on `naptime.info/free.html*` and `www.naptime.info/free.html*`.
- Experiment routing is enabled with `ENABLE_FREE_EXPERIMENT = true` in `cloudflare/worker/src/index.js`. Keep the `/experiments/` pages live on the deployed GitHub Pages branch and test forced variants after every Worker deploy.
- Use `CLOUDFLARE_API_TOKEN` from the local environment for Wrangler if available. Never print, commit, or request the token value in chat.
- Run Wrangler from `cloudflare/worker/` so it discovers `wrangler.toml`, for example: `npm exec wrangler -- deploy`.
- After deploying, verify live behavior with `curl.exe -I https://naptime.info/free.html` and forced variant URLs before sending traffic.

