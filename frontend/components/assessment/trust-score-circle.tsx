'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TrustScoreCircleProps {
  score: number; // 0-100
  confidence?: number; // 0-100
  rationale?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  compact?: boolean; // New: for header/inline usage
}

export function TrustScoreCircle({
  score,
  confidence = 100,
  rationale,
  size = 'lg',
  animated = true,
  compact = false,
}: TrustScoreCircleProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  // Animate score count-up
  useEffect(() => {
    if (!animated) return;

    const duration = 1500; // 1.5 seconds for faster animation
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animated]);

  // Color and icon based on score
  const getScoreColor = (s: number) => {
    if (s >= 85) return { color: 'text-green-500', bg: 'bg-green-500', ring: 'ring-green-500/20' };
    if (s >= 70) return { color: 'text-emerald-500', bg: 'bg-emerald-500', ring: 'ring-emerald-500/20' };
    if (s >= 50) return { color: 'text-yellow-500', bg: 'bg-yellow-500', ring: 'ring-yellow-500/20' };
    if (s >= 30) return { color: 'text-orange-500', bg: 'bg-orange-500', ring: 'ring-orange-500/20' };
    return { color: 'text-red-500', bg: 'bg-red-500', ring: 'ring-red-500/20' };
  };

  const getScoreIcon = (s: number) => {
    if (s >= 70) return ShieldCheck;
    if (s >= 40) return Shield;
    return ShieldAlert;
  };

  const getScoreLabel = (s: number) => {
    if (s >= 85) return 'Excellent';
    if (s >= 70) return 'Good';
    if (s >= 50) return 'Fair';
    if (s >= 30) return 'Poor';
    return 'Critical';
  };

  const colors = getScoreColor(score);
  const Icon = getScoreIcon(score);
  const label = getScoreLabel(score);

  // Size configurations - optimized for better space usage
  const sizeConfig = {
    sm: { circle: 100, stroke: 6, text: 'text-xl', icon: 14, label: 'text-xs' },
    md: { circle: 140, stroke: 10, text: 'text-3xl', icon: 20, label: 'text-sm' },
    lg: { circle: 200, stroke: 14, text: 'text-5xl', icon: 28, label: 'text-base' },
  };

  const config = sizeConfig[size];
  const radius = (config.circle - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  // Compact mode: just the circle without card wrapper
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative inline-flex flex-col items-center gap-2">
              {/* SVG Circle Progress */}
              <svg
                width={config.circle}
                height={config.circle}
                className="transform -rotate-90"
              >
                {/* Background circle */}
                <circle
                  cx={config.circle / 2}
                  cy={config.circle / 2}
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={config.stroke}
                  className="text-muted-foreground/20"
                />
                
                {/* Progress circle */}
                <motion.circle
                  cx={config.circle / 2}
                  cy={config.circle / 2}
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={config.stroke}
                  strokeLinecap="round"
                  className={colors.bg}
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
              </svg>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4, type: 'spring' }}
                  className={colors.color}
                >
                  <Icon size={config.icon} strokeWidth={2.5} />
                </motion.div>
                
                <motion.div
                  className={`font-bold ${config.text} ${colors.color} leading-none`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {displayScore}
                </motion.div>
                
                <motion.div
                  className={`${config.label} font-medium text-muted-foreground leading-tight mt-0.5`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {label}
                </motion.div>
              </div>

              {/* Compact info badge */}
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-semibold ${colors.color}`}>Trust Score</span>
                {confidence < 100 && (
                  <span className="text-xs text-muted-foreground">({confidence}% confidence)</span>
                )}
              </div>
            </div>
          </TooltipTrigger>
          {rationale && (
            <TooltipContent className="max-w-sm">
              <p>{rationale}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Full card mode with all details
  return (
    <Card className="p-6 flex flex-col items-center gap-4">
      <div className="relative">
        {/* SVG Circle Progress */}
        <svg
          width={config.circle}
          height={config.circle}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.circle / 2}
            cy={config.circle / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            className="text-muted-foreground/20"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={config.circle / 2}
            cy={config.circle / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            strokeLinecap="round"
            className={colors.bg}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4, type: 'spring' }}
            className={colors.color}
          >
            <Icon size={config.icon} strokeWidth={2.5} />
          </motion.div>
          
          <motion.div
            className={`font-bold ${config.text} ${colors.color} leading-none`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {displayScore}
          </motion.div>
          
          <motion.div
            className={`${config.label} font-medium text-muted-foreground leading-tight`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {label}
          </motion.div>
        </div>
      </div>

      {/* Score label */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Trust Score</h3>
        
        {confidence < 100 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
            <Info className="h-3 w-3" />
            <span>Confidence: {confidence}%</span>
          </div>
        )}

        {rationale && (
          <p className="text-sm text-muted-foreground max-w-md">
            {rationale}
          </p>
        )}
      </div>

      {/* Score breakdown indicator */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>Critical</span>
          <span>Poor</span>
          <span>Fair</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-emerald-500 to-green-500 relative">
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-foreground rounded-full shadow-lg"
            initial={{ left: '0%' }}
            animate={{ left: `${displayScore}%` }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{ marginLeft: '-6px' }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>
    </Card>
  );
}
