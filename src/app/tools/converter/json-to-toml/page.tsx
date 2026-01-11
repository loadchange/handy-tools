'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Copy, Code, AlertTriangle } from 'lucide-react';
import toml from '@iarna/toml';

export default function JsonToTomlPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const jsonObj = JSON.parse(input);
      const tomlString = toml.stringify(jsonObj);
      setOutput(tomlString);
      setError(null);
    } catch (err) {
      setOutput('');
      setError(err instanceof Error ? err.message : 'Conversion failed');
    }
  }, [input]);

  useEffect(() => {
    convert();
  }, [convert]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const loadSample = () => {
    setInput(JSON.stringify({
      title: "TOML Example",
      owner: {
        name: "Tom Preston-Werner",
        dob: "1979-05-27T07:32:00-08:00"
      },
      database: {
        enabled: true,
        ports: [8000, 8001, 8002],
        data: [ ["delta", "phi"], [3.14] ],
        temp_targets: { cpu: 79.5, case: 72.0 }
      }
    }, null, 2));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">JSON to TOML Converter</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Convert JSON data to TOML format.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              JSON Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste JSON here..."
              className="min-h-[400px] font-mono"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadSample}>Load Sample</Button>
              <Button variant="outline" onClick={() => setInput('')}>Clear</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              TOML Output
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={output}
              readOnly
              className="min-h-[400px] font-mono"
              placeholder="TOML output..."
            />
            <div className="flex gap-2">
              <Button onClick={handleCopy} disabled={!output}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Output
              </Button>
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 flex items-center gap-2">
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
