---
id: acceptance-criteria-breakdown
title: Acceptance Criteria Breakdown
type: document
tags: [qa-document, acceptance-criteria, requirements, testability]
version: 1.0
---

## Intent
Generate a practical Acceptance Criteria Breakdown from software requirements and clarifications.

This artifact should help a QA lead, BA, or product owner answer:
- What are the atomic, testable acceptance criteria hidden inside the requirement text?
- Which criteria are functional expectations versus validations, permissions, integrations, or non-functional expectations?
- Which criteria are clear, and which still need clarification before sign-off?

## Output Expectations
- The document must be structured, concise, and review-friendly.
- Split compound requirement statements into atomic acceptance criteria when needed.
- Preserve original meaning; do not invent product behavior beyond the requirement text and user clarifications.
- If information is missing, surface that through assumptions and missing information questions instead of pretending certainty.

## Requirement Item Design
Each requirement item should:
- Be individually testable
- Describe one behavior, rule, validation, workflow step, integration, or non-functional expectation
- Use a stable generated ID (`REQ-001`, `REQ-002`, ...)
- Capture a realistic QA priority (`P0` to `P3`)

## Acceptance Criteria Design
Each acceptance criteria row should:
- Point to exactly one `requirementId`
- Use a stable generated criteria ID (`AC-001`, `AC-002`, ...)
- Be atomic and verifiable
- State a short acceptance criterion in tester-friendly language
- Include a criteria type
- Include a clarity status
- Add short notes only when needed

## Quality Rules
- Do not treat entire paragraphs as one acceptance criterion if they contain multiple testable statements.
- Prefer explicit, testable wording over vague summaries.
- Do not label weak or missing expectations as clear when they need clarification.
- Keep notes short and specific.

## Recommended Style
- The document should feel like a QA-ready acceptance checklist, not a business summary.
- Acceptance criteria should be concrete enough that a tester could derive scenarios directly from them.
