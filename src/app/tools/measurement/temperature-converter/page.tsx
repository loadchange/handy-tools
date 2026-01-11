'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Label } from '@/components/ui';
import { Badge } from '@/components/ui';
import { ScrollArea } from '@/components/ui';
import { Thermometer, ArrowRightLeft, Copy, RotateCcw, History } from 'lucide-react';

interface ConversionHistory {
  id: string;
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
  timestamp: Date;
}

const UNITS = [
  { value: 'celsius', label: 'Celsius (°C)', symbol: '°C' },
  { value: 'fahrenheit', label: 'Fahrenheit (°F)', symbol: '°F' },
  { value: 'kelvin', label: 'Kelvin (K)', symbol: 'K' },
  { value: 'rankine', label: 'Rankine (°R)', symbol: '°R' },
  { value: 'reaumur', label: 'Reaumur (°Ré)', symbol: '°Ré' }
];

const COMMON_TEMPS = [
  { name: 'Absolute Zero', celsius: -273.15, description: 'Lowest possible temperature' },
  { name: 'Freezing Point', celsius: 0, description: 'At standard pressure' },
  { name: 'Room Temperature', celsius: 20, description: 'Standard room temp' },
  { name: 'Body Temperature', celsius: 37, description: 'Normal body temp' },
  { name: 'Boiling Point', celsius: 100, description: 'At standard pressure' }
];

export default function TemperatureConverterPage() {
  const [inputValue, setInputValue] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('celsius');
  const [toUnit, setToUnit] = useState<string>('fahrenheit');
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<ConversionHistory[]>([]);

  const convertTemperature = useCallback((value: number, from: string, to: string): number => {
    let celsius = value;

    // Convert to Celsius first
    switch (from) {
      case 'fahrenheit':
        celsius = (value - 32) * 5 / 9;
        break;
      case 'kelvin':
        celsius = value - 273.15;
        break;
      case 'rankine':
        celsius = (value - 491.67) * 5 / 9;
        break;
      case 'reaumur':
        celsius = value * 1.25;
        break;
    }

    // Convert from Celsius to target
    switch (to) {
      case 'celsius':
        return celsius;
      case 'fahrenheit':
        return (celsius * 9 / 5) + 32;
      case 'kelvin':
        return celsius + 273.15;
      case 'rankine':
        return (celsius + 273.15) * 9 / 5;
      case 'reaumur':
        return celsius * 0.8;
      default:
        return celsius;
    }
  }, []);

  useEffect(() => {
    if (!inputValue || isNaN(Number(inputValue))) {
      setResult(null);
      return;
    }

    const val = Number(inputValue);
    const res = convertTemperature(val, fromUnit, toUnit);
    setResult(Number(res.toFixed(4)));

    // Add to history (debounced in a real app, simplified here)
    // We'll skip auto-adding to history to avoid spam, maybe add a button or only on complete
  }, [inputValue, fromUnit, toUnit, convertTemperature]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const copyResult = () => {
    if (result !== null) {
      navigator.clipboard.writeText(result.toString());
    }
  };

  const addToHistory = () => {
    if (inputValue && result !== null) {
      const newHistory: ConversionHistory = {
        id: Date.now().toString(),
        fromValue: Number(inputValue),
        fromUnit,
        toValue: result,
        toUnit,
        timestamp: new Date()
      };
      setHistory(prev => [newHistory, ...prev].slice(0, 10));
    }
  };

  const getSymbol = (unitValue: string) => {
    return UNITS.find(u => u.value === unitValue)?.symbol || '';
  };

  const getFormula = (from: string, to: string) => {
    const formulas: Record<string, string> = {
      'celsius-fahrenheit': '(°C × 9/5) + 32 = °F',
      'fahrenheit-celsius': '(°F - 32) × 5/9 = °C',
      'celsius-kelvin': '°C + 273.15 = K',
      'kelvin-celsius': 'K - 273.15 = °C',
      // Add more formulas as needed
    };
    return formulas[`${from}-${to}`] || formulas[`${to}-${from}`] || 'Complex conversion';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Temperature Converter</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Convert between different temperature units, including Celsius, Fahrenheit, Kelvin, etc.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Converter */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Conversion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Temperature Conversion
                </CardTitle>
                <CardDescription>
                  Enter temperature and select units
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input and Units */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                  <div className="md:col-span-3 space-y-2">
                    <Label className="text-sm font-medium">Temperature Value</Label>
                    <Input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter value"
                      className="text-lg"
                    />
                  </div>
                  <div className="md:col-span-4 grid grid-cols-5 gap-2 items-center">
                    <div className="col-span-2 space-y-2">
                      <Label className="text-sm font-medium">From</Label>
                      <Select value={fromUnit} onValueChange={setFromUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {UNITS.map(u => (
                            <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <Button variant="ghost" size="icon" onClick={handleSwap} title="Swap Units">
                        <ArrowRightLeft className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label className="text-sm font-medium">To</Label>
                      <Select value={toUnit} onValueChange={setToUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {UNITS.map(u => (
                            <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Result */}
                <div className="p-6 bg-muted rounded-lg text-center">
                  <div className="text-sm text-muted-foreground mb-2">
                    Formula: {getFormula(fromUnit, toUnit)}
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {result !== null ? result : '-'} {getSymbol(toUnit)}
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={copyResult} disabled={result === null}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Result
                    </Button>
                    <Button variant="outline" size="sm" onClick={addToHistory} disabled={result === null}>
                      <History className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                  <Button variant="ghost" onClick={() => setInputValue('')}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* All Units Conversion */}
            <Card>
              <CardHeader>
                <CardTitle>All Units Conversion</CardTitle>
                <CardDescription>
                  All unit conversions based on current input
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {UNITS.map(unit => {
                    if (!inputValue) return null;
                    const val = Number(inputValue);
                    const res = convertTemperature(val, fromUnit, unit.value);
                    return (
                      <div key={unit.value} className="p-3 border rounded-md">
                        <div className="text-xs text-muted-foreground">{unit.label}</div>
                        <div className="text-lg font-semibold">
                          {Number(res.toFixed(2))} {unit.symbol}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Common Temps and History */}
          <div className="space-y-6">
            {/* Common Temps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Common Temperatures
                </CardTitle>
                <CardDescription>
                  Click to use common temperatures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {COMMON_TEMPS.map((temp, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-between h-auto py-3"
                      onClick={() => {
                        setFromUnit('celsius');
                        setInputValue(temp.celsius.toString());
                      }}
                    >
                      <div className="text-left">
                        <div className="font-medium">{temp.name}</div>
                        <div className="text-xs text-muted-foreground">{temp.description}</div>
                      </div>
                      <Badge variant="secondary">{temp.celsius}°C</Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Conversion History
                </CardTitle>
                <CardDescription>
                  Recent conversions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {history.length === 0 ? (
                      <div className="text-center text-muted-foreground py-4 text-sm">
                        No history yet
                      </div>
                    ) : (
                      history.map((item) => (
                        <div key={item.id} className="text-sm p-2 border-b last:border-0">
                          <div className="flex justify-between font-medium">
                            <span>{item.fromValue} {getSymbol(item.fromUnit)}</span>
                            <span>→</span>
                            <span>{item.toValue} {getSymbol(item.toUnit)}</span>
                          </div>
                          <div className="text-xs text-muted-foreground text-right mt-1">
                            {item.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
