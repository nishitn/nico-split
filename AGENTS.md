# AGENTS.md

This project is a Bun + Vite application.

## Stack

- Runtime and package manager: `bun`
- Build tool and dev server: `vite`
- Language: `TypeScript`

## Common Commands

- Install dependencies: `bun install`
- Start the dev server: `bun run dev`
- Build for production: `bun run build`
- Preview the production build: `bun run preview`
- Run tests: `bun run test`
- Run linting: `bun run lint`
- Run formatting/check fixes: `bun run check`

## UI Guardrails

- Use dark theme only. Do not add light-theme or system-theme customer experiences.
- Customer-facing pages should follow the app's established visual theme and tokens instead of introducing disconnected one-off styles.
- Do not include meta explanations, implementation notes, setup hints, redirect URIs, or other internal-only copy on customer-facing pages.
