export const analyticsIds = {
  gtm: "GTM-TD6HKQMW",
  ga4: "G-6RS54FHYXV",
  metaPixel: "1468968398243135",
} as const;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

function browserAnalytics(): AnalyticsWindow | null {
  if (typeof window === "undefined") return null;
  return window as AnalyticsWindow;
}

export function trackLead() {
  const analytics = browserAnalytics();
  if (!analytics) return;
  analytics.dataLayer = analytics.dataLayer || [];
  analytics.dataLayer.push({ event: "generate_lead" });
  analytics.gtag?.("event", "generate_lead");
  analytics.fbq?.("track", "Lead");
}

export function trackWhatsAppClick() {
  const analytics = browserAnalytics();
  if (!analytics) return;
  analytics.dataLayer = analytics.dataLayer || [];
  analytics.dataLayer.push({ event: "whatsapp_click" });
  analytics.gtag?.("event", "whatsapp_click");
  analytics.fbq?.("track", "Contact");
}

export function trackPageView(path: string) {
  const analytics = browserAnalytics();
  if (!analytics) return;
  analytics.dataLayer = analytics.dataLayer || [];
  analytics.dataLayer.push({ event: "page_view", page_path: path });
  analytics.gtag?.("event", "page_view", { page_path: path });
  analytics.fbq?.("track", "PageView");
}
