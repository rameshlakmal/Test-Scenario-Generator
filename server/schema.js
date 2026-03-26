const analysisSchema = {
  $id: "https://example.local/schemas/analysis.json",
  type: "object",
  additionalProperties: false,
  required: ["summary", "extractedElements", "techniqueRecommendations", "complexity"],
  properties: {
    summary: { type: "string", minLength: 1 },
    extractedElements: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "type", "description"],
        properties: {
          name: { type: "string", minLength: 1 },
          type: {
            type: "string",
            enum: ["input", "output", "state", "rule", "boundary", "constraint", "action", "integration"]
          },
          description: { type: "string", minLength: 1 },
          values: { type: "array", items: { type: "string" } }
        }
      }
    },
    techniqueRecommendations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["skillId", "confidence", "rationale", "estimatedScenarios"],
        properties: {
          skillId: { type: "string", minLength: 1 },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
          rationale: { type: "string", minLength: 1 },
          estimatedScenarios: { type: "integer", minimum: 1 }
        }
      }
    },
    complexity: { type: "string", enum: ["simple", "moderate", "complex"] }
  }
};

const testSuiteSchema = {
  $id: "https://example.local/schemas/test-suite.json",
  type: "object",
  additionalProperties: false,
  required: ["suiteTitle", "assumptions", "risks", "missingInfoQuestions", "testCases"],
  properties: {
    suiteTitle: { type: "string", minLength: 1 },
    assumptions: { type: "array", items: { type: "string", minLength: 1 } },
    risks: { type: "array", items: { type: "string", minLength: 1 } },
    missingInfoQuestions: { type: "array", items: { type: "string", minLength: 1 } },
    mermaidDiagram: { type: "string" },
    testCases: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "id",
          "title",
          "type",
          "priority",
          "preconditions",
          "steps",
          "expected",
          "coverageTags",
          "requirementRefs"
        ],
        properties: {
          id: { type: "string", minLength: 1 },
          title: { type: "string", minLength: 1 },
          type: {
            type: "string",
            enum: [
              "functional",
              "negative",
              "boundary",
              "security",
              "accessibility",
              "performance",
              "usability",
              "compatibility",
              "resilience"
            ]
          },
          priority: { type: "string", enum: ["P0", "P1", "P2", "P3"] },
          preconditions: { type: "array", items: { type: "string", minLength: 1 } },
          steps: { type: "array", items: { type: "string", minLength: 1 }, minItems: 1 },
          expected: { type: "array", items: { type: "string", minLength: 1 }, minItems: 1 },
          coverageTags: { type: "array", items: { type: "string", minLength: 1 } },
          requirementRefs: { type: "array", items: { type: "string", minLength: 1 } }
        }
      }
    }
  }
};

const preflightSchema = {
  $id: "https://example.local/schemas/preflight.json",
  type: "object",
  additionalProperties: false,
  required: ["assumptions", "missingInfoQuestions"],
  properties: {
    assumptions: { type: "array", items: { type: "string", minLength: 1 } },
    missingInfoQuestions: { type: "array", items: { type: "string", minLength: 1 } },
    notes: { type: "array", items: { type: "string", minLength: 1 } }
  }
};

const rtmDocumentSchema = {
  $id: "https://example.local/schemas/rtm-document.json",
  type: "object",
  additionalProperties: false,
  required: [
    "documentTitle",
    "projectName",
    "sourceSummary",
    "assumptions",
    "risks",
    "missingInfoQuestions",
    "requirementItems",
    "traceRows"
  ],
  properties: {
    documentTitle: { type: "string", minLength: 1 },
    projectName: { type: "string", minLength: 1 },
    sourceSummary: { type: "string", minLength: 1 },
    assumptions: { type: "array", items: { type: "string", minLength: 1 } },
    risks: { type: "array", items: { type: "string", minLength: 1 } },
    missingInfoQuestions: { type: "array", items: { type: "string", minLength: 1 } },
    requirementItems: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "requirementId",
          "requirementText",
          "category",
          "priority",
          "requirementSource",
          "acceptanceNotes"
        ],
        properties: {
          requirementId: { type: "string", minLength: 1 },
          requirementText: { type: "string", minLength: 1 },
          category: {
            type: "string",
            enum: [
              "functional",
              "business-rule",
              "validation",
              "integration",
              "reporting",
              "security",
              "performance",
              "usability",
              "accessibility",
              "data",
              "workflow",
              "non-functional",
              "other"
            ]
          },
          priority: { type: "string", enum: ["P0", "P1", "P2", "P3"] },
          requirementSource: {
            type: "string",
            enum: ["requirement-text", "clarification", "inferred-structure"]
          },
          acceptanceNotes: { type: "array", items: { type: "string", minLength: 1 } }
        }
      }
    },
    traceRows: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "traceId",
          "requirementId",
          "coverageStatus",
          "testCaseRefs",
          "proposedTestConditions",
          "testLevel",
          "owner",
          "notes"
        ],
        properties: {
          traceId: { type: "string", minLength: 1 },
          requirementId: { type: "string", minLength: 1 },
          coverageStatus: {
            type: "string",
            enum: ["covered", "partial", "missing", "not-applicable"]
          },
          testCaseRefs: { type: "array", items: { type: "string", minLength: 1 } },
          proposedTestConditions: { type: "array", items: { type: "string", minLength: 1 } },
          testLevel: {
            type: "string",
            enum: ["unit", "integration", "system", "uat", "regression", "non-functional", "not-specified"]
          },
          owner: { type: "string" },
          notes: { type: "array", items: { type: "string", minLength: 1 } }
        }
      }
    }
  }
};

const coverageGapDocumentSchema = {
  $id: "https://example.local/schemas/coverage-gap-document.json",
  type: "object",
  additionalProperties: false,
  required: [
    "documentTitle",
    "projectName",
    "sourceSummary",
    "assumptions",
    "risks",
    "missingInfoQuestions",
    "requirementItems",
    "gapRows"
  ],
  properties: {
    documentTitle: { type: "string", minLength: 1 },
    projectName: { type: "string", minLength: 1 },
    sourceSummary: { type: "string", minLength: 1 },
    assumptions: { type: "array", items: { type: "string", minLength: 1 } },
    risks: { type: "array", items: { type: "string", minLength: 1 } },
    missingInfoQuestions: { type: "array", items: { type: "string", minLength: 1 } },
    requirementItems: rtmDocumentSchema.properties.requirementItems,
    gapRows: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "gapId",
          "requirementId",
          "gapStatus",
          "gapCategory",
          "severity",
          "observation",
          "impact",
          "recommendedActions",
          "notes"
        ],
        properties: {
          gapId: { type: "string", minLength: 1 },
          requirementId: { type: "string", minLength: 1 },
          gapStatus: {
            type: "string",
            enum: ["clear", "partial-gap", "major-gap", "not-testable"]
          },
          gapCategory: {
            type: "string",
            enum: [
              "ambiguity",
              "missing-validation",
              "missing-negative-path",
              "missing-boundary",
              "missing-error-handling",
              "missing-integration-detail",
              "missing-data-rule",
              "missing-permission-rule",
              "missing-non-functional-detail",
              "testability",
              "other"
            ]
          },
          severity: { type: "string", enum: ["critical", "high", "medium", "low"] },
          observation: { type: "string", minLength: 1 },
          impact: { type: "string", minLength: 1 },
          recommendedActions: { type: "array", items: { type: "string", minLength: 1 }, minItems: 1 },
          notes: { type: "array", items: { type: "string", minLength: 1 } }
        }
      }
    }
  }
};

const acceptanceCriteriaDocumentSchema = {
  $id: "https://example.local/schemas/acceptance-criteria-document.json",
  type: "object",
  additionalProperties: false,
  required: [
    "documentTitle",
    "projectName",
    "sourceSummary",
    "assumptions",
    "risks",
    "missingInfoQuestions",
    "requirementItems",
    "criteriaRows"
  ],
  properties: {
    documentTitle: { type: "string", minLength: 1 },
    projectName: { type: "string", minLength: 1 },
    sourceSummary: { type: "string", minLength: 1 },
    assumptions: { type: "array", items: { type: "string", minLength: 1 } },
    risks: { type: "array", items: { type: "string", minLength: 1 } },
    missingInfoQuestions: { type: "array", items: { type: "string", minLength: 1 } },
    requirementItems: rtmDocumentSchema.properties.requirementItems,
    criteriaRows: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "criteriaId",
          "requirementId",
          "criterion",
          "criteriaType",
          "clarityStatus",
          "notes"
        ],
        properties: {
          criteriaId: { type: "string", minLength: 1 },
          requirementId: { type: "string", minLength: 1 },
          criterion: { type: "string", minLength: 1 },
          criteriaType: {
            type: "string",
            enum: [
              "functional",
              "validation",
              "business-rule",
              "workflow",
              "integration",
              "permission",
              "data",
              "non-functional",
              "other"
            ]
          },
          clarityStatus: {
            type: "string",
            enum: ["clear", "needs-clarification", "assumed"]
          },
          notes: { type: "array", items: { type: "string", minLength: 1 } }
        }
      }
    }
  }
};

const testPlanDraftDocumentSchema = {
  $id: "https://example.local/schemas/test-plan-draft-document.json",
  type: "object",
  additionalProperties: false,
  required: [
    "documentTitle",
    "sprintName",
    "author",
    "sourceSummary",
    "introduction",
    "inScope",
    "outOfScope",
    "risks",
    "resources",
    "environmentAndTools",
    "assumptions",
    "timescales",
    "missingInfoQuestions",
    "featureRows"
  ],
  properties: {
    documentTitle: { type: "string", minLength: 1 },
    sprintName: { type: "string", minLength: 1 },
    author: { type: "string", minLength: 1 },
    sourceSummary: { type: "string", minLength: 1 },
    introduction: { type: "string", minLength: 1 },
    inScope: { type: "array", items: { type: "string", minLength: 1 }, minItems: 1 },
    outOfScope: { type: "array", items: { type: "string", minLength: 1 } },
    risks: { type: "array", items: { type: "string", minLength: 1 } },
    resources: {
      type: "object",
      additionalProperties: false,
      required: ["testers", "developers"],
      properties: {
        testers: { type: "array", items: { type: "string", minLength: 1 } },
        developers: { type: "array", items: { type: "string", minLength: 1 } }
      }
    },
    environmentAndTools: {
      type: "object",
      additionalProperties: false,
      required: ["testEnvironment", "tools"],
      properties: {
        testEnvironment: { type: "string", minLength: 1 },
        tools: { type: "array", items: { type: "string", minLength: 1 } }
      }
    },
    assumptions: { type: "array", items: { type: "string", minLength: 1 } },
    timescales: { type: "array", items: { type: "string", minLength: 1 } },
    missingInfoQuestions: { type: "array", items: { type: "string", minLength: 1 } },
    featureRows: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["feature", "jiraTicket", "testObjective", "priority", "testStatus", "testCases", "defectIds"],
        properties: {
          feature: { type: "string", minLength: 1 },
          jiraTicket: { type: "string" },
          testObjective: { type: "string" },
          priority: { type: "string", enum: ["P0", "P1", "P2", "P3", ""] },
          testStatus: { type: "string", minLength: 1 },
          testCases: { type: "string" },
          defectIds: { type: "string" }
        }
      }
    }
  }
};

module.exports = {
  analysisSchema,
  testSuiteSchema,
  preflightSchema,
  rtmDocumentSchema,
  coverageGapDocumentSchema,
  acceptanceCriteriaDocumentSchema,
  testPlanDraftDocumentSchema
};
