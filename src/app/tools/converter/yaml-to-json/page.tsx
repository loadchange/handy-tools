'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { FileText, Code, Copy, AlertTriangle } from 'lucide-react';
import yaml from 'js-yaml';

export default function YamlToJsonPage() {
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
      const jsonObj = yaml.load(input);
      setOutput(JSON.stringify(jsonObj, null, 2));
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
    setInput(`name: John Doe
age: 30
married: true
children:
  - Jane
  - Mark
address:
  street: 123 Main St
  city: New York`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">YAML to JSON Converter</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Convert YAML configuration files to JSON format.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              YAML Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste YAML here..."
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
              JSON Output
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={output}
              readOnly
              className="min-h-[400px] font-mono"
              placeholder="JSON output..."
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
