# API Design

## Base URL

`http://localhost:8000/api/v1`

## Endpoints

### Assessment

- `POST /assessments` - Create assessment
- `GET /assessments/{id}` - Get full assessment
- `GET /assessments/{id}/status` - Poll status
- `GET /assessments` - List all
- `DELETE /assessments/{id}` - Delete

### Report

- `GET /assessments/{id}/report` - Formatted report
- `GET /assessments/{id}/report/export?format=pdf` - Export

### Compare

- `POST /compare` - Compare apps

---

## POST /assessments

**Request:**

```json
{
  "input": "Slack",
  "input_type": "name", // "name" | "url" | "vendor"
  "report_type": "medium", // "short" | "medium" | "long" | "enterprise"
  "use_cache": true
}
```

**Response (202):**

```json
{
  "assessment_id": "uuid-1234",
  "status": "processing",
  "created_at": "2025-11-15T10:30:00Z"
}
```

---

## GET /assessments/{id}/status

**Response:**

```json
{
  "status": "processing", // "queued" | "processing" | "completed" | "failed"
  "progress": {
    "current_agent": "CVE Agent",
    "percentage": 30
  }
}
```

---

## GET /assessments/{id}

**Response:**

```json
{
  "assessment_id": "uuid-1234-5678",
  "status": "completed",
  "created_at": "2025-11-15T10:30:00Z",
  "completed_at": "2025-11-15T10:32:00Z",
  "input": {
    "original_input": "Slack",
    "input_type": "name",
    "report_type": "medium"
  },
  "entity": {
    "app_name": "Slack",
    "vendor_name": "Slack Technologies, LLC",
    "official_url": "https://slack.com",
    "category": "Team Collaboration",
    "taxonomy": "SaaS Communication Platform",
    "aliases": ["Slack Workspace", "Slack Enterprise Grid"]
  },
  "vendor_information": {
    "company_name": "Slack Technologies, LLC",
    "parent_company": "Salesforce, Inc.",
    "headquarters": "San Francisco, CA, USA",
    "country": "United States",
    "founded": "2013",
    "employee_count": "2,500+",
    "public_private": "public",
    "stock_ticker": "CRM (Salesforce)",
    "reputation_score": 85,
    "sources": [
      {
        "type": "vendor_stated",
        "url": "https://slack.com/about",
        "accessed_at": "2025-11-15T10:30:15Z"
      }
    ]
  },
  "app_information": {
    "description": "Slack is a channel-based messaging platform for team collaboration...",
    "platforms": ["Web", "Windows", "macOS", "Linux", "iOS", "Android"],
    "authentication": {
      "mfa_supported": true,
      "sso_supported": true,
      "sso_protocols": ["SAML 2.0", "OAuth 2.0"],
      "password_requirements": "enterprise_configurable"
    },
    "permissions_required": {
      "desktop": ["notifications", "file_access"],
      "mobile": ["camera", "microphone", "storage", "notifications"],
      "elevated_privileges": false
    },
    "ai_features": {
      "has_ai": true,
      "features": ["Slack AI", "Search summaries", "Thread summaries"],
      "ai_data_usage": "opt-in"
    },
    "versioning": {
      "current_version": "4.35.126",
      "last_update": "2025-11-10",
      "update_frequency": "weekly",
      "automatic_updates": true
    },
    "sources": [
      {
        "type": "vendor_stated",
        "url": "https://slack.com/downloads",
        "accessed_at": "2025-11-15T10:30:20Z"
      }
    ]
  },
  "compliance": {
    "certifications": [
      {
        "name": "SOC 2 Type II",
        "status": "certified",
        "last_audit": "2024-09-15",
        "attestation_url": "https://slack.com/trust/compliance"
      },
      {
        "name": "ISO/IEC 27001",
        "status": "certified",
        "certificate_number": "ISO-12345",
        "expiry": "2026-08-30"
      },
      {
        "name": "ISO/IEC 27017",
        "status": "certified"
      },
      {
        "name": "ISO/IEC 27018",
        "status": "certified"
      }
    ],
    "gdpr_compliance": {
      "compliant": true,
      "dpa_available": true,
      "dpa_url": "https://slack.com/trust/data-processing-addendum",
      "data_subject_rights": [
        "access",
        "rectification",
        "erasure",
        "portability"
      ],
      "dpo_contact": "privacy@slack.com"
    },
    "data_storage": {
      "regions": ["US", "EU", "APAC"],
      "customer_choice": true,
      "data_residency_options": ["US", "Germany", "Australia", "Japan"],
      "encryption_at_rest": "AES-256",
      "encryption_in_transit": "TLS 1.2+"
    },
    "data_policies": {
      "retention_period": "configurable",
      "deletion_policy": "within 30 days of request",
      "backup_retention": "90 days",
      "data_portability": true
    },
    "sources": [
      {
        "type": "independent",
        "url": "https://slack.com/trust",
        "accessed_at": "2025-11-15T10:30:25Z"
      }
    ]
  },
  "vulnerabilities": {
    "cve_summary": {
      "total_cves": 23,
      "critical": 1,
      "high": 4,
      "medium": 12,
      "low": 6,
      "last_12_months": 3,
      "trend": "decreasing",
      "avg_time_to_patch_days": 14
    },
    "recent_cves": [
      {
        "cve_id": "CVE-2024-12345",
        "severity": "high",
        "cvss_score": 7.5,
        "published": "2024-10-15",
        "patched": "2024-10-22",
        "description": "Authentication bypass in mobile app",
        "affected_versions": ["4.30.x - 4.32.x"],
        "patch_version": "4.33.0"
      }
    ],
    "cisa_kev": {
      "listed": false,
      "entries": []
    },
    "sources": [
      {
        "type": "independent",
        "url": "https://nvd.nist.gov/vuln/search",
        "accessed_at": "2025-11-15T10:30:30Z"
      },
      {
        "type": "independent",
        "url": "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
        "accessed_at": "2025-11-15T10:30:35Z"
      }
    ]
  },
  "incidents": {
    "total_incidents": 2,
    "breaches": [
      {
        "date": "2022-12-31",
        "type": "unauthorized_access",
        "affected_users": "~0.5% of users",
        "data_compromised": ["email addresses", "hashed passwords"],
        "vendor_response": "Immediate password reset, security audit conducted",
        "resolution_time_days": 7,
        "public_disclosure": "https://slack.com/security-incident-2022"
      }
    ],
    "abuse_signals": {
      "phishing_campaigns": 3,
      "malware_distribution": 0,
      "spam_reports": "low"
    },
    "bug_bounty": {
      "program_exists": true,
      "platform": "HackerOne",
      "url": "https://hackerone.com/slack",
      "total_reports": 450,
      "resolved": 420
    },
    "sources": [
      {
        "type": "vendor_stated",
        "url": "https://slack.com/security-incident-2022",
        "accessed_at": "2025-11-15T10:30:40Z"
      },
      {
        "type": "independent",
        "url": "https://haveibeenpwned.com",
        "accessed_at": "2025-11-15T10:30:45Z"
      }
    ]
  },
  "security_rating": {
    "trust_score": 78,
    "risk_score": 22,
    "confidence": "high",
    "rationale": {
      "positive_factors": [
        "Strong compliance certifications (SOC 2, ISO 27001)",
        "Active bug bounty program with high resolution rate",
        "Fast CVE patching (avg 14 days)",
        "Comprehensive security documentation"
      ],
      "negative_factors": [
        "Historical security incident in 2022",
        "1 critical CVE in past 24 months",
        "Wide permission requirements on mobile"
      ],
      "neutral_factors": [
        "Large attack surface due to platform diversity",
        "Owned by Salesforce (reduced autonomy)"
      ]
    },
    "scoring_breakdown": {
      "compliance": 20,
      "vulnerabilities": 15,
      "incidents": 12,
      "vendor_reputation": 18,
      "security_features": 13
    },
    "vendor_vs_independent": {
      "vendor_claims_verified": 18,
      "vendor_claims_unverified": 2,
      "independent_sources": 15
    },
    "data_sufficiency": "sufficient",
    "sources": [
      {
        "type": "analysis",
        "description": "Aggregated from all agent outputs"
      }
    ]
  },
  "alternatives": [
    {
      "name": "Microsoft Teams",
      "vendor": "Microsoft Corporation",
      "trust_score": 82,
      "rationale": "Higher trust score due to Microsoft's security infrastructure and compliance. Better integration with Microsoft 365 security features.",
      "security_advantages": [
        "Advanced Threat Protection included",
        "More granular permission controls",
        "Better data loss prevention features"
      ],
      "considerations": [
        "Requires Microsoft 365 subscription for full features",
        "Steeper learning curve"
      ]
    },
    {
      "name": "Mattermost",
      "vendor": "Mattermost, Inc.",
      "trust_score": 75,
      "rationale": "Open-source alternative with self-hosting option provides full data control. Lower trust score due to smaller vendor and community-driven security.",
      "security_advantages": [
        "Self-hosting option for complete data control",
        "Open-source transparency",
        "No AI features (data privacy)"
      ],
      "considerations": [
        "Requires infrastructure management for self-hosted",
        "Smaller security team than enterprise vendors"
      ]
    }
  ],
  "cache_info": {
    "cached": false,
    "cache_timestamp": null,
    "data_freshness": "real-time"
  },
  "metadata": {
    "report_type": "medium",
    "generation_time_seconds": 120,
    "total_sources": 42,
    "agent_execution_order": [
      "Entity Resolution Agent",
      "Vendor Information Agent",
      "App Information Agent",
      "Compliance Document Agent",
      "CISA KEV Agent",
      "CVE Agent",
      "Incident Breach Agent",
      "Security Rating Agent",
      "Alternative Agent",
      "Report Generator Agent"
    ]
  }
}
```

**Status Codes:**

- `200 OK` - Assessment retrieved successfully
- `404 Not Found` - Assessment ID not found
- `202 Accepted` - Assessment still processing (partial data returned)

---

### 4. Get Formatted Report

**Endpoint:** `GET /api/v1/assessments/{assessment_id}/report`

**Description:** Get human-readable report (for display in UI)

**Query Parameters:**

- `format` (string, default: "json") - "json", "markdown", "html"

**Response (markdown format):**

```json
{
  "assessment_id": "uuid-1234-5678",
  "format": "markdown",
  "content": "# Security Assessment Report\n\n## Slack\n\n**Assessment Date:** November 15, 2025...",
  "generated_at": "2025-11-15T10:32:00Z"
}
```

---

### 5. Export Report

**Endpoint:** `GET /api/v1/assessments/{assessment_id}/report/export`

**Description:** Export report to PDF or DOCX

**Query Parameters:**

- `format` (string, required) - "pdf" or "docx"

**Response:**

- Content-Type: `application/pdf` or `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Binary file download

**Status Codes:**

- `200 OK` - File download
- `404 Not Found` - Assessment not found

---

### 6. List Assessments

**Endpoint:** `GET /api/v1/assessments`

**Description:** List all assessments with pagination

**Query Parameters:**

- `page` (integer, default: 1)
- `page_size` (integer, default: 20, max: 100)
- `status` (string, optional) - Filter by status: "completed", "processing", "failed"
- `sort_by` (string, default: "created_at") - "created_at", "app_name", "trust_score"
- `sort_order` (string, default: "desc") - "asc", "desc"

**Response:**

```json
{
  "total": 145,
  "page": 1,
  "page_size": 20,
  "total_pages": 8,
  "assessments": [
    {
      "assessment_id": "uuid-1234-5678",
      "app_name": "Slack",
      "vendor_name": "Slack Technologies, LLC",
      "status": "completed",
      "trust_score": 78,
      "risk_score": 22,
      "created_at": "2025-11-15T10:30:00Z",
      "completed_at": "2025-11-15T10:32:00Z",
      "report_type": "medium"
    }
  ]
}
```

---

### 7. Compare Applications

**Endpoint:** `POST /api/v1/compare`

**Description:** Compare security posture of multiple applications side-by-side

**Request Body:**

```json
{
  "assessment_ids": ["uuid-1234-5678", "uuid-8765-4321"]
}
```

**Response:**

```json
{
  "comparison_id": "comp-uuid-9999",
  "created_at": "2025-11-15T10:35:00Z",
  "applications": [
    {
      "assessment_id": "uuid-1234-5678",
      "app_name": "Slack",
      "trust_score": 78,
      "summary": {
        "compliance": "strong",
        "vulnerabilities": "moderate",
        "incidents": "low"
      }
    },
    {
      "assessment_id": "uuid-8765-4321",
      "app_name": "Microsoft Teams",
      "trust_score": 82,
      "summary": {
        "compliance": "strong",
        "vulnerabilities": "low",
        "incidents": "very_low"
      }
    }
  ],
  "comparison": {
    "winner": "Microsoft Teams",
    "key_differences": [
      {
        "category": "vulnerabilities",
        "slack": "23 CVEs total, 1 critical",
        "microsoft_teams": "15 CVEs total, 0 critical"
      }
    ],
    "recommendation": "Microsoft Teams shows stronger security posture with fewer vulnerabilities and better incident history."
  }
}
```

---

### 8. Check Cache

**Endpoint:** `GET /api/v1/cache/{app_name}`

**Description:** Check if cached assessment exists for an application

**Response:**

```json
{
  "exists": true,
  "app_name": "Slack",
  "cached_at": "2025-11-14T15:20:00Z",
  "age_hours": 19,
  "assessment_id": "uuid-1234-5678",
  "stale": false,
  "stale_threshold_hours": 168
}
```

---

### 9. Delete Assessment

**Endpoint:** `DELETE /api/v1/assessments/{assessment_id}`

**Description:** Delete an assessment and its cached data

**Response:**

```json
{
  "message": "Assessment deleted successfully",
  "assessment_id": "uuid-1234-5678"
}
```

**Status Codes:**

- `200 OK` - Deleted successfully
- `404 Not Found` - Assessment not found

---

## WebSocket Support (Optional Enhancement)

For real-time progress updates instead of polling:

**WebSocket Endpoint:** `ws://localhost:8000/api/v1/assessments/{assessment_id}/stream`

**Messages Received:**

```json
{
  "type": "progress",
  "agent": "CVE Agent",
  "status": "running",
  "percentage": 45,
  "timestamp": "2025-11-15T10:31:15Z"
}
```

```json
{
  "type": "completed",
  "assessment_id": "uuid-1234-5678",
  "timestamp": "2025-11-15T10:32:00Z"
}
```

---

## Error Responses

All endpoints use consistent error format:

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Application name cannot be empty",
    "details": {
      "field": "input",
      "reason": "required_field_missing"
    },
    "request_id": "req-uuid-1111"
  }
}
```

**Common Error Codes:**

- `INVALID_INPUT` - Validation error
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `PROCESSING_ERROR` - Agent execution failed
- `EXTERNAL_API_ERROR` - Upstream service failure
- `INSUFFICIENT_DATA` - Not enough public information available

---

## Rate Limiting

All endpoints are rate-limited:

- **Anonymous:** 10 requests/minute
- **Authenticated:** 100 requests/minute

Headers returned:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699876800
```

---

## Authentication (Future)

Currently not implemented, but placeholder for future:

**Header:**

```
Authorization: Bearer <api_token>
```

---

## UI Data Flow Examples

### Example 1: Creating and Displaying Assessment

```javascript
// Step 1: Create assessment
const response = await fetch("/api/v1/assessments", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    input: "Slack",
    input_type: "name",
    report_type: "medium",
    use_cache: true,
  }),
});

const { assessment_id } = await response.json();

// Step 2: Poll for status
const pollStatus = async () => {
  const statusResponse = await fetch(
    `/api/v1/assessments/${assessment_id}/status`,
  );
  const status = await statusResponse.json();

  // Update UI progress bar
  updateProgressBar(status.progress.percentage);
  updateCurrentAgent(status.progress.current_agent);

  if (status.status === "completed") {
    clearInterval(pollInterval);
    loadFullReport();
  }
};

const pollInterval = setInterval(pollStatus, 2000);

// Step 3: Load full report
const loadFullReport = async () => {
  const reportResponse = await fetch(`/api/v1/assessments/${assessment_id}`);
  const report = await reportResponse.json();

  // Display in UI
  displayTrustScore(report.security_rating.trust_score);
  displayVendorInfo(report.vendor_information);
  displayCompliance(report.compliance);
  displayVulnerabilities(report.vulnerabilities);
  displayAlternatives(report.alternatives);
};
```

### Example 2: Comparing Applications

```javascript
// User selects two assessments to compare
const compareResponse = await fetch("/api/v1/compare", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    assessment_ids: [slackAssessmentId, teamsAssessmentId],
  }),
});

const comparison = await compareResponse.json();

// Display comparison view
displaySideBySideComparison(comparison.applications);
highlightKeyDifferences(comparison.comparison.key_differences);
showRecommendation(comparison.comparison.recommendation);
```

---

## Data Size Estimates

**Typical Response Sizes:**

- Short report: ~50-100 KB
- Medium report: ~150-300 KB
- Long report: ~400-600 KB
- Enterprise report: ~800 KB - 1.5 MB

**Performance Targets:**

- Assessment creation: < 500ms
- Full assessment completion: 90-180 seconds
- Report retrieval: < 200ms
- Comparison: < 1 second
