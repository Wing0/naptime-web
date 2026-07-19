const ENABLE_FREE_EXPERIMENT = false;
const ENABLE_PAID_EXPERIMENT = true;
const MAX_EVENT_BYTES = 4096;
const MAX_EVENTS_PER_MINUTE = 30;
const EVENT_DEDUPLICATION_SECONDS = 20;
const ALLOWED_EVENTS = new Set([
  "page_view",
  "play_store_click",
  "learn_more_click",
  "navigation_click",
  "anchor_navigation",
  "outbound_click",
  "early_access_click",
  "consent_choice",
]);
const ALLOWED_CTA_LOCATIONS = new Set(["hero", "nav", "nav-logo", "download-section", "final", "cookie-banner", "auto", "explicit"]);
const ALLOWED_LINK_TYPES = new Set(["app_store", "internal", "outbound", "anchor"]);

const FREE_EXPERIMENT = {
  name: "free_landing_v1",
  cookie: "nt_free_landing_v1",
  overrideParam: "nt_variant",
  maxAgeSeconds: 60 * 60 * 24 * 30,
  variants: [
    { id: "sleep-start", weight: 40, path: "/experiments/candidate-sleep-start.html" },
    { id: "full-nap", weight: 25, path: "/experiments/candidate-full-nap.html" },
    { id: "tester-trust", weight: 25, path: "/experiments/candidate-trustworthy-tester.html" },
    { id: "no-wearable", weight: 10, path: "/experiments/candidate-no-wearable.html" },
  ],
};

const PAID_EXPERIMENT = {
  name: "paid_reddit_landing_v1",
  cookie: "nt_paid_landing_v1",
  overrideParam: "nt_paid_variant",
  maxAgeSeconds: 60 * 60 * 24 * 30,
  variants: [
    { id: "sleep-start", weight: 30, path: "/campaigns/paid/sleep-start.html" },
    { id: "private", weight: 22, path: "/campaigns/paid/private.html" },
    { id: "deadline", weight: 18, path: "/campaigns/paid/deadline.html" },
    { id: "full-nap", weight: 18, path: "/campaigns/paid/full-nap.html" },
    { id: "caffeine-alternative", weight: 12, path: "/campaigns/paid/caffeine-alternative.html" },
  ],
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.hostname === "www.naptime.info") {
      url.hostname = "naptime.info";
      return Response.redirect(url.toString(), 301);
    }

    if (isEventPath(url.pathname)) {
      return handleClientEvent(request, url, env);
    }

    if (ENABLE_PAID_EXPERIMENT && isPaidLandingPath(url.pathname)) {
      return routeExperiment(request, url, PAID_EXPERIMENT, env, ctx);
    }

    if (ENABLE_FREE_EXPERIMENT && isFreeLandingPath(url.pathname)) {
      return routeExperiment(request, url, FREE_EXPERIMENT, env, ctx);
    }

    return fetch(request);
  },
};

function isPaidLandingPath(pathname) {
  return pathname === "/android" || pathname === "/android.html";
}

function isFreeLandingPath(pathname) {
  return pathname === "/free.html" || pathname === "/free";
}

function isEventPath(pathname) {
  return pathname === "/__nt_event";
}

async function handleClientEvent(request, url, env) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!isSameSiteRequest(request, url)) {
    return new Response("Forbidden", { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_EVENT_BYTES) {
    return new Response("Payload too large", { status: 413 });
  }

  let payload = {};
  try {
    payload = await readJsonBody(request, MAX_EVENT_BYTES);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const event = buildClientEvent(request, url, payload);
  if (!event) {
    return new Response("Invalid event", { status: 400 });
  }
  if (await isRateLimited(request, MAX_EVENTS_PER_MINUTE)) {
    return new Response("Too many requests", { status: 429 });
  }
  if (await isDuplicateEvent(request, event)) {
    return emptyEventResponse();
  }
  console.log(JSON.stringify(event));
  writeAnalyticsEvent(env, event);

  return emptyEventResponse();
}

async function routeExperiment(request, url, experiment, env, ctx) {
  if (!isEligibleExperimentRequest(request, url, experiment)) {
    return fetch(request);
  }
  const variant = chooseVariant(request, url, experiment);
  const forcedVariant = hasForcedVariant(url, experiment);
  if (!forcedVariant) {
    logLandingEvent(request, url, experiment, variant, env, ctx);
  }
  const originUrl = new URL(request.url);
  originUrl.pathname = variant.path;

  const originHeaders = new Headers(request.headers);
  originHeaders.set("cache-control", "no-cache");
  const originRequest = new Request(originUrl, {
    method: request.method,
    headers: originHeaders,
    body: request.body,
    redirect: request.redirect,
  });
  const response = await fetch(originRequest);
  const headers = new Headers(response.headers);

  if (hasAnalyticsConsent(request)) {
    headers.set("x-naptime-experiment", experiment.name);
    headers.set("x-naptime-variant", variant.id);
    headers.append("set-cookie", buildCookie(experiment, variant.id));
  } else {
    headers.append("set-cookie", clearCookie(experiment.cookie));
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function logLandingEvent(request, url, experiment, variant, env, ctx) {
  const event = buildLandingEvent(request, url, experiment, variant);
  console.log(JSON.stringify(event));

  if (env?.LANDING_ANALYTICS) {
    writeAnalyticsEvent(env, event);
  }

  if (env?.LANDING_COUNTS) {
    const counterWrite = incrementLandingCounters(env.LANDING_COUNTS, event).catch((error) => {
      console.log(JSON.stringify({
        event: "landing_counter_error",
        message: error?.message || "unknown_error",
      }));
    });
    ctx?.waitUntil(counterWrite);
  }
}

function buildLandingEvent(request, url, experiment, variant) {
  const userAgent = request.headers.get("user-agent") || "";
  const cf = request.cf || {};
  const isRedditTraffic = url.searchParams.get("utm_source") === "reddit" || url.searchParams.has("rdt_cid");

  return {
    event: "landing_arrival",
    host: url.hostname,
    path: url.pathname,
    experiment: experiment.name,
    variant: variant.id,
    source: url.searchParams.get("utm_source") || "",
    medium: url.searchParams.get("utm_medium") || "",
    campaign: url.searchParams.get("utm_campaign") || "",
    campaignId: url.searchParams.get("utm_id") || "",
    adContent: url.searchParams.get("utm_content") || "",
    rdtCid: url.searchParams.has("rdt_cid") ? "present" : "missing",
    traffic: isRedditTraffic ? "reddit_related" : "non_reddit",
    country: cf.country || "",
    colo: cf.colo || "",
    device: getDeviceBucket(userAgent),
    browser: getBrowserBucket(userAgent),
    ctaLocation: "",
    linkType: "",
    destinationHost: "",
    destinationPath: "",
  };
}

function buildClientEvent(request, url, payload) {
  const userAgent = request.headers.get("user-agent") || "";
  const cf = request.cf || {};
  const eventName = cleanValue(payload.event || "");
  if (!ALLOWED_EVENTS.has(eventName)) return null;
  const source = cleanDimension(payload.utm_source || payload.source || "");
  const hasRdtCid = payload.rdt_cid === "present" || payload.rdtCid === "present" || Boolean(payload.rdt_cid);
  const ctaLocation = cleanValue(payload.cta_location || "");
  const linkType = cleanValue(payload.link_type || "");
  if (ctaLocation && !ALLOWED_CTA_LOCATIONS.has(ctaLocation)) return null;
  if (linkType && !ALLOWED_LINK_TYPES.has(linkType)) return null;
  const experiment = getServerExperiment(request);

  return {
    event: eventName,
    host: url.hostname,
    path: cleanPath(payload.page_path || payload.path || ""),
    experiment: experiment.name,
    variant: experiment.variant,
    source,
    medium: cleanDimension(payload.utm_medium || ""),
    campaign: cleanDimension(payload.utm_campaign || ""),
    campaignId: cleanDimension(payload.utm_id || ""),
    adContent: cleanDimension(payload.utm_content || ""),
    rdtCid: hasRdtCid ? "present" : "missing",
    traffic: source === "reddit" || hasRdtCid ? "reddit_related" : "non_reddit",
    country: cf.country || "",
    colo: cf.colo || "",
    device: getDeviceBucket(userAgent),
    browser: getBrowserBucket(userAgent),
    ctaLocation,
    linkType,
    destinationHost: cleanDestinationHost(payload.destination_host || ""),
    destinationPath: cleanPath(payload.destination_path || ""),
  };
}

function writeAnalyticsEvent(env, event) {
  if (!env?.LANDING_ANALYTICS) return;

  try {
    env.LANDING_ANALYTICS.writeDataPoint({
      indexes: [`${event.experiment || "none"}|${event.source || "none"}`],
      blobs: [
        event.event,
        event.host,
        event.path,
        event.experiment,
        event.variant,
        event.source,
        event.medium,
        event.campaign,
        event.campaignId,
        event.adContent,
        event.rdtCid,
        event.traffic,
        event.country,
        event.colo,
        event.device,
        event.browser,
        event.ctaLocation,
        event.linkType,
        event.destinationHost,
        event.destinationPath,
      ],
      doubles: [1],
    });
  } catch (error) {
    console.log(JSON.stringify({
      event: "landing_analytics_error",
      message: error?.message || "unknown_error",
    }));
  }
}

function emptyEventResponse() {
  return new Response(null, {
    status: 204,
    headers: { "cache-control": "no-store" },
  });
}

function isSameSiteRequest(request, url) {
  const origin = request.headers.get("origin");
  if (origin) return origin === url.origin;
  const referer = request.headers.get("referer");
  if (!referer) return false;
  try {
    return new URL(referer).origin === url.origin;
  } catch {
    return false;
  }
}

async function readJsonBody(request, maxBytes) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing request body");
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) throw new RangeError("Payload too large");
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

function isEligibleExperimentRequest(request) {
  // Forced variants are still valid landing requests. They are excluded from
  // arrival analytics in routeExperiment(), but must reach their experiment
  // page instead of falling through to GitHub Pages' nonexistent /android file.
  return request.method === "GET" && !isBot(request);
}

function isBot(request) {
  return /bot|crawler|spider|headless|lighthouse|facebookexternalhit|preview/i.test(request.headers.get("user-agent") || "");
}

function hasForcedVariant(url, experiment) {
  const override = url.searchParams.get(experiment.overrideParam) || url.searchParams.get("nt_variant");
  return experiment.variants.some((variant) => variant.id === override);
}

function hasAnalyticsConsent(request) {
  return parseCookies(request.headers.get("cookie") || "").naptime_analytics_consent === "granted";
}

function getServerExperiment(request) {
  const cookieVariant = parseCookies(request.headers.get("cookie") || "")[PAID_EXPERIMENT.cookie];
  const variant = PAID_EXPERIMENT.variants.find((candidate) => candidate.id === cookieVariant);
  return variant ? { name: PAID_EXPERIMENT.name, variant: variant.id } : { name: PAID_EXPERIMENT.name, variant: "" };
}

async function isRateLimited(request, limit) {
  const key = await analyticsCacheKey(request, "rate");
  if (!key) return false;
  const cached = await caches.default.match(key);
  const count = Number(cached?.headers.get("x-naptime-count") || "0");
  if (count >= limit) return true;
  await caches.default.put(key, new Response(null, {
    headers: {
      "cache-control": "public, max-age=60",
      "x-naptime-count": String(count + 1),
    },
  }));
  return false;
}

async function isDuplicateEvent(request, event) {
  const fingerprint = [event.event, event.path, event.ctaLocation, event.destinationHost, event.destinationPath].join("|");
  const key = await analyticsCacheKey(request, `dedupe:${fingerprint}`);
  if (!key) return false;
  if (await caches.default.match(key)) return true;
  await caches.default.put(key, new Response(null, {
    headers: { "cache-control": `public, max-age=${EVENT_DEDUPLICATION_SECONDS}` },
  }));
  return false;
}

async function analyticsCacheKey(request, suffix) {
  const ip = request.headers.get("CF-Connecting-IP");
  if (!ip) return null;
  const input = new TextEncoder().encode(`${ip}|${suffix}`);
  const digest = await crypto.subtle.digest("SHA-256", input);
  const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return new Request(`https://naptime.info/__nt_analytics_cache/${hash}`);
}

function clearCookie(name) {
  return `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`;
}

function cleanValue(value) {
  return String(value || "")
    .replace(/[\r\n\t]/g, " ")
    .slice(0, 180);
}

function cleanDimension(value) {
  return cleanValue(value).toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 80);
}

function cleanDestinationHost(value) {
  const host = cleanValue(value).toLowerCase();
  return ["", "naptime.info", "www.naptime.info", "play.google.com"].includes(host) ? host : "";
}

function cleanPath(value) {
  const cleaned = cleanValue(value);
  if (!cleaned) return "";
  try {
    const parsed = new URL(cleaned, "https://naptime.info");
    return parsed.pathname;
  } catch {
    return cleaned.startsWith("/") ? cleaned.split("?")[0] : "";
  }
}

async function incrementLandingCounters(namespace, event) {
  const date = new Date().toISOString().slice(0, 10);
  const dimensions = [
    ["total", "all"],
    ["source", event.source || "none"],
    ["variant", event.variant],
    ["campaign_id", event.campaignId || "none"],
    ["ad_content", event.adContent || "none"],
    ["rdt_cid", event.rdtCid],
    ["country", event.country || "unknown"],
    ["device", event.device],
    ["browser", event.browser],
    ["variant_source", `${event.variant}|${event.source || "none"}`],
  ];

  await Promise.all(dimensions.map(([name, value]) => incrementCounter(namespace, `landing:${date}:${name}:${value}`)));
}

async function incrementCounter(namespace, key) {
  const current = Number(await namespace.get(key)) || 0;
  await namespace.put(key, String(current + 1), { expirationTtl: 60 * 60 * 24 * 45 });
}

function getDeviceBucket(userAgent) {
  if (/Android/i.test(userAgent)) return "android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Mobile/i.test(userAgent)) return "mobile_other";
  return "desktop";
}

function getBrowserBucket(userAgent) {
  if (/Reddit/i.test(userAgent)) return "reddit_in_app";
  if (/CriOS|Chrome/i.test(userAgent)) return "chrome";
  if (/Firefox|FxiOS/i.test(userAgent)) return "firefox";
  if (/Safari/i.test(userAgent)) return "safari";
  return "other";
}

function chooseVariant(request, url, experiment) {
  const override = url.searchParams.get(experiment.overrideParam) || url.searchParams.get("nt_variant");
  const overrideVariant = experiment.variants.find((variant) => variant.id === override);
  if (overrideVariant) return overrideVariant;

  const cookies = parseCookies(request.headers.get("cookie") || "");
  const cookieVariant = experiment.variants.find((variant) => variant.id === cookies[experiment.cookie]);
  if (cookieVariant) return cookieVariant;

  return weightedPick(experiment.variants);
}

function weightedPick(variants) {
  const total = variants.reduce((sum, variant) => sum + variant.weight, 0);
  let cursor = Math.random() * total;

  for (const variant of variants) {
    cursor -= variant.weight;
    if (cursor <= 0) return variant;
  }

  return variants[variants.length - 1];
}

function parseCookies(cookieHeader) {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        if (index === -1) return [part, ""];
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function buildCookie(experiment, value) {
  return [
    `${experiment.cookie}=${encodeURIComponent(value)}`,
    `Max-Age=${experiment.maxAgeSeconds}`,
    "Path=/",
    "SameSite=Lax",
    "Secure",
    "HttpOnly",
  ].join("; ");
}
