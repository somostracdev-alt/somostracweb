export function Prose({
  paragraphs,
  className = "",
}: {
  paragraphs: string[];
  className?: string;
}) {
  return (
    <div className={`space-y-4 font-extralight leading-[1.55] text-white ${className}`}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
