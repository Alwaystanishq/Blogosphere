import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function useReveal(ready = true) {
  const scope = useRef(null);
  useLayoutEffect(() => {
    if (!ready || !scope.current) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const intro = scope.current.querySelectorAll("[data-intro]");
      if (intro.length) gsap.from(intro, {
        y: 16, opacity: 0, duration: 0.65, stagger: 0.07,
        ease: "power2.out", clearProps: "transform,opacity",
      });
    }, scope);
    return () => media.revert();
  }, [ready]);
  return scope;
}
