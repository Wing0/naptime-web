# Naptime Web

Static marketing/policy site for the Naptime app, served via GitHub Pages from the `main` branch (custom domain `naptime.info`, see `CNAME`).

## Workflow

- **Always commit and push to `main` when a new feature or page is implemented.** This site deploys directly from `main`, so changes are not live until pushed. After completing a feature (new page, section, or meaningful content/layout change), commit it with a descriptive message and `git push origin main` without waiting to be asked.
- End commit messages with the standard `Co-Authored-By` trailer.

## Template system

`index.html` (Naptime paid) and `free.html` (Naptime Free) are **generated files** — never edit them directly. Edit `_template.html` instead, then run:

```
node build.js
```

This regenerates both pages. `build.js` defines per-variant values (store URL, page title, price, etc.).

### Template markers

- `{{VARIABLE}}` — replaced with a per-variant value defined in `build.js`
- `<!-- PAID_ONLY -->…<!-- /PAID_ONLY -->` — included in `index.html`, stripped from `free.html`
- `<!-- FREE_ONLY -->…<!-- /FREE_ONLY -->` — included in `free.html`, stripped from `index.html`

### What differs between paid and free

| | `index.html` | `free.html` |
|---|---|---|
| Store URL | `com.naptime.app` | `com.naptime.app.free` |
| Privacy First section | ✅ shown | ❌ removed |
| "Where does my data go?" FAQ | ✅ shown | ❌ removed |
| FAQPage JSON-LD schema | ✅ included | ❌ removed |
| Footer privacy link | Both policies | Free policy only |
| Footer cross-link | → Naptime Free | → Naptime (paid) |
