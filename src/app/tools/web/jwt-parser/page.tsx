'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { AlertTriangle, Key, Shield, Copy, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

interface JWTHeader {
  alg?: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
}

interface ParsedJWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  isValid: boolean;
  error?: string;
  isExpired?: boolean;
  expiresAt?: Date;
}

export default function JWTParserPage() {
  const [jwtInput, setJwtInput] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const [parsedJWT, setParsedJWT] = useState<ParsedJWT | null>(null);

  const parseJWT = (token: string): ParsedJWT | null => {
    if (!token.trim()) {
      return null;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return {
          header: {} as JWTHeader,
          payload: {} as JWTPayload,
          signature: '',
          isValid: false,
          error: 'Invalid JWT format, should have 3 parts'
        };
      }

      // Decode Header
      const headerData = JSON.parse(atob(parts[0]));

      // Decode Payload
      const payloadData = JSON.parse(atob(parts[1]));

      // Check Expiry
      const now = Math.floor(Date.now() / 1000);
      const isExpired = payloadData.exp && payloadData.exp < now;
      const expiresAt = payloadData.exp ? new Date(payloadData.exp * 1000) : undefined;

      return {
        header: headerData,
        payload: payloadData,
        signature: parts[2],
        isValid: true,
        isExpired,
        expiresAt
      };
    } catch (error) {
      return {
        header: {} as JWTHeader,
        payload: {} as JWTPayload,
        signature: '',
        isValid: false,
        error: error instanceof Error ? error.message : 'JWT parsing failed'
      };
    }
  };

  useEffect(() => {
    setParsedJWT(parseJWT(jwtInput));
  }, [jwtInput]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const handleClear = () => {
    setJwtInput('');
    setParsedJWT(null);
  };

  const loadSampleJWT = () => {
    setJwtInput('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.4Adcj3UFYzP5sZK9Sqa3PLjkDyJMj0R6KY8d7YQkV9');
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getTimeRemaining = (expiryTime: number): string => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = expiryTime - now;

    if (remaining <= 0) {
      return 'Expired';
    }

    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 && parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(' ') || 'Expiring soon';
  };

  const renderJSON = (obj: unknown): string => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">JWT Parser</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Parse and inspect JSON Web Tokens (JWT), view Header, Payload, and Signature.
          </p>
        </div>

        {/* Security Warning */}
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-medium text-orange-900">Security Warning</h3>
                <p className="text-sm text-orange-800">
                  JWTs contain sensitive info. Do not paste real tokens in insecure environments. This tool runs entirely client-side.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* JWT Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              JWT Input
            </CardTitle>
            <CardDescription>
              Enter JWT token to parse
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter JWT token, e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={jwtInput}
              onChange={(e) => setJwtInput(e.target.value)}
              className="min-h-[100px] resize-none font-mono text-sm"
            />

            <div className="flex gap-2">
              <Button variant="outline" onClick={loadSampleJWT} className="flex-1">
                Load Sample
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>

            {/* Status */}
            {parsedJWT && (
              <div className={`p-3 rounded-md ${
                parsedJWT.isValid && !parsedJWT.isExpired
                  ? 'bg-green-50 border border-green-200'
                  : parsedJWT.isExpired
                  ? 'bg-orange-50 border border-orange-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {parsedJWT.isValid && !parsedJWT.isExpired ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : parsedJWT.isExpired ? (
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    parsedJWT.isValid && !parsedJWT.isExpired
                      ? 'text-green-800'
                      : parsedJWT.isExpired
                      ? 'text-orange-800'
                      : 'text-red-800'
                  }`}>
                    {parsedJWT.isValid && !parsedJWT.isExpired
                      ? 'Valid JWT Format'
                      : parsedJWT.isExpired
                      ? 'JWT Expired'
                      : 'Invalid JWT Format'
                    }
                  </span>
                </div>
                {parsedJWT.error && (
                  <p className="text-xs text-red-700 mt-1">{parsedJWT.error}</p>
                )}
                {parsedJWT.expiresAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Expires: {parsedJWT.expiresAt.toLocaleString()}
                    {parsedJWT.isExpired && ' (Expired)'}
                    {!parsedJWT.isExpired && ` (Remains: ${getTimeRemaining(parsedJWT.expiresAt.getTime() / 1000)})`}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result */}
        {parsedJWT && parsedJWT.isValid && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Header
                </CardTitle>
                <CardDescription>
                  Header
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {Object.entries(parsedJWT.header).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="font-mono text-sm">{key}</span>
                      <span className="text-sm font-mono break-all max-w-[200px]">
                        {typeof value === 'string' ? value : JSON.stringify(value)}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(renderJSON(parsedJWT.header))}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Header
                </Button>
              </CardContent>
            </Card>

            {/* Payload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Payload
                </CardTitle>
                <CardDescription>
                  Payload
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {Object.entries(parsedJWT.payload).map(([key, value]) => {
                    let displayValue = value;
                    let className = '';

                    if (key === 'exp' || key === 'iat' || key === 'nbf') {
                      displayValue = formatTimestamp(typeof value === 'number' ? value : 0);
                      className = parsedJWT.isExpired && key === 'exp' ? 'text-red-600' : '';
                    } else if (key === 'aud' && Array.isArray(value)) {
                      displayValue = value.join(', ');
                    } else if (typeof value === 'object') {
                      displayValue = JSON.stringify(value);
                    }

                    return (
                      <div key={key} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="font-mono text-sm">{key}</span>
                        <span className={`text-sm font-mono break-all max-w-[200px] ${className}`}>
                          {String(displayValue)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(renderJSON(parsedJWT.payload))}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Payload
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Signature */}
        {parsedJWT && parsedJWT.isValid && parsedJWT.signature && (
          <Card>
            <CardHeader>
              <CardTitle>Signature</CardTitle>
              <CardDescription>
                Signature
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-md">
                <div className="font-mono text-xs break-all">
                  {parsedJWT.signature}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(parsedJWT.signature)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Signature
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle>JWT Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-3">Header</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>alg</strong>: Signing Algorithm</div>
                  <div>• <strong>typ</strong>: Token Type</div>
                  <div>• <strong>kid</strong>: Key ID</div>
                  <div>• Other custom fields</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Payload</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>iss</strong>: Issuer</div>
                  <div>• <strong>sub</strong>: Subject</div>
                  <div>• <strong>aud</strong>: Audience</div>
                  <div>• <strong>exp</strong>: Expiration Time</div>
                  <div>• <strong>iat</strong>: Issued At</div>
                  <div>• <strong>nbf</strong>: Not Before</div>
                  <div>• Custom Claims</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Signature</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• Verifies integrity</div>
                  <div>• Prevents tampering</div>
                  <div>• Signed with key</div>
                  <div>• Base64URL encoded</div>
                </div>
              </div>
            </div>

            {/* Format */}
            <div className="mt-6 p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-3 text-sm">JWT Format</h4>
              <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
{`Header.Payload.Signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIn0.
4Adcj3UFYzP5sZK9Sqa3PLjkDyJMj0R6KY8d7YQkV9`}
              </pre>
              <div className="mt-2 text-xs text-muted-foreground">
                <p>• Header & Payload are Base64URL encoded</p>
                <p>• Three parts separated by dots (.)</p>
                <p>• Signature may be empty (unsecured JWT)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
