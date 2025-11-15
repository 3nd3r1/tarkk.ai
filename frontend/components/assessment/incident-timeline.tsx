"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, AlertTriangle, Shield, Info } from "lucide-react";
import { formatDate } from "@/lib/utils";
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, AlertCircle, Clock, CheckCircle2, ExternalLink } from 'lucide-react';
import { Citation } from '@/lib/types';

interface Incident {
  date: string;
  title: string;
  severity: string;
  description: string;
  impact: string;
  resolution: string;
  sources: Array<{ id: string; type: string; title: string; verified: boolean }>;
}

interface IncidentTimelineProps {
  incidents: {
    count: number;
    timeline: Incident[];
  };
}

export function IncidentTimeline({ incidents }: IncidentTimelineProps) {
  const [expandedIncidents, setExpandedIncidents] = useState<Set<number>>(new Set());

  const toggleIncident = (index: number) => {
    const newExpanded = new Set(expandedIncidents);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedIncidents(newExpanded);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
  sources: Citation[];
}

interface IncidentTimelineProps {
  incidents: Incident[];
  title?: string;
}

export function IncidentTimeline({
  incidents,
  title = 'Security Incident History',
}: IncidentTimelineProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'high':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'low':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <Info className="h-5 w-5 text-yellow-500" />;
      default:
        return <Shield className="h-5 w-5 text-blue-500" />;
    }
  };

  if (incidents.count === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Security Incidents</CardTitle>
          <CardDescription>Historical security events and breaches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="text-lg font-semibold text-green-600">No Security Incidents Reported</p>
            <p className="text-sm text-muted-foreground mt-2">
              This product has a clean security record with no known breaches or major incidents.
            </p>
          </div>
        </CardContent>
        return AlertCircle;
      default:
        return Clock;
    }
  };

  if (incidents.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">No Reported Incidents</h3>
          <p className="text-sm text-muted-foreground">
            No security incidents or breaches have been publicly reported for this product.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Incidents</CardTitle>
        <CardDescription>
          {incidents.count} incident{incidents.count !== 1 ? 's' : ''} reported
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {incidents.timeline.map((incident, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getSeverityIcon(incident.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{incident.title}</h4>
                      <Badge variant={getSeverityColor(incident.severity) as any}>
                        {incident.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatDate(incident.date)}
                    </p>
                    
                    {expandedIncidents.has(index) && (
                      <div className="mt-4 space-y-3 text-sm">
                        <div>
                          <p className="font-semibold mb-1">Description:</p>
                          <p className="text-muted-foreground">{incident.description}</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-1">Impact:</p>
                          <p className="text-muted-foreground">{incident.impact}</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-1">Resolution:</p>
                          <p className="text-muted-foreground">{incident.resolution}</p>
                        </div>
                        {incident.sources.length > 0 && (
                          <div>
                            <p className="font-semibold mb-1">Sources:</p>
                            <div className="flex flex-wrap gap-2">
                              {incident.sources.map((source) => (
                                <Badge key={source.id} variant="outline" className="text-xs">
                                  {source.title}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleIncident(index)}
                >
                  {expandedIncidents.has(index) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {incidents.length} incident{incidents.length !== 1 ? 's' : ''} recorded
          </p>
        </div>

        {/* Timeline */}
        <div className="relative space-y-4">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border" />

          {incidents.map((incident, index) => {
            const isExpanded = expandedIndex === index;
            const SeverityIcon = getSeverityIcon(incident.severity);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-12"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-2">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getSeverityColor(incident.severity)}`}>
                    <SeverityIcon className="w-5 h-5" />
                  </div>
                </div>

                {/* Content Card */}
                <div className={`border rounded-lg transition-all ${isExpanded ? 'bg-accent/50' : 'bg-card hover:bg-accent/30'}`}>
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-semibold">{incident.title}</h4>
                          <Badge 
                            variant="outline"
                            className={getSeverityColor(incident.severity)}
                          >
                            {incident.severity}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(incident.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-4 border-t pt-4">
                          {/* Description */}
                          <div>
                            <div className="text-sm font-medium mb-1">Description</div>
                            <p className="text-sm text-muted-foreground">
                              {incident.description}
                            </p>
                          </div>

                          {/* Impact */}
                          <div>
                            <div className="text-sm font-medium mb-1">Impact</div>
                            <p className="text-sm text-muted-foreground">
                              {incident.impact}
                            </p>
                          </div>

                          {/* Resolution */}
                          <div>
                            <div className="text-sm font-medium mb-1">Resolution</div>
                            <p className="text-sm text-muted-foreground">
                              {incident.resolution}
                            </p>
                          </div>

                          {/* Sources */}
                          {incident.sources.length > 0 && (
                            <div>
                              <div className="text-sm font-medium mb-2">Sources</div>
                              <div className="space-y-2">
                                {incident.sources.map((source) => (
                                  <div
                                    key={source.id}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    {source.verified && (
                                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    )}
                                    <span className="flex-1 text-muted-foreground">
                                      {source.title}
                                    </span>
                                    {source.url && (
                                      <a
                                        href={source.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline flex items-center gap-1"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t">
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="text-2xl font-bold">
              {incidents.filter(i => i.severity.toLowerCase() === 'critical' || i.severity.toLowerCase() === 'high').length}
            </div>
            <div className="text-xs text-muted-foreground">Critical/High</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="text-2xl font-bold">
              {incidents.length}
            </div>
            <div className="text-xs text-muted-foreground">Total Incidents</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="text-2xl font-bold">
              {new Date().getFullYear() - new Date(incidents[0]?.date).getFullYear() || 0}
            </div>
            <div className="text-xs text-muted-foreground">Years Since First</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
