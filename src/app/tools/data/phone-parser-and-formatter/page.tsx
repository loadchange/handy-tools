'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { ScrollArea } from '@/components/ui';
import {
  Phone,
  CheckCircle,
  XCircle,
  Globe,
  Copy,
  AlertCircle,
  Book,
  Search,
  Info
} from 'lucide-react';

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  format: string;
}

interface PhoneResult {
  isValid: boolean;
  country?: Country;
  nationalNumber: string;
  internationalFormat: string;
  nationalFormat: string;
  e164Format: string;
  rfc3966Format: string;
  type?: string;
  errors?: string[];
}

const COUNTRIES: Country[] = [
  { code: 'US', name: 'USA', dialCode: '+1', flag: '🇺🇸', format: '(XXX) XXX-XXXX' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', format: 'XXX XXXX XXXX' },
  { code: 'GB', name: 'UK', dialCode: '+44', flag: '🇬🇧', format: 'XXXX XXX XXXX' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', format: 'XX-XXXX-XXXX' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', format: 'XXX XXXXXXXX' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', format: 'X XX XX XX XX' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', format: 'XXX XXXXXXX' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', format: 'XXX XXX XXX' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', format: '(XXX) XXX-XXXX' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', format: 'XXXX XXX XXX' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', format: '(XX) XXXXX-XXXX' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', format: 'XXXXX XXXXX' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺', format: 'XXX XXX-XX-XX' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', format: 'XX-XXXX-XXXX' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', format: 'XXX XXX XXXX' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩', format: 'XXX-XXXX-XXXX' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱', format: 'X XX XX XX XX' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', format: 'XX XXX XXXX' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷', format: 'XXX XXX XX XX' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭', format: 'XXX XXX XX XX' },
  { code: 'TW', name: 'Taiwan', dialCode: '+886', flag: '🇹🇼', format: 'XXXX XXX XXX' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪', format: 'XXX XX XX XX' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪', format: 'XX-XXX XX XX' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴', format: 'XXXX XX XX' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹', format: 'XXX XXXXXXX' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱', format: 'XX-XXX-XXXX' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱', format: 'XXX XXX XXX' },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷', format: 'XXX XXX XXXX' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹', format: 'XXX XXX XXX' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿', format: 'XXX XXX XXX' },
  { code: 'HU', name: 'Hungary', dialCode: '+36', flag: '🇭🇺', format: 'XX XXX XXXX' },
  { code: 'RO', name: 'Romania', dialCode: '+40', flag: '🇷🇴', format: 'XXX XXX XXX' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰', format: 'XX XX XX XX' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮', format: 'XX XXX XXXX' },
  { code: 'SK', name: 'Slovakia', dialCode: '+421', flag: '🇸🇰', format: 'XXX XXX XXX' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪', format: 'XX XXX XXXX' },
  { code: 'HR', name: 'Croatia', dialCode: '+385', flag: '🇭🇷', format: 'XX XXX XXXX' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬', format: 'XXX XXX XXX' },
  { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: '🇺🇦', format: 'XX XXX XX XX' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭', format: 'X-XXXX-XXXX' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', format: 'XXXX XXXX' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', format: 'XX-XXXX XXXX' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭', format: 'XXX XXX XXXX' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿', format: 'XX-XXX-XXXX' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', format: 'XX XXX XXXX' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬', format: 'XX XXXX XXXX' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', format: 'XXX-XXX-XXXX' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', format: 'XXX XXX XXXX' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷', format: 'XX XXXX-XXXX' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱', format: 'X XXXX XXXX' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴', format: 'XXX XXX XXXX' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪', format: 'XXX XXX XXX' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪', format: 'XXX-XXX-XXXX' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰', format: 'XXX XXXXXXX' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩', format: 'XX-XXXX-XXXX' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳', format: 'XX XXX XXXX' }
];

const EXAMPLE_PHONES = [
  { phone: '+1 202-555-0123', country: 'USA' },
  { phone: '+86 138 0013 8000', country: 'China' },
  { phone: '+44 20 7123 4567', country: 'UK' },
  { phone: '+49 30 12345678', country: 'Germany' },
  { phone: '+33 1 23 45 67 89', country: 'France' },
  { phone: '+81 3-1234-5678', country: 'Japan' },
  { phone: '+91 98765 43210', country: 'India' },
  { phone: '+61 2 1234 5678', country: 'Australia' },
  { phone: '+55 11 98765-4321', country: 'Brazil' },
  { phone: '+34 912 345 678', country: 'Spain' }
];

export default function PhoneParserFormatterPage() {
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatInternational = useCallback((country: Country, number: string): string => {
    return `${country.dialCode} ${formatNumberByPattern(country.format, number)}`;
  }, []);

  const formatNational = useCallback((country: Country, number: string): string => {
    return formatNumberByPattern(country.format, number);
  }, []);

  const parsePhoneNumber = useCallback((phoneInput: string, countryCode: string): PhoneResult => {
    const errors: string[] = [];

    // Clean input
    const cleaned = phoneInput.replace(/[^\d+]/g, '');

    // Check basic format
    if (!cleaned) {
      errors.push('Phone number cannot be empty');
      return { isValid: false, nationalNumber: '', internationalFormat: '', nationalFormat: '', e164Format: '', rfc3966Format: '', errors };
    }

    // Detect country
    let detectedCountry = COUNTRIES.find(c => c.code === countryCode);
    let dialCode = '';
    let nationalNumber = cleaned;

    // If includes international code
    if (cleaned.startsWith('+')) {
      // Try matching dial code
      for (const country of COUNTRIES) {
        if (cleaned.startsWith(country.dialCode)) {
          detectedCountry = country;
          dialCode = country.dialCode;
          nationalNumber = cleaned.substring(dialCode.length);
          break;
        }
      }
    } else if (detectedCountry) {
      dialCode = detectedCountry.dialCode;
    }

    // Validate length
    if (nationalNumber.length < 7) {
      errors.push('Phone number too short');
    } else if (nationalNumber.length > 15) {
      errors.push('Phone number too long');
    }

    // Check digits
    if (!/^\d+$/.test(nationalNumber)) {
      errors.push('Phone number must contain only digits');
    }

    // Format
    const isValid = errors.length === 0 && detectedCountry;
    const e164Format = isValid ? `${dialCode}${nationalNumber}` : '';
    const internationalFormat = isValid ? formatInternational(detectedCountry!, nationalNumber) : '';
    const nationalFormat = isValid ? formatNational(detectedCountry!, nationalNumber) : '';
    const rfc3966Format = isValid ? `tel:${e164Format}` : '';

    // Detect Type
    let type = 'Unknown';
    if (isValid) {
      if (nationalNumber.length === 10 && detectedCountry?.dialCode === '+1') {
        type = 'Mobile';
      } else if (nationalNumber.startsWith('1') && detectedCountry?.code === 'CN') {
        type = 'Mobile';
      } else if (nationalNumber.startsWith('07') && detectedCountry?.code === 'GB') {
        type = 'Mobile';
      } else {
        type = 'Landline';
      }
    }

    return {
      isValid: !!isValid,
      country: detectedCountry,
      nationalNumber,
      internationalFormat,
      nationalFormat,
      e164Format,
      rfc3966Format,
      type,
      errors
    };
  }, [formatInternational, formatNational]);

  const parseResult = useMemo(() => {
    if (!phone.trim()) {
      return null;
    }

    return parsePhoneNumber(phone, selectedCountry);
  }, [phone, selectedCountry, parsePhoneNumber]);

  function formatNumberByPattern(pattern: string, number: string): string {
    let result = pattern;
    let numberIndex = 0;

    for (let i = 0; i < pattern.length && numberIndex < number.length; i++) {
      if (pattern[i] === 'X') {
        result = result.substring(0, i) + number[numberIndex] + result.substring(i + 1);
        numberIndex++;
      }
    }

    // Append remaining
    if (numberIndex < number.length) {
      const remaining = number.substring(numberIndex);
      result += remaining;
    }

    return result;
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const loadExample = (example: string) => {
    setPhone(example);
    setShowResults(true);
  };

  const clearAll = () => {
    setPhone('');
    setShowResults(false);
    setCopied(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Phone Number Parser</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Parse and format international phone numbers, supporting multiple country formats and standards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main Functionality */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Phone Input
                </CardTitle>
                <CardDescription>
                  Enter phone number to parse, select country code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Country Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Country/Region</label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country/Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="h-[200px]">
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <div className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{country.name}</span>
                              <span className="text-muted-foreground">({country.dialCode})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., +1 202-555-0123 or 202-555-0123"
                  className="font-mono text-lg"
                />

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{phone.replace(/[^\d+]/g, '').length} chars</span>
                  <Button variant="ghost" size="sm" onClick={clearAll}>
                    Clear
                  </Button>
                </div>

                {/* Quick Examples */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Quick Examples:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {EXAMPLE_PHONES.slice(0, 6).map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => loadExample(example.phone)}
                        className="text-xs font-mono"
                      >
                        {example.phone}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setShowResults(true)}
                  className="w-full"
                  disabled={!phone.trim()}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Parse Number
                </Button>
              </CardContent>
            </Card>

            {/* Parse Result */}
            {showResults && parseResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {parseResult.isValid ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      Parse Result
                    </div>
                    <Badge variant={parseResult.isValid ? "default" : "destructive"}>
                      {parseResult.isValid ? 'Valid' : 'Invalid'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {parseResult.isValid
                      ? 'Phone number format is correct and parsed successfully'
                      : 'Phone number validation failed'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Errors */}
                  {parseResult.errors && parseResult.errors.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800 mb-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Parse Errors:</span>
                      </div>
                      <ul className="space-y-1 text-sm text-red-700">
                        {parseResult.errors.map((error, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Result Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Country/Region</div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{parseResult.country?.flag}</span>
                          <div>
                            <div className="font-medium">{parseResult.country?.name}</div>
                            <div className="text-sm text-muted-foreground">{parseResult.country?.dialCode}</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Number Type</div>
                        <Badge variant="outline">
                          {parseResult.type}
                        </Badge>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">National Format</div>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted p-2 rounded text-sm flex-1">
                            {parseResult.nationalFormat || 'N/A'}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(parseResult.nationalFormat)}
                            disabled={!parseResult.nationalFormat}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">International Format</div>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted p-2 rounded text-sm flex-1">
                            {parseResult.internationalFormat || 'N/A'}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(parseResult.internationalFormat)}
                            disabled={!parseResult.internationalFormat}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">E.164 Format</div>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted p-2 rounded text-sm flex-1">
                            {parseResult.e164Format || 'N/A'}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(parseResult.e164Format)}
                            disabled={!parseResult.e164Format}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">RFC 3966 Format</div>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted p-2 rounded text-sm flex-1 break-all">
                            {parseResult.rfc3966Format || 'N/A'}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(parseResult.rfc3966Format)}
                            disabled={!parseResult.rfc3966Format}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {copied && (
                    <div className="text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Copied to clipboard</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Info Panel */}
          <div className="space-y-6">
            {/* Supported Countries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Supported Countries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full">
                  <div className="grid grid-cols-1 gap-2">
                    {COUNTRIES.map((country) => (
                      <div
                        key={country.code}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                        onClick={() => setSelectedCountry(country.code)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{country.flag}</span>
                          <div>
                            <div className="font-medium text-sm">{country.name}</div>
                            <div className="text-xs text-muted-foreground">{country.dialCode}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {country.code}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Standards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Format Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>E.164:</strong>
                  <p className="mt-1 text-muted-foreground">
                    International phone number standard format, includes country code and number.
                  </p>
                </div>
                <div>
                  <strong>International Format:</strong>
                  <p className="mt-1 text-muted-foreground">
                    Complete format with country code, for international calls.
                  </p>
                </div>
                <div>
                  <strong>National Format:</strong>
                  <p className="mt-1 text-muted-foreground">
                    Local format without country code, for domestic calls.
                  </p>
                </div>
                <div>
                  <strong>RFC 3966:</strong>
                  <p className="mt-1 text-muted-foreground">
                    URI format for phone numbers, used in web and apps.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Usage Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Usage Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Input Format:</strong>
                  <ul className="mt-1 ml-4 space-y-1 text-muted-foreground">
                    <li>• Supports with/without country code</li>
                    <li>• Auto-cleans special characters</li>
                    <li>• Supports various separators</li>
                  </ul>
                </div>
                <div>
                  <strong>Parsing Features:</strong>
                  <ul className="mt-1 ml-4 space-y-1 text-muted-foreground">
                    <li>• Auto-detects country/region</li>
                    <li>• Validates number format</li>
                    <li>• Multiple output formats</li>
                  </ul>
                </div>
                <div>
                  <strong>Notes:</strong>
                  <ul className="mt-1 ml-4 space-y-1 text-muted-foreground">
                    <li>• Does not verify existence</li>
                    <li>• Formats vary by country</li>
                    <li>• Suggest using full international format</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
