# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Development server on port 8849
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

## Architecture Overview

This is a developer tools collection built with Next.js 15 App Router, React 19, and TypeScript. The project follows a modular architecture where each tool is a self-contained page with optional utility functions.

### Core Patterns

**Tool Registration**: All tools are registered in `src/lib/tools-list.ts`. This file exports `allTools` array containing metadata (name, href, category, icon, description) for sidebar navigation and search.

**Tool Categories**: crypto, converter, web, network, development, text, data, math, measurement, images-videos. Each maps to a route under `/tools/[category]/[tool-name]`.

**Component Architecture**:
- UI primitives in `src/components/ui/` - shadcn/ui components built on Radix UI
- Barrel export via `src/components/ui/index.ts` for clean imports
- Tool-specific logic lives in corresponding `src/utils/` files
- Layout wrapper in `src/app/tools/layout.tsx` provides sidebar navigation

**State Management**: Zustand store in `src/stores/use-tool-store.ts` handles favorites and search history with localStorage persistence.

**Theming**: CSS variables defined in `src/app/globals.css`, controlled by next-themes. Light theme uses blue primary, dark theme uses electric violet. Custom utilities: `text-glow`, `glass-card`, `neon-border`.

### Adding a New Tool

1. Create page at `src/app/tools/[category]/[tool-name]/page.tsx`
2. Add entry to `allTools` array in `src/lib/tools-list.ts`
3. If needed, add utility functions to `src/utils/[tool-name].ts`

### Key Files

- `src/lib/tools-list.ts` - Tool registry, single source of truth for tool metadata
- `src/lib/utils.ts` - Shared utilities including `cn()` for class merging
- `src/app/tools/layout.tsx` - Tools section layout with collapsible sidebar
- `src/app/providers.tsx` - Client-side providers (theme, ads)
- `tailwind.config.js` - Design tokens and custom animations

### Conventions

- All tool pages are client components (`'use client'`)
- Import UI components from `@/components/ui` barrel export
- Use `cn()` from `@/lib/utils` for conditional class merging
- Path alias: `@/*` maps to `./src/*`
