'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Progress } from '@/components/ui';
import { Upload, Download, Copy, FileText, AlertTriangle } from 'lucide-react';

interface ConversionResult {
  base64: string;
  filename: string;
  mimeType: string;
  size: number;
}

export default function Base64FileConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    convertToBase64(selectedFile);
  }, []);

  const convertToBase64 = async (selectedFile: File) => {
    setIsLoading(true);
    setProgress(0);

    try {
      const reader = new FileReader();

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(percentComplete);
        }
      };

      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setResult({
          base64: base64String,
          filename: selectedFile.name,
          mimeType: selectedFile.type || 'application/octet-stream',
          size: selectedFile.size
        });
        setIsLoading(false);
        setProgress(100);
      };

      reader.onerror = () => {
        setIsLoading(false);
        setProgress(0);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Conversion error:', error);
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  }, [handleFileSelect]);

  const handleCopy = async () => {
    if (result?.base64) {
      try {
        await navigator.clipboard.writeText(result.base64);
        console.log('Base64 copied to clipboard');
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const handleDownload = () => {
    if (result?.base64) {
      const link = document.createElement('a');
      link.href = result.base64;
      link.download = `${result.filename}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setIsLoading(false);
    setProgress(0);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Base64 File Converter</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Convert files to Base64 encoded strings, or download Base64 strings as files.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                File Upload
              </CardTitle>
              <CardDescription>
                Select file to convert to Base64
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isLoading}
                />

                <div className="space-y-3">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {dragActive ? 'Release to start conversion' : 'Drag & Drop file here'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Or click to select file
                    </p>
                  </div>
                </div>
              </div>

              {file && (
                <div className="p-3 bg-muted rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium truncate max-w-[150px]">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={reset}>
                      Reselect
                    </Button>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Converting...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Usage Tip */}
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-primary">Usage Tip</h4>
                    <p className="text-xs text-primary/80">
                      Large files may take longer. Recommended size &lt; 10MB.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Result Area */}
          <Card>
            <CardHeader>
              <CardTitle>Base64 Result</CardTitle>
              <CardDescription>
                {result ? 'Conversion complete' : 'Result shown after upload'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <Textarea
                    value={result.base64}
                    readOnly
                    className="min-h-[200px] resize-none font-mono text-xs"
                    placeholder="Base64 result will be displayed here..."
                  />

                  {/* File Information */}
                  <div className="p-3 bg-muted rounded-md">
                    <h4 className="text-sm font-medium mb-2">File Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Filename:</span>
                        <p className="font-mono truncate">{result.filename}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">MIME Type:</span>
                        <p className="font-mono truncate">{result.mimeType}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Size:</span>
                        <p>{formatFileSize(result.size)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button onClick={handleCopy} variant="outline" className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Base64
                    </Button>
                    <Button onClick={handleDownload} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download as Text
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  <div className="text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Upload file to see Base64</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Guide */}
        <Card>
          <CardHeader>
            <CardTitle>User Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-3">Features</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Supports all file types</li>
                  <li>• Shows conversion progress</li>
                  <li>• One-click copy Base64</li>
                  <li>• Download as text file</li>
                  <li>• Shows detailed file info</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Common Use Cases</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>Image Embedding</strong>: Embed images in HTML/CSS</li>
                  <li>• <strong>Data Transfer</strong>: Transfer files via text protocols</li>
                  <li>• <strong>Config Files</strong>: Include files in JSON/YAML</li>
                  <li>• <strong>API Requests</strong>: Send binary data</li>
                  <li>• <strong>Storage</strong>: Store files in text databases</li>
                </ul>
              </div>
            </div>

            {/* Code Examples */}
            <div className="mt-6 p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-3 text-sm">Code Examples</h4>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">HTML Image Embedding:</p>
                  <code className="text-xs bg-background p-2 rounded block">
                    {`<img src="data:image/png;base64,${result?.base64.substring(0, 30)}..." />`}
                  </code>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">CSS Background Image:</p>
                  <code className="text-xs bg-background p-2 rounded block">
                    {`background: url(data:image/png;base64,${result?.base64.substring(0, 30)}...);`}
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
