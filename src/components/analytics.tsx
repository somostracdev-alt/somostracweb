"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { analyticsIds, trackPageView, trackWhatsAppClick } from "@/lib/analytics";

const gtmBootstrap = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${analyticsIds.gtm}');`;

const gaBootstrap = `window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};gtag('js',new Date());gtag('config','${analyticsIds.ga4}');`;

const pixelBootstrap = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${analyticsIds.metaPixel}');fbq('track','PageView');`;

function isWhatsAppLink(href: string) {
  return /wa\.me|api\.whatsapp\.com|whatsapp\.com\/send/i.test(href);
}

export function AnalyticsScripts() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: gtmBootstrap }} />
      <script dangerouslySetInnerHTML={{ __html: gaBootstrap }} />
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${analyticsIds.ga4}`} />
      <script dangerouslySetInnerHTML={{ __html: pixelBootstrap }} />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${analyticsIds.gtm}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
      <noscript>
        <img
          alt=""
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${analyticsIds.metaPixel}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

export function AnalyticsEvents() {
  const pathname = usePathname();
  const firstView = useRef(true);

  useEffect(() => {
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    trackPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!link || !isWhatsAppLink(link.href)) return;
      trackWhatsAppClick();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
