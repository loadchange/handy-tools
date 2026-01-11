"use client"

import React, { useEffect, useState, useRef } from 'react';
import { IPCard, IPData } from './IPCard';

const SOURCES = [
    { name: "IPv4 (Ipify)", isIPv6: false },
    { name: "IPv6 (Ipify)", isIPv6: true },
    { name: "Cloudflare Trace", isIPv6: false }, // Could be either, but usually we just want the text
];

interface GeoData {
  country_code?: string;
  region?: string;
  city?: string;
  org?: string;
  asn?: string;
  latitude?: number;
  longitude?: number;
}

export const IPInfos = () => {
  const [ipDataList, setIpDataList] = useState<IPData[]>(
    SOURCES.map(s => ({ sourceName: s.name, ip: "", isLoading: true, isIPv6: s.isIPv6 }))
  );

  // To avoid dependency loops, we use a ref to track if we have initiated the fetch
  const initiatedRef = useRef(false);

  const fetchIPInfo = async (index: number) => {
    setIpDataList(prev => {
        const newData = [...prev];
        newData[index] = { ...newData[index], isLoading: true, error: undefined };
        return newData;
    });

    try {
      const sourceName = SOURCES[index].name;
      let ip = "";
      let geoData: GeoData = {};

      if (sourceName === "IPv4 (Ipify)") {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json() as { ip: string };
        ip = data.ip;
      } else if (sourceName === "IPv6 (Ipify)") {
         const res = await fetch('https://api64.ipify.org?format=json');
         const data = await res.json() as { ip: string };
         if (data.ip.includes(':')) {
            ip = data.ip;
         } else {
             // If we got v4 from the v6 endpoint, it means no v6 connectivity
             throw new Error("IPv6 not detected");
         }
      } else if (sourceName === "Cloudflare Trace") {
          const res = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
          const text = await res.text();
          const lines = text.split('\n');
          const ipLine = lines.find(l => l.startsWith('ip='));
          if (ipLine) {
              ip = ipLine.split('=')[1];
          }
      }

      if (ip) {
          try {
             const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
             if (geoRes.ok) {
                 geoData = await geoRes.json() as GeoData;
             }
          } catch (e) {
              console.warn("Failed to fetch geo data", e);
          }
      }

      setIpDataList(prev => {
        const newData = [...prev];
        newData[index] = {
            ...newData[index],
            isLoading: false,
            ip: ip,
            country: geoData.country_code,
            region: geoData.region,
            city: geoData.city,
            isp: geoData.org,
            asn: geoData.asn,
            latitude: geoData.latitude,
            longitude: geoData.longitude
        };
        return newData;
      });

    } catch (error) {
       setIpDataList(prev => {
        const newData = [...prev];
        newData[index] = { ...newData[index], isLoading: false, error: "Failed to fetch IP" };
        return newData;
      });
       if (error instanceof Error) {
           // console.error(error);
       }
    }
  };

  useEffect(() => {
    if (!initiatedRef.current) {
        initiatedRef.current = true;
        SOURCES.forEach((_, i) => fetchIPInfo(i));
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ipDataList.map((data, index) => (
          <IPCard key={index} data={data} onRefresh={() => fetchIPInfo(index)} />
        ))}
      </div>
    </div>
  );
};
