'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Badge } from '@/components/ui';
import {
  Shield,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Zap,
  Lock,
  Key,
  Code,
  FileText,
  AlertTriangle,
  Check
} from 'lucide-react';

interface ObfuscationMethod {
  name: string;
  description: string;
  icon: React.ReactNode;
  obfuscate: (text: string) => string;
  deobfuscate?: (text: string) => string;
  reversible: boolean;
}

export default function StringObfuscatorPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('base64');
  const [customKey, setCustomKey] = useState('mySecretKey');
  const [showOutput, setShowOutput] = useState(true);
  const [copied, setCopied] = useState(false);

  const obfuscationMethods: ObfuscationMethod[] = [
    {
      name: 'base64',
      description: 'Base64 Encoding',
      icon: <Code className="h-4 w-4" />,
      obfuscate: (text) => btoa(unescape(encodeURIComponent(text))),
      deobfuscate: (text) => decodeURIComponent(escape(atob(text))),
      reversible: true
    },
    {
      name: 'rot13',
      description: 'ROT13 Cipher',
      icon: <RefreshCw className="h-4 w-4" />,
      obfuscate: (text) => text.replace(/[a-zA-Z]/g, char =>
        String.fromCharCode(char.charCodeAt(0) + (char.toLowerCase() < 'n' ? 13 : -13))
      ),
      deobfuscate: (text) => text.replace(/[a-zA-Z]/g, char =>
        String.fromCharCode(char.charCodeAt(0) + (char.toLowerCase() < 'n' ? 13 : -13))
      ),
      reversible: true
    },
    {
      name: 'reverse',
      description: 'String Reversal',
      icon: <RefreshCw className="h-4 w-4" />,
      obfuscate: (text) => text.split('').reverse().join(''),
      deobfuscate: (text) => text.split('').reverse().join(''),
      reversible: true
    },
    {
      name: 'url',
      description: 'URL Encoding',
      icon: <FileText className="h-4 w-4" />,
      obfuscate: (text) => encodeURIComponent(text),
      deobfuscate: (text) => decodeURIComponent(text),
      reversible: true
    },
    {
      name: 'html',
      description: 'HTML Entity Encoding',
      icon: <Code className="h-4 w-4" />,
      obfuscate: (text) => text.split('').map(char => `&#${char.charCodeAt(0)};`).join(''),
      reversible: true
    },
    {
      name: 'hex',
      description: 'Hex Encoding',
      icon: <Code className="h-4 w-4" />,
      obfuscate: (text) => text.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' '),
      reversible: true
    },
    {
      name: 'binary',
      description: 'Binary Encoding',
      icon: <Code className="h-4 w-4" />,
      obfuscate: (text) => text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' '),
      reversible: true
    },
    {
      name: 'caesar',
      description: 'Caesar Cipher',
      icon: <Lock className="h-4 w-4" />,
      obfuscate: (text) => {
        const shift = 3;
        return text.replace(/[a-zA-Z]/g, char => {
          const base = char <= 'Z' ? 65 : 97;
          return String.fromCharCode((char.charCodeAt(0) - base + shift) % 26 + base);
        });
      },
      reversible: true
    },
    {
      name: 'xor',
      description: 'XOR Encryption',
      icon: <Key className="h-4 w-4" />,
      obfuscate: (text) => {
        const key = customKey || 'default';
        return text.split('').map((char, i) =>
          String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
      },
      reversible: true
    },
    {
      name: 'morse',
      description: 'Morse Code',
      icon: <Zap className="h-4 w-4" />,
      obfuscate: (text) => {
        const morseCode: { [key: string]: string } = {
          'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
          'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
          'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
          'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
          'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
          '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
          '8': '---..', '9': '----.', ' ': '/'
        };
        return text.toUpperCase().split('').map(char => morseCode[char] || char).join(' ');
      },
      reversible: true
    },
    {
      name: 'leetspeak',
      description: 'Leet Speak',
      icon: <Zap className="h-4 w-4" />,
      obfuscate: (text) => {
        const leetMap: { [key: string]: string } = {
          'A': '4', 'E': '3', 'G': '6', 'I': '1', 'O': '0', 'S': '5', 'T': '7',
          'a': '4', 'e': '3', 'g': '6', 'i': '1', 'o': '0', 's': '5', 't': '7'
        };
        return text.split('').map(char => leetMap[char] || char).join('');
      },
      reversible: false
    },
    {
      name: 'scramble',
      description: 'Shuffle Letters',
      icon: <AlertTriangle className="h-4 w-4" />,
      obfuscate: (text) => {
        return text.split(' ').map(word => {
          if (word.length <= 3) return word;
          const middle = word.slice(1, -1).split('').sort(() => Math.random() - 0.5).join('');
          return word[0] + middle + word[word.length - 1];
        }).join(' ');
      },
      reversible: false
    }
  ];

  const currentMethod = obfuscationMethods.find(m => m.name === selectedMethod);

  const handleObfuscate = () => {
    if (!inputText || !currentMethod) return;

    try {
      const result = currentMethod.obfuscate(inputText);
      setOutputText(result);
    } catch (error) {
      setOutputText(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeobfuscate = () => {
    if (!outputText || !currentMethod?.deobfuscate) return;

    try {
      const result = currentMethod.deobfuscate(outputText);
      setInputText(result);
    } catch (error) {
      setInputText(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
  };

  const swapTexts = () => {
    setInputText(outputText);
    setOutputText(inputText);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">String Obfuscator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Obfuscate and encode strings using various algorithms to protect sensitive information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main Functionality */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Raw Text
                </CardTitle>
                <CardDescription>
                  Enter text to obfuscate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to obfuscate..."
                  className="min-h-[120px]"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{inputText.length} chars</span>
                  <Button variant="ghost" size="sm" onClick={() => setInputText('')}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Obfuscation Method
                </CardTitle>
                <CardDescription>
                  Select obfuscation algorithm
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {obfuscationMethods.map((method) => (
                    <Button
                      key={method.name}
                      variant={selectedMethod === method.name ? "default" : "outline"}
                      onClick={() => setSelectedMethod(method.name)}
                      className="h-auto p-3 text-left"
                    >
                      <div className="flex items-center gap-2 w-full">
                        {method.icon}
                        <div className="flex-1">
                          <div className="font-medium text-sm">{method.name}</div>
                          <div className="text-xs text-muted-foreground">{method.description}</div>
                        </div>
                        {method.reversible ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                        )}
                      </div>
                    </Button>
                  ))}
                </div>

                {/* XOR Custom Key */}
                {selectedMethod === 'xor' && (
                  <div className="space-y-2">
                    <Label htmlFor="custom-key">Custom Key</Label>
                    <Input
                      id="custom-key"
                      value={customKey}
                      onChange={(e) => setCustomKey(e.target.value)}
                      placeholder="Enter encryption key..."
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={handleObfuscate} className="flex-1">
                    <Zap className="h-4 w-4 mr-2" />
                    Obfuscate
                  </Button>
                  {currentMethod?.reversible && (
                    <Button variant="outline" onClick={handleDeobfuscate}>
                      <Shield className="h-4 w-4 mr-2" />
                      De-obfuscate
                    </Button>
                  )}
                  <Button variant="outline" onClick={swapTexts}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Obfuscation Result
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowOutput(!showOutput)}
                    >
                      {showOutput ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(outputText)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  {currentMethod?.description} Result
                  {currentMethod?.reversible && (
                    <Badge variant="outline" className="ml-2">
                      Reversible
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showOutput ? (
                  <div className="space-y-3">
                    <Textarea
                      value={outputText}
                      readOnly
                      className="min-h-[120px] font-mono text-sm"
                      placeholder="Obfuscated result will appear here..."
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{outputText.length} chars</span>
                      {copied && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="h-3 w-3" />
                          <span>Copied</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    <EyeOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Output hidden</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Info Panel */}
          <div className="space-y-6">
            {/* Method Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Method Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {currentMethod && (
                  <div>
                    <div className="font-medium mb-2">{currentMethod.name}</div>
                    <div className="text-muted-foreground mb-3">{currentMethod.description}</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {currentMethod.reversible ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                        )}
                        <span>{currentMethod.reversible ? 'Reversible Algorithm' : 'Irreversible Algorithm'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Warning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Security Warning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Usage:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Protect sensitive data</li>
                    <li>• Prevent plaintext transmission</li>
                    <li>• Basic data obfuscation</li>
                  </ul>
                </div>
                <div>
                  <strong>Note:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Not for high security needs</li>
                    <li>• Some methods are easily broken</li>
                    <li>• Use professional encryption tools</li>
                  </ul>
                </div>
                <div>
                  <strong>Suggestions:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Combine multiple methods</li>
                    <li>• Use strong keys</li>
                    <li>• Rotate algorithms regularly</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Use Cases */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Use Cases
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Development:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Config file encryption</li>
                    <li>• API key protection</li>
                    <li>• Data transmission obfuscation</li>
                  </ul>
                </div>
                <div>
                  <strong>Testing:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Data masking</li>
                    <li>• Test env configuration</li>
                    <li>• Sample data generation</li>
                  </ul>
                </div>
                <div>
                  <strong>Education:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Encryption learning</li>
                    <li>• Encoding demonstration</li>
                    <li>• Security awareness training</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
