'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Copy, Code, RefreshCw, Globe, Twitter, Facebook } from 'lucide-react';

interface MetaTagData {
  basic: {
    title: string;
    description: string;
    keywords: string;
    author: string;
    robots: string;
    language: string;
    revisitAfter: string;
    rating: string;
  };
  openGraph: {
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogUrl: string;
    ogType: string;
    ogSiteName: string;
    ogLocale: string;
  };
  twitter: {
    twitterCard: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;
    twitterSite: string;
    twitterCreator: string;
  };
  technical: {
    canonical: string;
    viewport: string;
    charset: string;
    themeColor: string;
    contentType: string;
    cacheControl: string;
    expires: string;
  };
  verification: {
    googleSiteVerification: string;
    baiduSiteVerification: string;
    msvalidate: string;
    yandexVerification: string;
  };
}

export default function MetaTagGeneratorPage() {
  const [metaData, setMetaData] = useState<MetaTagData>({
    basic: {
      title: '',
      description: '',
      keywords: '',
      author: '',
      robots: 'index,follow',
      language: 'en-US',
      revisitAfter: '7 days',
      rating: 'general'
    },
    openGraph: {
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      ogUrl: '',
      ogType: 'website',
      ogSiteName: '',
      ogLocale: 'en_US'
    },
    twitter: {
      twitterCard: 'summary_large_image',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
      twitterSite: '',
      twitterCreator: ''
    },
    technical: {
      canonical: '',
      viewport: 'width=device-width, initial-scale=1.0',
      charset: 'UTF-8',
      themeColor: '#000000',
      contentType: 'text/html; charset=UTF-8',
      cacheControl: '',
      expires: ''
    },
    verification: {
      googleSiteVerification: '',
      baiduSiteVerification: '',
      msvalidate: '',
      yandexVerification: ''
    }
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [includeComments, setIncludeComments] = useState(true);
  const [minifyOutput, setMinifyOutput] = useState(false);

  const updateMetaData = (section: keyof MetaTagData, field: string, value: string) => {
    setMetaData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const generateMetaTags = useCallback((): string => {
    let html = '';

    if (!minifyOutput && includeComments) {
      html += '<!-- Basic Meta Tags -->\n';
    }

    // Basic Meta Tags
    if (metaData.basic.title) {
      html += `    <title>${metaData.basic.title}</title>\n`;
    }
    if (metaData.basic.description) {
      html += `    <meta name="description" content="${metaData.basic.description}">\n`;
    }
    if (metaData.basic.keywords) {
      html += `    <meta name="keywords" content="${metaData.basic.keywords}">\n`;
    }
    if (metaData.basic.author) {
      html += `    <meta name="author" content="${metaData.basic.author}">\n`;
    }
    html += `    <meta name="robots" content="${metaData.basic.robots}">\n`;
    html += `    <meta name="language" content="${metaData.basic.language}">\n`;
    if (metaData.basic.revisitAfter) {
      html += `    <meta name="revisit-after" content="${metaData.basic.revisitAfter}">\n`;
    }
    if (metaData.basic.rating) {
      html += `    <meta name="rating" content="${metaData.basic.rating}">\n`;
    }

    // Technical Meta Tags
    if (!minifyOutput && includeComments) {
      html += '\n<!-- Technical Meta Tags -->\n';
    }
    html += `    <meta charset="${metaData.technical.charset}">\n`;
    html += `    <meta name="viewport" content="${metaData.technical.viewport}">\n`;
    if (metaData.technical.themeColor) {
      html += `    <meta name="theme-color" content="${metaData.technical.themeColor}">\n`;
    }
    if (metaData.technical.contentType) {
      html += `    <meta http-equiv="Content-Type" content="${metaData.technical.contentType}">\n`;
    }
    if (metaData.technical.cacheControl) {
      html += `    <meta http-equiv="Cache-Control" content="${metaData.technical.cacheControl}">\n`;
    }
    if (metaData.technical.expires) {
      html += `    <meta http-equiv="Expires" content="${metaData.technical.expires}">\n`;
    }
    if (metaData.technical.canonical) {
      html += `    <link rel="canonical" href="${metaData.technical.canonical}">\n`;
    }

    // Open Graph Meta Tags
    if (!minifyOutput && includeComments) {
      html += '\n<!-- Open Graph Meta Tags -->\n';
    }
    if (metaData.openGraph.ogType) {
      html += `    <meta property="og:type" content="${metaData.openGraph.ogType}">\n`;
    }
    if (metaData.openGraph.ogTitle) {
      html += `    <meta property="og:title" content="${metaData.openGraph.ogTitle}">\n`;
    }
    if (metaData.openGraph.ogDescription) {
      html += `    <meta property="og:description" content="${metaData.openGraph.ogDescription}">\n`;
    }
    if (metaData.openGraph.ogImage) {
      html += `    <meta property="og:image" content="${metaData.openGraph.ogImage}">\n`;
    }
    if (metaData.openGraph.ogUrl) {
      html += `    <meta property="og:url" content="${metaData.openGraph.ogUrl}">\n`;
    }
    if (metaData.openGraph.ogSiteName) {
      html += `    <meta property="og:site_name" content="${metaData.openGraph.ogSiteName}">\n`;
    }
    if (metaData.openGraph.ogLocale) {
      html += `    <meta property="og:locale" content="${metaData.openGraph.ogLocale}">\n`;
    }

    // Twitter Card Meta Tags
    if (!minifyOutput && includeComments) {
      html += '\n<!-- Twitter Card Meta Tags -->\n';
    }
    html += `    <meta name="twitter:card" content="${metaData.twitter.twitterCard}">\n`;
    if (metaData.twitter.twitterTitle) {
      html += `    <meta name="twitter:title" content="${metaData.twitter.twitterTitle}">\n`;
    }
    if (metaData.twitter.twitterDescription) {
      html += `    <meta name="twitter:description" content="${metaData.twitter.twitterDescription}">\n`;
    }
    if (metaData.twitter.twitterImage) {
      html += `    <meta name="twitter:image" content="${metaData.twitter.twitterImage}">\n`;
    }
    if (metaData.twitter.twitterSite) {
      html += `    <meta name="twitter:site" content="${metaData.twitter.twitterSite}">\n`;
    }
    if (metaData.twitter.twitterCreator) {
      html += `    <meta name="twitter:creator" content="${metaData.twitter.twitterCreator}">\n`;
    }

    // Verification Meta Tags
    if (!minifyOutput && includeComments) {
      html += '\n<!-- Verification Meta Tags -->\n';
    }
    if (metaData.verification.googleSiteVerification) {
      html += `    <meta name="google-site-verification" content="${metaData.verification.googleSiteVerification}">\n`;
    }
    if (metaData.verification.baiduSiteVerification) {
      html += `    <meta name="baidu-site-verification" content="${metaData.verification.baiduSiteVerification}">\n`;
    }
    if (metaData.verification.msvalidate) {
      html += `    <meta name="msvalidate.01" content="${metaData.verification.msvalidate}">\n`;
    }
    if (metaData.verification.yandexVerification) {
      html += `    <meta name="yandex-verification" content="${metaData.verification.yandexVerification}">\n`;
    }

    // Clean format
    if (minifyOutput) {
      html = html
        .replace(/\n/g, '')
        .replace(/    /g, '')
        .replace(/<!-- [^-]+? -->/g, '');
    } else {
      html = html.trim();
    }

    return html;
  }, [metaData, includeComments, minifyOutput]);

  useEffect(() => {
    setGeneratedHtml(generateMetaTags());
  }, [generateMetaTags]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const handleClear = () => {
    setMetaData({
      basic: {
        title: '',
        description: '',
        keywords: '',
        author: '',
        robots: 'index,follow',
        language: 'en-US',
        revisitAfter: '7 days',
        rating: 'general'
      },
      openGraph: {
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        ogUrl: '',
        ogType: 'website',
        ogSiteName: '',
        ogLocale: 'en_US'
      },
      twitter: {
        twitterCard: 'summary_large_image',
        twitterTitle: '',
        twitterDescription: '',
        twitterImage: '',
        twitterSite: '',
        twitterCreator: ''
      },
      technical: {
        canonical: '',
        viewport: 'width=device-width, initial-scale=1.0',
        charset: 'UTF-8',
        themeColor: '#000000',
        contentType: 'text/html; charset=UTF-8',
        cacheControl: '',
        expires: ''
      },
      verification: {
        googleSiteVerification: '',
        baiduSiteVerification: '',
        msvalidate: '',
        yandexVerification: ''
      }
    });
  };

  const loadSampleData = () => {
    setMetaData({
      basic: {
        title: 'My Website - Professional Online Tools',
        description: 'Providing various useful online tools including password generator, converters, etc. to make your daily work more efficient.',
        keywords: 'online tools, password generator, converter, coding',
        author: 'Webmaster',
        robots: 'index,follow',
        language: 'en-US',
        revisitAfter: '7 days',
        rating: 'general'
      },
      openGraph: {
        ogTitle: 'My Website - Professional Online Tools',
        ogDescription: 'Providing various useful online tools including password generator, converters, etc. to make your daily work more efficient.',
        ogImage: 'https://example.com/og-image.jpg',
        ogUrl: 'https://example.com',
        ogType: 'website',
        ogSiteName: 'My Website',
        ogLocale: 'en_US'
      },
      twitter: {
        twitterCard: 'summary_large_image',
        twitterTitle: 'My Website - Professional Online Tools',
        twitterDescription: 'Providing various useful online tools to make your daily work more efficient.',
        twitterImage: 'https://example.com/twitter-image.jpg',
        twitterSite: '@mywebsite',
        twitterCreator: '@mywebsite'
      },
      technical: {
        canonical: 'https://example.com',
        viewport: 'width=device-width, initial-scale=1.0',
        charset: 'UTF-8',
        themeColor: '#3b82f6',
        contentType: 'text/html; charset=UTF-8',
        cacheControl: 'public, max-age=31536000',
        expires: '365'
      },
      verification: {
        googleSiteVerification: 'your-google-verification-code',
        baiduSiteVerification: 'your-baidu-verification-code',
        msvalidate: 'your-bing-verification-code',
        yandexVerification: 'your-yandex-verification-code'
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Meta Tag Generator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate full HTML meta tags, including Basic, Open Graph, Twitter Card, and Verification tags.
          </p>
        </div>

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle>Output Options</CardTitle>
            <CardDescription>
              Configure output format and style
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="includeComments" className="text-sm cursor-pointer">
                  Include Comments
                </Label>
                <Switch
                  id="includeComments"
                  checked={includeComments}
                  onCheckedChange={setIncludeComments}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="minifyOutput" className="text-sm cursor-pointer">
                  Minify Output
                </Label>
                <Switch
                  id="minifyOutput"
                  checked={minifyOutput}
                  onCheckedChange={setMinifyOutput}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="og">Open Graph</TabsTrigger>
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Basic Meta Tags
                </CardTitle>
                <CardDescription>
                  Set basic page info and SEO tags
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter page title"
                      value={metaData.basic.title}
                      onChange={(e) => updateMetaData('basic', 'title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      placeholder="Enter author name"
                      value={metaData.basic.author}
                      onChange={(e) => updateMetaData('basic', 'author', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Page Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter description (recommended 150-160 chars)"
                    value={metaData.basic.description}
                    onChange={(e) => updateMetaData('basic', 'description', e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="text-sm text-muted-foreground">
                    {metaData.basic.description.length}/160 chars
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    placeholder="Enter keywords, comma separated"
                    value={metaData.basic.keywords}
                    onChange={(e) => updateMetaData('basic', 'keywords', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="robots">Robots</Label>
                    <Select value={metaData.basic.robots} onValueChange={(value) => updateMetaData('basic', 'robots', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="index,follow">index,follow</SelectItem>
                        <SelectItem value="index,nofollow">index,nofollow</SelectItem>
                        <SelectItem value="noindex,follow">noindex,follow</SelectItem>
                        <SelectItem value="noindex,nofollow">noindex,nofollow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={metaData.basic.language} onValueChange={(value) => updateMetaData('basic', 'language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
                        <SelectItem value="zh-TW">Chinese (Traditional)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="ja-JP">Japanese</SelectItem>
                        <SelectItem value="ko-KR">Korean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Content Rating</Label>
                    <Select value={metaData.basic.rating} onValueChange={(value) => updateMetaData('basic', 'rating', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="mature">Mature</SelectItem>
                        <SelectItem value="restricted">Restricted</SelectItem>
                        <SelectItem value="14 years">14 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revisitAfter">Revisit After</Label>
                  <Input
                    id="revisitAfter"
                    placeholder="e.g. 7 days, 1 month"
                    value={metaData.basic.revisitAfter}
                    onChange={(e) => updateMetaData('basic', 'revisitAfter', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="og" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Facebook className="h-5 w-5" />
                  Open Graph Tags
                </CardTitle>
                <CardDescription>
                  Set display info for social sharing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ogType">Content Type</Label>
                    <Select value={metaData.openGraph.ogType} onValueChange={(value) => updateMetaData('openGraph', 'ogType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="book">Book</SelectItem>
                        <SelectItem value="profile">Profile</SelectItem>
                        <SelectItem value="video.movie">Movie</SelectItem>
                        <SelectItem value="video.episode">Episode</SelectItem>
                        <SelectItem value="music.song">Song</SelectItem>
                        <SelectItem value="music.album">Album</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ogLocale">Locale</Label>
                    <Select value={metaData.openGraph.ogLocale} onValueChange={(value) => updateMetaData('openGraph', 'ogLocale', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zh_CN">Chinese (Simplified)</SelectItem>
                        <SelectItem value="zh_TW">Chinese (Traditional)</SelectItem>
                        <SelectItem value="en_US">English (US)</SelectItem>
                        <SelectItem value="en_GB">English (UK)</SelectItem>
                        <SelectItem value="ja_JP">Japanese</SelectItem>
                        <SelectItem value="ko_KR">Korean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ogTitle">Title</Label>
                    <Input
                      id="ogTitle"
                      placeholder="Open Graph Title"
                      value={metaData.openGraph.ogTitle}
                      onChange={(e) => updateMetaData('openGraph', 'ogTitle', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ogSiteName">Site Name</Label>
                    <Input
                      id="ogSiteName"
                      placeholder="Site Name"
                      value={metaData.openGraph.ogSiteName}
                      onChange={(e) => updateMetaData('openGraph', 'ogSiteName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ogDescription">Description</Label>
                  <Textarea
                    id="ogDescription"
                    placeholder="Open Graph Description"
                    value={metaData.openGraph.ogDescription}
                    onChange={(e) => updateMetaData('openGraph', 'ogDescription', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ogUrl">Page URL</Label>
                    <Input
                      id="ogUrl"
                      placeholder="https://example.com/page"
                      value={metaData.openGraph.ogUrl}
                      onChange={(e) => updateMetaData('openGraph', 'ogUrl', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ogImage">Image URL</Label>
                    <Input
                      id="ogImage"
                      placeholder="https://example.com/image.jpg"
                      value={metaData.openGraph.ogImage}
                      onChange={(e) => updateMetaData('openGraph', 'ogImage', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="twitter" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Twitter className="h-5 w-5" />
                  Twitter Card Tags
                </CardTitle>
                <CardDescription>
                  Set Twitter sharing card display
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="twitterCard">Card Type</Label>
                  <Select value={metaData.twitter.twitterCard} onValueChange={(value) => updateMetaData('twitter', 'twitterCard', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="summary_large_image">Summary with Large Image</SelectItem>
                      <SelectItem value="app">App</SelectItem>
                      <SelectItem value="player">Player</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitterTitle">Title</Label>
                    <Input
                      id="twitterTitle"
                      placeholder="Twitter Title"
                      value={metaData.twitter.twitterTitle}
                      onChange={(e) => updateMetaData('twitter', 'twitterTitle', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitterSite">Site Twitter</Label>
                    <Input
                      id="twitterSite"
                      placeholder="@website"
                      value={metaData.twitter.twitterSite}
                      onChange={(e) => updateMetaData('twitter', 'twitterSite', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitterDescription">Description</Label>
                  <Textarea
                    id="twitterDescription"
                    placeholder="Twitter Description"
                    value={metaData.twitter.twitterDescription}
                    onChange={(e) => updateMetaData('twitter', 'twitterDescription', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitterImage">Image URL</Label>
                    <Input
                      id="twitterImage"
                      placeholder="https://example.com/twitter-image.jpg"
                      value={metaData.twitter.twitterImage}
                      onChange={(e) => updateMetaData('twitter', 'twitterImage', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitterCreator">Creator Twitter</Label>
                    <Input
                      id="twitterCreator"
                      placeholder="@creator"
                      value={metaData.twitter.twitterCreator}
                      onChange={(e) => updateMetaData('twitter', 'twitterCreator', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Technical Tags
                </CardTitle>
                <CardDescription>
                  Set technical and browser-related tags
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="charset">Charset</Label>
                    <Select value={metaData.technical.charset} onValueChange={(value) => updateMetaData('technical', 'charset', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTF-8">UTF-8</SelectItem>
                        <SelectItem value="ISO-8859-1">ISO-8859-1</SelectItem>
                        <SelectItem value="GBK">GBK</SelectItem>
                        <SelectItem value="Big5">Big5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="themeColor">Theme Color</Label>
                    <Input
                      id="themeColor"
                      placeholder="#000000"
                      value={metaData.technical.themeColor}
                      onChange={(e) => updateMetaData('technical', 'themeColor', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="viewport">Viewport</Label>
                  <Input
                    id="viewport"
                    placeholder="width=device-width, initial-scale=1.0"
                    value={metaData.technical.viewport}
                    onChange={(e) => updateMetaData('technical', 'viewport', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canonical">Canonical URL</Label>
                  <Input
                    id="canonical"
                    placeholder="https://example.com/canonical-url"
                    value={metaData.technical.canonical}
                    onChange={(e) => updateMetaData('technical', 'canonical', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cacheControl">Cache Control</Label>
                    <Input
                      id="cacheControl"
                      placeholder="public, max-age=31536000"
                      value={metaData.technical.cacheControl}
                      onChange={(e) => updateMetaData('technical', 'cacheControl', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expires">Expires</Label>
                    <Input
                      id="expires"
                      placeholder="365 (days)"
                      value={metaData.technical.expires}
                      onChange={(e) => updateMetaData('technical', 'expires', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentType">Content Type</Label>
                  <Input
                    id="contentType"
                    placeholder="text/html; charset=UTF-8"
                    value={metaData.technical.contentType}
                    onChange={(e) => updateMetaData('technical', 'contentType', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Tags</CardTitle>
                <CardDescription>
                  Set verification codes for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="googleSiteVerification">Google Search Console</Label>
                  <Input
                    id="googleSiteVerification"
                    placeholder="Google Verification Code"
                    value={metaData.verification.googleSiteVerification}
                    onChange={(e) => updateMetaData('verification', 'googleSiteVerification', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="baiduSiteVerification">Baidu Webmaster</Label>
                  <Input
                    id="baiduSiteVerification"
                    placeholder="Baidu Verification Code"
                    value={metaData.verification.baiduSiteVerification}
                    onChange={(e) => updateMetaData('verification', 'baiduSiteVerification', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="msvalidate">Bing Webmaster</Label>
                  <Input
                    id="msvalidate"
                    placeholder="Bing Verification Code"
                    value={metaData.verification.msvalidate}
                    onChange={(e) => updateMetaData('verification', 'msvalidate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yandexVerification">Yandex Webmaster</Label>
                  <Input
                    id="yandexVerification"
                    placeholder="Yandex Verification Code"
                    value={metaData.verification.yandexVerification}
                    onChange={(e) => updateMetaData('verification', 'yandexVerification', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadSampleData} className="flex-1">
                Load Sample Data
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated HTML */}
        {generatedHtml && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Generated HTML Code
              </CardTitle>
              <CardDescription>
                Add this code to the &lt;head&gt; tag of your HTML document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <pre className="text-sm font-mono overflow-x-auto">
                  <code>{generatedHtml}</code>
                </pre>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleCopy(generatedHtml)}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy HTML Code
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Tags: {generatedHtml.split('<meta').length - 1}</span>
                <span>Chars: {generatedHtml.length}</span>
                <span>Format: {minifyOutput ? 'Minified' : 'Formatted'}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Meta Tag Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-3">Basic Meta Tags</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>title</strong>: Page title, crucial for SEO</div>
                  <div>• <strong>description</strong>: Page description, affects search snippets</div>
                  <div>• <strong>keywords</strong>: Keywords (less important now)</div>
                  <div>• <strong>robots</strong>: Crawler instructions</div>
                  <div>• <strong>author</strong>: Page author info</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Social Media Tags</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>Open Graph</strong>: Facebook/LinkedIn sharing</div>
                  <div>• <strong>Twitter Cards</strong>: Twitter sharing display</div>
                  <div>• <strong>og:image</strong>: Preview image for sharing</div>
                  <div>• <strong>og:title</strong>: Title for sharing</div>
                  <div>• <strong>og:description</strong>: Description for sharing</div>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="mt-6 p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-3 text-sm">Best Practices</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground mb-1">SEO Optimization:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Title length 50-60 chars</li>
                    <li>Description length 150-160 chars</li>
                    <li>Unique title/desc per page</li>
                    <li>Semantic URL structure</li>
                  </ul>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Social Media Optimization:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Image size 1200x630px</li>
                    <li>Image size &lt; 5MB</li>
                    <li>Use JPG or PNG</li>
                    <li>Ensure cross-platform display</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
