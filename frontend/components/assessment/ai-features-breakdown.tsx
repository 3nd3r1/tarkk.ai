'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Assessment } from '@/lib/types';
import { Brain, Sparkles, Database, MapPin, AlertCircle, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';

interface AIFeaturesBreakdownProps {
  aiFeatures: Assessment['aiFeatures'];
  reportSize?: 'small' | 'medium' | 'full';
}

export function AIFeaturesBreakdown({ aiFeatures, reportSize = 'medium' }: AIFeaturesBreakdownProps) {
  if (!aiFeatures.hasAI) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12">
          <div className="text-center">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No AI Features</h3>
            <p className="text-sm text-muted-foreground">
              This product does not use artificial intelligence or machine learning capabilities.
            </p>
            <Badge variant="outline" className="mt-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
              <CheckCircle className="h-3 w-3 mr-1" />
              No AI Data Processing
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine overall privacy score
  const privacyScore = aiFeatures.dataUsedForTraining 
    ? (aiFeatures.canOptOut ? 50 : 20) 
    : (aiFeatures.processingLocation === 'local' ? 100 : 80);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              AI Features
            </CardTitle>
            <CardDescription>
              {aiFeatures.features.length} AI {aiFeatures.features.length === 1 ? 'capability' : 'capabilities'} detected
            </CardDescription>
          </div>
          
          {/* Privacy Score */}
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              privacyScore >= 80 ? 'text-green-500' :
              privacyScore >= 50 ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {privacyScore}
            </div>
            <div className="text-xs text-muted-foreground">Privacy Score</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Concerns Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className={`p-3 rounded-lg border ${aiFeatures.dataUsedForTraining ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800' : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'}`}>
            <div className="flex items-center gap-2 mb-1">
              <Database className={`h-4 w-4 ${aiFeatures.dataUsedForTraining ? 'text-yellow-500' : 'text-green-500'}`} />
              <span className="text-xs font-semibold uppercase tracking-wide">Training Data</span>
            </div>
            <p className={`text-sm font-medium ${aiFeatures.dataUsedForTraining ? 'text-yellow-700 dark:text-yellow-300' : 'text-green-700 dark:text-green-300'}`}>
              {aiFeatures.dataUsedForTraining ? 'Used for training' : 'Not used for training'}
            </p>
          </div>
          
          <div className={`p-3 rounded-lg border ${aiFeatures.canOptOut ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'}`}>
            <div className="flex items-center gap-2 mb-1">
              {aiFeatures.canOptOut ? (
                <EyeOff className="h-4 w-4 text-green-500" />
              ) : (
                <Eye className="h-4 w-4 text-red-500" />
              )}
              <span className="text-xs font-semibold uppercase tracking-wide">Opt-Out</span>
            </div>
            <p className={`text-sm font-medium ${aiFeatures.canOptOut ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {aiFeatures.canOptOut ? 'Can opt out' : 'Cannot opt out'}
            </p>
          </div>
          
          <div className={`p-3 rounded-lg border ${
            aiFeatures.processingLocation === 'local' ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' :
            aiFeatures.processingLocation === 'cloud' ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800' :
            'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className={`h-4 w-4 ${
                aiFeatures.processingLocation === 'local' ? 'text-green-500' :
                aiFeatures.processingLocation === 'cloud' ? 'text-yellow-500' :
                'text-blue-500'
              }`} />
              <span className="text-xs font-semibold uppercase tracking-wide">Processing</span>
            </div>
            <p className={`text-sm font-medium capitalize ${
              aiFeatures.processingLocation === 'local' ? 'text-green-700 dark:text-green-300' :
              aiFeatures.processingLocation === 'cloud' ? 'text-yellow-700 dark:text-yellow-300' :
              'text-blue-700 dark:text-blue-300'
            }`}>
              {aiFeatures.processingLocation}
            </p>
          </div>
        </div>

        {/* Training Warning */}
        {aiFeatures.dataUsedForTraining && reportSize !== 'small' && (
          <div className={`p-4 rounded-lg border-l-4 ${
            aiFeatures.canOptOut 
              ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500' 
              : 'bg-red-50 dark:bg-red-950/20 border-red-500'
          }`}>
            <div className="flex items-start gap-3">
              <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                aiFeatures.canOptOut ? 'text-yellow-500' : 'text-red-500'
              }`} />
              <div>
                <h4 className={`font-semibold text-sm mb-1 ${
                  aiFeatures.canOptOut 
                    ? 'text-yellow-900 dark:text-yellow-100' 
                    : 'text-red-900 dark:text-red-100'
                }`}>
                  Your Data May Be Used for AI Training
                </h4>
                <p className={`text-sm ${
                  aiFeatures.canOptOut 
                    ? 'text-yellow-700 dark:text-yellow-300' 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {aiFeatures.canOptOut 
                    ? 'This product uses your data to train AI models, but you can opt out in settings.' 
                    : 'This product uses your data to train AI models with no opt-out option available.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Features List */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            AI Capabilities
          </h4>
          <div className="space-y-3">
            {aiFeatures.features.map((feature, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-sm mb-1">{feature.name}</h5>
                    {reportSize !== 'small' && (
                      <>
                        <p className="text-sm text-muted-foreground mb-2">
                          {feature.description}
                        </p>
                        
                        {feature.dataAccess.length > 0 && reportSize === 'full' && (
                          <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-2 mb-2">
                              <Database className="h-3 w-3 text-purple-500" />
                              <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                                Data Access:
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {feature.dataAccess.map((access, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-white dark:bg-gray-900 border-purple-200 dark:border-purple-800">
                                  {access}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary badges */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
            <Brain className="h-3 w-3 mr-1" />
            {aiFeatures.features.length} AI {aiFeatures.features.length === 1 ? 'Feature' : 'Features'}
          </Badge>
          
          {!aiFeatures.dataUsedForTraining && (
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              No Training Data Collection
            </Badge>
          )}
          
          {aiFeatures.canOptOut && (
            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
              <EyeOff className="h-3 w-3 mr-1" />
              Opt-Out Available
            </Badge>
          )}
          
          {aiFeatures.processingLocation === 'local' && (
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
              <MapPin className="h-3 w-3 mr-1" />
              Local Processing
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
