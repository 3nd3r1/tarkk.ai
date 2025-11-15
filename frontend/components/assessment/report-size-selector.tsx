'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReportSize } from '@/lib/types';
import { FileText, Clock, Zap, Eye, Maximize, BookOpen } from 'lucide-react';

interface ReportSizeSelectorProps {
  selectedSize: ReportSize;
  onSizeChange: (size: ReportSize) => void;
}

const sizeConfig = {
  small: {
    label: 'Small',
    icon: Zap,
    time: '2 min',
    description: 'Executive summary with key metrics only',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20 border-blue-500',
    textColor: 'text-blue-700 dark:text-blue-300',
    iconColor: 'text-blue-500',
  },
  medium: {
    label: 'Medium',
    icon: Eye,
    time: '5 min',
    description: 'Balanced detail with standard view (recommended)',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20 border-purple-500',
    textColor: 'text-purple-700 dark:text-purple-300',
    iconColor: 'text-purple-500',
  },
  full: {
    label: 'Full',
    icon: Maximize,
    time: '10 min',
    description: 'Deep dive with all evidence and details',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20 border-orange-500',
    textColor: 'text-orange-700 dark:text-orange-300',
    iconColor: 'text-orange-500',
  },
  enterprise: {
    label: 'Enterprise',
    icon: BookOpen,
    time: '15+ min',
    description: 'Complete analysis with all technical details',
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-500',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    iconColor: 'text-indigo-500',
  },
};

export function ReportSizeSelector({ selectedSize, onSizeChange }: ReportSizeSelectorProps) {
  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Report Detail Level</h3>
          <Badge variant="secondary" className="ml-auto">
            <Clock className="h-3 w-3 mr-1" />
            {sizeConfig[selectedSize]?.time || 'N/A'} read
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Choose how much detail you want to see in this assessment. You can change this at any time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {(Object.entries(sizeConfig) as [ReportSize, typeof sizeConfig.small][]).map(([size, config]) => {
            const isSelected = selectedSize === size;
            const Icon = config.icon;
            
            return (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`
                  relative overflow-hidden rounded-lg border-2 p-4 text-left transition-all duration-300
                  ${isSelected 
                    ? `${config.bgColor} shadow-lg scale-105` 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                  }
                `}
              >
                {/* Background gradient on hover */}
                {!isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 hover:opacity-5 transition-opacity duration-300" 
                       style={{ backgroundImage: `linear-gradient(to bottom right, var(--primary), var(--primary-foreground))` }} />
                )}
                
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className={`h-6 w-6 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
                
                <div className="relative">
                  <div className={`p-2 rounded-lg inline-flex mb-3 ${isSelected ? 'bg-white/50 dark:bg-gray-900/50' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <Icon className={`h-5 w-5 ${isSelected ? config.iconColor : 'text-muted-foreground'}`} />
                  </div>
                  
                  <div className="mb-2">
                    <h4 className={`font-semibold text-base mb-1 ${isSelected ? config.textColor : ''}`}>
                      {config.label}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={isSelected ? "default" : "outline"} className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {config.time}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className={`text-xs ${isSelected ? config.textColor : 'text-muted-foreground'}`}>
                    {config.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feature comparison */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold mb-3">What's Included</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="font-medium text-blue-600 dark:text-blue-400 mb-2">Small</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Key metrics</li>
                <li>• Trust score</li>
                <li>• Critical issues</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-purple-600 dark:text-purple-400 mb-2">Medium</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Everything in Small</li>
                <li>• Detailed analysis</li>
                <li>• Charts & graphs</li>
                <li>• Recommendations</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-orange-600 dark:text-orange-400 mb-2">Full</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Everything in Medium</li>
                <li>• All evidence</li>
                <li>• Complete history</li>
                <li>• Technical details</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-indigo-600 dark:text-indigo-400 mb-2">Enterprise</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Everything in Full</li>
                <li>• Complete audit trail</li>
                <li>• All citations</li>
                <li>• Compliance details</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
