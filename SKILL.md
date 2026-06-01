---
name: design-system-b2b-saas-with-clerk
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# B2B SaaS with Clerk

## Mission
Deliver implementation-ready design-system guidance for B2B SaaS with Clerk that can be applied consistently across marketing site interfaces.

## Brand
- Product/brand: B2B SaaS with Clerk
- URL: https://clerk.com/organizations?utm_source=google&utm_medium=cpc&utm_campaign=SC_Google_Search_Authentication_India&utm_adgroup=Authentication_Competitor&utm_term=&gad_source=1&gad_campaignid=23464517501&gbraid=0AAAAAqJUiX7lAJP1ZCLYlfbcNhiJ7GrfE&gclid=Cj0KCQjwlerQBhDMARIsAB16H-XauGLkgHr67XexMtfslnCdBf_hNTHzYRHmCx__DtsyoEuLoN6kORIaAq2vEALw_wcB
- Audience: developers and technical teams
- Product surface: marketing site

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=geistNumbers`, `font.family.stack=geistNumbers, suisse, suisse Fallback`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=24px`
- Typography scale: `font.size.xs=10.72px`, `font.size.sm=11px`, `font.size.md=11.58px`, `font.size.lg=12px`, `font.size.xl=13px`, `font.size.2xl=14px`, `font.size.3xl=15px`, `font.size.4xl=16px`
- Color palette: `color.surface.base=#000000`, `color.text.secondary=#131316`, `color.text.tertiary=#ffffff`, `color.text.inverse=#5e5f6e`, `color.surface.raised=#6c47ff`, `color.surface.strong=#212126`, `color.border.default=#d9d9de`, `color.border.strong=oklab(0.188081 0.0016512 -0.00579907 / 0.1)`
- Spacing scale: `space.1=2px`, `space.2=4px`, `space.3=5px`, `space.4=6px`, `space.5=8px`, `space.6=10px`, `space.7=12px`, `space.8=16px`
- Radius/shadow/motion tokens: `radius.xs=6px`, `radius.sm=8px`, `radius.md=22px`, `radius.lg=26843500px` | `shadow.1=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgb(108, 71, 255) 0px 0px 0px 1px, oklab(0.999994 0.0000455678 0.0000200868 / 0.07) 0px 1px 0px 0px inset, oklab(0.249859 0.00254738 -0.00901626 / 0.2) 0px 1px 3px 0px`, `shadow.2=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklab(0.999994 0.0000455678 0.0000200868 / 0.1) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0) 0px 0px 0px 0px`, `shadow.3=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgb(66, 67, 77) 0px 0px 0px 1px, oklab(0.999994 0.0000455678 0.0000200868 / 0.07) 0px 1px 0px 0px inset, oklab(0.249859 0.00254738 -0.00901626 / 0.2) 0px 1px 3px 0px`, `shadow.4=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklab(0 0 0 / 0.08) 0px 2px 3px -1px, oklab(0.188081 0.0016512 -0.00579907 / 0.18) 0px 0px 0px 0.5px, oklab(0.999994 0.0000455678 0.0000200868 / 0.1) 0px 1px 0px 0px inset` | `motion.duration.instant=150ms`, `motion.duration.fast=300ms`, `motion.duration.normal=450ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
