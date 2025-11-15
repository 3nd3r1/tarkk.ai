# Security Assessment Data Schema

This document describes the complete data format required for security assessments in this application.

## Overview

Each assessment is a comprehensive security evaluation of a software product, covering 15 key areas aligned with the evaluation framework. The data structure supports both public and confidential information sources.

## Root Assessment Object

```typescript
{
  id: string                    // Unique identifier (e.g., "slack-001")
  timestamp: string             // ISO 8601 timestamp of assessment
  cached: boolean               // Whether this is a cached result
  
  product: { ... }              // §2 - Product Information
  trustScore: { ... }           // Calculated trust score (0-100)
  vendorInfo: { ... }           // §1 - Vendor Information
  platformSupport: { ... }      // §5 - Platform Support
  dataHandling: { ... }         // §6 - Data Handling Practices
  permissions: { ... }          // §7 - Permissions Analysis
  adminControls: { ... }        // §4 - Admin & Access Controls
  vulnerabilities: { ... }      // §8 - CVE & Vulnerability Data
  releaseLifecycle: { ... }     // §9 - Release & Patch Management
  aiFeatures: { ... }           // §10 - AI Features Analysis
  incidents: { ... }            // §11 - Security Incidents
  compliance: { ... }           // §12 - Compliance & Certifications
  sources: { ... }              // §3 - Information Sources
  alternatives: [ ... ]         // Alternative products
  allCitations: [ ... ]         // All citation references
}
```

---

## Detailed Field Requirements

### 1. Product Information (§2)

**Purpose**: Basic product identification and description

```typescript
product: {
  name: string                  // Required: Product name
  vendor: string                // Required: Vendor/company name
  category: string              // Required: Product category
  description: string           // Required: Brief description
  usage: string                 // Required: Primary use cases
  website?: string              // Optional: Product website URL
  logo?: string                 // Optional: Logo emoji or URL
}
```

**Example Values**:
- category: "Team Collaboration", "Developer Platform", "Password Manager"
- usage: Brief description of how the product is typically used

---

### 2. Trust Score

**Purpose**: Overall security assessment score with rationale

```typescript
trustScore: {
  score: number                 // Required: 0-100 trust score
  rationale: string             // Required: Explanation of score
  confidence: number            // Required: 0-100 confidence level
}
```

**Scoring Guidelines**:
- 0-40: High risk, major concerns
- 41-65: Moderate risk, several concerns
- 66-80: Good security posture, minor concerns
- 81-100: Excellent security posture

---

### 3. Vendor Information (§1)

**Purpose**: Company background and security reputation

```typescript
vendorInfo: {
  companyName: string           // Required: Full legal name
  headquarters: string          // Required: HQ location
  jurisdiction: string          // Required: Legal jurisdiction
  founded: number               // Required: Year founded
  reputation: {
    score: number               // Required: 0-100 reputation score
    summary: string             // Required: Reputation summary
    sources: Citation[]         // Required: Supporting sources
  }
  securityTrackRecord: string   // Required: Security history
  psirtPage?: string            // Optional: Security advisory URL
}
```

---

### 4. Platform Support (§5)

**Purpose**: Supported platforms and security models

```typescript
platformSupport: {
  platforms: Array<{
    name: 'macOS' | 'Windows' | 'Linux' | 'iOS' | 'Android' | 'Web'
    supported: boolean          // Required: Is platform supported?
    versions?: string           // Optional: Version requirements
    securityModel?: string      // Optional: Platform security model
  }>
  versionDifferences?: string   // Optional: Cross-platform notes
}
```

---

### 5. Data Handling (§6)

**Purpose**: How user data is stored, transmitted, and used

```typescript
dataHandling: {
  storage: {
    location: string            // Required: Data center locations
    regions: string[]           // Required: Geographic regions
    cloudProvider?: string      // Optional: Cloud provider name
    encryptionAtRest: boolean   // Required: At-rest encryption
  }
  transmission: {
    endpoints: string[]         // Required: Network endpoints
    subProcessors: string[]     // Required: Third-party processors
    encryptionInTransit: {
      tls: string               // Required: TLS version
      certVerified: boolean     // Required: Certificate status
    }
  }
  usage: {
    analytics: boolean          // Required: Analytics collection
    advertising: boolean        // Required: Ad targeting
    aiTraining: boolean         // Required: AI training usage
    retentionPolicy: string     // Required: Data retention policy
    userCanDelete: boolean      // Required: User deletion rights
  }
}
```

---

### 6. Permissions (§7)

**Purpose**: Required and optional permissions analysis

```typescript
permissions: {
  required: Array<{
    name: string                // Required: Permission name
    riskLevel: 'low' | 'medium' | 'high'
    justification: string       // Required: Why it's needed
  }>
  optional: Array<{
    name: string                // Required: Permission name
    riskLevel: 'low' | 'medium' | 'high'
    justification: string       // Required: Why it's needed
  }>
  overPermissioningRisk?: string  // Optional: Risk assessment
}
```

**Common Permissions**:
- Internet Access, File System, Notifications (typically required)
- Microphone, Camera, Location, Contacts (typically optional)

---

### 7. Admin Controls (§4)

**Purpose**: Enterprise access management features

```typescript
adminControls: {
  sso: boolean                  // Required: SSO support
  mfa: boolean                  // Required: MFA support
  rbac: boolean                 // Required: Role-based access
  scim: boolean                 // Required: User provisioning
  auditLogs: boolean            // Required: Audit logging
  dataExport: boolean           // Required: Data export capability
}
```

---

### 8. Vulnerabilities (§8)

**Purpose**: CVE history and vulnerability trends

```typescript
vulnerabilities: {
  cveCount: number              // Required: Total CVE count
  trendData: Array<{            // Required: 12-month trend
    month: string               // Format: "YYYY-MM"
    count: number
  }>
  severityBreakdown: {
    critical: number            // Required: Critical CVEs
    high: number                // Required: High severity
    medium: number              // Required: Medium severity
    low: number                 // Required: Low severity
  }
  recentCVEs: Array<{
    id: string                  // Required: CVE ID
    cvss: number                // Required: CVSS score
    severity: string            // Required: Severity level
    description: string         // Required: CVE description
    publishedDate: string       // Required: Publication date
    patched: boolean            // Required: Patch status
  }>
  cisaKEV: boolean              // Required: On CISA KEV list?
}
```

**Trend Data**: Should include 12 months of data for charting

---

### 9. Release Lifecycle (§9)

**Purpose**: Version management and patching practices

```typescript
releaseLifecycle: {
  latestVersion: string         // Required: Current version
  releaseFrequency: string      // Required: Release cadence
  patchCadence: string          // Required: Patching timeline
  eolDates: Array<{
    version: string
    date: string                // Format: "YYYY-MM-DD"
  }>
  ltsVersions: string[]         // Required: LTS versions
  versionHistory: Array<{
    version: string
    releaseDate: string         // Format: "YYYY-MM-DD"
    securityFixes: number       // Number of security fixes
  }>
}
```

---

### 10. AI Features (§10)

**Purpose**: AI/ML capabilities and data usage

```typescript
aiFeatures: {
  hasAI: boolean                // Required: Has AI features?
  features: Array<{
    name: string                // Required: Feature name
    description: string         // Required: Feature description
    dataAccess: string[]        // Required: Data accessed
  }>
  dataUsedForTraining: boolean  // Required: Training usage
  canOptOut: boolean            // Required: Opt-out available?
  processingLocation: 'local' | 'cloud' | 'hybrid'
}
```

---

### 11. Incidents & Breaches (§11)

**Purpose**: Historical security incidents

```typescript
incidents: {
  count: number                 // Required: Total incidents
  timeline: Array<{
    date: string                // Required: Incident date
    title: string               // Required: Incident title
    severity: string            // Required: Severity level
    description: string         // Required: What happened
    impact: string              // Required: Impact description
    resolution: string          // Required: How it was resolved
    sources: Citation[]         // Required: Source citations
  }>
}
```

---

### 12. Compliance (§12)

**Purpose**: Certifications and regulatory compliance

```typescript
compliance: {
  certifications: string[]      // Required: Certification names
  dataHandlingSummary: string   // Required: Compliance summary
  dpa: boolean                  // Required: DPA available?
  sources: Citation[]           // Required: Supporting sources
}
```

**Common Certifications**:
- SOC 2 Type II, ISO 27001, ISO 27018
- GDPR Compliant, CCPA Compliant
- HIPAA, FedRAMP, PCI DSS

---

### 13. Information Sources (§3)

**Purpose**: Source transparency and attribution

```typescript
sources: {
  public: {
    count: number               // Required: Public source count
    types: Array<{
      type: string              // Required: Source type
      count: number             // Required: Count per type
    }>
  }
  confidential: {
    count: number               // Required: Confidential count
    types: Array<{
      type: string              // Required: Source type
      count: number             // Required: Count per type
    }>
  }
}
```

**Common Source Types**:
- Public: Vendor Documentation, CVE Database, Security Blogs, Compliance Reports
- Confidential: Internal Testing, Pentesting Reports, Customer Feedback

---

### 14. Alternatives

**Purpose**: Recommended alternative products

```typescript
alternatives: Array<{
  name: string                  // Required: Product name
  vendor: string                // Required: Vendor name
  trustScore: number            // Required: Trust score
  summary: string               // Required: Brief summary
  whyBetter?: string            // Optional: Why it's better
}>
```

---

### 15. Citations

**Purpose**: All referenced sources

```typescript
allCitations: Citation[]

// Citation type definition:
interface Citation {
  id: string                    // Required: Unique citation ID
  type: 'vendor-stated' | 'independent' | 'compliance-cert' | 'cve-database'
  title: string                 // Required: Citation title
  url?: string                  // Optional: Source URL
  verified: boolean             // Required: Verification status
  date?: string                 // Optional: Date of source
}
```

---

## Data Quality Guidelines

### Required vs Optional Fields
- Fields marked with `?` in TypeScript are optional
- All other fields are required
- Arrays can be empty `[]` but must exist
- Boolean fields must be explicitly `true` or `false`

### Data Freshness
- Timestamps should be in ISO 8601 format
- CVE trend data should cover 12 months
- Version history should include recent releases
- Incident timeline should be chronological (newest first)

### Source Attribution
- Every claim should have a citation
- Mix of vendor-stated and independent sources
- Verified sources preferred
- Include URLs when available

### Scoring Consistency
- Trust scores should align with findings
- Confidence reflects data quality
- Vendor reputation influences trust score
- Recent incidents lower trust score

---

## Integration Notes

### For Backend Implementation
1. This schema maps to the TypeScript types in `types.ts`
2. All data should be validated against these types
3. API responses should match the `Assessment` interface
4. Consider implementing partial updates for large objects

### Data Collection Strategy
1. Automated: CVE databases, public APIs
2. Manual: Vendor documentation review
3. Proprietary: Internal testing, pentests
4. Community: Security researcher reports

### Performance Considerations
- Full assessments can be large (~50-100KB JSON)
- Consider caching frequently accessed assessments
- Implement report size filtering (small/medium/full)
- Lazy-load heavy sections (incident timeline, version history)

