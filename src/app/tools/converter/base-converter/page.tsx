'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Label } from '@/components/ui';
import { RefreshCw, Copy, Calculator } from 'lucide-react';

interface ConversionResult {
  fromBase: number;
  toBase: number;
  originalValue: string;
  convertedValue: string;
  decimalValue: string;
}

export default function BaseConverterPage() {
  const [input, setInput] = useState('255');
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(16);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isValid, setIsValid] = useState(true);

  const bases = [
    { value: 2, label: 'Binary (Base 2)', description: '0-1' },
    { value: 3, label: 'Base 3', description: '0-2' },
    { value: 4, label: 'Base 4', description: '0-3' },
    { value: 5, label: 'Base 5', description: '0-4' },
    { value: 6, label: 'Base 6', description: '0-5' },
    { value: 7, label: 'Base 7', description: '0-6' },
    { value: 8, label: 'Octal (Base 8)', description: '0-7' },
    { value: 9, label: 'Base 9', description: '0-8' },
    { value: 10, label: 'Decimal (Base 10)', description: '0-9' },
    { value: 11, label: 'Base 11', description: '0-A' },
    { value: 12, label: 'Base 12', description: '0-B' },
    { value: 13, label: 'Base 13', description: '0-C' },
    { value: 14, label: 'Base 14', description: '0-D' },
    { value: 15, label: 'Base 15', description: '0-E' },
    { value: 16, label: 'Hexadecimal (Base 16)', description: '0-F' },
    { value: 32, label: 'Base 32', description: 'A-Z2-7' },
    { value: 36, label: 'Base 36', description: '0-9A-Z' },
  ];

  const getValidChars = useCallback((base: number): string => {
    if (base <= 10) {
      return '0123456789'.substring(0, base);
    } else if (base <= 36) {
      return '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substring(0, base);
    }
    return '';
  }, []);

  const isValidForBase = useCallback((value: string, base: number): boolean => {
    if (!value) return false;

    const validChars = getValidChars(base);
    return value.toUpperCase().split('').every(char => validChars.includes(char));
  }, [getValidChars]);

  const convertToDecimal = useCallback((value: string, base: number): bigint => {
    try {
      return BigInt('0x' + BigInt(value).toString(base));
    } catch {
      return BigInt(0);
    }
  }, []);

  const convertFromDecimal = useCallback((decimal: bigint, base: number): string => {
    try {
      return decimal.toString(base).toUpperCase();
    } catch {
      return '0';
    }
  }, []);

  const performConversion = useCallback(() => {
    if (!input.trim()) {
      setResult(null);
      setIsValid(false);
      return;
    }

    if (!isValidForBase(input, fromBase)) {
      setResult(null);
      setIsValid(false);
      return;
    }

    try {
      const decimalValue = convertToDecimal(input, fromBase);
      const convertedValue = convertFromDecimal(decimalValue, toBase);

      setResult({
        fromBase,
        toBase,
        originalValue: input.toUpperCase(),
        convertedValue,
        decimalValue: decimalValue.toString()
      });
      setIsValid(true);
    } catch {
      setResult(null);
      setIsValid(false);
    }
  }, [input, fromBase, toBase, isValidForBase, convertToDecimal, convertFromDecimal]);

  useEffect(() => {
    performConversion();
  }, [input, fromBase, toBase, performConversion]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
    });
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
  };

  const swapBases = () => {
    setFromBase(toBase);
    setToBase(fromBase);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Base Converter</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Convert between different numerical bases, supporting all bases from binary to base-36.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Conversion Config
              </CardTitle>
              <CardDescription>
                Configure base conversion parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* From Base */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">From Base</Label>
                <Select value={fromBase.toString()} onValueChange={(value) => setFromBase(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bases.map((base) => (
                      <SelectItem key={base.value} value={base.value.toString()}>
                        {base.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Supported Characters: {bases.find(b => b.value === fromBase)?.description}
                </p>
              </div>

              {/* To Base */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">To Base</Label>
                <div className="flex gap-2">
                  <Select value={toBase.toString()} onValueChange={(value) => setToBase(Number(value))}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bases.map((base) => (
                        <SelectItem key={base.value} value={base.value.toString()}>
                          {base.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={swapBases} title="Swap Bases">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supported Characters: {bases.find(b => b.value === toBase)?.description}
                </p>
              </div>

              {/* Input Value */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Input Value</Label>
                <Input
                  placeholder={`Enter ${fromBase} base number...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className={`font-mono ${!isValid && input ? 'border-destructive' : ''}`}
                />
                {!isValid && input && (
                  <p className="text-xs text-destructive">
                    Input contains invalid characters, please use {getValidChars(fromBase)}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={performConversion} className="flex-1">
                  <Calculator className="h-4 w-4 mr-2" />
                  Convert
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              </div>

              {/* Common Bases */}
              <div className="p-3 bg-muted rounded-md">
                <h4 className="font-medium text-sm mb-2">Common Bases</h4>
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setFromBase(10); setToBase(2); }}
                    className="text-xs"
                  >
                    10→2
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setFromBase(10); setToBase(8); }}
                    className="text-xs"
                  >
                    10→8
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setFromBase(10); setToBase(16); }}
                    className="text-xs"
                  >
                    10→16
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setFromBase(16); setToBase(10); }}
                    className="text-xs"
                  >
                    16→10
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Result Area */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Result</CardTitle>
              <CardDescription>
                {result ? 'Conversion complete' : 'Result shown after input'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  {/* Converted Value */}
                  <div className="p-4 bg-muted rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Converted Value</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(result.convertedValue)}
                        className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="font-mono text-lg break-all">
                      {result.convertedValue}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {result.originalValue} (Base {result.fromBase}) → {result.convertedValue} (Base {result.toBase})
                    </div>
                  </div>

                  {/* Decimal Value */}
                  <div className="p-4 bg-muted rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Decimal Value</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(result.decimalValue)}
                        className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="font-mono text-lg">
                      {result.decimalValue}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      For understanding and calculation
                    </div>
                  </div>

                  {/* Binary Representation */}
                  <div className="p-4 bg-muted rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Binary Representation</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(convertFromDecimal(BigInt(result.decimalValue), 2))}
                        className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="font-mono text-sm break-all">
                      {convertFromDecimal(BigInt(result.decimalValue), 2)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Computer internal representation
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  <div className="text-center">
                    <Calculator className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Result shown after input</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Number System Info */}
        <Card>
          <CardHeader>
            <CardTitle>Number System Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Common Bases</h4>
                <div className="space-y-1 text-muted-foreground">
                  <div>• <strong>Binary (Base 2)</strong>: 0, 1</div>
                  <div>• <strong>Octal (Base 8)</strong>: 0-7</div>
                  <div>• <strong>Decimal (Base 10)</strong>: 0-9</div>
                  <div>• <strong>Hexadecimal (Base 16)</strong>: 0-9, A-F</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Applications</h4>
                <div className="space-y-1 text-muted-foreground">
                  <div>• <strong>Binary</strong>: Computer internal representation</div>
                  <div>• <strong>Octal</strong>: Unix file permissions</div>
                  <div>• <strong>Decimal</strong>: Daily calculation</div>
                  <div>• <strong>Hexadecimal</strong>: Memory addresses, colors</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Conversion Formulas</h4>
                <div className="space-y-1 text-muted-foreground">
                  <div>• Base N → Base 10: Positional notation</div>
                  <div>• Base 10 → Base N: Repeated division</div>
                  <div>• Base M → Base N: Convert to Base 10 first</div>
                  <div>• Radix: Number of unique digits</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
