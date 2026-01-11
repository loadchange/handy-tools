'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { Copy, Palette, RefreshCw } from 'lucide-react';
import { colord } from 'colord';

interface ColorFormats {
  hex: string;
  rgb: { r: number; g: number; b: number };
  rgba: { r: number; g: number; b: number; a: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

export default function ColorConverterPage() {
  const [input, setInput] = useState('#3b82f6');
  const [color, setColor] = useState<ColorFormats | null>(null);
  const [isValid, setIsValid] = useState(true);

  const parseColor = (colorString: string): ColorFormats | null => {
    try {
      const color = colord(colorString);
      if (!color.isValid()) {
        return null;
      }

      const rgb = color.toRgb();
      const hsl = color.toHsl();
      const hsv = color.toHsv();

      // Convert RGB to CMYK
      const r = rgb.r / 255;
      const g = rgb.g / 255;
      const b = rgb.b / 255;

      const k = 1 - Math.max(r, g, b);
      const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
      const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
      const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

      const cmyk = { c: c * 100, m: m * 100, y: y * 100, k: k * 100 };

      return {
        hex: color.toHex(),
        rgb: { r: rgb.r, g: rgb.g, b: rgb.b },
        rgba: { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a || 1 },
        hsl: { h: Math.round(hsl.h), s: Math.round(hsl.s), l: Math.round(hsl.l) },
        hsv: { h: Math.round(hsv.h), s: Math.round(hsv.s), v: Math.round(hsv.v) },
        cmyk: { c: Math.round(cmyk.c), m: Math.round(cmyk.m), y: Math.round(cmyk.y), k: Math.round(cmyk.k) }
      };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const parsedColor = parseColor(input);
    setColor(parsedColor);
    setIsValid(!!parsedColor);
  }, [input]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
    });
  };

  const handleClear = () => {
    setInput('');
    setColor(null);
  };

  const rgbToString = (rgb: { r: number; g: number; b: number }) => {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  };

  const rgbaToString = (rgba: { r: number; g: number; b: number; a: number }) => {
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a.toFixed(2)})`;
  };

  const hslToString = (hsl: { h: number; s: number; l: number }) => {
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  };

  const hsvToString = (hsv: { h: number; s: number; v: number }) => {
    return `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
  };

  const cmykToString = (cmyk: { c: number; m: number; y: number; k: number }) => {
    return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
  };

  const FormatCard = ({
    title,
    value,
    description
  }: {
    title: string;
    value: string;
    description: string;
  }) => (
    <div className="p-3 bg-muted rounded-md">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCopy(value)}
          className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
      <div className="font-mono text-sm break-all">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Color Converter</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Convert between different color formats, supporting HEX, RGB, HSL, HSV, CMYK, etc.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Input
              </CardTitle>
              <CardDescription>
                Enter color value, supports various formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Color Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Color Value</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. #3b82f6, rgb(59,130,246), hsl(217,91%,71%)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={`flex-1 ${!isValid && input ? 'border-destructive' : ''}`}
                  />
                  <Button variant="outline" onClick={handleClear}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
                {!isValid && input && (
                  <p className="text-xs text-destructive">Invalid color format</p>
                )}
              </div>

              {/* Color Preview */}
              {color && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Color Preview</Label>
                  <div
                    className="w-full h-24 rounded-md border-2 border-border"
                    style={{ backgroundColor: color.hex }}
                  />
                </div>
              )}

              {/* Supported Formats */}
              <div className="p-3 bg-muted rounded-md">
                <h4 className="font-medium text-sm mb-2">Supported Formats</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>• HEX: #ff5733</div>
                  <div>• RGB: rgb(255,87,51)</div>
                  <div>• RGBA: rgba(255,87,51,0.5)</div>
                  <div>• HSL: hsl(9,100%,60%)</div>
                  <div>• HSV: hsv(9,100%,100%)</div>
                  <div>• Color Name: red, blue</div>
                </div>
              </div>

              {/* Quick Select */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Select</Label>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
                    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
                    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#000000',
                    '#6b7280', '#ffffff'
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => setInput(color)}
                      className="w-full h-8 rounded border-2 border-border hover:border-primary transition-colors"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Results */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Results</CardTitle>
              <CardDescription>
                {color ? 'Conversion complete' : 'Result shown after input'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {color ? (
                <div className="space-y-3 group">
                  <FormatCard
                    title="HEX"
                    value={color.hex}
                    description="Hexadecimal color code"
                  />
                  <FormatCard
                    title="RGB"
                    value={rgbToString(color.rgb)}
                    description="Red Green Blue mode"
                  />
                  <FormatCard
                    title="RGBA"
                    value={rgbaToString(color.rgba)}
                    description="RGB with Alpha"
                  />
                  <FormatCard
                    title="HSL"
                    value={hslToString(color.hsl)}
                    description="Hue Saturation Lightness"
                  />
                  <FormatCard
                    title="HSV"
                    value={hsvToString(color.hsv)}
                    description="Hue Saturation Value"
                  />
                  <FormatCard
                    title="CMYK"
                    value={cmykToString(color.cmyk)}
                    description="Cyan Magenta Yellow Key"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  <div className="text-center">
                    <Palette className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Enter color to see results</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Format Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Color Format Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">HEX (Hexadecimal)</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>Most common in Web Dev</p>
                  <code className="text-xs bg-background p-1 rounded">#FF5733</code>
                  <p className="text-xs">RRGGBB or RRGGBBAA</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">RGB (Red Green Blue)</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>Based on primary colors of light</p>
                  <code className="text-xs bg-background p-1 rounded">rgb(255,87,51)</code>
                  <p className="text-xs">Each value 0-255</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">HSL (Hue Saturation Lightness)</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>More intuitive for humans</p>
                  <code className="text-xs bg-background p-1 rounded">hsl(9,100%,60%)</code>
                  <p className="text-xs">H:0-360°, S,L:0-100%</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">HSV/HSB</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>Hue, Saturation, Value</p>
                  <code className="text-xs bg-background p-1 rounded">hsv(9,100%,100%)</code>
                  <p className="text-xs">Common in color pickers</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">CMYK</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>Printing color mode</p>
                  <code className="text-xs bg-background p-1 rounded">cmyk(0%,66%,80%,0%)</code>
                  <p className="text-xs">Cyan, Magenta, Yellow, Key (Black)</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Usage Scenarios</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>• <strong>Web</strong>: HEX, RGB</p>
                  <p>• <strong>CSS</strong>: HSL, RGB</p>
                  <p>• <strong>Design</strong>: HSL, HSV</p>
                  <p>• <strong>Print</strong>: CMYK</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
