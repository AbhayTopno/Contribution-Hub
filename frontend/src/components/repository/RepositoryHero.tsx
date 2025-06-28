'use client';

import { JetBrains_Mono } from 'next/font/google';
import { Badge } from '@/components/ui/badge';
import { Star, GitFork, ExternalLink, Github, Code } from 'lucide-react';
import type { RepoStats, IssueCounts } from '@/types/repository';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

interface RepositoryHeroProps {
  repoUrl: string;
  repoName: string;
  orgName: string;
  stats?: RepoStats;
  issueCounts?: IssueCounts;
}

export default function RepositoryHero({
  repoUrl,
  repoName,
  orgName,
  stats,
  issueCounts,
}: RepositoryHeroProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const defaultStats = {
    stars: 0,
    forks: 0,
    languages: [],
  };

  const defaultIssueCounts = {
    totalOpen: 0,
    assigned: 0,
    unassigned: 0,
    byLabel: [],
  };

  const repoStats = stats || defaultStats;
  const counts = issueCounts || defaultIssueCounts;

  // Get top 3 languages and calculate others percentage
  const top3Languages = repoStats.languages.slice(0, 3);
  const othersPercentage = repoStats.languages
    .slice(3)
    .reduce((sum, lang) => sum + lang.percentage, 0);

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-8 mb-6 shadow-2xl border border-slate-800 cursor-hero-pointer">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Section - 65% */}
        <div className="w-full lg:w-[65%]">
          <div className="flex items-center gap-2 mb-4">
            <Github className="w-8 h-8 text-white" />
            <span className="text-slate-300 text-lg">{orgName}</span>
            <span className="text-slate-500">/</span>
          </div>

          <h1
            className={`text-4xl lg:text-5xl font-bold text-white mb-6 ${jetbrainsMono.className}`}
          >
            {repoName}
          </h1>

          <p className="text-slate-300 text-lg mb-8">
            Explore repository insights, contributors, and open issues
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30 hover:bg-yellow-500/30 px-4 py-2 text-sm rounded-full cursor-hero-hand">
              <Star className="w-4 h-4 mr-2" />
              {formatNumber(repoStats.stars)} Stars
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30 hover:bg-blue-500/30 px-4 py-2 text-sm rounded-full cursor-hero-hand">
              <GitFork className="w-4 h-4 mr-2" />
              {formatNumber(repoStats.forks)} Forks
            </Badge>
            <Badge className="bg-green-500/20 text-green-200 border-green-400/30 hover:bg-green-500/30 px-4 py-2 text-sm rounded-full cursor-hero-hand">
              <Code className="w-4 h-4 mr-2" />
              {repoStats.languages.length} Languages
            </Badge>
          </div>

          {/* Top 3 Languages + Others */}
          {repoStats.languages.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-8">
              {top3Languages.map((language) => (
                <div
                  key={language.name}
                  className="flex items-center gap-2 cursor-hero-hand"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: language.color }}
                  />
                  <span className="text-md font-medium text-white">
                    {language.name}
                  </span>
                  <span className="text-md text-slate-300">
                    {language.percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
              {othersPercentage > 0 && (
                <div className="flex items-center gap-2 cursor-hero-hand">
                  <div className="w-3 h-3 rounded-full bg-slate-400" />
                  <span className="text-md font-medium text-white">Others</span>
                  <span className="text-md text-slate-300">
                    {othersPercentage.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section - 35% */}
        <div className="w-full lg:w-[35%] flex flex-col justify-between mt-10 lg:mt-0">
          {/* Issue Overview Title */}
          <h2 className="text-xl font-semibold text-white text-center mb-6">
            Issue Overview
          </h2>

          {/* 2x2 or 1x4 Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {/* Total Open */}
            <div className="bg-slate-800 rounded-lg px-6 py-4 shadow border border-slate-700 flex items-center justify-between w-full cursor-hero-hand">
              <span className="text-sm text-slate-300 font-medium">
                Total Open
              </span>
              <span className="text-2xl font-bold text-white">
                {counts.totalOpen}
              </span>
            </div>

            {/* Labels */}
            <div className="bg-blue-800 rounded-lg px-6 py-4 shadow border border-blue-700 flex items-center justify-between w-full cursor-hero-hand">
              <span className="text-sm text-blue-200 font-medium">Labels</span>
              <span className="text-2xl font-bold text-blue-100">
                {counts.byLabel.length}
              </span>
            </div>

            {/* Unassigned */}
            <div className="bg-red-800 rounded-lg px-6 py-4 shadow border border-red-700 flex items-center justify-between w-full cursor-hero-hand">
              <span className="text-sm text-red-200 font-medium">
                Unassigned
              </span>
              <span className="text-2xl font-bold text-red-100">
                {counts.unassigned}
              </span>
            </div>

            {/* Assigned */}
            <div className="bg-green-800 rounded-lg px-6 py-4 shadow border border-green-700 flex items-center justify-between w-full cursor-hero-hand">
              <span className="text-sm text-green-200 font-medium">
                Assigned
              </span>
              <span className="text-2xl font-bold text-green-100">
                {counts.assigned}
              </span>
            </div>
          </div>

          {/* GitHub Link */}
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 pb-6 text-blue-400 hover:text-white font-medium transition-all duration-200 cursor-hero-hand"
          >
            <Github className="w-4 h-4" />
            View on GitHub
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
