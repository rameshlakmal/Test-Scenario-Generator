import { Box, Typography } from '@mui/material'
import jsPDF from 'jspdf'
import { applyPlugin } from 'jspdf-autotable'
applyPlugin(jsPDF)

export function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const priorityMap = { P0: 'Critical', P1: 'High', P2: 'Medium', P3: 'Low' }

export function exportPdf(suite) {
  const cases = suite && Array.isArray(suite.testCases) ? suite.testCases : []
  const title = (suite && suite.suiteTitle) || 'Test Suite'
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()

  // ── Title ──
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(title, pageW / 2, 38, { align: 'center' })

  // ── Summary line ──
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  const counts = {}
  for (const tc of cases) {
    const p = String(tc.priority || 'P2')
    counts[p] = (counts[p] || 0) + 1
  }
  const summaryParts = [`${cases.length} test case${cases.length === 1 ? '' : 's'}`]
  for (const p of ['P0', 'P1', 'P2', 'P3']) {
    if (counts[p]) summaryParts.push(`${counts[p]} ${priorityMap[p] || p}`)
  }
  doc.text(summaryParts.join('  |  '), pageW / 2, 54, { align: 'center' })
  doc.setTextColor(0)

  // ── Priority badge colors ──
  const prioColors = {
    P0: [220, 38, 38],
    P1: [234, 88, 12],
    P2: [37, 99, 235],
    P3: [107, 114, 128],
  }

  // ── Table ──
  const rows = cases.map((tc) => {
    const steps = Array.isArray(tc.steps) ? tc.steps.map((s, i) => `${i + 1}. ${s}`).join('\n') : ''
    const expected = Array.isArray(tc.expected) ? tc.expected.map((e, i) => `${i + 1}. ${e}`).join('\n') : ''
    const pre = Array.isArray(tc.preconditions) ? tc.preconditions.join('\n') : ''
    const tags = Array.isArray(tc.coverageTags) ? tc.coverageTags.join(', ') : ''
    return [tc.id, tc.title, String(tc.priority || 'P2'), tc.type || '', pre, steps, expected, tags]
  })

  doc.autoTable({
    startY: 66,
    head: [['ID', 'Title', 'Priority', 'Type', 'Preconditions', 'Steps', 'Expected Result', 'Tags']],
    body: rows,
    styles: { fontSize: 7, cellPadding: 4, overflow: 'linebreak', lineWidth: 0.5, lineColor: [200, 200, 200] },
    headStyles: { fillColor: [88, 28, 135], textColor: 255, fontStyle: 'bold', fontSize: 7.5 },
    alternateRowStyles: { fillColor: [245, 243, 255] },
    columnStyles: {
      0: { cellWidth: 42, fontStyle: 'bold' },
      1: { cellWidth: 120 },
      2: { cellWidth: 42, halign: 'center' },
      3: { cellWidth: 52, halign: 'center' },
      4: { cellWidth: 80 },
      5: { cellWidth: 160 },
      6: { cellWidth: 140 },
      7: { cellWidth: 80, fontStyle: 'italic', fontSize: 6.5 },
    },
    didParseCell(data) {
      // Color-code priority cell
      if (data.section === 'body' && data.column.index === 2) {
        const p = String(data.cell.raw || '')
        const c = prioColors[p]
        if (c) {
          data.cell.styles.textColor = c
          data.cell.styles.fontStyle = 'bold'
        }
      }
    },
    didDrawPage(data) {
      // Footer
      const pageNum = doc.internal.getCurrentPageInfo().pageNumber
      doc.setFontSize(7)
      doc.setTextColor(160)
      doc.text(
        `${title}  —  Page ${pageNum}`,
        pageW / 2,
        doc.internal.pageSize.getHeight() - 14,
        { align: 'center' }
      )
      doc.setTextColor(0)
    },
    margin: { top: 38, bottom: 30, left: 28, right: 28 },
  })

  const slug = title.replace(/[^a-zA-Z0-9 _-]/g, '').trim().slice(0, 40).replace(/\s+/g, '_') || 'test-suite'
  doc.save(`${slug}.pdf`)
}

export function exportRtmPdf(rtm) {
  const reqs = rtm && Array.isArray(rtm.requirementItems) ? rtm.requirementItems : []
  const rows = rtm && Array.isArray(rtm.traceRows) ? rtm.traceRows : []
  const title = (rtm && rtm.documentTitle) || 'Requirements Traceability Matrix'
  const projectName = (rtm && rtm.projectName) || 'Unspecified Project'

  const reqMap = new Map(reqs.map((item) => [item.requirementId, item]))
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(title, pageW / 2, 34, { align: 'center' })

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  doc.text(`${projectName}  |  ${reqs.length} requirements  |  ${rows.length} trace rows`, pageW / 2, 50, { align: 'center' })
  doc.setTextColor(0)

  const body = rows.map((row) => {
    const item = reqMap.get(row.requirementId)
    return [
      row.traceId,
      row.requirementId,
      item ? item.requirementText : '',
      row.coverageStatus,
      Array.isArray(row.testCaseRefs) ? row.testCaseRefs.join('\n') : '',
      Array.isArray(row.proposedTestConditions) ? row.proposedTestConditions.map((x, i) => `${i + 1}. ${x}`).join('\n') : '',
      row.testLevel || '',
      row.owner || '',
      Array.isArray(row.notes) ? row.notes.join('\n') : '',
    ]
  })

  doc.autoTable({
    startY: 62,
    head: [['Trace ID', 'Req ID', 'Requirement', 'Coverage', 'Test Ref(s)', 'Proposed Conditions', 'Level', 'Owner', 'Notes']],
    body,
    styles: { fontSize: 7, cellPadding: 4, overflow: 'linebreak', lineWidth: 0.5, lineColor: [200, 200, 200] },
    headStyles: { fillColor: [88, 28, 135], textColor: 255, fontStyle: 'bold', fontSize: 7.5 },
    alternateRowStyles: { fillColor: [245, 243, 255] },
    columnStyles: {
      0: { cellWidth: 48, fontStyle: 'bold' },
      1: { cellWidth: 48, fontStyle: 'bold' },
      2: { cellWidth: 160 },
      3: { cellWidth: 58, halign: 'center' },
      4: { cellWidth: 70 },
      5: { cellWidth: 150 },
      6: { cellWidth: 52, halign: 'center' },
      7: { cellWidth: 45, halign: 'center' },
      8: { cellWidth: 80 },
    },
    didDrawPage() {
      const pageNum = doc.internal.getCurrentPageInfo().pageNumber
      doc.setFontSize(7)
      doc.setTextColor(160)
      doc.text(`${title}  |  Page ${pageNum}`, pageW / 2, doc.internal.pageSize.getHeight() - 14, { align: 'center' })
      doc.setTextColor(0)
    },
    margin: { top: 38, bottom: 30, left: 22, right: 22 },
  })

  const slug = title.replace(/[^a-zA-Z0-9 _-]/g, '').trim().slice(0, 50).replace(/\s+/g, '_') || 'rtm'
  doc.save(`${slug}.pdf`)
}

export function exportCoverageGapPdf(docData) {
  const reqs = docData && Array.isArray(docData.requirementItems) ? docData.requirementItems : []
  const rows = docData && Array.isArray(docData.gapRows) ? docData.gapRows : []
  const title = (docData && docData.documentTitle) || 'Coverage Gap Analysis'
  const projectName = (docData && docData.projectName) || 'Unspecified Project'

  const reqMap = new Map(reqs.map((item) => [item.requirementId, item]))
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const marginX = 28
  const contentW = pageW - (marginX * 2)
  const footerY = pageH - 16
  let y = 34
  const textLineHeight = 10
  const sectionGap = 10
  const labelGap = 12
  const bodyGap = 6

  const statusConfig = {
    'major-gap': { label: 'Major Gaps', color: [220, 38, 38], fill: [254, 242, 242] },
    'partial-gap': { label: 'Partial Gaps', color: [217, 119, 6], fill: [255, 251, 235] },
    clear: { label: 'Clear Items', color: [22, 163, 74], fill: [240, 253, 244] },
    'not-testable': { label: 'Not Testable', color: [107, 114, 128], fill: [243, 244, 246] },
  }

  const grouped = ['major-gap', 'partial-gap', 'clear', 'not-testable']
    .map((status) => ({
      status,
      ...statusConfig[status],
      rows: rows.filter((row) => String(row.gapStatus || '') === status),
    }))
    .filter((group) => group.rows.length > 0)

  function drawFooter() {
    const pageNum = doc.internal.getCurrentPageInfo().pageNumber
    doc.setFontSize(7)
    doc.setTextColor(160)
    doc.text(`${title}  |  Page ${pageNum}`, pageW / 2, footerY, { align: 'center' })
    doc.setTextColor(0)
  }

  function ensureSpace(minHeight) {
    if (y + minHeight <= pageH - 28) return
    drawFooter()
    doc.addPage()
    y = 32
  }

  function drawWrappedText(text, x, startY, width, lineHeight, opts = {}) {
    const lines = doc.splitTextToSize(String(text || ''), width)
    if (opts.bold) doc.setFont('helvetica', 'bold')
    else doc.setFont('helvetica', 'normal')
    doc.text(lines, x, startY)
    return startY + (Math.max(lines.length, 1) * lineHeight)
  }

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(title, pageW / 2, y, { align: 'center' })
  y += 16

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  doc.text(`${projectName}  |  ${reqs.length} requirements  |  ${rows.length} gap rows`, pageW / 2, y, { align: 'center' })
  doc.setTextColor(0)
  y += 22

  const summaryBoxW = (contentW - 18) / 2
  const summaryBoxH = 48
  grouped.forEach((group, index) => {
    if (index % 2 === 0) ensureSpace(summaryBoxH + 8)
    const col = index % 2
    const row = Math.floor(index / 2)
    const boxX = marginX + (col * (summaryBoxW + 18))
    const boxY = y + (row * (summaryBoxH + 10))
    doc.setDrawColor(...group.color)
    doc.setFillColor(...group.fill)
    doc.roundedRect(boxX, boxY, summaryBoxW, summaryBoxH, 8, 8, 'FD')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...group.color)
    doc.text(group.label, boxX + 12, boxY + 16)
    doc.setFontSize(16)
    doc.text(String(group.rows.length), boxX + 12, boxY + 36)
    doc.setTextColor(0)
  })
  y += (Math.ceil(grouped.length / 2) * (summaryBoxH + 10)) + 10

  for (const group of grouped) {
    ensureSpace(34)
    doc.setFillColor(...group.fill)
    doc.roundedRect(marginX, y, contentW, 24, 6, 6, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...group.color)
    doc.text(`${group.label} (${group.rows.length})`, marginX + 12, y + 16)
    doc.setTextColor(0)
    y += 34

    for (const row of group.rows) {
      const item = reqMap.get(row.requirementId)
      const requirementText = item ? item.requirementText : '(missing requirement text)'
      const actions = Array.isArray(row.recommendedActions) ? row.recommendedActions.map((x, i) => `${i + 1}. ${x}`).join('\n') : ''
      const notes = Array.isArray(row.notes) ? row.notes.join('\n') : ''

      const requirementLines = doc.splitTextToSize(requirementText, contentW - 24)
      const observationLines = doc.splitTextToSize(String(row.observation || ''), contentW - 24)
      const impactLines = doc.splitTextToSize(String(row.impact || ''), contentW - 24)
      const actionLines = doc.splitTextToSize(actions, contentW - 24)
      const noteLines = doc.splitTextToSize(notes, contentW - 24)
      const cardHeight =
        54 +
        labelGap + (Math.max(requirementLines.length, 1) * textLineHeight) +
        bodyGap +
        labelGap + (Math.max(observationLines.length, 1) * textLineHeight) +
        (row.impact ? bodyGap + labelGap + (Math.max(impactLines.length, 1) * textLineHeight) : 0) +
        (actions ? bodyGap + labelGap + (Math.max(actionLines.length, 1) * textLineHeight) : 0) +
        (notes ? bodyGap + labelGap + (Math.max(noteLines.length, 1) * textLineHeight) : 0) +
        18

      ensureSpace(cardHeight + 10)

      doc.setDrawColor(220, 223, 228)
      doc.setFillColor(255, 255, 255)
      doc.roundedRect(marginX, y, contentW, cardHeight, 8, 8, 'FD')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.text(`${row.gapId || ''}  |  ${row.requirementId || ''}`, marginX + 12, y + 16)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(90)
      doc.text(`${row.gapCategory || 'other'}  |  ${row.severity || 'medium'}${item && item.priority ? `  |  ${item.priority}` : ''}`, marginX + 12, y + 30)
      doc.setTextColor(0)

      let textY = y + 48
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text('Requirement', marginX + 12, textY)
      textY = drawWrappedText(requirementText, marginX + 12, textY + labelGap, contentW - 24, textLineHeight)

      doc.setFont('helvetica', 'bold')
      doc.text('Observation', marginX + 12, textY + bodyGap)
      textY = drawWrappedText(String(row.observation || ''), marginX + 12, textY + bodyGap + labelGap, contentW - 24, textLineHeight)

      if (row.impact) {
        doc.setFont('helvetica', 'bold')
        doc.text('Impact', marginX + 12, textY + bodyGap)
        textY = drawWrappedText(String(row.impact), marginX + 12, textY + bodyGap + labelGap, contentW - 24, textLineHeight)
      }

      if (actions) {
        doc.setFont('helvetica', 'bold')
        doc.text('Recommended Actions', marginX + 12, textY + bodyGap)
        textY = drawWrappedText(actions, marginX + 12, textY + bodyGap + labelGap, contentW - 24, textLineHeight)
      }

      if (notes) {
        doc.setFont('helvetica', 'bold')
        doc.text('Notes', marginX + 12, textY + bodyGap)
        textY = drawWrappedText(notes, marginX + 12, textY + bodyGap + labelGap, contentW - 24, textLineHeight)
      }

      y += cardHeight + sectionGap
    }
  }

  const appendixSections = [
    { title: 'Missing Info Questions', items: Array.isArray(docData?.missingInfoQuestions) ? docData.missingInfoQuestions : [] },
    { title: 'Assumptions', items: Array.isArray(docData?.assumptions) ? docData.assumptions : [] },
    { title: 'Risks', items: Array.isArray(docData?.risks) ? docData.risks : [] },
  ].filter((section) => section.items.length > 0)

  for (const section of appendixSections) {
    ensureSpace(34)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(section.title, marginX, y)
    y += 14
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    for (const item of section.items) {
      const bulletText = `• ${item}`
      const lines = doc.splitTextToSize(bulletText, contentW - 8)
      ensureSpace((lines.length * 12) + 4)
      doc.text(lines, marginX + 4, y)
      y += (lines.length * 12) + 2
    }
    y += 8
  }

  drawFooter()

  const slug = title.replace(/[^a-zA-Z0-9 _-]/g, '').trim().slice(0, 50).replace(/\s+/g, '_') || 'coverage-gap-analysis'
  doc.save(`${slug}.pdf`)
}

export function exportAcceptanceCriteriaPdf(docData) {
  const reqs = docData && Array.isArray(docData.requirementItems) ? docData.requirementItems : []
  const rows = docData && Array.isArray(docData.criteriaRows) ? docData.criteriaRows : []
  const title = (docData && docData.documentTitle) || 'Acceptance Criteria Breakdown'
  const projectName = (docData && docData.projectName) || 'Unspecified Project'
  const reqMap = new Map(reqs.map((item) => [item.requirementId, item]))

  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(title, pageW / 2, 34, { align: 'center' })

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  doc.text(`${projectName}  |  ${reqs.length} requirements  |  ${rows.length} criteria rows`, pageW / 2, 50, { align: 'center' })
  doc.setTextColor(0)

  const body = rows.map((row) => {
    const item = reqMap.get(row.requirementId)
    return [
      row.criteriaId,
      row.requirementId,
      item ? item.requirementText : '',
      row.criterion || '',
      row.criteriaType || '',
      row.clarityStatus || '',
      Array.isArray(row.notes) ? row.notes.join('\n') : '',
    ]
  })

  doc.autoTable({
    startY: 62,
    head: [['AC ID', 'Req ID', 'Requirement', 'Acceptance Criterion', 'Type', 'Clarity', 'Notes']],
    body,
    styles: { fontSize: 7, cellPadding: 4, overflow: 'linebreak', lineWidth: 0.5, lineColor: [200, 200, 200] },
    headStyles: { fillColor: [88, 28, 135], textColor: 255, fontStyle: 'bold', fontSize: 7.5 },
    alternateRowStyles: { fillColor: [245, 243, 255] },
    columnStyles: {
      0: { cellWidth: 44, fontStyle: 'bold' },
      1: { cellWidth: 44, fontStyle: 'bold' },
      2: { cellWidth: 130 },
      3: { cellWidth: 160 },
      4: { cellWidth: 64 },
      5: { cellWidth: 68 },
      6: { cellWidth: 70 },
    },
    didDrawPage() {
      const pageNum = doc.internal.getCurrentPageInfo().pageNumber
      doc.setFontSize(7)
      doc.setTextColor(160)
      doc.text(`${title}  |  Page ${pageNum}`, pageW / 2, doc.internal.pageSize.getHeight() - 14, { align: 'center' })
      doc.setTextColor(0)
    },
    margin: { top: 38, bottom: 30, left: 22, right: 22 },
  })

  const slug = title.replace(/[^a-zA-Z0-9 _-]/g, '').trim().slice(0, 50).replace(/\s+/g, '_') || 'acceptance-criteria-breakdown'
  doc.save(`${slug}.pdf`)
}

export function exportTestPlanDraftPdf(docData) {
  const title = (docData && docData.documentTitle) || 'Test Plan Draft'
  const sprintName = (docData && docData.sprintName) || 'Current Sprint'
  const author = (docData && docData.author) || 'Unspecified Author'
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`${title} - ${sprintName}`, 24, 28)
  doc.text(`Author - ${author}`, pageW - 24, 28, { align: 'right' })

  const sectionRows = [
    [
      { title: 'Introduction', body: [String(docData?.introduction || '')], fill: [222, 235, 247] },
      { title: 'In Scope', body: Array.isArray(docData?.inScope) ? docData.inScope : [], fill: [252, 228, 214] },
      { title: 'Out of Scope', body: Array.isArray(docData?.outOfScope) ? docData.outOfScope : [], fill: [226, 239, 218] },
    ],
    [
      { title: 'Risks', body: Array.isArray(docData?.risks) ? docData.risks : [], fill: [234, 209, 220] },
      {
        title: 'Resources',
        body: [
          `Testers - ${Array.isArray(docData?.resources?.testers) ? docData.resources.testers.join(', ') : ''}`,
          `Developers - ${Array.isArray(docData?.resources?.developers) ? docData.resources.developers.join(', ') : ''}`,
        ],
        fill: [235, 241, 221]
      },
      {
        title: 'Environment and Tools',
        body: [
          `Test Environment - ${String(docData?.environmentAndTools?.testEnvironment || '')}`,
          `Tools - ${Array.isArray(docData?.environmentAndTools?.tools) ? docData.environmentAndTools.tools.join(', ') : ''}`,
        ],
        fill: [217, 217, 243]
      },
    ],
    [
      { title: 'Assumptions', body: Array.isArray(docData?.assumptions) ? docData.assumptions : [], fill: [234, 209, 220] },
      { title: 'Timescales', body: Array.isArray(docData?.timescales) ? docData.timescales : [], fill: [235, 241, 221] },
      { title: 'Missing Info Questions', body: Array.isArray(docData?.missingInfoQuestions) ? docData.missingInfoQuestions : [], fill: [217, 217, 243] },
    ]
  ]

  const cellW = (pageW - 48) / 3
  let y = 40
  for (const row of sectionRows) {
    let maxBottom = y
    for (let i = 0; i < row.length; i++) {
      const cell = row[i]
      const x = 24 + (i * cellW)
      const body = (Array.isArray(cell.body) && cell.body.length ? cell.body : [''])
        .map((line) => `• ${line}`.replace(/^• $/, ''))
        .join('\n')
      const textLines = doc.splitTextToSize(body, cellW - 16)
      const height = Math.max(84, 28 + (textLines.length * 11) + 12)
      doc.setFillColor(...cell.fill)
      doc.setDrawColor(120, 120, 120)
      doc.rect(x, y, cellW, height, 'FD')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text(cell.title, x + (cellW / 2), y + 16, { align: 'center' })
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.text(textLines, x + 8, y + 34)
      maxBottom = Math.max(maxBottom, y + height)
    }
    y = maxBottom
  }

  const featureBody = (Array.isArray(docData?.featureRows) ? docData.featureRows : []).map((row) => [
    row.feature || '',
    row.jiraTicket || '',
    row.testObjective || '',
    row.priority || '',
    row.testStatus || '',
    row.testCases || '',
    row.defectIds || '',
  ])

  doc.autoTable({
    startY: y + 10,
    head: [['Features to be Tested', 'Jira Ticket', 'Test Objective', 'Priority', 'Test Status', 'Test Cases', 'Defect IDs']],
    body: featureBody,
    styles: { fontSize: 7, cellPadding: 4, overflow: 'linebreak', lineWidth: 0.5, lineColor: [200, 200, 200] },
    headStyles: { fillColor: [242, 242, 242], textColor: 20, fontStyle: 'bold', fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 150 },
      1: { cellWidth: 100 },
      2: { cellWidth: 100 },
      3: { cellWidth: 50 },
      4: { cellWidth: 60 },
      5: { cellWidth: 60 },
      6: { cellWidth: 55 },
    },
    margin: { left: 24, right: 24, bottom: 24 },
    didDrawPage() {
      const pageNum = doc.internal.getCurrentPageInfo().pageNumber
      doc.setFontSize(7)
      doc.setTextColor(160)
      doc.text(`${title}  |  ${sprintName}  |  Page ${pageNum}`, pageW / 2, doc.internal.pageSize.getHeight() - 12, { align: 'center' })
      doc.setTextColor(0)
    },
  })

  const slug = title.replace(/[^a-zA-Z0-9 _-]/g, '').trim().slice(0, 50).replace(/\s+/g, '_') || 'test-plan-draft'
  doc.save(`${slug}.pdf`)
}

export function exportQADocumentPdf(documentType, docData) {
  if (documentType === 'coverage-gap-analysis') return exportCoverageGapPdf(docData)
  if (documentType === 'acceptance-criteria-breakdown') return exportAcceptanceCriteriaPdf(docData)
  if (documentType === 'test-plan-draft') return exportTestPlanDraftPdf(docData)
  return exportRtmPdf(docData)
}

export function toCsv(suite) {
  const rows = []
  rows.push([
    'Test Id',
    'Summary',
    'Priority',
    'TestSteps',
    'ExpectedResults',
    'Story',
    'Test Type',
    'Component',
    'Release',
    'Status',
    'Creator'
  ])

  const priorityMap = {
    P0: 'Highest',
    P1: 'High',
    P2: 'Med',
    P3: 'Low'
  }

  const cases = suite && Array.isArray(suite.testCases) ? suite.testCases : []
  for (const tc of cases) {
    const steps = Array.isArray(tc.steps) ? tc.steps.map(String).join('\n') : ''
    const expected = Array.isArray(tc.expected) ? tc.expected.map(String).join('\n') : ''
    const story = Array.isArray(tc.requirementRefs) ? tc.requirementRefs.map(String).join('; ') : ''
    const pri = priorityMap[String(tc.priority)] || String(tc.priority || '')

    rows.push([
      tc.id,
      tc.title,
      pri,
      steps,
      expected,
      story,
      'Manual',
      '',
      '',
      '',
      ''
    ])
  }

  const esc = (v) => {
    const s = String(v ?? '')
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }

  return rows.map((r) => r.map(esc).join(',')).join('\n')
}

export function joinLines(arr) {
  const a = Array.isArray(arr) ? arr : []
  return a.map((x, i) => `${i + 1}. ${String(x)}`).join('\n')
}

export function listOrNone(arr) {
  const a = Array.isArray(arr) ? arr : []
  return a.length ? a : ['(none)']
}

export function BulletList({ items, renderItem, sx }) {
  const list = Array.isArray(items) ? items : []
  return (
    <Box
      component="ul"
      sx={{
        m: 0,
        pl: 2.5,
        pr: 0.5,
        width: '100%',
        color: 'text.primary',
        '& li': {
          marginBlock: '6px'
        },
        ...sx
      }}
    >
      {list.map((it, idx) => (
        <Box component="li" key={(it && it.id ? String(it.id) : String(it)) + ':' + idx}>
          {renderItem ? renderItem(it) : <Typography variant="body2">{String(it)}</Typography>}
        </Box>
      ))}
    </Box>
  )
}

export function OrderedList({ items, sx }) {
  const list = Array.isArray(items) ? items : []
  return (
    <Box
      component="ol"
      sx={{
        m: 0,
        pl: 2.75,
        color: 'text.primary',
        '& li': {
          marginBlock: '6px'
        },
        ...sx
      }}
    >
      {(list.length ? list : ['(none)']).map((it, idx) => (
        <Box component="li" key={String(it) + ':' + idx}>
          <Typography variant="body2">{String(it)}</Typography>
        </Box>
      ))}
    </Box>
  )
}
