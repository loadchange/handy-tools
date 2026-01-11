"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/Card";
import { Loader2 } from 'lucide-react';

interface WebRTCIP {
  ip: string;
  type: string;
}

export const WebRTC = () => {
  const [ips, setIps] = useState<WebRTCIP[]>([]);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    let pc: RTCPeerConnection | null = null;
    let timer: NodeJS.Timeout | null = null;
    let mounted = true;

    const getWebRTCIPs = async () => {
      const ipSet = new Set<string>();
      const newIps: WebRTCIP[] = [];

      try {
        pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        pc.createDataChannel("");

        pc.onicecandidate = (event) => {
          if (!mounted) return;

          if (!event.candidate) {
              setLoading(false);
              return;
          }

          const candidate = event.candidate.candidate;
          // Regex to extract IP addresses
          // IPv4: standard dotted decimal notation (e.g., 192.168.1.1)
          // IPv6: handles full addresses and :: compression notation (e.g., ::1, fe80::1, 2001:db8::1)
          const ipv4Pattern = '[0-9]{1,3}(\\.[0-9]{1,3}){3}';
          // IPv6 patterns ordered from most specific to least specific
          const ipv6Patterns = [
            '([a-f0-9]{1,4}:){7}[a-f0-9]{1,4}',           // Full address
            '([a-f0-9]{1,4}:){6}:[a-f0-9]{1,4}',          // 6::1
            '([a-f0-9]{1,4}:){5}(:[a-f0-9]{1,4}){1,2}',   // 5::1-2
            '([a-f0-9]{1,4}:){4}(:[a-f0-9]{1,4}){1,3}',   // 4::1-3
            '([a-f0-9]{1,4}:){3}(:[a-f0-9]{1,4}){1,4}',   // 3::1-4
            '([a-f0-9]{1,4}:){2}(:[a-f0-9]{1,4}){1,5}',   // 2::1-5
            '([a-f0-9]{1,4}:){1}(:[a-f0-9]{1,4}){1,6}',   // 1::1-6
            '([a-f0-9]{1,4}:){1,7}:',                     // Trailing :: (e.g., 2001:db8::)
            ':((:[a-f0-9]{1,4}){1,7}|:)'                  // Leading :: (e.g., ::1, ::)
          ].join('|');
          const ipRegex = new RegExp(`(${ipv6Patterns}|${ipv4Pattern})`, 'gi');
          const match = ipRegex.exec(candidate);

          if (match) {
             const ip = match[0];
             if (!ipSet.has(ip)) {
                 ipSet.add(ip);
                 // Determine type roughly
                 const type = ip.includes(':') ? 'IPv6' : 'IPv4';
                 // Check if private (IPv4 and IPv6 private ranges)
                 const isPrivate = ip.includes(':')
                   ? /^f[cd][0-9a-f]{2}:|^fe80:/i.test(ip) // IPv6: fc00::/7 (ULA: fc00-fdff) and fe80::/10 (link-local)
                   : /^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/.test(ip); // IPv4 private ranges

                 newIps.push({
                     ip,
                     type: isPrivate ? `${type} (Private)` : `${type} (Public)`
                 });

                 if (mounted) {
                    setIps([...newIps]);
                 }
             }
          }
        };

        const offer = await pc.createOffer();
        if (mounted && pc.signalingState !== 'closed') {
             await pc.setLocalDescription(offer);
        }

        // Timeout to stop gathering
        timer = setTimeout(() => {
            if (mounted) {
                if (pc) pc.close();
                setLoading(false);
            }
        }, 5000);

      } catch (e) {
        if (mounted) {
            console.error("WebRTC error", e);
            setLoading(false);
        }
      }
    };

    getWebRTCIPs();

    return () => {
        mounted = false;
        if (timer) clearTimeout(timer);
        if (pc) pc.close();
    };
  }, []);

  return (
    <Card>
      <CardContent className="p-5">
         <div className="space-y-4">
             {loading && ips.length === 0 ? (
                 <div className="flex items-center gap-2 text-muted-foreground">
                     <Loader2 className="w-4 h-4 animate-spin" /> Detecting WebRTC IPs...
                 </div>
             ) : (
                <>
                 {ips.length === 0 ? (
                     <div className="text-muted-foreground">No WebRTC IPs detected.</div>
                 ) : (
                    <div className="grid gap-2">
                        {ips.map((ip, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 bg-muted/50 rounded border">
                                <span className="font-mono">{ip.ip}</span>
                                <span className="text-xs text-muted-foreground uppercase">{ip.type}</span>
                            </div>
                        ))}
                    </div>
                 )}
                 {loading && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                         <Loader2 className="w-3 h-3 animate-spin" /> Still gathering candidates...
                    </div>
                 )}
                </>
             )}
         </div>
      </CardContent>
    </Card>
  );
};
