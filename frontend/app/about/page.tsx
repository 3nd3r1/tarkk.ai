"use client"

import { motion } from "framer-motion";
import { 
  Shield, Database, Brain, CheckCircle2, Search, FileText, 
  Activity, Sparkles, Network, GitBranch, Layers, 
  Lock, Globe, FileSearch, AlertTriangle, Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const evaluationDimensions = [
  { icon: <Shield className="h-5 w-5" />, title: "Vendor Information", color: "from-blue-500 to-blue-600" },
  { icon: <FileText className="h-5 w-5" />, title: "Product Details", color: "from-purple-500 to-purple-600" },
  { icon: <Database className="h-5 w-5" />, title: "Information Sources", color: "from-green-500 to-green-600" },
  { icon: <Lock className="h-5 w-5" />, title: "Admin Controls", color: "from-orange-500 to-orange-600" },
  { icon: <Globe className="h-5 w-5" />, title: "Platform Support", color: "from-teal-500 to-teal-600" },
  { icon: <Activity className="h-5 w-5" />, title: "Data Handling", color: "from-indigo-500 to-indigo-600" },
  { icon: <FileSearch className="h-5 w-5" />, title: "Permissions Analysis", color: "from-pink-500 to-pink-600" },
  { icon: <AlertTriangle className="h-5 w-5" />, title: "CVE & Vulnerabilities", color: "from-red-500 to-red-600" },
  { icon: <GitBranch className="h-5 w-5" />, title: "Release Lifecycle", color: "from-cyan-500 to-cyan-600" },
  { icon: <Brain className="h-5 w-5" />, title: "AI Features", color: "from-violet-500 to-violet-600" },
  { icon: <Activity className="h-5 w-5" />, title: "Security Incidents", color: "from-rose-500 to-rose-600" },
  { icon: <Award className="h-5 w-5" />, title: "Compliance", color: "from-amber-500 to-amber-600" },
];

const aiAgents = [
  {
    id: "research",
    name: "Research Agent",
    icon: <Search className="h-6 w-6" />,
    description: "Discovers and collects data from public sources",
    color: "from-blue-500 to-blue-600",
    tasks: ["CVE Database Mining", "Vendor Documentation", "Security Blogs", "GitHub Analysis"]
  },
  {
    id: "analysis",
    name: "Analysis Agent",
    icon: <Brain className="h-6 w-6" />,
    description: "Processes and evaluates collected information",
    color: "from-purple-500 to-purple-600",
    tasks: ["Risk Assessment", "Pattern Recognition", "Trend Analysis", "Scoring Calculation"]
  },
  {
    id: "validation",
    name: "Validation Agent",
    icon: <CheckCircle2 className="h-6 w-6" />,
    description: "Verifies accuracy and cross-references sources",
    color: "from-green-500 to-green-600",
    tasks: ["Source Verification", "Data Consistency", "Citation Checking", "Quality Control"]
  },
  {
    id: "synthesis",
    name: "Synthesis Agent",
    icon: <FileText className="h-6 w-6" />,
    description: "Compiles comprehensive reports with insights",
    color: "from-orange-500 to-orange-600",
    tasks: ["Report Generation", "Visualization", "Recommendations", "Executive Summary"]
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">About Security Assessor</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI-Powered Security Intelligence
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We help organizations make informed decisions about third-party software 
              by providing comprehensive, data-driven security assessments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto space-y-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">What We Do</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Security Assessor evaluates third-party software across <span className="font-semibold text-primary">15 comprehensive dimensions</span>, 
                providing actionable insights for security teams, procurement, and IT leaders.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {evaluationDimensions.map((dimension, index) => (
                <motion.div
                  key={dimension.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${dimension.color} text-white flex-shrink-0`}>
                        {dimension.icon}
                      </div>
                      <h3 className="font-semibold text-sm">{dimension.title}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <Shield className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Trust Score™</h3>
                    <p className="text-muted-foreground">
                      Every assessment includes a comprehensive Trust Score (0-100) that synthesizes findings 
                      across all dimensions, providing a clear signal of overall security posture with detailed rationale.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Multi-Agent Visualization */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto space-y-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">How It Works</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Powered by a sophisticated <span className="font-semibold text-primary">Multi-AI Agent Architecture</span> that 
                orchestrates specialized agents to collect, analyze, and validate security data.
              </p>
            </div>

            {/* Agent Flow Visualization */}
            <div className="relative">
              {/* Connection Lines Background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg className="w-full h-full" style={{ maxHeight: "600px" }}>
                  {/* Animated connection paths */}
                  <motion.path
                    d="M 25% 30% L 25% 70%"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.3 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                  <motion.path
                    d="M 50% 30% L 50% 70%"
                    stroke="url(#gradient2)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.3 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.7 }}
                  />
                  <motion.path
                    d="M 75% 30% L 75% 70%"
                    stroke="url(#gradient3)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.3 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.9 }}
                  />
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Agent Cards */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {aiAgents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.6, type: "spring" }}
                  >
                    <Card className="h-full border-2 hover:border-primary hover:shadow-2xl transition-all duration-300 group">
                      <CardHeader>
                        <div className="space-y-4">
                          <motion.div
                            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${agent.color} text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            {agent.icon}
                          </motion.div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {agent.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {agent.description}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Key Tasks
                          </p>
                          <ul className="space-y-2">
                            {agent.tasks.map((task, i) => (
                              <motion.li
                                key={task}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 + i * 0.1 }}
                                className="flex items-start gap-2 text-sm"
                              >
                                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>{task}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Process Flow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      <Network className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">Orchestrated Workflow</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { step: "1", title: "Input", desc: "Software product query" },
                      { step: "2", title: "Collect", desc: "Multi-source data gathering" },
                      { step: "3", title: "Analyze", desc: "AI-powered evaluation" },
                      { step: "4", title: "Report", desc: "Comprehensive assessment" }
                    ].map((item, i) => (
                      <motion.div
                        key={item.step}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1 + i * 0.1 }}
                        className="text-center space-y-2"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg flex items-center justify-center mx-auto">
                          {item.step}
                        </div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Technical Implementation */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto space-y-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Technical Implementation</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Built with modern technologies and best practices for reliability, accuracy, and speed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      <Database className="h-6 w-6" />
                    </div>
                    <CardTitle>Data Collection</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Our Research Agent autonomously discovers and collects security data from multiple authoritative sources:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>CVE Databases</strong> - NIST NVD, CISA KEV List</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Vendor Documentation</strong> - Official security pages, PSIRT</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Security Research</strong> - Blogs, advisories, disclosures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Compliance Databases</strong> - Certifications, audit reports</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                      <Brain className="h-6 w-6" />
                    </div>
                    <CardTitle>AI Analysis</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Advanced language models process and evaluate the collected data:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Risk Assessment</strong> - Context-aware vulnerability evaluation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Pattern Recognition</strong> - Identifies security trends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Natural Language</strong> - Extracts insights from docs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Scoring Engine</strong> - Calculates Trust Score™</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <CardTitle>Validation & Quality</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Every data point is verified for accuracy and reliability:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Cross-Referencing</strong> - Multiple source verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Confidence Scoring</strong> - Transparency on data quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Citation Tracking</strong> - Full source attribution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Freshness Checks</strong> - Timestamps and updates</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                      <FileText className="h-6 w-6" />
                    </div>
                    <CardTitle>Report Generation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Comprehensive reports with interactive visualizations:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Interactive Charts</strong> - CVE trends, radar charts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Executive Summary</strong> - Key findings at a glance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>PDF Export</strong> - Shareable detailed reports</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Recommendations</strong> - Actionable next steps</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Built With Modern Tech</h2>
              <p className="text-lg text-muted-foreground">
                Leveraging the latest technologies for performance and reliability
              </p>
            </div>

            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { name: "Next.js 14", desc: "React Framework" },
                    { name: "TypeScript", desc: "Type Safety" },
                    { name: "Tailwind CSS", desc: "Modern Styling" },
                    { name: "Framer Motion", desc: "Animations" },
                    { name: "Recharts", desc: "Visualizations" },
                    { name: "shadcn/ui", desc: "UI Components" },
                    { name: "LLM APIs", desc: "AI Analysis" },
                    { name: "REST APIs", desc: "Data Collection" }
                  ].map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="text-center space-y-1"
                    >
                      <div className="font-semibold">{tech.name}</div>
                      <div className="text-xs text-muted-foreground">{tech.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
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
              Get comprehensive security insights powered by AI in minutes
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href="/">
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
