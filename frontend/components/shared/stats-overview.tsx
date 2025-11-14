"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, TrendingUp, Activity, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  delay: number;
}

function StatCard({ icon, value, label, suffix = "", delay }: StatCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {count}{suffix}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={<Shield className="h-6 w-6 text-primary" />}
        value={247}
        label="Assessments Completed"
        delay={0}
      />
      <StatCard
        icon={<TrendingUp className="h-6 w-6 text-green-500" />}
        value={83}
        label="Average Trust Score"
        delay={0.1}
      />
      <StatCard
        icon={<Activity className="h-6 w-6 text-blue-500" />}
        value={15}
        label="Security Dimensions"
        delay={0.2}
      />
      <StatCard
        icon={<CheckCircle2 className="h-6 w-6 text-purple-500" />}
        value={92}
        label="Accuracy Rate"
        suffix="%"
        delay={0.3}
      />
    </div>
  );
}
