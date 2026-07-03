(function () {
  const consentKey = "naptime_cookie_consent";
  const attributionKey = "naptime_session_attribution";
  const redditPixelId = "a2_izauxup9ioln";
  let redditPixelReady = false;
  let pageViewTracked = false;
  let redditPageVisitSent = false;
  let cloudflarePageViewSent = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };

  if (localStorage.getItem(consentKey) === "granted") {
    updateConsent("granted");
  }

  document.addEventListener("DOMContentLoaded", function () {
    persistAttribution();
    sendPageView();
    bindTrackedLinks();
  });

  window.naptimeAnalytics = {
    event: trackEvent,
    updateConsent,
    sendPageView,
    consentChoice: recordConsentChoice
  };

  function updateConsent(state) {
    const granted = state === "granted";
    gtag("consent", "update", {
      ad_storage: granted ? "granted" : "denied",
      ad_user_data: granted ? "granted" : "denied",
      ad_personalization: granted ? "granted" : "denied",
      analytics_storage: granted ? "granted" : "denied"
    });
    if (granted) {
      initRedditPixel();
      if (pageViewTracked && !redditPageVisitSent) {
        sendRedditPageVisit();
      }
    }
  }

  function sendPageView() {
    pageViewTracked = true;
    setUserProperties();
    trackEvent("page_view", {
      page_title: document.title,
      page_location: location.href,
      page_path: location.pathname,
      engagement_target: "page",
      traffic_source: getParam("utm_source") || "direct"
    });
  }

  function sendGrantedPageView() {
    setUserProperties();
    trackEvent("page_view", {
      page_title: document.title,
      page_location: location.href,
      page_path: location.pathname,
      engagement_target: "page",
      traffic_source: getParam("utm_source") || "direct",
      consent_refresh: "granted_after_accept"
    });
  }

  function setUserProperties() {
    gtag("set", "user_properties", {
      experiment_name: getExperimentName(),
      landing_variant: getContentVariant(),
      page_flavor: getPageFlavor()
    });
  }

  function bindTrackedLinks() {
    document.querySelectorAll("a[href]").forEach(function (element) {
      element.addEventListener("click", function (event) {
        const details = classifyLink(element);
        const shouldDelayNavigation = details.type === "app_store" && !isModifiedClick(event) && !opensNewContext(element);
        if (shouldDelayNavigation) {
          event.preventDefault();
        }
        trackEvent(details.eventName, {
          cta_location: element.dataset.ctaLocation || details.location,
          destination: details.href,
          destination_host: details.host,
          link_text: getLinkText(element),
          link_type: details.type,
          engagement_target: "link"
        });
        if (shouldDelayNavigation) {
          window.setTimeout(function () {
            location.assign(details.href);
          }, 180);
        }
      });
    });
  }

  function recordConsentChoice(state) {
    const granted = state === "granted";
    updateConsent(state);
    trackEvent("consent_choice", {
      consent_choice: granted ? "accept" : "decline",
      cta_location: "cookie-banner",
      engagement_target: "consent"
    });
    if (granted) {
      sendGrantedPageView();
    }
  }

  function classifyLink(element) {
    const rawHref = element.getAttribute("href") || "";
    const href = element.href || rawHref;
    let url = null;
    try {
      url = new URL(href, location.href);
    } catch (error) {
      url = null;
    }

    const explicitEvent = element.dataset.analyticsEvent;
    const isPlayStore = href.includes("play.google.com/store/apps/details");
    const isHash = rawHref.startsWith("#") || (url && url.origin === location.origin && url.pathname === location.pathname && url.hash);
    const isInternal = url ? url.origin === location.origin : !/^https?:/i.test(rawHref);

    if (explicitEvent) {
      return {
        eventName: explicitEvent,
        type: isPlayStore ? "app_store" : isInternal ? "internal" : "outbound",
        location: "explicit",
        href,
        host: url ? url.host : ""
      };
    }
    if (isPlayStore) {
      return { eventName: "play_store_click", type: "app_store", location: "auto", href, host: url ? url.host : "play.google.com" };
    }
    if (isHash) {
      return { eventName: "anchor_navigation", type: "anchor", location: "auto", href, host: url ? url.host : location.host };
    }
    if (isInternal) {
      return { eventName: "navigation_click", type: "internal", location: "auto", href, host: url ? url.host : location.host };
    }
    return { eventName: "outbound_click", type: "outbound", location: "auto", href, host: url ? url.host : "" };
  }

  function trackEvent(name, params) {
    const eventParams = Object.assign(commonParams(), params || {}, {
      transport_type: "beacon"
    });
    trackCloudflareEvent(name, eventParams);
    gtag("event", name, eventParams);
    trackRedditEvent(name, eventParams);
  }

  function trackCloudflareEvent(name, params) {
    if (name === "page_view" && cloudflarePageViewSent) return;
    if (name === "page_view") cloudflarePageViewSent = true;

    const payload = {
      event: name,
      experiment_name: params.experiment_name,
      experiment_variant: params.experiment_variant,
      content_variant: params.content_variant,
      landing_variant: params.landing_variant,
      landing_page_flavor: params.landing_page_flavor,
      page_flavor: params.page_flavor,
      page_path: params.page_path,
      served_path: params.served_path,
      utm_source: params.utm_source,
      utm_medium: params.utm_medium,
      utm_campaign: params.utm_campaign,
      utm_id: params.utm_id,
      utm_content: params.utm_content,
      cta_location: params.cta_location,
      destination_host: params.destination_host,
      destination_path: getDestinationPath(params.destination),
      link_text: (params.link_text || "").slice(0, 80),
      link_type: params.link_type,
      rdt_cid: getParam("rdt_cid") ? "present" : "missing"
    };
    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      const sent = navigator.sendBeacon("/__nt_event", new Blob([body], { type: "application/json" }));
      if (sent) return;
    }

    fetch("/__nt_event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true
    }).catch(function () {});
  }

  function initRedditPixel() {
    if (redditPixelReady) return;
    if (!window.rdt) {
      const rdt = window.rdt = function () {
        rdt.sendEvent ? rdt.sendEvent.apply(rdt, arguments) : rdt.callQueue.push(arguments);
      };
      rdt.callQueue = [];
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.redditstatic.com/ads/pixel.js";
      const firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    }
    window.rdt("init", redditPixelId);
    redditPixelReady = true;
  }

  function trackRedditEvent(name, params) {
    if (!redditPixelReady || typeof window.rdt !== "function") return;
    if (name === "page_view") {
      sendRedditPageVisit(params);
      return;
    }
    if (name === "play_store_click") {
      window.rdt("track", "Lead", redditPayload("play_store_click", params));
      return;
    }
    if (name === "learn_more_click" || name === "navigation_click" || name === "anchor_navigation" || name === "outbound_click") {
      window.rdt("track", "Custom", redditPayload(name, params));
    }
  }

  function sendRedditPageVisit(params) {
    if (!redditPixelReady || typeof window.rdt !== "function" || redditPageVisitSent) return;
    redditPageVisitSent = true;
    window.rdt("track", "PageVisit");
  }

  function redditPayload(eventName, params) {
    return {
      customEventName: eventName,
      conversionId: buildConversionId(eventName, params),
      content_variant: params.content_variant || "",
      landing_variant: params.landing_variant || "",
      page_flavor: params.page_flavor || "",
      cta_location: params.cta_location || "",
      destination: params.destination || "",
      link_type: params.link_type || "",
      utm_source: params.utm_source || "",
      utm_medium: params.utm_medium || "",
      utm_campaign: params.utm_campaign || "",
      utm_id: params.utm_id || "",
      utm_content: params.utm_content || ""
    };
  }

  function buildConversionId(eventName, params) {
    return [
      "nt",
      eventName,
      params.content_variant || "default",
      params.cta_location || params.engagement_target || "page",
      Date.now()
    ].join("_");
  }

  function commonParams() {
    const contentVariant = getContentVariant();
    const pageFlavor = getPageFlavor();
    const attribution = getAttribution();
    return {
      experiment_name: getExperimentName(),
      experiment_variant: contentVariant,
      content_variant: contentVariant,
      landing_variant: contentVariant,
      landing_page_flavor: pageFlavor,
      page_flavor: pageFlavor,
      page_path: location.pathname,
      page_location: location.href,
      served_path: getServedPath(),
      nt_paid_variant: getParam("nt_paid_variant") || "",
      nt_variant: getParam("nt_variant") || "",
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign,
      utm_id: attribution.utm_id,
      utm_content: attribution.utm_content,
      utm_term: attribution.utm_term
    };
  }

  function getContentVariant() {
    if (document.documentElement.dataset.variant) return document.documentElement.dataset.variant;
    if (getParam("nt_paid_variant")) return getParam("nt_paid_variant");
    if (getParam("nt_variant")) return getParam("nt_variant");
    const path = location.pathname.replace(/\/$/, "/index.html");
    const file = path.split("/").pop() || "index.html";
    return file.replace(/\.html$/i, "") || "index";
  }

  function getPageFlavor() {
    if (document.documentElement.dataset.pageFlavor) return document.documentElement.dataset.pageFlavor;
    const path = location.pathname;
    if (path.startsWith("/campaigns/paid/")) return "paid-campaign";
    if (path.startsWith("/experiments/paid/")) return "paid-experiment";
    if (path.startsWith("/experiments/")) return "free-experiment";
    if (path.startsWith("/ads/")) return "ad-creative";
    if (path.includes("free")) return "free-static";
    if (path === "/" || path.endsWith("/index.html")) return "paid-main";
    return "static";
  }

  function getExperimentName() {
    const pageFlavor = getPageFlavor();
    if (pageFlavor === "paid-campaign" || getParam("nt_paid_variant")) return "paid_reddit_landing_v1";
    if (pageFlavor === "free-experiment" || getParam("nt_variant")) return "free_landing_v1";
    return pageFlavor;
  }

  function getServedPath() {
    const path = location.pathname;
    if (path === "/android" || path === "/android.html") {
      const variant = getContentVariant();
      if (variant) return `/campaigns/paid/${variant}.html`;
    }
    return path;
  }

  function getLinkText(element) {
    return (element.textContent || element.getAttribute("aria-label") || element.querySelector("img")?.alt || "").trim();
  }

  function getParam(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function persistAttribution() {
    const attribution = readUrlAttribution();
    if (!hasAttribution(attribution)) return;
    try {
      sessionStorage.setItem(attributionKey, JSON.stringify(attribution));
    } catch (error) {}
  }

  function getAttribution() {
    const current = readUrlAttribution();
    if (hasAttribution(current)) return current;
    try {
      const stored = JSON.parse(sessionStorage.getItem(attributionKey) || "{}");
      return normalizeAttribution(stored);
    } catch (error) {
      return normalizeAttribution({});
    }
  }

  function readUrlAttribution() {
    return normalizeAttribution({
      utm_source: getParam("utm_source"),
      utm_medium: getParam("utm_medium"),
      utm_campaign: getParam("utm_campaign"),
      utm_id: getParam("utm_id"),
      utm_content: getParam("utm_content"),
      utm_term: getParam("utm_term")
    });
  }

  function normalizeAttribution(value) {
    return {
      utm_source: value.utm_source || "",
      utm_medium: value.utm_medium || "",
      utm_campaign: value.utm_campaign || "",
      utm_id: value.utm_id || "",
      utm_content: value.utm_content || "",
      utm_term: value.utm_term || ""
    };
  }

  function hasAttribution(value) {
    return Boolean(value.utm_source || value.utm_medium || value.utm_campaign || value.utm_id || value.utm_content || value.utm_term);
  }

  function isModifiedClick(event) {
    return event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  }

  function opensNewContext(element) {
    const target = (element.getAttribute("target") || "").toLowerCase();
    return target && target !== "_self";
  }

  function getDestinationPath(destination) {
    if (!destination) return "";
    try {
      return new URL(destination, location.href).pathname;
    } catch (error) {
      return "";
    }
  }
})();
