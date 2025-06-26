'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { GitHubRepo } from '@/types/organization';
import { Star, GitFork, ExternalLink, Calendar, Code } from 'lucide-react';

interface RepositoryCardProps {
  repository: GitHubRepo;
}

export default function RepositoryCard({ repository }: RepositoryCardProps) {
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

  return (
    <div className="p-2">
      <Card className="group border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 bg-white rounded-xl overflow-hidden h-full flex flex-col shadow-sm cursor-pointer">
        <CardContent className="p-6 pb-8 flex-1 flex flex-col">
          {/* Repository Name - Fixed Height */}
          <div className="h-14 flex items-center justify-between mb-4">
            <div className="flex-1 text-center">
              <h3 className="font-semibold text-xl text-slate-900 group-hover:text-slate-700 transition-colors underline-animation line-clamp-2">
                {repository.name}
              </h3>
            </div>
          </div>

          {/* Description - Fixed Height with 2 lines max */}
          <div className="h-12 mb-5 flex items-start justify-center">
            <p className="text-sm text-slate-600 leading-6 text-center line-clamp-2">
              {trimDescription(
                repository.description || 'No description available'
              )}
            </p>
          </div>

          {/* Languages - Fixed Height */}
          {repository.languages && repository.languages.length > 0 && (
            <div className="h-12 mb-8 flex items-start justify-center">
              <div className="flex flex-wrap gap-2 justify-center max-w-full">
                {repository.languages.slice(0, 6).map((language) => (
                  <div
                    key={language.name}
                    className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-md"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: language.color }}
                    />
                    <span className="text-xs font-medium text-gray-700">
                      {language.name}
                    </span>
                  </div>
                ))}
                {repository.languages.length > 6 && (
                  <div className="flex items-center px-2.5 py-1.5 bg-gray-50 rounded-md">
                    <span className="text-xs text-gray-500">
                      +{repository.languages.length - 6}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Spacer to push stats and button to bottom */}
          <div className="flex-grow"></div>

          {/* Stats Row - Fixed Height */}
          <div className="h-8 flex items-center justify-center mb-3 text-sm text-slate-500">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4" />
                <span className="font-medium">
                  {formatNumber(repository.stars)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <GitFork className="w-4 h-4" />
                <span className="font-medium">
                  {formatNumber(repository.forks)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">
                  {formatDate(repository.lastCommitDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button - Fixed Height */}
          <div className="h-10">
            <a
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white group-hover:bg-slate-800 transition-colors text-sm font-medium h-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Repository
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
