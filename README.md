# HandyTools

A comprehensive collection of developer tools built for the modern web. No accounts, no tracking, no nonsense - just tools that work.

**Website:** [tools.084817.xyz](https://tools.084817.xyz)

## What's Inside

**70+ tools** across 10 categories:

- **Crypto** - Hash generators, encryption, UUID/ULID, password analysis, RSA key pairs
- **Converters** - JSON/YAML/TOML/XML, Base64, color formats, number bases, date/time
- **Web** - JWT parser, URL encoder, QR codes, HTTP status codes, meta tag generator
- **Network** - IP/subnet calculators, MAC address utilities, connectivity diagnostics
- **Development** - JSON diff, SQL formatter, regex tester, crontab generator, Docker compose converter
- **Text** - Diff viewer, statistics, Lorem ipsum, ASCII art, string obfuscation
- **Data** - Phone number parser, IBAN validator
- **Math** - ETA calculator, percentage calculator
- **Measurement** - Temperature converter, benchmark builder
- **Media** - SVG placeholder generator, camera recorder

## Tech Stack

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui (Radix UI primitives)
- Zustand for state management

## Getting Started

```bash
# Install dependencies
npm install

# Run development server (port 8849)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
  app/
    tools/[category]/[tool]/   # Tool pages
    layout.tsx                 # Root layout
    providers.tsx              # Theme + providers
  components/
    ui/                        # shadcn/ui components
  lib/
    tools-list.ts              # Tool registry
    utils.ts                   # Shared utilities
  stores/                      # Zustand stores
  utils/                       # Tool-specific logic
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your tool following the existing patterns
4. Register it in `src/lib/tools-list.ts`
5. Submit a pull request

## License

MIT
