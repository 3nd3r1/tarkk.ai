import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Assessment, ReportSize } from './types';

// Helper function to sanitize text for PDF
function sanitizeText(text: string): string {
  if (!text) return '';
  // Remove or replace problematic characters that might cause encoding issues
  return text
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/[\u2018\u2019]/g, "'") // Replace smart quotes with regular quotes
    .replace(/[\u201C\u201D]/g, '"') // Replace smart double quotes
    .replace(/[\u2013\u2014]/g, '-') // Replace em/en dashes with regular dash
    .replace(/\u2026/g, '...') // Replace ellipsis
    .replace(/[\u2190-\u21FF]/g, '') // Remove arrows
    .replace(/[\u2300-\u23FF]/g, '') // Remove misc technical
    .replace(/[\u25A0-\u25FF]/g, '') // Remove geometric shapes
    .replace(/[\u2600-\u26FF]/g, '') // Remove misc symbols
    .replace(/[\u2700-\u27BF]/g, '') // Remove dingbats
    .replace(/[\uFE00-\uFE0F]/g, '') // Remove variation selectors
    // Remove emoji using surrogate pairs (ES5 compatible)
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '') // Remove emoji
    .trim();
}

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
    
    // Create a new jsPDF instance with proper encoding
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      precision: 2,
      userUnit: 1.0,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Modern color palette
    const colors = {
      primary: [37, 99, 235],      // Blue-600
      primaryLight: [59, 130, 246], // Blue-500
      secondary: [100, 116, 139],   // Slate-500
      success: [34, 197, 94],       // Green-500
      warning: [234, 179, 8],       // Yellow-500
      danger: [239, 68, 68],        // Red-500
      text: [15, 23, 42],           // Slate-900
      textMuted: [100, 116, 139],   // Slate-500
      border: [226, 232, 240],      // Slate-200
      background: [248, 250, 252],  // Slate-50
    };

    // Helper function to check if new page is needed
    const checkNewPage = (spaceNeeded: number) => {
      if (yPosition + spaceNeeded > pageHeight - margin - 15) {
        pdf.addPage();
        yPosition = margin + 10;
        return true;
      }
      return false;
    };

    // Helper function to add text with word wrapping and better spacing
    const addText = (
      text: string, 
      fontSize: number = 10, 
      style: 'normal' | 'bold' | 'italic' = 'normal',
      color: number[] = colors.text,
      marginBottom: number = 4
    ) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', style);
      pdf.setTextColor(color[0], color[1], color[2]);
      
      const sanitizedText = sanitizeText(text);
      const lines = pdf.splitTextToSize(sanitizedText, contentWidth);
      const lineHeight = fontSize * 0.4;
      
      for (const line of lines) {
        checkNewPage(lineHeight + marginBottom);
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      }
      yPosition += marginBottom;
    };

    // Modern section header with accent line
    const addSection = (title: string) => {
      checkNewPage(25);
      yPosition += 8;
      
      // Add subtle background
      pdf.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
      pdf.roundedRect(margin - 5, yPosition - 2, contentWidth + 10, 12, 2, 2, 'F');
      
      // Add left accent line
      pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.rect(margin - 3, yPosition, 3, 8, 'F');
      
      // Add title
      pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.text(sanitizeText(title), margin + 2, yPosition + 6);
      
      pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      yPosition += 16;
    };

    // Subsection header
    const addSubsection = (title: string) => {
      checkNewPage(15);
      yPosition += 4;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.text(sanitizeText(title), margin, yPosition);
      yPosition += 8;
      pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    };

    // Key-value pair with modern styling
    const addKeyValue = (key: string, value: string) => {
      checkNewPage(10);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      pdf.text(sanitizeText(key), margin, yPosition);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      
      const sanitizedValue = sanitizeText(value);
      const valueLines = pdf.splitTextToSize(sanitizedValue, contentWidth - 5);
      pdf.text(valueLines[0], margin, yPosition + 4);
      yPosition += 11;
      
      for (let i = 1; i < valueLines.length; i++) {
        checkNewPage(6);
        pdf.text(valueLines[i], margin, yPosition);
        yPosition += 6;
      }
    };

    // Info box for important information
    const addInfoBox = (text: string, type: 'info' | 'warning' | 'success' | 'danger' = 'info') => {
      checkNewPage(20);
      
      const boxColors = {
        info: { bg: [219, 234, 254], border: [59, 130, 246], icon: 'i' },
        warning: { bg: [254, 249, 195], border: [234, 179, 8], icon: '!' },
        success: { bg: [220, 252, 231], border: [34, 197, 94], icon: 'v' }, // Changed from ✓
        danger: { bg: [254, 226, 226], border: [239, 68, 68], icon: 'x' } // Changed from ✕
      };
      
      const boxConfig = boxColors[type];
      const sanitizedText = sanitizeText(text);
      const lines = pdf.splitTextToSize(sanitizedText, contentWidth - 15);
      const boxHeight = Math.max(12, lines.length * 5 + 6);
      
      // Background
      pdf.setFillColor(boxConfig.bg[0], boxConfig.bg[1], boxConfig.bg[2]);
      pdf.roundedRect(margin, yPosition, contentWidth, boxHeight, 2, 2, 'F');
      
      // Left border
      pdf.setFillColor(boxConfig.border[0], boxConfig.border[1], boxConfig.border[2]);
      pdf.roundedRect(margin, yPosition, 3, boxHeight, 1, 1, 'F');
      
      // Icon
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(boxConfig.border[0], boxConfig.border[1], boxConfig.border[2]);
      pdf.text(boxConfig.icon, margin + 6, yPosition + 7);
      
      // Text
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      let textY = yPosition + 7;
      lines.forEach((line: string) => {
        pdf.text(line, margin + 12, textY);
        textY += 5;
      });
      
      yPosition += boxHeight + 8;
    };

    // === MODERN COVER PAGE ===
    // Gradient-like background effect
    for (let i = 0; i < 5; i++) {
      const shade = 248 - i * 5;
      pdf.setFillColor(shade, shade + 2, 252);
      pdf.rect(0, i * 60, pageWidth, 60, 'F');
    }
    
    // Top accent bar
    pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    pdf.rect(0, 0, pageWidth, 4, 'F');
    
    // Logo/Shield icon area
    pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    pdf.circle(pageWidth / 2, 45, 15, 'F');
    pdf.setFillColor(255, 255, 255);
    pdf.circle(pageWidth / 2, 45, 12, 'F');
    pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('S', pageWidth / 2 - 3, 50);
    
    // Title
    pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Security Assessment Report', pageWidth / 2, 80, { align: 'center' });
    
    // Decorative line
    pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    pdf.setLineWidth(0.5);
    pdf.line(pageWidth / 2 - 40, 85, pageWidth / 2 + 40, 85);
    
    // Product name
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    pdf.text(sanitizeText(assessment.product.name), pageWidth / 2, 100, { align: 'center' });
    
    // Vendor
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    pdf.text(sanitizeText(`by ${assessment.product.vendor}`), pageWidth / 2, 110, { align: 'center' });
    
    // Trust Score Circle with modern design
    const circleX = pageWidth / 2;
    const circleY = 145;
    const circleRadius = 25;
    
    const scoreColor = assessment.trustScore.score >= 80 ? colors.success : 
                       assessment.trustScore.score >= 65 ? colors.warning : 
                       assessment.trustScore.score >= 40 ? [249, 115, 22] : colors.danger;
    
    // Main circle
    pdf.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    pdf.circle(circleX, circleY, circleRadius, 'F');
    
    // Inner white circle
    pdf.setFillColor(255, 255, 255);
    pdf.circle(circleX, circleY, circleRadius - 3, 'F');
    
    // Score text
    pdf.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text(assessment.trustScore.score.toString(), circleX, circleY + 2, { align: 'center' });
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('TRUST SCORE', circleX, circleY + 11, { align: 'center' });
    
    // Info cards
    const cardY = 185;
    const cardWidth = (contentWidth - 10) / 3;
    
    // Report Size Card
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    pdf.roundedRect(margin, cardY, cardWidth, 20, 2, 2, 'FD');
    pdf.setFontSize(8);
    pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    pdf.text('REPORT TYPE', margin + cardWidth / 2, cardY + 8, { align: 'center' });
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    pdf.text(reportSize.toUpperCase(), margin + cardWidth / 2, cardY + 15, { align: 'center' });
    
    // Date Card
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(margin + cardWidth + 5, cardY, cardWidth, 20, 2, 2, 'FD');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    pdf.text('GENERATED', margin + cardWidth * 1.5 + 5, cardY + 8, { align: 'center' });
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    pdf.text(new Date().toLocaleDateString(), margin + cardWidth * 1.5 + 5, cardY + 15, { align: 'center' });
    
    // Confidence Card
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(margin + cardWidth * 2 + 10, cardY, cardWidth, 20, 2, 2, 'FD');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    pdf.text('CONFIDENCE', margin + cardWidth * 2.5 + 10, cardY + 8, { align: 'center' });
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    pdf.text(`${assessment.trustScore.confidence}%`, margin + cardWidth * 2.5 + 10, cardY + 15, { align: 'center' });
    
    // Category badge
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(colors.primaryLight[0], colors.primaryLight[1], colors.primaryLight[2]);
    const sanitizedCategory = sanitizeText(assessment.product.category);
    const categoryWidth = pdf.getTextWidth(sanitizedCategory) + 12;
    pdf.roundedRect(pageWidth / 2 - categoryWidth / 2, 215, categoryWidth, 8, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text(sanitizedCategory, pageWidth / 2, 220, { align: 'center' });
    
    // Footer notice
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    pdf.text('CONFIDENTIAL SECURITY ASSESSMENT', pageWidth / 2, pageHeight - 20, { align: 'center' });
    
    // Reset for content pages
    pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    pdf.addPage();
    yPosition = margin + 10;

    // === CONTENT PAGES ===
    
    // Product Overview Section
    addSection('Product Overview');
    addKeyValue('Category', assessment.product.category);
    addText(assessment.product.description, 10, 'normal', colors.text, 6);
    addSubsection('Primary Use Cases');
    addText(assessment.product.usage, 10, 'normal', colors.text, 8);

    // Trust Score Rationale
    addSection('Trust Score Analysis');
    addText(assessment.trustScore.rationale, 10, 'normal', colors.text, 6);
    addKeyValue('Confidence Level', `${assessment.trustScore.confidence}%`);

    // Vendor Information
    if (shouldShowSection('overview', reportSize)) {
      addSection('Vendor Information');
      addKeyValue('Company', assessment.vendorInfo.companyName);
      addKeyValue('Headquarters', assessment.vendorInfo.headquarters);
      addKeyValue('Jurisdiction', assessment.vendorInfo.jurisdiction);
      addKeyValue('Founded', assessment.vendorInfo.founded.toString());
      addKeyValue('Reputation Score', `${assessment.vendorInfo.reputation.score}/100`);
      addText(assessment.vendorInfo.reputation.summary, 10, 'normal', colors.text, 6);
      addSubsection('Security Track Record');
      addText(assessment.vendorInfo.securityTrackRecord, 10, 'normal', colors.text, 8);
    }

    // Platform Support
    if (shouldShowSection('overview', reportSize)) {
      addSection('Platform Support');
      const supportedPlatforms = assessment.platformSupport.platforms
        .filter(p => p.supported)
        .map(p => p.name)
        .join(', ');
      addKeyValue('Supported Platforms', supportedPlatforms);
      yPosition += 5;
    }

    // Security & Admin Controls
    if (shouldShowSection('security', reportSize)) {
      addSection('Admin Controls & Security Features');
      const controls = assessment.adminControls;
      addKeyValue('Single Sign-On (SSO)', controls.sso ? '[YES] Available' : '[NO] Not Available');
      addKeyValue('Multi-Factor Auth (MFA)', controls.mfa ? '[YES] Available' : '[NO] Not Available');
      addKeyValue('Role-Based Access (RBAC)', controls.rbac ? '[YES] Available' : '[NO] Not Available');
      addKeyValue('SCIM Provisioning', controls.scim ? '[YES] Available' : '[NO] Not Available');
      addKeyValue('Audit Logs', controls.auditLogs ? '[YES] Available' : '[NO] Not Available');
      addKeyValue('Data Export', controls.dataExport ? '[YES] Available' : '[NO] Not Available');
      yPosition += 5;
    }

    // Vulnerabilities
    if (shouldShowSection('vulnerabilities', reportSize)) {
      addSection('Vulnerabilities & CVE Analysis');
      addKeyValue('Total CVE Count', assessment.vulnerabilities.cveCount.toString());
      
      if (assessment.vulnerabilities.cisaKEV) {
        addInfoBox('This software has vulnerabilities listed in CISA\'s Known Exploited Vulnerabilities catalog. Immediate patching recommended.', 'danger');
      } else {
        addKeyValue('CISA KEV Status', '[OK] Not in CISA KEV');
      }
      
      const severity = assessment.vulnerabilities.severityBreakdown;
      addSubsection('Severity Breakdown');
      addKeyValue('Critical Vulnerabilities', severity.critical.toString());
      addKeyValue('High Severity', severity.high.toString());
      addKeyValue('Medium Severity', severity.medium.toString());
      addKeyValue('Low Severity', severity.low.toString());
      
      if (config.showDetailedMetrics && assessment.vulnerabilities.recentCVEs.length > 0) {
        addSubsection('Recent CVEs');
        const limit = Math.min(assessment.vulnerabilities.recentCVEs.length, config.cveLimit);
        for (let i = 0; i < limit; i++) {
          const cve = assessment.vulnerabilities.recentCVEs[i];
          yPosition += 3;
          addText(`${cve.id} - ${cve.severity} (CVSS: ${cve.cvss})`, 10, 'bold', colors.text, 3);
          addText(cve.description, 9, 'normal', colors.textMuted, 3);
          addKeyValue('Status', cve.patched ? '[PATCHED]' : '[UNPATCHED]');
          yPosition += 2;
        }
      }
    }

    // Data Handling & Privacy
    if (shouldShowSection('privacy', reportSize)) {
      addSection('Data Handling & Privacy');
      addSubsection('Storage');
      addKeyValue('Data Storage Location', assessment.dataHandling.storage.location);
      addKeyValue('Storage Regions', assessment.dataHandling.storage.regions.join(', '));
      if (assessment.dataHandling.storage.cloudProvider) {
        addKeyValue('Cloud Provider', assessment.dataHandling.storage.cloudProvider);
      }
      addKeyValue('Encryption at Rest', assessment.dataHandling.storage.encryptionAtRest ? '[YES]' : '[NO]');
      
      addSubsection('Transmission');
      addKeyValue('TLS Version', assessment.dataHandling.transmission.encryptionInTransit.tls);
      
      addSubsection('Usage');
      addKeyValue('Analytics Collection', assessment.dataHandling.usage.analytics ? 'Yes' : 'No');
      addKeyValue('AI Training Use', assessment.dataHandling.usage.aiTraining ? 'Yes' : 'No');
      addKeyValue('User Can Delete Data', assessment.dataHandling.usage.userCanDelete ? '[YES]' : '[NO]');
      yPosition += 5;
    }

    // Permissions
    if (shouldShowSection('privacy', reportSize) && config.showDetailedMetrics) {
      addSection('Required Permissions');
      assessment.permissions.required.forEach(perm => {
        addText(`- ${perm.name} (${perm.riskLevel.toUpperCase()} risk)`, 10, 'bold', colors.text, 2);
        addText(`  ${perm.justification}`, 9, 'normal', colors.textMuted, 4);
      });
      yPosition += 5;
    }

    // AI Features
    if (shouldShowSection('technical', reportSize) && assessment.aiFeatures.hasAI) {
      addSection('AI Features Analysis');
      addKeyValue('AI Features', assessment.aiFeatures.hasAI ? 'Present' : 'Not Present');
      addKeyValue('Data Used for Training', assessment.aiFeatures.dataUsedForTraining ? 'Yes' : 'No');
      addKeyValue('Can Opt Out', assessment.aiFeatures.canOptOut ? '[YES]' : '[NO]');
      addKeyValue('Processing Location', assessment.aiFeatures.processingLocation);
      
      if (config.showDetailedMetrics && assessment.aiFeatures.features.length > 0) {
        addSubsection('AI Feature List');
        assessment.aiFeatures.features.forEach(feature => {
          addText(`- ${feature.name}`, 10, 'bold', colors.text, 2);
          addText(`  ${feature.description}`, 9, 'normal', colors.textMuted, 4);
        });
      }
      yPosition += 5;
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
      yPosition += 5;
    }

    // Security Incidents
    if (shouldShowSection('security', reportSize) && assessment.incidents.count > 0) {
      addSection('Security Incidents');
      addKeyValue('Total Incidents', assessment.incidents.count.toString());
      
      if (config.showDetailedMetrics) {
        const limit = Math.min(assessment.incidents.timeline.length, config.incidentLimit);
        for (let i = 0; i < limit; i++) {
          const incident = assessment.incidents.timeline[i];
          yPosition += 4;
          addText(`${incident.date} - ${incident.title}`, 11, 'bold', colors.text, 3);
          addKeyValue('Severity', incident.severity);
          addText(incident.description, 9, 'normal', colors.text, 3);
          addText('Impact: ' + incident.impact, 9, 'normal', colors.textMuted, 3);
          addText('Resolution: ' + incident.resolution, 9, 'normal', colors.textMuted, 5);
        }
      }
    }

    // Compliance & Certifications
    if (shouldShowSection('compliance', reportSize)) {
      addSection('Compliance & Certifications');
      if (assessment.compliance.certifications.length > 0) {
        addSubsection('Certifications & Standards');
        addText(assessment.compliance.certifications.join(', '), 10, 'normal', colors.text, 6);
      }
      addText(assessment.compliance.dataHandlingSummary, 10, 'normal', colors.text, 6);
      addKeyValue('DPA Available', assessment.compliance.dpa ? '[YES]' : '[NO]');
      yPosition += 5;
    }

    // Information Sources
    if (shouldShowSection('sources', reportSize)) {
      addSection('Information Sources');
      addKeyValue('Public Sources', assessment.sources.public.count.toString());
      addKeyValue('Confidential Sources', assessment.sources.confidential.count.toString());
      
      if (config.showDetailedMetrics) {
        addSubsection('Public Source Types');
        assessment.sources.public.types.forEach(type => {
          addText(`- ${type.type}: ${type.count}`, 9, 'normal', colors.text, 2);
        });
        
        if (reportSize === 'enterprise') {
          addSubsection('Confidential Source Types');
          assessment.sources.confidential.types.forEach(type => {
            addText(`- ${type.type}: ${type.count}`, 9, 'normal', colors.text, 2);
          });
        }
      }
      yPosition += 5;
    }

    // Alternatives (for full and enterprise reports)
    if ((reportSize === 'full' || reportSize === 'enterprise') && assessment.alternatives.length > 0) {
      addSection('Alternative Products');
      assessment.alternatives.forEach(alt => {
        yPosition += 3;
        addText(`${alt.name} by ${alt.vendor}`, 11, 'bold', colors.text, 3);
        addKeyValue('Trust Score', `${alt.trustScore}/100`);
        addText(alt.summary, 9, 'normal', colors.text, 3);
        if (alt.whyBetter) {
          addText('Why Better: ' + alt.whyBetter, 9, 'normal', colors.textMuted, 5);
        }
      });
    }

    // Footer on all pages
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      // Footer line
      pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      pdf.setLineWidth(0.3);
      pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      
      // Footer text
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
      pdf.text(
        sanitizeText(`Security Assessment Report - ${assessment.product.name}`),
        margin,
        pageHeight - 10
      );
      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: 'right' }
      );
    }

    // Save the PDF with proper encoding
    const sanitizedProductName = sanitizeText(assessment.product.name)
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, ''); // Remove any non-alphanumeric characters except _ and -
    const fileName = `${sanitizedProductName || 'Assessment'}_Security_Report_${reportSize}.pdf`;
    
    // Generate PDF as blob with proper encoding and download it
    try {
      const pdfBlob = pdf.output('blob');
      
      // Use proper download method
      if (typeof window !== 'undefined') {
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 150);
      }
    } catch (downloadError) {
      console.error('Error downloading PDF:', downloadError);
      throw new Error('Failed to download PDF file');
    }
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
}
