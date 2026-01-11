'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import {
  Network,
  Copy,
  Download,
  Info,
  List,
  BarChart,
  PieChart,
  RefreshCw,
  Plus
} from 'lucide-react';

interface IPRange {
  original: string;
  type: 'single' | 'range' | 'cidr';
  count: number;
  valid: boolean;
}

export default function IPv4RangeExpanderPage() {
  const [inputText, setInputText] = useState<string>('');
  const [expandedIPs, setExpandedIPs] = useState<string[]>([]);
  const [ranges, setRanges] = useState<IPRange[]>([]);
  const [maxIPs, setMaxIPs] = useState<number>(10000);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'original'>('asc');
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('list');

  const ipToLong = (ip: string): number => {
    const parts = ip.split('.');
    return parts.reduce((acc, part, index) => {
      return acc + (parseInt(part, 10) << (8 * (3 - index)));
    }, 0) >>> 0;
  };

  const longToIP = (long: number): string => {
    return [
      (long >>> 24) & 255,
      (long >>> 16) & 255,
      (long >>> 8) & 255,
      long & 255
    ].join('.');
  };

  const isValidIP = useCallback((ip: string): boolean => {
    if (!ip) return false;
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    return parts.every(part => {
      const num = parseInt(part, 10);
      return !isNaN(num) && num >= 0 && num <= 255;
    });
  }, []);

  const parseCIDR = useCallback((cidr: string): string[] => {
    const [ip, mask] = cidr.split('/');
    if (!isValidIP(ip) || !mask) return [];

    const maskNum = parseInt(mask, 10);
    if (isNaN(maskNum) || maskNum < 0 || maskNum > 32) return [];

    const ipLong = ipToLong(ip);
    const maskLong = (0xFFFFFFFF << (32 - maskNum)) >>> 0;
    const networkLong = (ipLong & maskLong) >>> 0;
    const broadcastLong = (networkLong | (~maskLong)) >>> 0;

    const ips: string[] = [];
    for (let i = networkLong; i <= broadcastLong; i++) {
      ips.push(longToIP(i));
      if (ips.length >= maxIPs) break;
    }
    return ips;
  }, [maxIPs, isValidIP]); // Removed ipToLong/longToIP from deps as they are defined in component but effectively pure

  const parseRange = useCallback((range: string): string[] => {
    const [startIP, endIP] = range.split('-');
    if (!isValidIP(startIP) || !isValidIP(endIP)) return [];

    const startLong = ipToLong(startIP);
    const endLong = ipToLong(endIP);

    if (startLong > endLong) return [];

    const ips: string[] = [];
    for (let i = startLong; i <= endLong; i++) {
      ips.push(longToIP(i));
      if (ips.length >= maxIPs) break;
    }
    return ips;
  }, [maxIPs, isValidIP]);

  const expandRange = useCallback(() => {
    const lines = inputText.split('\n').map(line => line.trim()).filter(line => line);
    let allIPs: string[] = [];
    const newRanges: IPRange[] = [];

    lines.forEach(line => {
      let currentIPs: string[] = [];
      let type: 'single' | 'range' | 'cidr' = 'single';
      let isValid = false;

      if (line.includes('/')) {
        // CIDR
        type = 'cidr';
        currentIPs = parseCIDR(line);
        isValid = currentIPs.length > 0;
      } else if (line.includes('-')) {
        // Range
        type = 'range';
        currentIPs = parseRange(line);
        isValid = currentIPs.length > 0;
      } else {
        // Single IP
        type = 'single';
        if (isValidIP(line)) {
          currentIPs = [line];
          isValid = true;
        }
      }

      if (allIPs.length < maxIPs) {
        allIPs = [...allIPs, ...currentIPs];
      }

      newRanges.push({
        original: line,
        type,
        count: currentIPs.length,
        valid: isValid
      });
    });

    // Deduplication
    if (removeDuplicates) {
      allIPs = Array.from(new Set(allIPs));
    }

    // Sorting
    if (sortOrder !== 'original') {
      allIPs.sort((a, b) => {
        const longA = ipToLong(a);
        const longB = ipToLong(b);
        return sortOrder === 'asc' ? longA - longB : longB - longA;
      });
    }

    // Limit total count
    if (allIPs.length > maxIPs) {
      allIPs = allIPs.slice(0, maxIPs);
    }

    setExpandedIPs(allIPs);
    setRanges(newRanges);
  }, [inputText, maxIPs, sortOrder, removeDuplicates, parseCIDR, parseRange, isValidIP]);

  useEffect(() => {
    if (inputText) {
      const timer = setTimeout(() => {
        expandRange();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [inputText, expandRange]);

  const handleCopy = () => {
    navigator.clipboard.writeText(expandedIPs.join('\n')).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const handleDownload = () => {
    const blob = new Blob([expandedIPs.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expanded_ips.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    const sample = `192.168.1.1
192.168.1.10-192.168.1.20
10.0.0.0/24
172.16.0.1`;
    setInputText(sample);
  };

  const getValidIPCount = () => ranges.reduce((acc, curr) => acc + (curr.valid ? curr.count : 0), 0);
  const getInvalidIPCount = () => ranges.filter(r => !r.valid).length;

  const getUniqueSubnets = () => {
    const subnets = new Set<string>();
    expandedIPs.forEach(ip => {
      const subnet = ip.split('.').slice(0, 3).join('.') + '.0';
      subnets.add(subnet);
    });
    return Array.from(subnets);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">IPv4 Range Expander</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Expand IPv4 address ranges, supporting CIDR, IP ranges, and single IP bulk processing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Input Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Config */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  IP Range Input
                </CardTitle>
                <CardDescription>
                  Enter IP addresses, ranges, or CIDR to expand
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">IP Address Range</Label>
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter IP addresses, one per line. Formats:&#10;• Single IP: 192.168.1.1&#10;• Range: 192.168.1.1-192.168.1.100&#10;• CIDR: 192.168.1.0/24"
                    className="min-h-[200px] font-mono"
                  />
                </div>

                {/* Config Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Max IP Count</Label>
                    <Input
                      type="number"
                      value={maxIPs}
                      onChange={(e) => setMaxIPs(Number(e.target.value))}
                      placeholder="Limit max IPs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Sort Order</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={sortOrder}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onChange={(e) => setSortOrder(e.target.value as any)}
                    >
                      <option value="original">Original</option>
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Deduplicate</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="checkbox"
                        checked={removeDuplicates}
                        onChange={(e) => setRemoveDuplicates(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-sm">Remove duplicates</span>
                    </div>
                  </div>
                </div>

                {/* Sample Data */}
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Sample Data</Label>
                  <Button variant="ghost" size="sm" onClick={loadSample}>
                    Load Sample
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button onClick={expandRange} className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Expand Range
                  </Button>
                  <Button variant="outline" onClick={() => { setInputText(''); setExpandedIPs([]); }}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Expand Result */}
            {expandedIPs.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <List className="h-5 w-5" />
                      Result ({expandedIPs.length} IPs)
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy All
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="flex gap-4">
                    <span>Valid: {getValidIPCount()}</span>
                    <span>Invalid: {getInvalidIPCount()}</span>
                    <span>Subnets: {getUniqueSubnets().length}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="list">IP List</TabsTrigger>
                      <TabsTrigger value="ranges">Range Stats</TabsTrigger>
                      <TabsTrigger value="subnets">Subnet Dist</TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="mt-4">
                      <div className="bg-muted p-4 rounded-lg max-h-[400px] overflow-y-auto font-mono text-sm">
                        {expandedIPs.map((ip, index) => (
                          <div key={index} className="py-1 border-b last:border-0 border-border/50">
                            {ip}
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="ranges" className="mt-4">
                      <div className="space-y-2">
                        {ranges.map((range, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-mono font-medium">{range.original}</div>
                              <div className="text-xs text-muted-foreground">
                                Type: {range.type === 'single' ? 'Single IP' :
                                       range.type === 'range' ? 'IP Range' : 'CIDR Network'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{range.count}</div>
                              <div className="text-sm text-muted-foreground">IPs</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="subnets" className="mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {getUniqueSubnets().map((subnet, index) => (
                          <div key={index} className="p-3 bg-muted rounded-lg flex justify-between items-center">
                            <span className="font-mono">{subnet}</span>
                            <span className="text-xs text-muted-foreground">/24 Subnet</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Info and Guide */}
          <div className="space-y-6">
            {/* Supported Formats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Supported Formats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <div className="font-medium mb-2">Single IP Address</div>
                  <code className="bg-muted px-2 py-1 rounded">192.168.1.1</code>
                </div>
                <div>
                  <div className="font-medium mb-2">IP Range</div>
                  <code className="bg-muted px-2 py-1 rounded">192.168.1.1-192.168.1.10</code>
                </div>
                <div>
                  <div className="font-medium mb-2">CIDR Notation</div>
                  <code className="bg-muted px-2 py-1 rounded">192.168.1.0/24</code>
                </div>
              </CardContent>
            </Card>

            {/* Usage Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Usage Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div>• Enter one IP address or range per line</div>
                <div>• Supports mixed format input</div>
                <div>• Automatic IP validity validation</div>
                <div>• Max IP limit to prevent memory overflow</div>
                <div>• Supports deduplication and sorting</div>
                <div>• Click IP list to copy to clipboard</div>
              </CardContent>
            </Card>

            {/* Stats Info */}
            {expandedIPs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total IPs:</span>
                    <span className="font-bold">{expandedIPs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valid Inputs:</span>
                    <span className="text-green-600 font-bold">{getValidIPCount()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Invalid Inputs:</span>
                    <span className="text-red-600 font-bold">{getInvalidIPCount()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subnets:</span>
                    <span className="font-bold">{getUniqueSubnets().length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Input Ranges:</span>
                    <span className="font-bold">{ranges.length}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Network Type Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Network Reference
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div><strong>Private Networks:</strong></div>
                <div className="pl-2 text-muted-foreground">
                  10.0.0.0/8<br />
                  172.16.0.0/12<br />
                  192.168.0.0/16
                </div>
                <div><strong>Special Use:</strong></div>
                <div className="pl-2 text-muted-foreground">
                  127.0.0.0/8 (Loopback)<br />
                  224.0.0.0/4 (Multicast)
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
