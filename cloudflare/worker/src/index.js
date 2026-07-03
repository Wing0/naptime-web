const ENABLE_FREE_EXPERIMENT = false;
const ENABLE_PAID_EXPERIMENT = true;

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

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 8192) {
    return new Response("Payload too large", { status: 413 });
  }

  let payload = {};
  try {
    payload = await request.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const event = buildClientEvent(request, url, payload);
  console.log(JSON.stringify(event));
  writeAnalyticsEvent(env, event);

  return new Response(null, {
    status: 204,
    headers: {
      "cache-control": "no-store",
    },
  });
}

async function routeExperiment(request, url, experiment, env, ctx) {
  const variant = chooseVariant(request, url, experiment);
  logLandingEvent(request, url, experiment, variant, env, ctx);
  const originUrl = new URL(request.url);
  originUrl.pathname = variant.path;

  const originRequest = new Request(originUrl, request);
  const response = await fetch(originRequest);
  const headers = new Headers(response.headers);

  headers.set("x-naptime-experiment", experiment.name);
  headers.set("x-naptime-variant", variant.id);
  headers.append("set-cookie", buildCookie(experiment, variant.id));

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
  const source = cleanValue(payload.utm_source || payload.source || "");
  const hasRdtCid = payload.rdt_cid === "present" || payload.rdtCid === "present" || Boolean(payload.rdt_cid);

  return {
    event: cleanValue(payload.event || "client_event"),
    host: url.hostname,
    path: cleanPath(payload.page_path || payload.path || ""),
    experiment: cleanValue(payload.experiment_name || ""),
    variant: cleanValue(payload.landing_variant || payload.content_variant || payload.experiment_variant || ""),
    source,
    medium: cleanValue(payload.utm_medium || ""),
    campaign: cleanValue(payload.utm_campaign || ""),
    campaignId: cleanValue(payload.utm_id || ""),
    adContent: cleanValue(payload.utm_content || ""),
    rdtCid: hasRdtCid ? "present" : "missing",
    traffic: source === "reddit" || hasRdtCid ? "reddit_related" : "non_reddit",
    country: cf.country || "",
    colo: cf.colo || "",
    device: getDeviceBucket(userAgent),
    browser: getBrowserBucket(userAgent),
    ctaLocation: cleanValue(payload.cta_location || ""),
    linkType: cleanValue(payload.link_type || ""),
    destinationHost: cleanValue(payload.destination_host || ""),
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

function cleanValue(value) {
  return String(value || "")
    .replace(/[\r\n\t]/g, " ")
    .slice(0, 180);
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
  ].join("; ");
}
