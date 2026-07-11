// Generates index.html and free.html from _template.html.
// Run: node build.js
const fs = require('fs');
const template = fs.readFileSync('_template.html', 'utf8');

const variants = [
  {
    outputFile: 'index.html',
    keepBlock: 'PAID_ONLY',
    dropBlock: 'FREE_ONLY',
    vars: {
      PAGE_TITLE:        'Naptime: Smart Nap Timer & Sleep Tracker for Android',
      PAGE_NAME:         'Naptime',
      PAGE_FLAVOR:       'paid-main',
      CONTENT_VARIANT:   'main-paid',
      CANONICAL_URL:     'https://naptime.info/',
      OG_URL:            'https://naptime.info/',
      STORE_URL:         'https://play.google.com/store/apps/details?id=com.naptime.app',
      CTA_ANALYTICS_EVENT:'play_store_click',
      PRICE:             '1.99',
      DOWNLOAD_TAGLINE:  'Smart naps, night sleep tracking, tag analytics, and regular alarms. Private by design and built for Android.',
      AVAILABILITY_BADGE:'Now Available',
      AVAILABILITY_NOTE: 'Currently available in Finland, Ireland, Slovenia &amp; Switzerland &mdash; expanding soon.',
      HERO_AVAILABILITY:'Available in Finland, Ireland, Slovenia &amp; Switzerland',
      CROSSLINK_URL:     '/free.html',
      CROSSLINK_LABEL:   'Naptime Free',
    },
  },
  {
    outputFile: 'free.html',
    keepBlock: 'FREE_ONLY',
    dropBlock: 'PAID_ONLY',
    vars: {
      PAGE_TITLE:        'Naptime Free: Smart Nap Timer & Sleep Tracker for Android',
      PAGE_NAME:         'Naptime Free',
      PAGE_FLAVOR:       'free-main',
      CONTENT_VARIANT:   'main-free',
      CANONICAL_URL:     'https://naptime.info/free.html',
      OG_URL:            'https://naptime.info/free.html',
      STORE_URL:         '/early-access.html',
      CTA_ANALYTICS_EVENT:'early_access_click',
      PRICE:             '0',
      DOWNLOAD_TAGLINE:  'Join the closed test for smart naps, night sleep tracking, tag analytics, and regular alarms on Android.',
      AVAILABILITY_BADGE:'Closed Testing',
      AVAILABILITY_NOTE: 'Naptime Free is currently in Google Play closed testing; Play access requires joining the test.',
      HERO_AVAILABILITY:'Google Play closed testing &mdash; join the tester group first',
      CROSSLINK_URL:     '/',
      CROSSLINK_LABEL:   'Naptime (paid)',
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

  fs.writeFileSync(outputFile, html);
  console.log(`Built ${outputFile}`);
}
