"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const DEGREES_PER_PIXEL = 0.22;

export function ScrollWheel({ src }: { src: string }) {
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      wheel.style.transform = `rotate(${window.scrollY * DEGREES_PER_PIXEL}deg)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="relative min-h-[280px] md:min-h-[460px]">
      <div ref={wheelRef} className="absolute inset-0 will-change-transform">
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 768px) 45vw, 100vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}
