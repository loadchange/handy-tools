"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  Globe,
  ShieldCheck,
  Wifi,
  MapPin,
  Server,
  RefreshCcw,
  AlertTriangle,
  Clock
} from "lucide-react";
import { UAParser } from "ua-parser-js";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { cn } from "@/lib/utils";

// --- Types ---

interface NodeStatus {
  name: string;
  description: string;
  type: "local" | "global" | "acceleration";
  endpoint: string;
  status: "idle" | "loading" | "connected" | "timeout" | "error";
  data?: {
    ip: string;
    location: string;
    isp?: string;
    latency?: number;
  };
}

interface FingerprintData {
  browser: string;
  os: string;
  device: string;
  screen: string;
  timezone: string;
  userAgent: string;
}

// --- Components ---

function StatusBadge({ status }: { status: NodeStatus["status"] }) {
  switch (status) {
    case "connected":
      return <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>;
    case "timeout":
      return <Badge variant="destructive">Timeout</Badge>;
    case "error":
      return <Badge variant="destructive">Unreachable</Badge>;
    case "loading":
      return <Badge variant="secondary" className="animate-pulse">Scanning...</Badge>;
    default:
      return <Badge variant="outline">Idle</Badge>;
  }
}

function NodeCard({ node, onScan }: { node: NodeStatus; onScan: (node: NodeStatus) => void }) {
  const isScanning = node.status === "loading";

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300",
      node.status === "connected" ? "border-green-500/20 bg-green-50/5 dark:bg-green-900/10" : ""
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {node.type === "local" && <MapPin className="h-5 w-5 text-blue-500" />}
            {node.type === "global" && <Globe className="h-5 w-5 text-purple-500" />}
            {node.type === "acceleration" && <Activity className="h-5 w-5 text-orange-500" />}
            <CardTitle className="text-lg font-medium">{node.name}</CardTitle>
          </div>
          <StatusBadge status={node.status} />
        </div>
        <CardDescription>{node.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block mb-1">IP Address</span>
              <div className="font-mono bg-muted/50 p-1.5 rounded text-xs truncate">
                {node.data?.ip || "---"}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Location / ISP</span>
              <div className="font-medium truncate">
                {node.data?.location || "---"}
              </div>
            </div>
          </div>

          {node.type === "acceleration" && (
            <div 
              className="flex items-center gap-2 text-sm"
              title="Round-trip time includes network latency, server processing, and response parsing"
            >
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Round-trip:</span>
              <span className={cn(
                "font-bold",
                (node.data?.latency || 0) < 100 ? "text-green-500" :
                (node.data?.latency || 0) < 300 ? "text-yellow-500" : "text-red-500"
              )}>
                {node.data?.latency ? `${node.data.latency} ms` : "---"}
              </span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => onScan(node)}
            disabled={isScanning}
          >
            {isScanning ? (
              <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wifi className="h-4 w-4 mr-2" />
            )}
            {isScanning ? "Scanning..." : "Check Connection"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Page Component ---

export default function NetPulsePage() {
  const [nodes, setNodes] = useState<NodeStatus[]>([
    {
      name: "Local ISP",
      description: "Detects your domestic network exit point.",
      type: "local",
      endpoint: "/api/tools/network/netpulse/scan",
      status: "idle"
    },
    {
      name: "Global Route",
      description: "Detects your international exit point.",
      type: "global",
      // Using a public API that returns JSON to simulate external view
      endpoint: "https://api.ip.sb/geoip",
      status: "idle"
    },
    {
      name: "Acceleration Node",
      description: "Checks connectivity to cross-border nodes.",
      type: "acceleration",
      // Using Cloudflare trace as a target for latency check
      endpoint: "https://1.1.1.1/cdn-cgi/trace",
      status: "idle"
    }
  ]);

  const [fingerprint, setFingerprint] = useState<FingerprintData | null>(null);
  const [webRTCIPs, setWebRTCIPs] = useState<string[]>([]);
  const [isWebRTCScanning, setIsWebRTCScanning] = useState(false);

  useEffect(() => {
    // Generate Fingerprint
    const parser = new UAParser();
    const result = parser.getResult();
    setFingerprint({
      browser: `${result.browser?.name || 'Unknown'} ${result.browser?.version || ''}`.trim(),
      os: `${result.os?.name || 'Unknown'} ${result.os?.version || ''}`.trim(),
      device: result.device
        ? `${result.device.vendor || ''} ${result.device.model || 'Desktop'}`.trim()
        : 'Desktop',
      screen: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userAgent: navigator.userAgent
    });

    // Define scanNode inside useEffect to avoid stale closure
    const scanNode = async (node: NodeStatus) => {
      setNodes(prev => prev.map(n => n.name === node.name ? { ...n, status: "loading" } : n));

      const startTime = performance.now();
      const TIMEOUT_MS = 10000; // 10 seconds timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        let ip = "";
        let location = "";
        if (node.type === "local") {
          const res = await fetch(node.endpoint, { signal: controller.signal });
          const data = await res.json();
          ip = data.ip;
          location = data.location;
        } else if (node.type === "global") {
          const res = await fetch(node.endpoint, { signal: controller.signal });
          const data = await res.json();
          ip = data.ip;
          location = `${data.country} ${data.city}`;
        } else if (node.type === "acceleration") {
          const res = await fetch(node.endpoint, { signal: controller.signal });
          const text = await res.text();
          const ipMatch = text.match(/ip=([^\n]+)/);
          ip = ipMatch ? ipMatch[1] : "";
          location = "Cloudflare";
        }
        clearTimeout(timeoutId);
        const latency = Math.round(performance.now() - startTime);
        setNodes(prev => prev.map(n => n.name === node.name ? {
          ...n,
          status: "connected",
          data: { ip, location, latency }
        } : n));
      } catch (error) {
        clearTimeout(timeoutId);
        console.error(error);
        const isTimeout = error instanceof Error && error.name === "AbortError";
        setNodes(prev => prev.map(n => n.name === node.name ? {
          ...n,
          status: isTimeout ? "timeout" : "error",
          data: undefined
        } : n));
      }
    };

    // Auto-scan all nodes on mount
    nodes.forEach(node => scanNode(node));
    scanWebRTC();
  }, []);

  const scanNode = async (node: NodeStatus) => {
    setNodes(prev => prev.map(n => n.name === node.name ? { ...n, status: "loading" } : n));

    const startTime = performance.now();
    const TIMEOUT_MS = 10000; // 10 seconds timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      let ip = "";
      let location = "";
      let isp = "";

      // Handling different endpoint formats
      if (node.type === "local") {
        const res = await fetch(node.endpoint);
        if (!res.ok) throw new Error(`Local node fetch failed: HTTP ${res.status}`);
        const json = await res.json();
        ip = json.ip ?? "Unknown";
        location = [json.city, json.region, json.country].filter(Boolean).join(" ") || "Unknown";
        isp = json.isp ?? json.organization ?? "Unknown";
      } else if (node.type === "global") {
        // Handle ip.sb format
        const res = await fetch(node.endpoint);
        if (!res.ok) throw new Error(`Global node fetch failed: HTTP ${res.status}`);
        const json = await res.json();
        ip = json.ip ?? "Unknown";
        location = [json.city, json.country].filter(Boolean).join(", ") || "Unknown";
        isp = json.isp ?? json.organization ?? "Unknown";
      } else if (node.type === "acceleration") {
        // Handle Cloudflare trace (text format)
        // Note: Fetching this from client might be blocked by CORS in some browsers/extensions if strict.
        // Assuming standard usage or successful CORS for demonstration.
        // If it fails due to CORS, we will catch it.
        const res = await fetch(node.endpoint);
        if (!res.ok) throw new Error(`Acceleration node fetch failed: HTTP ${res.status}`);
        const text = await res.text();
        const lines = text.split("\n");
        const ipLine = lines.find(l => l.startsWith("ip="));
        const locLine = lines.find(l => l.startsWith("loc="));
        ip = ipLine ? ipLine.split("=")[1] : "Unknown";
        location = locLine ? locLine.split("=")[1] : "Unknown";
      }

      clearTimeout(timeoutId);
      const endTime = performance.now();
      // Note: This measures round-trip time which includes network latency, server processing,
      // and response parsing (JSON/text). For the Acceleration Node, this represents the total
      // time from request initiation to complete response handling, not pure network latency.
      const latency = Math.round(endTime - startTime);

      setNodes(prev => prev.map(n => n.name === node.name ? {
        ...n,
        status: "connected",
        data: node.type === "local" || node.type === "global"
          ? { ip, location, isp, latency }
          : { ip, location, latency }
      } : n));
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(error);
      const isTimeout = error instanceof Error && error.name === "AbortError";
      setNodes(prev => prev.map(n => n.name === node.name ? {
        ...n,
        status: isTimeout ? "timeout" : "error",
        data: undefined
      } : n));
    }
  };

  const scanWebRTC = () => {
    setIsWebRTCScanning(true);
    setWebRTCIPs([]);

    // Simple WebRTC leak check
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const RTCPeerConnection = window.RTCPeerConnection || (window as any).webkitRTCPeerConnection || (window as any).mozRTCPeerConnection;
    if (!RTCPeerConnection) {
        setIsWebRTCScanning(false);
        return;
    }

    const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    pc.createDataChannel("");

    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch((err) => {
        console.error("WebRTC scan error:", err);
        setIsWebRTCScanning(false);
      });

    pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) {
            return;
        }
        // Improved IPv6 regex to match compressed and full forms
        const ipRegex = /([0-9]{1,3}(?:\.[0-9]{1,3}){3}|(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|:(:[a-fA-F0-9]{1,4}){1,7}|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?:(?::[a-fA-F0-9]{1,4}){1,6}))/;
        const match = ipRegex.exec(ice.candidate.candidate);
        if (match) {
            setWebRTCIPs(prev => {
                if (!prev.includes(match[1])) {
                    return [...prev, match[1]];
                }
                return prev;
            });
        }
    };

    pc.addEventListener('icegatheringstatechange', () => {
        if (pc.iceGatheringState === 'complete') {
            pc.close();
            setIsWebRTCScanning(false);
        }
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-5xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          NetPulse Global Diagnosis
        </h1>
        <p className="text-muted-foreground">
          Multi-line network exit detection and diagnosis tool. Verify routing policies and connectivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {nodes.map((node) => (
          <NodeCard key={node.name} node={node} onScan={scanNode} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WebRTC Leak Detection */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-500" />
              <CardTitle>WebRTC Leak Detection</CardTitle>
            </div>
            <CardDescription>
              Detects if your real IP is exposed via WebRTC while using proxies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="min-h-[60px] p-4 bg-muted/30 rounded-md border border-dashed">
                {isWebRTCScanning ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                    Scanning candidates...
                  </div>
                ) : webRTCIPs.length > 0 ? (
                  <div className="space-y-1">
                    {webRTCIPs.map(ip => (
                      <div key={ip} className="flex items-center gap-2 font-mono text-sm text-red-500">
                        <AlertTriangle className="h-4 w-4" />
                        {ip} (Exposed)
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <ShieldCheck className="h-4 w-4" />
                    No leaks detected (or blocked).
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={scanWebRTC} disabled={isWebRTCScanning}>
                Re-scan WebRTC
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Browser Fingerprint */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-slate-500" />
              <CardTitle>Browser Fingerprint</CardTitle>
            </div>
            <CardDescription>
              Environment details visible to websites.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fingerprint ? (
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <div className="text-muted-foreground">OS:</div>
                <div className="font-medium text-right">{fingerprint.os}</div>
                <Separator className="col-span-2 my-1" />

                <div className="text-muted-foreground">Browser:</div>
                <div className="font-medium text-right">{fingerprint.browser}</div>
                <Separator className="col-span-2 my-1" />

                <div className="text-muted-foreground">Screen:</div>
                <div className="font-medium text-right">{fingerprint.screen}</div>
                <Separator className="col-span-2 my-1" />

                <div className="text-muted-foreground">Timezone:</div>
                <div className="font-medium text-right">{fingerprint.timezone}</div>
              </div>
            ) : (
                <div className="text-sm text-muted-foreground">Loading...</div>
            )}
          </CardContent>
        </Card>
      </div>

      <footer className="mt-12 text-center text-xs text-muted-foreground border-t pt-6">
        <p className="max-w-2xl mx-auto leading-relaxed">
          Disclaimer: This tool is intended for network engineers, cross-border e-commerce, and researchers for network environment diagnosis and configuration checks only.
          Strictly prohibited for any illegal activities violating local laws and regulations.
          This site does not provide any network access services, only data query functions.
        </p>
      </footer>
    </div>
  );
}
