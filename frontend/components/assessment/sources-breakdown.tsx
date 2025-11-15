'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Assessment } from '@/lib/types';
import { FileText, Globe, Lock, Shield, TrendingUp, ExternalLink } from 'lucide-react';

interface SourcesBreakdownProps {
  sources: Assessment['sources'];
  reportSize?: 'small' | 'medium' | 'full';
}

export function SourcesBreakdown({ sources, reportSize = 'medium' }: SourcesBreakdownProps) {
  const totalSources = sources.public.count + sources.confidential.count;
  const publicPercentage = Math.round((sources.public.count / totalSources) * 100);
  const confidentialPercentage = 100 - publicPercentage;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Information Sources
            </CardTitle>
            <CardDescription>
              Transparency in data collection and verification
            </CardDescription>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {totalSources}
            </div>
            <div className="text-xs text-muted-foreground">Total Sources</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Source Distribution Visualization */}
        <div className="space-y-4">
          {/* Public Sources */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-green-500" />
                <h4 className="text-sm font-semibold">Public Sources</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-500">{sources.public.count}</span>
                <Badge variant="outline" className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                  {publicPercentage}%
                </Badge>
              </div>
            </div>
            
            {/* Public sources bar */}
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-end pr-4 transition-all duration-1000 ease-out"
                style={{ width: `${publicPercentage}%` }}
              >
                <span className="text-white text-xs font-bold">
                  {publicPercentage > 20 && `${sources.public.count} sources`}
                </span>
              </div>
            </div>
            
            {reportSize !== 'small' && sources.public.types.length > 0 && (
              <div className="pl-6 space-y-2">
                {sources.public.types.map((type, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">{type.type}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {type.count}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confidential Sources */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-orange-500" />
                <h4 className="text-sm font-semibold">Confidential Sources</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-orange-500">{sources.confidential.count}</span>
                <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300">
                  {confidentialPercentage}%
                </Badge>
              </div>
            </div>
            
            {/* Confidential sources bar */}
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-end pr-4 transition-all duration-1000 ease-out"
                style={{ width: `${confidentialPercentage}%` }}
              >
                <span className="text-white text-xs font-bold">
                  {confidentialPercentage > 20 && `${sources.confidential.count} sources`}
                </span>
              </div>
            </div>
            
            {reportSize !== 'small' && sources.confidential.types.length > 0 && (
              <div className="pl-6 space-y-2">
                {sources.confidential.types.map((type, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                      <span className="text-muted-foreground">{type.type}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {type.count}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Source Quality Indicators */}
        {reportSize !== 'small' && (
          <div className="grid grid-cols-2 gap-3 pt-4 border-t">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                  Transparency
                </span>
              </div>
              <div className={`text-2xl font-bold ${
                publicPercentage >= 80 ? 'text-green-500' :
                publicPercentage >= 60 ? 'text-yellow-500' :
                'text-orange-500'
              }`}>
                {publicPercentage >= 80 ? 'High' : publicPercentage >= 60 ? 'Medium' : 'Low'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {publicPercentage}% publicly verifiable
              </p>
            </div>
            
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300">
                  Depth
                </span>
              </div>
              <div className={`text-2xl font-bold ${
                totalSources >= 50 ? 'text-green-500' :
                totalSources >= 30 ? 'text-yellow-500' :
                'text-orange-500'
              }`}>
                {totalSources >= 50 ? 'Deep' : totalSources >= 30 ? 'Moderate' : 'Limited'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalSources} sources analyzed
              </p>
            </div>
          </div>
        )}

        {/* Information boxes */}
        {reportSize === 'full' && (
          <div className="space-y-3 pt-4 border-t">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-semibold text-sm text-green-900 dark:text-green-100 mb-1">
                    Public Sources
                  </h5>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                    Information from vendor documentation, compliance reports, CVE databases, and independent security research. Fully transparent and verifiable.
                  </p>
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <ExternalLink className="h-3 w-3" />
                    <span>Can be independently verified</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-semibold text-sm text-orange-900 dark:text-orange-100 mb-1">
                    Confidential Sources
                  </h5>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                    Information from internal testing, penetration testing reports, and proprietary analysis. Not publicly verifiable but adds depth to assessment.
                  </p>
                  <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                    <Shield className="h-3 w-3" />
                    <span>Conducted by security professionals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary badges */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Badge variant="outline" className="text-xs">
            {totalSources} Total Sources
          </Badge>
          {publicPercentage >= 80 && (
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs">
              <Globe className="h-3 w-3 mr-1" />
              Highly Transparent
            </Badge>
          )}
          {totalSources >= 50 && (
            <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Comprehensive Research
            </Badge>
          )}
          {sources.confidential.count > 0 && (
            <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 text-xs">
              <Lock className="h-3 w-3 mr-1" />
              Includes Proprietary Analysis
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
