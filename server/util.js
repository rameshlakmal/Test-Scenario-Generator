function clampNumber(n, min, max) {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function truncateText(text, maxLen) {
  const s = String(text ?? "");
  const max = Number.isFinite(maxLen) ? maxLen : 1200;
  if (s.length <= max) return s;
  return s.slice(0, Math.max(0, max - 12)) + "... (truncated)";
}

function coerceString(v) {
  return String(v ?? "");
}

function normalizeStringArray(arr, opts) {
  const options = opts || {};
  const maxItems = Number.isFinite(options.maxItems) ? options.maxItems : 500;
  const maxLen = Number.isFinite(options.maxLen) ? options.maxLen : 500;

  const list = Array.isArray(arr) ? arr : [];
  const out = [];
  for (const it of list) {
    const s = coerceString(it).replace(/\r\n/g, "\n").trim();
    if (!s) continue;
    out.push(s.length > maxLen ? s.slice(0, maxLen) : s);
    if (out.length >= maxItems) break;
  }
  return out;
}

function normalizeSuiteCandidate(obj, opts) {
  const options = opts || {};
  const maxTestCases = Number.isFinite(options.maxTestCases) ? options.maxTestCases : 200;

  const suiteTitle = coerceString(obj && obj.suiteTitle).trim();
  const assumptions = normalizeStringArray(obj && obj.assumptions, { maxItems: 200, maxLen: 240 });
  const risks = normalizeStringArray(obj && obj.risks, { maxItems: 200, maxLen: 240 });
  const missingInfoQuestions = normalizeStringArray(obj && obj.missingInfoQuestions, { maxItems: 200, maxLen: 240 });

  const rawCases = Array.isArray(obj && obj.testCases) ? obj.testCases : [];
  const cases = [];
  for (const tc of rawCases) {
    const id = coerceString(tc && tc.id).trim();
    const title = coerceString(tc && tc.title).trim();
    const type = coerceString(tc && tc.type).trim();
    const priority = coerceString(tc && tc.priority).trim();

    const preconditions = normalizeStringArray(tc && tc.preconditions, { maxItems: 40, maxLen: 300 });
    const steps = normalizeStringArray(tc && tc.steps, { maxItems: 60, maxLen: 360 });
    const expected = normalizeStringArray(tc && tc.expected, { maxItems: 60, maxLen: 360 });
    const coverageTags = normalizeStringArray(tc && tc.coverageTags, { maxItems: 40, maxLen: 80 });
    const requirementRefs = normalizeStringArray(tc && tc.requirementRefs, { maxItems: 40, maxLen: 120 });

    cases.push({
      id,
      title,
      type,
      priority,
      preconditions,
      steps,
      expected,
      coverageTags,
      requirementRefs
    });

    if (cases.length >= maxTestCases) break;
  }

  const result = {
    suiteTitle,
    assumptions,
    risks,
    missingInfoQuestions,
    testCases: cases
  };

  // Preserve optional mermaidDiagram if the LLM returned one
  if (obj && typeof obj.mermaidDiagram === "string" && obj.mermaidDiagram.trim()) {
    result.mermaidDiagram = obj.mermaidDiagram.trim();
  }

  return result;
}

function normalizePreflightCandidate(obj) {
  return {
    assumptions: normalizeStringArray(obj && obj.assumptions, { maxItems: 200, maxLen: 240 }),
    missingInfoQuestions: normalizeStringArray(obj && obj.missingInfoQuestions, { maxItems: 200, maxLen: 240 }),
    ...(Array.isArray(obj && obj.notes)
      ? { notes: normalizeStringArray(obj && obj.notes, { maxItems: 200, maxLen: 240 }) }
      : {})
  };
}

function normalizeRtmCandidate(obj) {
  const documentTitle = coerceString(obj && obj.documentTitle).trim();
  const projectName = coerceString(obj && obj.projectName).trim();
  const sourceSummary = coerceString(obj && obj.sourceSummary).trim();
  const assumptions = normalizeStringArray(obj && obj.assumptions, { maxItems: 200, maxLen: 240 });
  const risks = normalizeStringArray(obj && obj.risks, { maxItems: 200, maxLen: 240 });
  const missingInfoQuestions = normalizeStringArray(obj && obj.missingInfoQuestions, { maxItems: 200, maxLen: 240 });

  const requirementItems = [];
  for (const item of Array.isArray(obj && obj.requirementItems) ? obj.requirementItems : []) {
    requirementItems.push({
      requirementId: coerceString(item && item.requirementId).trim(),
      requirementText: coerceString(item && item.requirementText).trim(),
      category: coerceString(item && item.category).trim(),
      priority: coerceString(item && item.priority).trim(),
      requirementSource: coerceString(item && item.requirementSource).trim(),
      acceptanceNotes: normalizeStringArray(item && item.acceptanceNotes, { maxItems: 20, maxLen: 240 })
    });
  }

  const traceRows = [];
  for (const row of Array.isArray(obj && obj.traceRows) ? obj.traceRows : []) {
    traceRows.push({
      traceId: coerceString(row && row.traceId).trim(),
      requirementId: coerceString(row && row.requirementId).trim(),
      coverageStatus: coerceString(row && row.coverageStatus).trim(),
      testCaseRefs: normalizeStringArray(row && row.testCaseRefs, { maxItems: 20, maxLen: 120 }),
      proposedTestConditions: normalizeStringArray(row && row.proposedTestConditions, { maxItems: 20, maxLen: 260 }),
      testLevel: coerceString(row && row.testLevel).trim(),
      owner: coerceString(row && row.owner).trim(),
      notes: normalizeStringArray(row && row.notes, { maxItems: 20, maxLen: 240 })
    });
  }

  return {
    documentTitle,
    projectName,
    sourceSummary,
    assumptions,
    risks,
    missingInfoQuestions,
    requirementItems,
    traceRows
  };
}

function normalizeCoverageGapCandidate(obj) {
  const documentTitle = coerceString(obj && obj.documentTitle).trim();
  const projectName = coerceString(obj && obj.projectName).trim();
  const sourceSummary = coerceString(obj && obj.sourceSummary).trim();
  const assumptions = normalizeStringArray(obj && obj.assumptions, { maxItems: 200, maxLen: 240 });
  const risks = normalizeStringArray(obj && obj.risks, { maxItems: 200, maxLen: 240 });
  const missingInfoQuestions = normalizeStringArray(obj && obj.missingInfoQuestions, { maxItems: 200, maxLen: 240 });

  const requirementItems = [];
  for (const item of Array.isArray(obj && obj.requirementItems) ? obj.requirementItems : []) {
    requirementItems.push({
      requirementId: coerceString(item && item.requirementId).trim(),
      requirementText: coerceString(item && item.requirementText).trim(),
      category: coerceString(item && item.category).trim(),
      priority: coerceString(item && item.priority).trim(),
      requirementSource: coerceString(item && item.requirementSource).trim(),
      acceptanceNotes: normalizeStringArray(item && item.acceptanceNotes, { maxItems: 20, maxLen: 240 })
    });
  }

  const gapRows = [];
  for (const row of Array.isArray(obj && obj.gapRows) ? obj.gapRows : []) {
    gapRows.push({
      gapId: coerceString(row && row.gapId).trim(),
      requirementId: coerceString(row && row.requirementId).trim(),
      gapStatus: coerceString(row && row.gapStatus).trim(),
      gapCategory: coerceString(row && row.gapCategory).trim(),
      severity: coerceString(row && row.severity).trim(),
      observation: coerceString(row && row.observation).trim(),
      impact: coerceString(row && row.impact).trim(),
      recommendedActions: normalizeStringArray(row && row.recommendedActions, { maxItems: 20, maxLen: 240 }),
      notes: normalizeStringArray(row && row.notes, { maxItems: 20, maxLen: 240 })
    });
  }

  return {
    documentTitle,
    projectName,
    sourceSummary,
    assumptions,
    risks,
    missingInfoQuestions,
    requirementItems,
    gapRows
  };
}

function normalizeAcceptanceCriteriaCandidate(obj) {
  const documentTitle = coerceString(obj && obj.documentTitle).trim();
  const projectName = coerceString(obj && obj.projectName).trim();
  const sourceSummary = coerceString(obj && obj.sourceSummary).trim();
  const assumptions = normalizeStringArray(obj && obj.assumptions, { maxItems: 200, maxLen: 240 });
  const risks = normalizeStringArray(obj && obj.risks, { maxItems: 200, maxLen: 240 });
  const missingInfoQuestions = normalizeStringArray(obj && obj.missingInfoQuestions, { maxItems: 200, maxLen: 240 });

  const requirementItems = [];
  for (const item of Array.isArray(obj && obj.requirementItems) ? obj.requirementItems : []) {
    requirementItems.push({
      requirementId: coerceString(item && item.requirementId).trim(),
      requirementText: coerceString(item && item.requirementText).trim(),
      category: coerceString(item && item.category).trim(),
      priority: coerceString(item && item.priority).trim(),
      requirementSource: coerceString(item && item.requirementSource).trim(),
      acceptanceNotes: normalizeStringArray(item && item.acceptanceNotes, { maxItems: 20, maxLen: 240 })
    });
  }

  const criteriaRows = [];
  for (const row of Array.isArray(obj && obj.criteriaRows) ? obj.criteriaRows : []) {
    criteriaRows.push({
      criteriaId: coerceString(row && row.criteriaId).trim(),
      requirementId: coerceString(row && row.requirementId).trim(),
      criterion: coerceString(row && row.criterion).trim(),
      criteriaType: coerceString(row && row.criteriaType).trim(),
      clarityStatus: coerceString(row && row.clarityStatus).trim(),
      notes: normalizeStringArray(row && row.notes, { maxItems: 20, maxLen: 240 })
    });
  }

  return {
    documentTitle,
    projectName,
    sourceSummary,
    assumptions,
    risks,
    missingInfoQuestions,
    requirementItems,
    criteriaRows
  };
}

function normalizeTestPlanDraftCandidate(obj) {
  return {
    documentTitle: coerceString(obj && obj.documentTitle).trim(),
    sprintName: coerceString(obj && obj.sprintName).trim(),
    author: coerceString(obj && obj.author).trim(),
    sourceSummary: coerceString(obj && obj.sourceSummary).trim(),
    introduction: coerceString(obj && obj.introduction).trim(),
    inScope: normalizeStringArray(obj && obj.inScope, { maxItems: 50, maxLen: 240 }),
    outOfScope: normalizeStringArray(obj && obj.outOfScope, { maxItems: 50, maxLen: 240 }),
    risks: normalizeStringArray(obj && obj.risks, { maxItems: 50, maxLen: 240 }),
    resources: {
      testers: normalizeStringArray(obj && obj.resources && obj.resources.testers, { maxItems: 20, maxLen: 120 }),
      developers: normalizeStringArray(obj && obj.resources && obj.resources.developers, { maxItems: 20, maxLen: 120 })
    },
    environmentAndTools: {
      testEnvironment: coerceString(obj && obj.environmentAndTools && obj.environmentAndTools.testEnvironment).trim(),
      tools: normalizeStringArray(obj && obj.environmentAndTools && obj.environmentAndTools.tools, { maxItems: 20, maxLen: 160 })
    },
    assumptions: normalizeStringArray(obj && obj.assumptions, { maxItems: 50, maxLen: 240 }),
    timescales: normalizeStringArray(obj && obj.timescales, { maxItems: 20, maxLen: 160 }),
    missingInfoQuestions: normalizeStringArray(obj && obj.missingInfoQuestions, { maxItems: 50, maxLen: 240 }),
    featureRows: (Array.isArray(obj && obj.featureRows) ? obj.featureRows : []).map((row) => ({
      feature: coerceString(row && row.feature).trim(),
      jiraTicket: coerceString(row && row.jiraTicket).trim(),
      testObjective: coerceString(row && row.testObjective).trim(),
      priority: coerceString(row && row.priority).trim(),
      testStatus: coerceString(row && row.testStatus).trim(),
      testCases: coerceString(row && row.testCases).trim(),
      defectIds: coerceString(row && row.defectIds).trim()
    }))
  };
}

function postProcessSuite(suite, opts) {
  const options = opts || {};
  const maxTestCases = Number.isFinite(options.maxTestCases) ? options.maxTestCases : 200;

  const normalized = normalizeSuiteCandidate(suite, { maxTestCases });
  const rawCases = Array.isArray(normalized.testCases) ? normalized.testCases : [];

  // Dedupe without collapsing distinct titles.
  const seen = new Set();
  const deduped = [];
  for (const tc of rawCases) {
    const key = [
      String(tc.title || "").toLowerCase(),
      String(tc.type || ""),
      String(tc.priority || ""),
      (Array.isArray(tc.steps) ? tc.steps : []).join("\n"),
      (Array.isArray(tc.expected) ? tc.expected : []).join("\n")
    ].join("| ");
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(tc);
    if (deduped.length >= maxTestCases) break;
  }

  const renumbered = deduped.map((tc, idx) => {
    const n = String(idx + 1).padStart(3, "0");
    return { ...tc, id: `TC-${n}` };
  });

  return {
    ...normalized,
    testCases: renumbered
  };
}

function postProcessPreflight(preflight) {
  return normalizePreflightCandidate(preflight);
}

function postProcessRtm(rtm) {
  const normalized = normalizeRtmCandidate(rtm);

  const requirementItems = [];
  const reqIdMap = new Map();
  const seenRequirementKeys = new Set();

  for (const item of normalized.requirementItems) {
    const textKey = String(item.requirementText || "").toLowerCase().trim();
    if (!textKey) continue;
    if (seenRequirementKeys.has(textKey)) continue;
    seenRequirementKeys.add(textKey);

    const nextId = `REQ-${String(requirementItems.length + 1).padStart(3, "0")}`;
    const originalId = item.requirementId || nextId;
    reqIdMap.set(originalId, nextId);

    requirementItems.push({
      ...item,
      requirementId: nextId
    });
  }

  const validReqIds = new Set(requirementItems.map((item) => item.requirementId));
  const traceRows = [];
  const seenTraceKeys = new Set();

  for (const row of normalized.traceRows) {
    const mappedReqId = reqIdMap.get(row.requirementId) || row.requirementId;
    if (!validReqIds.has(mappedReqId)) continue;

    const rowKey = [
      mappedReqId,
      String(row.coverageStatus || "").toLowerCase().trim(),
      (Array.isArray(row.testCaseRefs) ? row.testCaseRefs : []).join("|").toLowerCase(),
      (Array.isArray(row.proposedTestConditions) ? row.proposedTestConditions : []).join("|").toLowerCase()
    ].join("::");
    if (seenTraceKeys.has(rowKey)) continue;
    seenTraceKeys.add(rowKey);

    traceRows.push({
      ...row,
      traceId: `RTM-${String(traceRows.length + 1).padStart(3, "0")}`,
      requirementId: mappedReqId,
      owner: row.owner || "QA"
    });
  }

  return {
    ...normalized,
    documentTitle: normalized.documentTitle || "Requirements Traceability Matrix",
    projectName: normalized.projectName || "Unspecified Project",
    sourceSummary: normalized.sourceSummary || "Generated from provided requirements and clarifications.",
    requirementItems,
    traceRows
  };
}

function postProcessCoverageGap(doc) {
  const normalized = normalizeCoverageGapCandidate(doc);

  const requirementItems = [];
  const reqIdMap = new Map();
  const seenRequirementKeys = new Set();

  for (const item of normalized.requirementItems) {
    const textKey = String(item.requirementText || "").toLowerCase().trim();
    if (!textKey) continue;
    if (seenRequirementKeys.has(textKey)) continue;
    seenRequirementKeys.add(textKey);

    const nextId = `REQ-${String(requirementItems.length + 1).padStart(3, "0")}`;
    const originalId = item.requirementId || nextId;
    reqIdMap.set(originalId, nextId);

    requirementItems.push({
      ...item,
      requirementId: nextId
    });
  }

  const validReqIds = new Set(requirementItems.map((item) => item.requirementId));
  const gapRows = [];
  const seenGapKeys = new Set();

  for (const row of normalized.gapRows) {
    const mappedReqId = reqIdMap.get(row.requirementId) || row.requirementId;
    if (!validReqIds.has(mappedReqId)) continue;

    const gapKey = [
      mappedReqId,
      String(row.gapStatus || "").toLowerCase().trim(),
      String(row.gapCategory || "").toLowerCase().trim(),
      String(row.observation || "").toLowerCase().trim()
    ].join("::");
    if (seenGapKeys.has(gapKey)) continue;
    seenGapKeys.add(gapKey);

    gapRows.push({
      ...row,
      gapId: `GAP-${String(gapRows.length + 1).padStart(3, "0")}`,
      requirementId: mappedReqId
    });
  }

  return {
    ...normalized,
    documentTitle: normalized.documentTitle || "Coverage Gap Analysis",
    projectName: normalized.projectName || "Unspecified Project",
    sourceSummary: normalized.sourceSummary || "Generated from provided requirements and clarifications.",
    requirementItems,
    gapRows
  };
}

function mergeCoverageGapDocuments(documents) {
  const docs = Array.isArray(documents) ? documents.filter(Boolean) : [];
  const merged = {
    documentTitle: "Coverage Gap Analysis",
    projectName: "Unspecified Project",
    sourceSummary: docs
      .map((doc) => String(doc.sourceSummary || "").trim())
      .filter(Boolean)
      .join(" ")
      .trim(),
    assumptions: [],
    risks: [],
    missingInfoQuestions: [],
    requirementItems: [],
    gapRows: []
  };

  const seenAssumptions = new Set();
  const seenRisks = new Set();
  const seenMissing = new Set();

  for (const doc of docs) {
    if (doc.documentTitle && merged.documentTitle === "Coverage Gap Analysis") {
      merged.documentTitle = doc.documentTitle;
    }
    if (doc.projectName && merged.projectName === "Unspecified Project") {
      merged.projectName = doc.projectName;
    }

    for (const item of Array.isArray(doc.assumptions) ? doc.assumptions : []) {
      const key = String(item).toLowerCase().trim();
      if (!key || seenAssumptions.has(key)) continue;
      seenAssumptions.add(key);
      merged.assumptions.push(item);
    }
    for (const item of Array.isArray(doc.risks) ? doc.risks : []) {
      const key = String(item).toLowerCase().trim();
      if (!key || seenRisks.has(key)) continue;
      seenRisks.add(key);
      merged.risks.push(item);
    }
    for (const item of Array.isArray(doc.missingInfoQuestions) ? doc.missingInfoQuestions : []) {
      const key = String(item).toLowerCase().trim();
      if (!key || seenMissing.has(key)) continue;
      seenMissing.add(key);
      merged.missingInfoQuestions.push(item);
    }

    merged.requirementItems.push(...(Array.isArray(doc.requirementItems) ? doc.requirementItems : []));
    merged.gapRows.push(...(Array.isArray(doc.gapRows) ? doc.gapRows : []));
  }

  if (!merged.sourceSummary) {
    merged.sourceSummary = "Generated from provided requirements and clarifications.";
  }

  return postProcessCoverageGap(merged);
}

function postProcessAcceptanceCriteria(doc) {
  const normalized = normalizeAcceptanceCriteriaCandidate(doc);

  const requirementItems = [];
  const reqIdMap = new Map();
  const seenRequirementKeys = new Set();

  for (const item of normalized.requirementItems) {
    const textKey = String(item.requirementText || "").toLowerCase().trim();
    if (!textKey) continue;
    if (seenRequirementKeys.has(textKey)) continue;
    seenRequirementKeys.add(textKey);

    const nextId = `REQ-${String(requirementItems.length + 1).padStart(3, "0")}`;
    const originalId = item.requirementId || nextId;
    reqIdMap.set(originalId, nextId);

    requirementItems.push({
      ...item,
      requirementId: nextId
    });
  }

  const validReqIds = new Set(requirementItems.map((item) => item.requirementId));
  const criteriaRows = [];
  const seenCriteriaKeys = new Set();

  for (const row of normalized.criteriaRows) {
    const mappedReqId = reqIdMap.get(row.requirementId) || row.requirementId;
    if (!validReqIds.has(mappedReqId)) continue;

    const criteriaKey = [
      mappedReqId,
      String(row.criterion || "").toLowerCase().trim(),
      String(row.criteriaType || "").toLowerCase().trim(),
      String(row.clarityStatus || "").toLowerCase().trim()
    ].join("::");
    if (seenCriteriaKeys.has(criteriaKey)) continue;
    seenCriteriaKeys.add(criteriaKey);

    criteriaRows.push({
      ...row,
      criteriaId: `AC-${String(criteriaRows.length + 1).padStart(3, "0")}`,
      requirementId: mappedReqId
    });
  }

  return {
    ...normalized,
    documentTitle: normalized.documentTitle || "Acceptance Criteria Breakdown",
    projectName: normalized.projectName || "Unspecified Project",
    sourceSummary: normalized.sourceSummary || "Generated from provided requirements and clarifications.",
    requirementItems,
    criteriaRows
  };
}

function mergeAcceptanceCriteriaDocuments(documents) {
  const docs = Array.isArray(documents) ? documents.filter(Boolean) : [];
  const merged = {
    documentTitle: "Acceptance Criteria Breakdown",
    projectName: "Unspecified Project",
    sourceSummary: docs.map((doc) => String(doc.sourceSummary || "").trim()).filter(Boolean).join(" ").trim(),
    assumptions: [],
    risks: [],
    missingInfoQuestions: [],
    requirementItems: [],
    criteriaRows: []
  };

  const seenAssumptions = new Set();
  const seenRisks = new Set();
  const seenMissing = new Set();

  for (const doc of docs) {
    if (doc.documentTitle && merged.documentTitle === "Acceptance Criteria Breakdown") merged.documentTitle = doc.documentTitle;
    if (doc.projectName && merged.projectName === "Unspecified Project") merged.projectName = doc.projectName;

    for (const item of Array.isArray(doc.assumptions) ? doc.assumptions : []) {
      const key = String(item).toLowerCase().trim();
      if (!key || seenAssumptions.has(key)) continue;
      seenAssumptions.add(key);
      merged.assumptions.push(item);
    }
    for (const item of Array.isArray(doc.risks) ? doc.risks : []) {
      const key = String(item).toLowerCase().trim();
      if (!key || seenRisks.has(key)) continue;
      seenRisks.add(key);
      merged.risks.push(item);
    }
    for (const item of Array.isArray(doc.missingInfoQuestions) ? doc.missingInfoQuestions : []) {
      const key = String(item).toLowerCase().trim();
      if (!key || seenMissing.has(key)) continue;
      seenMissing.add(key);
      merged.missingInfoQuestions.push(item);
    }

    merged.requirementItems.push(...(Array.isArray(doc.requirementItems) ? doc.requirementItems : []));
    merged.criteriaRows.push(...(Array.isArray(doc.criteriaRows) ? doc.criteriaRows : []));
  }

  if (!merged.sourceSummary) merged.sourceSummary = "Generated from provided requirements and clarifications.";
  return postProcessAcceptanceCriteria(merged);
}

function postProcessTestPlanDraft(doc) {
  const normalized = normalizeTestPlanDraftCandidate(doc);
  const featureRows = [];
  const seenFeatures = new Set();

  for (const row of normalized.featureRows) {
    const key = [String(row.feature || "").toLowerCase(), String(row.jiraTicket || "").toLowerCase()].join("::");
    if (!row.feature || seenFeatures.has(key)) continue;
    seenFeatures.add(key);
    featureRows.push({
      ...row,
      testStatus: row.testStatus || "Not Started"
    });
  }

  return {
    ...normalized,
    documentTitle: normalized.documentTitle || "Test Plan Draft",
    sprintName: normalized.sprintName || "Current Sprint",
    author: normalized.author || "Unspecified Author",
    sourceSummary: normalized.sourceSummary || "Generated from provided requirements and project context.",
    introduction: normalized.introduction || "This draft test plan covers the provided sprint requirements and their core validation areas.",
    featureRows
  };
}

function splitRequirementBatches(text, opts) {
  const input = String(text || "").trim();
  if (!input) return [];

  const options = opts || {};
  const separator = options.separator || "\n\n---\n\n";
  const maxBatchChars = Number.isFinite(options.maxBatchChars) ? options.maxBatchChars : 9000;
  const parts = input.split(separator).map((part) => part.trim()).filter(Boolean);
  if (parts.length <= 1) {
    if (input.length <= maxBatchChars) return [input];
    const chunks = [];
    for (let i = 0; i < input.length; i += maxBatchChars) {
      chunks.push(input.slice(i, i + maxBatchChars).trim());
    }
    return chunks.filter(Boolean);
  }

  const batches = [];
  let current = "";

  for (const part of parts.length ? parts : [input]) {
    const candidate = current ? `${current}${separator}${part}` : part;
    if (current && candidate.length > maxBatchChars) {
      batches.push(current);
      current = part;
      continue;
    }
    current = candidate;
  }

  if (current) batches.push(current);
  return batches.length ? batches : [input];
}

function safeJsonParse(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (err) {
    return { ok: false, error: err };
  }
}

// Best-effort extractor: find the first JSON object in a text response.
function extractFirstJsonObject(text) {
  if (typeof text !== "string") return null;
  const start = text.indexOf("{");
  if (start === -1) return null;

  let inString = false;
  let escape = false;
  let depth = 0;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === "\\") {
        escape = true;
        continue;
      }
      if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "{") depth++;
    if (ch === "}") depth--;

    if (depth === 0) {
      return text.slice(start, i + 1);
    }
  }

  return null;
}

// Best-effort extractor: find the first JSON object or array in a text response.
function extractFirstJsonValue(text) {
  if (typeof text !== "string") return null;
  const objStart = text.indexOf("{");
  const arrStart = text.indexOf("[");
  if (objStart === -1 && arrStart === -1) return null;

  const start =
    objStart === -1 ? arrStart : arrStart === -1 ? objStart : Math.min(objStart, arrStart);
  const open = text[start];
  const close = open === "[" ? "]" : "}";

  let inString = false;
  let escape = false;
  let depth = 0;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === "\\") {
        escape = true;
        continue;
      }
      if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === open) depth++;
    if (ch === close) depth--;

    if (depth === 0) {
      return text.slice(start, i + 1);
    }
  }

  return null;
}

function tokenizeForSimilarity(text) {
  return new Set(
    String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 1)
  );
}

function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 1;
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function weightedSimilarity(tcA, tcB) {
  const titleA = tokenizeForSimilarity(tcA.title);
  const titleB = tokenizeForSimilarity(tcB.title);
  const stepsA = tokenizeForSimilarity((Array.isArray(tcA.steps) ? tcA.steps : []).join(" "));
  const stepsB = tokenizeForSimilarity((Array.isArray(tcB.steps) ? tcB.steps : []).join(" "));
  const expectedA = tokenizeForSimilarity((Array.isArray(tcA.expected) ? tcA.expected : []).join(" "));
  const expectedB = tokenizeForSimilarity((Array.isArray(tcB.expected) ? tcB.expected : []).join(" "));

  return (
    0.4 * jaccardSimilarity(titleA, titleB) +
    0.4 * jaccardSimilarity(stepsA, stepsB) +
    0.2 * jaccardSimilarity(expectedA, expectedB)
  );
}

function jaccardDedup(testCases, threshold) {
  const thresh = Number.isFinite(threshold) ? threshold : 0.6;
  const kept = [];
  const duplicateGroups = [];

  for (const tc of testCases) {
    let isDup = false;
    for (let i = 0; i < kept.length; i++) {
      const sim = weightedSimilarity(tc, kept[i]);
      if (sim >= thresh) {
        isDup = true;
        duplicateGroups.push({
          kept: kept[i].id,
          duplicate: tc.id,
          similarity: Math.round(sim * 100)
        });
        break;
      }
    }
    if (!isDup) {
      kept.push(tc);
    }
  }

  return { kept, duplicateGroups };
}

function mergeSuites(suites, opts) {
  const options = opts || {};
  const maxTestCases = Number.isFinite(options.maxTestCases) ? options.maxTestCases : 200;

  const mergedTitle = suites
    .map((s) => s.suiteTitle)
    .filter(Boolean)
    .join(" + ") || "Generated Test Suite";

  const allAssumptions = [];
  const allRisks = [];
  const allMissing = [];
  const allCases = [];

  const seenAssumptions = new Set();
  const seenRisks = new Set();
  const seenMissing = new Set();

  for (const suite of suites) {
    for (const a of Array.isArray(suite.assumptions) ? suite.assumptions : []) {
      const key = String(a).toLowerCase().trim();
      if (!seenAssumptions.has(key)) {
        seenAssumptions.add(key);
        allAssumptions.push(a);
      }
    }
    for (const r of Array.isArray(suite.risks) ? suite.risks : []) {
      const key = String(r).toLowerCase().trim();
      if (!seenRisks.has(key)) {
        seenRisks.add(key);
        allRisks.push(r);
      }
    }
    for (const q of Array.isArray(suite.missingInfoQuestions) ? suite.missingInfoQuestions : []) {
      const key = String(q).toLowerCase().trim();
      if (!seenMissing.has(key)) {
        seenMissing.add(key);
        allMissing.push(q);
      }
    }
    for (const tc of Array.isArray(suite.testCases) ? suite.testCases : []) {
      allCases.push(tc);
    }
  }

  const { kept, duplicateGroups } = jaccardDedup(allCases);
  const capped = kept.slice(0, maxTestCases);

  const renumbered = capped.map((tc, idx) => {
    const n = String(idx + 1).padStart(3, "0");
    return { ...tc, id: `TC-${n}` };
  });

  return {
    suite: {
      suiteTitle: mergedTitle,
      assumptions: allAssumptions,
      risks: allRisks,
      missingInfoQuestions: allMissing,
      testCases: renumbered
    },
    duplicateGroups
  };
}

function dedupeBy(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

module.exports = {
  clampNumber,
  truncateText,
  normalizeStringArray,
  normalizeSuiteCandidate,
  normalizePreflightCandidate,
  normalizeRtmCandidate,
  normalizeCoverageGapCandidate,
  normalizeAcceptanceCriteriaCandidate,
  normalizeTestPlanDraftCandidate,
  postProcessSuite,
  postProcessPreflight,
  postProcessRtm,
  postProcessCoverageGap,
  postProcessAcceptanceCriteria,
  postProcessTestPlanDraft,
  mergeCoverageGapDocuments,
  mergeAcceptanceCriteriaDocuments,
  splitRequirementBatches,
  safeJsonParse,
  extractFirstJsonObject,
  extractFirstJsonValue,
  dedupeBy,
  jaccardDedup,
  mergeSuites
};
