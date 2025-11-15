'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Assessment } from '@/lib/types';
import { Database, ArrowRight, Cloud, Users, Shield, Lock, Unlock, AlertTriangle, CheckCircle, Radio } from 'lucide-react';

interface DataHandlingFlowchartProps {
  dataHandling: Assessment['dataHandling'];
  reportSize?: 'small' | 'medium' | 'full';
}

export function DataHandlingFlowchart({ dataHandling, reportSize = 'medium' }: DataHandlingFlowchartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-teal-500" />
          Data Handling Flow
        </CardTitle>
        <CardDescription>
          How your data is stored, transmitted, and used
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Flow visualization */}
        <div className="relative">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Storage */}
            <div className="flex-1 w-full">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative p-6 bg-white dark:bg-gray-900 border-2 border-teal-500 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="h-6 w-6 text-teal-500" />
                    <h3 className="font-semibold text-lg">Storage</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="font-medium text-sm">{dataHandling.storage.location}</p>
                    </div>
                    
                    {reportSize !== 'small' && (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Regions</p>
                          <div className="flex flex-wrap gap-1">
                            {dataHandling.storage.regions.map(region => (
                              <Badge key={region} variant="outline" className="text-xs">
                                {region}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {dataHandling.storage.cloudProvider && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Cloud Provider</p>
                            <Badge variant="secondary" className="text-xs">
                              <Cloud className="h-3 w-3 mr-1" />
                              {dataHandling.storage.cloudProvider}
                            </Badge>
                          </div>
                        )}
                      </>
                    )}
                    
                    <div className="flex items-center gap-2 pt-2 border-t">
                      {dataHandling.storage.encryptionAtRest ? (
                        <>
                          <Lock className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                            Encrypted at rest
                          </span>
                        </>
                      ) : (
                        <>
                          <Unlock className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                            Not encrypted at rest
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <ArrowRight className="h-8 w-8 text-muted-foreground hidden md:block flex-shrink-0" />
            <div className="md:hidden">
              <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
            </div>

            {/* Transmission */}
            <div className="flex-1 w-full">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative p-6 bg-white dark:bg-gray-900 border-2 border-blue-500 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Radio className="h-6 w-6 text-blue-500" />
                    <h3 className="font-semibold text-lg">Transmission</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {reportSize !== 'small' && (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Endpoints</p>
                          <div className="flex flex-wrap gap-1">
                            {dataHandling.transmission.endpoints.slice(0, reportSize === 'full' ? undefined : 2).map(endpoint => (
                              <Badge key={endpoint} variant="outline" className="text-xs font-mono">
                                {endpoint}
                              </Badge>
                            ))}
                            {reportSize !== 'full' && dataHandling.transmission.endpoints.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{dataHandling.transmission.endpoints.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {reportSize === 'full' && dataHandling.transmission.subProcessors.length > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Sub-processors</p>
                            <div className="flex flex-wrap gap-1">
                              {dataHandling.transmission.subProcessors.map(sub => (
                                <Badge key={sub} variant="secondary" className="text-xs">
                                  {sub}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    <div className="pt-2 border-t space-y-2">
                      <div className="flex items-center gap-2">
                        {dataHandling.transmission.encryptionInTransit.certVerified ? (
                          <Shield className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="text-sm font-medium">
                          {dataHandling.transmission.encryptionInTransit.tls}
                        </span>
                      </div>
                      {dataHandling.transmission.encryptionInTransit.certVerified && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">
                            Certificate verified
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <ArrowRight className="h-8 w-8 text-muted-foreground hidden md:block flex-shrink-0" />
            <div className="md:hidden">
              <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
            </div>

            {/* Usage */}
            <div className="flex-1 w-full">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative p-6 bg-white dark:bg-gray-900 border-2 border-purple-500 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="h-6 w-6 text-purple-500" />
                    <h3 className="font-semibold text-lg">Usage</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Analytics</span>
                      {dataHandling.usage.analytics ? (
                        <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300">
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                          No
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Advertising</span>
                      {dataHandling.usage.advertising ? (
                        <Badge variant="outline" className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                          No
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>AI Training</span>
                      {dataHandling.usage.aiTraining ? (
                        <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                          No
                        </Badge>
                      )}
                    </div>
                    
                    {reportSize !== 'small' && (
                      <>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground mb-1">Retention</p>
                          <p className="text-sm font-medium">{dataHandling.usage.retentionPolicy}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-1">
                          {dataHandling.usage.userCanDelete ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600 dark:text-green-400">
                                Users can delete data
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                              <span className="text-sm text-orange-600 dark:text-orange-400">
                                Limited deletion rights
                              </span>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary badges */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {dataHandling.storage.encryptionAtRest && (
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
              <Lock className="h-3 w-3 mr-1" />
              Encrypted Storage
            </Badge>
          )}
          {dataHandling.transmission.encryptionInTransit.tls.includes('1.3') && (
            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
              <Shield className="h-3 w-3 mr-1" />
              TLS 1.3
            </Badge>
          )}
          {!dataHandling.usage.advertising && (
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
              No Advertising
            </Badge>
          )}
          {dataHandling.usage.userCanDelete && (
            <Badge className="bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800">
              User-controlled Deletion
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
