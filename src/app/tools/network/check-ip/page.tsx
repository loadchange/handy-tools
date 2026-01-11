"use client"

import React from 'react';
import { Globe, Shield, Wifi, Activity } from 'lucide-react';
import { IPInfos } from "./components/IPInfos";
import { Connectivity } from "./components/Connectivity";
import { WebRTC } from "./components/WebRTC";
import { DNSLeak } from "./components/DNSLeak";

export default function CheckIpPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Check IP</h1>
        <p className="text-muted-foreground">
          A comprehensive IP toolbox to check your IP address, location, connectivity, WebRTC leaks, and DNS leaks.
        </p>
      </div>

      <div className="grid gap-6">
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" /> IP Information
          </h2>
           <IPInfos />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" /> Connectivity
          </h2>
           <Connectivity />
        </section>

        <section>
           <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Wifi className="w-5 h-5" /> WebRTC Leak Test
          </h2>
           <WebRTC />
        </section>

        <section>
           <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" /> DNS Leak Test
          </h2>
           <DNSLeak />
        </section>
      </div>
    </div>
  );
}
