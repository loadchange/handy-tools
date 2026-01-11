'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Search, FileText, Copy, RefreshCw, Filter } from 'lucide-react';

// MIME Database
const MIME_DATABASE = [
  // Text
  { extension: 'txt', mime: 'text/plain', description: 'Plain Text File' },
  { extension: 'html', mime: 'text/html', description: 'HTML Document' },
  { extension: 'htm', mime: 'text/html', description: 'HTML Document' },
  { extension: 'css', mime: 'text/css', description: 'CSS Stylesheet' },
  { extension: 'js', mime: 'text/javascript', description: 'JavaScript File' },
  { extension: 'json', mime: 'application/json', description: 'JSON Data' },
  { extension: 'xml', mime: 'application/xml', description: 'XML Document' },
  { extension: 'csv', mime: 'text/csv', description: 'CSV File' },
  { extension: 'md', mime: 'text/markdown', description: 'Markdown Document' },

  // Images
  { extension: 'jpg', mime: 'image/jpeg', description: 'JPEG Image' },
  { extension: 'jpeg', mime: 'image/jpeg', description: 'JPEG Image' },
  { extension: 'png', mime: 'image/png', description: 'PNG Image' },
  { extension: 'gif', mime: 'image/gif', description: 'GIF Animation' },
  { extension: 'svg', mime: 'image/svg+xml', description: 'SVG Vector Image' },
  { extension: 'webp', mime: 'image/webp', description: 'WebP Image' },
  { extension: 'ico', mime: 'image/x-icon', description: 'Icon File' },
  { extension: 'bmp', mime: 'image/bmp', description: 'Bitmap Image' },
  { extension: 'tiff', mime: 'image/tiff', description: 'TIFF Image' },

  // Audio
  { extension: 'mp3', mime: 'audio/mpeg', description: 'MP3 Audio' },
  { extension: 'wav', mime: 'audio/wav', description: 'WAV Audio' },
  { extension: 'ogg', mime: 'audio/ogg', description: 'OGG Audio' },
  { extension: 'm4a', mime: 'audio/mp4', description: 'M4A Audio' },
  { extension: 'flac', mime: 'audio/flac', description: 'FLAC Audio' },
  { extension: 'aac', mime: 'audio/aac', description: 'AAC Audio' },

  // Video
  { extension: 'mp4', mime: 'video/mp4', description: 'MP4 Video' },
  { extension: 'avi', mime: 'video/x-msvideo', description: 'AVI Video' },
  { extension: 'mov', mime: 'video/quicktime', description: 'QuickTime Video' },
  { extension: 'wmv', mime: 'video/x-ms-wmv', description: 'Windows Media Video' },
  { extension: 'flv', mime: 'video/x-flv', description: 'Flash Video' },
  { extension: 'webm', mime: 'video/webm', description: 'WebM Video' },
  { extension: 'mkv', mime: 'video/x-matroska', description: 'Matroska Video' },

  // Documents
  { extension: 'pdf', mime: 'application/pdf', description: 'PDF Document' },
  { extension: 'doc', mime: 'application/msword', description: 'Word Document' },
  { extension: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', description: 'Word Document' },
  { extension: 'xls', mime: 'application/vnd.ms-excel', description: 'Excel Spreadsheet' },
  { extension: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', description: 'Excel Spreadsheet' },
  { extension: 'ppt', mime: 'application/vnd.ms-powerpoint', description: 'PowerPoint Presentation' },
  { extension: 'pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', description: 'PowerPoint Presentation' },

  // Archives
  { extension: 'zip', mime: 'application/zip', description: 'ZIP Archive' },
  { extension: 'rar', mime: 'application/x-rar-compressed', description: 'RAR Archive' },
  { extension: '7z', mime: 'application/x-7z-compressed', description: '7-Zip Archive' },
  { extension: 'tar', mime: 'application/x-tar', description: 'TAR Archive' },
  { extension: 'gz', mime: 'application/gzip', description: 'Gzip Archive' },

  // Fonts
  { extension: 'ttf', mime: 'font/ttf', description: 'TrueType Font' },
  { extension: 'otf', mime: 'font/otf', description: 'OpenType Font' },
  { extension: 'woff', mime: 'font/woff', description: 'WOFF Font' },
  { extension: 'woff2', mime: 'font/woff2', description: 'WOFF2 Font' },
];

interface SearchResult {
  extension: string;
  mime: string;
  description: string;
}

export default function MimeTypesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [extensionSearch, setExtensionSearch] = useState('');
  const [mimeSearch, setMimeSearch] = useState('');
  const [activeTab, setActiveTab] = useState('extension');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', color: 'default' },
    { id: 'text', name: 'Text', color: 'secondary' },
    { id: 'image', name: 'Image', color: 'outline' },
    { id: 'audio', name: 'Audio', color: 'outline' },
    { id: 'video', name: 'Video', color: 'outline' },
    { id: 'document', name: 'Document', color: 'outline' },
    { id: 'archive', name: 'Archive', color: 'outline' },
    { id: 'font', name: 'Font', color: 'outline' },
  ];

  const getCategoryByMime = (mimeType: string): string => {
    if (mimeType.startsWith('text/')) return 'text';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('excel') || mimeType.includes('powerpoint')) return 'document';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar') || mimeType.includes('gzip')) return 'archive';
    if (mimeType.includes('font')) return 'font';
    return 'other';
  };

  const searchByExtension = useCallback((extension: string) => {
    if (!extension.trim()) {
      setSearchResults([]);
      return;
    }

    const results = MIME_DATABASE.filter(item =>
      item.extension.toLowerCase().includes(extension.toLowerCase())
    );
    setSearchResults(results);
  }, []);

  const searchByMime = useCallback((mimeType: string) => {
    if (!mimeType.trim()) {
      setSearchResults([]);
      return;
    }

    const results = MIME_DATABASE.filter(item =>
      item.mime.toLowerCase().includes(mimeType.toLowerCase())
    );
    setSearchResults(results);
  }, []);

  const searchByKeyword = useCallback((keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

    const results = MIME_DATABASE.filter(item =>
      item.extension.toLowerCase().includes(keyword.toLowerCase()) ||
      item.mime.toLowerCase().includes(keyword.toLowerCase()) ||
      item.description.toLowerCase().includes(keyword.toLowerCase())
    );

    if (selectedCategory !== 'all') {
      return results.filter(item => getCategoryByMime(item.mime) === selectedCategory);
    }

    return results;
  }, [selectedCategory]);

  useEffect(() => {
    if (activeTab === 'extension') {
      searchByExtension(extensionSearch);
    } else if (activeTab === 'mime') {
      searchByMime(mimeSearch);
    } else if (activeTab === 'search') {
      setSearchResults(searchByKeyword(searchTerm) || []);
    }
  }, [extensionSearch, mimeSearch, searchTerm, activeTab, selectedCategory, searchByExtension, searchByMime, searchByKeyword]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const handleClear = () => {
    setSearchTerm('');
    setExtensionSearch('');
    setMimeSearch('');
    setSearchResults([]);
  };

  const loadSampleExtension = () => {
    setExtensionSearch('jpg');
  };

  const loadSampleMime = () => {
    setMimeSearch('application/json');
  };

  const getFilteredData = () => {
    if (selectedCategory === 'all') return MIME_DATABASE;
    return MIME_DATABASE.filter(item => getCategoryByMime(item.mime) === selectedCategory);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">MIME Types Lookup</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the MIME type for a file extension, or find the file extension for a MIME type.
          </p>
        </div>

        {/* Category Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Category Filter
            </CardTitle>
            <CardDescription>
              Select a category to view
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="extension">Find by Extension</TabsTrigger>
            <TabsTrigger value="mime">Find by MIME Type</TabsTrigger>
            <TabsTrigger value="search">Keyword Search</TabsTrigger>
          </TabsList>

          <TabsContent value="extension" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Find by Extension
                </CardTitle>
                <CardDescription>
                  Enter a file extension to find its MIME type
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter extension, e.g., jpg, png, pdf"
                  value={extensionSearch}
                  onChange={(e) => setExtensionSearch(e.target.value)}
                  className="font-mono"
                />

                <div className="flex gap-2">
                  <Button variant="outline" onClick={loadSampleExtension} className="flex-1">
                    Load Example
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Enter extension without the dot (e.g., jpg instead of .jpg)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mime" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Find by MIME Type
                </CardTitle>
                <CardDescription>
                  Enter a MIME type to find its extension
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter MIME type, e.g., image/jpeg, application/json"
                  value={mimeSearch}
                  onChange={(e) => setMimeSearch(e.target.value)}
                  className="font-mono"
                />

                <div className="flex gap-2">
                  <Button variant="outline" onClick={loadSampleMime} className="flex-1">
                    Load Example
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Keyword Search
                </CardTitle>
                <CardDescription>
                  Search in extensions, MIME types, and descriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter keyword to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClear} className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Search Results */}
        {(searchResults.length > 0 || (activeTab === 'search' && searchTerm) || (activeTab === 'extension' && extensionSearch) || (activeTab === 'mime' && mimeSearch)) && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Found {searchResults.length} results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((result, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">.{result.extension}</Badge>
                          <Badge variant="secondary">{getCategoryByMime(result.mime)}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(result.extension)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy Ext
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(result.mime)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy MIME
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-mono text-sm">{result.mime}</div>
                        <div className="text-sm text-muted-foreground">{result.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2" />
                  <p>No matching results found</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Full List */}
        <Card>
          <CardHeader>
            <CardTitle>Full MIME Type List</CardTitle>
            <CardDescription>
              {getFilteredData().length} MIME types
              {selectedCategory !== 'all' && ` (${categories.find(c => c.id === selectedCategory)?.name})`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getFilteredData().map((item, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">.{item.extension}</Badge>
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryByMime(item.mime)}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="font-mono text-xs break-all">{item.mime}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Explanation */}
        <Card>
          <CardHeader>
            <CardTitle>About MIME Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-3">What is a MIME Type?</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>Full Name</strong>: Multipurpose Internet Mail Extensions</div>
                  <div>• <strong>Purpose</strong>: Indicates file type and format</div>
                  <div>• <strong>Format</strong>: type/subtype (e.g., text/html)</div>
                  <div>• <strong>Standard</strong>: RFC 6838</div>
                  <div>• <strong>Usage</strong>: HTTP protocol, Email, etc.</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Common Categories</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>text/*</strong>: Text files</div>
                  <div>• <strong>image/*</strong>: Image files</div>
                  <div>• <strong>audio/*</strong>: Audio files</div>
                  <div>• <strong>video/*</strong>: Video files</div>
                  <div>• <strong>application/*</strong>: Application data</div>
                </div>
              </div>
            </div>

            {/* Usage Examples */}
            <div className="mt-6 p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-3 text-sm">Common Usage Scenarios</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground mb-1">Web Development:</p>
                  <pre className="bg-background p-2 rounded">
{`// HTTP Response Headers
Content-Type: application/json
Content-Type: text/html; charset=utf-8
Content-Type: image/jpeg`}</pre>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">File Upload:</p>
                  <pre className="bg-background p-2 rounded">
{`// Form Data
multipart/form-data
image/png
application/pdf`}</pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}