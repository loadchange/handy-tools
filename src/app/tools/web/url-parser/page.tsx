'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { Copy, AlertTriangle } from 'lucide-react';

interface UrlParts {
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  params: Record<string, string | string[]>;
  origin: string;
}

export default function UrlParserPage() {
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<UrlParts | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setParsed(null);
      setError(null);
      return;
    }

    try {
      const url = new URL(input);
      const params: Record<string, string | string[]> = {};

      // Handle multiple values for same key
      url.searchParams.forEach((value, key) => {
        if (params[key]) {
          if (Array.isArray(params[key])) {
            (params[key] as string[]).push(value);
          } else {
            params[key] = [params[key] as string, value];
          }
        } else {
          params[key] = value;
        }
      });

      setParsed({
        protocol: url.protocol,
        host: url.host,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        params,
        origin: url.origin,
      });
      setError(null);
    } catch {
      setParsed(null);
      setError('Invalid URL');
    }
  }, [input]);

  const loadSample = () => {
    setInput('https://www.example.com:8080/path/to/resource?query=param&id=123&id=456#section');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">URL Parser</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Parse URLs into their constituent parts (protocol, host, path, query parameters).
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Input URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://example.com/..."
              className="flex-1"
            />
            <Button variant="outline" onClick={loadSample}>Sample</Button>
            <Button variant="outline" onClick={() => setInput('')}>Clear</Button>
          </div>
          {error && (
            <div className="text-sm text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {parsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>URL Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Protocol', value: parsed.protocol },
                { label: 'Host', value: parsed.host },
                { label: 'Hostname', value: parsed.hostname },
                { label: 'Port', value: parsed.port || '(default)' },
                { label: 'Pathname', value: parsed.pathname },
                { label: 'Origin', value: parsed.origin },
                { label: 'Hash', value: parsed.hash },
              ].map((item) => (
                <div key={item.label} className="group">
                  <Label className="text-xs text-muted-foreground">{item.label}</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-2 bg-muted rounded font-mono text-sm break-all">
                      {item.value || <span className="text-muted-foreground italic">empty</span>}
                    </div>
                    {item.value && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(item.value)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Query Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(parsed.params).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(parsed.params).map(([key, value]) => (
                    <div key={key} className="group">
                      <Label className="text-xs text-muted-foreground">{key}</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-2 bg-muted rounded font-mono text-sm break-all">
                          {Array.isArray(value) ? JSON.stringify(value) : value}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(Array.isArray(value) ? JSON.stringify(value) : value)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground text-sm italic">
                  No query parameters found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
