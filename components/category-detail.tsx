"use client";

import { Card } from "@/components/ui/card";
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

interface CategoryDetailProps {
  category: string;
  bankingData: Record<string, BankingMetrics>;
  onBack: () => void;
  lastUpdated: Date;
  isLoading?: boolean;
}

function formatLastUpdated(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CategoryDetail({
  category,
  bankingData,
  onBack,
  lastUpdated,
  isLoading = false,
}: CategoryDetailProps) {
  const data = bankingData[category];

  if (isLoading || !data) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading category data...</p>
        </div>
      </div>
    );
  }

  const achievement = calculateAchievement(data.current, data.target, category);
  const colors = getAchievementColor(achievement);

  const dtdDifference = calculateDifference(data.current, data.previousDay);
  const mtdDifference = calculateDifference(data.current, data.previousMonth);
  const ytdDifference = calculateDifference(data.current, data.previousYear);

  const dtdColors = getDifferenceColor(dtdDifference, category);
  const mtdColors = getDifferenceColor(mtdDifference, category);
  const ytdColors = getDifferenceColor(ytdDifference, category);

  const metrics = [
    { label: "Current Value", value: data.current, format: true, colors: null },
    { label: "RKA Target", value: data.target, format: true, colors: null },
    {
      label: "Day-to-Day",
      value: dtdDifference,
      format: true,
      colors: dtdColors,
      isDifference: true,
    },
    {
      label: "Month-to-Date",
      value: mtdDifference,
      format: true,
      colors: mtdColors,
      isDifference: true,
    },
    {
      label: "Year-to-Date",
      value: ytdDifference,
      format: true,
      colors: ytdColors,
      isDifference: true,
    },
    {
      label: "Achievement %",
      value: achievement,
      format: false,
      colors: colors,
    },
  ];

  return (
    <div className="w-full h-screen flex flex-col p-8 bg-white dark:bg-slate-950">
      {/* Header with Back Button and Last Updated */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">{category}</h1>
          <p className="text-muted-foreground">Detailed Performance Metrics</p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="text-lg font-semibold text-primary">
              {formatLastUpdated(lastUpdated)}
            </p>
          </div>
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2 bg-transparent border-2 border-primary text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {metrics.map((metric, index) => {
            const isAchievementMetric = metric.label === "Achievement %";
            const metricColors = metric.colors || {
              bg: "bg-gray-50 dark:bg-gray-900",
              text: "text-primary",
              border: "border-gray-200 dark:border-gray-800",
            };

            return (
              <Card
                key={index}
                className={`p-6 border-2 ${metricColors.border} ${metricColors.bg}`}
              >
                <p className="text-sm text-muted-foreground mb-2">
                  {metric.label}
                </p>
                <p className={`font-bold text-2xl ${metricColors.text}`}>
                  {metric.isDifference
                    ? formatDifference(Math.round(metric.value as number))
                    : metric.format
                    ? Math.round(metric.value as number).toLocaleString()
                    : (metric.value as number).toFixed(2)}
                  {isAchievementMetric ? "%" : ""}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Segments Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-primary mb-6">Segments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.segments.map((segment: any, index: number) => {
              const segmentAchievement = calculateAchievement(
                segment.value,
                segment.target,
                category
              );
              const segmentColors = getAchievementColor(segmentAchievement);

              return (
                <Card
                  key={index}
                  className={`p-6 border-2 ${segmentColors.border} ${segmentColors.bg}`}
                >
                  <h3 className="text-lg font-semibold text-primary mb-4">
                    {segment.name}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Value</p>
                      <p className="text-xl font-bold text-foreground">
                        {Math.round(segment.value).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Target</p>
                      <p className="text-lg font-semibold text-foreground">
                        {Math.round(segment.target).toLocaleString()}
                      </p>
                    </div>
                    <div className="pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          Achievement
                        </span>
                        <span
                          className={`text-sm font-bold ${segmentColors.text}`}
                        >
                          {segmentAchievement}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
