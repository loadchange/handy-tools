'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { ArrowRightLeft } from 'lucide-react';

const ROMAN_LOOKUP = [
  { val: 1000, key: 'M' },
  { val: 900, key: 'CM' },
  { val: 500, key: 'D' },
  { val: 400, key: 'CD' },
  { val: 100, key: 'C' },
  { val: 90, key: 'XC' },
  { val: 50, key: 'L' },
  { val: 40, key: 'XL' },
  { val: 10, key: 'X' },
  { val: 9, key: 'IX' },
  { val: 5, key: 'V' },
  { val: 4, key: 'IV' },
  { val: 1, key: 'I' },
];

const ROMAN_VALUES: { [key: string]: number } = {
  I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
};

export default function RomanNumeralConverterPage() {
  const [roman, setRoman] = useState('');
  const [number, setNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const toRoman = (num: number): string => {
    if (num < 1 || num > 3999) return '';
    let romanStr = '';
    let tempNum = num;

    for (const { val, key } of ROMAN_LOOKUP) {
      while (tempNum >= val) {
        romanStr += key;
        tempNum -= val;
      }
    }
    return romanStr;
  };

  const fromRoman = (str: string): number | null => {
    let num = 0;
    str = str.toUpperCase();

    // Validate characters
    if (!/^[IVXLCDM]+$/.test(str)) return null;

    for (let i = 0; i < str.length; i++) {
      const curr = ROMAN_VALUES[str[i]];
      const next = ROMAN_VALUES[str[i + 1]];
      if (next && curr < next) {
        num -= curr;
      } else {
        num += curr;
      }
    }

    // Validate validity by converting back
    if (toRoman(num) !== str) return null;

    return num;
  };

  const handleNumberChange = (val: string) => {
    setNumber(val);
    setError(null);
    if (!val) {
      setRoman('');
      return;
    }
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setRoman('');
      return;
    }
    if (num < 1 || num > 3999) {
      setError('Number must be between 1 and 3999');
      setRoman('');
      return;
    }
    setRoman(toRoman(num));
  };

  const handleRomanChange = (val: string) => {
    val = val.toUpperCase();
    setRoman(val);
    setError(null);
    if (!val) {
      setNumber('');
      return;
    }
    const num = fromRoman(val);
    if (num === null) {
      setError('Invalid Roman numeral');
      setNumber('');
    } else {
      setNumber(num.toString());
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Roman Numeral Converter</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Convert between Arabic numbers (1, 2, 3) and Roman numerals (I, II, III).
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-center">

            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="number">Arabic Number</Label>
              <Input
                id="number"
                type="number"
                placeholder="e.g. 2023"
                value={number}
                onChange={(e) => handleNumberChange(e.target.value)}
                className="text-lg font-mono"
              />
              <p className="text-xs text-muted-foreground">Range: 1 - 3999</p>
            </div>

            <div className="md:col-span-1 flex justify-center">
              <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="roman">Roman Numeral</Label>
              <Input
                id="roman"
                placeholder="e.g. MMXXIII"
                value={roman}
                onChange={(e) => handleRomanChange(e.target.value)}
                className="text-lg font-mono uppercase"
              />
              <p className="text-xs text-muted-foreground">I, V, X, L, C, D, M</p>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-md text-center">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Reference Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">I</div>
              <div className="text-muted-foreground">1</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">V</div>
              <div className="text-muted-foreground">5</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">X</div>
              <div className="text-muted-foreground">10</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">L</div>
              <div className="text-muted-foreground">50</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">C</div>
              <div className="text-muted-foreground">100</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">D</div>
              <div className="text-muted-foreground">500</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">M</div>
              <div className="text-muted-foreground">1000</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
