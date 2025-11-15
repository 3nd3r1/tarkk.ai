"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  History, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Grid3x3, 
  List,
  Shield,
  ArrowRight,
  X,
  FileText,
  Info,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllAssessments as getApiAssessments } from "@/lib/api";
import { getAllAssessments as getMockAssessments } from "@/lib/api-mock";
import { Assessment } from "@/lib/types";
import { getScoreColor, formatDate } from "@/lib/utils";
import { ProductLogo } from "@/components/shared/product-logo";

// Extended Assessment type with source information
type AssessmentWithSource = Assessment & {
  source: 'api' | 'mock';
  isFullReport: boolean;
};

type ViewMode = 'grid' | 'list';
type SortOption = 'name-asc' | 'name-desc' | 'score-asc' | 'score-desc' | 'date-asc' | 'date-desc';

export default function HistoryPage() {
  const [assessments, setAssessments] = useState<AssessmentWithSource[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<AssessmentWithSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [reportTypeFilter, setReportTypeFilter] = useState<string>('all');

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        // Fetch from both API and mock data in parallel
        const [apiData, mockData] = await Promise.all([
          getApiAssessments().catch(() => []), // Gracefully handle API errors
          getMockAssessments()
        ]);

        // Mark API assessments as basic info
        const apiAssessments: AssessmentWithSource[] = apiData.map(a => ({
          ...a,
          source: 'api' as const,
          isFullReport: false
        }));

        // Mark mock assessments as full reports
        const mockAssessments: AssessmentWithSource[] = mockData.map(a => ({
          ...a,
          source: 'mock' as const,
          isFullReport: true
        }));

        // Combine both sources
        const combined = [...mockAssessments, ...apiAssessments];
        setAssessments(combined);
        setFilteredAssessments(combined);
      } catch (error) {
        console.error('Error fetching assessments:', error);
        // Fallback to mock data only
        const mockData = await getMockAssessments();
        const mockAssessments: AssessmentWithSource[] = mockData.map(a => ({
          ...a,
          source: 'mock' as const,
          isFullReport: true
        }));
        setAssessments(mockAssessments);
        setFilteredAssessments(mockAssessments);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...assessments];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.product.name.toLowerCase().includes(query) ||
        a.product.vendor.toLowerCase().includes(query) ||
        a.product.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(a => a.product.category === categoryFilter);
    }

    // Score filter
    if (scoreFilter !== 'all') {
      switch(scoreFilter) {
        case 'high':
          result = result.filter(a => a.trustScore.score >= 80);
          break;
        case 'medium':
          result = result.filter(a => a.trustScore.score >= 60 && a.trustScore.score < 80);
          break;
        case 'low':
          result = result.filter(a => a.trustScore.score < 60);
          break;
      }
    }

    // Report type filter
    if (reportTypeFilter !== 'all') {
      if (reportTypeFilter === 'full') {
        result = result.filter(a => a.isFullReport);
      } else if (reportTypeFilter === 'basic') {
        result = result.filter(a => !a.isFullReport);
      }
    }

    // Sorting
    switch(sortOption) {
      case 'name-asc':
        result.sort((a, b) => a.product.name.localeCompare(b.product.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.product.name.localeCompare(a.product.name));
        break;
      case 'score-asc':
        result.sort((a, b) => a.trustScore.score - b.trustScore.score);
        break;
      case 'score-desc':
        result.sort((a, b) => b.trustScore.score - a.trustScore.score);
        break;
      case 'date-asc':
        result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        break;
      case 'date-desc':
        result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
    }

    setFilteredAssessments(result);
  }, [assessments, searchQuery, categoryFilter, scoreFilter, sortOption, reportTypeFilter]);

  // Get unique categories
  const categories = Array.from(new Set(assessments.map(a => a.product.category)));
  
  // Count by report type
  const fullReportCount = assessments.filter(a => a.isFullReport).length;
  const basicInfoCount = assessments.filter(a => !a.isFullReport).length;

  // Separate filtered assessments by type
  const fullReports = filteredAssessments.filter(a => a.isFullReport);
  const basicInfo = filteredAssessments.filter(a => !a.isFullReport);

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setScoreFilter('all');
    setSortOption('date-desc');
    setReportTypeFilter('all');
  };

  const hasActiveFilters = searchQuery || categoryFilter !== 'all' || scoreFilter !== 'all' || sortOption !== 'date-desc' || reportTypeFilter !== 'all';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <History className="h-8 w-8 text-primary" />
              Analyzed Applications
            </h1>
            <p className="text-muted-foreground mt-2">
              Browse and filter all security assessments
            </p>
            {/* Report Type Summary */}
            {!isLoading && assessments.length > 0 && (
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {fullReportCount} Full Reports
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30">
                    <Info className="h-3 w-3 mr-1" />
                    {basicInfoCount} Basic Info
                  </Badge>
                </div>
              </div>
            )}
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications, vendors, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Score Filter */}
              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Trust Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="high">High (80+)</SelectItem>
                  <SelectItem value="medium">Medium (60-79)</SelectItem>
                  <SelectItem value="low">Low (&lt;60)</SelectItem>
                </SelectContent>
              </Select>

              {/* Report Type Filter */}
              <Select value={reportTypeFilter} onValueChange={setReportTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="full">Full Reports</SelectItem>
                  <SelectItem value="basic">Basic Info</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort and Results */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Newest First</SelectItem>
                      <SelectItem value="date-asc">Oldest First</SelectItem>
                      <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                      <SelectItem value="score-desc">Highest Score</SelectItem>
                      <SelectItem value="score-asc">Lowest Score</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold">{filteredAssessments.length}</span> of{' '}
                <span className="font-semibold">{assessments.length}</span> applications
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-2/3"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredAssessments.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No applications found</h3>
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters 
                  ? "Try adjusting your filters to see more results"
                  : "Start by searching for an application on the home page"
                }
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters}>Clear Filters</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid View */}
      {!isLoading && filteredAssessments.length > 0 && viewMode === 'grid' && (
        <div className="space-y-8">
          {/* Full Reports Section */}
          {fullReports.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    Complete Security Assessments
                  </h2>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                  {fullReports.length} {fullReports.length === 1 ? 'report' : 'reports'}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullReports.map((assessment, index) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col ${
                assessment.isFullReport 
                  ? 'border-2 border-emerald-500/50 hover:border-emerald-500 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20 dark:to-transparent' 
                  : 'border-2 hover:border-primary/50'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <ProductLogo logo={assessment.product.logo} size="md" />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">
                          {assessment.product.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground truncate">{assessment.product.vendor}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-2xl font-bold ${getScoreColor(assessment.trustScore.score)}`}>
                        {assessment.trustScore.score}
                      </div>
                      <p className="text-xs text-muted-foreground">Trust</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {assessment.product.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {/* Report Type Badge - Prominent */}
                      {assessment.isFullReport ? (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs font-semibold">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Full Report
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 text-xs font-semibold">
                          <Info className="h-3 w-3 mr-1" />
                          Basic Info
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {assessment.product.category}
                      </Badge>
                      {assessment.cached && (
                        <Badge variant="outline" className="text-xs">
                          Cached
                        </Badge>
                      )}
                      {assessment.vulnerabilities.cisaKEV && (
                        <Badge variant="destructive" className="text-xs">
                          CISA KEV
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(assessment.timestamp)}</span>
                      <span>{assessment.vulnerabilities.cveCount} CVEs</span>
                    </div>
                    
                    <Link href={`/assess/${assessment.id}`} className="block">
                      <Button variant="default" size="sm" className="w-full group/btn">
                        <FileText className="mr-2 h-4 w-4" />
                        View Full Report
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
              </div>
            </div>
          )}

          {/* Basic Info Section */}
          {basicInfo.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    Basic Information
                  </h2>
                </div>
                <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30">
                  {basicInfo.length} {basicInfo.length === 1 ? 'application' : 'applications'}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {basicInfo.map((assessment, index) => (
                  <motion.div
                    key={assessment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col border-2 hover:border-primary/50">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <ProductLogo logo={assessment.product.logo} size="md" />
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">
                                {assessment.product.name}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground truncate">{assessment.product.vendor}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className={`text-2xl font-bold ${getScoreColor(assessment.trustScore.score)}`}>
                              {assessment.trustScore.score}
                            </div>
                            <p className="text-xs text-muted-foreground">Trust</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col justify-between space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {assessment.product.description}
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 text-xs font-semibold">
                              <Info className="h-3 w-3 mr-1" />
                              Basic Info
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {assessment.product.category}
                            </Badge>
                            {assessment.cached && (
                              <Badge variant="outline" className="text-xs">
                                Cached
                              </Badge>
                            )}
                            {assessment.vulnerabilities.cisaKEV && (
                              <Badge variant="destructive" className="text-xs">
                                CISA KEV
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{formatDate(assessment.timestamp)}</span>
                            <span>{assessment.vulnerabilities.cveCount} CVEs</span>
                          </div>
                          
                          <Link href={`/assess/${assessment.id}`} className="block">
                            <Button variant="default" size="sm" className="w-full group/btn">
                              View Details
                              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {!isLoading && filteredAssessments.length > 0 && viewMode === 'list' && (
        <div className="space-y-8">
          {/* Full Reports Section */}
          {fullReports.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    Complete Security Assessments
                  </h2>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                  {fullReports.length} {fullReports.length === 1 ? 'report' : 'reports'}
                </Badge>
              </div>
              <div className="space-y-4">
                {fullReports.map((assessment, index) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
            >
              <Card className={`group hover:shadow-lg transition-all duration-300 ${
                assessment.isFullReport 
                  ? 'border-2 border-emerald-500/50 hover:border-emerald-500 bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-950/20 dark:to-transparent' 
                  : 'border-2 hover:border-primary/50'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-6">
                    {/* Left Section - Product Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <ProductLogo logo={assessment.product.logo} size="lg" className="flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors truncate">
                            {assessment.product.name}
                          </h3>
                          {/* Report Type Badge */}
                          {assessment.isFullReport ? (
                            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs font-semibold">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Full Report
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 text-xs font-semibold">
                              <Info className="h-3 w-3 mr-1" />
                              Basic Info
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{assessment.product.vendor}</p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {assessment.product.description}
                        </p>
                      </div>
                    </div>

                    {/* Middle Section - Metrics */}
                    <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(assessment.trustScore.score)}`}>
                          {assessment.trustScore.score}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Trust Score</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold">
                          {assessment.vulnerabilities.cveCount}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">CVEs</p>
                      </div>
                      <div className="text-center min-w-[100px]">
                        <Badge variant="secondary">{assessment.product.category}</Badge>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden md:block">
                        <p className="text-xs text-muted-foreground">
                          {formatDate(assessment.timestamp)}
                        </p>
                      </div>
                      <Link href={`/assess/${assessment.id}`}>
                        <Button variant="default" size="sm" className="group/btn">
                          {assessment.isFullReport ? (
                            <>
                              <FileText className="mr-2 h-4 w-4" />
                              Full Report
                            </>
                          ) : (
                            <>
                              View Details
                            </>
                          )}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
              </div>
            </div>
          )}

          {/* Basic Info Section */}
          {basicInfo.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    Basic Information
                  </h2>
                </div>
                <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30">
                  {basicInfo.length} {basicInfo.length === 1 ? 'application' : 'applications'}
                </Badge>
              </div>
              <div className="space-y-4">
                {basicInfo.map((assessment, index) => (
                  <motion.div
                    key={assessment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between gap-6">
                          {/* Left Section - Product Info */}
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <ProductLogo logo={assessment.product.logo} size="lg" className="flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors truncate">
                                  {assessment.product.name}
                                </h3>
                                <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 text-xs font-semibold">
                                  <Info className="h-3 w-3 mr-1" />
                                  Basic Info
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{assessment.product.vendor}</p>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                {assessment.product.description}
                              </p>
                            </div>
                          </div>

                          {/* Middle Section - Metrics */}
                          <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
                            <div className="text-center">
                              <div className={`text-3xl font-bold ${getScoreColor(assessment.trustScore.score)}`}>
                                {assessment.trustScore.score}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Trust Score</p>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-semibold">
                                {assessment.vulnerabilities.cveCount}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">CVEs</p>
                            </div>
                            <div className="text-center min-w-[100px]">
                              <Badge variant="secondary">{assessment.product.category}</Badge>
                            </div>
                          </div>

                          {/* Right Section - Actions */}
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="text-right hidden md:block">
                              <p className="text-xs text-muted-foreground">
                                {formatDate(assessment.timestamp)}
                              </p>
                            </div>
                            <Link href={`/assess/${assessment.id}`}>
                              <Button variant="default" size="sm" className="group/btn">
                                View Details
                                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
