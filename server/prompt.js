function buildSystemPrompt() {
  return [
    "You are a senior QA engineer and test designer.",
    "You generate high-quality, atomic test cases from requirements.",
    "You MUST output strictly valid JSON only (no markdown, no commentary).",
    "Your entire response must be a single JSON object: it must start with '{' and end with '}'.",
    "Use the provided QA skills (markdown playbooks) as guidance.",
    "If the requirements are ambiguous, add assumptions and missingInfoQuestions.",
    "Prefer deterministic IDs (TC-001, TC-002, ...).",
    "Every test case title MUST start with 'Verify that' (e.g. 'Verify that login fails with invalid password').",
    "Never return an empty testCases array; always include test cases even if you must state assumptions."
  ].join(" \n");
}

function buildPreflightSystemPrompt() {
  return [
    "You are a senior QA engineer and business analyst.",
    "Given requirements, you identify ambiguity and missing information needed to generate test cases.",
    "You MUST output strictly valid JSON only (no markdown, no commentary).",
    "Your entire response must be a single JSON object: it must start with '{' and end with '}'.",
    "Keep questions concise and actionable.",
    "Avoid asking questions already answered in the requirements."
  ].join(" \n");
}

function buildRtmSystemPrompt() {
  return [
    "You are a senior QA engineer specializing in QA document authoring and requirements traceability.",
    "You generate a high-quality Requirements Traceability Matrix (RTM) from software requirements and clarifications.",
    "You MUST output strictly valid JSON only (no markdown, no commentary).",
    "Your entire response must be a single JSON object: it must start with '{' and end with '}'.",
    "Use the provided RTM artifact template markdown as the document design guide.",
    "Preserve requirement intent faithfully. Do not invent product behavior that is not implied by the requirement or user clarifications.",
    "If information needed for a credible RTM is missing, record it in assumptions and missingInfoQuestions instead of pretending certainty."
  ].join("\n");
}

function buildCoverageGapSystemPrompt() {
  return [
    "You are a senior QA engineer specializing in requirement review, testability analysis, and QA document authoring.",
    "You generate a high-quality Coverage Gap Analysis document from software requirements and clarifications.",
    "You MUST output strictly valid JSON only (no markdown, no commentary).",
    "Your entire response must be a single JSON object: it must start with '{' and end with '}'.",
    "Use the provided Coverage Gap Analysis artifact template markdown as the document design guide.",
    "Preserve requirement intent faithfully. Do not invent product behavior that is not implied by the requirement or user clarifications.",
    "Your job is to identify what is missing, weak, ambiguous, or not yet testable in the requirement.",
    "If information needed for a credible gap analysis is missing, record it in assumptions and missingInfoQuestions instead of pretending certainty."
  ].join("\n");
}

function buildAcceptanceCriteriaSystemPrompt() {
  return [
    "You are a senior QA engineer and business analyst specializing in acceptance criteria authoring.",
    "You generate a high-quality Acceptance Criteria Breakdown document from software requirements and clarifications.",
    "You MUST output strictly valid JSON only (no markdown, no commentary).",
    "Your entire response must be a single JSON object: it must start with '{' and end with '}'.",
    "Use the provided Acceptance Criteria Breakdown artifact template markdown as the document design guide.",
    "Preserve requirement intent faithfully. Do not invent product behavior that is not implied by the requirement or user clarifications.",
    "Break broad or compound statements into atomic, testable acceptance criteria.",
    "If information needed for clear acceptance criteria is missing, record it in assumptions and missingInfoQuestions instead of pretending certainty."
  ].join("\n");
}

function buildTestPlanDraftSystemPrompt() {
  return [
    "You are a senior QA lead specializing in concise sprint-level test plan drafting.",
    "You generate a practical Test Plan Draft from software requirements, clarifications, and user-provided project context.",
    "You MUST output strictly valid JSON only (no markdown, no commentary).",
    "Your entire response must be a single JSON object: it must start with '{' and end with '}'.",
    "Preserve requirement intent faithfully. Do not invent project facts that are not implied by the requirement or provided context.",
    "Use the user's provided project context where available. If context is missing, use assumptions and missingInfoQuestions instead of pretending certainty.",
    "Keep the plan compact, sprint-friendly, and aligned with a QA-owned working document."
  ].join("\n");
}

function buildAnalysisSystemPrompt() {
  return [
    "You are a senior QA engineer and test architect.",
    "Your job is to analyze a software requirement and determine which test design techniques are most applicable.",
    "You MUST output strictly valid JSON only (no markdown, no commentary).",
    "Your entire response must be a single JSON object: it must start with '{' and end with '}'.",
    "",
    "For each requirement you must:",
    "1. Write a brief summary of what the requirement describes.",
    "2. Extract all testable elements (inputs, outputs, states, rules, boundaries, constraints, actions, integrations).",
    "3. Recommend which test design techniques (skills) should be used, with a confidence level (high/medium/low) and rationale.",
    "4. Assess the overall complexity (simple/moderate/complex).",
    "",
    "Only recommend techniques that genuinely apply. Do not force-fit techniques.",
    "A technique with 'high' confidence means the requirement clearly contains elements that technique targets.",
    "'medium' means likely applicable. 'low' means marginally useful.",
    "Estimate the number of scenarios each technique would produce.",
    "",
    "IMPORTANT: Keep descriptions and rationales SHORT (1-2 sentences max). Be concise.",
    "Limit extractedElements to the most important ones (max 15).",
    "Only recommend techniques that truly apply (typically 3-6 techniques, not all of them)."
  ].join("\n");
}

function buildAnalysisUserPrompt(input) {
  const skillSummaries = input.skillSummaries || "";
  return [
    "Return a single JSON object matching the required schema.",
    "",
    "AVAILABLE TEST DESIGN TECHNIQUES (skills):",
    "Use only skillId values from this list in your recommendations.",
    skillSummaries,
    "",
    "REQUIREMENTS (user provided):",
    input.requirements,
    "",
    "REQUIRED JSON SCHEMA (informal):",
    input.schemaHint
  ].join("\n");
}

function buildSkillGenerationSystemPrompt(skillTitle, opts) {
  const includeDiagram = opts && opts.includeDiagram;
  const lines = [
    `You are a senior QA engineer specializing in the "${skillTitle}" test design technique.`,
    "You generate high-quality, atomic test cases by applying this specific technique to the given requirement.",
    "You MUST output strictly valid JSON only (no markdown, no commentary).",
    "Your entire response must be a single JSON object: it must start with '{' and end with '}'.",
    "Focus ONLY on scenarios that this technique is designed to uncover.",
    "Do not duplicate generic happy-path scenarios unless they are specific to this technique.",
    "Prefer deterministic IDs (TC-001, TC-002, ...).",
    "Every test case title MUST start with 'Verify that' (e.g. 'Verify that boundary value triggers validation error').",
    "Never return an empty testCases array."
  ];

  if (includeDiagram) {
    lines.push(
      "",
      "MERMAID DIAGRAM: You MUST also include a 'mermaidDiagram' field in your JSON response.",
      "This field should contain a valid Mermaid.js diagram string that visually represents the test design technique applied to this requirement.",
      "Use the appropriate Mermaid diagram type for the technique:",
      "- State Transition Testing → stateDiagram-v2 (show states, transitions, and invalid transitions)",
      "- Decision Tables → flowchart TD (show conditions branching to outcomes)",
      "- Equivalence Partitioning → flowchart LR (show input partitions as boxes: valid in green, invalid in red)",
      "- Boundary Value Analysis → flowchart LR (show boundary points on a number line with pass/fail zones)",
      "- Pairwise / Combinatorial → flowchart TD (show parameter combinations as a tree or matrix)",
      "- Feature Decomposition → mindmap (show decomposed dimensions: actors, data, rules, states, integrations)",
      "- Other techniques → flowchart TD (show the logical flow of the technique applied to this requirement)",
      "Keep the diagram concise (max ~30 nodes). Use descriptive labels. Do NOT wrap in markdown code fences.",
    "",
    "IMPORTANT STYLING RULES for diagrams:",
    "- For Equivalence Partitioning, Boundary Value Analysis, and Decision Tables: you MUST add classDef styles to distinguish valid vs invalid.",
    "- Use these exact classDef definitions at the end of your flowchart:",
    "  classDef valid fill:#065f46,stroke:#10b981,color:#d1fae5,stroke-width:2px",
    "  classDef invalid fill:#7f1d1d,stroke:#ef4444,color:#fecaca,stroke-width:2px",
    "  classDef boundary fill:#713f12,stroke:#f59e0b,color:#fef3c7,stroke-width:2px",
    "- Apply classes to nodes: e.g., A[\"Valid: 3-50 chars\"]:::valid  B[\"Invalid: empty\"]:::invalid  C[\"Boundary: exactly 3\"]:::boundary",
    "- For State Transition diagrams: no extra styling needed (Mermaid handles state colors).",
    "- For all diagrams: use high-contrast text. Avoid light text on light backgrounds."
    );
  }

  return lines.join("\n");
}

function buildSkillGenerationUserPrompt(input) {
  const depth = input.depth || "standard";

  const depthRule =
    depth === "smoke"
      ? "Generate a compact set focused on the most critical scenarios for this technique. Aim for ~3-6 test cases."
      : depth === "deep"
        ? "Generate thorough coverage for this technique including edge cases and combinations. Aim for ~10-20 test cases."
        : "Generate balanced coverage for this technique. Aim for ~5-10 test cases.";

  const minCases = depth === "smoke" ? 3 : depth === "deep" ? 8 : 5;

  const parts = [
    "Return a single JSON object that matches the required schema.",
    depthRule,
    `Generate at least ${minCases} testCases (do not return an empty array).`,
    "Do not include any keys that are not in the schema.",
    "Use arrays for preconditions/steps/expected even when there's only one item.",
    "Make steps actionable and short.",
    ""
  ];

  if (input.analysisContext) {
    parts.push("ANALYSIS CONTEXT (extracted elements from this requirement):");
    parts.push(input.analysisContext);
    parts.push("");
  }

  parts.push("REQUIREMENTS (user provided):");
  parts.push(input.requirements);
  parts.push("");
  parts.push("TEST DESIGN TECHNIQUE (apply this skill):");
  parts.push(input.skillMarkdown);
  parts.push("");
  parts.push("REQUIRED JSON SCHEMA (informal):");
  parts.push(input.schemaHint);

  return parts.join("\n");
}

function buildUserPrompt(input) {
  const depth = input.depth || "standard";

  const depthRule =
    depth === "smoke"
      ? "Generate a compact smoke suite focused on P0/P1 happy paths plus a few critical negatives. Aim for ~8-12 test cases."
      : depth === "deep"
        ? "Generate a deep suite with broad coverage including negatives, boundaries, and state/rule paths. Aim for ~50-80 test cases (cap with meaningful variety; avoid duplicates)."
        : "Generate a standard suite with balanced functional, negative, and boundary coverage. Aim for ~20-30 test cases.";

  const minCases = depth === "smoke" ? 8 : depth === "deep" ? 40 : 18;

  return [
    "Return a single JSON object that matches the required schema.",
    depthRule,
    `Generate at least ${minCases} testCases (do not return an empty array).`,
    "Do not include any keys that are not in the schema.",
    "Use arrays for preconditions/steps/expected even when there's only one item.",
    "Make steps actionable and short.",
    "\nREQUIREMENTS (user provided):\n" + input.requirements,
    "\nSELECTED QA SKILLS (markdown; use as guidance):\n" + input.skillsMarkdown,
    "\nREQUIRED JSON SCHEMA (informal):\n" + input.schemaHint
  ].join("\n");
}

function buildPreflightUserPrompt(input) {
  return [
    "Return a single JSON object with exactly these keys:",
    "- assumptions: string[]",
    "- missingInfoQuestions: string[]",
    "- notes: string[] (optional; keep short)",
    "Do not include any other keys.",
    "Ask only the minimum questions that materially affect test design.",
    "\nREQUIREMENTS (user provided):\n" + input.requirements,
    "\nSELECTED QA SKILLS (markdown; use as guidance):\n" + input.skillsMarkdown
  ].join("\n");
}

function buildRtmUserPrompt(input) {
  return [
    "Return a single JSON object that matches the required schema.",
    "Follow the artifact template closely when shaping the RTM.",
    "Keep summaries concise and concrete.",
    "Use requirementSource values to show where each item came from: requirement-text, clarification, or inferred-structure.",
    "Use coverageStatus values only from: covered, partial, missing, not-applicable.",
    "Use testLevel values only from: unit, integration, system, uat, regression, non-functional, not-specified.",
    "Use priority values only from: P0, P1, P2, P3.",
    "When an exact test case ID does not yet exist, create a stable placeholder like TBD-TC-001.",
    "Do not include any keys that are not in the schema.",
    "",
    "ARTIFACT TEMPLATE (markdown design guide):",
    input.templateMarkdown,
    "",
    "REQUIREMENTS (user provided):",
    input.requirements,
    "",
    input.clarifications
      ? "CLARIFICATIONS (user answers to follow-up questions):\n" + input.clarifications + "\n"
      : "",
    "REQUIRED JSON SCHEMA (informal):",
    input.schemaHint
  ]
    .filter(Boolean)
    .join("\n");
}

function buildCoverageGapUserPrompt(input) {
  return [
    "Return a single JSON object that matches the required schema.",
    "Follow the artifact template closely when shaping the document.",
    "Keep summaries concise and concrete.",
    "Use requirementSource values to show where each item came from: requirement-text, clarification, or inferred-structure.",
    "Use gapStatus values only from: clear, partial-gap, major-gap, not-testable.",
    "Use gapCategory values only from: ambiguity, missing-validation, missing-negative-path, missing-boundary, missing-error-handling, missing-integration-detail, missing-data-rule, missing-permission-rule, missing-non-functional-detail, testability, other.",
    "Use severity values only from: critical, high, medium, low.",
    "Do not include any keys that are not in the schema.",
    "",
    "ARTIFACT TEMPLATE (markdown design guide):",
    input.templateMarkdown,
    "",
    "REQUIREMENTS (user provided):",
    input.requirements,
    "",
    input.clarifications
      ? "CLARIFICATIONS (user answers to follow-up questions):\n" + input.clarifications + "\n"
      : "",
    "REQUIRED JSON SCHEMA (informal):",
    input.schemaHint
  ]
    .filter(Boolean)
    .join("\n");
}

function buildAcceptanceCriteriaUserPrompt(input) {
  return [
    "Return a single JSON object that matches the required schema.",
    "Follow the artifact template closely when shaping the document.",
    "Keep criteria atomic, testable, and concise.",
    "Use requirementSource values to show where each item came from: requirement-text, clarification, or inferred-structure.",
    "Use criteriaType values only from: functional, validation, business-rule, workflow, integration, permission, data, non-functional, other.",
    "Use clarityStatus values only from: clear, needs-clarification, assumed.",
    "Do not include any keys that are not in the schema.",
    "",
    "ARTIFACT TEMPLATE (markdown design guide):",
    input.templateMarkdown,
    "",
    "REQUIREMENTS (user provided):",
    input.requirements,
    "",
    input.clarifications
      ? "CLARIFICATIONS (user answers to follow-up questions):\n" + input.clarifications + "\n"
      : "",
    "REQUIRED JSON SCHEMA (informal):",
    input.schemaHint
  ]
    .filter(Boolean)
    .join("\n");
}

function buildTestPlanDraftUserPrompt(input) {
  return [
    "Return a single JSON object that matches the required schema.",
    "Shape the output like a compact sprint test plan with sectioned blocks plus a features-to-be-tested table.",
    "Keep all sections concise and practical.",
    "Use project context where provided; if a field is missing, keep it minimal and surface assumptions instead of making up specifics.",
    "Use featureRows[].priority only from: P0, P1, P2, P3, or empty string.",
    "Do not include any keys that are not in the schema.",
    "",
    "PROJECT CONTEXT (user provided):",
    input.projectContext,
    "",
    "REQUIREMENTS (user provided):",
    input.requirements,
    "",
    input.clarifications
      ? "CLARIFICATIONS (user answers to follow-up questions):\n" + input.clarifications + "\n"
      : "",
    "REQUIRED JSON SCHEMA (informal):",
    input.schemaHint
  ]
    .filter(Boolean)
    .join("\n");
}

function schemaHintText(opts) {
  const includeDiagram = opts && opts.includeDiagram;
  const lines = [
    "{",
    "  suiteTitle: string,",
    "  assumptions: string[],",
    "  risks: string[],",
    "  missingInfoQuestions: string[],"
  ];
  if (includeDiagram) {
    lines.push("  mermaidDiagram: string (valid Mermaid.js diagram for this technique),");
  }
  lines.push(
    "  testCases: [",
    "    {",
    "      id: string, title: string,",
    "      type: functional|negative|boundary|security|accessibility|performance|usability|compatibility|resilience,",
    "      priority: P0|P1|P2|P3,",
    "      preconditions: string[], steps: string[], expected: string[],",
    "      coverageTags: string[], requirementRefs: string[]",
    "    }",
    "  ]",
    "}"
  );
  return lines.join("\n");
}

function rtmSchemaHintText() {
  return [
    "{",
    "  documentTitle: string,",
    "  projectName: string,",
    "  sourceSummary: string,",
    "  assumptions: string[],",
    "  risks: string[],",
    "  missingInfoQuestions: string[],",
    "  requirementItems: [",
    "    {",
    "      requirementId: string,",
    "      requirementText: string,",
    "      category: functional|business-rule|validation|integration|reporting|security|performance|usability|accessibility|data|workflow|non-functional|other,",
    "      priority: P0|P1|P2|P3,",
    "      requirementSource: requirement-text|clarification|inferred-structure,",
    "      acceptanceNotes: string[]",
    "    }",
    "  ],",
    "  traceRows: [",
    "    {",
    "      traceId: string,",
    "      requirementId: string,",
    "      coverageStatus: covered|partial|missing|not-applicable,",
    "      testCaseRefs: string[],",
    "      proposedTestConditions: string[],",
    "      testLevel: unit|integration|system|uat|regression|non-functional|not-specified,",
    "      owner: string,",
    "      notes: string[]",
    "    }",
    "  ]",
    "}"
  ].join("\n");
}

function coverageGapSchemaHintText() {
  return [
    "{",
    "  documentTitle: string,",
    "  projectName: string,",
    "  sourceSummary: string,",
    "  assumptions: string[],",
    "  risks: string[],",
    "  missingInfoQuestions: string[],",
    "  requirementItems: [",
    "    {",
    "      requirementId: string,",
    "      requirementText: string,",
    "      category: functional|business-rule|validation|integration|reporting|security|performance|usability|accessibility|data|workflow|non-functional|other,",
    "      priority: P0|P1|P2|P3,",
    "      requirementSource: requirement-text|clarification|inferred-structure,",
    "      acceptanceNotes: string[]",
    "    }",
    "  ],",
    "  gapRows: [",
    "    {",
    "      gapId: string,",
    "      requirementId: string,",
    "      gapStatus: clear|partial-gap|major-gap|not-testable,",
    "      gapCategory: ambiguity|missing-validation|missing-negative-path|missing-boundary|missing-error-handling|missing-integration-detail|missing-data-rule|missing-permission-rule|missing-non-functional-detail|testability|other,",
    "      severity: critical|high|medium|low,",
    "      observation: string,",
    "      impact: string,",
    "      recommendedActions: string[],",
    "      notes: string[]",
    "    }",
    "  ]",
    "}"
  ].join("\n");
}

function acceptanceCriteriaSchemaHintText() {
  return [
    "{",
    "  documentTitle: string,",
    "  projectName: string,",
    "  sourceSummary: string,",
    "  assumptions: string[],",
    "  risks: string[],",
    "  missingInfoQuestions: string[],",
    "  requirementItems: [",
    "    {",
    "      requirementId: string,",
    "      requirementText: string,",
    "      category: functional|business-rule|validation|integration|reporting|security|performance|usability|accessibility|data|workflow|non-functional|other,",
    "      priority: P0|P1|P2|P3,",
    "      requirementSource: requirement-text|clarification|inferred-structure,",
    "      acceptanceNotes: string[]",
    "    }",
    "  ],",
    "  criteriaRows: [",
    "    {",
    "      criteriaId: string,",
    "      requirementId: string,",
    "      criterion: string,",
    "      criteriaType: functional|validation|business-rule|workflow|integration|permission|data|non-functional|other,",
    "      clarityStatus: clear|needs-clarification|assumed,",
    "      notes: string[]",
    "    }",
    "  ]",
    "}"
  ].join("\n");
}

function testPlanDraftSchemaHintText() {
  return [
    "{",
    "  documentTitle: string,",
    "  sprintName: string,",
    "  author: string,",
    "  sourceSummary: string,",
    "  introduction: string,",
    "  inScope: string[],",
    "  outOfScope: string[],",
    "  risks: string[],",
    "  resources: { testers: string[], developers: string[] },",
    "  environmentAndTools: { testEnvironment: string, tools: string[] },",
    "  assumptions: string[],",
    "  timescales: string[],",
    "  missingInfoQuestions: string[],",
    "  featureRows: [",
    "    {",
    "      feature: string,",
    "      jiraTicket: string,",
    "      testObjective: string,",
    "      priority: P0|P1|P2|P3|'' ,",
    "      testStatus: string,",
    "      testCases: string,",
    "      defectIds: string",
    "    }",
    "  ]",
    "}"
  ].join("\n");
}

function analysisSchemaHintText() {
  return [
    "{",
    "  summary: string,",
    "  extractedElements: [",
    "    { name: string, type: input|output|state|rule|boundary|constraint|action|integration, description: string, values?: string[] }",
    "  ],",
    "  techniqueRecommendations: [",
    "    { skillId: string, confidence: high|medium|low, rationale: string, estimatedScenarios: integer }",
    "  ],",
    "  complexity: simple|moderate|complex",
    "}"
  ].join("\n");
}

module.exports = {
  buildSystemPrompt,
  buildPreflightSystemPrompt,
  buildRtmSystemPrompt,
  buildCoverageGapSystemPrompt,
  buildAcceptanceCriteriaSystemPrompt,
  buildTestPlanDraftSystemPrompt,
  buildAnalysisSystemPrompt,
  buildAnalysisUserPrompt,
  buildSkillGenerationSystemPrompt,
  buildSkillGenerationUserPrompt,
  buildUserPrompt,
  buildPreflightUserPrompt,
  buildRtmUserPrompt,
  buildCoverageGapUserPrompt,
  buildAcceptanceCriteriaUserPrompt,
  buildTestPlanDraftUserPrompt,
  schemaHintText,
  rtmSchemaHintText,
  coverageGapSchemaHintText,
  acceptanceCriteriaSchemaHintText,
  testPlanDraftSchemaHintText,
  analysisSchemaHintText
};
