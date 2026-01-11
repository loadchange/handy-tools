'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Textarea } from '@/components/ui';
import {
  Download,
  Copy,
  Code,
  Eye,
  Settings,
  Info,
  RefreshCw
} from 'lucide-react';

interface PlaceholderConfig {
  width: number;
  height: number;
  text: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  shape: 'rectangle' | 'circle' | 'rounded';
  pattern: 'solid' | 'gradient' | 'stripes' | 'dots' | 'grid';
  showDimensions: boolean;
  opacity: number;
}

const COMMON_SIZES = [
  { name: 'Square', width: 300, height: 300 },
  { name: 'Banner', width: 1200, height: 630 },
  { name: 'Portrait', width: 1080, height: 1350 },
  { name: 'Thumbnail', width: 150, height: 150 },
  { name: 'Avatar', width: 200, height: 200 },
  { name: 'Cover', width: 851, height: 315 },
  { name: 'HD 16:9', width: 1920, height: 1080 },
  { name: 'Phone 9:16', width: 1080, height: 1920 }
];

const COLOR_PRESETS = [
  { name: 'Blue', bg: '#3b82f6', text: '#ffffff' },
  { name: 'Green', bg: '#10b981', text: '#ffffff' },
  { name: 'Red', bg: '#ef4444', text: '#ffffff' },
  { name: 'Purple', bg: '#8b5cf6', text: '#ffffff' },
  { name: 'Orange', bg: '#f97316', text: '#ffffff' },
  { name: 'Gray', bg: '#6b7280', text: '#ffffff' },
  { name: 'Pink', bg: '#ec4899', text: '#ffffff' },
  { name: 'Cyan', bg: '#06b6d4', text: '#ffffff' }
];

const FONT_FAMILIES = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' }
];

export default function SVGPlaceholderGeneratorPage() {
  const [config, setConfig] = useState<PlaceholderConfig>({
    width: 300,
    height: 300,
    text: '300 × 300',
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    fontSize: 24,
    fontFamily: 'Arial',
    shape: 'rectangle',
    pattern: 'solid',
    showDimensions: true,
    opacity: 1
  });

  const [svgCode, setSvgCode] = useState<string>('');
  const [previewURL, setPreviewURL] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('preview');

  const generateSVG = useCallback((): string => {
    const {
      width,
      height,
      text,
      backgroundColor,
      textColor,
      fontSize,
      fontFamily,
      shape,
      pattern,
      showDimensions,
      opacity
    } = config;

    let svgContent = '';
    let patternDef = '';

    // Generate pattern definition
    if (pattern === 'stripes') {
      patternDef = `
        <defs>
          <pattern id="stripes" patternUnits="userSpaceOnUse" width="10" height="10">
            <rect width="5" height="10" fill="${backgroundColor}" />
            <rect x="5" width="5" height="10" fill="${backgroundColor}33" />
          </pattern>
        </defs>`;
    } else if (pattern === 'dots') {
      patternDef = `
        <defs>
          <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="${backgroundColor}" />
            <circle cx="10" cy="10" r="2" fill="${textColor}33" />
          </pattern>
        </defs>`;
    } else if (pattern === 'grid') {
      patternDef = `
        <defs>
          <pattern id="grid" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="${backgroundColor}" />
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="${textColor}33" stroke-width="1"/>
          </pattern>
        </defs>`;
    } else if (pattern === 'gradient') {
      patternDef = `
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${backgroundColor}" />
            <stop offset="100%" style="stop-color:${backgroundColor}cc" />
          </linearGradient>
        </defs>`;
    }

    // Background fill
    const fillAttr = pattern === 'solid' ? backgroundColor :
                    pattern === 'gradient' ? 'url(#gradient)' :
                    `url(#${pattern})`;

    // Generate shape
    if (shape === 'circle') {
      const radius = Math.min(width, height) / 2;
      svgContent = `<circle cx="${width/2}" cy="${height/2}" r="${radius}" fill="${fillAttr}" />`;
    } else if (shape === 'rounded') {
      const rx = 20;
      const ry = 20;
      svgContent = `<rect x="0" y="0" width="${width}" height="${height}" rx="${rx}" ry="${ry}" fill="${fillAttr}" />`;
    } else {
      svgContent = `<rect x="0" y="0" width="${width}" height="${height}" fill="${fillAttr}" />`;
    }

    // Add text
    const displayText = showDimensions ? `${width} × ${height}` : text;
    const textElement = `
      <text x="${width/2}" y="${height/2}"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="${textColor}"
            font-family="${fontFamily}"
            font-size="${fontSize}"
            opacity="${opacity}">
        ${displayText}
      </text>`;

    // Assemble full SVG
    const fullSVG = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
${patternDef}
${svgContent}
${textElement}
</svg>`;

    return fullSVG.trim();
  }, [config]);

  const downloadSVG = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placeholder-${config.width}x${config.height}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = config.width;
    canvas.height = config.height;

    if (ctx) {
      // Create image
      const img = document.createElement('img');
      const svg = new Blob([svgCode], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svg);

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = `placeholder-${config.width}x${config.height}.png`;
            a.click();
            URL.revokeObjectURL(pngUrl);
          }
        });
        URL.revokeObjectURL(url);
      };

      img.src = url;
    }
  };

  const copySVGCode = () => {
    navigator.clipboard.writeText(svgCode).then(() => {
      // Could add toast here
      console.log('SVG code copied to clipboard');
    });
  };

  const copyDataURI = () => {
    const dataURI = `data:image/svg+xml;base64,${btoa(svgCode)}`;
    navigator.clipboard.writeText(dataURI).then(() => {
      console.log('Data URI copied to clipboard');
    });
  };

  const loadPresetSize = (preset: typeof COMMON_SIZES[0]) => {
    setConfig(prev => ({
      ...prev,
      width: preset.width,
      height: preset.height,
      text: `${preset.width} × ${preset.height}`,
      fontSize: Math.max(16, Math.min(preset.width, preset.height) / 12)
    }));
  };

  const loadColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setConfig(prev => ({
      ...prev,
      backgroundColor: preset.bg,
      textColor: preset.text
    }));
  };

  const updateConfig = (key: keyof PlaceholderConfig, value: string | number | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const newSVG = generateSVG();
    setSvgCode(newSVG);
    setPreviewURL(`data:image/svg+xml;base64,${btoa(newSVG)}`);
  }, [generateSVG]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
           <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-primary">SVG Placeholder Generator</h1>
              <p className="text-muted-foreground">
                Generate custom SVG placeholder images with dynamic configuration.
              </p>
           </div>
           <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={() => setConfig(prev => ({...prev}))}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
             </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview Area */}
            <Card className="overflow-hidden border-primary/20 shadow-glow-sm">
              <CardHeader className="bg-muted/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b px-6 pt-2">
                    <TabsList className="bg-transparent p-0">
                      <TabsTrigger value="preview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-2">Visual</TabsTrigger>
                      <TabsTrigger value="code" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-2">Source Code</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="preview" className="p-8 m-0 min-h-[400px] flex items-center justify-center bg-[url('/grid.svg')] bg-repeat">
                      <div className="border border-border shadow-2xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-glow">
                        <Image
                          src={previewURL}
                          alt="Placeholder preview"
                          width={config.width}
                          height={config.height}
                          className="block max-w-full h-auto"
                          unoptimized
                        />
                      </div>
                  </TabsContent>

                  <TabsContent value="code" className="m-0">
                    <div className="relative group">
                      <Textarea
                        value={svgCode}
                        readOnly
                        className="font-mono text-sm min-h-[400px] resize-none rounded-none border-0 focus-visible:ring-0 bg-muted/30 p-6"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={copySVGCode}
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="h-3 w-3 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Configuration Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5 text-primary" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  Customize dimensions, colors, and style patterns.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <Label className="text-xs uppercase tracking-wider text-muted-foreground">Dimensions</Label>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Width (px)</Label>
                          <Input
                            type="number"
                            value={config.width}
                            onChange={(e) => updateConfig('width', Number(e.target.value))}
                            min="1"
                            max="4000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Height (px)</Label>
                          <Input
                            type="number"
                            value={config.height}
                            onChange={(e) => updateConfig('height', Number(e.target.value))}
                            min="1"
                            max="4000"
                          />
                        </div>
                     </div>
                  </div>

                   <div className="space-y-4">
                     <Label className="text-xs uppercase tracking-wider text-muted-foreground">Quick Presets</Label>
                      <div className="flex flex-wrap gap-2">
                        {COMMON_SIZES.map((size, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => loadPresetSize(size)}
                            className="text-xs h-8"
                          >
                            {size.name}
                          </Button>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="h-px bg-border/50" />

                {/* Appearance */}
                <div className="space-y-4">
                   <Label className="text-xs uppercase tracking-wider text-muted-foreground">Appearance</Label>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs">Background Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={config.backgroundColor}
                            onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                            className="w-12 h-9 p-1"
                          />
                          <Input
                            value={config.backgroundColor}
                            onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                            className="flex-1 font-mono text-xs uppercase"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Text Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={config.textColor}
                            onChange={(e) => updateConfig('textColor', e.target.value)}
                            className="w-12 h-9 p-1"
                          />
                          <Input
                            value={config.textColor}
                            onChange={(e) => updateConfig('textColor', e.target.value)}
                            className="flex-1 font-mono text-xs uppercase"
                          />
                        </div>
                      </div>
                   </div>

                   <div className="flex flex-wrap gap-2 pt-2">
                      {COLOR_PRESETS.map((preset, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border cursor-pointer hover:scale-110 transition-transform shadow-sm"
                          style={{ backgroundColor: preset.bg }}
                          onClick={() => loadColorPreset(preset)}
                          title={preset.name}
                        />
                      ))}
                   </div>
                </div>

                 <div className="h-px bg-border/50" />

                 {/* Typography & Style */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Typography</Label>
                         <div className="space-y-3">
                            <Input
                                value={config.text}
                                onChange={(e) => updateConfig('text', e.target.value)}
                                placeholder="Custom text..."
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    type="number"
                                    value={config.fontSize}
                                    onChange={(e) => updateConfig('fontSize', Number(e.target.value))}
                                    min="8"
                                    max="200"
                                    placeholder="Size"
                                />
                                <Select value={config.fontFamily} onValueChange={(value) => updateConfig('fontFamily', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FONT_FAMILIES.map((font) => (
                                            <SelectItem key={font.value} value={font.value}>
                                                {font.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                         </div>
                    </div>

                    <div className="space-y-4">
                         <Label className="text-xs uppercase tracking-wider text-muted-foreground">Style</Label>
                         <div className="grid grid-cols-2 gap-3">
                            <Select value={config.shape} onValueChange={(value) => updateConfig('shape', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Shape" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rectangle">Rectangle</SelectItem>
                                    <SelectItem value="rounded">Rounded</SelectItem>
                                    <SelectItem value="circle">Circle</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={config.pattern} onValueChange={(value) => updateConfig('pattern', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pattern" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="solid">Solid</SelectItem>
                                    <SelectItem value="gradient">Gradient</SelectItem>
                                    <SelectItem value="stripes">Stripes</SelectItem>
                                    <SelectItem value="dots">Dots</SelectItem>
                                    <SelectItem value="grid">Grid</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                         <div className="flex items-center space-x-2 pt-2">
                            <Switch
                                id="showDimensions"
                                checked={config.showDimensions}
                                onCheckedChange={(checked) => updateConfig('showDimensions', checked)}
                            />
                            <Label htmlFor="showDimensions" className="text-sm cursor-pointer">
                                Overlay Dimensions
                            </Label>
                        </div>
                    </div>
                 </div>

              </CardContent>
            </Card>
          </div>

          {/* Right: Actions */}
          <div className="space-y-6">
            <Card className="sticky top-24 border-primary/20">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Download className="h-5 w-5 text-primary" />
                  Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                <Button onClick={downloadSVG} className="w-full shadow-glow">
                  <Download className="h-4 w-4 mr-2" />
                  Download SVG
                </Button>
                <Button onClick={downloadPNG} variant="secondary" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download PNG
                </Button>
                <div className="h-px bg-border/50 my-4" />
                <Button onClick={copySVGCode} variant="outline" className="w-full">
                  <Code className="h-4 w-4 mr-2" />
                  Copy SVG Code
                </Button>
                <Button onClick={copyDataURI} variant="outline" className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Data URI
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4" />
                  Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Dimensions</span>
                  <span className="font-mono">{config.width} × {config.height}</span>
                </div>
                 <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-mono">{(new Blob([svgCode]).size / 1024).toFixed(2)} KB</span>
                </div>
                 <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-mono">image/svg+xml</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
