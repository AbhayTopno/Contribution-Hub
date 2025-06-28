'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Clock } from 'lucide-react';
import type { Contributor, ContributorPeriodEnum } from '@/types/repository';
import Image from 'next/image';

interface ContributorsSectionProps {
  contributors: Contributor[];
  period: ContributorPeriodEnum;
  onPeriodChange: (period: ContributorPeriodEnum) => void;
}

export default function ContributorsSection({
  contributors,
  period,
  onPeriodChange,
}: ContributorsSectionProps) {
  if (!contributors || contributors.length === 0) {
    return (
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-600" />
            Top Contributors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">No contributor data available</p>
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
            onClick={() => onPeriodChange('THIS_MONTH')}
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
            onClick={() => onPeriodChange('ALL_TIME')}
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
        <div className="space-y-4">
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
                    '/placeholder.svg?height=40&width=40' ||
                    '/placeholder.svg' ||
                    '/placeholder.svg' ||
                    '/placeholder.svg'
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
      </CardContent>
    </Card>
  );
}
