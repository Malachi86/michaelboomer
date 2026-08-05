"use client";
import { useState, useEffect, useRef } from "react";

export function TypingAnimation({ text, className, prefix = "" }: { text: string; className?: string; prefix?: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          // Once it's in view, we can stop observing
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isIntersecting && displayedText.length < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(text.substring(0, displayedText.length + 1));
      }, 55); // Adjusted to 55ms for a smoother, "normal" typing feel
      return () => clearTimeout(timeoutId);
    }
  }, [displayedText, text, isIntersecting]);

  return (
    <div ref={ref} className={className} suppressHydrationWarning>
      {prefix}
      <span className="text-white/90">{displayedText}</span>
      <span className="animate-pulse ml-0.5 inline-block w-1 h-6 bg-accent align-middle"></span>
    </div>
  );
}