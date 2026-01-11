'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { ScrollArea } from '@/components/ui';
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Globe,
  Copy,
  AlertCircle,
  Book,
  Search,
  Info
} from 'lucide-react';

interface CountryIBAN {
  code: string;
  name: string;
  ibanLength: number;
  format: string;
  example: string;
}

interface ValidationResult {
  isValid: boolean;
  countryInfo?: CountryIBAN;
  standardIBAN: string;
  accountNumber: string;
  checkDigits: string;
  countryCode: string;
  errors?: string[];
}

const IBAN_COUNTRIES: CountryIBAN[] = [
  { code: 'AL', name: 'Albania', ibanLength: 28, format: 'ALkk BBBC CCCC CCCC CCCC CCCC CCCC', example: 'AL02200330000000000000000000' },
  { code: 'AD', name: 'Andorra', ibanLength: 24, format: 'ADkk BBBB CCCC CCCC CCCC CCCC', example: 'AD0000010000000000000000' },
  { code: 'AT', name: 'Austria', ibanLength: 20, format: 'ATkk BBBB BCCC CCCC CCCC', example: 'AT611904300234573201' },
  { code: 'AZ', name: 'Azerbaijan', ibanLength: 28, format: 'AZkk BBBB CCCC CCCC CCCC CCCC CCCC', example: 'AZ65000000000000000000000000' },
  { code: 'BH', name: 'Bahrain', ibanLength: 22, format: 'BHkk BBBB CCCC CCCC CCCC CC', example: 'BH12345678901234567890' },
  { code: 'BY', name: 'Belarus', ibanLength: 28, format: 'BYkk BBBB CCCC CCCC CCCC CCCC CCCC', example: 'BY13UNBS88880000000000000000' },
  { code: 'BE', name: 'Belgium', ibanLength: 16, format: 'BEkk BBBB CCCC CC', example: 'BE68539007547034' },
  { code: 'BA', name: 'Bosnia and Herzegovina', ibanLength: 20, format: 'BAkk BBBC CCCC CCCC CC', example: 'BA393939393939393939' },
  { code: 'BR', name: 'Brazil', ibanLength: 29, format: 'BRkk BBBB BBBB TCCC CCCC CCCC CCC', example: 'BR2100000000000000000000000000000' },
  { code: 'BG', name: 'Bulgaria', ibanLength: 22, format: 'BGkk BBBB CCCC DDCC CCCC CC', example: 'BG80BNBG88889999000011' },
  { code: 'CR', name: 'Costa Rica', ibanLength: 22, format: 'CRkk 0BBB CCCC CCCC CCCC CC', example: 'CR05012345678901234567' },
  { code: 'HR', name: 'Croatia', ibanLength: 21, format: 'HRkk BBBB RRRR RRRR RRRR R', example: 'HR5949494949494949494' },
  { code: 'CY', name: 'Cyprus', ibanLength: 28, format: 'CYkk BBBC CCCC CCCC CCCC CCCC CCCC', example: 'CY17002001200000000000000000' },
  { code: 'CZ', name: 'Czech Republic', ibanLength: 24, format: 'CZkk BBBB CCCC CCCC CCCC CCCC', example: 'CZ4808000000000000000000' },
  { code: 'DK', name: 'Denmark', ibanLength: 18, format: 'DKkk BBBB CCCC CCCC CC', example: 'DK3335001234567890' },
  { code: 'DO', name: 'Dominican Republic', ibanLength: 28, format: 'DOkk BBBB CCCC CCCC CCCC CCCC CCCC', example: 'DO11ADPA12345678901234567890' },
  { code: 'TL', name: 'East Timor', ibanLength: 23, format: 'TLkk BBBB CCCC CCCC CCCC CCC', example: 'TL380000000000000000000' },
  { code: 'EG', name: 'Egypt', ibanLength: 29, format: 'EGkk BBBB CCCC CCCC CCCC CCCC CCCC C', example: 'EG1200000000000000000000000000000' },
  { code: 'EE', name: 'Estonia', ibanLength: 20, format: 'EEkk BBBB CCCC CCCC CCCK', example: 'EE199900000000000000' },
  { code: 'FO', name: 'Faroe Islands', ibanLength: 18, format: 'FOkk BBBB CCCC CCCC C', example: 'FO1898700000000000' },
  { code: 'FI', name: 'Finland', ibanLength: 18, format: 'FIkk BBBB CCCC CCCC CC', example: 'FI2112345600000785' },
  { code: 'FR', name: 'France', ibanLength: 27, format: 'FRkk BBBB BGGG GGCC CCCC CCCC CKK', example: 'FR1420041010050500013M02606' },
  { code: 'GE', name: 'Georgia', ibanLength: 22, format: 'GEkk BBCC CCCC CCCC CCCC CC', example: 'GE00AG00000000000000' },
  { code: 'DE', name: 'Germany', ibanLength: 22, format: 'DEkk BBBB BBBB CCCC CCCC CC', example: 'DE89370400440532013000' },
  { code: 'GI', name: 'Gibraltar', ibanLength: 23, format: 'GIkk BBBB CCCC CCCC CCCC CCC', example: 'GI23BARC20202020202020' },
  { code: 'GR', name: 'Greece', ibanLength: 27, format: 'GRkk BBBC CCCC CCCC CCCC CCCC CCC', example: 'GR1701701230000000000000000' },
  { code: 'GL', name: 'Greenland', ibanLength: 18, format: 'GLkk BBBB CCCC CCCC CC', example: 'GL1835001234567890' },
  { code: 'GT', name: 'Guatemala', ibanLength: 28, format: 'GTkk BBBB BBBB CCCC CCCC CCCC CCCC', example: 'GT12000000000000000000000000' },
  { code: 'HU', name: 'Hungary', ibanLength: 28, format: 'HUkk BBBC CCCC 0000 0000 0000 0000', example: 'HU53107000242424242424242424' },
  { code: 'IS', name: 'Iceland', ibanLength: 26, format: 'ISkk BBBB CCCC CCCC KKKK KKKK KK', example: 'IS00000000000000000000000000' },
  { code: 'IQ', name: 'Iraq', ibanLength: 23, format: 'IQkk BBBB CCC CCCC CCCC CCC', example: 'IQ25IBII000000000000000' },
  { code: 'IE', name: 'Ireland', ibanLength: 22, format: 'IEkk AAAA BBBB CCCC CC', example: 'IE29AIBK93115212345678' },
  { code: 'IL', name: 'Israel', ibanLength: 23, format: 'ILkk BBNN NCCC CCCC CCCC CCC', example: 'IL220000000000000000000' },
  { code: 'IT', name: 'Italy', ibanLength: 27, format: 'ITkk XBBB BGGG GGCC CCCC CCCC CCC', example: 'IT60X0542811101000000123456' },
  { code: 'JO', name: 'Jordan', ibanLength: 30, format: 'JOkk BBBB CCCC CCCC CCCC CCCC CCCC CC', example: 'JO22000000000000000000000000000000' },
  { code: 'KZ', name: 'Kazakhstan', ibanLength: 20, format: 'KZkk BBB CCCC CCCC CCCC', example: 'KZ120000000000000000' },
  { code: 'XK', name: 'Kosovo', ibanLength: 20, format: 'XKkk BBBB CCCC CCCC CCCC', example: 'XK051001000000000000' },
  { code: 'KW', name: 'Kuwait', ibanLength: 30, format: 'KWkk BBBB CCCC CCCC CCCC CCCC CCCC CC', example: 'KW12NBOK0000000000000000000000' },
  { code: 'LV', name: 'Latvia', ibanLength: 21, format: 'LVkk BBBB CCCC CCCC CCCC C', example: 'LV12PARX0000000000000' },
  { code: 'LB', name: 'Lebanon', ibanLength: 28, format: 'LBkk BBBB CCCC CCCC CCCC CCCC CCCC', example: 'LB12000000000000000000000000' },
  { code: 'LI', name: 'Liechtenstein', ibanLength: 21, format: 'LIkk BBBB BCCC CCCC CCCC C', example: 'LI5100000000000000000' },
  { code: 'LT', name: 'Lithuania', ibanLength: 20, format: 'LTkk BBBB BCCC CCCC CCCC', example: 'LT127044000000000000' },
  { code: 'LU', name: 'Luxembourg', ibanLength: 20, format: 'LUkk BBB CCCC CCCC CCCC', example: 'LU590000000000000000' },
  { code: 'MK', name: 'North Macedonia', ibanLength: 19, format: 'MKkk BBB CCCC CCCC KKK', example: 'MK07200000000000000' },
  { code: 'MT', name: 'Malta', ibanLength: 31, format: 'MTkk BBBB SSSS SCCC CCCC CCCC CCCC CCC', example: 'MT120000000000000000000000000000000' },
  { code: 'MR', name: 'Mauritania', ibanLength: 27, format: 'MRkk BBBB BGGG GGCC CCCC CCCC CC', example: 'MR1355555555555555555555555' },
  { code: 'MU', name: 'Mauritius', ibanLength: 30, format: 'Mukk BBBB BBCC CCCC CCCC CCCC CCCC CC', example: 'MU12000000000000000000000000000000' },
  { code: 'MD', name: 'Moldova', ibanLength: 24, format: 'MDkk BBCC CCCC CCCC CCCC CCCC', example: 'MD2000000000000000000000' },
  { code: 'MC', name: 'Monaco', ibanLength: 27, format: 'MCkk BBBB BGGG GGCC CCCC CCCC CKK', example: 'MC1200000000000000000000000' },
  { code: 'ME', name: 'Montenegro', ibanLength: 22, format: 'MEkk BBBC CCCC CCCC CCCC CC', example: 'ME25500000000000000000' },
  { code: 'NL', name: 'Netherlands', ibanLength: 18, format: 'NLkk BBBB CCCC CCCC CC', example: 'NL91ABNA0417164300' },
  { code: 'NO', name: 'Norway', ibanLength: 15, format: 'NOkk BBBB CCCC CC', example: 'NO1234567890123' },
  { code: 'PK', name: 'Pakistan', ibanLength: 24, format: 'PKkk BBBB CCCC CCCC CCCC CCCC', example: 'PK1200000000000000000000' },
  { code: 'PS', name: 'Palestine', ibanLength: 29, format: 'PSkk BBBB CCCC CCCC CCCC CCCC CCCC C', example: 'PS1200000000000000000000000000000' },
  { code: 'PL', name: 'Poland', ibanLength: 28, format: 'PLkk BBBB GGGG XXXX XXXX XXXX XXXX', example: 'PL12101010101010101010101010' },
  { code: 'PT', name: 'Portugal', ibanLength: 25, format: 'PTkk BBBB CCCC CCCC CCCC CKK', example: 'PT50000000000000000000000' },
  { code: 'QA', name: 'Qatar', ibanLength: 29, format: 'QAkk BBBB CCCC CCCC CCCC CCCC CCCC C', example: 'QA12QNBK000000000000000000000' },
  { code: 'RO', name: 'Romania', ibanLength: 24, format: 'ROkk BBBB CCCC CCCC CCCC CCCC', example: 'RO49ABNA0000000000000000' },
  { code: 'LC', name: 'Saint Lucia', ibanLength: 32, format: 'LCkk BBBB CCCC CCCC CCCC CCCC CCCC CCCC', example: 'LC1200000000000000000000000000000000' },
  { code: 'SM', name: 'San Marino', ibanLength: 27, format: 'SMkk LBBB BCCC CCCC CCCC C', example: 'SM15A0000000000000000000000' },
  { code: 'ST', name: 'Sao Tome and Principe', ibanLength: 25, format: 'STkk BBBB SSSS CCCC CCCC CCCC C', example: 'ST12000000000000000000000' },
  { code: 'SA', name: 'Saudi Arabia', ibanLength: 24, format: 'SAkk BBCC CCCC CCCC CCCC CCCC', example: 'SA0080000000000000000000' },
  { code: 'RS', name: 'Serbia', ibanLength: 22, format: 'RSkk BBBC CCCC CCCC CCCC CC', example: 'RS12000000000000000000' },
  { code: 'SC', name: 'Seychelles', ibanLength: 31, format: 'SCkk BBBB BBBB CCCC CCCC CCCC CCCC CCC', example: 'SC120000000000000000000000000000000' },
  { code: 'SK', name: 'Slovakia', ibanLength: 24, format: 'SKkk BBBB CCCC CCCC CCCC CCCC', example: 'SK1200000000000000000000' },
  { code: 'SI', name: 'Slovenia', ibanLength: 19, format: 'SIkk BBBC CCCC CCCC CC', example: 'SI56263300012039086' },
  { code: 'ES', name: 'Spain', ibanLength: 24, format: 'ESkk BBBB GGGG KKCC CCCC CCCC', example: 'ES9121000418450200051332' },
  { code: 'SE', name: 'Sweden', ibanLength: 24, format: 'SEkk BBBB CCCC CCCC CCCC CCCC', example: 'SE4550000000058398257466' },
  { code: 'CH', name: 'Switzerland', ibanLength: 21, format: 'CHkk BBBB BCCC CCCC CCCC C', example: 'CH9300762011623852957' },
  { code: 'TN', name: 'Tunisia', ibanLength: 24, format: 'TNkk BBBB BGGG GGCC CCCC CCCC CC', example: 'TN5910006035183598478831' },
  { code: 'TR', name: 'Turkey', ibanLength: 26, format: 'TRkk BBBB BCCC CCCC CCCCC CCCC CC', example: 'TR330006100519786457841326' },
  { code: 'AE', name: 'UAE', ibanLength: 23, format: 'AEkk BBBB CCCC CCCC CCCCC CCC', example: 'AE070331234567890123456' },
  { code: 'GB', name: 'United Kingdom', ibanLength: 22, format: 'GBkk BBBB CCCC CCCC CCCC CC', example: 'GB29NWBK60161331926819' },
  { code: 'VG', name: 'Virgin Islands, British', ibanLength: 24, format: 'VGkk BBBB CCCC CCCC CCCCC CCC', example: 'VG96VPVG0000012345678901' }
];

const EXAMPLE_IBANS = [
  { iban: 'GB29NWBK60161331926819', country: 'United Kingdom' },
  { iban: 'DE89370400440532013000', country: 'Germany' },
  { iban: 'FR1420041010050500013M02606', country: 'France' },
  { iban: 'IT60X0542811101000000123456', country: 'Italy' },
  { iban: 'ES9121000418450200051332', country: 'Spain' },
  { iban: 'NL91ABNA0417164300', country: 'Netherlands' },
  { iban: 'BE68539007547034', country: 'Belgium' },
  { iban: 'CH9300762011623852957', country: 'Switzerland' },
  { iban: 'AT611904300234573201', country: 'Austria' },
  { iban: 'IE29AIBK93115212345678', country: 'Ireland' }
];

export default function IbanValidatorPage() {
  const [iban, setIban] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const validateIBAN = (ibanInput: string): ValidationResult => {
    const errors: string[] = [];

    // Remove spaces and uppercase
    const cleaned = ibanInput.replace(/\s/g, '').toUpperCase();

    // Basic format check
    if (!/^[A-Z0-9]+$/.test(cleaned)) {
      errors.push('IBAN must contain only alphanumeric characters');
    }

    // Length check
    if (cleaned.length < 15) {
      errors.push('IBAN too short');
    }
    if (cleaned.length > 34) {
      errors.push('IBAN too long');
    }

    const countryCode = cleaned.substring(0, 2);
    const countryInfo = IBAN_COUNTRIES.find(c => c.code === countryCode);

    // Country code check
    if (!countryInfo) {
      errors.push('Invalid country code');
    } else if (cleaned.length !== countryInfo.ibanLength) {
      errors.push(`Length mismatch, ${countryInfo.name} IBAN length should be ${countryInfo.ibanLength}`);
    }

    // Check Digits validation
    const checkDigits = cleaned.substring(2, 4);
    if (!/^\d{2}$/.test(checkDigits)) {
      errors.push('Check digits must be two numbers');
    } else {
      // mod97 algorithm
      const rearranged = cleaned.substring(4) + cleaned.substring(0, 4);
      let numericStr = '';

      for (let i = 0; i < rearranged.length; i++) {
        const char = rearranged[i];
        if (/[0-9]/.test(char)) {
          numericStr += char;
        } else {
          numericStr += (char.charCodeAt(0) - 55).toString();
        }
      }

      // Large number modulo
      try {
        const bigIntVal = BigInt(numericStr);
        if (bigIntVal % 97n !== 1n) {
            errors.push('Check digit validation failed');
        }
      } catch {
          errors.push('Numeric validation error');
      }
    }

    return {
      isValid: errors.length === 0,
      countryInfo,
      standardIBAN: cleaned,
      accountNumber: cleaned.substring(4),
      checkDigits,
      countryCode,
      errors
    };
  };

  const handleValidate = () => {
    if (!iban.trim()) return;
    setValidationResult(validateIBAN(iban));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const loadExample = (example: string) => {
    setIban(example);
    setValidationResult(validateIBAN(example));
  };

  const clearAll = () => {
    setIban('');
    setValidationResult(null);
    setCopied(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">IBAN Validator and Parser</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Validate International Bank Account Numbers (IBAN) and parse component information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main Functionality */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  IBAN Input
                </CardTitle>
                <CardDescription>
                  Enter IBAN number to validate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    placeholder="e.g. GB29NWBK60161331926819"
                    className="font-mono text-lg"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{iban.replace(/\s/g, '').length} chars</span>
                    <Button variant="ghost" size="sm" onClick={clearAll}>
                      Clear
                    </Button>
                  </div>
                </div>

                {/* Quick Examples */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Quick Examples:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {EXAMPLE_IBANS.slice(0, 6).map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => loadExample(example.iban)}
                        className="text-xs font-mono truncate"
                      >
                        {example.country}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleValidate}
                  className="w-full"
                  disabled={!iban.trim()}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Validate IBAN
                </Button>
              </CardContent>
            </Card>

            {/* Validation Result */}
            {validationResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {validationResult.isValid ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      Validation Result
                    </div>
                    <Badge variant={validationResult.isValid ? "default" : "destructive"}>
                      {validationResult.isValid ? 'Valid' : 'Invalid'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {validationResult.isValid
                      ? 'IBAN format correct and check digits verified'
                      : 'IBAN format or check digit validation failed'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Errors */}
                  {validationResult.errors && validationResult.errors.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800 mb-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Validation Errors:</span>
                      </div>
                      <ul className="space-y-1 text-sm text-red-700">
                        {validationResult.errors.map((error, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Parse Results */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Standardized IBAN</div>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted p-2 rounded text-sm flex-1 font-mono break-all">
                            {validationResult.standardIBAN}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(validationResult.standardIBAN)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Country Code</div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-lg">{validationResult.countryCode}</span>
                          {validationResult.countryInfo && (
                            <span className="text-muted-foreground">({validationResult.countryInfo.name})</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Check Digits</div>
                        <span className="font-mono text-lg">{validationResult.checkDigits}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">BBAN (Basic Bank Account Number)</div>
                        <code className="bg-muted p-2 rounded text-sm block font-mono break-all">
                          {validationResult.accountNumber || 'None'}
                        </code>
                      </div>

                      {validationResult.countryInfo && (
                        <>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">IBAN Length</div>
                            <span className="font-mono">{validationResult.countryInfo.ibanLength} digits</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">Format Example</div>
                            <code className="text-xs text-muted-foreground break-all">
                              {validationResult.countryInfo.example}
                            </code>
                          </div>
                        </>
                      )}
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
            {/* Knowledge */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  IBAN Knowledge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>What is IBAN?</strong>
                  <p className="mt-1 text-muted-foreground">
                    International Bank Account Number (IBAN) is an internationally agreed system of identifying bank accounts across national borders.
                  </p>
                </div>
                <div>
                  <strong>Structure:</strong>
                  <p className="mt-1 text-muted-foreground">
                    Country Code (2 chars) + Check Digits (2 digits) + BBAN
                  </p>
                </div>
                <div>
                  <strong>Validation Algorithm:</strong>
                  <p className="mt-1 text-muted-foreground">
                    Uses mod97 algorithm for numeric validation to ensure correctness.
                  </p>
                </div>
                <div>
                  <strong>Advantages:</strong>
                  <ul className="mt-1 ml-4 space-y-1 text-muted-foreground">
                    <li>• Reduces cross-border transaction errors</li>
                    <li>• Improves processing efficiency</li>
                    <li>• International standardization</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Supported Countries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Supported Countries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full">
                  <div className="grid grid-cols-1 gap-2">
                    {IBAN_COUNTRIES.map((country) => (
                      <div
                        key={country.code}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded text-sm"
                      >
                        <span>{country.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {country.ibanLength} digits
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
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
                    <li>• Supports with/without spaces</li>
                    <li>• Auto-converts to uppercase</li>
                    <li>• Supports standard 2-char country codes</li>
                  </ul>
                </div>
                <div>
                  <strong>What is Validated:</strong>
                  <ul className="mt-1 ml-4 space-y-1 text-muted-foreground">
                    <li>• Country code validity</li>
                    <li>• IBAN length correctness</li>
                    <li>• Check digit mod97 algorithm</li>
                  </ul>
                </div>
                <div>
                  <strong>Notes:</strong>
                  <ul className="mt-1 ml-4 space-y-1 text-muted-foreground">
                    <li>• Validation does not guarantee account existence</li>
                    <li>• Verify balance with bank</li>
                    <li>• Formats vary by country</li>
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
