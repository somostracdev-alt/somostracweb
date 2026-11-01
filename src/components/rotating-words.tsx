"use client";

import { useEffect, useState } from "react";

export function RotatingWords({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const signature = words.join("|");

  useEffect(() => {
    const total = signature.split("|").filter(Boolean).length;
    if (total < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, 2500);
    return () => window.clearInterval(timer);
  }, [signature]);

  const word = words[index] ?? "";

  return (
    <span className="block overflow-hidden text-accent">
      <span key={`${word}-${index}`} className="block animate-[trac-slide_0.45s_ease]">
        {word}
      </span>
    </span>
  );
}
