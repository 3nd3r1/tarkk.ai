"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Assessment } from "@/lib/types";
import { getAssessment } from "@/lib/api";
import { getScoreColor, formatDate } from "@/lib/utils";

export default function AssessmentPage() {
  const params = useParams();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (params.id) {
        const data = await getAssessment(params.id as string);
        setAssessment(data);
        setIsLoading(false);
      }
    };

    fetchAssessment();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <p className="text-xl text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl">Assessment not found</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getScoreIcon = (score: number) => {
    if (score >= 71) return <CheckCircle2 className="h-8 w-8 text-green-500" />;
    if (score >= 41) return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
    return <XCircle className="h-8 w-8 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{assessment.product.logo}</div>
              <div>
                <h1 className="text-4xl font-bold">{assessment.product.name}</h1>
                <p className="text-xl text-muted-foreground">by {assessment.product.vendor}</p>
                <div className="flex gap-2 mt-2">
                  <Badge>{assessment.product.category}</Badge>
                  {assessment.cached && <Badge variant="outline">Cached</Badge>}
                </div>
              </div>
            </div>

            {/* Trust Score Circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="relative inline-flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full blur-xl opacity-30 ${getScoreColor(assessment.trustScore.score).replace('text-', 'bg-')}`}></div>
                <div className="relative bg-card border-4 border-primary rounded-full w-32 h-32 flex flex-col items-center justify-center">
                  {getScoreIcon(assessment.trustScore.score)}
                  <span className={`text-4xl font-bold ${getScoreColor(assessment.trustScore.score)}`}>
                    {assessment.trustScore.score}
                  </span>
                  <span className="text-xs text-muted-foreground">Trust Score</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Product description and usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">{assessment.product.description}</p>
              <div>
                <h4 className="font-semibold mb-2">Common Use Cases:</h4>
                <p className="text-muted-foreground">{assessment.product.usage}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust Score Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Trust Score Analysis</CardTitle>
              <CardDescription>Why this score was assigned</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{assessment.trustScore.rationale}</p>
              <div className="mt-4">
                <span className="text-sm text-muted-foreground">
                  Confidence: {assessment.trustScore.confidence}%
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Admin Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Admin Controls</CardTitle>
              <CardDescription>Available security features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(assessment.adminControls).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    {value ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vulnerabilities Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Vulnerabilities</CardTitle>
              <CardDescription>CVE analysis and security issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-500/10 rounded-lg">
                  <div className="text-3xl font-bold text-red-500">
                    {assessment.vulnerabilities.severityBreakdown.critical}
                  </div>
                  <div className="text-sm text-muted-foreground">Critical</div>
                </div>
                <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                  <div className="text-3xl font-bold text-orange-500">
                    {assessment.vulnerabilities.severityBreakdown.high}
                  </div>
                  <div className="text-sm text-muted-foreground">High</div>
                </div>
                <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-500">
                    {assessment.vulnerabilities.severityBreakdown.medium}
                  </div>
                  <div className="text-sm text-muted-foreground">Medium</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                  <div className="text-3xl font-bold text-blue-500">
                    {assessment.vulnerabilities.severityBreakdown.low}
                  </div>
                  <div className="text-sm text-muted-foreground">Low</div>
                </div>
              </div>
              
              {assessment.vulnerabilities.cisaKEV && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="font-semibold text-red-500">⚠️ CISA KEV Alert</p>
                  <p className="text-sm text-muted-foreground">This software has vulnerabilities listed in CISA's Known Exploited Vulnerabilities catalog.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Compliance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Compliance & Certifications</CardTitle>
              <CardDescription>Industry standards and regulatory compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {assessment.compliance.certifications.map((cert) => (
                  <Badge key={cert} variant="secondary" className="text-sm">
                    {cert}
                  </Badge>
                ))}
              </div>
              <p className="mt-4 text-muted-foreground">
                {assessment.compliance.dataHandlingSummary}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
