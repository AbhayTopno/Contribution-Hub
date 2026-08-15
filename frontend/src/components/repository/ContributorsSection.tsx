'use client';

import { useQuery } from '@apollo/client';
import { useLayoutEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Clock } from 'lucide-react';
import type {
  ContributorPeriodEnum,
  RepoContributorsData,
  RepoContributorsVariables,
} from '@/types/repository';
import Image from 'next/image';
import { GET_REPOSITORY_CONTRIBUTORS } from '@/queries/getRepositoryInfo';
import { repoClient } from '@/lib/apolloClient';

interface ContributorsSectionProps {
  repoUrl: string;
}

function ContributorsSkeleton() {
  return (
    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="h-6 w-40 bg-slate-200 rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
            >
              <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ContributorsSection({
  repoUrl,
}: ContributorsSectionProps) {
  const [period, setPeriod] = useState<ContributorPeriodEnum>('THIS_MONTH');
  const [visible, setVisible] = useState(false);

  const { loading, error, data } = useQuery<
    RepoContributorsData,
    RepoContributorsVariables
  >(GET_REPOSITORY_CONTRIBUTORS, {
    variables: { url: repoUrl, period, limit: 25 },
    client: repoClient,
    skip: !repoUrl,
  });

  // Toggle visibility pre-paint so switching periods fades smoothly with no flash.
  useLayoutEffect(() => {
    setVisible(false);
    if (data) {
      requestAnimationFrame(() => setVisible(true));
    }
  }, [data]);

  const contributors = data?.repoInfo?.contributors || [];

  if (loading && !data) return <ContributorsSkeleton />;

  if (error) {
    return (
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-600" />
            Top Contributors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">Unable to load contributors.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-600" />
            Top Contributors
          </CardTitle>
        </div>

        {/* Period Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={period === 'THIS_MONTH' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPeriod('THIS_MONTH')}
            className={`flex items-center gap-1 text-xs cursor-pointer ${
              period === 'THIS_MONTH'
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3 h-3" />
            This Month
          </Button>
          <Button
            variant={period === 'ALL_TIME' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPeriod('ALL_TIME')}
            className={`flex items-center gap-1 text-xs cursor-pointer ${
              period === 'ALL_TIME'
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3 h-3" />
            All Time
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {contributors.length === 0 ? (
          <p className="text-slate-600">No contributor data available</p>
        ) : (
          <div
            className={`space-y-4 transition-opacity duration-300 ease-out ${
              visible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {contributors.map((contributor, index) => (
              <a
                key={contributor.login}
                href={contributor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="text-black text-md flex items-center justify-center font-bold">
                  # {index + 1}
                </div>
                <div className="relative flex-shrink-0">
                  <Image
                    src={
                      contributor.avatarUrl ||
                      '/placeholder.svg?height=40&width=40'
                    }
                    alt={contributor.login}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-800 truncate text-sm">
                    {contributor.login}
                  </h3>
                  <div className="flex items-center flex-row gap-4">
                    <div className="text-lg font-bold text-slate-900">
                      {contributor.commits}
                    </div>
                    <div className="text-md text-slate-700">commits</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
