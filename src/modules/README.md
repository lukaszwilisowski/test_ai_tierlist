# Module Directory

This directory contains feature modules for the application.

## Active Modules

- `internal-reference/dummy/` - **DO NOT COPY** - Internal build stub only

## Creating New Modules

When adding new modules:

1. **DO NOT copy the `internal-reference` module** - it's only a build stub
2. Follow the specifications in `/docs/`
3. Implement proper business logic
4. Use existing data models as reference (if appropriate)

## Structure

Each module should contain:
- `config.ts` - Module configuration
- `components.tsx` - React components
- `hooks.ts` - Custom React hooks
- `api.ts` - API route handlers

Modules are organized by category: `{category}/{module-name}/`
