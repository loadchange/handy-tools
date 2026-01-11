'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Checkbox } from '@/components/ui';
import { Wifi, Download, Eye, EyeOff, Printer } from 'lucide-react';
import QRCode from 'qrcode';

export default function WifiQrCodeGeneratorPage() {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');
  const [hidden, setHidden] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const generateQr = useCallback(async () => {
    if (!ssid) {
      setQrDataUrl('');
      return;
    }

    const escapeSpecialChars = (str: string) => {
      return str.replace(/([\\;,:"])/g, '\\$1');
    };

    // WIFI:S:MySSID;T:WPA;P:MyPass;H:false;;
    let wifiString = `WIFI:S:${escapeSpecialChars(ssid)};`;

    if (encryption !== 'nopass') {
      wifiString += `T:${encryption};P:${escapeSpecialChars(password)};`;
    } else {
      wifiString += `T:nopass;`;
    }

    if (hidden) {
      wifiString += `H:true;`;
    }

    wifiString += `;`;

    try {
      const url = await QRCode.toDataURL(wifiString, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  }, [ssid, password, encryption, hidden]);

  useEffect(() => {
    generateQr();
  }, [generateQr]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `wifi-${ssid.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (!qrDataUrl) return;
    const win = window.open('', '', 'height=600,width=800');
    if (win) {
      win.document.write('<html><head><title>WiFi QR Code</title>');
      win.document.write('<style>body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; text-align: center; } img { max-width: 80%; } .ssid { font-size: 24px; margin-top: 20px; font-weight: bold; } .pass { margin-top: 10px; color: #555; }</style>');
      win.document.write('</head><body>');
      win.document.write(`<img src="${qrDataUrl}" />`);
      win.document.write(`<div class="ssid">Network: ${ssid}</div>`);
      if (password) {
        win.document.write(`<div class="pass">Password: ${password}</div>`);
      }
      win.document.write('</body></html>');
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">WiFi QR Code Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create a QR code to easily connect devices to your WiFi network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Network Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ssid">Network Name (SSID)</Label>
                <Input
                  id="ssid"
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  placeholder="MyWiFiNetwork"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="encryption">Encryption</Label>
                <Select value={encryption} onValueChange={setEncryption}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2/WPA3</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {encryption !== 'nopass' && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="WiFi Password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="hidden"
                  checked={hidden}
                  onCheckedChange={(checked) => setHidden(checked as boolean)}
                />
                <Label htmlFor="hidden" className="text-sm font-normal cursor-pointer">
                  Hidden Network
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
              {qrDataUrl ? (
                <div className="space-y-6 text-center w-full">
                  <div className="bg-white p-4 rounded-lg shadow-sm border inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrDataUrl} alt="WiFi QR Code" className="w-48 h-48 md:w-64 md:h-64" />
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download PNG
                    </Button>
                    <Button variant="outline" onClick={handlePrint}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">{ssid}</p>
                    {encryption !== 'nopass' && <p>Password: {showPassword ? password : '••••••••'}</p>}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <Wifi className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Enter network details to generate QR code</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
