'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import {
  Calculator,
  Copy,
  Network,
  Server,
  Wifi,
  Monitor,
  Smartphone,
  Router,
  Info,
  AlertCircle,
  Globe
} from 'lucide-react';

interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  cidrNotation: string;
  wildcardMask: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  networkClass: string;
  networkType: string;
}

type CalculationType = 'basic' | 'divide' | 'merge';

interface SubnetResult {
  original: SubnetInfo;
  subnets?: SubnetDivision[];
  supernet?: SubnetInfo;
}

interface SubnetDivision {
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  cidr: string;
  hostRange: string;
  usableHosts: number;
}

const COMMON_SUBNETS = [
  { cidr: '/24', mask: '255.255.255.0', hosts: 254, name: 'Class C Default' },
  { cidr: '/16', mask: '255.255.0.0', hosts: 65534, name: 'Class B Default' },
  { cidr: '/8', mask: '255.0.0.0', hosts: 16777214, name: 'Class A Default' },
  { cidr: '/25', mask: '255.255.255.128', hosts: 126, name: 'Large Subnet' },
  { cidr: '/26', mask: '255.255.255.192', hosts: 62, name: 'Medium Subnet' },
  { cidr: '/27', mask: '255.255.255.224', hosts: 30, name: 'Small Subnet' },
  { cidr: '/28', mask: '255.255.255.240', hosts: 14, name: 'Tiny Subnet' },
  { cidr: '/29', mask: '255.255.255.248', hosts: 6, name: 'Point-to-Point' },
  { cidr: '/30', mask: '255.255.255.252', hosts: 2, name: 'P2P Minimal' }
];

const SAMPLE_NETWORKS = [
  { ip: '192.168.1.0', cidr: '/24' },
  { ip: '10.0.0.0', cidr: '/8' },
  { ip: '172.16.0.0', cidr: '/16' },
  { ip: '203.0.113.0', cidr: '/24' },
  { ip: '192.0.2.0', cidr: '/24' }
];

export default function IPv4SubnetCalculatorPage() {
  const [ipInput, setIpInput] = useState<string>('192.168.1.0');
  const [cidrInput, setCidrInput] = useState<string>('/24');
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [divisionCount, setDivisionCount] = useState<number>(2);
  const [calculationType, setCalculationType] = useState<CalculationType>('basic');

  const isValidIP = (ip: string): boolean => {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;

    return parts.every(part => {
      const num = parseInt(part, 10);
      return !isNaN(num) && num >= 0 && num <= 255;
    });
  };

  const isValidCIDR = (cidr: string): boolean => {
    const num = parseInt(cidr.replace('/', ''), 10);
    return !isNaN(num) && num >= 0 && num <= 32;
  };

  const ipToLong = (ip: string): number => {
    const parts = ip.split('.');
    return parts.reduce((acc, part, index) => {
      return acc + (parseInt(part, 10) << (8 * (3 - index)));
    }, 0);
  };

  const longToIP = (long: number): string => {
    return [
      (long >>> 24) & 255,
      (long >>> 16) & 255,
      (long >>> 8) & 255,
      long & 255
    ].join('.');
  };

  const getSubnetMask = (cidr: number): string => {
    const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
    return longToIP(mask);
  };

  const getWildcardMask = (cidr: number): string => {
    const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
    const wildcard = (~mask) >>> 0;
    return longToIP(wildcard);
  };

  const getNetworkClass = (ip: string): string => {
    const firstOctet = parseInt(ip.split('.')[0], 10);

    if (firstOctet >= 1 && firstOctet <= 126) return 'Class A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'Class B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'Class C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'Class D (Multicast)';
    if (firstOctet >= 240 && firstOctet <= 255) return 'Class E (Reserved)';
    return 'Unknown';
  };

  const getNetworkType = (ip: string): string => {
    const firstOctet = parseInt(ip.split('.')[0], 10);

    // Private Addresses
    if (
      (firstOctet === 10) ||
      (firstOctet === 172 && parseInt(ip.split('.')[1], 10) >= 16 && parseInt(ip.split('.')[1], 10) <= 31) ||
      (firstOctet === 192 && parseInt(ip.split('.')[1], 10) === 168)
    ) {
      return 'Private Network';
    }

    // Loopback
    if (firstOctet === 127) {
      return 'Loopback';
    }

    // APIPA
    if (firstOctet === 169 && parseInt(ip.split('.')[1], 10) === 254) {
      return 'APIPA';
    }

    // Public
    return 'Public Network';
  };

  const calculateSubnet = useCallback((ip: string, cidr: number): SubnetInfo => {
    const ipLong = ipToLong(ip);
    const maskLong = (0xFFFFFFFF << (32 - cidr)) >>> 0;
    const networkLong = (ipLong & maskLong) >>> 0;
    const broadcastLong = (networkLong | (~maskLong)) >>> 0;

    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr === 32 ? 1 : (cidr === 31 ? 2 : totalHosts - 2);

    return {
      networkAddress: longToIP(networkLong),
      broadcastAddress: longToIP(broadcastLong),
      subnetMask: getSubnetMask(cidr),
      cidrNotation: `/${cidr}`,
      wildcardMask: getWildcardMask(cidr),
      firstHost: cidr >= 31 ? longToIP(networkLong) : longToIP(networkLong + 1),
      lastHost: cidr >= 31 ? longToIP(broadcastLong) : longToIP(broadcastLong - 1),
      totalHosts: totalHosts,
      usableHosts: usableHosts,
      networkClass: getNetworkClass(longToIP(networkLong)),
      networkType: getNetworkType(longToIP(networkLong))
    };
  }, []);

  const divideSubnet = useCallback((network: SubnetInfo, count: number): SubnetDivision[] => {
    const currentCIDR = parseInt(network.cidrNotation.replace('/', ''), 10);
    const requiredCIDR = currentCIDR + Math.ceil(Math.log2(count));

    if (requiredCIDR > 32) {
      return [];
    }

    const networkLong = ipToLong(network.networkAddress);
    const subnetSize = Math.pow(2, 32 - requiredCIDR);
    const divisions: SubnetDivision[] = [];

    for (let i = 0; i < Math.pow(2, requiredCIDR - currentCIDR); i++) {
      const subnetNetworkLong = networkLong + (i * subnetSize);
      const subnetBroadcastLong = subnetNetworkLong + subnetSize - 1;
      const usableHosts = requiredCIDR >= 31 ? 1 : (requiredCIDR === 30 ? 2 : subnetSize - 2);

      divisions.push({
        networkAddress: longToIP(subnetNetworkLong),
        broadcastAddress: longToIP(subnetBroadcastLong),
        subnetMask: getSubnetMask(requiredCIDR),
        cidr: `/${requiredCIDR}`,
        hostRange: requiredCIDR >= 31 ?
          longToIP(subnetNetworkLong) :
          `${longToIP(subnetNetworkLong + 1)} - ${longToIP(subnetBroadcastLong - 1)}`,
        usableHosts: usableHosts
      });
    }

    return divisions.slice(0, count);
  }, []);

  const mergeSubnets = useCallback((network: SubnetInfo): SubnetInfo | null => {
    const currentCIDR = parseInt(network.cidrNotation.replace('/', ''), 10);

    if (currentCIDR <= 8) {
      return null; // Cannot merge further
    }

    const newCIDR = currentCIDR - 1;
    const networkLong = ipToLong(network.networkAddress);
    const parentNetworkLong = networkLong & (0xFFFFFFFF << (32 - newCIDR)) >>> 0;

    return calculateSubnet(longToIP(parentNetworkLong), newCIDR);
  }, [calculateSubnet]);

  const handleCalculate = useCallback(() => {
    if (!isValidIP(ipInput) || !isValidCIDR(cidrInput)) {
      return;
    }

    const cidr = parseInt(cidrInput.replace('/', ''), 10);
    const subnetInfo = calculateSubnet(ipInput, cidr);

    const newResult: SubnetResult = {
      original: subnetInfo
    };

    if (calculationType === 'divide') {
      newResult.subnets = divideSubnet(subnetInfo, divisionCount);
    } else if (calculationType === 'merge') {
      newResult.supernet = mergeSubnets(subnetInfo) || undefined;
    }

    setResult(newResult);
  }, [ipInput, cidrInput, calculationType, divisionCount, calculateSubnet, divideSubnet, mergeSubnets]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const loadSample = (ip: string, cidr: string) => {
    setIpInput(ip);
    setCidrInput(cidr);
  };

  const loadCIDRTemplate = (mask: string, cidr: string) => {
    setCidrInput(cidr);
  };

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">IPv4 Subnet Calculator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Calculate IPv4 subnet information, supporting subnet division and supernet merging.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Input Config */}
          <div className="lg:col-span-3 space-y-6">
            {/* Input Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Subnet Configuration
                </CardTitle>
                <CardDescription>
                  Enter IP address and subnet mask to calculate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">IP Address</Label>
                    <Input
                      value={ipInput}
                      onChange={(e) => setIpInput(e.target.value)}
                      placeholder="e.g.: 192.168.1.0"
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Subnet Mask (CIDR)</Label>
                    <Select value={cidrInput} onValueChange={setCidrInput}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_SUBNETS.map((subnet) => (
                          <SelectItem key={subnet.cidr} value={subnet.cidr}>
                            {subnet.cidr} - {subnet.mask} ({subnet.name})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Calculation Type */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Calculation Type</Label>
                  <Tabs value={calculationType} onValueChange={(value) => setCalculationType(value as CalculationType)}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="divide">Subnet Division</TabsTrigger>
                      <TabsTrigger value="merge">Supernet Merge</TabsTrigger>
                    </TabsList>

                    <TabsContent value="divide" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Number of Subnets</Label>
                        <Input
                          type="number"
                          value={divisionCount}
                          onChange={(e) => setDivisionCount(Math.max(2, Math.min(64, Number(e.target.value))))}
                          min="2"
                          max="64"
                          placeholder="Enter number of subnets to divide into"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <Button onClick={handleCalculate} className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate
                </Button>
              </CardContent>
            </Card>

            {/* Result */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Network className="h-5 w-5" />
                      Result
                    </div>
                    <Badge variant="outline">{result.original.networkClass}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {result.original.networkType}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList>
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      {calculationType === 'divide' && result.subnets && (
                        <TabsTrigger value="division">Subnet Division</TabsTrigger>
                      )}
                      {calculationType === 'merge' && result.supernet && (
                        <TabsTrigger value="supernet">Supernet Merge</TabsTrigger>
                      )}
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">Network Address</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono text-lg">{result.original.networkAddress}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(result.original.networkAddress)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Broadcast Address</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono">{result.original.broadcastAddress}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(result.original.broadcastAddress)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Subnet Mask</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono">{result.original.subnetMask}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(result.original.subnetMask)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">CIDR Notation</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono">{result.original.cidrNotation}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(result.original.cidrNotation)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">Wildcard Mask</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono">{result.original.wildcardMask}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(result.original.wildcardMask)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">First Host</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono">{result.original.firstHost}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(result.original.firstHost)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Last Host</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono">{result.original.lastHost}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(result.original.lastHost)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Usable Hosts</Label>
                            <div className="mt-1">
                              <Badge variant="secondary">
                                {result.original.usableHosts.toLocaleString()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="division" className="space-y-4 mt-4">
                      {result.subnets && result.subnets.length > 0 ? (
                        <div className="space-y-3">
                          {result.subnets.map((subnet, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">Subnet {index + 1}</Badge>
                                  <span className="font-mono text-sm">{subnet.cidr}</span>
                                </div>
                                <Badge variant="secondary">
                                  {subnet.usableHosts} hosts
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                <div>
                                  <div className="text-muted-foreground">Network Address</div>
                                  <div className="font-mono">{subnet.networkAddress}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Broadcast Address</div>
                                  <div className="font-mono">{subnet.broadcastAddress}</div>
                                </div>
                                <div className="md:col-span-2">
                                  <div className="text-muted-foreground">Host Range</div>
                                  <div className="font-mono">{subnet.hostRange}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                          <p>Cannot divide subnet</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="supernet" className="space-y-4 mt-4">
                      {result.supernet ? (
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline">Supernet</Badge>
                            <span className="font-mono text-sm">{result.supernet.cidrNotation}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Network Address</div>
                              <div className="font-mono">{result.supernet.networkAddress}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Broadcast Address</div>
                              <div className="font-mono">{result.supernet.broadcastAddress}</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                          <p>Cannot merge supernet</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Reference Info */}
          <div className="space-y-6">
            {/* Common Subnets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Router className="h-5 w-5" />
                  Common Subnets
                </CardTitle>
                <CardDescription>
                  Click to apply common subnet configs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {COMMON_SUBNETS.map((subnet, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => loadCIDRTemplate(subnet.mask, subnet.cidr)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{subnet.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {subnet.hosts} hosts
                      </Badge>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {subnet.cidr} - {subnet.mask}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sample Networks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Sample Networks
                </CardTitle>
                <CardDescription>
                  Click to use sample network address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {SAMPLE_NETWORKS.map((network, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors font-mono text-sm"
                    onClick={() => loadSample(network.ip, network.cidr)}
                  >
                    {network.ip} {network.cidr}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Network Types Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Network Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-blue-600" />
                  <span><strong>Class A:</strong> 1.0.0.0 - 126.255.255.255</span>
                </div>
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-green-600" />
                  <span><strong>Class B:</strong> 128.0.0.0 - 191.255.255.255</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-orange-600" />
                  <span><strong>Class C:</strong> 192.0.0.0 - 223.255.255.255</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-purple-600" />
                  <span><strong>Private:</strong> 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}