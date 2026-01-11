'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { ResultDisplay } from '@/components/ui';
import { RefreshCw } from 'lucide-react';

export default function Base64StringConverterPage() {
  const [plainText, setPlainText] = useState('');
  const [base64Text, setBase64Text] = useState('');
  const [activeTab, setActiveTab] = useState('encode');

  const encodeToBase64 = useCallback(() => {
    try {
      const encoded = Buffer.from(plainText, 'utf8').toString('base64');
      setBase64Text(encoded);
    } catch {
      setBase64Text('Encoding Error');
    }
  }, [plainText]);

  const decodeFromBase64 = useCallback(() => {
    try {
      const decoded = Buffer.from(base64Text, 'base64').toString('utf8');
      setPlainText(decoded);
    } catch {
      setPlainText('Decoding Error');
    }
  }, [base64Text]);

  useEffect(() => {
    if (activeTab === 'encode') {
      encodeToBase64();
    }
  }, [plainText, activeTab, encodeToBase64]);

  useEffect(() => {
    if (activeTab === 'decode') {
      decodeFromBase64();
    }
  }, [base64Text, activeTab, decodeFromBase64]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    });
  };


  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Base64 String Converter</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Convert between text and Base64 encoding.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode">Encode Text to Base64</TabsTrigger>
            <TabsTrigger value="decode">Decode Base64 to Text</TabsTrigger>
          </TabsList>

          <TabsContent value="encode" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Raw Text</CardTitle>
                  <CardDescription>Enter text to encode</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter text to encode..."
                    value={plainText}
                    onChange={(e) => setPlainText(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {plainText.length} chars
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setPlainText('')}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <ResultDisplay
                title="Base64 Result"
                result={base64Text}
                type="code"
                showCopy={!!base64Text}
                onCopy={() => handleCopy(base64Text)}
                placeholder="Encoded Base64 will appear here"
              />
            </div>
          </TabsContent>

          <TabsContent value="decode" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Base64 String</CardTitle>
                  <CardDescription>Enter Base64 string to decode</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter Base64 string..."
                    value={base64Text}
                    onChange={(e) => setBase64Text(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {base64Text.length} chars
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setBase64Text('')}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <ResultDisplay
                title="Decoded Result"
                result={plainText}
                type="text"
                showCopy={!!plainText}
                onCopy={() => handleCopy(plainText)}
                placeholder="Decoded text will appear here"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
