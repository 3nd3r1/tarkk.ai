"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCompare } from "lucide-react";

export default function ComparePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-6 w-6" />
            Compare Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon: Side-by-side comparison of security assessments</p>
        </CardContent>
      </Card>
    </div>
  );
}
