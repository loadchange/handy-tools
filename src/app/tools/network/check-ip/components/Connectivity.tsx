"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/Card";
import { Check, X, Loader2 } from 'lucide-react';

interface SiteCheck {
  id: string;
  name: string;
  url: string;
  status: 'pending' | 'success' | 'failure';
  time: number | null;
}

const SITES: Omit<SiteCheck, 'status' | 'time'>[] = [
  { id: 'google', name: 'Google', url: 'https://www.google.com/favicon.ico' },
  { id: 'github', name: 'GitHub', url: 'https://github.com/favicon.ico' },
  { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/favicon.ico' },
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chat.openai.com/favicon.ico' },
  { id: 'cloudflare', name: 'Cloudflare', url: 'https://www.cloudflare.com/favicon.ico' },
  { id: 'wikipedia', name: 'Wikipedia', url: 'https://www.wikipedia.org/favicon.ico' },
  { id: 'reddit', name: 'Reddit', url: 'https://www.reddit.com/favicon.ico' },
  { id: 'amazon', name: 'Amazon', url: 'https://www.amazon.com/favicon.ico' },
];

export const Connectivity = () => {
  const [checks, setChecks] = useState<SiteCheck[]>(
    SITES.map(s => ({ ...s, status: 'pending', time: null }))
  );

  useEffect(() => {
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];
    const abortControllers: AbortController[] = [];
    let isMounted = true;

    const checkSite = async (index: number) => {
        const site = checks[index];
        const startTime = performance.now();

        try {
          const controller = new AbortController();
          abortControllers.push(controller);
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          timeoutIds.push(timeoutId);

          await fetch(site.url + '?' + new Date().getTime(), {
            mode: 'no-cors',
            signal: controller.signal,
            cache: 'no-cache'
          });

          clearTimeout(timeoutId);

          const endTime = performance.now();
          const duration = Math.round(endTime - startTime);

          if (isMounted) {
            setChecks(prev => {
              const newChecks = [...prev];
              newChecks[index] = { ...site, status: 'success', time: duration };
              return newChecks;
            });
          }

        } catch (error) {
          if (isMounted) {
            setChecks(prev => {
              const newChecks = [...prev];
              newChecks[index] = { ...site, status: 'failure', time: null };
              return newChecks;
            });
          }
          if (error instanceof Error) {
              // console.error(error);
          }
        }
      };

    // Run checks with small delays to avoid flooding
    checks.forEach((_, index) => {
         const id = setTimeout(() => checkSite(index), index * 200);
         timeoutIds.push(id);
    });

    // Cleanup function to clear timeouts and abort requests
    return () => {
      isMounted = false;
      timeoutIds.forEach(id => clearTimeout(id));
      abortControllers.forEach(controller => controller.abort());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {checks.map((site) => (
        <Card key={site.id} className="overflow-hidden">
          <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full min-h-[100px]">
            <div className="mb-2">
               {site.status === 'pending' && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
               {site.status === 'success' && <Check className="w-5 h-5 text-green-500" />}
               {site.status === 'failure' && <X className="w-5 h-5 text-destructive" />}
            </div>
            <div className="text-sm font-medium mb-1">{site.name}</div>
            <div className="text-xs text-muted-foreground">
              {site.status === 'success' ? `${site.time}ms` :
               site.status === 'failure' ? 'Failed' : 'Checking...'}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
