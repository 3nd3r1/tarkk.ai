"use client"

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Shield, Building2, Calendar, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Assessment, ReportSize } from "@/lib/types";
import { getAssessment } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { generatePDFReport, shouldShowSection, getReportConfig } from "@/lib/pdf-generator";

// Import all assessment components
import { TrustScoreCircle } from "@/components/assessment/trust-score-circle";
import { SecurityRadarChart } from "@/components/assessment/security-radar-chart";
import { CVETrendChart } from "@/components/assessment/cve-trend-chart";
import { CVESeverityBreakdown } from "@/components/assessment/cve-severity-breakdown";
import { IncidentTimeline } from "@/components/assessment/incident-timeline";
import { PlatformSupportGrid } from "@/components/assessment/platform-support-grid";
import { DataHandlingFlowchart } from "@/components/assessment/data-handling-flowchart";
import { PermissionsMatrix } from "@/components/assessment/permissions-matrix";
import { ReleaseLifecycleTimeline } from "@/components/assessment/release-lifecycle-timeline";
import { AIFeaturesBreakdown } from "@/components/assessment/ai-features-breakdown";
import { SourcesBreakdown } from "@/components/assessment/sources-breakdown";
import { ReportSizeSelector } from "@/components/assessment/report-size-selector";
import { DisclaimerBanner } from "@/components/assessment/disclaimer-banner";
import { AlternativesList } from "@/components/assessment/alternative-card";
import { AdminControlsGrid } from "@/components/assessment/admin-controls-grid";
import { SecurityScoreBreakdown } from "@/components/assessment/security-score-breakdown";
import { SaveAssessmentButton } from "@/components/assessment/save-assessment-button";
import { AssessmentNotes } from "@/components/assessment/assessment-notes";
import { ProductLogo } from "@/components/shared/product-logo";
import { StatusBanner } from "@/components/assessment/status-banner";

export default function AssessmentPage() {
  const params = useParams();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reportSize, setReportSize] = useState<ReportSize>('enterprise');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAssessment = useCallback(async () => {
    if (params.id) {
      const data = await getAssessment(params.id as string);
      setAssessment(data);
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchAssessment();
  }, [fetchAssessment]);

  // Auto-refresh when status is not completed or failed
  useEffect(() => {
    if (!assessment || !assessment.status || assessment.status === 'completed' || assessment.status === 'failed') {
      return;
    }

    const interval = setInterval(() => {
      setIsRefreshing(true);
      fetchAssessment();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [assessment?.status, fetchAssessment]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchAssessment();
  };

  const handleDownloadPDF = async () => {
    if (!assessment) return;
    
    setIsGeneratingPDF(true);
    try {
      await generatePDFReport(assessment, reportSize);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Get report configuration for current size
  const reportConfig = getReportConfig(reportSize);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <p className="text-xl text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl">Assessment not found</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-3">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Product Info */}
            <div className="flex items-center gap-4">
              <ProductLogo logo={assessment.product.logo} size="xl" />
              <div>
                <h1 className="text-4xl font-bold">{assessment.product.name}</h1>
                <p className="text-xl text-muted-foreground">by {assessment.product.vendor}</p>
                <div className="flex gap-2 mt-2">
                  <Badge>{assessment.product.category}</Badge>
                  {assessment.cached && <Badge variant="outline">Cached</Badge>}
                  <Badge variant="secondary" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(assessment.timestamp)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Trust Score Circle - Compact Mode */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="flex items-center"
            >
              <TrustScoreCircle 
                score={assessment.trustScore.score} 
                confidence={assessment.trustScore.confidence}
                rationale={assessment.trustScore.rationale}
                size="sm"
                compact
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Status Banner */}
          {assessment.status && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <StatusBanner 
                status={assessment.status} 
                onRefresh={handleManualRefresh}
                isRefreshing={isRefreshing}
              />
            </motion.div>
          )}
          {/* Report Size Selector with Download Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <ReportSizeSelector 
                  selectedSize={reportSize} 
                  onSizeChange={setReportSize} 
                />
              </div>
              <div className="flex items-center gap-3">
                <AssessmentNotes assessmentId={assessment.id} />
                <SaveAssessmentButton assessment={assessment} />
                <Button 
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  size="lg"
                  className="w-full lg:w-auto"
                >
                  {isGeneratingPDF ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Download {reportSize.charAt(0).toUpperCase() + reportSize.slice(1)} Report
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Report Size Information */}
            <Card className="bg-muted/30">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">ℹ️</div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">About {reportSize.charAt(0).toUpperCase() + reportSize.slice(1)} Reports</h4>
                    <p className="text-sm text-muted-foreground">
                      {reportSize === 'small' && 'Executive summary with key findings, trust score, and high-level overview. Perfect for quick decision-making.'}
                      {reportSize === 'medium' && 'Balanced report with security posture, vulnerabilities, and essential metrics. Ideal for technical teams.'}
                      {reportSize === 'full' && 'Comprehensive deep dive including data privacy, technical details, compliance, and sources. Recommended for security audits.'}
                      {reportSize === 'enterprise' && 'Complete analysis with all available data, detailed metrics, full incident history, and extensive citations. Designed for enterprise compliance and risk assessment.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trust Score Rationale */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Trust Score Analysis</CardTitle>
                <CardDescription>Why this score was assigned</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">{assessment.trustScore.rationale}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* 8-Tab Structure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                <TabsTrigger value="security" className="text-xs sm:text-sm">Security</TabsTrigger>
                <TabsTrigger value="vulnerabilities" className="text-xs sm:text-sm">Vulnerabilities</TabsTrigger>
                <TabsTrigger value="privacy" className="text-xs sm:text-sm">Data & Privacy</TabsTrigger>
                <TabsTrigger value="technical" className="text-xs sm:text-sm">Technical</TabsTrigger>
                <TabsTrigger value="compliance" className="text-xs sm:text-sm">Compliance</TabsTrigger>
                <TabsTrigger value="sources" className="text-xs sm:text-sm">Sources</TabsTrigger>
                <TabsTrigger value="alternatives" className="text-xs sm:text-sm">Alternatives</TabsTrigger>
              </TabsList>

              {/* Tab 1: Overview - §1 Vendor, §2 Product, §5 Platform Support */}
              <TabsContent value="overview" className="space-y-6">
                {/* Product Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Overview</CardTitle>
                    <CardDescription>What is {assessment.product.name}?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-lg leading-relaxed">{assessment.product.description}</p>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Common Use Cases:</h4>
                      <p className="text-muted-foreground">{assessment.product.usage}</p>
                    </div>
                    {assessment.product.website && (
                      <Button variant="outline" asChild>
                        <a href={assessment.product.website} target="_blank" rel="noopener noreferrer">
                          Visit Website
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Vendor Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Vendor Information
                    </CardTitle>
                    <CardDescription>About {assessment.vendorInfo.companyName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Company</p>
                        <p className="font-semibold">{assessment.vendorInfo.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Headquarters</p>
                        <p className="font-semibold">{assessment.vendorInfo.headquarters}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Jurisdiction</p>
                        <p className="font-semibold">{assessment.vendorInfo.jurisdiction}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Founded</p>
                        <p className="font-semibold">{assessment.vendorInfo.founded}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Reputation Score: {assessment.vendorInfo.reputation.score}/100</h4>
                      <p className="text-muted-foreground">{assessment.vendorInfo.reputation.summary}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Security Track Record</h4>
                      <p className="text-muted-foreground">{assessment.vendorInfo.securityTrackRecord}</p>
                    </div>
                    {assessment.vendorInfo.psirtPage && (
                      <Button variant="outline" asChild>
                        <a href={assessment.vendorInfo.psirtPage} target="_blank" rel="noopener noreferrer">
                          Security Center
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Platform Support */}
                <PlatformSupportGrid platformSupport={assessment.platformSupport} />
              </TabsContent>

              {/* Tab 2: Security Posture - §4 Admin Controls, §11 Incidents */}
              <TabsContent value="security" className="space-y-6">
                {/* Security Score Breakdown */}
                {shouldShowSection('security', reportSize) && (
                  <SecurityScoreBreakdown 
                    trustScore={assessment.trustScore.score}
                    confidence={assessment.trustScore.confidence}
                  />
                )}

                {/* Security Radar Chart */}
                <SecurityRadarChart />

                {/* Admin Controls */}
                <AdminControlsGrid 
                  adminControls={assessment.adminControls}
                  reportSize={reportSize === 'enterprise' ? 'full' : reportSize}
                />

                {/* Incidents Timeline */}
                {shouldShowSection('security', reportSize) && (
                  <IncidentTimeline 
                    incidents={assessment.incidents.timeline.slice(0, reportConfig.incidentLimit)} 
                  />
                )}
              </TabsContent>

              {/* Tab 3: Vulnerabilities - §8 CVE Analysis */}
              <TabsContent value="vulnerabilities" className="space-y-6">
                {/* CVE Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Vulnerability Overview</CardTitle>
                    <CardDescription>
                      Total CVEs: {assessment.vulnerabilities.cveCount}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {assessment.vulnerabilities.cisaKEV && (
                      <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="font-semibold text-red-500 flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          ⚠️ CISA KEV Alert
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          This software has vulnerabilities listed in CISA's Known Exploited Vulnerabilities catalog. 
                          Immediate patching recommended.
                        </p>
                      </div>
                    )}
                    
                    {/* Recent CVEs */}
                    {reportSize !== 'small' && assessment.vulnerabilities.recentCVEs.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-3">Recent Vulnerabilities</h4>
                        <div className="space-y-2">
                          {assessment.vulnerabilities.recentCVEs.slice(0, reportConfig.cveLimit).map((cve) => (
                            <div key={cve.id} className="border rounded-lg p-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono font-semibold">{cve.id}</span>
                                    <Badge variant={
                                      cve.severity === 'Critical' ? 'destructive' : 
                                      cve.severity === 'High' ? 'destructive' : 'default'
                                    }>
                                      {cve.severity}
                                    </Badge>
                                    {cve.patched && <Badge variant="secondary">Patched</Badge>}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{cve.description}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Published: {formatDate(cve.publishedDate)} • CVSS: {cve.cvss}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* CVE Charts */}
                <CVETrendChart 
                  data={assessment.vulnerabilities.trendData} 
                  totalCVEs={assessment.vulnerabilities.cveCount}
                />
                
                <CVESeverityBreakdown 
                  severityBreakdown={assessment.vulnerabilities.severityBreakdown}
                />
              </TabsContent>

              {/* Tab 4: Data & Privacy - §6 Data Handling, §7 Permissions */}
              <TabsContent value="privacy" className="space-y-6">
                {shouldShowSection('privacy', reportSize) ? (
                  <>
                    <DataHandlingFlowchart dataHandling={assessment.dataHandling} />
                    <PermissionsMatrix permissions={assessment.permissions} />
                  </>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Data & Privacy</CardTitle>
                      <CardDescription>Available in Full and Enterprise reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Upgrade to Full or Enterprise report size to view detailed data handling practices and permissions analysis.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Tab 5: Technical - §9 Release Lifecycle, §10 AI Features */}
              <TabsContent value="technical" className="space-y-6">
                {shouldShowSection('technical', reportSize) ? (
                  <>
                    <ReleaseLifecycleTimeline 
                      releaseLifecycle={{
                        ...assessment.releaseLifecycle,
                        versionHistory: assessment.releaseLifecycle.versionHistory.slice(0, reportConfig.versionHistoryLimit)
                      }} 
                    />
                    <AIFeaturesBreakdown aiFeatures={assessment.aiFeatures} />
                  </>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Technical Details</CardTitle>
                      <CardDescription>Available in Medium reports and above</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Upgrade to Medium, Full, or Enterprise report size to view technical details including release lifecycle and AI features analysis.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Tab 6: Compliance - §12 Certifications */}
              <TabsContent value="compliance" className="space-y-6">
                {shouldShowSection('compliance', reportSize) ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance & Certifications</CardTitle>
                    <CardDescription>Industry standards and regulatory compliance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Certifications */}
                    <div>
                      <h4 className="font-semibold mb-3">Certifications & Standards</h4>
                      <div className="flex flex-wrap gap-2">
                        {assessment.compliance.certifications.map((cert) => (
                          <Badge key={cert} variant="secondary" className="text-sm px-3 py-1">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Data Handling Summary */}
                    <div>
                      <h4 className="font-semibold mb-2">Data Handling Summary</h4>
                      <p className="text-muted-foreground">{assessment.compliance.dataHandlingSummary}</p>
                    </div>

                    {/* DPA */}
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${
                          assessment.compliance.dpa ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="font-semibold">
                          Data Processing Agreement (DPA): {assessment.compliance.dpa ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                    </div>

                    {/* Sources */}
                    {shouldShowSection('sources', reportSize) && reportConfig.showDetailedMetrics && assessment.compliance.sources.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Compliance Sources</h4>
                        <div className="space-y-2">
                          {assessment.compliance.sources.map((source) => (
                            <div key={source.id} className="text-sm border rounded p-2">
                              <span className="font-medium">{source.title}</span>
                              {source.date && (
                                <span className="text-muted-foreground ml-2">({source.date})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Compliance & Certifications</CardTitle>
                      <CardDescription>Available in Full and Enterprise reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Upgrade to Full or Enterprise report size to view compliance certifications and regulatory information.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Tab 7: Sources - §3 Information Sources */}
              <TabsContent value="sources" className="space-y-6">
                {shouldShowSection('sources', reportSize) ? (
                  <SourcesBreakdown sources={assessment.sources} />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Information Sources</CardTitle>
                      <CardDescription>Available in Full and Enterprise reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Upgrade to Full or Enterprise report size to view detailed source attribution and transparency information.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Tab 8: Alternatives - Recommendations */}
              <TabsContent value="alternatives" className="space-y-6">
                {shouldShowSection('overview', reportSize) ? (
                  <AlternativesList 
                    alternatives={assessment.alternatives} 
                    currentScore={assessment.trustScore.score}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Alternative Products</CardTitle>
                      <CardDescription>Available in Medium reports and above</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Upgrade to Medium, Full, or Enterprise report size to view recommended alternative products.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Disclaimer Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <DisclaimerBanner 
              timestamp={assessment.timestamp} 
              confidence={assessment.trustScore.confidence}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
