'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Copy, RefreshCw, Link, Lock } from 'lucide-react';

interface AnalysisResult {
  char: string;
  code: number;
  encoded: string;
  needsEncoding: boolean;
}

interface EncodingResult {
  encoded: string;
  decoded: string;
  analysis: AnalysisResult[];
}

export default function UrlEncoderPage() {
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('encode');
  const [result, setResult] = useState<EncodingResult | null>(null);

  const analyzeUrl = useCallback((text: string) => {
    const analysis: AnalysisResult[] = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = char.charCodeAt(0);
      const encoded = encodeURIComponent(char);
      const needsEncoding = char !== encoded;

      // Only add interesting characters to analysis
      if (needsEncoding || !/[a-zA-Z0-9]/.test(char)) {
        analysis.push({ char, code, encoded, needsEncoding });
      }
    }

    return analysis;
  }, []);

  const processUrl = useCallback(() => {
    if (!input) {
      setResult(null);
      return;
    }

    try {
      if (activeTab === 'encode') {
        const encoded = encodeURIComponent(input);
        const analysis = analyzeUrl(input);
        setResult({ encoded, decoded: input, analysis });
      } else {
        const decoded = decodeURIComponent(input);
        const analysis = analyzeUrl(decoded);
        setResult({ encoded: input, decoded, analysis });
      }
    } catch {
      // Handle error silently or set error state
    }
  }, [input, activeTab, analyzeUrl]);

  useEffect(() => {
    processUrl();
  }, [input, activeTab, processUrl]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
  };

  const loadSample = () => {
    if (activeTab === 'encode') {
      setInput('https://example.com/search?q=hello world&category=test');
    } else {
      setInput('https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26category%3Dtest');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">URL Encoder/Decoder</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encode and decode URLs to ensure special characters are transmitted correctly.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode">URL Encode</TabsTrigger>
            <TabsTrigger value="decode">URL Decode</TabsTrigger>
          </TabsList>

          <TabsContent value="encode" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Area */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Raw URL
                  </CardTitle>
                  <CardDescription>
                    Enter URL to encode
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter URL, e.g.: https://example.com/search?q=hello world"
                    className="min-h-[200px]"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={loadSample}>
                        Load Sample
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleClear}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Chars: {input.length}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Output Area */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Encoded URL
                  </CardTitle>
                  <CardDescription>
                    URL encoded string
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={result?.encoded || ''}
                    readOnly
                    placeholder="Encoded URL will appear here..."
                    className="min-h-[200px] bg-muted"
                  />
                  <div className="flex justify-between items-center">
                    <Button
                      onClick={() => handleCopy(result?.encoded || '')}
                      disabled={!result?.encoded}
                      className="w-full sm:w-auto"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Result
                    </Button>
                    <p className="text-sm text-muted-foreground">Chars: {result?.encoded.length || 0}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Character Analysis */}
            {result && result.analysis.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Encoding Analysis</CardTitle>
                  <CardDescription>
                    See which characters need encoding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {result.analysis.slice(0, 24).map((item, index) => (
                      <div key={index} className="p-2 border rounded-md text-center">
                        <div className="font-bold mb-1">{item.char}</div>
                        <div className="text-xs text-muted-foreground">→ {item.encoded}</div>
                        <div className={`text-[10px] mt-1 ${item.needsEncoding ? 'text-red-500' : 'text-green-500'}`}>
                          {item.needsEncoding ? 'Needs Encoding' : 'Safe'}
                        </div>
                      </div>
                    ))}
                    {result.analysis.length > 24 && (
                      <div className="flex items-center justify-center text-sm text-muted-foreground">
                        ...and {result.analysis.length - 24} more
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="decode" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Area */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Encoded URL
                  </CardTitle>
                  <CardDescription>
                    Enter URL to decode
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter encoded URL, e.g.: https%3A//example.com/search%3Fq%3Dhello%20world"
                    className="min-h-[200px]"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={loadSample}>
                        Load Sample
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleClear}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Chars: {input.length}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Output Area */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Decoded URL
                  </CardTitle>
                  <CardDescription>
                    Readable decoded URL
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={result?.decoded || ''}
                    readOnly
                    placeholder="Decoded URL will appear here..."
                    className="min-h-[200px] bg-muted"
                  />
                  <div className="flex justify-between items-center">
                    <Button
                      onClick={() => handleCopy(result?.decoded || '')}
                      disabled={!result?.decoded}
                      className="w-full sm:w-auto"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Result
                    </Button>
                    <p className="text-sm text-muted-foreground">Chars: {result?.decoded.length || 0}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Guide */}
        <Card>
          <CardHeader>
            <CardTitle>URL Encoding Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-3">Why URL Encoding?</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>Security</strong>: Prevent injection attacks</div>
                  <div>• <strong>Compatibility</strong>: Ensure correct transmission</div>
                  <div>• <strong>Standard</strong>: RFC 3986 compliant</div>
                  <div>• <strong>Reliability</strong>: Avoid misinterpretation</div>
                </div>
                <h4 className="font-medium mb-3 mt-4">Common Encoded Characters</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div><code className="text-xs bg-muted p-1 rounded">Space</code> → <code className="text-xs bg-muted p-1 rounded">%20</code></div>
                  <div><code className="text-xs bg-muted p-1 rounded">Chinese/Non-ASCII</code> → <code className="text-xs bg-muted p-1 rounded">%E4%B8%AD%E6%96%87</code></div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Encoding Rules</h4>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <p className="mb-1 font-medium text-foreground">Characters not requiring encoding:</p>
                    <ul className="list-disc list-inside">
                      <li>Letters A-Z, a-z</li>
                      <li>Numbers 0-9</li>
                      <li>Special chars: - _ . ! ~ * &apos; ( )</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-foreground">Characters requiring encoding:</p>
                    <ul className="list-disc list-inside">
                      <li>Spaces and ASCII control chars</li>
                      <li>Non-ASCII chars (Unicode)</li>
                      <li>URL reserved chars: ; / ? : @ & = + $ , #</li>
                      <li>URL unsafe chars: &quot; &apos; &lt; &gt; &#123; &#125; | \ ^ [ ] `</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
