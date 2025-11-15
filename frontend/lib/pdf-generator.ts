import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Assessment, ReportSize } from './types';

// Define what sections are included in each report size
const REPORT_SIZE_CONFIG: Record<ReportSize, {
  includeSections: string[];
  cveLimit: number;
  incidentLimit: number;
  versionHistoryLimit: number;
  showDetailedMetrics: boolean;
}> = {
  small: {
    includeSections: ['overview', 'trust-score', 'key-findings'],
    cveLimit: 3,
    incidentLimit: 2,
    versionHistoryLimit: 3,
    showDetailedMetrics: false,
  },
  medium: {
    includeSections: ['overview', 'trust-score', 'security', 'vulnerabilities', 'key-findings'],
    cveLimit: 5,
    incidentLimit: 3,
    versionHistoryLimit: 5,
    showDetailedMetrics: true,
  },
  full: {
    includeSections: ['overview', 'trust-score', 'security', 'vulnerabilities', 'privacy', 'technical', 'compliance', 'sources'],
    cveLimit: 10,
    incidentLimit: 10,
    versionHistoryLimit: 10,
    showDetailedMetrics: true,
  },
  enterprise: {
    includeSections: ['all'],
    cveLimit: Infinity,
    incidentLimit: Infinity,
    versionHistoryLimit: Infinity,
    showDetailedMetrics: true,
  }
};

export function getReportConfig(size: ReportSize) {
  return REPORT_SIZE_CONFIG[size];
}

export function shouldShowSection(section: string, reportSize: ReportSize): boolean {
  const config = REPORT_SIZE_CONFIG[reportSize];
  return config.includeSections.includes('all') || config.includeSections.includes(section);
}

export function filterAssessmentBySize(assessment: Assessment, size: ReportSize): Assessment {
  const config = getReportConfig(size);
  
  return {
    ...assessment,
    vulnerabilities: {
      ...assessment.vulnerabilities,
      recentCVEs: assessment.vulnerabilities.recentCVEs.slice(0, config.cveLimit),
    },
    incidents: {
      ...assessment.incidents,
      timeline: assessment.incidents.timeline.slice(0, config.incidentLimit),
    },
    releaseLifecycle: {
      ...assessment.releaseLifecycle,
      versionHistory: assessment.releaseLifecycle.versionHistory.slice(0, config.versionHistoryLimit),
    },
  };
}

// Generate PDF from the current page
export async function generatePDFReport(
  assessment: Assessment,
  reportSize: ReportSize
): Promise<void> {
  try {
    const config = getReportConfig(reportSize);
    
    // Create a new jsPDF instance
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      pdf.setFontSize(fontSize);
      if (isBold) {
        pdf.setFont('helvetica', 'bold');
      } else {
        pdf.setFont('helvetica', 'normal');
      }
      
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      const lineHeight = fontSize * 0.35;
      
      for (const line of lines) {
        if (yPosition + lineHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      }
      yPosition += 2;
    };

    const addSection = (title: string) => {
      yPosition += 5;
      if (yPosition + 10 > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.setFillColor(59, 130, 246); // Blue color
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, margin + 2, yPosition + 5.5);
      pdf.setTextColor(0, 0, 0);
      yPosition += 10;
    };

    const addKeyValue = (key: string, value: string) => {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(key + ':', margin, yPosition);
      pdf.setFont('helvetica', 'normal');
      const keyWidth = pdf.getTextWidth(key + ': ');
      const valueLines = pdf.splitTextToSize(value, pageWidth - 2 * margin - keyWidth);
      pdf.text(valueLines[0], margin + keyWidth, yPosition);
      yPosition += 5;
      
      for (let i = 1; i < valueLines.length; i++) {
        if (yPosition + 5 > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(valueLines[i], margin + keyWidth, yPosition);
        yPosition += 5;
      }
    };

    // Title Page
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Security Assessment Report', pageWidth / 2, 40, { align: 'center' });
    
    pdf.setFontSize(18);
    pdf.text(assessment.product.name, pageWidth / 2, 55, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`by ${assessment.product.vendor}`, pageWidth / 2, 65, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.text(`Report Size: ${reportSize.toUpperCase()}`, pageWidth / 2, 75, { align: 'center' });
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 82, { align: 'center' });
    
    // Trust Score Circle (visual representation)
    const circleX = pageWidth / 2;
    const circleY = 110;
    const circleRadius = 20;
    
    // Draw trust score circle
    const scoreColor = assessment.trustScore.score >= 80 ? [34, 197, 94] : 
                       assessment.trustScore.score >= 65 ? [234, 179, 8] : 
                       assessment.trustScore.score >= 40 ? [249, 115, 22] : [239, 68, 68];
    
    pdf.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    pdf.circle(circleX, circleY, circleRadius, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(assessment.trustScore.score.toString(), circleX, circleY + 2, { align: 'center' });
    pdf.setFontSize(10);
    pdf.text('Trust Score', circleX, circleY + 9, { align: 'center' });
    
    pdf.setTextColor(0, 0, 0);
    
    yPosition = 150;

    // Product Overview Section
    addSection('Product Overview');
    addKeyValue('Category', assessment.product.category);
    addText(assessment.product.description);
    yPosition += 3;
    addText('Primary Use Cases:', 10, true);
    addText(assessment.product.usage);

    // Trust Score Rationale
    addSection('Trust Score Analysis');
    addText(assessment.trustScore.rationale);
    addKeyValue('Confidence Level', `${assessment.trustScore.confidence}%`);

    // Vendor Information
    if (shouldShowSection('overview', reportSize)) {
      addSection('Vendor Information');
      addKeyValue('Company', assessment.vendorInfo.companyName);
      addKeyValue('Headquarters', assessment.vendorInfo.headquarters);
      addKeyValue('Jurisdiction', assessment.vendorInfo.jurisdiction);
      addKeyValue('Founded', assessment.vendorInfo.founded.toString());
      addKeyValue('Reputation Score', `${assessment.vendorInfo.reputation.score}/100`);
      addText(assessment.vendorInfo.reputation.summary);
      yPosition += 3;
      addText('Security Track Record:', 10, true);
      addText(assessment.vendorInfo.securityTrackRecord);
    }

    // Platform Support
    if (shouldShowSection('overview', reportSize)) {
      addSection('Platform Support');
      const supportedPlatforms = assessment.platformSupport.platforms
        .filter(p => p.supported)
        .map(p => p.name)
        .join(', ');
      addKeyValue('Supported Platforms', supportedPlatforms);
    }

    // Security & Admin Controls
    if (shouldShowSection('security', reportSize)) {
      addSection('Admin Controls & Security Features');
      const controls = assessment.adminControls;
      addKeyValue('Single Sign-On (SSO)', controls.sso ? '✓ Available' : '✗ Not Available');
      addKeyValue('Multi-Factor Auth (MFA)', controls.mfa ? '✓ Available' : '✗ Not Available');
      addKeyValue('Role-Based Access (RBAC)', controls.rbac ? '✓ Available' : '✗ Not Available');
      addKeyValue('SCIM Provisioning', controls.scim ? '✓ Available' : '✗ Not Available');
      addKeyValue('Audit Logs', controls.auditLogs ? '✓ Available' : '✗ Not Available');
      addKeyValue('Data Export', controls.dataExport ? '✓ Available' : '✗ Not Available');
    }

    // Vulnerabilities
    if (shouldShowSection('vulnerabilities', reportSize)) {
      addSection('Vulnerabilities & CVE Analysis');
      addKeyValue('Total CVE Count', assessment.vulnerabilities.cveCount.toString());
      addKeyValue('CISA KEV Status', assessment.vulnerabilities.cisaKEV ? '⚠️ Listed in CISA KEV' : '✓ Not in CISA KEV');
      
      const severity = assessment.vulnerabilities.severityBreakdown;
      addKeyValue('Critical Vulnerabilities', severity.critical.toString());
      addKeyValue('High Severity', severity.high.toString());
      addKeyValue('Medium Severity', severity.medium.toString());
      addKeyValue('Low Severity', severity.low.toString());
      
      if (config.showDetailedMetrics && assessment.vulnerabilities.recentCVEs.length > 0) {
        yPosition += 3;
        addText('Recent CVEs:', 11, true);
        const limit = Math.min(assessment.vulnerabilities.recentCVEs.length, config.cveLimit);
        for (let i = 0; i < limit; i++) {
          const cve = assessment.vulnerabilities.recentCVEs[i];
          yPosition += 2;
          addText(`${cve.id} - ${cve.severity} (CVSS: ${cve.cvss})`, 9, true);
          addText(cve.description, 8);
          addKeyValue('Status', cve.patched ? 'Patched' : 'Unpatched');
        }
      }
    }

    // Data Handling & Privacy
    if (shouldShowSection('privacy', reportSize)) {
      addSection('Data Handling & Privacy');
      addKeyValue('Data Storage Location', assessment.dataHandling.storage.location);
      addKeyValue('Storage Regions', assessment.dataHandling.storage.regions.join(', '));
      if (assessment.dataHandling.storage.cloudProvider) {
        addKeyValue('Cloud Provider', assessment.dataHandling.storage.cloudProvider);
      }
      addKeyValue('Encryption at Rest', assessment.dataHandling.storage.encryptionAtRest ? '✓ Yes' : '✗ No');
      addKeyValue('TLS Version', assessment.dataHandling.transmission.encryptionInTransit.tls);
      addKeyValue('Analytics Collection', assessment.dataHandling.usage.analytics ? 'Yes' : 'No');
      addKeyValue('AI Training Use', assessment.dataHandling.usage.aiTraining ? 'Yes' : 'No');
      addKeyValue('User Can Delete Data', assessment.dataHandling.usage.userCanDelete ? '✓ Yes' : '✗ No');
    }

    // Permissions
    if (shouldShowSection('privacy', reportSize) && config.showDetailedMetrics) {
      addSection('Required Permissions');
      assessment.permissions.required.forEach(perm => {
        addText(`• ${perm.name} (${perm.riskLevel.toUpperCase()} risk)`, 9, true);
        addText(`  ${perm.justification}`, 8);
        yPosition += 1;
      });
    }

    // AI Features
    if (shouldShowSection('technical', reportSize) && assessment.aiFeatures.hasAI) {
      addSection('AI Features Analysis');
      addKeyValue('AI Features', assessment.aiFeatures.hasAI ? 'Present' : 'Not Present');
      addKeyValue('Data Used for Training', assessment.aiFeatures.dataUsedForTraining ? 'Yes' : 'No');
      addKeyValue('Can Opt Out', assessment.aiFeatures.canOptOut ? '✓ Yes' : '✗ No');
      addKeyValue('Processing Location', assessment.aiFeatures.processingLocation);
      
      if (config.showDetailedMetrics && assessment.aiFeatures.features.length > 0) {
        yPosition += 2;
        addText('AI Feature List:', 10, true);
        assessment.aiFeatures.features.forEach(feature => {
          addText(`• ${feature.name}`, 9, true);
          addText(`  ${feature.description}`, 8);
          yPosition += 1;
        });
      }
    }

    // Release & Patch Management
    if (shouldShowSection('technical', reportSize)) {
      addSection('Release & Patch Management');
      addKeyValue('Latest Version', assessment.releaseLifecycle.latestVersion);
      addKeyValue('Release Frequency', assessment.releaseLifecycle.releaseFrequency);
      addKeyValue('Patch Cadence', assessment.releaseLifecycle.patchCadence);
      if (assessment.releaseLifecycle.ltsVersions.length > 0) {
        addKeyValue('LTS Versions', assessment.releaseLifecycle.ltsVersions.join(', '));
      }
    }

    // Security Incidents
    if (shouldShowSection('security', reportSize) && assessment.incidents.count > 0) {
      addSection('Security Incidents');
      addKeyValue('Total Incidents', assessment.incidents.count.toString());
      
      if (config.showDetailedMetrics) {
        const limit = Math.min(assessment.incidents.timeline.length, config.incidentLimit);
        for (let i = 0; i < limit; i++) {
          const incident = assessment.incidents.timeline[i];
          yPosition += 3;
          addText(`${incident.date} - ${incident.title}`, 10, true);
          addKeyValue('Severity', incident.severity);
          addText(incident.description, 9);
          addText('Impact: ' + incident.impact, 9);
          addText('Resolution: ' + incident.resolution, 9);
        }
      }
    }

    // Compliance & Certifications
    if (shouldShowSection('compliance', reportSize)) {
      addSection('Compliance & Certifications');
      if (assessment.compliance.certifications.length > 0) {
        addText('Certifications:', 10, true);
        addText(assessment.compliance.certifications.join(', '), 9);
      }
      yPosition += 2;
      addText(assessment.compliance.dataHandlingSummary);
      addKeyValue('DPA Available', assessment.compliance.dpa ? '✓ Yes' : '✗ No');
    }

    // Information Sources
    if (shouldShowSection('sources', reportSize)) {
      addSection('Information Sources');
      addKeyValue('Public Sources', assessment.sources.public.count.toString());
      addKeyValue('Confidential Sources', assessment.sources.confidential.count.toString());
      
      if (config.showDetailedMetrics) {
        yPosition += 2;
        addText('Public Source Types:', 10, true);
        assessment.sources.public.types.forEach(type => {
          addText(`• ${type.type}: ${type.count}`, 9);
        });
        
        if (reportSize === 'enterprise') {
          yPosition += 2;
          addText('Confidential Source Types:', 10, true);
          assessment.sources.confidential.types.forEach(type => {
            addText(`• ${type.type}: ${type.count}`, 9);
          });
        }
      }
    }

    // Alternatives (for full and enterprise reports)
    if ((reportSize === 'full' || reportSize === 'enterprise') && assessment.alternatives.length > 0) {
      addSection('Alternative Products');
      assessment.alternatives.forEach(alt => {
        yPosition += 2;
        addText(`${alt.name} by ${alt.vendor}`, 10, true);
        addKeyValue('Trust Score', `${alt.trustScore}/100`);
        addText(alt.summary, 9);
        if (alt.whyBetter) {
          addText('Why Better: ' + alt.whyBetter, 9);
        }
        yPosition += 1;
      });
    }

    // Footer on all pages
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(128, 128, 128);
      pdf.text(
        `Security Assessment Report - ${assessment.product.name} - Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Save the PDF
    const fileName = `${assessment.product.name.replace(/\s+/g, '_')}_Security_Report_${reportSize}.pdf`;
    pdf.save(fileName);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
}
