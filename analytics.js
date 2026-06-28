(function () {
  const consentKey = "naptime_cookie_consent";
  const redditPixelId = "a2_izauxup9ioln";
  let redditPixelReady = false;
  let pageViewTracked = false;
  let redditPageVisitSent = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };

  if (localStorage.getItem(consentKey) === "granted") {
    updateConsent("granted");
  }

  document.addEventListener("DOMContentLoaded", function () {
    sendPageView();
    bindTrackedLinks();
    bindConsentButtons();
  });

  window.naptimeAnalytics = {
    event: trackEvent,
    updateConsent,
    sendPageView
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
    trackEvent("page_view", {
      page_title: document.title,
      page_location: location.href,
      page_path: location.pathname,
      engagement_target: "page",
      traffic_source: getParam("utm_source") || "direct"
    });
  }

  function bindTrackedLinks() {
    document.querySelectorAll("a[href]").forEach(function (element) {
      element.addEventListener("click", function () {
        const details = classifyLink(element);
        trackEvent(details.eventName, {
          cta_location: element.dataset.ctaLocation || details.location,
          destination: details.href,
          destination_host: details.host,
          link_text: getLinkText(element),
          link_type: details.type,
          engagement_target: "link"
        });
      });
    });
  }

  function bindConsentButtons() {
    const accept = document.getElementById("cookie-accept");
    const deny = document.getElementById("cookie-deny");
    if (accept) {
      accept.addEventListener("click", function () {
        trackEvent("consent_choice", {
          consent_choice: "accept",
          cta_location: "cookie-banner",
          engagement_target: "consent"
        });
      });
    }
    if (deny) {
      deny.addEventListener("click", function () {
        trackEvent("consent_choice", {
          consent_choice: "decline",
          cta_location: "cookie-banner",
          engagement_target: "consent"
        });
      });
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
    gtag("event", name, eventParams);
    trackRedditEvent(name, eventParams);
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
    window.rdt("track", "PageVisit", redditPayload("page_view", params || Object.assign(commonParams(), {
      page_title: document.title,
      engagement_target: "page",
      traffic_source: getParam("utm_source") || "direct"
    })));
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
    return {
      content_variant: getContentVariant(),
      landing_variant: getContentVariant(),
      page_flavor: getPageFlavor(),
      page_path: location.pathname,
      page_location: location.href,
      nt_paid_variant: getParam("nt_paid_variant") || "",
      nt_variant: getParam("nt_variant") || "",
      utm_source: getParam("utm_source") || "",
      utm_medium: getParam("utm_medium") || "",
      utm_campaign: getParam("utm_campaign") || "",
      utm_content: getParam("utm_content") || "",
      utm_term: getParam("utm_term") || ""
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

  function getLinkText(element) {
    return (element.textContent || element.getAttribute("aria-label") || element.querySelector("img")?.alt || "").trim();
  }

  function getParam(name) {
    return new URLSearchParams(location.search).get(name);
  }
})();
