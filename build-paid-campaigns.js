const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'campaigns', 'paid');
const playUrl = 'https://play.google.com/store/apps/details?id=com.naptime.app';

const template = `<!doctype html>
<html lang="en" data-page-flavor="paid-campaign" data-variant="__VARIANT__">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-M9EH844KS8"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500
    });
    gtag('js', new Date());
    gtag('config', 'G-M9EH844KS8', {
      anonymize_ip: true,
      send_page_view: false
    });
  </script>

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
    <nav class="nav-actions">
      <a class="nav-cta secondary" href="/" data-analytics-event="learn_more_click" data-cta-location="nav">Learn more</a>
      <a class="nav-cta primary nav-download" href="${playUrl}" data-analytics-event="play_store_click" data-cta-location="nav" target="_blank" rel="noopener">Download for Android</a>
    </nav>
  </header>

  <main>
    <section class="hero">
      <div class="hero-copy">
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

    <section class="signal-strip" aria-label="Product highlights">
      <div><strong>Sleep-first timer</strong><p>The countdown begins after sleep is detected.</p></div>
      <div><strong>Phone only</strong><p>No wearable or account needed.</p></div>
      <div><strong>Hard cutoff</strong><p>Wake by your latest safe time.</p></div>
    </section>

    <section class="story-section">
      <div class="story-copy">
        <h2>__SECTION_H2__</h2>
        <p>__SECTION_BODY__</p>
        <ol class="flow-list">
          __FLOW__
        </ol>
      </div>
      <div class="secondary-visual" aria-hidden="true">
        <img src="__SECONDARY_IMAGE__" alt="" loading="lazy" decoding="async">
      </div>
    </section>

    <section class="use-case-band">
      <div class="use-case-copy">
        <h2>__USE_CASE_H2__</h2>
        <p>__USE_CASE_BODY__</p>
      </div>
      <div class="feature-pair">
        __FEATURES__
      </div>
    </section>

    <section class="comparison-band">
      <div class="comparison-copy">
        <h2>__COMPARISON_H2__</h2>
        <p>Regular timers are fine when awake time does not matter. Naptime is for short rest windows where falling asleep late should not erase the nap.</p>
      </div>
      <div class="comparison-rail" aria-label="Regular timer compared with Naptime">
        <div><span>Regular timer</span><strong>Starts when you tap Start.</strong></div>
        <div class="featured"><span>Naptime</span><strong>Starts after sleep begins.</strong></div>
      </div>
    </section>

    <section class="final-cta">
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
    h1: 'The alarm that starts after you fall asleep.',
    subhead: 'Set a 20-minute nap. Naptime starts the countdown after sleep is detected, so settling in does not steal the rest you planned.',
    image: '/hero_bed_2_960.jpg',
    secondaryImage: '/screenshot_monitoring.png',
    sectionH2: 'Built for the part normal timers miss',
    sectionBody: 'Most nap timers start when you tap Start. Naptime listens for the stillness of sleep, then wakes you by your chosen nap length or your latest safe deadline.',
    useCaseH2: 'For short rest that needs to stay short',
    useCaseBody: 'Use it between classes, before a meeting, after a rough night, or anywhere you want real rest without guessing how long it took to fall asleep.',
    comparisonH2: 'A focused alternative to generic sleep apps',
    finalH2: 'Get the sleep time you actually asked for.',
    flow: [
      'Choose your nap length and latest wake time.',
      'Place your phone on the mattress.',
      'Naptime starts the countdown when sleep is detected.'
    ],
    features: [
      ['True-duration naps', 'A 20-minute nap means roughly 20 minutes asleep, not 20 minutes since you opened the app.'],
      ['On-device paid app', 'No account, no subscription, and no anonymous session uploads in the paid version.']
    ]
  },
  {
    file: 'private.html',
    variant: 'private',
    bodyClass: 'theme-private',
    title: 'Naptime for Android - Private sleep insights, no account',
    description: 'Paid Android nap and sleep tracking with all session data kept on your device. No account, no wearable, no anonymous uploads.',
    h1: 'Sleep insights without an account or wearable.',
    subhead: 'Naptime helps you time naps around when sleep begins, then keeps your nap and night history privately on your Android device.',
    image: '/screenshot_nap_analytics.png',
    secondaryImage: '/feat_analytics.png',
    sectionH2: 'Private by purchase, practical by design',
    sectionBody: 'Tags, ratings, latency, efficiency, and night sleep trends help you understand your rest without creating a cloud sleep profile.',
    useCaseH2: 'Your sleep notes should not need a login',
    useCaseBody: 'Track what changed: coffee, stress, workouts, noise, room temperature, or anything else you suspect affects rest.',
    comparisonH2: 'Insight without another account',
    finalH2: 'Own your rest data from the first nap.',
    flow: [
      'Start a nap or night session.',
      'Rate how you feel after waking.',
      'Review patterns locally on your phone.'
    ],
    features: [
      ['No account', 'Open the app and start. No sign-up flow before rest.'],
      ['Useful tags', 'Mark coffee, workout, stress, noisy room, or window open and compare patterns.']
    ]
  },
  {
    file: 'deadline.html',
    variant: 'deadline',
    bodyClass: 'theme-deadline',
    title: 'Naptime for Android - Smart naps with a hard wake deadline',
    description: 'A deadline-safe Android nap alarm for lunch breaks, shift work, study sessions, and pre-meeting recovery.',
    h1: 'A smarter nap that still respects your calendar.',
    subhead: 'Naptime can wait for sleep before counting down, but it still wakes you by your hard cutoff if sleep takes too long.',
    image: '/naptime_hero_mockup.png',
    secondaryImage: '/feat_alarm.png',
    sectionH2: 'For naps that cannot accidentally expand',
    sectionBody: 'Use Naptime when you want real rest but still need to be back for a meeting, class, pickup, shift, or training block.',
    useCaseH2: 'A nap alarm with boundaries',
    useCaseBody: 'You can let the app protect your sleep time without giving it permission to overrun the rest of your day.',
    comparisonH2: 'Smart timing, strict boundary',
    finalH2: 'Rest better without gambling with your schedule.',
    flow: [
      'Set the nap you want.',
      'Add the latest time you can wake up.',
      'Sleep if you can; wake on time either way.'
    ],
    features: [
      ['Latest wake time', 'Even if sleep is not detected, the alarm fires by your cutoff.'],
      ['Quiet dark UI', 'Designed to sit beside you without lighting up the room.']
    ]
  },
  {
    file: 'full-nap.html',
    variant: 'full-nap',
    bodyClass: 'theme-warm',
    title: 'Naptime for Android - Stop losing nap time while awake',
    description: 'A paid Android smart nap alarm that protects your planned rest duration and keeps session data on-device.',
    h1: 'Stop losing nap time while you are still awake.',
    subhead: 'If it takes 15 minutes to fall asleep, a normal timer burns most of your break. Naptime starts counting after sleep begins.',
    image: '/hero_bed_2_960.jpg',
    secondaryImage: '/feat_tracking.png',
    sectionH2: 'A tiny upgrade to a very common failure',
    sectionBody: 'The value is simple: Naptime protects actual sleep time. Night tracking, tags, and ratings are there to help you learn what makes that rest better.',
    useCaseH2: 'Better than guessing what happened',
    useCaseBody: 'See latency, sleep efficiency, tags, and how you felt afterward, so your ideal nap length becomes personal instead of theoretical.',
    comparisonH2: 'Simple promise, real difference',
    finalH2: 'Make short rest less accidental.',
    flow: [
      'Pick the rest you want.',
      'Let Naptime detect when sleep begins.',
      'Wake after the nap, not after the attempt.'
    ],
    features: [
      ['Sleep-start countdown', 'Your nap starts after sleep begins, not while you are still awake.'],
      ['One-time purchase', 'No subscription, no account, and no anonymous session uploads in the paid app.']
    ]
  },
  {
    file: 'caffeine-alternative.html',
    variant: 'caffeine-alternative',
    bodyClass: 'theme-caffeine',
    title: 'Naptime for Android - Recharge without another caffeine hit',
    description: 'A private Android smart nap alarm for people who want a short reset instead of another coffee or energy drink.',
    h1: 'Recharge without another caffeine hit.',
    subhead: 'When your energy dips, a short nap can be cleaner than stacking coffee or energy drinks. Naptime helps you turn a small break into actual sleep.',
    image: '/hero_bed_2_960.jpg',
    secondaryImage: '/screenshot_monitoring.png',
    sectionH2: 'A calmer reset for the afternoon slump',
    sectionBody: 'Caffeine can keep you going, but it can also linger. Naptime is for the moments when you would rather rest briefly, wake on time, and continue without guessing whether you actually slept.',
    useCaseH2: 'Use rest as the first option',
    useCaseBody: 'Try it before a late coffee, between study blocks, after lunch, or before an evening shift when you need a reset that does not push against bedtime.',
    comparisonH2: 'Different tool, different kind of energy',
    finalH2: 'Make your next break restore you.',
    flow: [
      'Choose a short nap and a latest wake time.',
      'Put your phone on the mattress.',
      'Naptime starts counting once sleep is detected.'
    ],
    features: [
      ['Nap before stimulant', 'Give your body a chance to recover before reaching for another coffee or energy drink.'],
      ['Wake without drift', 'A hard cutoff helps a quick reset stay compatible with work, class, and bedtime.']
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
html, body { max-width: 100%; overflow-x: hidden; }
body { margin: 0; color: var(--text); background: var(--bg); line-height: 1.5; }
body::before { content: ""; position: fixed; inset: 0; z-index: -1; background: radial-gradient(circle at 12% 16%, rgba(139,45,242,.42), transparent 28%), radial-gradient(circle at 92% 8%, rgba(114,215,255,.22), transparent 25%), linear-gradient(145deg, #07050d, #13091c 58%, #07050d); }
.theme-private::before { background: radial-gradient(circle at 15% 18%, rgba(122,242,183,.28), transparent 27%), radial-gradient(circle at 88% 80%, rgba(139,45,242,.42), transparent 28%), linear-gradient(145deg, #06110d, #10091b 62%, #08050d); }
.theme-deadline::before { background: radial-gradient(circle at 13% 78%, rgba(114,215,255,.32), transparent 26%), radial-gradient(circle at 88% 18%, rgba(139,45,242,.44), transparent 31%), linear-gradient(145deg, #050b13, #10101d 60%, #07050e); }
.theme-warm::before { background: radial-gradient(circle at 12% 12%, rgba(255,211,106,.30), transparent 24%), radial-gradient(circle at 86% 82%, rgba(139,45,242,.46), transparent 30%), linear-gradient(145deg, #100a05, #13091b 58%, #07050d); }
.theme-caffeine::before { background: radial-gradient(circle at 16% 14%, rgba(122,242,183,.28), transparent 25%), radial-gradient(circle at 90% 82%, rgba(255,211,106,.24), transparent 28%), linear-gradient(145deg, #06100d, #15100b 58%, #08050d); }
a { color: inherit; }
.site-nav { min-height: 76px; padding: 0 5vw; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); background: rgba(9,7,15,.82); backdrop-filter: blur(14px); position: sticky; top: 0; z-index: 10; }
.brand { font-family: Outfit, sans-serif; font-size: 1.45rem; font-weight: 800; text-decoration: none; }
.brand span { color: var(--accent); }
.nav-actions { display: flex; align-items: center; gap: .65rem; }
.nav-cta { min-height: 42px; display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; padding: 0 1rem; text-decoration: none; font-weight: 800; border: 1px solid var(--line); }
.nav-cta.primary { background: #fff; color: #10091b; border-color: #fff; }
.nav-cta.secondary { color: #fff; background: rgba(255,255,255,.08); }
.hero { min-height: calc(100vh - 76px); display: grid; grid-template-columns: minmax(0,1.05fr) minmax(320px,.95fr); gap: 4rem; align-items: center; padding: 5rem 5vw 4rem; max-width: 1440px; margin: 0 auto; }
h1, h2, h3, strong { font-family: Outfit, sans-serif; }
h1 { font-size: clamp(3rem, 7vw, 6.6rem); line-height: .94; letter-spacing: 0; margin: 0 0 1.4rem; max-width: 850px; overflow-wrap: break-word; }
.subhead { color: var(--muted); font-size: clamp(1.15rem, 2vw, 1.55rem); max-width: 760px; margin: 0 0 2rem; }
.cta-row { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
.cta-row.center { justify-content: center; }
.btn { min-height: 54px; display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; padding: 0 1.25rem; text-decoration: none; font-weight: 800; border: 1px solid var(--line); }
.btn.primary { background: #fff; color: #10091b; border-color: #fff; }
.btn.secondary { color: #fff; background: rgba(255,255,255,.08); }
.privacy-line { color: var(--soft); font-size: .96rem; margin: 1.3rem 0 0; }
.hero-copy { min-width: 0; }
.hero-visual { min-height: 440px; min-width: 0; display: grid; place-items: center; }
.hero-visual img { width: min(100%, 560px); max-height: 650px; object-fit: contain; border-radius: 28px; box-shadow: 0 28px 90px rgba(0,0,0,.46); }
.signal-strip, .story-section, .use-case-band, .comparison-band, .final-cta { max-width: 1180px; margin: 0 auto; padding-left: 5vw; padding-right: 5vw; }
.signal-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; padding-top: 1rem; padding-bottom: 4.5rem; }
.signal-strip div { border-top: 1px solid var(--line); padding-top: 1rem; }
.signal-strip strong { display: block; }
.signal-strip p { margin: .25rem 0 0; }
.signal-strip p, .feature-card p, .comparison-copy p, .story-copy p, .use-case-copy p { color: var(--muted); }
.story-section { display: grid; grid-template-columns: .95fr 1.05fr; gap: 3rem; align-items: center; padding-top: 4rem; padding-bottom: 5rem; border-top: 1px solid var(--line); }
.story-copy h2, .use-case-copy h2, .comparison-copy h2, .final-cta h2 { font-size: clamp(2rem, 4vw, 3.6rem); line-height: 1; margin: 0 0 1rem; }
.flow-list { margin: 2rem 0 0; padding: 0; list-style: none; display: grid; gap: .8rem; counter-reset: flow; }
.flow-list li { counter-increment: flow; display: grid; grid-template-columns: 2.2rem 1fr; gap: .85rem; align-items: start; color: var(--text); }
.flow-list li::before { content: counter(flow); width: 2.2rem; height: 2.2rem; border-radius: 50%; display: grid; place-items: center; color: #10091b; background: var(--accent-2); font-weight: 800; }
.secondary-visual { min-width: 0; display: grid; place-items: center; }
.secondary-visual img { width: min(100%, 520px); max-height: 520px; object-fit: contain; border-radius: 24px; box-shadow: 0 22px 70px rgba(0,0,0,.38); }
.use-case-band { display: grid; grid-template-columns: .9fr 1.1fr; gap: 2rem; align-items: start; padding-top: 4rem; padding-bottom: 4rem; border-top: 1px solid var(--line); }
.feature-pair { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.feature-card { background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 1.25rem; }
.feature-card h3 { margin: 0 0 .45rem; font-size: 1.35rem; }
.feature-card p { margin: 0; }
.comparison-band { display: grid; grid-template-columns: .9fr 1.1fr; gap: 2rem; align-items: center; padding-top: 4rem; padding-bottom: 5rem; border-top: 1px solid var(--line); }
.comparison-rail { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: rgba(255,255,255,.06); }
.comparison-rail div { padding: 1.35rem; }
.comparison-rail div + div { border-left: 1px solid var(--line); }
.comparison-rail span { color: var(--soft); font-size: .9rem; }
.comparison-rail strong { display: block; font-size: 1.35rem; margin-top: .35rem; }
.comparison-rail .featured { background: rgba(122,242,183,.14); }
.final-cta { text-align: center; padding-top: 5rem; padding-bottom: 7rem; border-top: 1px solid var(--line); }
.final-cta .cta-row { margin-top: 2rem; }
.cookie-banner { position: fixed; left: 1rem; right: 1rem; bottom: -220px; z-index: 20; background: rgba(12,10,18,.96); border: 1px solid var(--line); border-radius: 8px; padding: 1rem; transition: bottom .35s ease; box-shadow: 0 18px 70px rgba(0,0,0,.35); }
.cookie-banner.visible { bottom: 1rem; }
.cookie-content { max-width: 1080px; margin: 0 auto; display: flex; gap: 1rem; align-items: center; justify-content: space-between; }
.cookie-content p { margin: 0; color: var(--muted); }
.cookie-actions { display: flex; gap: .75rem; }
.btn-cookie-accept, .btn-cookie-deny { border-radius: 999px; padding: .65rem 1rem; font-weight: 800; cursor: pointer; }
.btn-cookie-accept { background: #fff; color: #10091b; border: 0; }
.btn-cookie-deny { background: transparent; color: #fff; border: 1px solid var(--line); }
@media (max-width: 860px) { .site-nav { padding: 0 .9rem; gap: .75rem; } .brand { font-size: 1.25rem; flex: 0 0 auto; } .nav-actions { min-width: 0; gap: .5rem; } .nav-cta { padding: 0 .8rem; font-size: .88rem; } .nav-download { max-width: 42vw; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .hero { grid-template-columns: minmax(0, 1fr); min-height: auto; padding: 3rem 1rem; gap: 2rem; overflow: hidden; } .hero-copy { width: 100%; overflow: hidden; } h1 { font-size: clamp(2.25rem, 10.4vw, 2.85rem); line-height: 1.04; max-width: 10.5ch; } .subhead { font-size: 1.02rem; max-width: 32ch; } .privacy-line { max-width: 34ch; } .hero-visual { min-height: 0; } .signal-strip, .story-section, .use-case-band, .comparison-band, .feature-pair, .comparison-rail { grid-template-columns: 1fr; } .comparison-rail div + div { border-left: 0; border-top: 1px solid var(--line); } .story-section, .use-case-band, .comparison-band, .final-cta, .signal-strip { padding-left: 1rem; padding-right: 1rem; } .cookie-content { flex-direction: column; align-items: stretch; } }
@media (max-width: 520px) { .site-nav { min-height: 68px; justify-content: flex-start; position: sticky; } .nav-actions { position: absolute; right: .9rem; top: 50%; transform: translateY(-50%); } .nav-cta.secondary { display: none; } .nav-cta.nav-download { font-size: 0 !important; width: auto; max-width: none; min-width: 84px; padding-left: .95rem; padding-right: .95rem; flex: 0 0 auto; } .nav-cta.nav-download::after { content: "Android"; font-size: .88rem; } }`;

fs.writeFileSync(path.join(outDir, 'styles.css'), css);

for (const variant of variants) {
  const features = variant.features.map(([title, body]) => `<article class="feature-card"><h3>${title}</h3><p>${body}</p></article>`).join('\n        ');
  const flow = variant.flow.map(item => `<li>${item}</li>`).join('\n          ');
  let html = template;
  const replacements = {
    __VARIANT__: variant.variant,
    __TITLE__: variant.title,
    __DESCRIPTION__: variant.description,
    __BODY_CLASS__: variant.bodyClass,
    __H1__: variant.h1,
    __SUBHEAD__: variant.subhead,
    __IMAGE__: variant.image,
    __SECONDARY_IMAGE__: variant.secondaryImage,
    __SECTION_H2__: variant.sectionH2,
    __SECTION_BODY__: variant.sectionBody,
    __FLOW__: flow,
    __USE_CASE_H2__: variant.useCaseH2,
    __USE_CASE_BODY__: variant.useCaseBody,
    __FEATURES__: features,
    __COMPARISON_H2__: variant.comparisonH2,
    __FINAL_H2__: variant.finalH2,
  };
  for (const [key, value] of Object.entries(replacements)) {
    html = html.split(key).join(value);
  }
  fs.writeFileSync(path.join(outDir, variant.file), html);
}

const index = `<!doctype html><html lang="en" data-page-flavor="paid-campaign-index" data-variant="campaign-index"><head><script async src="https://www.googletagmanager.com/gtag/js?id=G-M9EH844KS8"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});gtag('js',new Date());gtag('config','G-M9EH844KS8',{anonymize_ip:true,send_page_view:false});</script><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Naptime paid campaign variants</title><link rel="stylesheet" href="/campaigns/paid/styles.css"><script src="/analytics.js" defer></script></head><body><main class="final-cta"><h1>Naptime paid campaign pages</h1><div class="feature-pair">${variants.map(v => `<a class="btn secondary" href="/campaigns/paid/${v.file}">${v.variant}</a>`).join('')}</div></main></body></html>`;
fs.writeFileSync(path.join(outDir, 'index.html'), index);
console.log('Built paid campaign pages');



