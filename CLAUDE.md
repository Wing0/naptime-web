# Naptime Web

Static marketing/policy site for the Naptime app, served via GitHub Pages from the `main` branch (custom domain `naptime.info`, see `CNAME`).

## Workflow

- **Always commit and push to `main` when a new feature or page is implemented.** This site deploys directly from `main`, so changes are not live until pushed. After completing a feature (new page, section, or meaningful content/layout change), commit it with a descriptive message and `git push origin main` without waiting to be asked.
- End commit messages with the standard `Co-Authored-By` trailer.

## Template system

`index.html` (Naptime Free), `paid.html` (Naptime paid), and the legacy `free.html` redirect are **generated files** — never edit them directly. Edit `_template.html` or `build.js` instead, then run:

```
node build.js
```

This regenerates all three outputs. `build.js` defines per-variant values (store URL, page title, price, etc.).

### Template markers

- `{{VARIABLE}}` — replaced with a per-variant value defined in `build.js`
- `<!-- PAID_ONLY -->…<!-- /PAID_ONLY -->` — included in `paid.html`, stripped from `index.html`
- `<!-- FREE_ONLY -->…<!-- /FREE_ONLY -->` — included in `index.html`, stripped from `paid.html`

### What differs between paid and free

| | `index.html` | `paid.html` |
|---|---|---|
| Store URL | Free closed-test page | `com.naptime.app` |
| Privacy First section | ❌ removed | ✅ shown |
| "Where does my data go?" FAQ | Free donation disclosure | Paid on-device disclosure |
| FAQPage JSON-LD schema | ❌ removed | ✅ included |
| Footer privacy link | Free policy only | Both policies |
| Footer cross-link | → Naptime (paid) | → Naptime Free |
