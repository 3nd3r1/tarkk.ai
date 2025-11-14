"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-6 w-6" />
            Assessment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon: View and filter your assessment history</p>
        </CardContent>
      </Card>
    </div>
  );
}
