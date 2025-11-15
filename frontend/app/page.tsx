"use client"

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Zap, Database, FileCheck, Clock } from "lucide-react";
import { HeroSearch } from "@/components/search/hero-search";
import { StatsOverview } from "@/components/shared/stats-overview";
import { RecentAssessments } from "@/components/shared/recent-assessments";
import { Card, CardContent } from "@/components/ui/card";
import { WelcomeBanner } from "@/components/shared/welcome-banner";
import { Logo } from "@/components/shared/logo";

const features = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: "15 Security Dimensions",
    description: "Comprehensive evaluation across vendor info, vulnerabilities, compliance, and more",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <Lock className="h-8 w-8" />,
    title: "CVE Analysis",
    description: "Track security vulnerabilities with CISA KEV alerts and trend analysis",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <Eye className="h-8 w-8" />,
    title: "Source Transparency",
    description: "Every claim cited with verification status and confidence levels",
    color: "from-green-500 to-green-600"
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "AI Features Audit",
    description: "Evaluate AI capabilities, data usage, and training disclosure",
    color: "from-orange-500 to-orange-600"
  },
  {
    icon: <Database className="h-8 w-8" />,
    title: "Data Handling Flow",
    description: "Visualize storage, transmission, and usage patterns with privacy analysis",
    color: "from-teal-500 to-teal-600"
  },
  {
    icon: <FileCheck className="h-8 w-8" />,
    title: "Compliance Tracking",
    description: "SOC2, ISO 27001, GDPR, and industry-specific certifications",
    color: "from-indigo-500 to-indigo-600"
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Animated Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
              className="flex justify-center"
            >
              <Logo size={80} className="text-primary" />
            </motion.div>

            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient hero-title">
                  Tarkist.us
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive third-party software security analysis across{" "}
                <span className="font-semibold text-primary">15 dimensions</span>
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="pt-8"
            >
              <HeroSearch />
            </motion.div>

            {/* Quick Stats Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>2-10 min reports</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-primary" />
                <span>Full source citations</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>Real-time analysis</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Welcome Banner for Non-Authenticated Users */}
      <section className="pb-8 bg-background">
        <div className="container mx-auto px-4">
          <WelcomeBanner />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <StatsOverview />
        </div>
      </section>

      {/* Recent Assessments */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold">Recent Assessments</h2>
              <p className="text-muted-foreground">
                Explore recently analyzed software products
              </p>
            </div>
            <RecentAssessments />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold">
                Comprehensive Security Analysis
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Evaluate software across multiple dimensions with data-driven insights
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="h-full group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50">
                    <CardContent className="p-6 space-y-4">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to assess your software?
            </h2>
            <p className="text-xl text-muted-foreground">
              Get comprehensive security insights in minutes
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href="#search">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
                  Start Assessment
                  <Shield className="h-5 w-5" />
                </div>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
