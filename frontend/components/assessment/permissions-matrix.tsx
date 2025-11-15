'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, CheckCircle, Shield, Lock } from 'lucide-react';

interface PermissionsMatrixProps {
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
  reportSize?: 'small' | 'medium' | 'full';
}

const riskLevelConfig = {
  low: {
    color: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
    textColor: 'text-green-700 dark:text-green-300',
    badgeColor: 'bg-green-500',
    icon: CheckCircle,
  },
  medium: {
    color: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    badgeColor: 'bg-yellow-500',
    icon: AlertTriangle,
  },
  high: {
    color: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
    textColor: 'text-red-700 dark:text-red-300',
    badgeColor: 'bg-red-500',
    icon: AlertTriangle,
  },
};

export function PermissionsMatrix({ permissions, reportSize = 'medium' }: PermissionsMatrixProps) {
  const allPermissions = [
    ...permissions.required.map(p => ({ ...p, type: 'required' as const })),
    ...permissions.optional.map(p => ({ ...p, type: 'optional' as const })),
  ];

  // Calculate risk summary
  const riskCounts = {
    low: allPermissions.filter(p => p.riskLevel === 'low').length,
    medium: allPermissions.filter(p => p.riskLevel === 'medium').length,
    high: allPermissions.filter(p => p.riskLevel === 'high').length,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-500" />
              Permissions & Access
            </CardTitle>
            <CardDescription>
              {permissions.required.length} required, {permissions.optional.length} optional
            </CardDescription>
          </div>
          
          {/* Risk summary */}
          <div className="flex gap-2">
            {riskCounts.high > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{riskCounts.high}</div>
                <div className="text-xs text-muted-foreground">High Risk</div>
              </div>
            )}
            {riskCounts.medium > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{riskCounts.medium}</div>
                <div className="text-xs text-muted-foreground">Medium Risk</div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Over-permissioning warning */}
        {permissions.overPermissioningRisk && reportSize !== 'small' && (
          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border-l-4 border-orange-500 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-orange-900 dark:text-orange-100 mb-1">
                  Over-permissioning Risk Detected
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  {permissions.overPermissioningRisk}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Required Permissions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Required Permissions
            </h3>
          </div>
          <div className="space-y-2">
            {permissions.required.map((permission, index) => {
              const config = riskLevelConfig[permission.riskLevel];
              const Icon = config.icon;
              
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${config.color}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`h-4 w-4 ${config.textColor}`} />
                        <h4 className="font-semibold text-sm">{permission.name}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${config.textColor} border-current`}
                        >
                          {permission.riskLevel}
                        </Badge>
                      </div>
                      {reportSize !== 'small' && (
                        <p className="text-sm text-muted-foreground ml-6">
                          {permission.justification}
                        </p>
                      )}
                    </div>
                    <div className={`h-2 w-2 rounded-full ${config.badgeColor} flex-shrink-0 mt-1.5`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional Permissions */}
        {permissions.optional.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Optional Permissions
              </h3>
              <Badge variant="secondary" className="text-xs">
                Can be disabled
              </Badge>
            </div>
            <div className="space-y-2">
              {permissions.optional.map((permission, index) => {
                const config = riskLevelConfig[permission.riskLevel];
                const Icon = config.icon;
                
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${config.color} opacity-90`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`h-4 w-4 ${config.textColor}`} />
                          <h4 className="font-semibold text-sm">{permission.name}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${config.textColor} border-current`}
                          >
                            {permission.riskLevel}
                          </Badge>
                          <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                            Optional
                          </Badge>
                        </div>
                        {reportSize !== 'small' && (
                          <p className="text-sm text-muted-foreground ml-6">
                            {permission.justification}
                          </p>
                        )}
                      </div>
                      <div className={`h-2 w-2 rounded-full ${config.badgeColor} opacity-60 flex-shrink-0 mt-1.5`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Risk distribution visualization */}
        {reportSize === 'full' && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold mb-3">Risk Distribution</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-20 text-sm text-muted-foreground">Low</div>
                <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${(riskCounts.low / allPermissions.length) * 100}%` }}
                  />
                </div>
                <div className="w-12 text-right text-sm font-semibold">{riskCounts.low}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 text-sm text-muted-foreground">Medium</div>
                <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 transition-all duration-500"
                    style={{ width: `${(riskCounts.medium / allPermissions.length) * 100}%` }}
                  />
                </div>
                <div className="w-12 text-right text-sm font-semibold">{riskCounts.medium}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 text-sm text-muted-foreground">High</div>
                <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{ width: `${(riskCounts.high / allPermissions.length) * 100}%` }}
                  />
                </div>
                <div className="w-12 text-right text-sm font-semibold">{riskCounts.high}</div>
              </div>
            </div>
          </div>
        )}

        {/* Summary badges */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Badge variant="outline" className="text-xs">
            {permissions.required.length + permissions.optional.length} Total Permissions
          </Badge>
          {riskCounts.high === 0 && (
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              No High-Risk Permissions
            </Badge>
          )}
          {permissions.optional.length > 0 && (
            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-xs">
              {permissions.optional.length} Permissions Can Be Disabled
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
