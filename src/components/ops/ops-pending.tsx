"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { createContext, Suspense, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { TractorField } from "@/components/ops/ops-truck";

const PendingContext = createContext<() => void>(() => {});
const StopContext = createContext<() => void>(() => {});

export function useOpsPending() {
  return useContext(PendingContext);
}

export function OpsPending({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState(false);
  const start = useCallback(() => setPending(true), []);
  const stop = useCallback(() => setPending(false), []);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!anchor || anchor.getAttribute("target") === "_blank") return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      setPending(true);
    }

    function onSubmit(event: Event) {
      if (event.defaultPrevented) return;
      setPending(true);
    }

    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("submit", onSubmit);
    };
  }, []);

  useEffect(() => {
    if (!pending) return;
    const timer = window.setTimeout(() => setPending(false), 20000);
    return () => window.clearTimeout(timer);
  }, [pending]);

  return (
    <PendingContext.Provider value={start}>
      <StopContext.Provider value={stop}>
        <Suspense fallback={null}>
          <PendingReset />
        </Suspense>
        {pending ? <TractorField /> : null}
        {children}
      </StopContext.Provider>
    </PendingContext.Provider>
  );
}

function PendingReset() {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  const stop = useContext(StopContext);
  useEffect(() => {
    stop();
  }, [pathname, query, stop]);
  return null;
}
