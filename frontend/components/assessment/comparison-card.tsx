'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

interface ComparisonMetric {
  name: string;
  value1: string | number | boolean;
  value2: string | number | boolean;
  type?: 'score' | 'boolean' | 'text' | 'count';
  higherIsBetter?: boolean;
}

interface ComparisonCardProps {
  product1: {
    name: string;
    vendor: string;
    logo?: string;
  };
  product2: {
    name: string;
    vendor: string;
    logo?: string;
  };
  metrics: ComparisonMetric[];
  winner?: 1 | 2 | null;
}

export function ComparisonCard({
  product1,
  product2,
  metrics,
  winner,
}: ComparisonCardProps) {
  const renderValue = (
    value: string | number | boolean,
    type: ComparisonMetric['type'] = 'text'
  ) => {
    if (type === 'boolean') {
      return value ? (
        <CheckCircle2 className="w-5 h-5 text-green-500" />
      ) : (
        <XCircle className="w-5 h-5 text-red-500" />
      );
    }

    if (type === 'score') {
      const numValue = Number(value);
      const color =
        numValue >= 80
          ? 'text-green-500'
          : numValue >= 60
          ? 'text-yellow-500'
          : 'text-red-500';
      return <span className={`font-bold text-lg ${color}`}>{value}</span>;
    }

    return <span className="font-medium">{value}</span>;
  };

  const getComparisonIcon = (
    value1: string | number | boolean,
    value2: string | number | boolean,
    type: ComparisonMetric['type'] = 'text',
    higherIsBetter = true
  ) => {
    if (type === 'boolean') {
      if (value1 === value2) return <Minus className="w-4 h-4 text-muted-foreground" />;
      if (value1 && !value2) return <TrendingUp className="w-4 h-4 text-green-500" />;
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }

    if (type === 'score' || type === 'count') {
      const num1 = Number(value1);
      const num2 = Number(value2);
      if (num1 === num2) return <Minus className="w-4 h-4 text-muted-foreground" />;
      
      const better = higherIsBetter ? num1 > num2 : num1 < num2;
      return better ? (
        <TrendingUp className="w-4 h-4 text-green-500" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500" />
      );
    }

    return null;
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-2 divide-x bg-muted/50">
        <div className="p-6 space-y-3 relative">
          {winner === 1 && (
            <Badge className="absolute top-3 right-3 bg-green-500">
              Winner
            </Badge>
          )}
          <div className="text-3xl">{product1.logo || '📦'}</div>
          <div>
            <h3 className="font-semibold text-lg">{product1.name}</h3>
            <p className="text-sm text-muted-foreground">{product1.vendor}</p>
          </div>
        </div>

        <div className="p-6 space-y-3 relative">
          {winner === 2 && (
            <Badge className="absolute top-3 right-3 bg-green-500">
              Winner
            </Badge>
          )}
          <div className="text-3xl">{product2.logo || '📦'}</div>
          <div>
            <h3 className="font-semibold text-lg">{product2.name}</h3>
            <p className="text-sm text-muted-foreground">{product2.vendor}</p>
          </div>
        </div>
      </div>

      {/* Metrics Comparison */}
      <div className="divide-y">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 p-4 hover:bg-accent/30 transition-colors"
          >
            {/* Product 1 Value */}
            <div className="flex items-center justify-end gap-2">
              {renderValue(metric.value1, metric.type)}
              {getComparisonIcon(
                metric.value1,
                metric.value2,
                metric.type,
                metric.higherIsBetter
              )}
            </div>

            {/* Metric Name */}
            <div className="text-center px-4 min-w-[150px]">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                {metric.name}
              </span>
            </div>

            {/* Product 2 Value */}
            <div className="flex items-center justify-start gap-2">
              {getComparisonIcon(
                metric.value2,
                metric.value1,
                metric.type,
                metric.higherIsBetter
              )}
              {renderValue(metric.value2, metric.type)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="grid grid-cols-2 divide-x border-t p-4 gap-4">
        <Button variant="outline" className="w-full">
          View {product1.name}
        </Button>
        <Button variant="outline" className="w-full">
          View {product2.name}
        </Button>
      </div>
    </Card>
  );
}

// Quick comparison component for side-by-side trust scores
interface QuickCompareProps {
  products: Array<{
    name: string;
    vendor: string;
    trustScore: number;
    logo?: string;
  }>;
}

export function QuickCompare({ products }: QuickCompareProps) {
  if (products.length < 2) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Quick Comparison</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, index) => {
          const color =
            product.trustScore >= 80
              ? 'text-green-500'
              : product.trustScore >= 60
              ? 'text-yellow-500'
              : 'text-red-500';

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{product.logo || '📦'}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{product.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {product.vendor}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${color}`}>
                      {product.trustScore}
                    </div>
                    <div className="text-xs text-muted-foreground">Trust</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
