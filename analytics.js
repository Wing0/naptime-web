(function () {
  const measurementId = window.NAPTIME_GA_MEASUREMENT_ID || "G-M9EH844KS8";
  const consentKey = "naptime_cookie_consent";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500
  });

  gtag("js", new Date());
  gtag("config", measurementId, {
    anonymize_ip: true,
    send_page_view: false
  });

  if (localStorage.getItem(consentKey) === "granted") {
    updateConsent("granted");
  }

  loadGoogleTag(measurementId);

  document.addEventListener("DOMContentLoaded", function () {
    sendPageView();
    bindTrackedLinks();
  });

  window.naptimeAnalytics = {
    event: trackEvent,
    updateConsent,
    sendPageView
  };

  function loadGoogleTag(id) {
    if (document.querySelector("script[data-naptime-gtag]")) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    script.dataset.naptimeGtag = "true";
    document.head.appendChild(script);
  }

  function updateConsent(state) {
    const granted = state === "granted";
    gtag("consent", "update", {
      ad_storage: granted ? "granted" : "denied",
      ad_user_data: granted ? "granted" : "denied",
      ad_personalization: granted ? "granted" : "denied",
      analytics_storage: granted ? "granted" : "denied"
    });
  }

  function sendPageView() {
    const variant = document.documentElement.dataset.variant || getParam("nt_paid_variant") || getParam("nt_variant") || "default";
    const pageFlavor = document.documentElement.dataset.pageFlavor || "standard";
    gtag("event", "page_view", {
      page_title: document.title,
      page_location: location.href,
      page_path: location.pathname,
      content_variant: variant,
      page_flavor: pageFlavor,
      traffic_source: getParam("utm_source") || "direct"
    });
  }

  function bindTrackedLinks() {
    document.querySelectorAll("[data-analytics-event]").forEach(function (element) {
      element.addEventListener("click", function () {
        trackEvent(element.dataset.analyticsEvent, {
          content_variant: document.documentElement.dataset.variant || getParam("nt_paid_variant") || getParam("nt_variant") || "default",
          page_flavor: document.documentElement.dataset.pageFlavor || "standard",
          cta_location: element.dataset.ctaLocation || "unknown",
          destination: element.getAttribute("href") || "",
          link_text: (element.textContent || element.getAttribute("aria-label") || "").trim()
        });
      });
    });
  }

  function trackEvent(name, params) {
    gtag("event", name, params || {});
  }

  function getParam(name) {
    return new URLSearchParams(location.search).get(name);
  }
})();
