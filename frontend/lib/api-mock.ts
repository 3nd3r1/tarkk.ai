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
    timestamp: '2025-11-14T10:30:00Z',
    cached: false,
    product: {
      name: 'Slack',
      vendor: 'Salesforce',
      category: 'Team Collaboration',
      description: 'Cloud-based team communication and collaboration platform with channels, direct messaging, and extensive integrations.',
      usage: 'Internal team communication, project coordination, file sharing, workflow automation',
      website: 'https://slack.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg'
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
          { id: 'c1', type: 'independent', title: 'Gartner Magic Quadrant', verified: true, date: '2025-01' }
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
        { month: '2025-01', count: 1 },
        { month: '2025-02', count: 0 },
        { month: '2025-03', count: 2 },
        { month: '2025-04', count: 1 },
        { month: '2025-05', count: 0 },
        { month: '2025-06', count: 1 },
        { month: '2025-07', count: 0 },
        { month: '2025-08', count: 1 },
        { month: '2025-09', count: 0 },
        { month: '2025-10', count: 2 },
        { month: '2025-11', count: 0 },
        { month: '2025-12', count: 0 }
      ],
      severityBreakdown: {
        critical: 0,
        high: 2,
        medium: 4,
        low: 2
      },
      recentCVEs: [
        {
          id: 'CVE-2025-23456',
          cvss: 7.1,
          severity: 'High',
          description: 'XSS vulnerability in message rendering',
          publishedDate: '2025-10-15',
          patched: true
        },
        {
          id: 'CVE-2025-12345',
          cvss: 5.3,
          severity: 'Medium',
          description: 'Information disclosure in API responses',
          publishedDate: '2025-10-01',
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
        { version: '4.36.140', releaseDate: '2025-11-10', securityFixes: 0 },
        { version: '4.36.135', releaseDate: '2025-11-03', securityFixes: 1 },
        { version: '4.35.121', releaseDate: '2025-10-20', securityFixes: 2 }
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
        { id: 'comp1', type: 'compliance-cert', title: 'SOC 2 Report', verified: true, date: '2025-06' },
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
    timestamp: '2025-11-13T15:20:00Z',
    cached: true,
    product: {
      name: 'GitHub',
      vendor: 'Microsoft',
      category: 'Developer Platform',
      description: 'Cloud-based software development platform providing Git repository hosting, code review, CI/CD, and collaboration tools.',
      usage: 'Version control, code collaboration, issue tracking, DevOps automation',
      website: 'https://github.com',
      logo: 'https://cdn.simpleicons.org/github/181717'
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
          { id: 'gh1', type: 'independent', title: 'Stack Overflow Survey 2025', verified: true }
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
        { month: '2025-01', count: 1 },
        { month: '2025-02', count: 2 },
        { month: '2025-03', count: 1 },
        { month: '2025-04', count: 0 },
        { month: '2025-05', count: 1 },
        { month: '2025-06', count: 2 },
        { month: '2025-07', count: 1 },
        { month: '2025-08', count: 0 },
        { month: '2025-09', count: 1 },
        { month: '2025-10', count: 2 },
        { month: '2025-11', count: 1 },
        { month: '2025-12', count: 0 }
      ],
      severityBreakdown: {
        critical: 1,
        high: 3,
        medium: 5,
        low: 3
      },
      recentCVEs: [
        {
          id: 'CVE-2025-34567',
          cvss: 8.1,
          severity: 'High',
          description: 'Authentication bypass in GitHub Actions',
          publishedDate: '2025-10-20',
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
  },
  {
    id: 'zoom-001',
    timestamp: '2025-11-12T09:15:00Z',
    cached: false,
    product: {
      name: 'Zoom',
      vendor: 'Zoom Video Communications',
      category: 'Video Conferencing',
      description: 'Video conferencing and online meeting platform with screen sharing, recording, and collaboration features.',
      usage: 'Video meetings, webinars, virtual events, team collaboration',
      website: 'https://zoom.us',
      logo: 'https://cdn.simpleicons.org/zoom/2D8CFF'
    },
    trustScore: {
      score: 72,
      rationale: 'Improved security posture post-2020, but concerns remain around end-to-end encryption implementation and data privacy practices.',
      confidence: 82
    },
    vendorInfo: {
      companyName: 'Zoom Video Communications',
      headquarters: 'San Jose, CA, USA',
      jurisdiction: 'United States',
      founded: 2011,
      reputation: {
        score: 75,
        summary: 'Popular video platform that faced security scrutiny in 2020, has since improved practices significantly.',
        sources: []
      },
      securityTrackRecord: 'Mixed. Significant issues in 2020 (Zoombombing, encryption claims), but major improvements since then.',
      psirtPage: 'https://explore.zoom.us/en/trust/security/'
    },
    platformSupport: {
      platforms: [
        { name: 'macOS', supported: true, versions: '10.10+' },
        { name: 'Windows', supported: true, versions: '7+' },
        { name: 'Linux', supported: true },
        { name: 'iOS', supported: true, versions: '12.0+' },
        { name: 'Android', supported: true, versions: '5.0+' },
        { name: 'Web', supported: true }
      ]
    },
    dataHandling: {
      storage: {
        location: 'Multiple cloud providers',
        regions: ['US', 'EU', 'APAC'],
        cloudProvider: 'AWS, Oracle Cloud',
        encryptionAtRest: true
      },
      transmission: {
        endpoints: ['zoom.us', 'zoom.com'],
        subProcessors: ['AWS', 'Oracle'],
        encryptionInTransit: { tls: 'TLS 1.2+', certVerified: true }
      },
      usage: {
        analytics: true,
        advertising: false,
        aiTraining: true,
        retentionPolicy: 'Recording retention configurable',
        userCanDelete: true
      }
    },
    permissions: {
      required: [
        { name: 'Camera', riskLevel: 'medium', justification: 'Video calls' },
        { name: 'Microphone', riskLevel: 'medium', justification: 'Audio calls' },
        { name: 'Screen Recording', riskLevel: 'high', justification: 'Screen sharing' }
      ],
      optional: [],
      overPermissioningRisk: 'High permissions required for core functionality'
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
      cveCount: 15,
      trendData: Array(12).fill(0).map((_, i) => ({ month: `2025-${String(i + 1).padStart(2, '0')}`, count: Math.floor(Math.random() * 3) })),
      severityBreakdown: {
        critical: 1,
        high: 4,
        medium: 7,
        low: 3
      },
      recentCVEs: [
        {
          id: 'CVE-2025-45678',
          cvss: 7.5,
          severity: 'High',
          description: 'Authentication bypass in Zoom client',
          publishedDate: '2025-09-15',
          patched: true
        }
      ],
      cisaKEV: false
    },
    releaseLifecycle: {
      latestVersion: '5.17.5',
      releaseFrequency: 'Monthly updates',
      patchCadence: 'Critical patches within 72h',
      eolDates: [],
      ltsVersions: [],
      versionHistory: []
    },
    aiFeatures: {
      hasAI: true,
      features: [
        { name: 'AI Companion', description: 'Meeting summaries and action items', dataAccess: ['meeting transcripts', 'chat'] }
      ],
      dataUsedForTraining: true,
      canOptOut: true,
      processingLocation: 'cloud'
    },
    incidents: {
      count: 3,
      timeline: [
        {
          date: '2020-04-01',
          title: 'Zoombombing Incidents',
          severity: 'High',
          description: 'Unauthorized users joining meetings',
          impact: 'Privacy and security concerns',
          resolution: 'Improved default security settings',
          sources: []
        }
      ]
    },
    compliance: {
      certifications: ['SOC 2', 'ISO 27001', 'HIPAA', 'GDPR Compliant'],
      dataHandlingSummary: 'Good data protection with regional storage options',
      dpa: true,
      sources: []
    },
    sources: {
      public: { count: 42, types: [{ type: 'Vendor Documentation', count: 20 }, { type: 'Security Research', count: 22 }] },
      confidential: { count: 2, types: [{ type: 'Internal Testing', count: 2 }] }
    },
    alternatives: [
      { name: 'Microsoft Teams', vendor: 'Microsoft', trustScore: 85, summary: 'Enterprise communication platform' }
    ],
    allCitations: []
  },
  {
    id: 'notion-001',
    timestamp: '2025-11-10T14:30:00Z',
    cached: true,
    product: {
      name: 'Notion',
      vendor: 'Notion Labs',
      category: 'Productivity',
      description: 'All-in-one workspace for notes, tasks, wikis, and databases with collaborative features.',
      usage: 'Documentation, project management, knowledge base, personal notes',
      website: 'https://notion.so',
      logo: 'https://cdn.simpleicons.org/notion/000000'
    },
    trustScore: {
      score: 68,
      rationale: 'Growing platform with improving security, but limited enterprise controls and encryption concerns.',
      confidence: 78
    },
    vendorInfo: {
      companyName: 'Notion Labs Inc.',
      headquarters: 'San Francisco, CA, USA',
      jurisdiction: 'United States',
      founded: 2016,
      reputation: {
        score: 72,
        summary: 'Popular productivity tool with strong user base, improving enterprise features.',
        sources: []
      },
      securityTrackRecord: 'Good. No major security incidents reported.',
      psirtPage: 'https://www.notion.so/security'
    },
    platformSupport: {
      platforms: [
        { name: 'macOS', supported: true },
        { name: 'Windows', supported: true },
        { name: 'Linux', supported: false },
        { name: 'iOS', supported: true },
        { name: 'Android', supported: true },
        { name: 'Web', supported: true }
      ]
    },
    dataHandling: {
      storage: {
        location: 'AWS (US)',
        regions: ['US'],
        cloudProvider: 'AWS',
        encryptionAtRest: true
      },
      transmission: {
        endpoints: ['notion.so', 'notion.site'],
        subProcessors: ['AWS'],
        encryptionInTransit: { tls: 'TLS 1.3', certVerified: true }
      },
      usage: {
        analytics: true,
        advertising: false,
        aiTraining: false,
        retentionPolicy: 'Indefinite (user-controlled)',
        userCanDelete: true
      }
    },
    permissions: {
      required: [
        { name: 'Internet Access', riskLevel: 'low', justification: 'Cloud sync' }
      ],
      optional: [
        { name: 'File System', riskLevel: 'medium', justification: 'File attachments' }
      ]
    },
    adminControls: {
      sso: true,
      mfa: true,
      rbac: true,
      scim: true,
      auditLogs: false,
      dataExport: true
    },
    vulnerabilities: {
      cveCount: 3,
      trendData: Array(12).fill(0).map((_, i) => ({ month: `2025-${String(i + 1).padStart(2, '0')}`, count: i % 4 === 0 ? 1 : 0 })),
      severityBreakdown: {
        critical: 0,
        high: 1,
        medium: 1,
        low: 1
      },
      recentCVEs: [],
      cisaKEV: false
    },
    releaseLifecycle: {
      latestVersion: 'N/A (SaaS)',
      releaseFrequency: 'Continuous',
      patchCadence: 'Immediate',
      eolDates: [],
      ltsVersions: [],
      versionHistory: []
    },
    aiFeatures: {
      hasAI: true,
      features: [
        { name: 'Notion AI', description: 'Writing assistance and content generation', dataAccess: ['page content'] }
      ],
      dataUsedForTraining: false,
      canOptOut: true,
      processingLocation: 'cloud'
    },
    incidents: {
      count: 0,
      timeline: []
    },
    compliance: {
      certifications: ['SOC 2 Type II', 'GDPR Compliant'],
      dataHandlingSummary: 'Good data protection for a growing platform',
      dpa: true,
      sources: []
    },
    sources: {
      public: { count: 28, types: [{ type: 'Vendor Documentation', count: 15 }, { type: 'User Reviews', count: 13 }] },
      confidential: { count: 1, types: [{ type: 'Internal Testing', count: 1 }] }
    },
    alternatives: [
      { name: 'Confluence', vendor: 'Atlassian', trustScore: 82, summary: 'Enterprise wiki and collaboration' }
    ],
    allCitations: []
  },
  {
    id: 'vscode-001',
    timestamp: '2025-11-08T11:00:00Z',
    cached: true,
    product: {
      name: 'Visual Studio Code',
      vendor: 'Microsoft',
      category: 'Developer Tools',
      description: 'Free, open-source code editor with debugging, Git integration, and extensions marketplace.',
      usage: 'Software development, code editing, debugging, version control',
      website: 'https://code.visualstudio.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg'
    },
    trustScore: {
      score: 92,
      rationale: 'Excellent open-source tool with strong security practices, backed by Microsoft with transparent development.',
      confidence: 95
    },
    vendorInfo: {
      companyName: 'Microsoft Corporation',
      headquarters: 'Redmond, WA, USA',
      jurisdiction: 'United States',
      founded: 1975,
      reputation: {
        score: 92,
        summary: 'Global technology leader with strong security practices and significant open-source contributions.',
        sources: []
      },
      securityTrackRecord: 'Excellent. Transparent vulnerability disclosure and rapid patching.',
      psirtPage: 'https://www.microsoft.com/en-us/msrc'
    },
    platformSupport: {
      platforms: [
        { name: 'macOS', supported: true },
        { name: 'Windows', supported: true },
        { name: 'Linux', supported: true },
        { name: 'iOS', supported: false },
        { name: 'Android', supported: false },
        { name: 'Web', supported: true }
      ]
    },
    dataHandling: {
      storage: {
        location: 'Local + Optional Cloud (Azure)',
        regions: ['Local', 'US', 'EU'],
        cloudProvider: 'Azure (optional)',
        encryptionAtRest: true
      },
      transmission: {
        endpoints: ['vscode.dev', 'marketplace.visualstudio.com'],
        subProcessors: ['Azure'],
        encryptionInTransit: { tls: 'TLS 1.3', certVerified: true }
      },
      usage: {
        analytics: true,
        advertising: false,
        aiTraining: false,
        retentionPolicy: 'Configurable',
        userCanDelete: true
      }
    },
    permissions: {
      required: [
        { name: 'File System', riskLevel: 'high', justification: 'Code editing and project access' }
      ],
      optional: [
        { name: 'Internet Access', riskLevel: 'low', justification: 'Extension marketplace' }
      ]
    },
    adminControls: {
      sso: false,
      mfa: false,
      rbac: false,
      scim: false,
      auditLogs: false,
      dataExport: true
    },
    vulnerabilities: {
      cveCount: 8,
      trendData: Array(12).fill(0).map((_, i) => ({ month: `2025-${String(i + 1).padStart(2, '0')}`, count: i % 3 === 0 ? 1 : 0 })),
      severityBreakdown: {
        critical: 0,
        high: 2,
        medium: 4,
        low: 2
      },
      recentCVEs: [],
      cisaKEV: false
    },
    releaseLifecycle: {
      latestVersion: '1.94.2',
      releaseFrequency: 'Monthly',
      patchCadence: 'Immediate for critical',
      eolDates: [],
      ltsVersions: [],
      versionHistory: []
    },
    aiFeatures: {
      hasAI: true,
      features: [
        { name: 'GitHub Copilot Integration', description: 'AI code completion (extension)', dataAccess: ['code context'] }
      ],
      dataUsedForTraining: false,
      canOptOut: true,
      processingLocation: 'cloud'
    },
    incidents: {
      count: 0,
      timeline: []
    },
    compliance: {
      certifications: [],
      dataHandlingSummary: 'Primarily local data storage with optional cloud sync',
      dpa: false,
      sources: []
    },
    sources: {
      public: { count: 85, types: [{ type: 'GitHub Repository', count: 40 }, { type: 'Documentation', count: 45 }] },
      confidential: { count: 0, types: [] }
    },
    alternatives: [
      { name: 'IntelliJ IDEA', vendor: 'JetBrains', trustScore: 90, summary: 'Powerful IDE with strong refactoring' }
    ],
    allCitations: []
  },
  {
    id: 'dropbox-001',
    timestamp: '2025-11-07T16:45:00Z',
    cached: false,
    product: {
      name: 'Dropbox',
      vendor: 'Dropbox Inc.',
      category: 'Cloud Storage',
      description: 'Cloud file storage and synchronization service with sharing and collaboration features.',
      usage: 'File backup, sharing, collaboration, cloud storage',
      website: 'https://dropbox.com',
      logo: 'https://cdn.simpleicons.org/dropbox/0061FF'
    },
    trustScore: {
      score: 81,
      rationale: 'Mature cloud storage with strong security track record and enterprise features, though encryption key management could be improved.',
      confidence: 88
    },
    vendorInfo: {
      companyName: 'Dropbox Inc.',
      headquarters: 'San Francisco, CA, USA',
      jurisdiction: 'United States',
      founded: 2007,
      reputation: {
        score: 84,
        summary: 'Established cloud storage provider with strong reputation and security practices.',
        sources: []
      },
      securityTrackRecord: 'Good. One significant breach in 2012, improved security since then.',
      psirtPage: 'https://www.dropbox.com/security'
    },
    platformSupport: {
      platforms: [
        { name: 'macOS', supported: true },
        { name: 'Windows', supported: true },
        { name: 'Linux', supported: true },
        { name: 'iOS', supported: true },
        { name: 'Android', supported: true },
        { name: 'Web', supported: true }
      ]
    },
    dataHandling: {
      storage: {
        location: 'AWS + Custom Infrastructure',
        regions: ['US', 'EU', 'APAC'],
        cloudProvider: 'AWS + Dropbox Infrastructure',
        encryptionAtRest: true
      },
      transmission: {
        endpoints: ['dropbox.com', 'dropboxapi.com'],
        subProcessors: ['AWS'],
        encryptionInTransit: { tls: 'TLS 1.3', certVerified: true }
      },
      usage: {
        analytics: true,
        advertising: false,
        aiTraining: false,
        retentionPolicy: 'Indefinite until deletion',
        userCanDelete: true
      }
    },
    permissions: {
      required: [
        { name: 'File System', riskLevel: 'high', justification: 'File sync and storage' },
        { name: 'Internet Access', riskLevel: 'low', justification: 'Cloud sync' }
      ],
      optional: [
        { name: 'Camera', riskLevel: 'medium', justification: 'Document scanning' }
      ]
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
      cveCount: 5,
      trendData: Array(12).fill(0).map((_, i) => ({ month: `2025-${String(i + 1).padStart(2, '0')}`, count: i % 5 === 0 ? 1 : 0 })),
      severityBreakdown: {
        critical: 0,
        high: 1,
        medium: 3,
        low: 1
      },
      recentCVEs: [],
      cisaKEV: false
    },
    releaseLifecycle: {
      latestVersion: 'Various by platform',
      releaseFrequency: 'Regular updates',
      patchCadence: 'Rapid',
      eolDates: [],
      ltsVersions: [],
      versionHistory: []
    },
    aiFeatures: {
      hasAI: true,
      features: [
        { name: 'Dropbox Dash', description: 'AI-powered universal search', dataAccess: ['file metadata', 'content'] }
      ],
      dataUsedForTraining: false,
      canOptOut: true,
      processingLocation: 'cloud'
    },
    incidents: {
      count: 2,
      timeline: [
        {
          date: '2012-07-01',
          title: 'Password Breach',
          severity: 'High',
          description: 'Over 68 million user credentials stolen',
          impact: 'Passwords exposed',
          resolution: 'Forced password resets, improved security',
          sources: []
        }
      ]
    },
    compliance: {
      certifications: ['SOC 2', 'ISO 27001', 'GDPR Compliant', 'HIPAA'],
      dataHandlingSummary: 'Enterprise-grade security with comprehensive compliance',
      dpa: true,
      sources: []
    },
    sources: {
      public: { count: 56, types: [{ type: 'Vendor Documentation', count: 30 }, { type: 'Security Research', count: 26 }] },
      confidential: { count: 2, types: [{ type: 'Internal Testing', count: 2 }] }
    },
    alternatives: [
      { name: 'Google Drive', vendor: 'Google', trustScore: 83, summary: 'Cloud storage with Google Workspace integration' }
    ],
    allCitations: []
  },
  {
    id: 'figma-001',
    timestamp: '2025-11-05T13:20:00Z',
    cached: false,
    product: {
      name: 'Figma',
      vendor: 'Figma Inc. (Adobe)',
      category: 'Design Tools',
      description: 'Collaborative design tool for UI/UX design, prototyping, and design systems.',
      usage: 'Interface design, prototyping, design collaboration, design systems',
      website: 'https://figma.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg'
    },
    trustScore: {
      score: 76,
      rationale: 'Strong design platform with good security practices, though cloud-only nature raises data control concerns.',
      confidence: 80
    },
    vendorInfo: {
      companyName: 'Figma Inc. (Adobe Inc.)',
      headquarters: 'San Francisco, CA, USA',
      jurisdiction: 'United States',
      founded: 2012,
      reputation: {
        score: 80,
        summary: 'Leading design platform acquired by Adobe in 2023, strong innovation and user satisfaction.',
        sources: []
      },
      securityTrackRecord: 'Good. No major security incidents.',
      psirtPage: 'https://www.figma.com/security/'
    },
    platformSupport: {
      platforms: [
        { name: 'macOS', supported: true },
        { name: 'Windows', supported: true },
        { name: 'Linux', supported: false },
        { name: 'iOS', supported: true },
        { name: 'Android', supported: true },
        { name: 'Web', supported: true }
      ]
    },
    dataHandling: {
      storage: {
        location: 'AWS (US)',
        regions: ['US'],
        cloudProvider: 'AWS',
        encryptionAtRest: true
      },
      transmission: {
        endpoints: ['figma.com', 'figma-alpha.com'],
        subProcessors: ['AWS', 'Cloudflare'],
        encryptionInTransit: { tls: 'TLS 1.3', certVerified: true }
      },
      usage: {
        analytics: true,
        advertising: false,
        aiTraining: false,
        retentionPolicy: 'Indefinite',
        userCanDelete: true
      }
    },
    permissions: {
      required: [
        { name: 'Internet Access', riskLevel: 'low', justification: 'Cloud-based platform' }
      ],
      optional: [
        { name: 'Clipboard', riskLevel: 'low', justification: 'Copy/paste functionality' }
      ]
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
      cveCount: 4,
      trendData: Array(12).fill(0).map((_, i) => ({ month: `2025-${String(i + 1).padStart(2, '0')}`, count: i % 6 === 0 ? 1 : 0 })),
      severityBreakdown: {
        critical: 0,
        high: 1,
        medium: 2,
        low: 1
      },
      recentCVEs: [],
      cisaKEV: false
    },
    releaseLifecycle: {
      latestVersion: 'N/A (SaaS)',
      releaseFrequency: 'Continuous',
      patchCadence: 'Immediate',
      eolDates: [],
      ltsVersions: [],
      versionHistory: []
    },
    aiFeatures: {
      hasAI: false,
      features: [],
      dataUsedForTraining: false,
      canOptOut: true,
      processingLocation: 'local'
    },
    incidents: {
      count: 0,
      timeline: []
    },
    compliance: {
      certifications: ['SOC 2 Type II', 'GDPR Compliant'],
      dataHandlingSummary: 'Strong data protection with enterprise features',
      dpa: true,
      sources: []
    },
    sources: {
      public: { count: 38, types: [{ type: 'Vendor Documentation', count: 25 }, { type: 'User Community', count: 13 }] },
      confidential: { count: 1, types: [{ type: 'Internal Testing', count: 1 }] }
    },
    alternatives: [
      { name: 'Adobe XD', vendor: 'Adobe', trustScore: 82, summary: 'Adobe design and prototyping tool' }
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
