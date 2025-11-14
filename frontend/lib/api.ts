// ============================================================================
// Mock API Client - Ready for Backend Integration
// Contains sample assessments for Slack, GitHub, Signal, and Jira
// ============================================================================

import { Assessment, DashboardStats } from './types';

// Mock delay to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// Mock Assessment Data (§15 - Example Targets)
// ============================================================================

const mockAssessments: Assessment[] = [
  {
    id: 'slack-001',
    timestamp: '2024-11-14T10:30:00Z',
    cached: false,
    product: {
      name: 'Slack',
      vendor: 'Salesforce',
      category: 'Team Collaboration',
      description: 'Cloud-based team communication and collaboration platform with channels, direct messaging, and extensive integrations.',
      usage: 'Internal team communication, project coordination, file sharing, workflow automation',
      website: 'https://slack.com',
      logo: '🟣'
    },
    trustScore: {
      score: 78,
      rationale: 'Strong enterprise features with SOC2 compliance, but concerns around extensive data access and AI training practices.',
      confidence: 85
    },
    vendorInfo: {
      companyName: 'Slack Technologies (Salesforce)',
      headquarters: 'San Francisco, CA, USA',
      jurisdiction: 'United States',
      founded: 2013,
      reputation: {
        score: 82,
        summary: 'Well-established enterprise communication platform with strong security posture, acquired by Salesforce in 2021.',
        sources: [
          { id: 'c1', type: 'independent', title: 'Gartner Magic Quadrant', verified: true, date: '2024-01' }
        ]
      },
      securityTrackRecord: 'Good track record with no major breaches. Transparent security practices.',
      psirtPage: 'https://slack.com/security'
    },
    platformSupport: {
      platforms: [
        { name: 'macOS', supported: true, versions: '10.14+', securityModel: 'Sandboxed app' },
        { name: 'Windows', supported: true, versions: '10+', securityModel: 'Standard application' },
        { name: 'Linux', supported: true, versions: 'Ubuntu 18.04+, Fedora 28+' },
        { name: 'iOS', supported: true, versions: '15.0+', securityModel: 'App Sandbox' },
        { name: 'Android', supported: true, versions: '8.0+', securityModel: 'Android permissions' },
        { name: 'Web', supported: true, securityModel: 'Browser-based' }
      ],
      versionDifferences: 'All platforms feature-parity. Mobile apps have biometric authentication.'
    },
    dataHandling: {
      storage: {
        location: 'AWS (US East, EU West)',
        regions: ['US', 'EU', 'AU', 'JP'],
        cloudProvider: 'Amazon Web Services',
        encryptionAtRest: true
      },
      transmission: {
        endpoints: ['slack.com', 'slack-edge.com', 'slack-files.com'],
        subProcessors: ['AWS', 'Google Cloud', 'Cloudflare'],
        encryptionInTransit: { tls: 'TLS 1.3', certVerified: true }
      },
      usage: {
        analytics: true,
        advertising: false,
        aiTraining: true,
        retentionPolicy: 'Configurable retention (14 days to unlimited)',
        userCanDelete: true
      }
    },
    permissions: {
      required: [
        { name: 'Internet Access', riskLevel: 'low', justification: 'Cloud-based communication' },
        { name: 'File System (Downloads)', riskLevel: 'medium', justification: 'File sharing and downloads' },
        { name: 'Notifications', riskLevel: 'low', justification: 'Message alerts' }
      ],
      optional: [
        { name: 'Microphone', riskLevel: 'medium', justification: 'Voice calls and clips' },
        { name: 'Camera', riskLevel: 'medium', justification: 'Video calls' },
        { name: 'Screen Recording', riskLevel: 'high', justification: 'Screen sharing in calls' }
      ],
      overPermissioningRisk: 'Screen recording permission is broad; consider if necessary for your use case.'
    },
    adminControls: {
      sso: true,
      mfa: true,
      rbac: true,
      scim: true,
      auditLogs: true,
      dataExport: true
    },
    vulnerabilities: {
      cveCount: 8,
      trendData: [
        { month: '2024-01', count: 1 },
        { month: '2024-02', count: 0 },
        { month: '2024-03', count: 2 },
        { month: '2024-04', count: 1 },
        { month: '2024-05', count: 0 },
        { month: '2024-06', count: 1 },
        { month: '2024-07', count: 0 },
        { month: '2024-08', count: 1 },
        { month: '2024-09', count: 0 },
        { month: '2024-10', count: 2 },
        { month: '2024-11', count: 0 },
        { month: '2024-12', count: 0 }
      ],
      severityBreakdown: {
        critical: 0,
        high: 2,
        medium: 4,
        low: 2
      },
      recentCVEs: [
        {
          id: 'CVE-2024-23456',
          cvss: 7.1,
          severity: 'High',
          description: 'XSS vulnerability in message rendering',
          publishedDate: '2024-10-15',
          patched: true
        },
        {
          id: 'CVE-2024-12345',
          cvss: 5.3,
          severity: 'Medium',
          description: 'Information disclosure in API responses',
          publishedDate: '2024-10-01',
          patched: true
        }
      ],
      cisaKEV: false
    },
    releaseLifecycle: {
      latestVersion: '4.36.140',
      releaseFrequency: 'Weekly updates',
      patchCadence: 'Critical patches within 48h, regular updates weekly',
      eolDates: [
        { version: '3.x', date: '2023-12-31' },
        { version: '2.x', date: '2022-06-30' }
      ],
      ltsVersions: ['4.x'],
      versionHistory: [
        { version: '4.36.140', releaseDate: '2024-11-10', securityFixes: 0 },
        { version: '4.36.135', releaseDate: '2024-11-03', securityFixes: 1 },
        { version: '4.35.121', releaseDate: '2024-10-20', securityFixes: 2 }
      ]
    },
    aiFeatures: {
      hasAI: true,
      features: [
        {
          name: 'Slack AI',
          description: 'Thread summaries, channel recaps, and search answers',
          dataAccess: ['messages', 'files', 'channel history']
        },
        {
          name: 'Smart Suggestions',
          description: 'Auto-complete and emoji suggestions',
          dataAccess: ['message content', 'emoji usage']
        }
      ],
      dataUsedForTraining: true,
      canOptOut: true,
      processingLocation: 'cloud'
    },
    incidents: {
      count: 2,
      timeline: [
        {
          date: '2022-12-31',
          title: 'Service Outage',
          severity: 'Medium',
          description: 'Global service disruption affecting message delivery',
          impact: 'Message delays up to 2 hours',
          resolution: 'Infrastructure scaling issue resolved',
          sources: [
            { id: 'i1', type: 'vendor-stated', title: 'Slack Status Page', verified: true, date: '2022-12-31' }
          ]
        },
        {
          date: '2021-03-15',
          title: 'Password Reset Vulnerability',
          severity: 'High',
          description: 'Account takeover risk via password reset flow',
          impact: 'Potential unauthorized access',
          resolution: 'Fixed within 6 hours, forced password resets',
          sources: [
            { id: 'i2', type: 'independent', title: 'Security Researcher Blog', verified: true, date: '2021-03-16' }
          ]
        }
      ]
    },
    compliance: {
      certifications: ['SOC 2 Type II', 'ISO 27001', 'ISO 27018', 'GDPR Compliant', 'HIPAA (Business Associate Agreement available)'],
      dataHandlingSummary: 'Enterprise-grade data protection with encryption at rest and in transit. GDPR-compliant with EU data residency options.',
      dpa: true,
      sources: [
        { id: 'comp1', type: 'compliance-cert', title: 'SOC 2 Report', verified: true, date: '2024-06' },
        { id: 'comp2', type: 'vendor-stated', title: 'Slack Trust Center', verified: true }
      ]
    },
    sources: {
      public: {
        count: 47,
        types: [
          { type: 'Vendor Documentation', count: 18 },
          { type: 'CVE Database', count: 8 },
          { type: 'Security Blogs', count: 12 },
          { type: 'Compliance Reports', count: 9 }
        ]
      },
      confidential: {
        count: 5,
        types: [
          { type: 'Internal Testing', count: 3 },
          { type: 'Pentesting Reports', count: 2 }
        ]
      }
    },
    alternatives: [
      { name: 'Microsoft Teams', vendor: 'Microsoft', trustScore: 85, summary: 'Enterprise collaboration with Office 365 integration', whyBetter: 'Stronger enterprise controls and compliance' },
      { name: 'Discord', vendor: 'Discord Inc.', trustScore: 72, summary: 'Community-focused communication platform', whyBetter: 'Better for communities but less enterprise features' },
      { name: 'Mattermost', vendor: 'Mattermost', trustScore: 88, summary: 'Open-source, self-hosted collaboration', whyBetter: 'Full data control with self-hosting' }
    ],
    allCitations: []
  },
  {
    id: 'github-001',
    timestamp: '2024-11-13T15:20:00Z',
    cached: true,
    product: {
      name: 'GitHub',
      vendor: 'Microsoft',
      category: 'Developer Platform',
      description: 'Cloud-based software development platform providing Git repository hosting, code review, CI/CD, and collaboration tools.',
      usage: 'Version control, code collaboration, issue tracking, DevOps automation',
      website: 'https://github.com',
      logo: '🐙'
    },
    trustScore: {
      score: 88,
      rationale: 'Excellent security posture with mature vulnerability management, strong compliance, and transparent security practices. Microsoft acquisition brought additional resources.',
      confidence: 92
    },
    vendorInfo: {
      companyName: 'GitHub Inc. (Microsoft)',
      headquarters: 'San Francisco, CA, USA',
      jurisdiction: 'United States',
      founded: 2008,
      reputation: {
        score: 90,
        summary: 'Industry-leading developer platform with strong security culture. Acquired by Microsoft in 2018.',
        sources: [
          { id: 'gh1', type: 'independent', title: 'Stack Overflow Survey 2024', verified: true }
        ]
      },
      securityTrackRecord: 'Excellent. Transparent about security with bug bounty program and public security advisories.',
      psirtPage: 'https://github.com/security'
    },
    platformSupport: {
      platforms: [
        { name: 'macOS', supported: true, versions: 'Any', securityModel: 'Web-based' },
        { name: 'Windows', supported: true, versions: 'Any', securityModel: 'Web-based' },
        { name: 'Linux', supported: true, versions: 'Any', securityModel: 'Web-based' },
        { name: 'iOS', supported: true, versions: '15.0+', securityModel: 'App Sandbox' },
        { name: 'Android', supported: true, versions: '8.0+', securityModel: 'Android permissions' },
        { name: 'Web', supported: true, securityModel: 'Browser-based (primary)' }
      ]
    },
    dataHandling: {
      storage: {
        location: 'Azure (Multiple regions)',
        regions: ['US', 'EU', 'APAC'],
        cloudProvider: 'Microsoft Azure',
        encryptionAtRest: true
      },
      transmission: {
        endpoints: ['github.com', 'api.github.com', 'raw.githubusercontent.com'],
        subProcessors: ['Azure', 'Fastly CDN'],
        encryptionInTransit: { tls: 'TLS 1.3', certVerified: true }
      },
      usage: {
        analytics: true,
        advertising: false,
        aiTraining: true,
        retentionPolicy: 'Indefinite (user-controlled deletion)',
        userCanDelete: true
      }
    },
    permissions: {
      required: [
        { name: 'Internet Access', riskLevel: 'low', justification: 'Cloud-based platform' }
      ],
      optional: [
        { name: 'Repository Access', riskLevel: 'medium', justification: 'OAuth apps and integrations' },
        { name: 'Organization Data', riskLevel: 'high', justification: 'Third-party apps' }
      ],
      overPermissioningRisk: 'Review OAuth app permissions carefully. Many apps request excessive scopes.'
    },
    adminControls: {
      sso: true,
      mfa: true,
      rbac: true,
      scim: true,
      auditLogs: true,
      dataExport: true
    },
    vulnerabilities: {
      cveCount: 12,
      trendData: [
        { month: '2024-01', count: 1 },
        { month: '2024-02', count: 2 },
        { month: '2024-03', count: 1 },
        { month: '2024-04', count: 0 },
        { month: '2024-05', count: 1 },
        { month: '2024-06', count: 2 },
        { month: '2024-07', count: 1 },
        { month: '2024-08', count: 0 },
        { month: '2024-09', count: 1 },
        { month: '2024-10', count: 2 },
        { month: '2024-11', count: 1 },
        { month: '2024-12', count: 0 }
      ],
      severityBreakdown: {
        critical: 1,
        high: 3,
        medium: 5,
        low: 3
      },
      recentCVEs: [
        {
          id: 'CVE-2024-34567',
          cvss: 8.1,
          severity: 'High',
          description: 'Authentication bypass in GitHub Actions',
          publishedDate: '2024-10-20',
          patched: true
        }
      ],
      cisaKEV: false
    },
    releaseLifecycle: {
      latestVersion: 'N/A (SaaS)',
      releaseFrequency: 'Continuous deployment (multiple times daily)',
      patchCadence: 'Immediate for critical issues',
      eolDates: [],
      ltsVersions: [],
      versionHistory: []
    },
    aiFeatures: {
      hasAI: true,
      features: [
        {
          name: 'GitHub Copilot',
          description: 'AI pair programmer for code completion and generation',
          dataAccess: ['code context', 'comments', 'repository structure']
        },
        {
          name: 'Copilot Chat',
          description: 'Conversational AI for coding assistance',
          dataAccess: ['code', 'documentation', 'issues']
        }
      ],
      dataUsedForTraining: true,
      canOptOut: true,
      processingLocation: 'cloud'
    },
    incidents: {
      count: 1,
      timeline: [
        {
          date: '2020-04-14',
          title: 'OAuth Token Security Issue',
          severity: 'High',
          description: 'Unintended exposure of OAuth tokens in logs',
          impact: 'Limited OAuth token exposure',
          resolution: 'Tokens revoked, logging system updated',
          sources: [
            { id: 'ghi1', type: 'vendor-stated', title: 'GitHub Blog', verified: true, date: '2020-04-14' }
          ]
        }
      ]
    },
    compliance: {
      certifications: ['SOC 2 Type II', 'ISO 27001', 'FedRAMP Moderate', 'GDPR Compliant', 'PCI DSS Level 1'],
      dataHandlingSummary: 'Industry-leading security with comprehensive compliance certifications. Regular third-party audits.',
      dpa: true,
      sources: [
        { id: 'ghc1', type: 'compliance-cert', title: 'GitHub Trust Center', verified: true }
      ]
    },
    sources: {
      public: {
        count: 68,
        types: [
          { type: 'Vendor Documentation', count: 32 },
          { type: 'CVE Database', count: 12 },
          { type: 'Security Advisories', count: 15 },
          { type: 'Compliance Reports', count: 9 }
        ]
      },
      confidential: {
        count: 3,
        types: [
          { type: 'Internal Testing', count: 3 }
        ]
      }
    },
    alternatives: [
      { name: 'GitLab', vendor: 'GitLab Inc.', trustScore: 86, summary: 'Complete DevOps platform with strong security', whyBetter: 'Self-hosting option available' },
      { name: 'Bitbucket', vendor: 'Atlassian', trustScore: 83, summary: 'Git solution integrated with Jira', whyBetter: 'Better Atlassian ecosystem integration' }
    ],
    allCitations: []
  }
];

// ============================================================================
// API Functions
// ============================================================================

export async function getAssessment(id: string): Promise<Assessment | null> {
  await delay(500); // Simulate network delay
  return mockAssessments.find(a => a.id === id) || null;
}

export async function searchAssessments(query: string): Promise<Assessment[]> {
  await delay(300);
  if (!query) return mockAssessments;
  
  const lowercaseQuery = query.toLowerCase();
  return mockAssessments.filter(a => 
    a.product.name.toLowerCase().includes(lowercaseQuery) ||
    a.product.vendor.toLowerCase().includes(lowercaseQuery) ||
    a.product.category.toLowerCase().includes(lowercaseQuery)
  );
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(400);
  
  const totalScore = mockAssessments.reduce((sum, a) => sum + a.trustScore.score, 0);
  
  return {
    totalAssessments: 247,
    averageTrustScore: Math.round(totalScore / mockAssessments.length),
    recentAssessments: mockAssessments.slice(0, 4)
  };
}

export async function getSearchSuggestions(query: string): Promise<string[]> {
  await delay(200);
  
  const suggestions = [
    'Slack',
    'GitHub',
    'Signal',
    'Jira',
    'Microsoft Teams',
    'Zoom',
    'Notion',
    'Asana',
    'Dropbox',
    'Google Workspace'
  ];
  
  if (!query) return suggestions.slice(0, 5);
  
  const lowercaseQuery = query.toLowerCase();
  return suggestions
    .filter(s => s.toLowerCase().includes(lowercaseQuery))
    .slice(0, 5);
}

export async function getAllAssessments(): Promise<Assessment[]> {
  await delay(600);
  return mockAssessments;
}

export async function compareAssessments(ids: string[]): Promise<Assessment[]> {
  await delay(500);
  return mockAssessments.filter(a => ids.includes(a.id));
}
