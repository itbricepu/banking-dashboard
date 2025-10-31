"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { BankingMetrics } from "@/lib/banking-data";
import {
  calculateAchievement,
  getAchievementColor,
} from "@/lib/achievement-utils";
import {
  calculateDifference,
  getDifferenceColor,
  formatDifference,
} from "@/lib/difference-utils";
import { ArrowLeft } from "lucide-react";

interface LoopingDisplayProps {
  bankingData: Record<string, BankingMetrics>;
  onBack: () => void;
  lastUpdated: Date;
  isLoading?: boolean;
}

function formatLastUpdated(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LoopingDisplay({
  bankingData,
  onBack,
  lastUpdated,
  isLoading = false,
}: LoopingDisplayProps) {
  const categories = Object.keys(bankingData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating || categories.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isAnimating, categories.length]);

  if (isLoading || categories.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading looping display...</p>
        </div>
      </div>
    );
  }

  const category = categories[currentIndex];
  const data = bankingData[category];
  const achievement = calculateAchievement(data.current, data.target, category);
  const colors = getAchievementColor(achievement, true);

  const dtdDifference = calculateDifference(data.current, data.previousDay);
  const mtdDifference = calculateDifference(data.current, data.previousMonth);
  const ytdDifference = calculateDifference(data.current, data.previousYear);

  const dtdColors = getDifferenceColor(dtdDifference, category);
  const mtdColors = getDifferenceColor(mtdDifference, category);
  const ytdColors = getDifferenceColor(ytdDifference, category);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary/80 text-white p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className={`absolute top-0 left-0 w-96 h-96 bg-gradient-to-br ${colors.glow} to-transparent rounded-full blur-3xl animate-pulse`}
        />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Back Button */}
      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-8 left-8 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="absolute top-8 right-8 text-right">
        <p className="text-sm text-white/60">Last Updated</p>
        <p className="text-lg font-semibold text-white">
          {formatLastUpdated(lastUpdated)}
        </p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl">
        {/* Category Name */}
        <div className="mb-12 animate-fade-in">
          <p className="text-lg text-white/60 mb-4">Current Category</p>
          <h1 className="text-6xl md:text-7xl font-bold mb-8 text-white">
            {category}
          </h1>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {/* Current Value */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all">
            <p className="text-white/60 text-sm mb-2">Current Value</p>
            <p className="text-4xl md:text-5xl font-bold text-white">
              {Math.round(data.current).toLocaleString()}
            </p>
          </div>

          {/* RKA Target */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all">
            <p className="text-white/60 text-sm mb-2">RKA Target</p>
            <p className="text-4xl md:text-5xl font-bold text-white">
              {Math.round(data.target).toLocaleString()}
            </p>
          </div>

          {/* Achievement */}
          <div
            className={`bg-white/5 backdrop-blur-md rounded-2xl p-8 border transition-all ${colors.border}`}
          >
            <p className="text-white/60 text-sm mb-2">Achievement</p>
            <p className={`text-4xl md:text-5xl font-bold ${colors.text}`}>
              {achievement}%
            </p>
          </div>
        </div>

        {/* Performance Indicators - Now showing differences as numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div
            className={`bg-white/5 backdrop-blur-md rounded-xl p-6 border ${dtdColors.border}`}
          >
            <p className="text-white/60 text-xs mb-2">Day-to-Day</p>
            <p className={`text-2xl font-bold ${dtdColors.text}`}>
              {formatDifference(Math.round(dtdDifference))}
            </p>
          </div>
          <div
            className={`bg-white/5 backdrop-blur-md rounded-xl p-6 border ${mtdColors.border}`}
          >
            <p className="text-white/60 text-xs mb-2">Month-to-Date</p>
            <p className={`text-2xl font-bold ${mtdColors.text}`}>
              {formatDifference(Math.round(mtdDifference))}
            </p>
          </div>
          <div
            className={`bg-white/5 backdrop-blur-md rounded-xl p-6 border ${ytdColors.border}`}
          >
            <p className="text-white/60 text-xs mb-2">Year-to-Date</p>
            <p className={`text-2xl font-bold ${ytdColors.text}`}>
              {formatDifference(Math.round(ytdDifference))}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden border border-white/20">
            <div
              className={`h-full transition-all duration-1000 
                          ${
                            achievement >= 105
                              ? "bg-blue-500"
                              : achievement >= 100
                              ? "bg-green-500"
                              : achievement >= 75
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }
                        `}
              style={{ width: `${Math.min(achievement, 100)}%` }}
            />
          </div>
        </div>

        {/* Category Counter */}
        <div className="flex justify-center gap-2 mb-8">
          {categories.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Pause/Play Toggle */}
        <Button
          onClick={() => setIsAnimating(!isAnimating)}
          className="bg-white/20 hover:bg-white/30 text-white border border-white/30 font-semibold"
        >
          {isAnimating ? "Pause" : "Play"}
        </Button>
      </div>

      {/* CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
