'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { GitHubRepo } from '@/types/organization';
import { Star, GitFork, Calendar, Rocket, Github } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface RepositoryCardProps {
  repository: GitHubRepo;
}

export default function RepositoryCard({ repository }: RepositoryCardProps) {
  const params = useParams();
  const organizationName = decodeURIComponent(params.name as string);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const trimDescription = (text: string, maxLength = 120) => {
    if (!text || text.length <= maxLength) return text;

    // Find the last space before maxLength to avoid cutting words
    const trimmed = text.substring(0, maxLength);
    const lastSpace = trimmed.lastIndexOf(' ');

    if (lastSpace > 0) {
      return trimmed.substring(0, lastSpace) + '...';
    }

    return trimmed + '...';
  };

  // Extract org and repo name from URL for dynamic routing
  const urlParts = repository.url.replace('https://github.com/', '').split('/');
  const repoPath = urlParts.join('/');

  return (
    <div className="p-1 sm:p-2">
      <Card className="group border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 bg-white rounded-xl overflow-hidden h-full flex flex-col shadow-sm cursor-pointer">
        <CardContent className="p-3 sm:p-6 pb-4 sm:pb-8 flex-1 flex flex-col">
          {/* Repository Name - Responsive Height */}
          <div className="h-10 sm:h-14 flex items-center justify-center mb-2 sm:mb-4">
            <div className="flex-1 text-center">
              <h3 className="font-semibold text-base sm:text-xl text-slate-900 group-hover:text-slate-700 transition-colors underline-animation line-clamp-2 leading-tight">
                {repository.name}
              </h3>
            </div>
          </div>

          {/* Description - Responsive Height */}
          <div className="h-8 sm:h-12 mb-3 sm:mb-5 flex items-start justify-center">
            <p className="text-xs sm:text-sm text-slate-600 leading-4 sm:leading-6 text-center line-clamp-2">
              {trimDescription(
                repository.description || 'No description available',
                100
              )}
            </p>
          </div>

          {/* Languages - Responsive Layout */}
          {repository.languages && repository.languages.length > 0 && (
            <div className="h-8 sm:h-12 mb-4 sm:mb-8 flex items-start justify-center">
              <div className="flex flex-wrap gap-1 sm:gap-2 justify-center max-w-full">
                {repository.languages.slice(0, 4).map((language) => (
                  <div
                    key={language.name}
                    className="flex items-center gap-1 sm:gap-1.5 bg-gray-50 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-md cursor-pointer"
                  >
                    <div
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
                      style={{ backgroundColor: language.color }}
                    />
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700">
                      {language.name}
                    </span>
                  </div>
                ))}
                {repository.languages.length > 4 && (
                  <div className="flex items-center px-1.5 sm:px-2.5 py-1 sm:py-1.5 bg-gray-50 rounded-md cursor-pointer">
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      +{repository.languages.length - 4}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Spacer to push stats and button to bottom */}
          <div className="flex-grow"></div>

          {/* Stats Row - Responsive */}
          <div className="h-6 sm:h-8 flex items-center justify-center mb-2 sm:mb-3 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-1 sm:gap-1.5 cursor-pointer">
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">
                  {formatNumber(repository.stars)}
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 cursor-pointer">
                <GitFork className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">
                  {formatNumber(repository.forks)}
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 cursor-pointer">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs">
                  {formatDate(repository.lastCommitDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons - Responsive */}
          <div className="h-16 sm:h-20 flex flex-col gap-1.5 sm:gap-2">
            <Link
              href={`/organization/${encodeURIComponent(
                organizationName
              )}/repository/${repoPath}`}
              className="block"
            >
              <Button className="w-full bg-slate-900 hover:bg-slate-500 text-white group-hover:bg-slate-800 transition-all duration-300 text-xs sm:text-sm font-medium h-8 sm:h-10 cursor-hero-hand contribute-button relative overflow-hidden">
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer"></div>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-lg bg-slate-400/20 animate-glow"></div>

                <Rocket className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 relative z-10 animate-bounce-subtle contribute-icon" />
                <span className="relative z-10">Contribute</span>
              </Button>
            </Link>
            <a
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="outline"
                className="w-full border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-500 text-xs sm:text-sm font-medium h-8 sm:h-10 bg-transparent cursor-pointer"
              >
                <Github className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                View on GitHub
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
