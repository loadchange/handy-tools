'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Label } from '@/components/ui';
import { Slider } from '@/components/ui';
import { RefreshCw, Download, QrCode, Link, Mail, Phone } from 'lucide-react';
import QRCode from 'qrcode';

interface QRCodeConfig {
  text: string;
  size: number;
  margin: number;
  color: {
    dark: string;
    light: string;
  };
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

export default function QRCodeGeneratorPage() {
  const [config, setConfig] = useState<QRCodeConfig>({
    text: 'https://example.com',
    size: 256,
    margin: 4,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M'
  });

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const generateQRCode = useCallback(async () => {
    if (!config.text.trim()) {
      setQrCodeDataUrl('');
      return;
    }

    try {
      const options = {
        width: config.size,
        margin: config.margin,
        color: {
          dark: config.color.dark,
          light: config.color.light
        },
        errorCorrectionLevel: config.errorCorrectionLevel
      };

      const dataUrl = await QRCode.toDataURL(config.text, options);
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('QR Code generation error:', error);
      setQrCodeDataUrl('');
    }
  }, [config]);

  useEffect(() => {
    generateQRCode();
  }, [config, generateQRCode]);

  const handleDownload = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    if (!qrCodeDataUrl) return;

    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeDataUrl);
      const blob = await response.blob();

      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      console.log('QR Code copied to clipboard');
    } catch (error) {
      console.error('Failed to copy QR Code:', error);
    }
  };

  const loadTemplate = (value: string) => {
    setConfig(prev => ({ ...prev, text: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">QR Code Generator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate various types of QR codes, supporting custom styles and error correction levels.
          </p>
        </div>

        {/* Quick Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Templates</CardTitle>
            <CardDescription>
              Select a template to generate quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                onClick={() => loadTemplate('https://github.com')}
                className="flex items-center gap-2"
              >
                <Link className="h-4 w-4" />
                URL
              </Button>
              <Button
                variant="outline"
                onClick={() => loadTemplate('mailto:contact@example.com')}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button
                variant="outline"
                onClick={() => loadTemplate('tel:+1234567890')}
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Phone
              </Button>
              <Button
                variant="outline"
                onClick={() => loadTemplate('WIFI:T:WPA;S:MyNetwork;P:MyPassword;;')}
                className="flex items-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                WiFi
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Config Area */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code Configuration</CardTitle>
              <CardDescription>
                Set QR code content and style
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Content Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Content</Label>
                <Textarea
                  placeholder="Enter content to generate QR code..."
                  value={config.text}
                  onChange={(e) => setConfig(prev => ({ ...prev, text: e.target.value }))}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Size */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Size: {config.size}px</Label>
                <Slider
                  value={[config.size]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, size: value[0] }))}
                  max={512}
                  min={128}
                  step={32}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>128px</span>
                  <span>512px</span>
                </div>
              </div>

              {/* Margin */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Margin: {config.margin}</Label>
                <Slider
                  value={[config.margin]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, margin: value[0] }))}
                  max={8}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Error Correction */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Error Correction Level</Label>
                <Select
                  value={config.errorCorrectionLevel}
                  onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => setConfig(prev => ({ ...prev, errorCorrectionLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">L - Low (~7%)</SelectItem>
                    <SelectItem value="M">M - Medium (~15%)</SelectItem>
                    <SelectItem value="Q">Q - Quartile (~25%)</SelectItem>
                    <SelectItem value="H">H - High (~30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color Settings */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Color Settings</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Foreground</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={config.color.dark}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          color: { ...prev.color, dark: e.target.value }
                        }))}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        value={config.color.dark}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          color: { ...prev.color, dark: e.target.value }
                        }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Background</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={config.color.light}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          color: { ...prev.color, light: e.target.value }
                        }))}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        value={config.color.light}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          color: { ...prev.color, light: e.target.value }
                        }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={generateQRCode} className="flex-1">
                  <QrCode className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
                <Button variant="outline" onClick={() => setConfig(prev => ({ ...prev, text: '' }))}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Area */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code Preview</CardTitle>
              <CardDescription>
                {qrCodeDataUrl ? 'Generated QR Code' : 'Auto-generated after input'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                {qrCodeDataUrl ? (
                  <div className="relative">
                    <Image
                      src={qrCodeDataUrl}
                      alt="Generated QR Code"
                      width={config.size}
                      height={config.size}
                      className="border-2 border-border rounded-lg"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </div>
                ) : (
                  <div className="w-64 h-64 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <QrCode className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">QR Code Preview</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-sm text-muted-foreground text-center">
                <p>• Size: {config.size} × {config.size} pixels</p>
                <p>• Margin: {config.margin} modules</p>
                <p>• Content Length: {config.text.length} chars</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleDownload}
                  disabled={!qrCodeDataUrl}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!qrCodeDataUrl}
                >
                  Copy Image
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Guide */}
        <Card>
          <CardHeader>
            <CardTitle>User Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-3">QR Code Types</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>URL</strong>: https://example.com</div>
                  <div>• <strong>Email</strong>: mailto:email@example.com</div>
                  <div>• <strong>Phone</strong>: tel:+1234567890</div>
                  <div>• <strong>SMS</strong>: sms:+1234567890?body=Hello</div>
                  <div>• <strong>WiFi</strong>: WIFI:T:WPA;S:MyNetwork;P:MyPassword;;</div>
                  <div>• <strong>Map</strong>: geo:latitude,longitude</div>
                  <div>• <strong>vCard</strong>: vCard format text</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Error Correction Levels</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>L - Low</strong>: ~7% error recovery, max capacity</div>
                  <div>• <strong>M - Medium</strong>: ~15% error recovery, good balance</div>
                  <div>• <strong>Q - Quartile</strong>: ~25% error recovery</div>
                  <div>• <strong>H - High</strong>: ~30% error recovery, min capacity</div>
                </div>
                <div className="mt-3 p-3 bg-muted rounded-md">
                  <p className="text-xs">Suggestion: Use High for important info, Medium for general use.</p>
                </div>
              </div>
            </div>

            {/* WiFi Format */}
            <div className="mt-6 p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-3 text-sm">WiFi QR Code Format</h4>
              <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
{`WIFI:T:[WPA|WEP|nopass];S:[SSID];P:[PASSWORD];H:[true|false];;

Example: WIFI:T:WPA;S:MyHomeWiFi;P:MyPassword123;;`}
              </pre>
              <div className="mt-2 text-xs text-muted-foreground">
                <p>• T: Encryption Type (WPA/WEP/nopass)</p>
                <p>• S: Network Name (SSID)</p>
                <p>• P: Password (optional for open networks)</p>
                <p>• H: Hidden Network (optional)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
