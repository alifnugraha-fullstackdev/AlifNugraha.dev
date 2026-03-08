"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function HCWebring() {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // biome-ignore lint/correctness/useExhaustiveDependencies: idk
  useEffect(() => {
    const applyLenisPrevent = () => {
      // <pagering-overlay> is a custom element appended directly to document.body,
      // not inside the shadow root of <pagering-link>.
      const overlay = document.querySelector("pagering-overlay");
      if (!overlay) return;

      // Mark the custom element itself
      if (!overlay.hasAttribute("data-lenis-prevent")) {
        overlay.setAttribute("data-lenis-prevent", "");
      }

      // Also mark the inner overflow-y-auto scrollable div so Lenis
      // definitely yields scroll control to it
      const scrollable = overlay.querySelector(".overflow-y-auto");
      if (scrollable && !scrollable.hasAttribute("data-lenis-prevent")) {
        scrollable.setAttribute("data-lenis-prevent", "");
      }
    };

    const observer = new MutationObserver(applyLenisPrevent);

    observer.observe(document.body, { childList: true, subtree: true });

    // Run once immediately in case the element is already present
    applyLenisPrevent();

    setIsMounted(true);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (isMounted)
    return (
      // @ts-expect-error - This is a custom element, so TypeScript doesn't know about it.
      <pagering-link theme={resolvedTheme}></pagering-link>
    );

  return null;
}
