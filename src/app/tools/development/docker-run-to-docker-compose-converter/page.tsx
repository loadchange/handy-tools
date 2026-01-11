'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Copy, AlertTriangle } from 'lucide-react';
// @ts-expect-error: Missing type definition for composerize
import composerize from 'composerize';

export default function DockerRunToComposePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      // Basic cleanup
      const cleanInput = input.trim().replace(/\\\n/g, ' ').replace(/\s+/g, ' ');

      if (!cleanInput.startsWith('docker run')) {
        throw new Error('Command must start with "docker run"');
      }

      const compose = composerize(cleanInput);
      setOutput(compose);
      setError(null);
    } catch (err) {
      setOutput('');
      setError(err instanceof Error ? err.message : 'Conversion failed');
    }
  }, [input]);

  const loadSample = () => {
    setInput('docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Docker Run to Compose</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Convert &quot;docker run&quot; commands to docker-compose files.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Docker Run Command</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="docker run -p 80:80 nginx"
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadSample}>Load Sample</Button>
              <Button variant="outline" onClick={() => setInput('')}>Clear</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Docker Compose</span>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(output)} disabled={!output}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              readOnly
              className="min-h-[300px] font-mono text-sm"
              placeholder="version: '3.3'..."
            />
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
