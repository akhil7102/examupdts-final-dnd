import { useEffect, useRef, useState } from "react";

interface AdSenseSlotProps {
  format?: "horizontal" | "vertical" | "square";
  className?: string;
  type?: "display" | "banner" | "inarticle";
  slot?: string;
}

export function AdSenseSlot({
  format = "horizontal",
  className = "",
  type = "display",
  slot,
}: AdSenseSlotProps) {
  const dimensions = {
    horizontal: "min-h-24 md:min-h-32",
    vertical: "min-h-96",
    square: "min-h-64",
  };

  const client = "ca-pub-9887530203497790";

  const resolvedSlot =
    slot ||
    (type === "display"
      ? "1637004897"
      : type === "banner"
      ? "8202413249"
      : "9323923222");

  const insRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const el = insRef.current as unknown as HTMLElement | null;
    const alreadyProcessed =
      el && (el.getAttribute("data-ad-status") === "done" || el.getAttribute("adsbygoogle-status") === "done");

    if (alreadyProcessed || rendered) return;

    const timer = setTimeout(() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
        setRendered(true);
      } catch {
        // ignore
      }
    }, 0);

    return () => clearTimeout(timer);
    // We intentionally exclude 'rendered' to avoid re-pushing on re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, resolvedSlot]);

  return (
    <div className={`w-full ${dimensions[format]} ${className}`}>
      <ins
        // @ts-expect-error - Google sets status attributes dynamically
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={resolvedSlot}
        {...(import.meta.env.DEV || typeof window !== "undefined"
          ? (window.location && window.location.hostname === "localhost"
              ? { "data-adtest": "on" }
              : {})
          : {})}
        {...(type === "display"
          ? { "data-ad-format": "auto", "data-full-width-responsive": "true" }
          : type === "banner"
          ? { "data-ad-format": "autorelaxed" }
          : { "data-ad-layout": "in-article", "data-ad-format": "fluid" })}
      />
    </div>
  );
}
