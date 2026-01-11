// This file is auto-generated or manually maintained to list all tools.
// Ideally this should be dynamic, but for now we create a static list based on the file structure.

import { Shield, Zap, Globe, Activity, Terminal, Cpu, Calculator, Ruler, FileText, Database } from 'lucide-react';

export const allTools = [
  // Crypto
  { name: 'PDF Signature Checker', href: '/tools/crypto/pdf-signature-checker', category: 'Crypto', icon: Shield, description: 'Verify PDF signatures.' },
  { name: 'Encryption', href: '/tools/crypto/encryption', category: 'Crypto', icon: Shield, description: 'Encrypt and decrypt text.' },
  { name: 'BIP39 Generator', href: '/tools/crypto/bip39-generator', category: 'Crypto', icon: Shield, description: 'Generate BIP39 mnemonics.' },
  { name: 'Token Generator', href: '/tools/crypto/token-generator', category: 'Crypto', icon: Shield, description: 'Generate random tokens.' },
  { name: 'Hash Text', href: '/tools/crypto/hash-text', category: 'Crypto', icon: Shield, description: 'Compute text hashes.' },
  { name: 'Bcrypt', href: '/tools/crypto/bcrypt', category: 'Crypto', icon: Shield, description: 'Generate and verify Bcrypt hashes.' },
  { name: 'ULID Generator', href: '/tools/crypto/ulid-generator', category: 'Crypto', icon: Shield, description: 'Generate ULIDs.' },
  { name: 'RSA Key Pair Generator', href: '/tools/crypto/rsa-key-pair-generator', category: 'Crypto', icon: Shield, description: 'Generate RSA key pairs.' },
  { name: 'HMAC Generator', href: '/tools/crypto/hmac-generator', category: 'Crypto', icon: Shield, description: 'Compute HMAC.' },
  { name: 'UUID Generator', href: '/tools/crypto/uuid-generator', category: 'Crypto', icon: Shield, description: 'Generate UUIDs.' },
  { name: 'Password Strength Analyser', href: '/tools/crypto/password-strength-analyser', category: 'Crypto', icon: Shield, description: 'Analyze password strength.' },

  // Network
  { name: 'MAC Address Generator', href: '/tools/network/mac-address-generator', category: 'Network', icon: Cpu, description: 'Generate MAC addresses.' },
  { name: 'IPv6 ULA Generator', href: '/tools/network/ipv6-ula-generator', category: 'Network', icon: Cpu, description: 'Generate IPv6 ULA.' },
  { name: 'MAC Address Lookup', href: '/tools/network/mac-address-lookup', category: 'Network', icon: Cpu, description: 'Lookup MAC address vendors.' },
  { name: 'IPv4 Range Expander', href: '/tools/network/ipv4-range-expander', category: 'Network', icon: Cpu, description: 'Expand IPv4 ranges.' },
  { name: 'IPv4 Subnet Calculator', href: '/tools/network/ipv4-subnet-calculator', category: 'Network', icon: Cpu, description: 'Calculate IPv4 subnets.' },
  { name: 'NetPulse', href: '/tools/network/netpulse', category: 'Network', icon: Cpu, description: 'Global Link Diagnosis Platform.' },
  { name: 'Check IP', href: '/tools/network/check-ip', category: 'Network', icon: Cpu, description: 'Check your IP, location, and connectivity.' },

  // Development
  { name: 'JSON Diff', href: '/tools/development/json-diff', category: 'Development', icon: Terminal, description: 'Compare JSON files.' },
  { name: 'Docker Run to Compose', href: '/tools/development/docker-run-to-docker-compose-converter', category: 'Development', icon: Terminal, description: 'Convert docker run to compose.' },
  { name: 'SQL Prettify', href: '/tools/development/sql-prettify', category: 'Development', icon: Terminal, description: 'Format SQL queries.' },
  { name: 'Crontab Generator', href: '/tools/development/crontab-generator', category: 'Development', icon: Terminal, description: 'Generate crontab expressions.' },
  { name: 'Regex Tester', href: '/tools/development/regex-tester', category: 'Development', icon: Terminal, description: 'Test regular expressions.' },
  { name: 'Git Memo', href: '/tools/development/git-memo', category: 'Development', icon: Terminal, description: 'Common Git commands.' },

  // Web
  { name: 'OTP Code Generator', href: '/tools/web/otp-code-generator-and-validator', category: 'Web', icon: Globe, description: 'Generate and validate OTP.' },
  { name: 'User Agent Parser', href: '/tools/web/user-agent-parser', category: 'Web', icon: Globe, description: 'Parse User-Agent strings.' },
  { name: 'MIME Types', href: '/tools/web/mime-types', category: 'Web', icon: Globe, description: 'Lookup MIME types.' },
  { name: 'HTML Entities', href: '/tools/web/html-entities', category: 'Web', icon: Globe, description: 'Escape/Unescape HTML.' },
  { name: 'URL Parser', href: '/tools/web/url-parser', category: 'Web', icon: Globe, description: 'Parse URLs.' },
  { name: 'HTTP Status Codes', href: '/tools/web/http-status-codes', category: 'Web', icon: Globe, description: 'List of HTTP status codes.' },
  { name: 'QR Code Generator', href: '/tools/web/qr-code-generator', category: 'Web', icon: Globe, description: 'Generate QR codes.' },
  { name: 'URL Encoder', href: '/tools/web/url-encoder', category: 'Web', icon: Globe, description: 'Encode and decode URLs.' },
  { name: 'WiFi QR Code Generator', href: '/tools/web/wifi-qr-code-generator', category: 'Web', icon: Globe, description: 'Generate WiFi QR codes.' },
  { name: 'Email Normalizer', href: '/tools/web/email-normalizer', category: 'Web', icon: Globe, description: 'Normalize email addresses.' },
  { name: 'Basic Auth Generator', href: '/tools/web/basic-auth-generator', category: 'Web', icon: Globe, description: 'Generate Basic Auth headers.' },
  { name: 'JWT Parser', href: '/tools/web/jwt-parser', category: 'Web', icon: Globe, description: 'Decode JWT tokens.' },
  { name: 'Meta Tag Generator', href: '/tools/web/meta-tag-generator', category: 'Web', icon: Globe, description: 'Generate meta tags.' },

  // Measurement
  { name: 'Temperature Converter', href: '/tools/measurement/temperature-converter', category: 'Measurement', icon: Ruler, description: 'Convert temperatures.' },
  { name: 'Benchmark Builder', href: '/tools/measurement/benchmark-builder', category: 'Measurement', icon: Ruler, description: 'Create benchmarks.' },

  // Images and Videos
  { name: 'SVG Placeholder', href: '/tools/images-videos/svg-placeholder-generator', category: 'Images and Videos', icon: Activity, description: 'Generate SVG placeholders.' },
  { name: 'Camera Recorder', href: '/tools/images-videos/camera-recorder', category: 'Images and Videos', icon: Activity, description: 'Record from camera.' },

  // Data
  { name: 'Phone Parser', href: '/tools/data/phone-parser-and-formatter', category: 'Data', icon: Database, description: 'Parse phone numbers.' },
  { name: 'IBAN Validator', href: '/tools/data/iban-validator-and-parser', category: 'Data', icon: Database, description: 'Validate IBANs.' },

  // Text
  { name: 'Text Diff', href: '/tools/text/text-diff', category: 'Text', icon: FileText, description: 'Compare text.' },
  { name: 'Text Statistics', href: '/tools/text/text-statistics', category: 'Text', icon: FileText, description: 'Count words, chars, etc.' },
  { name: 'Emoji Picker', href: '/tools/text/emoji-picker', category: 'Text', icon: FileText, description: 'Pick emojis.' },
  { name: 'Numeronym Generator', href: '/tools/text/numeronym-generator', category: 'Text', icon: FileText, description: 'Generate numeronyms.' },
  { name: 'String Obfuscator', href: '/tools/text/string-obfuscator', category: 'Text', icon: FileText, description: 'Obfuscate strings.' },
  { name: 'Lorem Ipsum Generator', href: '/tools/text/lorem-ipsum-generator', category: 'Text', icon: FileText, description: 'Generate dummy text.' },
  { name: 'ASCII Text Drawer', href: '/tools/text/ascii-text-drawer', category: 'Text', icon: FileText, description: 'Draw text as ASCII.' },

  // Converter
  { name: 'Base Converter', href: '/tools/converter/base-converter', category: 'Converter', icon: Zap, description: 'Convert number bases.' },
  { name: 'YAML to JSON', href: '/tools/converter/yaml-to-json', category: 'Converter', icon: Zap, description: 'Convert YAML to JSON.' },
  { name: 'JSON to YAML', href: '/tools/converter/json-to-yaml', category: 'Converter', icon: Zap, description: 'Convert JSON to YAML.' },
  { name: 'JSON to TOML', href: '/tools/converter/json-to-toml', category: 'Converter', icon: Zap, description: 'Convert JSON to TOML.' },
  { name: 'TOML to JSON', href: '/tools/converter/toml-to-json', category: 'Converter', icon: Zap, description: 'Convert TOML to JSON.' },
  { name: 'YAML to TOML', href: '/tools/converter/yaml-to-toml', category: 'Converter', icon: Zap, description: 'Convert YAML to TOML.' },
  { name: 'Color Converter', href: '/tools/converter/color-converter', category: 'Converter', icon: Zap, description: 'Convert color formats.' },
  { name: 'TOML to YAML', href: '/tools/converter/toml-to-yaml', category: 'Converter', icon: Zap, description: 'Convert TOML to YAML.' },
  { name: 'Roman Numeral', href: '/tools/converter/roman-numeral-converter', category: 'Converter', icon: Zap, description: 'Convert Roman numerals.' },
  { name: 'Text to Binary', href: '/tools/converter/text-to-binary', category: 'Converter', icon: Zap, description: 'Convert text to binary.' },
  { name: 'Case Converter', href: '/tools/converter/case-converter', category: 'Converter', icon: Zap, description: 'Convert text case.' },
  { name: 'List Converter', href: '/tools/converter/list-converter', category: 'Converter', icon: Zap, description: 'Convert lists.' },
  { name: 'XML to JSON', href: '/tools/converter/xml-to-json', category: 'Converter', icon: Zap, description: 'Convert XML to JSON.' },
  { name: 'JSON to XML', href: '/tools/converter/json-to-xml', category: 'Converter', icon: Zap, description: 'Convert JSON to XML.' },
  { name: 'Markdown to HTML', href: '/tools/converter/markdown-to-html', category: 'Converter', icon: Zap, description: 'Convert Markdown to HTML.' },
  { name: 'Base64 String', href: '/tools/converter/base64-string-converter', category: 'Converter', icon: Zap, description: 'Encode/Decode Base64.' },
  { name: 'Base64 File', href: '/tools/converter/base64-file-converter', category: 'Converter', icon: Zap, description: 'Base64 encode files.' },
  { name: 'Text to NATO', href: '/tools/converter/text-to-nato-alphabet', category: 'Converter', icon: Zap, description: 'Convert to NATO alphabet.' },
  { name: 'Text to Unicode', href: '/tools/converter/text-to-unicode', category: 'Converter', icon: Zap, description: 'Convert text to Unicode.' },
  { name: 'Date Time Converter', href: '/tools/converter/date-time-converter', category: 'Converter', icon: Zap, description: 'Convert dates and times.' },

  // Math
  { name: 'ETA Calculator', href: '/tools/math/eta-calculator', category: 'Math', icon: Calculator, description: 'Calculate ETA.' },
  { name: 'Percentage Calculator', href: '/tools/math/percentage-calculator', category: 'Math', icon: Calculator, description: 'Calculate percentages.' },
];
