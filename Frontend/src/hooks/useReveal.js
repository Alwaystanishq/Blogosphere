import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useReveal(ready = true) {
  const scope = useRef(null);
  useLayoutEffect(() => {
    if (!ready || !scope.current) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const intro = scope.current.querySelectorAll("[data-intro]");
      if (intro.length) gsap.from(intro, {
        y: 28, opacity: 0, duration: 0.85, stagger: 0.12,
        ease: "power3.out", clearProps: "transform,opacity",
      });
      scope.current.querySelectorAll("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 24, opacity: 0, duration: 0.7, ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: element, start: "top 94%", once: true },
        });
      });
    }, scope);
    return () => media.revert();
  }, [ready]);
  return scope;
}
