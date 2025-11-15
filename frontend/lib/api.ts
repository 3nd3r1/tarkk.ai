// ============================================================================
// API Client - Integrated with OpenAPI Specification
// ============================================================================

import { Assessment, DashboardStats } from './types';

// ============================================================================
// API Types (based on OpenAPI spec)
// ============================================================================

export type AssessmentStatus = 'queued' | 'in_progress' | 'completed' | 'failed';
export type AssessmentType = 'small' | 'medium' | 'large';
export type EntityCategory = 'filesharing' | 'chat' | 'gen_ai_tool' | 'crm';

export interface AssessmentInputData {
  name: string;
  vendor_name?: string | null;
  url?: string | null;
}

export interface EntityVendor {
  name: string;
  website?: string | null;
  logo_url?: string | null;
}

export interface Entity {
  name: string;
  vendor: EntityVendor;
  category: EntityCategory;
  description: string;
  usage: string;
  website?: string | null;
  logo_url?: string | null;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postal_code?: string | null;
}

export interface Vendor {
  name: string;
  website?: string | null;
  logo_url?: string | null;
  location?: Location | null;
  founded_year?: number | null;
  employee_count?: number | null;
  revenue?: string | null;
  privacy_policy_url?: string | null;
  terms_of_service_url?: string | null;
  security_contact?: string | null;
  parent_company?: string | null;
  subsidiaries?: string[];
  industry?: string | null;
  business_model?: string | null;
  key_executives?: string[];
}

export interface ApiAssessment {
  id: string; // UUID
  input_data: AssessmentInputData;
  assessment_type: AssessmentType;
  assessment_status: AssessmentStatus;
  entity?: Entity | null;
  vendor?: Vendor | null;
  // Extended fields that may be present in completed assessments
  [key: string]: any;
}

export interface AssessmentCreateRequest {
  name: string;
  vendor_name?: string | null;
  url?: string | null;
  assessment_type?: AssessmentType;
}

export interface AssessmentCreateResponse {
  assessment_id: string; // UUID
  status: string;
}

export interface AssessmentStatusResponse {
  status: AssessmentStatus;
  [key: string]: any;
}

// ============================================================================
// API Configuration
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ============================================================================
// API Client Utilities
// ============================================================================

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw new ApiError(
        errorData.message || `API request failed: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      error
    );
  }
}

// ============================================================================
// Mapping Functions: API Response -> Frontend Types
// ============================================================================

function mapApiAssessmentToFrontend(apiAssessment: ApiAssessment): Assessment {
  const entity = apiAssessment.entity;
  const vendor = apiAssessment.vendor;
  
  // Extract basic product info
  const productName = entity?.name || apiAssessment.input_data.name;
  const vendorName = vendor?.name || entity?.vendor?.name || apiAssessment.input_data.vendor_name || 'Unknown';
  const category = entity?.category || 'Unknown';
  
  // Map category enum to display name
  const categoryMap: Record<EntityCategory, string> = {
    filesharing: 'File Sharing',
    chat: 'Team Collaboration',
    gen_ai_tool: 'AI Tools',
    crm: 'CRM',
  };

  // Create a default assessment structure
  // Note: The API may not return all fields until the assessment is completed
  const assessment: Assessment = {
    id: apiAssessment.id,
    timestamp: new Date().toISOString(), // API doesn't provide timestamp, use current
    cached: apiAssessment.assessment_status === 'completed',
    status: apiAssessment.assessment_status,
    product: {
      name: productName,
      vendor: vendorName,
      category: categoryMap[category as EntityCategory] || category,
      description: entity?.description || `Assessment for ${productName}`,
      usage: entity?.usage || 'Not specified',
      website: entity?.website || vendor?.website || apiAssessment.input_data.url || undefined,
      logo: entity?.logo_url || vendor?.logo_url || undefined,
    },
    trustScore: {
      score: apiAssessment.trust_score?.score || 0,
      rationale: apiAssessment.trust_score?.rationale || 'Assessment in progress',
      confidence: apiAssessment.trust_score?.confidence || 0,
    },
    vendorInfo: {
      companyName: vendor?.name || vendorName,
      headquarters: vendor?.location 
        ? `${vendor.location.city || ''}${vendor.location.country ? `, ${vendor.location.country}` : ''}`.trim() || 'Not specified'
        : 'Not specified',
      jurisdiction: vendor?.location?.country || 'Not specified',
      founded: vendor?.founded_year || 0,
      reputation: {
        score: 0,
        summary: vendor?.industry || 'Information not available',
        sources: [],
      },
      securityTrackRecord: vendor?.security_contact ? 'Contact information available' : 'Not specified',
      psirtPage: vendor?.security_contact || undefined,
    },
    platformSupport: {
      platforms: apiAssessment.platform_support?.platforms || [],
      versionDifferences: apiAssessment.platform_support?.version_differences,
    },
    dataHandling: {
      storage: {
        location: apiAssessment.data_handling?.storage?.location || 'Not specified',
        regions: apiAssessment.data_handling?.storage?.regions || [],
        cloudProvider: apiAssessment.data_handling?.storage?.cloud_provider,
        encryptionAtRest: apiAssessment.data_handling?.storage?.encryption_at_rest || false,
      },
      transmission: {
        endpoints: apiAssessment.data_handling?.transmission?.endpoints || [],
        subProcessors: apiAssessment.data_handling?.transmission?.sub_processors || [],
        encryptionInTransit: {
          tls: apiAssessment.data_handling?.transmission?.encryption_in_transit?.tls || 'Not specified',
          certVerified: apiAssessment.data_handling?.transmission?.encryption_in_transit?.cert_verified || false,
        },
      },
      usage: {
        analytics: apiAssessment.data_handling?.usage?.analytics || false,
        advertising: apiAssessment.data_handling?.usage?.advertising || false,
        aiTraining: apiAssessment.data_handling?.usage?.ai_training || false,
        retentionPolicy: apiAssessment.data_handling?.usage?.retention_policy || 'Not specified',
        userCanDelete: apiAssessment.data_handling?.usage?.user_can_delete || false,
      },
    },
    permissions: {
      required: apiAssessment.permissions?.required || [],
      optional: apiAssessment.permissions?.optional || [],
      overPermissioningRisk: apiAssessment.permissions?.over_permissioning_risk,
    },
    adminControls: {
      sso: apiAssessment.admin_controls?.sso || false,
      mfa: apiAssessment.admin_controls?.mfa || false,
      rbac: apiAssessment.admin_controls?.rbac || false,
      scim: apiAssessment.admin_controls?.scim || false,
      auditLogs: apiAssessment.admin_controls?.audit_logs || false,
      dataExport: apiAssessment.admin_controls?.data_export || false,
    },
    vulnerabilities: {
      cveCount: apiAssessment.vulnerabilities?.cve_count || 0,
      trendData: apiAssessment.vulnerabilities?.trend_data || [],
      severityBreakdown: {
        critical: apiAssessment.vulnerabilities?.severity_breakdown?.critical || 0,
        high: apiAssessment.vulnerabilities?.severity_breakdown?.high || 0,
        medium: apiAssessment.vulnerabilities?.severity_breakdown?.medium || 0,
        low: apiAssessment.vulnerabilities?.severity_breakdown?.low || 0,
      },
      recentCVEs: apiAssessment.vulnerabilities?.recent_cves || [],
      cisaKEV: apiAssessment.vulnerabilities?.cisa_kev || false,
    },
    releaseLifecycle: {
      latestVersion: apiAssessment.release_lifecycle?.latest_version || 'Not specified',
      releaseFrequency: apiAssessment.release_lifecycle?.release_frequency || 'Not specified',
      patchCadence: apiAssessment.release_lifecycle?.patch_cadence || 'Not specified',
      eolDates: apiAssessment.release_lifecycle?.eol_dates || [],
      ltsVersions: apiAssessment.release_lifecycle?.lts_versions || [],
      versionHistory: apiAssessment.release_lifecycle?.version_history || [],
    },
    aiFeatures: {
      hasAI: apiAssessment.ai_features?.has_ai || false,
      features: apiAssessment.ai_features?.features || [],
      dataUsedForTraining: apiAssessment.ai_features?.data_used_for_training || false,
      canOptOut: apiAssessment.ai_features?.can_opt_out || false,
      processingLocation: apiAssessment.ai_features?.processing_location || 'cloud',
    },
    incidents: {
      count: apiAssessment.incidents?.count || 0,
      timeline: apiAssessment.incidents?.timeline || [],
    },
    compliance: {
      certifications: apiAssessment.compliance?.certifications || [],
      dataHandlingSummary: apiAssessment.compliance?.data_handling_summary || 'Not specified',
      dpa: apiAssessment.compliance?.dpa || false,
      sources: apiAssessment.compliance?.sources || [],
    },
    sources: {
      public: {
        count: apiAssessment.sources?.public?.count || 0,
        types: apiAssessment.sources?.public?.types || [],
      },
      confidential: {
        count: apiAssessment.sources?.confidential?.count || 0,
        types: apiAssessment.sources?.confidential?.types || [],
      },
    },
    alternatives: apiAssessment.alternatives || [],
    allCitations: apiAssessment.all_citations || [],
  };

  return assessment;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Health check endpoint
 */
export async function healthCheck(): Promise<any> {
  return apiRequest<any>('/api/v1/health');
}

/**
 * Get all assessments
 */
export async function getAllAssessments(): Promise<Assessment[]> {
  try {
    const apiAssessments = await apiRequest<ApiAssessment[]>('/api/v1/assessments');
    return apiAssessments.map(mapApiAssessmentToFrontend);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    // Return empty array on error to prevent UI crashes
    return [];
  }
}

/**
 * Get a single assessment by ID
 * Note: The API uses integer IDs in the path, but UUIDs in responses
 * We'll try both formats for compatibility
 */
export async function getAssessment(id: string): Promise<Assessment | null> {
  try {
    // First, try to find by UUID in all assessments (most common case)
    // This handles the case where routes use UUIDs
    const allAssessments = await getAllAssessments();
    const foundByUuid = allAssessments.find(a => a.id === id);
    if (foundByUuid) {
      return foundByUuid;
    }
    
    // If not found by UUID, try to parse as integer (API path parameter)
    const assessmentId = parseInt(id, 10);
    if (!isNaN(assessmentId)) {
      try {
        const apiAssessment = await apiRequest<ApiAssessment>(`/api/v1/assessments/${assessmentId}`);
        return mapApiAssessmentToFrontend(apiAssessment);
      } catch (error) {
        // If integer lookup fails, return null
        console.warn(`Assessment not found with integer ID ${assessmentId}`);
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching assessment ${id}:`, error);
    return null;
  }
}

/**
 * Create a new assessment
 */
export async function createAssessment(
  request: AssessmentCreateRequest
): Promise<AssessmentCreateResponse> {
  return apiRequest<AssessmentCreateResponse>('/api/v1/assessments', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Delete an assessment
 */
export async function deleteAssessment(assessmentId: number): Promise<void> {
  await apiRequest<void>(`/api/v1/assessments/${assessmentId}`, {
    method: 'DELETE',
  });
}

/**
 * Get assessment status
 */
export async function getAssessmentStatus(
  assessmentId: number
): Promise<AssessmentStatusResponse> {
  return apiRequest<AssessmentStatusResponse>(`/api/v1/assessments/${assessmentId}/status`);
}

/**
 * Generate assessment report
 */
export async function generateAssessmentReport(assessmentId: number): Promise<any> {
  return apiRequest<any>(`/api/v1/assessments/${assessmentId}/report`, {
    method: 'PUT',
  });
}

/**
 * Export assessment report
 */
export async function exportAssessmentReport(
  assessmentId: number,
  format: string
): Promise<any> {
  return apiRequest<any>(
    `/api/v1/assessments/${assessmentId}/report/export?format=${encodeURIComponent(format)}`,
    {
      method: 'PUT',
    }
  );
}

// ============================================================================
// Frontend Helper Functions (maintain backward compatibility)
// ============================================================================

/**
 * Search assessments by query
 * Note: This is a client-side filter since the API doesn't have a search endpoint
 */
export async function searchAssessments(query: string): Promise<Assessment[]> {
  const allAssessments = await getAllAssessments();
  
  if (!query) {
    return allAssessments;
  }
  
  const lowercaseQuery = query.toLowerCase();
  return allAssessments.filter(
    (a) =>
      a.product.name.toLowerCase().includes(lowercaseQuery) ||
      a.product.vendor.toLowerCase().includes(lowercaseQuery) ||
      a.product.category.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const assessments = await getAllAssessments();
  
  const completedAssessments = assessments.filter((a) => a.cached);
  const totalScore = completedAssessments.reduce(
    (sum, a) => sum + a.trustScore.score,
    0
  );
  
  return {
    totalAssessments: assessments.length,
    averageTrustScore:
      completedAssessments.length > 0
        ? Math.round(totalScore / completedAssessments.length)
        : 0,
    recentAssessments: assessments
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 4),
  };
}

/**
 * Get search suggestions
 * Note: This is a client-side implementation since the API doesn't have a suggestions endpoint
 */
export async function getSearchSuggestions(query: string): Promise<string[]> {
  const assessments = await getAllAssessments();
  const productNames = Array.from(new Set(assessments.map((a) => a.product.name)));
  
  if (!query) {
    return productNames.slice(0, 5);
  }
  
  const lowercaseQuery = query.toLowerCase();
  return productNames
    .filter((name) => name.toLowerCase().includes(lowercaseQuery))
    .slice(0, 5);
}

/**
 * Compare multiple assessments
 */
export async function compareAssessments(ids: string[]): Promise<Assessment[]> {
  const allAssessments = await getAllAssessments();
  return allAssessments.filter((a) => ids.includes(a.id));
}
