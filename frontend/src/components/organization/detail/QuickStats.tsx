'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JetBrains_Mono } from 'next/font/google';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

interface QuickStatsProps {
  totalProjects: number;
  totalYears: number;
  avgProjectsPerYear: number;
}

export default function QuickStats({
  totalProjects,
  totalYears,
  avgProjectsPerYear,
}: QuickStatsProps) {
  return (
    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
          <span className="text-slate-600 font-medium">Total Projects</span>
          <span
            className={`font-bold text-2xl text-slate-800 ${jetbrainsMono.className}`}
          >
            {totalProjects}
          </span>
        </div>
        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
          <span className="text-slate-600 font-medium">Years Active</span>
          <span
            className={`font-bold text-2xl text-slate-800 ${jetbrainsMono.className}`}
          >
            {totalYears}
          </span>
        </div>
        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
          <span className="text-slate-600 font-medium">Avg Projects/Year</span>
          <span
            className={`font-bold text-2xl text-slate-800 ${jetbrainsMono.className}`}
          >
            {avgProjectsPerYear}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
