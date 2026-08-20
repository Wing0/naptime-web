// Generates index.html (Free) and paid.html from _template.html.
// Run: node build.js
const fs = require('fs');
const template = fs.readFileSync('_template.html', 'utf8');

const variants = [
  {
    outputFile: 'index.html',
    keepBlock: 'FREE_ONLY',
    dropBlock: 'PAID_ONLY',
    vars: {
      HOME_URL:         '/',
      PAGE_TITLE:        'Naptime Free: Smart Nap Timer & Sleep Tracker for Android',
      PAGE_NAME:         'Naptime Free',
      PAGE_FLAVOR:       'free-main',
      CONTENT_VARIANT:   'main-free',
      CANONICAL_URL:     'https://naptime.info/',
      OG_URL:            'https://naptime.info/',
      STORE_URL:         'https://play.google.com/store/apps/details?id=com.naptime.app.free',
      CTA_ANALYTICS_EVENT:'play_store_click',
      PRICE:             '0',
      DOWNLOAD_TAGLINE:  'Download smart naps, night sleep tracking, tag analytics, and regular alarms free on Android.',
      AVAILABILITY_BADGE:'Available Worldwide',
      AVAILABILITY_NOTE: 'Naptime Free is now available worldwide on Google Play.',
      HERO_AVAILABILITY:'Available worldwide on Google Play',
      CROSSLINK_URL:     '/paid.html',
      CROSSLINK_LABEL:   'Naptime (paid)',
    },
  },
  {
    outputFile: 'paid.html',
    keepBlock: 'PAID_ONLY',
    dropBlock: 'FREE_ONLY',
    vars: {
      HOME_URL:         '/paid.html',
      PAGE_TITLE:        'Naptime: Private Nap Timer & Sleep Tracker (One-Time Purchase)',
      PAGE_NAME:         'Naptime',
      PAGE_FLAVOR:       'paid-main',
      CONTENT_VARIANT:   'main-paid',
      CANONICAL_URL:     'https://naptime.info/paid.html',
      OG_URL:            'https://naptime.info/paid.html',
      STORE_URL:         'https://play.google.com/store/apps/details?id=com.naptime.app',
      CTA_ANALYTICS_EVENT:'play_store_click',
      PRICE:             '1.99',
      DOWNLOAD_TAGLINE:  'Smart naps, night sleep tracking, tag analytics, and regular alarms. Private by design and built for Android.',
      AVAILABILITY_BADGE:'Now Available',
      AVAILABILITY_NOTE: 'Currently available in Finland, Ireland, Slovenia &amp; Switzerland &mdash; expanding soon.',
      HERO_AVAILABILITY:'Available in Finland, Ireland, Slovenia &amp; Switzerland',
      CROSSLINK_URL:     '/',
      CROSSLINK_LABEL:   'Naptime Free',
    },
  },
];

for (const { outputFile, keepBlock, dropBlock, vars } of variants) {
  let html = template;

  // Remove dropped blocks entirely
  html = html.replace(new RegExp(`<!-- ${dropBlock} -->[\\s\\S]*?<!-- \\/${dropBlock} -->`, 'g'), '');

  // Unwrap kept blocks (strip the markers, keep the content)
  html = html.replace(new RegExp(`<!-- ${keepBlock} -->`, 'g'), '');
  html = html.replace(new RegExp(`<!-- \\/${keepBlock} -->`, 'g'), '');

  // Substitute {{VARIABLE}} placeholders
  for (const [key, value] of Object.entries(vars)) {
    html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }

  // Removing flavor blocks can leave indentation-only lines in generated files.
  html = html.replace(/[ \t]+$/gm, '');

  fs.writeFileSync(outputFile, `${html.trimEnd()}\n`);
  console.log(`Built ${outputFile}`);
}

// Keep old links and bookmarks working without maintaining a duplicate Free page.
fs.writeFileSync('free.html', `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <link rel="canonical" href="https://naptime.info/">
  <meta http-equiv="refresh" content="0; url=/">
  <title>Naptime Free</title>
</head>
<body>
  <p>Naptime Free has moved to the <a href="/">Naptime homepage</a>.</p>
</body>
</html>
`);
console.log('Built free.html compatibility redirect');
