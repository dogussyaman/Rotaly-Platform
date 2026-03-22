# Contributing

## Local Setup

1. Install Node.js 22 and pnpm.
2. Run `pnpm install`.
3. Copy `.env.example` into `.env.local` and provide valid Supabase credentials.
4. Run the SQL scripts in `scripts/` in order on your Supabase project.
5. Start the app with `pnpm dev`.

## Daily Commands

- `pnpm lint`: ESLint checks for the entire workspace
- `pnpm typecheck`: TypeScript validation without emitting files
- `pnpm test`: Unit and component tests with Vitest
- `pnpm test:e2e`: Playwright smoke tests
- `pnpm build`: Production build validation
- `pnpm ci:check`: Local CI-equivalent baseline

## Pull Request Expectations

1. Keep each PR focused on one logical change.
2. Update documentation when behavior or setup changes.
3. Include tests for utilities, hooks, and critical user-facing behavior when you touch them.
4. Call out migration, auth, or policy impact explicitly in the PR description.

## Review Checklist

- Validate mobile and desktop behavior for changed UI paths.
- Check auth and permission boundaries when touching dashboard or Supabase code.
- Prefer typed helpers and shared utilities over duplicated inline logic.
- Avoid committing secrets or environment-specific values.
