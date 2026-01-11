"use client";

import { useEffect } from "react";

export default function GoogleAdsProvider() {
  const adClient = process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT;

  useEffect(() => {
    if (!adClient) return;

    const alreadyLoaded = document.querySelector(
      'script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
    );
    if (alreadyLoaded) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
      adClient
    )}`;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    return () => {
      try {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      } catch {}
    };
  }, [adClient]);

  return null;
}
