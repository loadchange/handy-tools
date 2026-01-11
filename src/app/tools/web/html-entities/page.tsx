'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Copy } from 'lucide-react';
import _ from 'lodash';

export default function HtmlEntitiesPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');

  useEffect(() => {
    if (mode === 'escape') {
      setOutput(_.escape(input));
    } else {
      setOutput(_.unescape(input));
    }
  }, [input, mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">HTML Entities Converter</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Escape or unescape HTML entities.
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="bg-muted p-1 rounded-lg flex items-center">
          <Button
            variant={mode === 'escape' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              setMode('escape');
              setInput(output);
            }}
          >
            Escape
          </Button>
          <Button
            variant={mode === 'unescape' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              setMode('unescape');
              setInput(output);
            }}
          >
            Unescape
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{mode === 'escape' ? 'Raw HTML' : 'Escaped HTML'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'escape' ? '<div>Hello</div>' : '&lt;div&gt;Hello&lt;/div&gt;'}
              className="min-h-[300px] font-mono"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{mode === 'escape' ? 'Escaped Output' : 'Raw Output'}</span>
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              readOnly
              className="min-h-[300px] font-mono"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
