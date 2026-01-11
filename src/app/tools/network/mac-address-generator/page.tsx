'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Switch } from '@/components/ui';
import {
  Copy,
  RefreshCw,
  Download,
  Monitor,
  Smartphone,
  Router,
  Wifi,
  Globe,
  Network
} from 'lucide-react';

interface MACAddress {
  address: string;
  vendor?: string;
  type: string;
  timestamp: string;
}

const COMMON_MAC_PREFIXES = [
  { prefix: '00:1A:2B', vendor: 'Example Vendor 1', type: 'Network Interface' },
  { prefix: '00:11:22', vendor: 'Example Vendor 2', type: 'Wireless Card' },
  { prefix: 'AA:BB:CC', vendor: 'Example Vendor 3', type: 'Ethernet Adapter' },
  { prefix: 'DD:EE:FF', vendor: 'Example Vendor 4', type: 'Bluetooth Device' },
  { prefix: '33:44:55', vendor: 'Example Vendor 5', type: 'Virtual Network' }
];

const DEVICE_TYPES = [
  { value: 'random', label: '随机', icon: RefreshCw },
  { value: 'apple', label: 'Apple', icon: Smartphone },
  { value: 'samsung', label: 'Samsung', icon: Smartphone },
  { value: 'cisco', label: 'Cisco', icon: Router },
  { value: 'intel', label: 'Intel', icon: Monitor },
  { value: 'qualcomm', label: 'Qualcomm', icon: Wifi },
  { value: 'custom', label: '自定义前缀', icon: Globe }
];

export default function MacAddressGeneratorPage() {
  const [generatedAddresses, setGeneratedAddresses] = useState<MACAddress[]>([]);
  const [count, setCount] = useState<number>(1);
  const [format, setFormat] = useState<string>('colon');
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [deviceType, setDeviceType] = useState<string>('random');
  const [customPrefix, setCustomPrefix] = useState<string>('');
  const [useLocalPrefix, setUseLocalPrefix] = useState<boolean>(false);

  const generateRandomHex = (length: number): string => {
    const hexChars = '0123456789ABCDEF';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += hexChars[Math.floor(Math.random() * 16)];
    }
    return result;
  };

  const formatMACAddress = (address: string, formatType: string, isUppercase: boolean): string => {
    let formatted = address;

    if (!isUppercase) {
      formatted = formatted.toLowerCase();
    }

    switch (formatType) {
      case 'colon':
        return formatted.match(/.{2}/g)?.join(':') || address;
      case 'dash':
        return formatted.match(/.{2}/g)?.join('-') || address;
      case 'dot':
        return formatted.match(/.{4}/g)?.join('.') || address;
      case 'none':
        return formatted;
      default:
        return formatted.match(/.{2}/g)?.join(':') || address;
    }
  };

  const getVendorForPrefix = (prefix: string): string => {
    const vendor = COMMON_MAC_PREFIXES.find(v =>
      prefix.toLowerCase().startsWith(v.prefix.toLowerCase())
    );
    return vendor?.vendor || 'Unknown Vendor';
  };

  const getDeviceTypeInfo = (type: string): { vendor: string; deviceType: string } => {
    const typeMap: { [key: string]: { vendor: string; deviceType: string } } = {
      'apple': { vendor: 'Apple, Inc.', deviceType: 'Network Interface' },
      'samsung': { vendor: 'Samsung Electronics', deviceType: 'Wireless Adapter' },
      'cisco': { vendor: 'Cisco Systems', deviceType: 'Network Switch' },
      'intel': { vendor: 'Intel Corporation', deviceType: 'Ethernet Controller' },
      'qualcomm': { vendor: 'Qualcomm', deviceType: 'WiFi Adapter' },
      'random': { vendor: 'Random Vendor', deviceType: 'Network Device' },
      'custom': { vendor: getVendorForPrefix(customPrefix), deviceType: 'Custom Device' }
    };

    return typeMap[type] || typeMap['random'];
  };

  const generateMACAddress = (): string => {
    let prefix = '';

    if (useLocalPrefix && customPrefix) {
      // 使用自定义前缀
      const cleanPrefix = customPrefix.replace(/[:-\s]/g, '').toUpperCase();
      if (cleanPrefix.length >= 6) {
        prefix = cleanPrefix.substring(0, 6);
      } else {
        prefix = cleanPrefix + generateRandomHex(6 - cleanPrefix.length);
      }
    } else if (deviceType === 'custom') {
      prefix = customPrefix ? customPrefix.replace(/[:-\s]/g, '').toUpperCase() : generateRandomHex(6);
    } else {
      // 根据设备类型生成前缀
      const typeInfo = COMMON_MAC_PREFIXES[Math.floor(Math.random() * COMMON_MAC_PREFIXES.length)];
      prefix = typeInfo.prefix.replace(/[:-\s]/g, '').toUpperCase();
    }

    // 生成后6位
    const suffix = generateRandomHex(6);

    return prefix + suffix;
  };

  const generateMACAddresses = () => {
    const newAddresses: MACAddress[] = [];
    const typeInfo = getDeviceTypeInfo(deviceType);

    for (let i = 0; i < count; i++) {
      const rawAddress = generateMACAddress();
      const formattedAddress = formatMACAddress(rawAddress, format, uppercase);

      newAddresses.push({
        address: formattedAddress,
        vendor: typeInfo.vendor,
        type: typeInfo.deviceType,
        timestamp: new Date().toLocaleString('zh-CN')
      });
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
      `${addr.address}\t${addr.vendor}\t${addr.type}\t${addr.timestamp}`
    ).join('\n');

    const blob = new Blob([`MAC Address\tVendor\tDevice Type\tTimestamp\n${content}`], {
      type: 'text/csv'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mac-addresses-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const removeAddress = (index: number) => {
    setGeneratedAddresses(generatedAddresses.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (deviceType === 'custom') {
      setUseLocalPrefix(true);
    } else {
      setUseLocalPrefix(false);
    }
  }, [deviceType]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">MAC 地址生成器</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            生成随机或指定的 MAC 地址，支持多种格式和设备类型。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：生成配置 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 配置面板 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  生成配置
                </CardTitle>
                <CardDescription>
                  设置 MAC 地址的生成参数
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 数量设置 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">生成数量</Label>
                  <Input
                    type="number"
                    value={count}
                    onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
                    min="1"
                    max="100"
                    placeholder="输入生成数量 (1-100)"
                  />
                </div>

                {/* 设备类型选择 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">设备类型</Label>
                  <Select value={deviceType} onValueChange={setDeviceType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEVICE_TYPES.map((type) => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* 自定义前缀 */}
                {deviceType === 'custom' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">自定义前缀 (可选)</Label>
                    <Input
                      value={customPrefix}
                      onChange={(e) => setCustomPrefix(e.target.value)}
                      placeholder="例如: 00:1A:2B 或 001A2B"
                      className="font-mono"
                    />
                    <div className="text-xs text-muted-foreground">
                      输入 MAC 地址前缀 (前6位)，支持冒号、连字符或无分隔符格式
                    </div>
                  </div>
                )}

                {/* 格式设置 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">格式类型</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="colon">XX:XX:XX:XX:XX:XX</SelectItem>
                        <SelectItem value="dash">XX-XX-XX-XX-XX-XX</SelectItem>
                        <SelectItem value="dot">XXXX.XXXX.XXXX</SelectItem>
                        <SelectItem value="none">XXXXXXXXXXXX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">字母大小写</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch
                        id="uppercase"
                        checked={uppercase}
                        onCheckedChange={setUppercase}
                      />
                      <Label htmlFor="uppercase" className="text-sm cursor-pointer">
                        大写字母
                      </Label>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <Button onClick={generateMACAddresses} className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    生成 MAC 地址
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    清空
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 生成结果 */}
            {generatedAddresses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      生成结果 ({generatedAddresses.length})
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyAllAddresses}>
                        <Copy className="h-3 w-3 mr-1" />
                        复制全部
                      </Button>
                      <Button variant="outline" size="sm" onClick={exportAsFile}>
                        <Download className="h-3 w-3 mr-1" />
                        导出
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    点击复制单个地址，或使用上方按钮批量操作
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
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
                            <span>{addr.vendor}</span>
                            <span>•</span>
                            <span>{addr.type}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {addr.timestamp}
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
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右侧：信息面板 */}
          <div className="space-y-6">
            {/* MAC 地址说明 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  MAC 地址说明
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>格式:</strong> 48位(12位十六进制数)
                </div>
                <div>
                  <strong>结构:</strong> 前24位(OUI) + 后24位
                </div>
                <div>
                  <strong>OUI:</strong> 厂商唯一标识符
                </div>
                <div>
                  <strong>用途:</strong> 网络设备硬件地址
                </div>
              </CardContent>
            </Card>

            {/* 格式示例 */}
            <Card>
              <CardHeader>
                <CardTitle>格式示例</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 font-mono text-sm">
                <div className="p-2 bg-muted rounded">
                  XX:XX:XX:XX:XX:XX (标准)
                </div>
                <div className="p-2 bg-muted rounded">
                  XX-XX-XX-XX-XX-XX (连字符)
                </div>
                <div className="p-2 bg-muted rounded">
                  XXXX.XXXX.XXXX (点分)
                </div>
                <div className="p-2 bg-muted rounded">
                  XXXXXXXXXXXX (无分隔符)
                </div>
              </CardContent>
            </Card>

            {/* 常用厂商前缀 */}
            <Card>
              <CardHeader>
                <CardTitle>常用厂商前缀</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {COMMON_MAC_PREFIXES.map((item, index) => (
                  <div key={index} className="p-2 border rounded text-sm">
                    <div className="font-mono font-semibold">{item.prefix}:XX:XX:XX</div>
                    <div className="text-muted-foreground">{item.vendor}</div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {item.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 使用提示 */}
            <Card>
              <CardHeader>
                <CardTitle>使用提示</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>• 生成的 MAC 地址仅供测试使用</div>
                <div>• 实际网络设备需要唯一的 MAC 地址</div>
                <div>• 第一个字节的最低位表示单播/组播</div>
                <div>• 第二个字节的最低位表示本地/全局管理</div>
                <div>• 可以生成批量地址用于网络测试</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}