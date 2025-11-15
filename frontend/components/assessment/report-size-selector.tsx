"use client"

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, BookOpen } from "lucide-react";
import { ReportSize } from "@/lib/types";

interface ReportSizeSelectorProps {
  currentSize: ReportSize;
  onSizeChange: (size: ReportSize) => void;
}

export function ReportSizeSelector({ currentSize, onSizeChange }: ReportSizeSelectorProps) {
  const sizes = [
    {
      value: 'small' as ReportSize,
      label: 'Small',
      readTime: '2 min',
      description: 'Executive summary',
      icon: FileText
    },
    {
      value: 'medium' as ReportSize,
      label: 'Medium',
      readTime: '5 min',
      description: 'Balanced detail',
      icon: BookOpen
    },
    {
      value: 'full' as ReportSize,
      label: 'Full',
      readTime: '10 min',
      description: 'Deep dive',
      icon: BookOpen
    },
    {
      value: 'enterprise' as ReportSize,
      label: 'Enterprise',
      readTime: '15+ min',
      description: 'Complete analysis',
      icon: BookOpen
    }
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap">
            <Clock className="h-4 w-4" />
            Report Detail:
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            {sizes.map((size) => {
              const Icon = size.icon;
              const isActive = currentSize === size.value;
              
              return (
                <button
                  key={size.value}
                  onClick={() => onSizeChange(size.value)}
                  className={`
                    flex-1 sm:flex-initial flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all
                    ${isActive 
                      ? 'border-primary bg-primary/10 shadow-sm' 
                      : 'border-muted hover:border-muted-foreground/30 hover:bg-muted/50'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="text-center">
                    <p className={`text-sm font-semibold ${isActive ? 'text-primary' : ''}`}>
                      {size.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{size.readTime}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-sm text-muted-foreground">
            {sizes.find(s => s.value === currentSize)?.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
