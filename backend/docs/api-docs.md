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

## GET /assessments/{id}

**Response:**

Assessment Schema

**Status Codes:**

- `200 OK` - Assessment retrieved successfully
- `404 Not Found` - Assessment ID not found
- `202 Accepted` - Assessment still processing (partial data returned)

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
```

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
  "assessments": []
}
```

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

## Authentication (Future)

Currently not implemented, but placeholder for future:

**Header:**

```
Authorization: Bearer <api_token>
```

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
