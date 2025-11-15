'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Assessment } from '@/lib/types';
import { Monitor, Laptop, Smartphone, Globe, CheckCircle, XCircle, Info } from 'lucide-react';

interface PlatformSupportGridProps {
  platformSupport: Assessment['platformSupport'];
  reportSize?: 'small' | 'medium' | 'full';
}

const platformIcons = {
  macOS: Laptop,
  Windows: Monitor,
  Linux: Monitor,
  iOS: Smartphone,
  Android: Smartphone,
  Web: Globe,
};

const platformColors = {
  macOS: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100',
  Windows: 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100',
  Linux: 'bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100',
  iOS: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100',
  Android: 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100',
  Web: 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100',
};

export function PlatformSupportGrid({ platformSupport, reportSize = 'medium' }: PlatformSupportGridProps) {
  const supportedCount = platformSupport.platforms.filter(p => p.supported).length;
  const totalCount = platformSupport.platforms.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              Platform Support
            </CardTitle>
            <CardDescription>
              Supported on {supportedCount} of {totalCount} platforms
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {Math.round((supportedCount / totalCount) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Coverage</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platformSupport.platforms.map((platform) => {
            const Icon = platformIcons[platform.name];
            const colorClass = platformColors[platform.name];
            
            return (
              <div
                key={platform.name}
                className={`
                  relative overflow-hidden rounded-lg border-2 transition-all duration-300
                  ${platform.supported 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20 hover:shadow-md hover:scale-105' 
                    : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20 opacity-60'
                  }
                `}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {platform.supported ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-1">{platform.name}</h3>
                  
                  {platform.supported && platform.versions && reportSize !== 'small' && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {platform.versions}
                    </p>
                  )}
                  
                  {platform.supported && platform.securityModel && reportSize === 'full' && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Info className="h-3 w-3" />
                        <span className="font-medium">Security:</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {platform.securityModel}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Status indicator bar */}
                <div className={`h-1 w-full ${platform.supported ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
              </div>
            );
          })}
        </div>

        {platformSupport.versionDifferences && reportSize !== 'small' && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100 mb-1">
                  Platform Differences
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {platformSupport.versionDifferences}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Platform compatibility summary */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline" className="text-xs">
            {supportedCount === totalCount ? '✓ Full Multi-Platform' : `${supportedCount}/${totalCount} Platforms`}
          </Badge>
          {platformSupport.platforms.some(p => p.supported && p.name === 'Web') && (
            <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
              <Globe className="h-3 w-3 mr-1" />
              Web-based
            </Badge>
          )}
          {platformSupport.platforms.filter(p => p.supported && (p.name === 'iOS' || p.name === 'Android')).length === 2 && (
            <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <Smartphone className="h-3 w-3 mr-1" />
              Mobile-friendly
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
