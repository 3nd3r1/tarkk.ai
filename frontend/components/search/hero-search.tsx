"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSearchSuggestions, createAssessment, searchAssessments } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 0) {
        const results = await getSearchSuggestions(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      // First, check if an assessment already exists for this product
      const existingAssessments = await searchAssessments(searchQuery);
      
      if (existingAssessments.length > 0) {
        // Navigate to the first existing assessment
        router.push(`/assess/${existingAssessments[0].id}`);
        return;
      }
      
      // Create a new assessment
      const response = await createAssessment({
        name: searchQuery,
        assessment_type: 'medium',
      });
      
      // Navigate to the new assessment
      router.push(`/assess/${response.assessment_id}`);
    } catch (error) {
      console.error('Error creating assessment:', error);
      // Fallback: try to navigate with the query as ID (for backward compatibility)
      router.push(`/assess/${searchQuery.toLowerCase().replace(/\s+/g, '-')}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          {/* Glowing effect on focus */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-focus-within:opacity-75 transition duration-300"></div>
          
          <div className="relative flex items-center bg-background border-2 border-primary/20 rounded-2xl overflow-hidden shadow-2xl focus-within:border-primary transition-all duration-300">
            <Search className="ml-6 h-6 w-6 text-muted-foreground flex-shrink-0" />
            <Input
              type="text"
              placeholder="Search any software... (try 'Slack' or 'GitHub')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-0 text-lg h-16 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="lg"
              className="m-2 px-6 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              disabled={!query.trim() || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚡</span>
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Assess <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setQuery(suggestion);
                    setShowSuggestions(false);
                    handleSearch(suggestion);
                  }}
                  className="w-full px-6 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3 group"
                >
                  <Sparkles className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{suggestion}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Popular searches hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Popular: <button onClick={() => handleSearch('Slack')} className="text-primary hover:underline ml-2">Slack</button>
          {" • "}
          <button onClick={() => handleSearch('GitHub')} className="text-primary hover:underline">GitHub</button>
          {" • "}
          <button onClick={() => handleSearch('Signal')} className="text-primary hover:underline">Signal</button>
        </p>
      </motion.div>
    </div>
  );
}
