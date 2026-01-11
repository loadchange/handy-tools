"use client"

import React from 'react';
import { Card, CardContent } from "@/components/ui/Card";

export const DNSLeak = () => {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="space-y-4">
             <div className="text-muted-foreground">
                <p>DNS Leak testing requires a specialized backend to generate unique domains and track DNS resolution paths.</p>
                <p className="mt-2">For a full DNS leak test, please use a dedicated service like <a href="https://www.dnsleaktest.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">dnsleaktest.com</a>.</p>
             </div>
        </div>
      </CardContent>
    </Card>
  );
};
