## Project Overview
<!-- 
This is the highest-value section that creates context for Claude. In this section, you should explain in plain language:

• What the product is
• Who it is for
• What the app is trying to optimize for
• Most important business or UX constraints
-->

## Tech Stack
<!--
Example:
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod for forms
- Supabase for auth and data
- Vitest for unit tests

Do not introduce:
- Redux
- styled-components
- Material UI
unless explicitly requested.
-->

## Architecture
<!--
How the repo is organized.

Describe:

• major directories
• responsibilities of each area
• data flow
• separation of concerns
• where new code should go
-->

## Coding Conventions
<!--
Second most important section in the whole file as it has a direct impact on the quality of code output produced by Claude. It defines whether the code is readable and clear for anyone who will read it.

Include anything that impacts day-to-day code generation:

• naming conventions
• component patterns
• typing standards
• file size preferences
• import conventions
• error handling
• comments
• async patterns

Example:
- Use TypeScript strictly; avoid `any`
- Prefer functional components
- Prefer named exports for shared modules
- Use async/await instead of chained promises
- Keep components focused and composable
- Extract repeated logic into hooks or helpers
- Prefer descriptive variable names over abbreviations
- Add comments only when intent is non-obvious
- Do not leave dead code or commented-out blocks
-->

## UI and Design Rules
<!--
Define:

• visual style
• spacing philosophy
• typography approach
• interaction patterns
• responsiveness
• accessibility expectations
• component usage rules

Example:
- Use shadcn/ui primitives as the default foundation
- Prefer spacious layouts and strong visual hierarchy
- Use restrained color usage; rely on typography, spacing, and contrast
- Prefer 8px spacing rhythm
- Buttons should have clear primary/secondary hierarchy
- Forms should be short, scannable, and mobile-friendly
- Every interactive element must have visible hover, focus, and disabled states
- Meet accessibility expectations for contrast, labels, and keyboard navigation
-->


## Content Guidance
<!--
State how copy should sound:

• concise or detailed
• technical or plain language
• aspirational or practical
• sentence length
• headline style
• forbidden patterns

Example:
- Use concise, confident language
- Avoid hype and empty marketing phrases
- Headlines should be clear before clever
- Body copy should focus on user outcomes
- Prefer short paragraphs and scannable structure
- Avoid jargon unless the audience clearly expects it
-->

## Testing and Quality
<!--
Define:

• what tests to add
• when tests are required
• lint/typecheck expectations
• what “done” means

Example: 
Before considering a task complete:
- run typecheck
- run lint
- run relevant tests for modified logic

Testing rules:
- add unit tests for reusable logic
- do not add heavy test scaffolding for simple presentational sections
- ensure responsive behavior for UI changes
- verify empty, loading, and error states where relevant
-->

## File Placement Rules
<!--
Stops repo drift. Especially useful in mature repos where duplicate components become a problem fast.

You need to define rules for:

• where to create new files
• when to edit existing files
• when to create abstractions
• naming patterns

Example: 
- Add new landing-page sections to `components/marketing/sections`
- Add reusable primitives to `components/ui`
- Put shared helpers in `lib`
- Do not create a new abstraction for one-off usage
- Prefer editing existing components over creating near-duplicates
-->

## Safety Rules
<!--
Valuable for real projects. Its a good idea to tell Claude what it should avoid changing casually. It reduces “technically smart but operationally risky” edits that will lead to pricy refactoring.

Example:
- Do not rename public API routes unless explicitly requested
- Do not change database schema without calling it out clearly
- Do not modify auth flows unless the task requires it
- Preserve backward compatibility for shared components
- Flag major architectural changes before implementing them
-->

## Commands
<!--
Anthropic recommends giving Claude concrete project context, and commands are part of that operational context.

Add the actual commands Claude should use (like install, dev, build, lint, test, format, storybook (if relevant), SQL database commands if safe)

Example:
- Install: `pnpm install`
- Dev: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Test: `pnpm test`
-->