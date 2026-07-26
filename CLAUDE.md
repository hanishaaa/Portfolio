# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server on port 5173
npm run build    # tsc --noEmit (strict) then vite build
npm run preview  # serve the production build
npx tsc --noEmit # typecheck alone, without bundling
```

There is no test runner, linter, or formatter configured. `npm run build` is the only
correctness gate — it fails on any TypeScript error before Vite runs.

## Architecture

A single-page portfolio site for Hanisha Mendu (Data Scientist / ML Engineer). No router,
no backend, no data fetching. `main.tsx` mounts `App` and that is the whole app.

**Everything lives in `src/App.tsx` (~1280 lines).** All section components — Hero,
Projects, Experience, Education, Skills, Contact, plus `MessageModal` and the shared
primitives (`Section`, `StatCard`, `BlockLabel`) — are defined in that one file. Content is hardcoded as arrays
inside each component; editing the site means editing those arrays, not a CMS or data file.

Contact details and the CV filename are module-level constants at the top of `App.tsx`
(`RESUME_FILE`, `EMAIL`, `LINKEDIN`, `GITHUB`) — change them there, not at each use site.

### Content must match the CV

`public/Hanisha_Mendu_Data_Scientist.pdf` is the source of truth for every factual claim on
the page: projects, metrics, dates, skills, certifications. The site previously shipped
with invented template content (a churn model, a recommender, fake testimonials) and that
was removed deliberately. **Do not add project claims, metrics, or credentials that aren't
in the CV.**

Project cards support an optional `repo` field; when present the card renders a "View code"
link. Repos don't exist yet — add URLs there when they do.

### Adding a section

Nav links are anchor jumps to each `Section`'s `id`. Adding a section means editing two
hand-maintained lists: the `<main>` render list in `App` and the `links` array in `Navbar`
(which feeds both the desktop row and the mobile dropdown).

### Hero animation

The hero's right panel cycles through a 5-step ML lifecycle on a 3.2s `setInterval`.
`StepVisual` switches on `stepIndex` and hand-draws each step from animated `<div>`s —
there is no illustration library or SVG asset. The `HERO_STEPS` array and the
`if (stepIndex === N)` branches in `StepVisual` are positionally coupled; changing one
requires changing the other.

It is illustrative of the discipline, not a claim about work Hanisha has shipped — keep the
caption ("How I approach an end-to-end problem") framed that way.

## Motion and accessibility

`App` wraps everything in `<MotionConfig reducedMotion="user">`, so Framer Motion drops
transform/layout animations for users who ask for reduced motion. `Hero` additionally
checks `useReducedMotion()` and skips the auto-advance interval — the step dots are real
`<button>`s so the panel stays navigable. `src/index.css` has a matching CSS media query
that also disables `scroll-behavior: smooth`. Preserve all three when adding animation.

## Styling conventions

Tailwind with a dark slate base. Shared classes are defined once in `src/index.css` via
`@apply` and reused everywhere — prefer them over re-spelling the utility chains:

- `.glass-panel` — the card treatment used by nearly every block
- `.section-container`, `.btn-primary`, `.btn-ghost`, `.gradient-ring`, `.hero-grid`
- `.field-input`, `.field-label` — form controls in the message modal

**Keep these inside `@layer components`.** As bare rules after `@tailwind utilities` they
win on source order, so `.btn-primary`'s `display: inline-flex` silently beat `hidden` and
`md:inline-flex` on the same element — a real bug that hid nothing on mobile. The `@layer`
wrapper puts them before the utilities layer where they belong.

The `brand-*` color scale (cyan, `tailwind.config.cjs`) plus `shadow-glow` are the accent
system; `emerald-*` marks "after"/success states in the pipeline visuals.

Entrance animations follow a consistent Framer Motion idiom: `initial` offset →
`whileInView` with `viewport={{ once: true }}` → spring transition, staggered by
`delay: index * 0.06`. Match this when adding sections.

## Two contact paths, deliberately different

The navbar's "Let's talk" opens `MessageModal` — an on-page form posting to Formspree. The
Contact section hands over email / LinkedIn / CV for people who prefer their own client.
They used to both jump to `#contact`, which is why they were split. Don't re-merge them.

`FORMSPREE_ID` at the top of `App.tsx` gates the modal: if it is ever emptied the form is
replaced by an email fallback rather than rendering a send button that cannot work. The
success and error states both surface the email address too, because a form service
failing silently (spam-filtered, over quota) is the failure mode that costs a job lead.
The ID is a public identifier that ships in the bundle by design — it is not a secret, but
it does mean the free tier's 50 submissions/month is the ceiling.

## Open items

- No GitHub repos are linked yet; project cards render without a "View code" link until
  `repo` URLs are filled in
- No analytics is wired up (a no-op `trackEvent` stub was removed rather than left dangling)
- The CV PDF states the Wipro role ended Aug 2024; the site says "Present" at Hanisha's
  explicit request. If the PDF is updated, keep `Experience` in sync

The CV is served from `public/` and referenced by the `RESUME_FILE` constant. The two must
be kept in sync manually — renaming the PDF silently 404s the download button.
