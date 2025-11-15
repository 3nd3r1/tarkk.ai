'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Assessment } from '@/lib/types';
import { Calendar, Clock, AlertCircle, TrendingUp, Package, Shield, CheckCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ReleaseLifecycleTimelineProps {
  releaseLifecycle: Assessment['releaseLifecycle'];
  reportSize?: 'small' | 'medium' | 'full';
}

export function ReleaseLifecycleTimeline({ releaseLifecycle, reportSize = 'medium' }: ReleaseLifecycleTimelineProps) {
  // Sort version history by date
  const sortedHistory = [...releaseLifecycle.versionHistory].sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  );

  // Determine if patch cadence is good
  const isPatchCadenceGood = releaseLifecycle.patchCadence.toLowerCase().includes('critical') || 
                             releaseLifecycle.patchCadence.toLowerCase().includes('48h') ||
                             releaseLifecycle.patchCadence.toLowerCase().includes('immediate');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-indigo-500" />
              Release Lifecycle
            </CardTitle>
            <CardDescription>
              Version management and update cadence
            </CardDescription>
          </div>
          
          {releaseLifecycle.latestVersion !== 'N/A (SaaS)' && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Latest Version</div>
              <div className="text-lg font-bold font-mono text-primary">
                {releaseLifecycle.latestVersion}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <h4 className="text-sm font-semibold">Release Frequency</h4>
            </div>
            <p className="text-sm text-muted-foreground">{releaseLifecycle.releaseFrequency}</p>
          </div>
          
          <div className={`p-4 rounded-lg border ${isPatchCadenceGood ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className={`h-4 w-4 ${isPatchCadenceGood ? 'text-green-500' : 'text-yellow-500'}`} />
              <h4 className="text-sm font-semibold">Patch Cadence</h4>
            </div>
            <p className="text-sm text-muted-foreground">{releaseLifecycle.patchCadence}</p>
            {isPatchCadenceGood && (
              <div className="flex items-center gap-1 mt-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400">Fast security response</span>
              </div>
            )}
          </div>
        </div>

        {/* LTS Versions */}
        {releaseLifecycle.ltsVersions.length > 0 && reportSize !== 'small' && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              <h4 className="text-sm font-semibold">Long-Term Support (LTS) Versions</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {releaseLifecycle.ltsVersions.map(version => (
                <Badge key={version} className="bg-indigo-500 text-white font-mono">
                  {version}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* EOL Dates Warning */}
        {releaseLifecycle.eolDates.length > 0 && reportSize !== 'small' && (
          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border-l-4 border-orange-500 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-orange-900 dark:text-orange-100 mb-2">
                  End-of-Life (EOL) Versions
                </h4>
                <div className="space-y-1">
                  {releaseLifecycle.eolDates.map(eol => (
                    <div key={eol.version} className="flex items-center justify-between text-sm">
                      <span className="font-mono text-orange-700 dark:text-orange-300">{eol.version}</span>
                      <span className="text-orange-600 dark:text-orange-400">{formatDate(eol.date)}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                  These versions no longer receive security updates. Upgrade recommended.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Version History Timeline */}
        {sortedHistory.length > 0 && reportSize !== 'small' && (
          <div>
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Recent Version History
            </h4>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
              
              <div className="space-y-4">
                {sortedHistory.slice(0, reportSize === 'full' ? undefined : 5).map((version, index) => {
                  const hasSecurityFixes = version.securityFixes > 0;
                  
                  return (
                    <div key={index} className="relative pl-10">
                      {/* Timeline dot */}
                      <div className={`absolute left-2 w-5 h-5 rounded-full border-4 border-white dark:border-gray-900 ${hasSecurityFixes ? 'bg-red-500' : 'bg-indigo-500'}`} />
                      
                      <div className="p-3 bg-white dark:bg-gray-900 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono font-semibold text-sm">{version.version}</span>
                              {hasSecurityFixes && (
                                <Badge variant="outline" className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  {version.securityFixes} Security {version.securityFixes === 1 ? 'Fix' : 'Fixes'}
                                </Badge>
                              )}
                              {index === 0 && (
                                <Badge className="bg-green-500 text-white text-xs">
                                  Latest
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {formatDate(version.releaseDate)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {reportSize !== 'full' && sortedHistory.length > 5 && (
                <div className="relative pl-10 mt-4">
                  <div className="absolute left-2 w-5 h-5 rounded-full border-4 border-white dark:border-gray-900 bg-gray-300 dark:bg-gray-700" />
                  <div className="text-sm text-muted-foreground">
                    + {sortedHistory.length - 5} more versions
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Summary badges */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {isPatchCadenceGood && (
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Rapid Security Response
            </Badge>
          )}
          {releaseLifecycle.ltsVersions.length > 0 && (
            <Badge className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 text-xs">
              LTS Available
            </Badge>
          )}
          {releaseLifecycle.releaseFrequency.toLowerCase().includes('continuous') && (
            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Continuous Deployment
            </Badge>
          )}
          {sortedHistory.some(v => v.securityFixes > 0) && (
            <Badge variant="outline" className="text-xs">
              {sortedHistory.reduce((sum, v) => sum + v.securityFixes, 0)} Recent Security Fixes
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
