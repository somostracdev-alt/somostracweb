"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const DEGREES_PER_PIXEL = 0.08;

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
      const box = wheel.parentElement?.getBoundingClientRect() ?? wheel.getBoundingClientRect();
      const fromCenter = window.innerHeight / 2 - (box.top + box.height / 2);
      wheel.style.transform = `rotate(${fromCenter * DEGREES_PER_PIXEL}deg)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
          unoptimized
          sizes="(min-width: 768px) 45vw, 100vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}
