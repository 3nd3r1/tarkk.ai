'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { AssessmentStatus } from '@/lib/api';

interface StatusBannerProps {
  status: AssessmentStatus;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function StatusBanner({ status, onRefresh, isRefreshing = false }: StatusBannerProps) {
  const { theme } = useTheme();
  const isMatrix = theme === 'matrix';

  const statusConfig = {
    queued: {
      icon: Loader2,
      label: 'Queued',
      message: 'Your assessment is queued and will start processing shortly.',
      cardClass: 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20',
      iconBgClass: 'bg-blue-500/10',
      iconClass: 'text-blue-600 dark:text-blue-400',
      badgeClass: 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300',
    },
    in_progress: {
      icon: RefreshCw,
      label: 'In Progress',
      message: 'Your assessment is being processed. This may take a few minutes.',
      cardClass: 'border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20',
      iconBgClass: 'bg-yellow-500/10',
      iconClass: 'text-yellow-600 dark:text-yellow-400',
      badgeClass: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300',
    },
    completed: {
      icon: CheckCircle,
      label: 'Completed',
      message: 'Assessment is complete and ready to view.',
      cardClass: 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20',
      iconBgClass: 'bg-green-500/10',
      iconClass: 'text-green-600 dark:text-green-400',
      badgeClass: 'bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-800 text-green-700 dark:text-green-300',
    },
    failed: {
      icon: XCircle,
      label: 'Failed',
      message: 'The assessment failed to process. Please try again or contact support.',
      cardClass: 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20',
      iconBgClass: 'bg-red-500/10',
      iconClass: 'text-red-600 dark:text-red-400',
      badgeClass: 'bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  // Don't show banner if completed
  if (status === 'completed') {
    return null;
  }

  return (
    <Card className={cn(
      config.cardClass,
      isMatrix && "border-[#00ff00]/50 bg-[#00ff00]/10"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className={cn(
              "p-2 rounded-full",
              config.iconBgClass,
              isMatrix && "bg-[#00ff00]/20"
            )}>
              <Icon className={cn(
                "h-5 w-5",
                config.iconClass,
                isMatrix && "text-[#00ff00]",
                status === 'in_progress' && "animate-spin"
              )} />
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className={cn(
                "font-semibold text-base",
                isMatrix && "text-[#00ff00]"
              )}>
                Assessment Status: {config.label}
              </h3>
              <Badge 
                variant="outline" 
                className={cn(
                  config.badgeClass,
                  isMatrix && "border-[#00ff00]/50 text-[#00ff00] bg-[#00ff00]/10"
                )}
              >
                {config.label}
              </Badge>
            </div>
            
            <p className={cn(
              "text-sm",
              isMatrix && "text-[#00ff00]/90"
            )}>
              {config.message}
            </p>

            {(status === 'in_progress' || status === 'queued') && onRefresh && (
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className={cn(
                    "text-sm font-medium flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors",
                    "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800",
                    "text-blue-700 dark:text-blue-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    isMatrix && "bg-[#00ff00]/20 hover:bg-[#00ff00]/30 text-[#00ff00]"
                  )}
                >
                  {isRefreshing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Refresh Now
                    </>
                  )}
                </button>
                <span className={cn(
                  "text-xs text-muted-foreground",
                  isMatrix && "text-[#00ff00]/70"
                )}>
                  Auto-refreshing every 5 seconds
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

