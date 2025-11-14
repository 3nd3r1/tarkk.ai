"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/lib/api";
import { Assessment } from "@/lib/types";
import { getScoreColor, formatDate } from "@/lib/utils";

export function RecentAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      const stats = await getDashboardStats();
      setAssessments(stats.recentAssessments);
      setIsLoading(false);
    };

    fetchAssessments();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-2/3"></div>
              <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {assessments.slice(0, 2).map((assessment, index) => (
        <motion.div
          key={assessment.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{assessment.product.logo}</div>
                  <div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {assessment.product.name}
                    </CardTitle>
                    <CardDescription>{assessment.product.vendor}</CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getScoreColor(assessment.trustScore.score)}`}>
                    {assessment.trustScore.score}
                  </div>
                  <p className="text-xs text-muted-foreground">Trust Score</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {assessment.product.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {assessment.product.category}
                  </Badge>
                  {assessment.cached && (
                    <Badge variant="outline" className="text-xs">
                      Cached
                    </Badge>
                  )}
                </div>
                
                <Link href={`/assess/${assessment.id}`}>
                  <Button variant="ghost" size="sm" className="group/btn">
                    View Report
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
