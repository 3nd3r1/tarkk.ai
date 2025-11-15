'use client';

import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  TrustScoreCircle,
  SecurityRadarChart,
  CVETrendChart,
  CVESeverityBreakdown,
  IncidentTimeline,
  AlternativesList,
  AdminControlsGrid,
} from '@/components/assessment';
import { CitationList, ChartSkeleton } from '@/components/shared';

// Sample data for demo
const demoTrustScore = {
  score: 85,
  confidence: 92,
  rationale: 'Excellent security posture with comprehensive controls and strong track record.',
};

const demoSecurityDimensions = [
  { dimension: 'Access Control', score: 90, maxScore: 100 },
  { dimension: 'Data Privacy', score: 85, maxScore: 100 },
  { dimension: 'Vulnerability Mgmt', score: 88, maxScore: 100 },
  { dimension: 'Compliance', score: 95, maxScore: 100 },
  { dimension: 'Incident Response', score: 78, maxScore: 100 },
  { dimension: 'User Management', score: 92, maxScore: 100 },
];

const demoCVETrend = [
  { month: '2024-01', count: 2 },
  { month: '2024-02', count: 1 },
  { month: '2024-03', count: 3 },
  { month: '2024-04', count: 2 },
  { month: '2024-05', count: 1 },
  { month: '2024-06', count: 2 },
  { month: '2024-07', count: 1 },
  { month: '2024-08', count: 0 },
  { month: '2024-09', count: 2 },
  { month: '2024-10', count: 3 },
  { month: '2024-11', count: 1 },
  { month: '2024-12', count: 0 },
];

const demoSeverityBreakdown = {
  critical: 1,
  high: 3,
  medium: 8,
  low: 6,
};

const demoRecentCVEs = [
  {
    id: 'CVE-2024-12345',
    cvss: 7.5,
    severity: 'High',
    description: 'SQL injection vulnerability in admin panel',
    publishedDate: '2024-10-15',
    patched: true,
  },
  {
    id: 'CVE-2024-12346',
    cvss: 5.3,
    severity: 'Medium',
    description: 'Cross-site scripting in user profile',
    publishedDate: '2024-09-20',
    patched: true,
  },
];

const demoIncidents = [
  {
    date: '2023-06-15',
    title: 'Data Breach Investigation',
    severity: 'High',
    description: 'Unauthorized access to customer database detected',
    impact: 'Approximately 10,000 user records potentially exposed',
    resolution: 'Security patches applied, affected users notified, monitoring enhanced',
    sources: [
      {
        id: 'src-1',
        type: 'vendor-stated' as const,
        title: 'Official Security Advisory',
        verified: true,
        date: '2023-06-16',
      },
    ],
  },
  {
    date: '2022-11-03',
    title: 'Service Outage',
    severity: 'Medium',
    description: 'DDoS attack caused service disruption',
    impact: 'Service unavailable for 2 hours',
    resolution: 'DDoS mitigation implemented, infrastructure scaled',
    sources: [
      {
        id: 'src-2',
        type: 'independent' as const,
        title: 'Third-party Security Report',
        verified: true,
        date: '2022-11-04',
      },
    ],
  },
];

const demoAlternatives = [
  {
    name: 'Competitor A',
    vendor: 'SecureCorp',
    trustScore: 88,
    summary: 'Enterprise-grade security platform with advanced threat protection',
    whyBetter: 'Higher compliance certifications and better incident response time',
  },
  {
    name: 'Competitor B',
    vendor: 'SafeTech Inc',
    trustScore: 82,
    summary: 'Cloud-native security solution with AI-powered analytics',
    whyBetter: 'More modern architecture with better scalability',
  },
  {
    name: 'Competitor C',
    vendor: 'DefendIT',
    trustScore: 79,
    summary: 'Open-source security platform with community support',
    whyBetter: 'Self-hosting option provides complete data control',
  },
];

const demoAdminControls = {
  sso: true,
  mfa: true,
  rbac: true,
  scim: true,
  auditLogs: true,
  dataExport: false,
};

const demoCitations = [
  {
    id: 'cite-1',
    type: 'vendor-stated' as const,
    title: 'Official Documentation',
    url: 'https://example.com/docs',
    verified: true,
    date: '2024-01-15',
  },
  {
    id: 'cite-2',
    type: 'independent' as const,
    title: 'Third-party Security Audit',
    url: 'https://example.com/audit',
    verified: true,
    date: '2024-02-20',
  },
  {
    id: 'cite-3',
    type: 'compliance-cert' as const,
    title: 'SOC 2 Type II Report',
    verified: true,
    date: '2024-03-10',
  },
];

export default function DemoPage() {
  return (
    <div className="container mx-auto py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Phase 3 Components Demo</h1>
        <p className="text-lg text-muted-foreground">
          Showcasing all core assessment visualization components with interactive examples
        </p>
      </div>

      <Separator />

      {/* Trust Score Circle */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Trust Score Circle</h2>
          <p className="text-muted-foreground">
            Animated circular progress indicator with color-coded scoring and detailed breakdown
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TrustScoreCircle score={95} confidence={95} rationale="Excellent security" size="sm" />
          <TrustScoreCircle score={demoTrustScore.score} confidence={demoTrustScore.confidence} rationale={demoTrustScore.rationale} size="md" />
          <TrustScoreCircle score={45} confidence={70} rationale="Several security concerns identified" size="sm" />
        </div>
      </section>

      <Separator />

      {/* Security Radar Chart */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Security Radar Chart</h2>
          <p className="text-muted-foreground">
            Multi-dimensional visualization showing security posture across different categories
          </p>
        </div>
        <SecurityRadarChart data={demoSecurityDimensions} />
      </section>

      <Separator />

      {/* CVE Trend Chart */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">CVE Trend Chart</h2>
          <p className="text-muted-foreground">
            Line chart displaying vulnerability discoveries over time with trend analysis
          </p>
        </div>
        <CVETrendChart data={demoCVETrend} totalCVEs={18} />
      </section>

      <Separator />

      {/* CVE Severity Breakdown */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">CVE Severity Breakdown</h2>
          <p className="text-muted-foreground">
            Pie chart showing distribution of vulnerabilities by severity level with recent CVE list
          </p>
        </div>
        <CVESeverityBreakdown
          severityBreakdown={demoSeverityBreakdown}
          recentCVEs={demoRecentCVEs}
          cisaKEV={false}
        />
      </section>

      <Separator />

      {/* Admin Controls Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Admin Controls Grid</h2>
          <p className="text-muted-foreground">
            Comprehensive overview of enterprise security controls and administrative features
          </p>
        </div>
        <AdminControlsGrid controls={demoAdminControls} />
      </section>

      <Separator />

      {/* Incident Timeline */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Incident Timeline</h2>
          <p className="text-muted-foreground">
            Expandable timeline showing security incidents with detailed information
          </p>
        </div>
        <IncidentTimeline incidents={demoIncidents} />
      </section>

      <Separator />

      {/* Alternatives List */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Alternative Products</h2>
          <p className="text-muted-foreground">
            Product recommendations with trust score comparison
          </p>
        </div>
        <AlternativesList alternatives={demoAlternatives} currentScore={demoTrustScore.score} />
      </section>

      <Separator />

      {/* Citation List */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Citation Badges</h2>
          <p className="text-muted-foreground">
            Interactive badges showing information sources with verification status
          </p>
        </div>
        <Card className="p-6">
          <CitationList citations={demoCitations} title="Information Sources" />
        </Card>
      </section>

      <Separator />

      {/* Loading Skeletons */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Loading States</h2>
          <p className="text-muted-foreground">
            Context-aware skeleton screens for various component types
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </section>

      {/* Footer */}
      <div className="pt-8 border-t text-center text-muted-foreground">
        <p>Phase 3 Components - Security Assessment Platform</p>
        <p className="text-sm">All components feature animations, dark mode support, and responsive design</p>
      </div>
    </div>
  );
}
