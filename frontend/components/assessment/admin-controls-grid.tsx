'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Shield, Key, Users, Shuffle, FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminControls {
  sso: boolean;
  mfa: boolean;
  rbac: boolean;
  scim: boolean;
  auditLogs: boolean;
  dataExport: boolean;
}

interface AdminControlsGridProps {
  controls: AdminControls;
  title?: string;
}

const controlsConfig = {
  sso: {
    icon: Key,
    label: 'Single Sign-On (SSO)',
    description: 'Centralized authentication via SAML, OAuth, or OIDC',
    importance: 'critical',
  },
  mfa: {
    icon: Shield,
    label: 'Multi-Factor Authentication',
    description: 'Additional security layer beyond passwords',
    importance: 'critical',
  },
  rbac: {
    icon: Users,
    label: 'Role-Based Access Control',
    description: 'Granular permissions and user roles',
    importance: 'high',
  },
  scim: {
    icon: Shuffle,
    label: 'SCIM Provisioning',
    description: 'Automated user provisioning and deprovisioning',
    importance: 'high',
  },
  auditLogs: {
    icon: FileText,
    label: 'Audit Logs',
    description: 'Comprehensive activity logging and monitoring',
    importance: 'medium',
  },
  dataExport: {
    icon: Download,
    label: 'Data Export',
    description: 'Ability to export all user data',
    importance: 'medium',
  },
};

export function AdminControlsGrid({
  controls,
  title = 'Administrative Controls',
}: AdminControlsGridProps) {
  // Calculate compliance score
  const enabledCount = Object.values(controls).filter(Boolean).length;
  const totalCount = Object.keys(controls).length;
  const complianceScore = Math.round((enabledCount / totalCount) * 100);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">
              Enterprise security and user management capabilities
            </p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor(complianceScore)}`}>
              {complianceScore}%
            </div>
            <div className="text-xs text-muted-foreground">Compliance</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {enabledCount} of {totalCount} features enabled
            </span>
            <span className={getScoreColor(complianceScore)}>
              {complianceScore}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                complianceScore >= 80
                  ? 'bg-green-500'
                  : complianceScore >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${complianceScore}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(controls).map(([key, enabled], index) => {
            const config = controlsConfig[key as keyof AdminControls];
            const Icon = config.icon;
            const isEnabled = enabled;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isEnabled
                    ? 'bg-green-500/5 border-green-500/30 hover:border-green-500/50'
                    : 'bg-red-500/5 border-red-500/30 hover:border-red-500/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={`p-2 rounded-md ${
                      isEnabled ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isEnabled ? 'text-green-500' : 'text-red-500'
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm leading-tight">
                        {config.label}
                      </h4>
                      {isEnabled ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {config.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          config.importance === 'critical'
                            ? 'bg-red-500/10 text-red-500 border-red-500/30'
                            : config.importance === 'high'
                            ? 'bg-orange-500/10 text-orange-500 border-orange-500/30'
                            : 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                        }
                      >
                        {config.importance}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          isEnabled
                            ? 'bg-green-500/10 text-green-500 border-green-500/30'
                            : 'bg-red-500/10 text-red-500 border-red-500/30'
                        }
                      >
                        {isEnabled ? 'Supported' : 'Not Available'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">Security Assessment</h4>
              <p className="text-sm text-muted-foreground">
                {complianceScore >= 80 && (
                  <>
                    ✅ <strong className="text-green-600 dark:text-green-400">Excellent</strong> enterprise
                    security controls. This product provides comprehensive administrative features for secure
                    organizational deployment.
                  </>
                )}
                {complianceScore >= 60 && complianceScore < 80 && (
                  <>
                    ⚠️ <strong className="text-yellow-600 dark:text-yellow-400">Good</strong> security controls
                    with some limitations. Consider whether missing features are critical for your organization.
                  </>
                )}
                {complianceScore < 60 && (
                  <>
                    ❌ <strong className="text-red-600 dark:text-red-400">Limited</strong> administrative
                    controls. This product may not meet enterprise security requirements.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
