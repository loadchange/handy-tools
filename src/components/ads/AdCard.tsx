"use client";

import { useEffect, useMemo } from "react";

type AdCardProps = {
  adSlot?: string;
  adFormat?: string;
  adLayout?: string;
  adTest?: boolean;
  className?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdCard({
  adSlot,
  adFormat = "auto",
  adLayout,
  adTest = false,
  className = "",
}: AdCardProps) {
  const adClient = process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT;

  // Only attempt to (re)render ads if a client is configured
  useEffect(() => {
    if (!adClient) return;
    try {
      if (typeof window !== "undefined") {
        // Initialize adsbygoogle array and request rendering
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // Ignore errors in environments without ads script loaded
    }
  }, [adClient, adSlot, adFormat, adLayout, adTest]);

  const wrapperClasses = useMemo(
    () =>
      [
        "block",
        "p-6",
        "bg-card", // Changed to bg-card for theme consistency
        "rounded-lg",
        "shadow-sm",
        "transition",
        "border",
        "border-border", // Changed to border-border
        "hover:shadow-md",
        "hover:border-primary", // Changed to hover:border-primary
        className,
      ].join(" "),
    [className]
  );

  if (!adClient) {
    // Placeholder card for when ads are not configured yet
    return (
      <div className={wrapperClasses} aria-label="ad-placeholder">
        <div className="h-full flex flex-col items-center justify-center text-center select-none">
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20 mb-3">
            Sponsored Ad
          </span>
          <div className="w-full h-24 bg-gradient-to-br from-muted/50 to-muted rounded-md border border-dashed border-muted-foreground/30 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Your Ad Here</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Reserved for Google AdSense
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClasses} aria-label="ad-card">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-full-width-responsive="true"
        {...(adTest ? { "data-adtest": "on" } : {})}
      />
    </div>
  );
}
