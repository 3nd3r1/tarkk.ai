// ============================================================================
// Tarkist.us - Complete Type System
// Covers all 15 framework sections from IMPLEMENTATION_SUMMARY.md
// ============================================================================

// Supporting Types
export interface Citation {
  id: string;
  type: 'vendor-stated' | 'independent' | 'compliance-cert' | 'cve-database';
  title: string;
  url?: string;
  verified: boolean;
  date?: string;
}

// §13 - Report Size Configuration
export type ReportSize = 'small' | 'medium' | 'full' | 'enterprise';

export interface ReportConfig {
  size: ReportSize;
  estimatedReadTime: string; // "2 min", "5 min", "10 min", "15+ min"
  expandedSections: string[];
}

// Core Assessment Interface (Root)
export interface Assessment {
  id: string;
  timestamp: string;
  cached: boolean;
  status?: 'queued' | 'in_progress' | 'completed' | 'failed';
  
  // §2 - Product Information
  product: {
    name: string;
    vendor: string;
    category: string;
    description: string;
    usage: string;
    website?: string;
    logo?: string;
  };
  
  // Trust Score (derived from all sections)
  trustScore: {
    score: number; // 0-100
    rationale: string;
    confidence: number; // 0-100
  };
  
  // §1 - Vendor Information
  vendorInfo: {
    companyName: string;
    headquarters: string;
    jurisdiction: string;
    founded: number;
    reputation: {
      score: number; // 0-100
      summary: string;
      sources: Citation[];
    };
    securityTrackRecord: string;
    psirtPage?: string;
  };
  
  // §5 - Platform Support
  platformSupport: {
    platforms: Array<{
      name: 'macOS' | 'Windows' | 'Linux' | 'iOS' | 'Android' | 'Web';
      supported: boolean;
      versions?: string;
      securityModel?: string;
    }>;
    versionDifferences?: string;
  };
  
  // §6 - Data Handling
  dataHandling: {
    storage: {
      location: string;
      regions: string[];
      cloudProvider?: string;
      encryptionAtRest: boolean;
    };
    transmission: {
      endpoints: string[];
      subProcessors: string[];
      encryptionInTransit: { tls: string; certVerified: boolean };
    };
    usage: {
      analytics: boolean;
      advertising: boolean;
      aiTraining: boolean;
      retentionPolicy: string;
      userCanDelete: boolean;
    };
  };
  
  // §7 - Permissions
  permissions: {
    required: Array<{
      name: string;
      riskLevel: 'low' | 'medium' | 'high';
      justification: string;
    }>;
    optional: Array<{
      name: string;
      riskLevel: 'low' | 'medium' | 'high';
      justification: string;
    }>;
    overPermissioningRisk?: string;
  };
  
  // §4 - Admin Controls (User & Access Management)
  adminControls: {
    sso: boolean;
    mfa: boolean;
    rbac: boolean;
    scim: boolean;
    auditLogs: boolean;
    dataExport: boolean;
  };
  
  // §8 - Vulnerabilities (CVE Analysis)
  vulnerabilities: {
    cveCount: number;
    trendData: { month: string; count: number }[];
    severityBreakdown: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    recentCVEs: Array<{
      id: string;
      cvss: number;
      severity: string;
      description: string;
      publishedDate: string;
      patched: boolean;
    }>;
    cisaKEV: boolean;
  };
  
  // §9 - Release Lifecycle
  releaseLifecycle: {
    latestVersion: string;
    releaseFrequency: string;
    patchCadence: string;
    eolDates: Array<{ version: string; date: string }>;
    ltsVersions: string[];
    versionHistory: Array<{
      version: string;
      releaseDate: string;
      securityFixes: number;
    }>;
  };
  
  // §10 - AI Features
  aiFeatures: {
    hasAI: boolean;
    features: Array<{
      name: string;
      description: string;
      dataAccess: string[];
    }>;
    dataUsedForTraining: boolean;
    canOptOut: boolean;
    processingLocation: 'local' | 'cloud' | 'hybrid';
  };
  
  // §11 - Incidents & Breaches
  incidents: {
    count: number;
    timeline: Array<{
      date: string;
      title: string;
      severity: string;
      description: string;
      impact: string;
      resolution: string;
      sources: Citation[];
    }>;
  };
  
  // §12 - Compliance
  compliance: {
    certifications: string[];
    dataHandlingSummary: string;
    dpa: boolean;
    sources: Citation[];
  };
  
  // §3 - Information Sources
  sources: {
    public: {
      count: number;
      types: Array<{ type: string; count: number }>;
    };
    confidential: {
      count: number;
      types: Array<{ type: string; count: number }>;
    };
  };
  
  // Alternatives & Recommendations
  alternatives: Array<{
    name: string;
    vendor: string;
    trustScore: number;
    summary: string;
    whyBetter?: string;
  }>;
  
  // All citations (§3 detailed)
  allCitations: Citation[];
}

// Dashboard Stats
export interface DashboardStats {
  totalAssessments: number;
  averageTrustScore: number;
  recentAssessments: Assessment[];
}
