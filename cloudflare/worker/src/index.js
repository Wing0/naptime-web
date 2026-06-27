const FREE_EXPERIMENT = {
  name: "free_landing_v1",
  cookie: "nt_free_landing_v1",
  maxAgeSeconds: 60 * 60 * 24 * 30,
  variants: [
    { id: "sleep-start", weight: 40, path: "/experiments/candidate-sleep-start.html" },
    { id: "full-nap", weight: 25, path: "/experiments/candidate-full-nap.html" },
    { id: "tester-trust", weight: 25, path: "/experiments/candidate-trustworthy-tester.html" },
    { id: "no-wearable", weight: 10, path: "/experiments/candidate-no-wearable.html" },
  ],
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (!isFreeLandingPath(url.pathname)) {
      return fetch(request);
    }

    const variant = chooseVariant(request, url, FREE_EXPERIMENT);
    const originUrl = new URL(request.url);
    originUrl.pathname = variant.path;

    const originRequest = new Request(originUrl, request);
    const response = await fetch(originRequest);
    const headers = new Headers(response.headers);

    headers.set("x-naptime-experiment", FREE_EXPERIMENT.name);
    headers.set("x-naptime-variant", variant.id);
    headers.append("set-cookie", buildCookie(FREE_EXPERIMENT, variant.id));

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

function isFreeLandingPath(pathname) {
  return pathname === "/free.html" || pathname === "/free";
}

function chooseVariant(request, url, experiment) {
  const override = url.searchParams.get("nt_variant");
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
