const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'campaigns', 'paid');
const playUrl = 'https://play.google.com/store/apps/details?id=com.naptime.app';

const template = `<!doctype html>
<html lang="en" data-page-flavor="paid-campaign" data-variant="__VARIANT__">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>__TITLE__</title>
  <meta name="description" content="__DESCRIPTION__">
  <link rel="canonical" href="https://naptime.info/android">
  <meta property="og:type" content="website">
  <meta property="og:title" content="__TITLE__">
  <meta property="og:description" content="__DESCRIPTION__">
  <meta property="og:image" content="https://naptime.info/hero_bed_2_1440.jpg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/campaigns/paid/styles.css">
  <link rel="icon" type="image/png" href="/favicon.png">
  <script src="/analytics.js" defer></script>
</head>
<body class="__BODY_CLASS__">
  <header class="site-nav">
    <a class="brand" href="/" data-analytics-event="learn_more_click" data-cta-location="nav">Naptime<span>.</span></a>
    <nav>
      <a href="/" data-analytics-event="learn_more_click" data-cta-location="nav">Learn more</a>
      <a class="nav-download" href="${playUrl}" data-analytics-event="play_store_click" data-cta-location="nav" target="_blank" rel="noopener">Download for Android</a>
    </nav>
  </header>

  <main>
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">__EYEBROW__</p>
        <h1>__H1__</h1>
        <p class="subhead">__SUBHEAD__</p>
        <div class="cta-row">
          <a class="btn primary" href="${playUrl}" data-analytics-event="play_store_click" data-cta-location="hero" target="_blank" rel="noopener">Download for Android</a>
          <a class="btn secondary" href="/" data-analytics-event="learn_more_click" data-cta-location="hero">Learn more</a>
        </div>
        <p class="privacy-line">One-time paid app. No account. No anonymous uploads. Session data stays on your device.</p>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <img src="__IMAGE__" alt="" loading="eager" decoding="async">
      </div>
    </section>

    <section class="proof-strip" aria-label="Product highlights">
      <div><strong>Timer waits</strong><span>Countdown starts after sleep begins.</span></div>
      <div><strong>No wearable</strong><span>Use your Android phone on the mattress.</span></div>
      <div><strong>Deadline-safe</strong><span>Alarm still fires by your cutoff.</span></div>
    </section>

    <section class="story-section">
      <div class="story-copy">
        <h2>__SECTION_H2__</h2>
        <p>__SECTION_BODY__</p>
      </div>
      <div class="feature-stack">
        __FEATURES__
      </div>
    </section>

    <section class="comparison-band">
      <h2>__COMPARISON_H2__</h2>
      <div class="comparison-grid">
        <div><span>Regular timer</span><strong>Starts too early</strong><p>It counts down while you are still settling in.</p></div>
        <div><span>Audio sleep app</span><strong>Helps you relax</strong><p>Useful, but it does not protect actual nap duration.</p></div>
        <div class="featured"><span>Naptime</span><strong>Starts after sleep</strong><p>You get the rest window you actually asked for.</p></div>
      </div>
    </section>

    <section class="final-cta">
      <p class="eyebrow">__FINAL_EYEBROW__</p>
      <h2>__FINAL_H2__</h2>
      <div class="cta-row center">
        <a class="btn primary" href="${playUrl}" data-analytics-event="play_store_click" data-cta-location="final" target="_blank" rel="noopener">Download for Android</a>
        <a class="btn secondary" href="/" data-analytics-event="learn_more_click" data-cta-location="final">Learn more</a>
      </div>
    </section>
  </main>

  <div id="cookie-banner" class="cookie-banner">
    <div class="cookie-content">
      <p>We use optional analytics cookies to understand which pages help people decide. You can decline and still use the site.</p>
      <div class="cookie-actions">
        <button id="cookie-deny" class="btn-cookie-deny">Decline</button>
        <button id="cookie-accept" class="btn-cookie-accept">Accept</button>
      </div>
    </div>
  </div>

  <script src="/script.js"></script>
</body>
</html>
`;

const variants = [
  {
    file: 'sleep-start.html',
    variant: 'sleep-start',
    bodyClass: 'theme-electric',
    title: 'Naptime for Android - The alarm that starts after you fall asleep',
    description: 'A private Android smart nap alarm that starts the countdown after sleep begins, so your planned nap is actual rest time.',
    eyebrow: 'Private smart nap alarm',
    h1: 'The alarm that starts after you fall asleep.',
    subhead: 'Set a 20-minute nap. Naptime waits until sleep is detected, then starts the countdown, so settling in does not steal the rest you planned.',
    image: '/hero_bed_2_960.jpg',
    sectionH2: 'Built for the moment normal timers get wrong',
    sectionBody: 'Most nap timers start when you tap Start. Naptime starts when movement suggests you have actually fallen asleep, then wakes you by duration or by your latest safe deadline.',
    comparisonH2: 'A focused alternative to generic sleep apps',
    finalEyebrow: 'Try the paid Android app',
    finalH2: 'Get the sleep time you actually asked for.',
    features: [
      ['True-duration naps', 'A 20-minute nap means roughly 20 minutes asleep, not 20 minutes since you opened the app.'],
      ['Hard latest wake-up', 'Protect lunch breaks, pre-meeting rests, and shift windows with a strict cutoff.'],
      ['All data on-device', 'The paid app does not send anonymous session uploads.']
    ]
  },
  {
    file: 'private.html',
    variant: 'private',
    bodyClass: 'theme-private',
    title: 'Naptime for Android - Private sleep insights, no account',
    description: 'Paid Android nap and sleep tracking with all session data kept on your device. No account, no wearable, no anonymous uploads.',
    eyebrow: 'Paid once, kept private',
    h1: 'Sleep insights without an account or wearable.',
    subhead: 'Naptime helps you time naps around when sleep begins, then keeps your nap and night history privately on your Android device.',
    image: '/screenshot_nap_analytics.png',
    sectionH2: 'Private by purchase, practical by design',
    sectionBody: 'Tags, ratings, latency, efficiency, and night sleep trends help you understand your rest without creating a cloud sleep profile.',
    comparisonH2: 'Insight without another account',
    finalEyebrow: 'No anonymous uploads',
    finalH2: 'Own your rest data from the first nap.',
    features: [
      ['No account', 'Open the app and start. No sign-up flow before rest.'],
      ['No cloud sleep profile', 'Session history stays local in the paid app.'],
      ['Useful tags', 'Mark coffee, workout, stress, noisy room, or window open and compare patterns.']
    ]
  },
  {
    file: 'deadline.html',
    variant: 'deadline',
    bodyClass: 'theme-deadline',
    title: 'Naptime for Android - Smart naps with a hard wake deadline',
    description: 'A deadline-safe Android nap alarm for lunch breaks, shift work, study sessions, and pre-meeting recovery.',
    eyebrow: 'Rest windows with guardrails',
    h1: 'A smarter nap that still respects your calendar.',
    subhead: 'Naptime can wait for sleep before counting down, but it still wakes you by your hard cutoff if sleep takes too long.',
    image: '/naptime_hero_mockup.png',
    sectionH2: 'For naps that cannot accidentally expand',
    sectionBody: 'Use Naptime when you want real rest but still need to be back for a meeting, class, pickup, shift, or training block.',
    comparisonH2: 'Smart timing, strict boundary',
    finalEyebrow: 'Deadline-safe naps',
    finalH2: 'Rest better without gambling with your schedule.',
    features: [
      ['Latest wake time', 'Even if sleep is not detected, the alarm fires by your cutoff.'],
      ['Regular alarms included', 'Use the same quiet dark app for simple wake-ups.'],
      ['OLED-friendly dark UI', 'Designed to sit beside you without lighting up the room.']
    ]
  },
  {
    file: 'full-nap.html',
    variant: 'full-nap',
    bodyClass: 'theme-warm',
    title: 'Naptime for Android - Get the full nap you paid for',
    description: 'A paid Android smart nap alarm that protects your planned rest duration and keeps session data on-device.',
    eyebrow: 'Stop losing nap time',
    h1: 'Get the full nap you paid for.',
    subhead: 'If it takes 15 minutes to fall asleep, a normal timer quietly burns most of your break. Naptime waits, then starts counting.',
    image: '/hero_bed_2_960.jpg',
    sectionH2: 'A tiny upgrade to a very common failure',
    sectionBody: 'The value is simple: Naptime protects actual sleep time. Night tracking, tags, and ratings are there to help you learn what makes that rest better.',
    comparisonH2: 'Simple promise, real difference',
    finalEyebrow: 'One-time purchase',
    finalH2: 'Make short rest less accidental.',
    features: [
      ['Sleep-start countdown', 'Your duration starts after sleep begins, not while you are still awake.'],
      ['Nap plus nights', 'Track overnight sleep alongside daytime rest.'],
      ['No subscription', 'Paid Android app, no recurring fee in the listing.']
    ]
  }
];

const css = `:root {
  --bg: #09070f;
  --panel: #11151d;
  --card: rgba(255,255,255,0.075);
  --line: rgba(255,255,255,0.12);
  --text: #ffffff;
  --muted: rgba(255,255,255,0.72);
  --soft: rgba(255,255,255,0.54);
  --accent: #8b2df2;
  --accent-2: #7af2b7;
  --accent-3: #72d7ff;
  font-family: Inter, Arial, sans-serif;
}
* { box-sizing: border-box; }
html, body { max-width: 100%; overflow-x: hidden; }\nbody { margin: 0; color: var(--text); background: var(--bg); line-height: 1.5; }
body::before { content: ""; position: fixed; inset: 0; z-index: -1; background: radial-gradient(circle at 12% 16%, rgba(139,45,242,.42), transparent 28%), radial-gradient(circle at 92% 8%, rgba(114,215,255,.22), transparent 25%), linear-gradient(145deg, #07050d, #13091c 58%, #07050d); }
.theme-private::before { background: radial-gradient(circle at 15% 18%, rgba(122,242,183,.28), transparent 27%), radial-gradient(circle at 88% 80%, rgba(139,45,242,.42), transparent 28%), linear-gradient(145deg, #06110d, #10091b 62%, #08050d); }
.theme-deadline::before { background: radial-gradient(circle at 13% 78%, rgba(114,215,255,.32), transparent 26%), radial-gradient(circle at 88% 18%, rgba(139,45,242,.44), transparent 31%), linear-gradient(145deg, #050b13, #10101d 60%, #07050e); }
.theme-warm::before { background: radial-gradient(circle at 12% 12%, rgba(255,211,106,.30), transparent 24%), radial-gradient(circle at 86% 82%, rgba(139,45,242,.46), transparent 30%), linear-gradient(145deg, #100a05, #13091b 58%, #07050d); }
a { color: inherit; }
.site-nav { min-height: 76px; padding: 0 5vw; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); background: rgba(9,7,15,.82); backdrop-filter: blur(14px); position: sticky; top: 0; z-index: 10; }
.brand { font-family: Outfit, sans-serif; font-size: 1.45rem; font-weight: 800; text-decoration: none; } .brand span { color: var(--accent); }
.site-nav nav { display: flex; align-items: center; gap: 1rem; } .site-nav nav a { color: var(--muted); text-decoration: none; font-weight: 700; } .nav-download { color: #fff !important; border: 1px solid var(--line); border-radius: 999px; padding: .65rem 1rem; background: rgba(255,255,255,.08); }
.hero { min-height: calc(100vh - 76px); display: grid; grid-template-columns: minmax(0,1.05fr) minmax(320px,.95fr); gap: 4rem; align-items: center; padding: 5rem 5vw 4rem; max-width: 1440px; margin: 0 auto; }
.eyebrow { margin: 0 0 1rem; color: var(--accent-2); text-transform: uppercase; font-weight: 800; letter-spacing: .08em; font-size: .82rem; }
h1, h2, h3, strong { font-family: Outfit, sans-serif; } h1 { font-size: clamp(3rem, 7vw, 6.6rem); line-height: .94; letter-spacing: 0; margin: 0 0 1.4rem; max-width: 850px; overflow-wrap: break-word; } .subhead { color: var(--muted); font-size: clamp(1.15rem, 2vw, 1.55rem); max-width: 760px; margin: 0 0 2rem; }
.cta-row { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; } .cta-row.center { justify-content: center; }
.btn { min-height: 54px; display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; padding: 0 1.25rem; text-decoration: none; font-weight: 800; border: 1px solid var(--line); }
.btn.primary { background: #fff; color: #10091b; border-color: #fff; } .btn.secondary { color: #fff; background: rgba(255,255,255,.08); }
.privacy-line { color: var(--soft); font-size: .96rem; margin: 1.3rem 0 0; }
.hero-copy { min-width: 0; }\n.hero-visual { min-height: 440px; min-width: 0; display: grid; place-items: center; } .hero-visual img { width: min(100%, 560px); max-height: 650px; object-fit: contain; border-radius: 28px; box-shadow: 0 28px 90px rgba(0,0,0,.46); }
.proof-strip, .story-section, .comparison-band, .final-cta { max-width: 1180px; margin: 0 auto; padding-left: 5vw; padding-right: 5vw; }
.proof-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; padding-top: 1rem; padding-bottom: 5rem; } .proof-strip div, .feature-card, .comparison-grid div { background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 1.25rem; } .proof-strip strong, .proof-strip span { display: block; } .proof-strip span, .feature-card p, .comparison-grid p, .story-copy p { color: var(--muted); }
.story-section { display: grid; grid-template-columns: .85fr 1.15fr; gap: 2rem; padding-top: 4rem; padding-bottom: 5rem; border-top: 1px solid var(--line); } .story-copy h2, .comparison-band h2, .final-cta h2 { font-size: clamp(2rem, 4vw, 3.6rem); line-height: 1; margin: 0 0 1rem; }
.feature-stack { display: grid; gap: 1rem; } .feature-card h3 { margin: 0 0 .45rem; font-size: 1.35rem; } .feature-card p { margin: 0; }
.comparison-band { padding-top: 4rem; padding-bottom: 5rem; } .comparison-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; } .comparison-grid span { color: var(--soft); font-size: .9rem; } .comparison-grid strong { display: block; font-size: 1.3rem; margin-top: .35rem; } .comparison-grid .featured { border-color: color-mix(in srgb, var(--accent-2), white 12%); background: rgba(122,242,183,.12); }
.final-cta { text-align: center; padding-top: 5rem; padding-bottom: 7rem; border-top: 1px solid var(--line); }
.cookie-banner { position: fixed; left: 1rem; right: 1rem; bottom: -220px; z-index: 20; background: rgba(12,10,18,.96); border: 1px solid var(--line); border-radius: 8px; padding: 1rem; transition: bottom .35s ease; box-shadow: 0 18px 70px rgba(0,0,0,.35); } .cookie-banner.visible { bottom: 1rem; } .cookie-content { max-width: 1080px; margin: 0 auto; display: flex; gap: 1rem; align-items: center; justify-content: space-between; } .cookie-content p { margin: 0; color: var(--muted); } .cookie-actions { display: flex; gap: .75rem; } .btn-cookie-accept, .btn-cookie-deny { border-radius: 999px; padding: .65rem 1rem; font-weight: 800; cursor: pointer; } .btn-cookie-accept { background: #fff; color: #10091b; border: 0; } .btn-cookie-deny { background: transparent; color: #fff; border: 1px solid var(--line); }
@media (max-width: 520px) { .site-nav { min-height: 68px; } .nav-download { font-size: 0 !important; max-width: none; } .nav-download::after { content: "Android"; font-size: .88rem; } }\n@media (max-width: 860px) { .site-nav { padding: 0 .9rem; gap: .75rem; } .brand { font-size: 1.25rem; flex: 0 0 auto; } .site-nav nav { min-width: 0; gap: 0; } .site-nav nav a:first-child { display: none; } .nav-download { max-width: 42vw; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: .55rem .75rem; font-size: .88rem; } .hero { grid-template-columns: minmax(0, 1fr); min-height: auto; padding: 3rem 1rem; gap: 2rem; overflow: hidden; } .hero-copy { width: 100%; overflow: hidden; } h1 { font-size: clamp(2.25rem, 10.4vw, 2.85rem); line-height: 1.04; max-width: 10.5ch; } .subhead { font-size: 1.02rem; max-width: 32ch; } .privacy-line { max-width: 34ch; } .hero-visual { min-height: 0; } .proof-strip, .story-section, .comparison-grid { grid-template-columns: 1fr; } .story-section, .comparison-band, .final-cta, .proof-strip { padding-left: 1rem; padding-right: 1rem; } .cookie-content { flex-direction: column; align-items: stretch; } }
`;

fs.writeFileSync(path.join(outDir, 'styles.css'), css);

for (const variant of variants) {
  const features = variant.features.map(([title, body]) => `<article class="feature-card"><h3>${title}</h3><p>${body}</p></article>`).join('\n        ');
  let html = template;
  const replacements = {
    __VARIANT__: variant.variant,
    __TITLE__: variant.title,
    __DESCRIPTION__: variant.description,
    __BODY_CLASS__: variant.bodyClass,
    __EYEBROW__: variant.eyebrow,
    __H1__: variant.h1,
    __SUBHEAD__: variant.subhead,
    __IMAGE__: variant.image,
    __SECTION_H2__: variant.sectionH2,
    __SECTION_BODY__: variant.sectionBody,
    __FEATURES__: features,
    __COMPARISON_H2__: variant.comparisonH2,
    __FINAL_EYEBROW__: variant.finalEyebrow,
    __FINAL_H2__: variant.finalH2,
  };
  for (const [key, value] of Object.entries(replacements)) {
    html = html.split(key).join(value);
  }
  fs.writeFileSync(path.join(outDir, variant.file), html);
}

const index = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Naptime paid campaign variants</title><link rel="stylesheet" href="/campaigns/paid/styles.css"></head><body><main class="final-cta"><p class="eyebrow">Paid campaign variants</p><h1>Naptime paid campaign pages</h1><div class="feature-stack">${variants.map(v => `<a class="btn secondary" href="/campaigns/paid/${v.file}">${v.variant}</a>`).join('')}</div></main></body></html>`;
fs.writeFileSync(path.join(outDir, 'index.html'), index);
console.log('Built paid campaign pages');





