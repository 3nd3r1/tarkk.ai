'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ExternalLink, CheckCircle2, AlertCircle, FileCheck, Database } from 'lucide-react';
import { Citation } from '@/lib/types';

interface CitationBadgeProps {
  citation: Citation;
  size?: 'sm' | 'md';
}

export function CitationBadge({ citation, size = 'sm' }: CitationBadgeProps) {
  const [open, setOpen] = useState(false);

  // Get icon and color based on citation type
  const getCitationConfig = (type: Citation['type']) => {
    switch (type) {
      case 'vendor-stated':
        return {
          icon: FileCheck,
          color: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
          label: 'Vendor',
          description: 'Information directly from the vendor',
        };
      case 'independent':
        return {
          icon: CheckCircle2,
          color: 'bg-green-500/10 text-green-500 border-green-500/30',
          label: 'Independent',
          description: 'Third-party verification or research',
        };
      case 'compliance-cert':
        return {
          icon: CheckCircle2,
          color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
          label: 'Certified',
          description: 'Compliance certification or audit',
        };
      case 'cve-database':
        return {
          icon: Database,
          color: 'bg-red-500/10 text-red-500 border-red-500/30',
          label: 'CVE',
          description: 'Public vulnerability database',
        };
      default:
        return {
          icon: AlertCircle,
          color: 'bg-muted text-muted-foreground border-border',
          label: 'Source',
          description: 'Citation source',
        };
    }
  };

  const config = getCitationConfig(citation.type);
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size={size === 'sm' ? 'sm' : 'default'}
          className={`h-auto py-1 px-2 ${config.color} hover:opacity-80`}
        >
          <Icon className="w-3 h-3 mr-1" />
          <span className="text-xs font-medium">{config.label}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5" style={{ color: config.color.split(' ')[1] }} />
            Citation Details
          </DialogTitle>
          <DialogDescription>
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Source Title
            </div>
            <div className="text-sm font-semibold">{citation.title}</div>
          </div>

          {/* Type */}
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Type
            </div>
            <Badge variant="outline" className={config.color}>
              <Icon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
          </div>

          {/* Verification Status */}
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Verification Status
            </div>
            <div className="flex items-center gap-2">
              {citation.verified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">
                    Verified
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-600 dark:text-yellow-400">
                    Unverified
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Date */}
          {citation.date && (
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Date
              </div>
              <div className="text-sm">
                {new Date(citation.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          )}

          {/* URL */}
          {citation.url && (
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Link
              </div>
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                {citation.url}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* ID */}
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Citation ID
            </div>
            <code className="text-xs bg-muted px-2 py-1 rounded">
              {citation.id}
            </code>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          {citation.url && (
            <Button asChild className="flex-1">
              <a href={citation.url} target="_blank" rel="noopener noreferrer">
                Open Source
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          )}
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Component to display multiple citations
interface CitationListProps {
  citations: Citation[];
  title?: string;
}

export function CitationList({ citations, title }: CitationListProps) {
  if (citations.length === 0) return null;

  return (
    <div className="space-y-2">
      {title && (
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
      )}
      <div className="flex flex-wrap gap-2">
        {citations.map((citation) => (
          <CitationBadge key={citation.id} citation={citation} />
        ))}
      </div>
    </div>
  );
}
