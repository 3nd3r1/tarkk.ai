# Report Feature Usage Guide

## Quick Start

### For End Users

#### Viewing Different Report Sizes

1. **Navigate to an Assessment**
   - Go to any assessment page (e.g., `/assess/slack-001`)

2. **Select Report Size**
   - Use the report size selector at the top of the page
   - Choose from: Small, Medium, Full, or Enterprise
   - Content will update automatically based on your selection

3. **Download PDF Report**
   - Click the "Download [Size] Report" button
   - PDF will be generated and downloaded automatically
   - Filename format: `ProductName_Security_Report_[size].pdf`

#### Report Size Comparison

| Feature | Small | Medium | Full | Enterprise |
|---------|-------|--------|------|------------|
| **Read Time** | 2 min | 5 min | 10 min | 15+ min |
| **Trust Score** | ✓ | ✓ | ✓ | ✓ |
| **Product Overview** | ✓ | ✓ | ✓ | ✓ |
| **Vendor Info** | ✓ | ✓ | ✓ | ✓ |
| **Security Posture** | ✗ | ✓ | ✓ | ✓ |
| **Vulnerabilities** | Basic | ✓ | ✓ | ✓ |
| **CVE Details** | 3 | 5 | 10 | All |
| **Incidents** | 2 | 3 | 10 | All |
| **Data Privacy** | ✗ | ✗ | ✓ | ✓ |
| **Permissions** | ✗ | ✗ | ✓ | ✓ |
| **Technical Details** | ✗ | ✓ | ✓ | ✓ |
| **AI Features** | ✗ | ✓ | ✓ | ✓ |
| **Compliance** | ✗ | ✗ | ✓ | ✓ |
| **Sources** | ✗ | ✗ | ✓ | ✓ |
| **Alternatives** | ✗ | ✓ | ✓ | ✓ |

### For Developers

#### Import the PDF Generator

```typescript
import { 
  generatePDFReport, 
  shouldShowSection, 
  getReportConfig,
  filterAssessmentBySize 
} from '@/lib/pdf-generator';
```

#### Generate a PDF

```typescript
const handleDownloadPDF = async () => {
  if (!assessment) return;
  
  setIsGeneratingPDF(true);
  try {
    await generatePDFReport(assessment, reportSize);
    // PDF downloads automatically
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    alert('Failed to generate PDF report');
  } finally {
    setIsGeneratingPDF(false);
  }
};
```

#### Check Section Visibility

```typescript
// Check if a section should be shown for current report size
if (shouldShowSection('security', reportSize)) {
  return <SecuritySection data={assessment} />;
}

// Common sections:
// - 'overview' (Small+)
// - 'security' (Medium+)
// - 'vulnerabilities' (Medium+)
// - 'privacy' (Full+)
// - 'technical' (Medium+)
// - 'compliance' (Full+)
// - 'sources' (Full+)
```

#### Get Report Configuration

```typescript
const config = getReportConfig(reportSize);

// Available config properties:
// - includeSections: string[] - which sections to include
// - cveLimit: number - max CVEs to show
// - incidentLimit: number - max incidents to show
// - versionHistoryLimit: number - max versions to show
// - showDetailedMetrics: boolean - show detailed breakdowns

// Example usage:
const cvesToShow = assessment.vulnerabilities.recentCVEs.slice(0, config.cveLimit);
```

#### Filter Assessment Data

```typescript
// Filter assessment data based on report size
const filteredAssessment = filterAssessmentBySize(assessment, reportSize);

// This returns a new Assessment object with:
// - Limited CVEs based on report size
// - Limited incidents based on report size
// - Limited version history based on report size
```

## Use Cases

### 1. Executive Summary for C-Level

**Scenario:** CEO needs quick overview for board meeting

```typescript
// Use Small report
<ReportSizeSelector 
  currentSize="small" 
  onSizeChange={setReportSize} 
/>
// Shows: Trust score, key findings, vendor overview
// PDF: 2-3 pages
```

### 2. Security Team Review

**Scenario:** Security team evaluating new tool

```typescript
// Use Medium or Full report
<ReportSizeSelector 
  currentSize="full" 
  onSizeChange={setReportSize} 
/>
// Shows: All security details, CVEs, compliance
// PDF: 8-12 pages
```

### 3. Compliance Audit

**Scenario:** Annual compliance review

```typescript
// Use Enterprise report
<ReportSizeSelector 
  currentSize="enterprise" 
  onSizeChange={setReportSize} 
/>
// Shows: Everything with full source attribution
// PDF: 15-25 pages
```

## Component Integration

### Using Report Size Selector

```tsx
import { ReportSizeSelector } from "@/components/assessment/report-size-selector";
import { ReportSize } from "@/lib/types";
import { useState } from "react";

function MyComponent() {
  const [reportSize, setReportSize] = useState<ReportSize>('medium');
  
  return (
    <div>
      <ReportSizeSelector 
        currentSize={reportSize}
        onSizeChange={setReportSize}
      />
      {/* Rest of your component */}
    </div>
  );
}
```

### Conditional Rendering Based on Report Size

```tsx
function SecurityTab({ assessment, reportSize }: Props) {
  const config = getReportConfig(reportSize);
  
  return (
    <div>
      {/* Always show overview */}
      <SecurityOverview data={assessment} />
      
      {/* Show incidents only for Medium+ */}
      {shouldShowSection('security', reportSize) && (
        <IncidentTimeline 
          incidents={assessment.incidents.timeline.slice(0, config.incidentLimit)}
        />
      )}
      
      {/* Show detailed metrics only if enabled */}
      {config.showDetailedMetrics && (
        <DetailedMetrics data={assessment} />
      )}
    </div>
  );
}
```

## Best Practices

### 1. Loading States

Always show loading state during PDF generation:

```tsx
<Button 
  onClick={handleDownloadPDF}
  disabled={isGeneratingPDF}
>
  {isGeneratingPDF ? (
    <>
      <Spinner className="mr-2" />
      Generating PDF...
    </>
  ) : (
    <>
      <Download className="mr-2" />
      Download Report
    </>
  )}
</Button>
```

### 2. Error Handling

Handle PDF generation errors gracefully:

```tsx
try {
  await generatePDFReport(assessment, reportSize);
} catch (error) {
  console.error('PDF generation failed:', error);
  // Show user-friendly error message
  toast.error('Failed to generate PDF. Please try again.');
}
```

### 3. Report Size Persistence

Save user's report size preference:

```tsx
useEffect(() => {
  const savedSize = localStorage.getItem('reportSize') as ReportSize;
  if (savedSize) {
    setReportSize(savedSize);
  }
}, []);

useEffect(() => {
  localStorage.setItem('reportSize', reportSize);
}, [reportSize]);
```

### 4. Progressive Enhancement

Provide fallback for browsers without PDF support:

```tsx
const canGeneratePDF = typeof window !== 'undefined' && 'jsPDF' in window;

if (!canGeneratePDF) {
  return <PrintButton assessment={assessment} />;
}
```

## Troubleshooting

### PDF Generation Issues

**Problem:** PDF downloads but is blank

**Solution:** Check that assessment data is fully loaded before generation:

```tsx
const handleDownload = async () => {
  if (!assessment || isLoading) {
    alert('Please wait for assessment to load');
    return;
  }
  await generatePDFReport(assessment, reportSize);
};
```

**Problem:** PDF generation is slow

**Solution:** Use smaller report size or implement progress indicator:

```tsx
// Recommend starting with Medium instead of Enterprise
setReportSize('medium');

// Or show progress
<Progress value={pdfProgress} />
```

### Content Not Filtering

**Problem:** All content shows regardless of report size

**Solution:** Ensure you're using shouldShowSection:

```tsx
// Wrong
<PrivacySection data={assessment} />

// Correct
{shouldShowSection('privacy', reportSize) && (
  <PrivacySection data={assessment} />
)}
```

## API Reference

### Functions

#### `generatePDFReport(assessment: Assessment, reportSize: ReportSize): Promise<void>`
Generates and downloads a PDF report.

#### `shouldShowSection(section: string, reportSize: ReportSize): boolean`
Checks if a section should be visible for the given report size.

#### `getReportConfig(size: ReportSize): ReportConfig`
Returns configuration for a report size.

#### `filterAssessmentBySize(assessment: Assessment, size: ReportSize): Assessment`
Returns filtered assessment data based on report size.

### Types

```typescript
type ReportSize = 'small' | 'medium' | 'full' | 'enterprise';

interface ReportConfig {
  size: ReportSize;
  estimatedReadTime: string;
  expandedSections: string[];
}
```

## Support

For questions or issues:
1. Check the TypeScript types in `/workspace/frontend/lib/types.ts`
2. Review the PDF generator source in `/workspace/frontend/lib/pdf-generator.ts`
3. See implementation example in `/workspace/frontend/app/assess/[id]/page.tsx`
