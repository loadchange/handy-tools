'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Label } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { RefreshCw, Copy, Code, FileText } from 'lucide-react';


export default function TextToBinaryPage() {
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('text-to-binary');
  const [binaryOutput, setBinaryOutput] = useState('');
  const [decimalOutput, setDecimalOutput] = useState('');
  const [hexOutput, setHexOutput] = useState('');
  const [octalOutput, setOctalOutput] = useState('');
  const [separationMode, setSeparationMode] = useState<'space' | 'newline' | 'none'>('space');

  const getSeparator = useCallback((): string => {
    switch (separationMode) {
      case 'space': return ' ';
      case 'newline': return '\n';
      case 'none': return '';
      default: return ' ';
    }
  }, [separationMode]);

  const convertTextToBinary = useCallback((text: string): string => {
    return text.split('').map(char => {
      const binary = char.charCodeAt(0).toString(2).padStart(8, '0');
      return binary;
    }).join(getSeparator());
  }, [getSeparator]);

  const convertTextToDecimal = useCallback((text: string): string => {
    return text.split('').map(char => {
      return char.charCodeAt(0).toString();
    }).join(getSeparator());
  }, [getSeparator]);

  const convertTextToHex = useCallback((text: string): string => {
    return text.split('').map(char => {
      const hex = char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0');
      return hex;
    }).join(getSeparator());
  }, [getSeparator]);

  const convertTextToOctal = useCallback((text: string): string => {
    return text.split('').map(char => {
      const octal = char.charCodeAt(0).toString(8).padStart(3, '0');
      return octal;
    }).join(getSeparator());
  }, [getSeparator]);

  const convertBinaryToText = (binary: string): string => {
    const cleanBinary = binary.replace(/[^01]/g, '');
    const chunks = cleanBinary.match(/.{1,8}/g) || [];
    return chunks.map(chunk => {
      const decimal = parseInt(chunk, 2);
      return String.fromCharCode(decimal);
    }).join('');
  };

  const convertDecimalToText = (decimal: string): string => {
    const numbers = decimal.match(/\d+/g) || [];
    return numbers.map(num => {
      return String.fromCharCode(parseInt(num, 10));
    }).join('');
  };

  const convertHexToText = (hex: string): string => {
    const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, '');
    const chunks = cleanHex.match(/.{1,2}/g) || [];
    return chunks.map(chunk => {
      return String.fromCharCode(parseInt(chunk, 16));
    }).join('');
  };

  const convertOctalToText = (octal: string): string => {
    const cleanOctal = octal.replace(/[^0-7]/g, '');
    const chunks = cleanOctal.match(/.{1,3}/g) || [];
    return chunks.map(chunk => {
      return String.fromCharCode(parseInt(chunk, 8));
    }).join('');
  };

  useEffect(() => {
    if (activeTab === 'text-to-binary') {
      setBinaryOutput(convertTextToBinary(input));
      setDecimalOutput(convertTextToDecimal(input));
      setHexOutput(convertTextToHex(input));
      setOctalOutput(convertTextToOctal(input));
    } else if (activeTab === 'binary-to-text') {
      // Real-time conversion logic handled in separate useEffect
    }
  }, [input, activeTab, separationMode, convertTextToBinary, convertTextToDecimal, convertTextToHex, convertTextToOctal]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const handleClear = () => {
    setInput('');
    setBinaryOutput('');
    setDecimalOutput('');
    setHexOutput('');
    setOctalOutput('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Text to Binary Converter</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Convert between text and various number formats, supporting binary, decimal, hex, and octal.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text-to-binary">Text to Numbers</TabsTrigger>
            <TabsTrigger value="binary-to-text">Numbers to Text</TabsTrigger>
          </TabsList>

          <TabsContent value="text-to-binary" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Area */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Text Input
                  </CardTitle>
                  <CardDescription>
                    Enter text to convert
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter text..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />

                  {/* Separator Mode */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Separator</Label>
                    <Select value={separationMode} onValueChange={(value: 'space' | 'newline' | 'none') => setSeparationMode(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="space">Space</SelectItem>
                        <SelectItem value="newline">Newline</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleClear} className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>

                  {/* Stats */}
                  {input && (
                    <div className="text-sm text-muted-foreground">
                      <p>• Chars: {input.length}</p>
                      <p>• UTF-16 Code Units: {Array.from(input).length}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Output Area */}
              <div className="space-y-4">
                {/* Binary Output */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Binary Output
                    </CardTitle>
                    <CardDescription>
                      Each char converted to 8-bit binary
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={binaryOutput}
                      readOnly
                      className="min-h-[100px] resize-none font-mono text-xs"
                      placeholder="Binary output will appear here..."
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(binaryOutput)}
                      disabled={!binaryOutput}
                      className="mt-2"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </CardContent>
                </Card>

                {/* Other Formats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Other Formats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-muted rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-muted-foreground">Decimal</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(decimalOutput)}
                          className="h-6 px-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="font-mono text-xs break-all">
                        {decimalOutput || 'Waiting for input...'}
                      </div>
                    </div>

                    <div className="p-3 bg-muted rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-muted-foreground">Hexadecimal</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(hexOutput)}
                          className="h-6 px-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="font-mono text-xs break-all">
                        {hexOutput || 'Waiting for input...'}
                      </div>
                    </div>

                    <div className="p-3 bg-muted rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-muted-foreground">Octal</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(octalOutput)}
                          className="h-6 px-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="font-mono text-xs break-all">
                        {octalOutput || 'Waiting for input...'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="binary-to-text" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Number Input Area */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Number Input
                  </CardTitle>
                  <CardDescription>
                    Enter binary, decimal, hex, or octal numbers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter numbers, e.g. 01001000 01100101..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[200px] resize-none font-mono text-sm"
                  />

                  {/* Format Detection Info */}
                  <div className="p-3 bg-muted rounded-md">
                    <h4 className="font-medium text-sm mb-2">Supported Formats</h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>• <strong>Binary</strong>: 01001000 01100101...</div>
                      <div>• <strong>Decimal</strong>: 72 101 108 108 111...</div>
                      <div>• <strong>Hex</strong>: 48 65 6C 6C 6F...</div>
                      <div>• <strong>Octal</strong>: 110 145 154 154 157...</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleClear} className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Text Output Area */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Text Output
                  </CardTitle>
                  <CardDescription>
                    Converted text content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={(() => {
                      if (!input.trim()) return '';

                      // Try different conversions
                      const trimmedInput = input.trim();

                      // Check Binary
                      if (/^[01\s]+$/.test(trimmedInput)) {
                        return convertBinaryToText(trimmedInput);
                      }

                      // Check Hex
                      if (/^[0-9A-Fa-f\s]+$/.test(trimmedInput)) {
                        return convertHexToText(trimmedInput);
                      }

                      // Check Octal
                      if (/^[0-7\s]+$/.test(trimmedInput)) {
                        return convertOctalToText(trimmedInput);
                      }

                      // Check Decimal
                      if (/^\d+\s*$/.test(trimmedInput)) {
                        return convertDecimalToText(trimmedInput);
                      }

                      return 'Unrecognized number format';
                    })()}
                    readOnly
                    className="min-h-[200px] resize-none"
                    placeholder="Converted text will appear here..."
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleCopy(
                        (() => {
                          if (!input.trim()) return '';
                          const trimmedInput = input.trim();
                          if (/^[01\s]+$/.test(trimmedInput)) return convertBinaryToText(trimmedInput);
                          if (/^[0-9A-Fa-f\s]+$/.test(trimmedInput)) return convertHexToText(trimmedInput);
                          if (/^[0-7\s]+$/.test(trimmedInput)) return convertOctalToText(trimmedInput);
                          if (/^\d+\s*$/.test(trimmedInput)) return convertDecimalToText(trimmedInput);
                          return '';
                        })()
                      )}
                      disabled={!input.trim()}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Text
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Format Info */}
        <Card>
          <CardHeader>
            <CardTitle>Number Format Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-3">Number Systems</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>
                    <strong>Binary (Base 2)</strong>
                    <p className="text-xs mt-1">Computer internal representation, uses 0 and 1</p>
                  </div>
                  <div>
                    <strong>Decimal (Base 10)</strong>
                    <p className="text-xs mt-1">Number system used in daily life</p>
                  </div>
                  <div>
                    <strong>Hexadecimal (Base 16)</strong>
                    <p className="text-xs mt-1">Uses 0-9 and A-F, common in memory addresses</p>
                  </div>
                  <div>
                    <strong>Octal (Base 8)</strong>
                    <p className="text-xs mt-1">Uses 0-7, common in Unix file permissions</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Character Encoding</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>ASCII</strong>: English chars, 7-bit encoding (0-127)</div>
                  <div>• <strong>UTF-8</strong>: Unicode variable-width encoding, ASCII compatible</div>
                  <div>• <strong>Code Point</strong>: Unique number for each Unicode character</div>
                  <div>• <strong>UTF-16</strong>: 16-bit encoding, used internally by JS</div>
                </div>
              </div>
            </div>

            {/* Examples */}
            <div className="mt-6 p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-3 text-sm">Examples</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Character &quot;A&quot; representations:</p>
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
{`Binary:  01000001
Decimal: 65
Hex:     41
Octal:   101`}
                  </pre>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Character &quot;€&quot; representations:</p>
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
{`Binary:  11100010 10000010 10101100
Decimal: 226 130 172
Hex:     E2 82 AC
Octal:   342 202 254`}
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
