'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Label } from '@/components/ui';
import { RefreshCw, Copy, FileText, Code, Eye } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default function MarkdownToHtmlPage() {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Converter

This is a **Markdown** to *HTML* example.

## Features

- **Bold Text**
- *Italic Text*
- \`Code\`
- [Link](https://example.com)

### List Example

1. Ordered Item 1
2. Ordered Item 2
   - Nested Unordered List
   - Another Nested Item

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Quote

> This is a quote.
> It can span multiple lines.

---

**Table Example**

| Feature | Status | Priority |
|---------|--------|----------|
| Basic   | ✅     | High     |
| Advanced| ✅     | Medium   |
| Custom  | 🔄     | Low      |`);

  const [htmlOutput, setHtmlOutput] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [sanitizeHtml, setSanitizeHtml] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(false);

  const convertMarkdownToHtml = useCallback(async () => {
    try {
      let html = marked(markdown);

      if (sanitizeHtml) {
        // @ts-expect-error - DOMPurify types are incorrect
        html = DOMPurify.sanitize(html);
      }

      setHtmlOutput(html as string);
    } catch {
      setHtmlOutput('<p class="text-red-500">Markdown Parse Error</p>');
    }
  }, [markdown, sanitizeHtml]);

  useEffect(() => {
    convertMarkdownToHtml();
  }, [markdown, sanitizeHtml, convertMarkdownToHtml]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const handleClear = () => {
    setMarkdown('');
    setHtmlOutput('');
  };

  const loadSampleMarkdown = () => {
    setMarkdown(`# Markdown Syntax Example

## Text Formatting

This is **Bold** and *Italic* text.
This is ~~Strikethrough~~ text.
This is \`Inline Code\` text.

## Lists

### Unordered List
- Item 1
- Item 2
  - Sub-item 2.1
  - Sub-item 2.2
- Item 3

### Ordered List
1. Step 1
2. Step 2
3. Step 3

## Links and Images

[GitHub](https://github.com)

![Sample Image](https://via.placeholder.com/150x100)

## Quotes

> This is a quote
> It can have multiple lines

## Code

Inline code: \`const x = 1;\`

Code block:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Tables

| Col 1 | Col 2 | Col 3 |
|-------|-------|-------|
| A     | B     | C     |
| 1     | 2     | 3     |

## Horizontal Rule

---

## Task List

- [x] Completed task
- [ ] Pending task`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Markdown to HTML Converter</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Convert Markdown text to HTML, with real-time preview and configuration options.
          </p>
        </div>

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Options</CardTitle>
            <CardDescription>
              Customize conversion behavior and display options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="showPreview" className="text-sm cursor-pointer">
                  Show Preview
                </Label>
                <Switch
                  id="showPreview"
                  checked={showPreview}
                  onCheckedChange={setShowPreview}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sanitizeHtml" className="text-sm cursor-pointer">
                  Sanitize HTML
                </Label>
                <Switch
                  id="sanitizeHtml"
                  checked={sanitizeHtml}
                  onCheckedChange={setSanitizeHtml}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="lineNumbers" className="text-sm cursor-pointer">
                  Show Line Numbers
                </Label>
                <Switch
                  id="lineNumbers"
                  checked={lineNumbers}
                  onCheckedChange={setLineNumbers}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Markdown Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Markdown Input
              </CardTitle>
              <CardDescription>
                Enter or paste Markdown text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter Markdown text..."
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className={`min-h-[400px] resize-none font-mono text-sm ${lineNumbers ? 'pl-8' : ''}`}
                style={{
                  backgroundImage: lineNumbers
                    ? `repeating-linear-gradient(to bottom, #e5e7eb 0px, transparent 1px), repeating-linear-gradient(to right, #e5e7eb 0px, transparent 1px, #e5e7eb 3rem, #e5e7eb 3rem)`
                    : 'none',
                  backgroundSize: lineNumbers ? '3rem 1.5rem' : 'auto',
                  backgroundPosition: lineNumbers ? '0 0, 0 0' : 'auto',
                }}
              />

              <div className="flex gap-2">
                <Button variant="outline" onClick={loadSampleMarkdown} className="flex-1">
                  Load Sample
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Characters: {markdown.length}</p>
                <p>Lines: {markdown.split('\n').length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Output Area */}
          <div className="space-y-4">
            {showPreview ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    HTML Preview
                  </CardTitle>
                  <CardDescription>
                    Rendered HTML output
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="min-h-[400px] p-4 border rounded-md overflow-auto prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: htmlOutput }}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    HTML Source
                  </CardTitle>
                  <CardDescription>
                    Converted HTML source code
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={htmlOutput}
                    readOnly
                    className="min-h-[400px] resize-none font-mono text-xs"
                    placeholder="HTML output will be displayed here..."
                  />

                  <Button
                    onClick={() => handleCopy(htmlOutput)}
                    disabled={!htmlOutput}
                    className="w-full"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy HTML
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Markdown Syntax Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Markdown Syntax Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Text Formatting</h4>
                <div className="space-y-1 text-muted-foreground">
                  <code className="text-xs">**Bold**</code>
                  <code className="text-xs">*Italic*</code>
                  <code className="text-xs">~~Strikethrough~~</code>
                  <code className="text-xs">\`Code\`</code>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Headers</h4>
                <div className="space-y-1 text-muted-foreground">
                  <code className="text-xs"># H1</code>
                  <code className="text-xs">## H2</code>
                  <code className="text-xs">### H3</code>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Lists</h4>
                <div className="space-y-1 text-muted-foreground">
                  <code className="text-xs">- Unordered Item</code>
                  <code className="text-xs">1. Ordered Item</code>
                  <code className="text-xs">  - Nested Item</code>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Links & Images</h4>
                <div className="space-y-1 text-muted-foreground">
                  <code className="text-xs">[Text](Link)</code>
                  <code className="text-xs">![alt](Image)</code>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Code</h4>
                <div className="space-y-1 text-muted-foreground">
                  <code className="text-xs">\`\`\`Language</code>
                  <code className="text-xs">Code Block</code>
                  <code className="text-xs">\`\`\`</code>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Others</h4>
                <div className="space-y-1 text-muted-foreground">
                  <code className="text-xs">&gt; Quote</code>
                  <code className="text-xs">--- Horizontal Rule</code>
                  <code className="text-xs">| Table |</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
