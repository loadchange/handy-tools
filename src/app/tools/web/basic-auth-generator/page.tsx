'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { ResultDisplay } from '@/components/ui';
import { Shield, Key, Copy, RefreshCw } from 'lucide-react';

export default function BasicAuthGeneratorPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authHeader, setAuthHeader] = useState('');

  const generateBasicAuth = useCallback(() => {
    if (!username.trim()) {
      setAuthHeader('');
      return;
    }

    try {
      const credentials = `${username}:${password}`;
      const encodedCredentials = Buffer.from(credentials).toString('base64');
      const authValue = `Basic ${encodedCredentials}`;
      setAuthHeader(authValue);
    } catch (error) {
      console.error('Basic auth generation error:', error);
      setAuthHeader('Error generating Basic Auth');
    }
  }, [username, password]);

  useEffect(() => {
    generateBasicAuth();
  }, [generateBasicAuth]);

  const handleCopyAuth = () => {
    navigator.clipboard.writeText(authHeader).then(() => {
      console.log('Basic auth header copied to clipboard');
    });
  };

  const handleCopyCredentials = () => {
    const credentials = `${username}:${password}`;
    navigator.clipboard.writeText(credentials).then(() => {
      console.log('Credentials copied to clipboard');
    });
  };

  const handleClear = () => {
    setUsername('');
    setPassword('');
    setAuthHeader('');
  };

  const generateRandomPassword = (length = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Basic Auth Generator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate HTTP Basic Authentication headers for simple authentication scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Credentials
              </CardTitle>
              <CardDescription>
                Enter username and password to generate Basic Auth header
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Username Input */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateRandomPassword()}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Random Password
                </Button>
              </div>

              {/* Credentials Display */}
              {username && (
                <div className="p-3 bg-muted rounded-md">
                  <Label className="text-sm text-muted-foreground">Credential String</Label>
                  <div className="font-mono text-sm mt-1 break-all">
                    {username}:{password}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyCredentials}
                    className="mt-2 h-8 px-2"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Credentials
                  </Button>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={generateBasicAuth}
                  className="flex-1"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Result Area */}
          <ResultDisplay
            title="Authorization Header"
            result={authHeader}
            type="code"
            showCopy={!!authHeader}
            onCopy={handleCopyAuth}
            placeholder="Enter username to generate Authorization header"
          />
        </div>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">HTTP Header</h4>
                <div className="bg-muted p-4 rounded-md font-mono text-sm">
                  <div>GET /api/resource HTTP/1.1</div>
                  <div>Host: example.com</div>
                  <div>Authorization: {authHeader || 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='}</div>
                  <div>Content-Type: application/json</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">JavaScript Fetch API</h4>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`fetch('/api/data', {
  headers: {
    'Authorization': '${authHeader || 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='}',
    'Content-Type': 'application/json'
  }
})`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">cURL Command</h4>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`curl -H "Authorization: ${authHeader || 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='}" \\
     https://api.example.com/data`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Security Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Basic Auth transmits Base64 encoded credentials in cleartext</p>
              <p>• Use only over HTTPS</p>
              <p>• Consider more secure methods (JWT, OAuth2)</p>
              <p>• Rotate credentials regularly</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
