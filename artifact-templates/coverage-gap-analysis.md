---
id: coverage-gap-analysis
title: Coverage Gap Analysis
type: document
tags: [qa-document, coverage, gap-analysis, requirements, testability]
version: 1.0
---

## Intent
Generate a practical Coverage Gap Analysis document from software requirements and clarifications.

This artifact is a QA review and planning document. It should help a QA lead answer:
- Which requirement items are clear and testable as written?
- Which items have missing validation details, edge cases, or failure-path expectations?
- What follow-up actions are needed before coverage can be considered credible?

## Output Expectations
- The document must be structured, concise, and review-friendly.
- Split compound requirements into atomic requirement items when needed.
- Preserve original meaning; do not invent product behavior beyond the requirement text and user clarifications.
- If the source requirement is weak or ambiguous, surface that through assumptions, risks, and missing information questions.

## Requirement Item Design
Each requirement item should:
- Be individually testable
- Describe one behavior, rule, validation, workflow step, integration, or non-functional expectation
- Use a stable generated ID (`REQ-001`, `REQ-002`, ...)
- Capture a realistic QA priority (`P0` to `P3`)

Prefer atomicity over long merged statements.

## Gap Row Design
Each gap row should:
- Point to exactly one `requirementId`
- State the current gap status:
  - `clear` when the item is testable as written with no major gap
  - `partial-gap` when some test intent exists but important detail is missing
  - `major-gap` when the item is too incomplete, ambiguous, or weak for credible coverage
  - `not-testable` only when the item is informational or not meaningfully verifiable as written
- Identify one primary gap category
- Include a short observation, likely impact, and one or more recommended QA follow-up actions

## Quality Rules
- Do not treat entire paragraphs as one requirement item if they contain multiple testable statements.
- Do not mark weak or vague requirements as `clear` just to make the document look healthy.
- Prefer `partial-gap` or `major-gap` when confidence is low.
- Keep observations and recommendations short and specific.
- Focus on coverage blind spots such as missing validations, boundary rules, negative paths, error handling, integrations, permissions, data expectations, and non-functional expectations.

## Recommended Style
- The document should feel like a QA-owned review artifact, not a business rewrite.
- Requirement text should stay close to the original wording but be normalized into testable form.
- Recommendations should be concrete enough that a BA, PM, or QA engineer could act on them immediately.
