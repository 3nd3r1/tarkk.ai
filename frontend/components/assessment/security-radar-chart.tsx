'use client';

import { Card } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Shield, Lock, Eye, FileCheck, Users, AlertTriangle } from 'lucide-react';

interface SecurityDimension {
  dimension: string;
  score: number; // 0-100
  maxScore: number;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SecurityRadarChartProps {
  data?: SecurityDimension[];
  title?: string;
  description?: string;
}

// Default security dimensions
const defaultDimensions: SecurityDimension[] = [
  { dimension: 'Access Control', score: 85, maxScore: 100, icon: Lock },
  { dimension: 'Data Privacy', score: 72, maxScore: 100, icon: Eye },
  { dimension: 'Vulnerability Mgmt', score: 88, maxScore: 100, icon: Shield },
  { dimension: 'Compliance', score: 90, maxScore: 100, icon: FileCheck },
  { dimension: 'Incident Response', score: 78, maxScore: 100, icon: AlertTriangle },
  { dimension: 'User Management', score: 82, maxScore: 100, icon: Users },
];

export function SecurityRadarChart({
  data = defaultDimensions,
  title = 'Security Posture',
  description = 'Multi-dimensional security assessment across key areas',
}: SecurityRadarChartProps) {
  // Transform data for Recharts
  const chartData = data.map(d => ({
    subject: d.dimension,
    score: d.score,
    fullMark: d.maxScore,
  }));

  // Calculate average score
  const averageScore = Math.round(
    data.reduce((sum, d) => sum + d.score, 0) / data.length
  );

  // Get color based on average score
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green-500
    if (score >= 60) return '#f59e0b'; // yellow-500
    return '#ef4444'; // red-500
  };

  const color = getScoreColor(averageScore);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color }}>
              {averageScore}
            </div>
            <div className="text-xs text-muted-foreground">Avg Score</div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              />
              <Radar
                name="Security Score"
                dataKey="score"
                stroke={color}
                fill={color}
                fillOpacity={0.6}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t">
          {data.map((dimension, index) => {
            const Icon = dimension.icon || Shield;
            const dimColor = getScoreColor(dimension.score);
            
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div
                  className="p-2 rounded-md"
                  style={{ backgroundColor: `${dimColor}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: dimColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {dimension.dimension}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${dimension.score}%`,
                          backgroundColor: dimColor,
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-semibold w-8 text-right"
                      style={{ color: dimColor }}
                    >
                      {dimension.score}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
