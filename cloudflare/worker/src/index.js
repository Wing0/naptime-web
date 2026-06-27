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
    { id: "sleep-start", weight: 35, path: "/campaigns/paid/sleep-start.html" },
    { id: "private", weight: 25, path: "/campaigns/paid/private.html" },
    { id: "deadline", weight: 20, path: "/campaigns/paid/deadline.html" },
    { id: "full-nap", weight: 20, path: "/campaigns/paid/full-nap.html" },
  ],
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.hostname === "www.naptime.info") {
      url.hostname = "naptime.info";
      return Response.redirect(url.toString(), 301);
    }

    if (ENABLE_PAID_EXPERIMENT && isPaidLandingPath(url.pathname)) {
      return routeExperiment(request, url, PAID_EXPERIMENT);
    }

    if (ENABLE_FREE_EXPERIMENT && isFreeLandingPath(url.pathname)) {
      return routeExperiment(request, url, FREE_EXPERIMENT);
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

async function routeExperiment(request, url, experiment) {
  const variant = chooseVariant(request, url, experiment);
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
