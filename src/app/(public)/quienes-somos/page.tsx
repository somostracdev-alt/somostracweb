import type { Metadata } from "next";

import { Prose } from "@/components/prose";
import { getSiteContent } from "@/content/site";

export const metadata: Metadata = {
  title: "Quiénes somos",
};

export const instant = false;

export default async function AboutPage() {
  const { about } = await getSiteContent();

  return (
    <>
      <section className="py-16 md:py-24">
        <h1 className="font-display text-[30px] leading-none uppercase md:text-7xl lg:text-[100px]">{about.title}</h1>
        <Prose paragraphs={about.paragraphs} className="mt-8 max-w-3xl text-sm md:text-base" />
      </section>
      <section className="pb-20 md:pb-28">
        <h2 className="font-sans text-xl font-normal text-white md:text-2xl">{about.storyTitle}</h2>
        <Prose paragraphs={about.storyParagraphs} className="mt-6 max-w-3xl text-sm md:text-base" />
      </section>
    </>
  );
}
