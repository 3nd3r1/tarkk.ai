"use client"

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TrustScoreCircleProps {
  score: number;
  confidence: number;
  size?: "sm" | "md" | "lg";
}

export function TrustScoreCircle({ score, confidence, size = "lg" }: TrustScoreCircleProps) {
  const getScoreColor = (score: number) => {
    if (score >= 71) return { text: "text-green-500", bg: "bg-green-500", border: "border-green-500" };
    if (score >= 41) return { text: "text-yellow-500", bg: "bg-yellow-500", border: "border-yellow-500" };
    return { text: "text-red-500", bg: "bg-red-500", border: "border-red-500" };
  };

  const getScoreIcon = (score: number) => {
    if (score >= 71) return <CheckCircle2 className="h-8 w-8 text-green-500" />;
    if (score >= 41) return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
    return <XCircle className="h-8 w-8 text-red-500" />;
  };

  const colors = getScoreColor(score);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  const sizeClasses = {
    sm: { container: "w-24 h-24", text: "text-2xl", icon: "h-5 w-5" },
    md: { container: "w-32 h-32", text: "text-3xl", icon: "h-6 w-6" },
    lg: { container: "w-40 h-40", text: "text-4xl", icon: "h-8 w-8" }
  };

  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative inline-flex items-center justify-center"
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 ${colors.bg}`}></div>
            
            {/* SVG Progress Circle */}
            <svg className={sizeClasses[size].container} viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/20"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className={colors.text}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{
                  strokeDasharray: circumference,
                  transform: "rotate(-90deg)",
                  transformOrigin: "50% 50%"
                }}
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute flex flex-col items-center justify-center">
              {getScoreIcon(score)}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`${sizeClasses[size].text} font-bold ${colors.text}`}
              >
                {score}
              </motion.span>
            </div>
          </motion.div>
          
          <div className="text-center">
            <p className="text-sm font-semibold">Trust Score</p>
            <p className="text-xs text-muted-foreground">Confidence: {confidence}%</p>
          </div>
        </div>
      </CardContent>
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TrustScoreCircleProps {
  score: number; // 0-100
  confidence?: number; // 0-100
  rationale?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function TrustScoreCircle({
  score,
  confidence = 100,
  rationale,
  size = 'lg',
  animated = true,
}: TrustScoreCircleProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  // Animate score count-up
  useEffect(() => {
    if (!animated) return;

    const duration = 2000; // 2 seconds
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

  // Size configurations
  const sizeConfig = {
    sm: { circle: 120, stroke: 8, text: 'text-2xl', icon: 16 },
    md: { circle: 180, stroke: 12, text: 'text-4xl', icon: 24 },
    lg: { circle: 240, stroke: 16, text: 'text-6xl', icon: 32 },
  };

  const config = sizeConfig[size];
  const radius = (config.circle - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

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
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
            className={`${colors.color} mb-2`}
          >
            <Icon size={config.icon} strokeWidth={2.5} />
          </motion.div>
          
          <motion.div
            className={`font-bold ${config.text} ${colors.color}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {displayScore}
          </motion.div>
          
          <motion.div
            className="text-sm font-medium text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {label}
          </motion.div>
        </div>
      </div>

      {/* Score label */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Trust Score</h3>
        
        {confidence < 100 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>Confidence:</span>
              <span className="font-medium">{confidence}%</span>
            </div>
          </div>
        )}

        {rationale && (
          <p className="text-sm text-muted-foreground max-w-md">
            {rationale}
          </p>
        )}
      </div>

      {/* Score breakdown indicator */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
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
            transition={{ duration: 2, ease: 'easeInOut' }}
            style={{ marginLeft: '-6px' }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
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
