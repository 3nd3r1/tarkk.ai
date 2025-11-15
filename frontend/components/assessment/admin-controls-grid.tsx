'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Assessment } from '@/lib/types';
import { Shield, CheckCircle, XCircle, Key, Users, FileText, Download, Activity } from 'lucide-react';

interface AdminControlsGridProps {
  adminControls: Assessment['adminControls'];
  reportSize?: 'small' | 'medium' | 'full';
}

const controlsConfig = {
  sso: {
    label: 'Single Sign-On (SSO)',
    icon: Key,
    description: 'Centralized authentication via SAML/OAuth',
    benefit: 'Reduced password fatigue, centralized access control',
  },
  mfa: {
    label: 'Multi-Factor Authentication',
    icon: Shield,
    description: 'Additional verification beyond password',
    benefit: 'Strong protection against account takeover',
  },
  rbac: {
    label: 'Role-Based Access Control',
    icon: Users,
    description: 'Granular permissions by user role',
    benefit: 'Principle of least privilege enforcement',
  },
  scim: {
    label: 'SCIM Provisioning',
    icon: Activity,
    description: 'Automated user provisioning and deprovisioning',
    benefit: 'Streamlined onboarding/offboarding',
  },
  auditLogs: {
    label: 'Audit Logs',
    icon: FileText,
    description: 'Comprehensive activity tracking',
    benefit: 'Security monitoring and compliance',
  },
  dataExport: {
    label: 'Data Export',
    icon: Download,
    description: 'Bulk data extraction capability',
    benefit: 'Data portability and backup',
  },
};

export function AdminControlsGrid({ adminControls, reportSize = 'medium' }: AdminControlsGridProps) {
  const enabledCount = Object.values(adminControls).filter(Boolean).length;
  const totalCount = Object.keys(adminControls).length;
  const coveragePercent = Math.round((enabledCount / totalCount) * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-500" />
              Admin Controls & Access Management
            </CardTitle>
            <CardDescription>
              Enterprise security features for IT administrators
            </CardDescription>
          </div>
          
          <div className="text-center">
            <div className={`text-4xl font-bold ${
              coveragePercent === 100 ? 'text-green-500' :
              coveragePercent >= 70 ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {enabledCount}/{totalCount}
            </div>
            <div className="text-xs text-muted-foreground">Features</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Coverage bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Feature Coverage</span>
            <span className="text-sm font-bold">{coveragePercent}%</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${
                coveragePercent === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                coveragePercent >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                'bg-gradient-to-r from-red-500 to-rose-500'
              }`}
              style={{ width: `${coveragePercent}%` }}
            />
          </div>
        </div>

        {/* Controls grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.entries(adminControls) as [keyof typeof adminControls, boolean][]).map(([key, enabled]) => {
            const config = controlsConfig[key];
            const Icon = config.icon;
            
            return (
              <div
                key={key}
                className={`
                  relative overflow-hidden rounded-lg border-2 p-4 transition-all duration-300
                  ${enabled 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20 hover:shadow-md hover:scale-[1.02]' 
                    : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20 opacity-60'
                  }
                `}
              >
                {/* Status indicator corner */}
                <div className={`absolute top-0 right-0 w-12 h-12 ${enabled ? 'bg-green-500' : 'bg-gray-400'}`} 
                     style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
                
                <div className="relative">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      enabled 
                        ? 'bg-green-100 dark:bg-green-900' 
                        : 'bg-gray-200 dark:bg-gray-800'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{config.label}</h4>
                      </div>
                      {reportSize !== 'small' && (
                        <p className="text-xs text-muted-foreground">
                          {config.description}
                        </p>
                      )}
                    </div>
                    
                    {enabled ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                  
                  {enabled && reportSize === 'full' && (
                    <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                      <p className="text-xs text-green-700 dark:text-green-300">
                        <span className="font-semibold">Benefit:</span> {config.benefit}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Assessment summary */}
        <div className={`p-4 rounded-lg border-2 ${
          coveragePercent === 100 ? 'bg-green-50 dark:bg-green-950/20 border-green-500' :
          coveragePercent >= 70 ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500' :
          'bg-red-50 dark:bg-red-950/20 border-red-500'
        }`}>
          <div className="flex items-start gap-3">
            <Shield className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
              coveragePercent === 100 ? 'text-green-500' :
              coveragePercent >= 70 ? 'text-yellow-500' :
              'text-red-500'
            }`} />
            <div>
              <h4 className={`font-semibold text-sm mb-1 ${
                coveragePercent === 100 ? 'text-green-900 dark:text-green-100' :
                coveragePercent >= 70 ? 'text-yellow-900 dark:text-yellow-100' :
                'text-red-900 dark:text-red-100'
              }`}>
                {coveragePercent === 100 
                  ? 'Excellent Enterprise Controls' 
                  : coveragePercent >= 70 
                  ? 'Good Enterprise Support'
                  : 'Limited Enterprise Features'}
              </h4>
              <p className={`text-sm ${
                coveragePercent === 100 ? 'text-green-700 dark:text-green-300' :
                coveragePercent >= 70 ? 'text-yellow-700 dark:text-yellow-300' :
                'text-red-700 dark:text-red-300'
              }`}>
                {coveragePercent === 100 
                  ? 'All recommended enterprise security controls are available. Excellent for organizations with strict security requirements.' 
                  : coveragePercent >= 70 
                  ? 'Most enterprise features available. May be suitable for mid-sized organizations with moderate security needs.'
                  : 'Limited enterprise security features. May not be suitable for organizations with strict compliance requirements.'}
              </p>
            </div>
          </div>
        </div>

        {/* Summary badges */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {coveragePercent === 100 && (
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              All Features Supported
            </Badge>
          )}
          {adminControls.sso && adminControls.mfa && (
            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Strong Authentication
            </Badge>
          )}
          {adminControls.scim && (
            <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Automated Provisioning
            </Badge>
          )}
          {adminControls.auditLogs && (
            <Badge className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 text-xs">
              <FileText className="h-3 w-3 mr-1" />
              Compliance-Ready
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
