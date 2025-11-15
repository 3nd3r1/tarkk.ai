# Assessment Components - Phase 4

This directory contains all Phase 4 assessment components for the Security Assessor platform. These components provide comprehensive visualization of security assessments across 15 dimensions.

## 📦 Components

### Core Phase 4 Components

#### 1. `PlatformSupportGrid` (§5)
Displays OS and platform compatibility with visual indicators.

```tsx
import { PlatformSupportGrid } from '@/components/assessment';

<PlatformSupportGrid 
  platformSupport={assessment.platformSupport}
  reportSize="medium"
/>
```

**Features:**
- Visual platform badges with icons
- Support status indicators
- Version requirements
- Security model information
- Platform coverage percentage

---

#### 2. `DataHandlingFlowchart` (§6)
Visualizes data storage, transmission, and usage flow.

```tsx
import { DataHandlingFlowchart } from '@/components/assessment';

<DataHandlingFlowchart 
  dataHandling={assessment.dataHandling}
  reportSize="medium"
/>
```

**Features:**
- Three-stage flow visualization (Storage → Transmission → Usage)
- Encryption indicators
- Cloud provider information
- Data usage flags (analytics, advertising, AI training)
- Regional data storage display

---

#### 3. `PermissionsMatrix` (§7)
Risk-coded permission analysis with justifications.

```tsx
import { PermissionsMatrix } from '@/components/assessment';

<PermissionsMatrix 
  permissions={assessment.permissions}
  reportSize="medium"
/>
```

**Features:**
- Required vs optional permissions
- Risk level color coding (low/medium/high)
- Over-permissioning warnings
- Risk distribution visualization
- Justification for each permission

---

#### 4. `ReleaseLifecycleTimeline` (§9)
Version history and update cadence visualization.

```tsx
import { ReleaseLifecycleTimeline } from '@/components/assessment';

<ReleaseLifecycleTimeline 
  releaseLifecycle={assessment.releaseLifecycle}
  reportSize="medium"
/>
```

**Features:**
- Interactive timeline of releases
- Security fixes highlighting
- LTS version indicators
- EOL date warnings
- Patch cadence analysis
- Release frequency metrics

---

#### 5. `AIFeaturesBreakdown` (§10)
AI capabilities and data usage transparency.

```tsx
import { AIFeaturesBreakdown } from '@/components/assessment';

<AIFeaturesBreakdown 
  aiFeatures={assessment.aiFeatures}
  reportSize="medium"
/>
```

**Features:**
- Privacy score calculation
- Training data usage warnings
- Opt-out availability
- Processing location (local/cloud/hybrid)
- Individual AI feature cards with data access details
- "No AI" state for non-AI products

---

#### 6. `SourcesBreakdown` (§3)
Information source transparency visualization.

```tsx
import { SourcesBreakdown } from '@/components/assessment';

<SourcesBreakdown 
  sources={assessment.sources}
  reportSize="medium"
/>
```

**Features:**
- Public vs confidential source split
- Source type breakdown
- Transparency score
- Research depth indicator
- Visual percentage bars
- Source quality metrics

---

#### 7. `ReportSizeSelector` (§13)
Detail level toggle for report customization.

```tsx
import { ReportSizeSelector } from '@/components/assessment';

const [reportSize, setReportSize] = useState<ReportSize>('medium');

<ReportSizeSelector 
  selectedSize={reportSize}
  onSizeChange={setReportSize}
/>
```

**Features:**
- Three levels: Small (2min), Medium (5min), Full (10min)
- Visual size comparison
- Read time estimates
- Feature inclusion matrix
- Animated selection states

---

#### 8. `DisclaimerBanner` (§14)
Accuracy warning and assessment metadata.

```tsx
import { DisclaimerBanner } from '@/components/assessment';

<DisclaimerBanner 
  timestamp={assessment.timestamp}
  confidence={assessment.trustScore.confidence}
  cached={assessment.cached}
/>
```

**Features:**
- Confidence level indicator
- Legal disclaimers
- Assessment timestamp
- Cached result badge
- Low confidence warnings
- Use-at-own-risk notice

---

### Bonus Components (Creative Enhancements)

#### 9. `SecurityScoreBreakdown`
Detailed breakdown of trust score calculation.

```tsx
import { SecurityScoreBreakdown } from '@/components/assessment';

<SecurityScoreBreakdown 
  trustScore={assessment.trustScore.score}
  confidence={assessment.trustScore.confidence}
/>
```

**Features:**
- Weighted factor analysis
- Score calculation transparency
- Impact indicators (positive/negative/neutral)
- Confidence visualization
- Progress bars for each factor
- Tooltip explanations

---

#### 10. `AdminControlsGrid`
Enterprise access management features (§4).

```tsx
import { AdminControlsGrid } from '@/components/assessment';

<AdminControlsGrid 
  adminControls={assessment.adminControls}
  reportSize="medium"
/>
```

**Features:**
- SSO, MFA, RBAC, SCIM indicators
- Audit logs and data export
- Feature coverage percentage
- Benefit explanations
- Enterprise readiness assessment
- Visual status indicators

---

## 🎨 Report Size Behavior

All components support three report sizes that control detail level:

- **`small`**: Minimal details, key metrics only (2min read)
- **`medium`**: Balanced view with charts and explanations (5min read) - Default
- **`full`**: Complete details with all evidence (10min read)

Components automatically adjust their content based on the selected size:

```tsx
// Example: Conditional rendering based on report size
{reportSize !== 'small' && (
  <div>Additional details...</div>
)}

{reportSize === 'full' && (
  <div>Deep dive content...</div>
)}
```

---

## 🎯 Usage Patterns

### Basic Usage
```tsx
import { 
  PlatformSupportGrid,
  DataHandlingFlowchart,
  PermissionsMatrix,
} from '@/components/assessment';

function AssessmentPage({ assessment }) {
  return (
    <div className="space-y-6">
      <PlatformSupportGrid platformSupport={assessment.platformSupport} />
      <DataHandlingFlowchart dataHandling={assessment.dataHandling} />
      <PermissionsMatrix permissions={assessment.permissions} />
    </div>
  );
}
```

### With Report Size Control
```tsx
import { useState } from 'react';
import { ReportSize } from '@/lib/types';
import { 
  ReportSizeSelector,
  AIFeaturesBreakdown,
} from '@/components/assessment';

function AssessmentWithSizeControl({ assessment }) {
  const [reportSize, setReportSize] = useState<ReportSize>('medium');
  
  return (
    <>
      <ReportSizeSelector 
        selectedSize={reportSize}
        onSizeChange={setReportSize}
      />
      <AIFeaturesBreakdown 
        aiFeatures={assessment.aiFeatures}
        reportSize={reportSize}
      />
    </>
  );
}
```

---

## 🎨 Design System

### Color Coding
- **Green**: Positive indicators, high trust, secure features
- **Yellow/Orange**: Warnings, medium risk, caution areas
- **Red**: High risk, critical issues, security concerns
- **Blue**: Information, primary actions, neutral status
- **Purple**: AI features, advanced technology
- **Teal**: Data flow, privacy, encryption

### Icons
Using `lucide-react` icons consistently:
- `Shield`: Security features
- `AlertTriangle`: Warnings
- `CheckCircle`: Success/enabled
- `XCircle`: Disabled/unavailable
- `Info`: Information
- Component-specific icons for visual recognition

### Animations
- Hover effects on interactive elements
- Progress bar transitions (1000ms ease-out)
- Scale transforms on selection (1.02-1.05)
- Fade-in for conditional content

---

## 📊 Framework Coverage

These components implement all required sections from `IMPLEMENTATION_SUMMARY.md`:

| Section | Component | Status |
|---------|-----------|--------|
| §3 - Information Sources | `SourcesBreakdown` | ✅ Complete |
| §4 - Admin Controls | `AdminControlsGrid` | ✅ Complete (Bonus) |
| §5 - Platform Support | `PlatformSupportGrid` | ✅ Complete |
| §6 - Data Handling | `DataHandlingFlowchart` | ✅ Complete |
| §7 - Permissions | `PermissionsMatrix` | ✅ Complete |
| §9 - Release Lifecycle | `ReleaseLifecycleTimeline` | ✅ Complete |
| §10 - AI Features | `AIFeaturesBreakdown` | ✅ Complete |
| §13 - Report Size | `ReportSizeSelector` | ✅ Complete |
| §14 - Disclaimer | `DisclaimerBanner` | ✅ Complete |

**Plus 1 bonus component:** `SecurityScoreBreakdown` for enhanced transparency

---

## 🧪 Testing

Test with mock data from `lib/api.ts`:

```tsx
import { getAssessment } from '@/lib/api';

const assessment = await getAssessment('slack-001');
// Use assessment data with components
```

---

## 📝 Notes

- All components are fully typed with TypeScript
- Dark mode support built-in
- Responsive design (mobile-first)
- Accessible with semantic HTML
- Optimized for performance
- No external dependencies beyond shadcn/ui and lucide-react

---

## 🚀 Next Steps

To use these components in assessment pages:

1. Import required components
2. Pass assessment data props
3. Optionally add report size control
4. Arrange in tabs or sections per design

See `app/assess/[id]/page.tsx` for integration examples.
