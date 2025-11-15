"use client"

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Check, X, Sparkles, Zap, Rocket, Building2, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PricingFeature {
  name: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  icon: React.ReactNode;
  gradient: string;
  popular?: boolean;
  features: PricingFeature[];
  cta: string;
  assessmentsPerMonth: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: "small",
    name: "Small",
    description: "Perfect for individual security researchers",
    price: "$29",
    period: "/month",
    icon: <Sparkles className="h-6 w-6" />,
    gradient: "from-blue-500 to-cyan-500",
    assessmentsPerMonth: "10 assessments",
    cta: "Start Small",
    features: [
      { name: "10 Security Assessments/month", included: true, highlight: true },
      { name: "Basic CVE Analysis", included: true },
      { name: "5 Security Dimensions", included: true },
      { name: "Public Sources Only", included: true },
      { name: "PDF Export", included: true },
      { name: "Email Support", included: true },
      { name: "Advanced CVE Trend Charts", included: false },
      { name: "AI Features Analysis", included: false },
      { name: "Compliance Tracking", included: false },
      { name: "Data Handling Flow", included: false },
      { name: "API Access", included: false },
      { name: "Priority Support", included: false },
      { name: "Custom Reports", included: false },
      { name: "Team Collaboration", included: false },
    ]
  },
  {
    id: "medium",
    name: "Medium",
    description: "Ideal for small teams and startups",
    price: "$79",
    period: "/month",
    icon: <Zap className="h-6 w-6" />,
    gradient: "from-purple-500 to-pink-500",
    popular: true,
    assessmentsPerMonth: "50 assessments",
    cta: "Get Started",
    features: [
      { name: "50 Security Assessments/month", included: true, highlight: true },
      { name: "Advanced CVE Analysis", included: true },
      { name: "10 Security Dimensions", included: true },
      { name: "Public + Independent Sources", included: true },
      { name: "PDF & JSON Export", included: true },
      { name: "Priority Email Support", included: true },
      { name: "Advanced CVE Trend Charts", included: true },
      { name: "AI Features Analysis", included: true },
      { name: "Compliance Tracking", included: true },
      { name: "Data Handling Flow", included: true },
      { name: "API Access (1000 calls/month)", included: true },
      { name: "Priority Support", included: false },
      { name: "Custom Reports", included: false },
      { name: "Team Collaboration (up to 5)", included: true },
    ]
  },
  {
    id: "full",
    name: "Full",
    description: "Complete solution for growing companies",
    price: "$149",
    period: "/month",
    icon: <Rocket className="h-6 w-6" />,
    gradient: "from-orange-500 to-red-500",
    assessmentsPerMonth: "Unlimited",
    cta: "Go Full Power",
    features: [
      { name: "Unlimited Security Assessments", included: true, highlight: true },
      { name: "Complete CVE Analysis + CISA KEV", included: true },
      { name: "All 15 Security Dimensions", included: true },
      { name: "All Source Types (Public + Confidential)", included: true },
      { name: "All Export Formats", included: true },
      { name: "24/7 Priority Support", included: true },
      { name: "Advanced CVE Trend Charts", included: true },
      { name: "AI Features Analysis", included: true },
      { name: "Compliance Tracking", included: true },
      { name: "Data Handling Flow", included: true },
      { name: "API Access (10,000 calls/month)", included: true },
      { name: "Priority Support", included: true },
      { name: "Custom Report Templates", included: true },
      { name: "Team Collaboration (up to 20)", included: true },
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Tailored for large organizations",
    price: "Custom",
    period: "pricing",
    icon: <Building2 className="h-6 w-6" />,
    gradient: "from-emerald-500 to-teal-500",
    assessmentsPerMonth: "Unlimited",
    cta: "Contact Sales",
    features: [
      { name: "Unlimited Everything", included: true, highlight: true },
      { name: "Complete CVE Analysis + CISA KEV", included: true },
      { name: "All 15 Security Dimensions", included: true },
      { name: "All Sources + Custom Integrations", included: true },
      { name: "All Export Formats + Custom", included: true },
      { name: "Dedicated Account Manager", included: true },
      { name: "Advanced CVE Trend Charts", included: true },
      { name: "AI Features Analysis", included: true },
      { name: "Compliance Tracking", included: true },
      { name: "Data Handling Flow", included: true },
      { name: "Unlimited API Access", included: true },
      { name: "SLA Guarantee", included: true },
      { name: "White-label Reports", included: true },
      { name: "Unlimited Team Members", included: true },
    ]
  }
];

export default function PricingPage() {
  const { theme } = useTheme();
  const isMatrix = theme === "matrix";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={cn(
            "absolute top-20 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse",
            isMatrix ? "bg-[#00ff00]/10" : "bg-purple-500/10"
          )}></div>
          <div className={cn(
            "absolute bottom-20 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000",
            isMatrix ? "bg-[#00ff00]/10" : "bg-blue-500/10"
          )}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-3xl mx-auto mb-16"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className={cn(
                  "absolute inset-0 rounded-2xl blur-xl opacity-30 animate-pulse",
                  isMatrix 
                    ? "bg-gradient-to-r from-[#00ff00] to-[#00ff00]" 
                    : "bg-gradient-to-r from-purple-600 to-blue-600"
                )}></div>
                <div className={cn(
                  "relative p-4 rounded-2xl",
                  isMatrix 
                    ? "bg-gradient-to-br from-[#00ff00]/20 to-[#00ff00]/30 border border-[#00ff00]/50" 
                    : "bg-gradient-to-br from-purple-500 to-blue-600"
                )}>
                  <Shield className={cn(
                    "h-12 w-12",
                    isMatrix ? "text-[#00ff00]" : "text-white"
                  )} />
                </div>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className={cn(
                isMatrix 
                  ? "text-[#00ff00] matrix-hero-text" 
                  : "bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient"
              )}>
                Choose Your Plan
              </span>
            </h1>
            <p className={cn(
              "text-xl",
              isMatrix ? "text-[#00ff00]/80" : "text-muted-foreground"
            )}>
              Scale your security assessments with flexible pricing that grows with your needs
            </p>
            <div className={cn(
              "flex items-center justify-center gap-2 text-sm",
              isMatrix ? "text-[#00ff00]/80" : "text-muted-foreground"
            )}>
              <Check className={cn(
                "h-4 w-4",
                isMatrix ? "text-[#00ff00]" : "text-green-500"
              )} />
              <span>No credit card required</span>
              <span>•</span>
              <Check className={cn(
                "h-4 w-4",
                isMatrix ? "text-[#00ff00]" : "text-green-500"
              )} />
              <span>14-day free trial</span>
              <span>•</span>
              <Check className={cn(
                "h-4 w-4",
                isMatrix ? "text-[#00ff00]" : "text-green-500"
              )} />
              <span>Cancel anytime</span>
            </div>
          </motion.div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative"
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-1">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <Card 
                  className={`h-full flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    plan.popular 
                      ? 'border-2 border-purple-500 shadow-xl scale-105' 
                      : 'border hover:border-primary/50'
                  }`}
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 hover:opacity-5 transition-opacity duration-300`}></div>

                  <CardHeader className="relative">
                    {/* Icon */}
                    <div className={`inline-flex w-fit p-3 rounded-xl bg-gradient-to-br ${plan.gradient} text-white mb-4`}>
                      {plan.icon}
                    </div>

                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base">
                      {plan.description}
                    </CardDescription>

                    {/* Price */}
                    <div className="pt-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">{plan.period}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {plan.assessmentsPerMonth}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 relative">
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + idx * 0.03 }}
                          className="flex items-start gap-3"
                        >
                          <div className={`mt-0.5 flex-shrink-0 ${
                            feature.included 
                              ? 'text-green-500' 
                              : 'text-muted-foreground/30'
                          }`}>
                            {feature.included ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              <X className="h-5 w-5" />
                            )}
                          </div>
                          <span className={`text-sm ${
                            feature.included 
                              ? feature.highlight 
                                ? 'font-semibold text-foreground' 
                                : 'text-foreground'
                              : 'text-muted-foreground/50 line-through'
                          }`}>
                            {feature.name}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="relative">
                    <Button 
                      className={`w-full ${
                        plan.popular
                          ? `bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white border-0`
                          : ''
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-20 text-center max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <div className="grid gap-6 text-left">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's included in a security assessment?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Each assessment covers up to 15 security dimensions including vendor reputation, 
                    CVE analysis, compliance certifications, data handling practices, AI features, 
                    and more. The depth depends on your plan tier.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I upgrade or downgrade my plan?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! You can change your plan at any time. Upgrades take effect immediately, 
                    and downgrades take effect at the start of your next billing cycle.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We accept all major credit cards (Visa, MasterCard, American Express), 
                    PayPal, and wire transfers for Enterprise plans.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's your refund policy?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We offer a 14-day money-back guarantee. If you're not satisfied within the 
                    first 14 days, we'll refund your payment in full, no questions asked.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-20 text-center space-y-6"
          >
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Need help choosing a plan?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our team is here to help you find the perfect plan for your security needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="outline" className="gap-2">
                  Schedule a Demo
                </Button>
                <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white">
                  Contact Sales
                  <Shield className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
