'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Shield, TrendingUp, TrendingDown, Minus, Info, AlertCircle } from 'lucide-react';

interface ScoreFactor {
  name: string;
  weight: number;
  score: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

interface SecurityScoreBreakdownProps {
  trustScore: number;
  confidence: number;
  factors?: ScoreFactor[];
}

// Default factors if not provided
const defaultFactors: ScoreFactor[] = [
  {
    name: 'Vulnerability Management',
    weight: 20,
    score: 85,
    impact: 'positive',
    description: 'Low CVE count with rapid patching',
  },
  {
    name: 'Compliance & Certifications',
    weight: 20,
    score: 90,
    impact: 'positive',
    description: 'SOC2, ISO 27001 certified',
  },
  {
    name: 'Data Handling',
    weight: 15,
    score: 75,
    impact: 'neutral',
    description: 'Encrypted but some AI training concerns',
  },
  {
    name: 'Access Controls',
    weight: 15,
    score: 95,
    impact: 'positive',
    description: 'Full SSO, MFA, RBAC support',
  },
  {
    name: 'Incident History',
    weight: 15,
    score: 70,
    impact: 'neutral',
    description: 'Minor incidents, good response',
  },
  {
    name: 'Platform Security',
    weight: 10,
    score: 80,
    impact: 'positive',
    description: 'Good sandboxing and isolation',
  },
  {
    name: 'Vendor Reputation',
    weight: 5,
    score: 85,
    impact: 'positive',
    description: 'Well-established, transparent',
  },
];

export function SecurityScoreBreakdown({ 
  trustScore, 
  confidence,
  factors = defaultFactors 
}: SecurityScoreBreakdownProps) {
  // Calculate weighted average to verify
  const calculatedScore = factors.reduce((sum, factor) => 
    sum + (factor.score * factor.weight / 100), 0
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20';
      case 'negative':
        return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20';
      default:
        return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Score Breakdown
            </CardTitle>
            <CardDescription>
              How this trust score was calculated
            </CardDescription>
          </div>
          
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(trustScore)}`}>
              {trustScore}
            </div>
            <div className="text-xs text-muted-foreground">Trust Score</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Confidence indicator */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-semibold">Assessment Confidence</span>
            </div>
            <Badge 
              variant="outline" 
              className={`
                ${confidence >= 85 ? 'bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-800 text-green-700 dark:text-green-300' :
                  confidence >= 70 ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300' :
                  'bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300'}
              `}
            >
              {confidence}%
            </Badge>
          </div>
          <Progress value={confidence} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {confidence >= 85 
              ? 'High confidence based on extensive public information' 
              : confidence >= 70 
              ? 'Medium confidence - some information may be limited'
              : 'Lower confidence - limited public data available'}
          </p>
        </div>

        {/* Score factors */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <span>Score Factors</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Each factor is weighted by importance and contributes to the overall trust score</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h4>

          {factors.map((factor, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all hover:shadow-md ${getImpactColor(factor.impact)}`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getImpactIcon(factor.impact)}
                    <h5 className="font-semibold text-sm">{factor.name}</h5>
                    <Badge variant="outline" className="text-xs">
                      {factor.weight}% weight
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {factor.description}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-2xl font-bold ${getScoreColor(factor.score)}`}>
                    {factor.score}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    +{Math.round(factor.score * factor.weight / 100)}
                  </div>
                </div>
              </div>
              
              <div className="mt-2">
                <Progress 
                  value={factor.score} 
                  className={`h-2 ${
                    factor.impact === 'positive' ? '[&>div]:bg-green-500' :
                    factor.impact === 'negative' ? '[&>div]:bg-red-500' :
                    '[&>div]:bg-yellow-500'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Calculation verification */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Weighted Average:</span>
            <span className="font-mono font-bold">{Math.round(calculatedScore)}</span>
          </div>
          {Math.abs(calculatedScore - trustScore) > 2 && (
            <p className="text-xs text-muted-foreground mt-2">
              * Final score may include additional adjustments based on recent events or manual review
            </p>
          )}
        </div>

        {/* Summary badges */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {factors.filter(f => f.impact === 'positive').length > 0 && (
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              {factors.filter(f => f.impact === 'positive').length} Positive Factors
            </Badge>
          )}
          {factors.filter(f => f.impact === 'negative').length > 0 && (
            <Badge className="bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 text-xs">
              <TrendingDown className="h-3 w-3 mr-1" />
              {factors.filter(f => f.impact === 'negative').length} Concerns
            </Badge>
          )}
          {confidence >= 85 && (
            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-xs">
              <Shield className="h-3 w-3 mr-1" />
              High Confidence
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
