---
id: rtm
title: Requirements Traceability Matrix
type: document
tags: [qa-document, traceability, rtm, requirements, coverage]
version: 1.0
---

## Intent
Generate a practical Requirements Traceability Matrix (RTM) that links atomic requirement items to proposed validation coverage.

This artifact is a QA planning and auditability document. It is not a full test case suite. It should help a QA lead answer:
- What exactly are the testable requirement items?
- Which items appear covered, partially covered, or missing coverage?
- What validation conditions should exist for each item?

## Output Expectations
- The RTM must be structured, concise, and review-friendly.
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

## Trace Row Design
Each trace row should:
- Point to exactly one `requirementId`
- State the current coverage status:
  - `covered` when validation intent is clear
  - `partial` when only some expected validation is defined
  - `missing` when no credible validation path is currently defined
  - `not-applicable` only when the item is informational and not meaningfully testable
- Include one or more proposed validation conditions
- Include a plausible `testLevel`
- Include placeholder test references when exact tests do not exist yet (for example `TBD-TC-001`)

## Quality Rules
- Do not treat entire paragraphs as one requirement item if they contain multiple testable statements.
- Do not mark vague requirements as `covered` just to make the matrix look complete.
- Prefer `partial` or `missing` when confidence is low.
- Keep acceptance notes and trace notes short and specific.
- When clarifications materially add information, mark the requirement source accordingly.

## Recommended RTM Style
- The document should feel like a QA-owned planning artifact, not a verbose business summary.
- Requirement text should stay close to the original wording but be normalized into testable form.
- Proposed test conditions should be concrete enough that a tester could later derive test cases from them.
- Risks should focus on traceability gaps, ambiguity, and likely verification blind spots.
