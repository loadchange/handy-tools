'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { RefreshCw, Copy, FileText, Code, AlertTriangle, Settings } from 'lucide-react';
import { parseString, Builder } from 'xml2js';

interface ConversionResult {
  output: string;
  isValid: boolean;
  error?: string;
}

export default function XmlToJsonPage() {
  const [xmlInput, setXmlInput] = useState(`<?xml version="1.0" encoding="UTF-8"?>
<root>
  <user id="1">
    <name>John Doe</name>
    <email>john@example.com</email>
    <age>25</age>
    <active>true</active>
    <roles>
      <role>admin</role>
      <role>user</role>
    </roles>
    <profile>
      <bio>Software Engineer</bio>
      <location>New York</location>
    </profile>
  </user>
</root>`);
  const [jsonOutput, setJsonOutput] = useState<ConversionResult | null>(null);
  const [xmlOutput, setXmlOutput] = useState<ConversionResult | null>(null);
  const [activeTab, setActiveTab] = useState('xml-to-json');
  const [indentSize, setIndentSize] = useState(2);
  const [compactMode, setCompactMode] = useState(false);
  const [attributeMode, setAttributeMode] = useState<'object' | 'array'>('object');

  const convertXmlToJson = useCallback(async () => {
    if (!xmlInput.trim()) {
      setJsonOutput({
        output: '',
        isValid: false,
        error: 'Please enter XML content'
      });
      return;
    }

    try {
      const options = {
        explicitArray: false,
        explicitRoot: false,
        ignoreAttrs: false,
        mergeAttrs: false,
        normalize: true,
        normalizeTags: true,
        trim: true,
      };

      const result = await new Promise((resolve, reject) => {
        parseString(xmlInput, options, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      const jsonString = JSON.stringify(result, null, compactMode ? 0 : indentSize);

      setJsonOutput({
        output: jsonString,
        isValid: true
      });
    } catch (error) {
      setJsonOutput({
        output: '',
        isValid: false,
        error: error instanceof Error ? error.message : 'XML Parse Error'
      });
    }
  }, [xmlInput, indentSize, compactMode]);

  const convertJsonToXml = useCallback(() => {
    if (!xmlInput.trim()) {
      setXmlOutput({
        output: '',
        isValid: false,
        error: 'Please enter JSON content'
      });
      return;
    }

    try {
      const jsonData = JSON.parse(xmlInput);

      const options = {
        rootName: 'root',
        xmldec: { version: '1.0', encoding: 'UTF-8' },
        renderOpts: {
          pretty: !compactMode,
          indent: ' '.repeat(indentSize)
        },
        headless: false,
        attributeMode: attributeMode,
      };

      const builder = new Builder(options);
      const xmlString = builder.buildObject(jsonData);

      setXmlOutput({
        output: xmlString,
        isValid: true
      });
    } catch (error) {
      setXmlOutput({
        output: '',
        isValid: false,
        error: error instanceof Error ? error.message : 'JSON Parse Error'
      });
    }
  }, [xmlInput, indentSize, compactMode, attributeMode]);

  useEffect(() => {
    if (activeTab === 'xml-to-json') {
      convertXmlToJson();
    } else if (activeTab === 'json-to-xml') {
      convertJsonToXml();
    }
  }, [xmlInput, activeTab, indentSize, compactMode, attributeMode, convertXmlToJson, convertJsonToXml]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const handleClear = () => {
    setXmlInput('');
    setJsonOutput(null);
    setXmlOutput(null);
  };

  const loadSampleXml = () => {
    setXmlInput(`<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="1">
    <title>JavaScript High Performance</title>
    <author>Nicholas C. Zakas</author>
    <price>49.99</price>
    <category>Programming</category>
    <available>true</available>
    <tags>
      <tag>JavaScript</tag>
      <tag>Frontend</tag>
      <tag>Web</tag>
    </tags>
  </book>
  <book id="2">
    <title>Computer Systems: A Programmer's Perspective</title>
    <author>Randal E. Bryant</author>
    <price>89.99</price>
    <category>Computer Science</category>
    <available>true</available>
    <tags>
      <tag>Systems</tag>
      <tag>OS</tag>
    </tags>
  </book>
</catalog>`);
  };

  const loadSampleJson = () => {
    setXmlInput(`{
  "students": [
    {
      "id": 1,
      "name": "Mike Smith",
      "age": 20,
      "grade": "Sophomore",
      "courses": [
        {
          "name": "Data Structures",
          "score": 85,
          "credits": 3
        },
        {
          "name": "Algorithms",
          "score": 92,
          "credits": 4
        }
      ],
      "active": true
    },
    {
      "id": 2,
      "name": "Sarah Jones",
      "age": 21,
      "grade": "Junior",
      "courses": [
        {
          "name": "Machine Learning",
          "score": 88,
          "credits": 3
        },
        {
          "name": "Deep Learning",
          "score": 90,
          "credits": 4
        }
      ],
      "active": true
    }
  ]
}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">XML JSON Converter</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Convert between XML and JSON formats, with formatting and customization options.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="xml-to-json">XML to JSON</TabsTrigger>
            <TabsTrigger value="json-to-xml">JSON to XML</TabsTrigger>
          </TabsList>

          <TabsContent value="xml-to-json" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* XML Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    XML Input
                  </CardTitle>
                  <CardDescription>
                    Enter XML content to convert
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste XML content..."
                    value={xmlInput}
                    onChange={(e) => setXmlInput(e.target.value)}
                    className="min-h-[300px] resize-none font-mono text-sm"
                  />

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={loadSampleXml} className="flex-1">
                      Load Sample
                    </Button>
                    <Button variant="outline" onClick={handleClear}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>

                  {/* Status */}
                  {jsonOutput && (
                    <div className={`p-3 rounded-md ${
                      jsonOutput.isValid
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        {jsonOutput.isValid ? (
                          <FileText className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm ${
                          jsonOutput.isValid ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {jsonOutput.isValid ? 'Valid XML' : 'Invalid XML'}
                        </span>
                      </div>
                      {jsonOutput.error && (
                        <p className="text-xs text-red-700 mt-1">{jsonOutput.error}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* JSON Output */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    JSON Output
                  </CardTitle>
                  <CardDescription>
                    Converted JSON content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={jsonOutput?.output || ''}
                    readOnly
                    className="min-h-[300px] resize-none font-mono text-sm"
                    placeholder="JSON output will be displayed here..."
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleCopy(jsonOutput?.output || '')}
                      disabled={!jsonOutput?.output}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy JSON
                    </Button>
                  </div>

                  {/* Stats */}
                  {jsonOutput?.output && (
                    <div className="text-sm text-muted-foreground">
                      <p>• Chars: {jsonOutput.output.length}</p>
                      <p>• Lines: {jsonOutput.output.split('\n').length}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="json-to-xml" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* JSON Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    JSON Input
                  </CardTitle>
                  <CardDescription>
                    Enter JSON content to convert
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste JSON content..."
                    value={xmlInput}
                    onChange={(e) => setXmlInput(e.target.value)}
                    className="min-h-[300px] resize-none font-mono text-sm"
                  />

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={loadSampleJson} className="flex-1">
                      Load Sample
                    </Button>
                    <Button variant="outline" onClick={handleClear}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>

                  {/* Status */}
                  {xmlOutput && (
                    <div className={`p-3 rounded-md ${
                      xmlOutput.isValid
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        {xmlOutput.isValid ? (
                          <FileText className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm ${
                          xmlOutput.isValid ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {xmlOutput.isValid ? 'Valid JSON' : 'Invalid JSON'}
                        </span>
                      </div>
                      {xmlOutput.error && (
                        <p className="text-xs text-red-700 mt-1">{xmlOutput.error}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* XML Output */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    XML Output
                  </CardTitle>
                  <CardDescription>
                    Converted XML content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={xmlOutput?.output || ''}
                    readOnly
                    className="min-h-[300px] resize-none font-mono text-sm"
                    placeholder="XML output will be displayed here..."
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleCopy(xmlOutput?.output || '')}
                      disabled={!xmlOutput?.output}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy XML
                    </Button>
                  </div>

                  {/* Stats */}
                  {xmlOutput?.output && (
                    <div className="text-sm text-muted-foreground">
                      <p>• Chars: {xmlOutput.output.length}</p>
                      <p>• Lines: {xmlOutput.output.split('\n').length}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Conversion Options
            </CardTitle>
            <CardDescription>
              Customize conversion format and behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Indent Size */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Indent Size</Label>
                <Select value={indentSize.toString()} onValueChange={(value) => setIndentSize(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Spaces</SelectItem>
                    <SelectItem value="4">4 Spaces</SelectItem>
                    <SelectItem value="8">8 Spaces</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Compact Mode */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Compact Mode</Label>
                <div className="flex items-center justify-between">
                  <Label htmlFor="compactMode" className="text-sm cursor-pointer">
                    Minify Output
                  </Label>
                  <Switch
                    id="compactMode"
                    checked={compactMode}
                    onCheckedChange={setCompactMode}
                  />
                </div>
              </div>

              {/* Attribute Mode */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Attribute Mode (JSON→XML)</Label>
                <Select value={attributeMode} onValueChange={(value: 'object' | 'array') => setAttributeMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="object">Object Mode</SelectItem>
                    <SelectItem value="array">Array Mode</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Format Info */}
              <div className="p-3 bg-muted rounded-md">
                <h4 className="font-medium text-sm mb-2">Format Info</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>• <strong>XML</strong>: Markup language, hierarchical</div>
                  <div>• <strong>JSON</strong>: Lightweight data interchange</div>
                  <div>• <strong>Object Mode</strong>: Attributes to child elements</div>
                  <div>• <strong>Array Mode</strong>: Attributes kept as attributes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Format Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Format Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-3">XML Features</h4>
                <div className="space-y-1 text-muted-foreground">
                  <div>• <strong>Tag Structure</strong>: Uses start and end tags</div>
                  <div>• <strong>Clear Hierarchy</strong>: Obvious nesting</div>
                  <div>• <strong>Attributes</strong>: Elements can have attributes</div>
                  <div>• <strong>Namespaces</strong>: Supports namespaces</div>
                  <div>• <strong>Self-describing</strong>: Semantic tag names</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">JSON Features</h4>
                <div className="space-y-1 text-muted-foreground">
                  <div>• <strong>Concise</strong>: No redundant tags</div>
                  <div>• <strong>Data Types</strong>: Supports various types</div>
                  <div>• <strong>Simple Parsing</strong>: Easy for programs</div>
                  <div>• <strong>Web Friendly</strong>: Good for APIs</div>
                  <div>• <strong>Widely Supported</strong>: Built-in support</div>
                </div>
              </div>
            </div>

            {/* Conversion Rules */}
            <div className="mt-6 p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-3 text-sm">Conversion Rules</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">XML → JSON:</p>
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
{`XML Element → JSON Object
XML Attribute → JSON Attribute
XML Text → String Value
Empty Element → null or empty string`}
                  </pre>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">JSON → XML:</p>
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
{`JSON Object → XML Element
JSON Array → Multiple Elements
JSON Attribute → XML Attribute
null → Empty Element`}
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
