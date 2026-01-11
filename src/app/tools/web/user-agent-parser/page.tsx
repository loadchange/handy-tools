'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Monitor, Smartphone, Tablet, Copy, RefreshCw, Globe } from 'lucide-react';
import { UAParser } from 'ua-parser-js';

interface ParsedUA {
  ua: string;
  browser: {
    name: string;
    version: string;
    major: string;
  };
  engine: {
    name: string;
    version: string;
  };
  os: {
    name: string;
    version: string;
  };
  device: {
    model: string;
    type: string;
    vendor: string;
  };
  cpu: {
    architecture: string;
  };
}

export default function UserAgentParserPage() {
  const [userAgentInput, setUserAgentInput] = useState('');
  const [parsedUA, setParsedUA] = useState<ParsedUA | null>(null);

  const parseUserAgent = (uaString: string): ParsedUA | null => {
    if (!uaString.trim()) return null;

    try {
      const parser = new UAParser(uaString);
      const result = parser.getResult();

      return {
        ua: uaString,
        browser: {
          name: result.browser.name || 'Unknown',
          version: result.browser.version || 'Unknown',
          major: result.browser.major || 'Unknown'
        },
        engine: {
          name: result.engine.name || 'Unknown',
          version: result.engine.version || 'Unknown'
        },
        os: {
          name: result.os.name || 'Unknown',
          version: result.os.version || 'Unknown'
        },
        device: {
          model: result.device.model || 'Unknown',
          type: result.device.type || 'Unknown',
          vendor: result.device.vendor || 'Unknown'
        },
        cpu: {
          architecture: result.cpu?.architecture || 'Unknown'
        }
      };
    } catch (error) {
      console.error('User Agent parsing error:', error);
      return null;
    }
  };

  useEffect(() => {
    setParsedUA(parseUserAgent(userAgentInput));
  }, [userAgentInput]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const handleClear = () => {
    setUserAgentInput('');
    setParsedUA(null);
  };

  const detectCurrentUA = () => {
    setUserAgentInput(navigator.userAgent);
  };

  const loadSampleUA = () => {
    setUserAgentInput('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  };

  const loadMobileUA = () => {
    setUserAgentInput('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      case 'tablet':
        return <Tablet className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const getBrowserIcon = (browserName: string) => {
    // Return browser-related emoji or icon
    const browserIcons: { [key: string]: string } = {
      'Chrome': '🌐',
      'Firefox': '🦊',
      'Safari': '🍎',
      'Edge': '🌐',
      'Opera': '🎭',
      'Internet Explorer': '🌐'
    };
    return browserIcons[browserName] || '🌐';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">User Agent Parser</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Parse User Agent strings to get detailed information about browser, operating system, device, etc.
          </p>
        </div>

        {/* User Agent Input Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              User Agent Input
            </CardTitle>
            <CardDescription>
              Enter the User Agent string to parse
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter User Agent string..."
              value={userAgentInput}
              onChange={(e) => setUserAgentInput(e.target.value)}
              className="min-h-[100px] resize-none font-mono text-sm"
            />

            <div className="flex gap-2">
              <Button variant="outline" onClick={detectCurrentUA} className="flex-1">
                <Monitor className="h-4 w-4 mr-2" />
                Detect Current
              </Button>
              <Button variant="outline" onClick={loadSampleUA} className="flex-1">
                Load Desktop
              </Button>
              <Button variant="outline" onClick={loadMobileUA} className="flex-1">
                Load Mobile
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>• Characters: {userAgentInput.length}</p>
            </div>
          </CardContent>
        </Card>

        {/* Parsing Result */}
        {parsedUA && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Device Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getDeviceIcon(parsedUA.device.type)}
                  Device Info
                </CardTitle>
                <CardDescription>
                  Device type and specifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="font-medium">Device Type</span>
                    <span className="flex items-center gap-2">
                      {getDeviceIcon(parsedUA.device.type)}
                      <span className="text-sm">{parsedUA.device.type}</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="font-medium">Model</span>
                    <span className="text-sm">{parsedUA.device.model}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="font-medium">Vendor</span>
                    <span className="text-sm">{parsedUA.device.vendor}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="font-medium">CPU Architecture</span>
                    <span className="text-sm">{parsedUA.cpu.architecture}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* OS Info */}
            <Card>
              <CardHeader>
                <CardTitle>Operating System</CardTitle>
                <CardDescription>
                  OS Information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {parsedUA.os.name === 'Windows' && '🪟'}
                      {parsedUA.os.name === 'Mac OS' && '🍎'}
                      {parsedUA.os.name === 'Linux' && '🐧'}
                      {parsedUA.os.name === 'Android' && '🤖'}
                      {parsedUA.os.name === 'iOS' && '📱'}
                      {!['Windows', 'Mac OS', 'Linux', 'Android', 'iOS'].includes(parsedUA.os.name) && '💻'}
                    </div>
                    <div className="text-lg font-medium">{parsedUA.os.name}</div>
                    <div className="text-sm text-muted-foreground">Version {parsedUA.os.version}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Browser Info */}
            <Card>
              <CardHeader>
                <CardTitle>Browser Info</CardTitle>
                <CardDescription>
                  Browser and Engine Information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-center">
                    <div className="text-2xl mb-2">{getBrowserIcon(parsedUA.browser.name)}</div>
                    <div className="text-lg font-medium">{parsedUA.browser.name}</div>
                    <div className="text-sm text-muted-foreground">Version {parsedUA.browser.version}</div>
                  </div>
                </div>

                <div className="p-3 bg-muted rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Major Version</span>
                    <span className="text-sm">{parsedUA.browser.major}</span>
                  </div>
                </div>

                <div className="p-3 bg-muted rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Engine</span>
                    <span className="text-sm">{parsedUA.engine.name} {parsedUA.engine.version}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Full Info */}
            <Card>
              <CardHeader>
                <CardTitle>Full Information</CardTitle>
                <CardDescription>
                  Raw User Agent string and structured data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Raw User Agent</h4>
                  <div className="p-3 bg-muted rounded-md">
                    <div className="font-mono text-xs break-all">
                      {parsedUA.ua}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(parsedUA.ua)}
                    className="mt-2"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy UA
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Structured Data</h4>
                  <div className="p-3 bg-muted rounded-md">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(parsedUA, null, 2)}
                    </pre>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(JSON.stringify(parsedUA, null, 2))}
                    className="mt-2"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy JSON
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Agent Explanation */}
        <Card>
          <CardHeader>
            <CardTitle>About User Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-3">What is User Agent?</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>Identifier</strong>: String sent by browser to server</div>
                  <div>• <strong>Contains</strong>: Browser, OS, device info, etc.</div>
                  <div>• <strong>Usage</strong>: Content adaptation, analytics, compatibility</div>
                  <div>• <strong>Format</strong>: Follows HTTP standards</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Common Use Cases</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>Responsive Design</strong>: Detect device type</div>
                  <div>• <strong>Feature Detection</strong>: Determine browser capabilities</div>
                  <div>• <strong>Analytics</strong>: Collect user device statistics</div>
                  <div>• <strong>Compatibility</strong>: Adapt to different browser versions</div>
                  <div>• <strong>Security</strong>: Identify bots and crawlers</div>
                </div>
              </div>
            </div>

            {/* Common Patterns */}
            <div className="mt-6 p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-3 text-sm">Common User Agent Patterns</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="font-mono text-green-700 mb-1">Chrome Desktop:</p>
                  <pre className="bg-background p-2 rounded">
{`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`}
                  </pre>
                </div>
                <div>
                  <p className="font-mono text-green-700 mb-1">Safari Desktop:</p>
                  <pre className="bg-background p-2 rounded">
{`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Version/17.0 Safari/605.1.36`}
                  </pre>
                </div>
                <div>
                  <p className="font-mono text-green-700 mb-1">Firefox Desktop:</p>
                  <pre className="bg-background p-2 rounded">
{`Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0`}
                  </pre>
                </div>
                <div>
                  <p className="font-mono text-green-700 mb-1">Chrome Mobile:</p>
                  <pre className="bg-background p-2 rounded">
{`Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Mobile Safari/537.36 Chrome/120.0.0.0`}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}