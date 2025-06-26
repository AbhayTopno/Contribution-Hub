'use client';

import Image from 'next/image';
import { JetBrains_Mono } from 'next/font/google';
import { Github, ExternalLink, Folder, Star, GitFork } from 'lucide-react';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

interface ContributeHeroProps {
  organization: {
    name: string;
    imageUrl?: string | null;
    githubUrl?: string | null;
    category?: string | null;
  };
  loading: boolean;
  repositoryCount: number;
  totalStars?: number;
  totalForks?: number;
}

export default function ContributeHero({
  organization,
  loading,
  repositoryCount,
  totalStars = 0,
  totalForks = 0,
}: ContributeHeroProps) {
  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-950 rounded-2xl p-8 mb-4 shadow-xl">
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {organization.imageUrl && (
          <div className="flex-shrink-0">
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-xl overflow-hidden bg-white border-2 border-white/30 flex items-center justify-center p-4">
              <Image
                src={organization.imageUrl || '/placeholder.svg'}
                alt={organization.name}
                width={128}
                height={128}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}

        <div className="flex-grow">
          <h1
            className={`text-4xl lg:text-5xl font-bold text-white mb-6 ${jetbrainsMono.className}`}
          >
            {organization.name}
          </h1>

          <p className="text-slate-300 text-lg mb-6">
            Explore open source repositories and start contributing
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg">
              <Folder className="w-4 h-4 text-green-300" />
              <span className="text-sm font-medium text-green-200">
                {loading ? '...' : repositoryCount} Repositories
              </span>
            </div>
            {totalStars > 0 && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg">
                <Star className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium text-yellow-200">
                  {totalStars.toLocaleString()} Stars
                </span>
              </div>
            )}
            {totalForks > 0 && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg">
                <GitFork className="w-4 h-4 text-blue-300" />
                <span className="text-sm font-medium text-blue-200">
                  {totalForks.toLocaleString()} Forks
                </span>
              </div>
            )}
          </div>

          {organization.githubUrl && (
            <a
              href={organization.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 font-medium transition-colors"
            >
              <Github className="w-4 h-4" />
              View on GitHub
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
