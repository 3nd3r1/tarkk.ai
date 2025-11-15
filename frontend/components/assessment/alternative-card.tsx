'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Shield, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface Alternative {
  name: string;
  vendor: string;
  trustScore: number;
  summary: string;
  whyBetter?: string;
}

interface AlternativeCardProps {
  alternative: Alternative;
  currentScore?: number;
  index?: number;
}

export function AlternativeCard({
  alternative,
  currentScore,
  index = 0,
}: AlternativeCardProps) {
  const scoreDifference = currentScore ? alternative.trustScore - currentScore : 0;
  const isBetter = scoreDifference > 0;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-emerald-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6 hover:shadow-lg transition-all group">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                {alternative.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                by {alternative.vendor}
              </p>
            </div>

            {/* Trust Score Badge */}
            <div className="flex flex-col items-end gap-1">
              <div className={`text-3xl font-bold ${getScoreColor(alternative.trustScore)}`}>
                {alternative.trustScore}
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Shield className="w-3 h-3" />
                <span className="text-muted-foreground">Trust Score</span>
              </div>
            </div>
          </div>

          {/* Score Comparison */}
          {currentScore !== undefined && (
            <div className="flex items-center gap-2">
              {isBetter ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">
                    +{scoreDifference} points higher
                  </span>
                </>
              ) : scoreDifference < 0 ? (
                <>
                  <span className="text-sm font-medium text-muted-foreground">
                    {Math.abs(scoreDifference)} points lower
                  </span>
                </>
              ) : (
                <span className="text-sm font-medium text-muted-foreground">
                  Same score
                </span>
              )}
            </div>
          )}

          {/* Summary */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {alternative.summary}
          </p>

          {/* Why Better? */}
          {alternative.whyBetter && (
            <div className="p-3 rounded-lg bg-accent/50 border border-border/50">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-medium mb-1">Why Consider This?</div>
                  <p className="text-sm text-muted-foreground">
                    {alternative.whyBetter}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="default" 
              className="flex-1 group/btn"
              asChild
            >
              <Link href={`/assess/${alternative.name.toLowerCase()}`}>
                View Assessment
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              variant="outline"
              size="icon"
              title="Compare"
            >
              <Shield className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

interface AlternativesListProps {
  alternatives: Alternative[];
  currentScore?: number;
  title?: string;
}

export function AlternativesList({
  alternatives,
  currentScore,
  title = 'Alternative Solutions',
}: AlternativesListProps) {
  if (alternatives.length === 0) {
    return null;
  }

  // Sort by trust score (highest first)
  const sortedAlternatives = [...alternatives].sort((a, b) => b.trustScore - a.trustScore);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">
          Consider these alternative solutions with similar functionality
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAlternatives.map((alt, index) => (
          <AlternativeCard
            key={alt.name}
            alternative={alt}
            currentScore={currentScore}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
