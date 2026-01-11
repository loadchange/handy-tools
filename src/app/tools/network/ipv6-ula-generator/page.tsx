'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import {
  Globe,
  Copy,
  RefreshCw,
  Download,
  Network,
  Server,
  Info,
  Router,
  Monitor
} from 'lucide-react';

interface ULAAddress {
  address: string;
  prefix: string;
  subnetId: string;
  interfaceId: string;
  timestamp: string;
  type: string;
}

type InterfaceIdType = 'random' | 'eui64' | 'stable' | 'custom';

const SUBNET_SIZES = [
  { value: 8, label: '/8 (16.7M+ subnets)', description: 'Super Large Network' },
  { value: 16, label: '/16 (65536 subnets)', description: 'Large Enterprise Network' },
  { value: 24, label: '/24 (256 subnets)', description: 'Medium Enterprise Network' },
  { value: 32, label: '/32 (16 subnets)', description: 'Small Enterprise Network' },
  { value: 40, label: '/40 (256 subnets)', description: 'Department Network' },
  { value: 48, label: '/48 (65536 subnets)', description: 'Standard Site Network' },
  { value: 56, label: '/56 (256 subnets)', description: 'Small Site Network' },
  { value: 64, label: '/64 (Single subnet)', description: 'Standard LAN Subnet' }
];

const SAMPLE_CONFIGURATIONS = [
  {
    name: 'Home Network',
    prefix: 'fd00:1234:5678::',
    subnetBits: 48,
    description: 'Typical Home IPv6 Network'
  },
  {
    name: 'Small Office',
    prefix: 'fd00:abcd:ef01::',
    subnetBits: 48,
    description: 'Small Office Network Config'
  },
  {
    name: 'Enterprise',
    prefix: 'fd00:1111:2222:3333::',
    subnetBits: 48,
    description: 'Enterprise Level Network'
  },
  {
    name: 'Data Center',
    prefix: 'fd00:dead:beef:cafe::',
    subnetBits: 48,
    description: 'Data Center Network'
  }
];

export default function IPv6ULAGeneratorPage() {
  const [generatedAddresses, setGeneratedAddresses] = useState<ULAAddress[]>([]);
  const [customPrefix, setCustomPrefix] = useState<string>('fd00:1234:5678::');
  const [subnetBits, setSubnetBits] = useState<number>(48);
  const [count, setCount] = useState<number>(1);
  const [interfaceIdType, setInterfaceIdType] = useState<InterfaceIdType>('random');
  const [useRandomSubnet, setUseRandomSubnet] = useState<boolean>(false);
  const [includeTimestamp, setIncludeTimestamp] = useState<boolean>(false);

  const generateRandomHex = (length: number): string => {
    const hexChars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += hexChars[Math.floor(Math.random() * 16)];
    }
    return result;
  };

  const generateEUI64InterfaceId = (mac?: string): string => {
    if (!mac) {
      // Generate random MAC for EUI-64
      mac = generateRandomHex(6);
    }

    const parts = mac.match(/.{2}/g) || [];
    if (parts.length !== 6) {
      return generateRandomHex(16);
    }

    // EUI-64 conversion: Insert FFFE in middle and flip U/L bit
    const modified = parts.slice(0, 3).concat(['ff', 'fe']).concat(parts.slice(3));
    const firstByte = parseInt(modified[0], 16);
    const flippedByte = (firstByte ^ 0x02).toString(16).padStart(2, '0');
    modified[0] = flippedByte;

    return modified.join('');
  };

  const generateStablePrivacyInterfaceId = (): string => {
    // Generate random interface ID, but set 7th bit to 0 (stable privacy address)
    let interfaceId = generateRandomHex(16);

    // Set 7th bit to 0 (7th bit from right, i.e., 62nd bit)
    const charIndex = Math.floor((64 - 7) / 4);
    const bitIndex = 7 - ((64 - 7) % 4);

    const char = interfaceId[charIndex];
    const charValue = parseInt(char, 16);
    const newCharValue = charValue & (~(1 << bitIndex));
    const newChar = newCharValue.toString(16);

    interfaceId = interfaceId.substring(0, charIndex) + newChar + interfaceId.substring(charIndex + 1);

    return interfaceId;
  };

  const generateULAAddress = (): ULAAddress => {
    let subnetId = '';
    let interfaceId = '';

    // Generate Subnet ID
    if (useRandomSubnet) {
      const subnetHexLength = Math.ceil((subnetBits - 16) / 4);
      subnetId = generateRandomHex(subnetHexLength);
    } else {
      // Use default subnet ID
      const subnetHexLength = Math.ceil((subnetBits - 16) / 4);
      subnetId = '0000'.substring(0, subnetHexLength) + '0000'.substring(0, subnetHexLength);
    }

    // Generate Interface ID
    switch (interfaceIdType) {
      case 'eui64':
        interfaceId = generateEUI64InterfaceId();
        break;
      case 'stable':
        interfaceId = generateStablePrivacyInterfaceId();
        break;
      case 'random':
      default:
        interfaceId = generateRandomHex(16);
        break;
    }

    // Build full address
    const prefix = customPrefix.endsWith('::') ? customPrefix.slice(0, -2) : customPrefix;
    const fullAddress = `${prefix}:${subnetId}:${interfaceId}`;

    // Normalize IPv6 address
    const normalizedAddress = normalizeIPv6Address(fullAddress);

    return {
      address: normalizedAddress,
      prefix: customPrefix,
      subnetId,
      interfaceId,
      timestamp: new Date().toLocaleString(),
      type: interfaceIdType
    };
  };

  const normalizeIPv6Address = (address: string): string => {
    // Remove leading zeros
    address = address.replace(/(^|:)(0+)/g, '$1');

    // Compress consecutive zeros
    address = address.replace(/(:0)+:/, '::');

    // Handle leading/trailing ::
    if (address.startsWith('::') && address.endsWith('::')) {
      address = '::';
    } else if (address.startsWith('::')) {
      address = ':' + address;
    } else if (address.endsWith('::')) {
      address = address + ':';
    }

    return address;
  };

  const generateAddresses = () => {
    const newAddresses: ULAAddress[] = [];

    for (let i = 0; i < count; i++) {
      const address = generateULAAddress();
      newAddresses.push(address);
    }

    setGeneratedAddresses([...generatedAddresses, ...newAddresses]);
  };

  const clearAll = () => {
    setGeneratedAddresses([]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const copyAllAddresses = () => {
    const addresses = generatedAddresses.map(addr => addr.address).join('\n');
    copyToClipboard(addresses);
  };

  const exportAsFile = () => {
    const content = generatedAddresses.map(addr =>
      `${addr.address}\t${addr.prefix}\t${addr.type}\t${addr.timestamp}`
    ).join('\n');

    const blob = new Blob([`ULA Address\tPrefix\tType\tTimestamp\n${content}`], {
      type: 'text/csv'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ula-addresses-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const removeAddress = (index: number) => {
    setGeneratedAddresses(generatedAddresses.filter((_, i) => i !== index));
  };

  const loadConfiguration = (config: typeof SAMPLE_CONFIGURATIONS[0]) => {
    setCustomPrefix(config.prefix);
    setSubnetBits(config.subnetBits);
  };

  const getSubnetInfo = () => {
    const availableSubnets = Math.pow(2, subnetBits - 16);
    const hostsPerSubnet = Math.pow(2, 64 - subnetBits);

    return {
      totalSubnets: availableSubnets,
      hostsPerSubnet: hostsPerSubnet,
      subnetMask: `${subnetBits}`,
      cidr: `${customPrefix}/${subnetBits}`
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">IPv6 ULA Generator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate IPv6 Unique Local Addresses (ULA), supporting custom prefixes and various interface ID generation methods.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Config Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Config Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  ULA Configuration
                </CardTitle>
                <CardDescription>
                  Configure IPv6 ULA address generation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prefix Config */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">ULA Prefix</Label>
                  <Input
                    value={customPrefix}
                    onChange={(e) => setCustomPrefix(e.target.value)}
                    placeholder="e.g.: fd00:1234:5678::"
                    className="font-mono"
                  />
                  <div className="text-xs text-muted-foreground">
                    Local unique address prefix starting with fd00::/8
                  </div>
                </div>

                {/* Subnet Config */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Subnet Bits</Label>
                    <Select value={subnetBits.toString()} onValueChange={(value) => setSubnetBits(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBNET_SIZES.map((size) => (
                          <SelectItem key={size.value} value={size.value.toString()}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Count</Label>
                    <Input
                      type="number"
                      value={count}
                      onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
                      min="1"
                      max="100"
                      placeholder="Count"
                    />
                  </div>
                </div>

                {/* Interface ID Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Interface ID Type</Label>
                  <Select value={interfaceIdType} onValueChange={(value) => setInterfaceIdType(value as InterfaceIdType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">Random</SelectItem>
                      <SelectItem value="eui64">EUI-64 (MAC based)</SelectItem>
                      <SelectItem value="stable">Stable Privacy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Advanced Options */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Advanced Options</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="randomSubnet"
                        checked={useRandomSubnet}
                        onCheckedChange={setUseRandomSubnet}
                      />
                      <Label htmlFor="randomSubnet" className="text-sm cursor-pointer">
                        Random Subnet ID
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="timestamp"
                        checked={includeTimestamp}
                        onCheckedChange={setIncludeTimestamp}
                      />
                      <Label htmlFor="timestamp" className="text-sm cursor-pointer">
                        Include Timestamp
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={generateAddresses} className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate ULA
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Result */}
            {generatedAddresses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Network className="h-5 w-5" />
                      Results ({generatedAddresses.length})
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyAllAddresses}>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy All
                      </Button>
                      <Button variant="outline" size="sm" onClick={exportAsFile}>
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Subnet Info: {getSubnetInfo().totalSubnets.toLocaleString()} subnets,
                    {getSubnetInfo().hostsPerSubnet.toLocaleString()} hosts per subnet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="list" className="w-full">
                    <TabsList>
                      <TabsTrigger value="list">Address List</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="space-y-3 mt-4">
                      {generatedAddresses.map((addr, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="flex-1">
                            <div className="font-mono text-lg font-semibold mb-1">
                              {addr.address}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Type: {addr.type}</span>
                              {includeTimestamp && <span>•</span>}
                              {includeTimestamp && <span>{addr.timestamp}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(addr.address)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAddress(index)}
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="details" className="space-y-4 mt-4">
                      {generatedAddresses.map((addr, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="outline">Address {index + 1}</Badge>
                            <Badge variant="secondary">{addr.type}</Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Full Address</div>
                              <div className="font-mono">{addr.address}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Prefix</div>
                              <div className="font-mono">{addr.prefix}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Subnet ID</div>
                              <div className="font-mono">:{addr.subnetId}:</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Interface ID</div>
                              <div className="font-mono">:{addr.interfaceId}</div>
                            </div>
                          </div>

                          {includeTimestamp && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="text-xs text-muted-foreground">
                                Generated: {addr.timestamp}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            {/* ULA Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  About ULA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>ULA (Unique Local Address):</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• RFC 4193 defined unique local address</li>
                    <li>• Prefix: fc00::/7</li>
                    <li>• Not routed on the public internet</li>
                    <li>• Used for internal network communication</li>
                  </ul>
                </div>
                <div>
                  <strong>Prefix Allocation:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• fc00::/8: Future definition</li>
                    <li>• fd00::/8: Randomly generated Global ID</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Presets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Router className="h-5 w-5" />
                  Presets
                </CardTitle>
                <CardDescription>
                  Click to use common network configs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {SAMPLE_CONFIGURATIONS.map((config, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => loadConfiguration(config)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{config.name}</span>
                      <Badge variant="outline" className="text-xs">
                        /{config.subnetBits}
                      </Badge>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground mb-1">
                      {config.prefix}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {config.description}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Subnet Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Subnet Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subnet Bits:</span>
                  <span className="font-semibold">/{subnetBits}</span>
                </div>
                <div className="flex justify-between">
                  <span>Available Subnets:</span>
                  <span className="font-semibold">{getSubnetInfo().totalSubnets.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hosts per Subnet:</span>
                  <span className="font-semibold">{getSubnetInfo().hostsPerSubnet.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>CIDR:</span>
                  <span className="font-mono text-xs">{getSubnetInfo().cidr}</span>
                </div>
              </CardContent>
            </Card>

            {/* Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Usage Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Interface ID Types:</strong>
                </div>
                <div className="space-y-2 ml-4">
                  <div>• <strong>Random:</strong> Completely random generation</div>
                  <div>• <strong>EUI-64:</strong> Based on MAC address</div>
                  <div>• <strong>Stable Privacy:</strong> Private but stable</div>
                </div>
                <div className="mt-3">
                  <strong>Best Practices:</strong>
                </div>
                <div className="space-y-1 ml-4">
                  <div>• Assign unique /48 for each site</div>
                  <div>• Assign /64 for each LAN</div>
                  <div>• Use random Subnet ID for security</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
