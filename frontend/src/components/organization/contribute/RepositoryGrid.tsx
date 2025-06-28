'use client';

import type { GitHubRepo } from '@/types/organization';
import RepositoryCard from './RepositoryCard';

interface RepositoryGridProps {
  repositories: GitHubRepo[];
}

export default function RepositoryGrid({ repositories }: RepositoryGridProps) {
  if (repositories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-base">
          No active repositories found in the past 30 days
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      {repositories.map((repo) => (
        <RepositoryCard key={repo.url} repository={repo} />
      ))}
    </div>
  );
}
